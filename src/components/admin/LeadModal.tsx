'use client';

import { useState, useTransition, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, Users, Cake, FileText, 
  CheckCircle, XCircle, Loader2, CheckCheck, RefreshCcw, ArrowLeft,
  Pencil, Save
} from 'lucide-react';
import { Lead, LeadStatus } from '@/types';
import { updateLeadStatus, updateLeadDetails } from '@/actions/leads'; // Adjust path if needed

interface LeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  // Optional callbacks to update the parent component (LeadCard) in real-time
  onLeadUpdate?: (updatedLead: Lead) => void;
  onStatusChange?: (newStatus: LeadStatus) => void;
}

// Map statuses to their Hebrew display names
const STATUS_LABELS: Record<LeadStatus, string> = {
  pending: 'ממתין לאישור',
  approved: 'מאושר',
  rescheduled: 'תיאום מחדש',
  completed: 'הסתיים',
  cancelled: 'בוטל'
};

export default function LeadModal({ 
  lead, 
  isOpen, 
  onClose, 
  onLeadUpdate, 
  onStatusChange 
}: LeadModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Status change state
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | ''>('');
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  // Reset modal state every time it opens with a new lead
  useEffect(() => {
    if (isOpen && lead) {
      setSelectedStatus('');
      setError(null);
      setIsEditing(false);
      setFormData(lead); // Populate initial data for editing
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  // Filter out the current status so the user only sees the other 4 options
  const availableStatuses = (['pending', 'approved', 'rescheduled', 'completed', 'cancelled'] as LeadStatus[])
    .filter(status => status !== lead.status);

  // Handle status change from the bottom dropdown (View Mode)
  const handleStatusChange = (newStatus: LeadStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await updateLeadStatus(lead.id, newStatus);
      if (!result.success) {
        setError(result.error || 'Failed to update status');
      } else {
        if (onStatusChange) onStatusChange(newStatus); // Notify parent to remove card immediately
        onClose(); // Close modal
      }
    });
  };

  // Handle saving full lead details (Edit Mode)
  const handleSaveChanges = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateLeadDetails(lead.id, formData);
      if (!result.success) {
        setError(result.error || 'Failed to save changes');
      } else {
        if (onLeadUpdate) {
          // Notify parent with the merged updated data
          onLeadUpdate({ ...lead, ...formData } as Lead); 
        }
        setIsEditing(false);
        onClose(); // Close modal on success
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Dynamic Colors based on lead status */}
        <div className={`p-6 relative flex items-center justify-between border-b ${
          lead.status === 'approved' ? 'bg-green-50 border-green-100' : 
          lead.status === 'cancelled' ? 'bg-red-50 border-red-100' : 
          lead.status === 'completed' ? 'bg-blue-50 border-blue-100' : 
          lead.status === 'rescheduled' ? 'bg-purple-50 border-purple-100' : 
          'bg-orange-50 border-orange-100'
        }`}>
          <div>
            {isEditing ? (
              <input 
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="text-2xl font-black text-gray-900 mb-1 bg-white/50 border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <h2 className="text-2xl font-black text-gray-900 mb-1">{lead.name}</h2>
            )}
            
            <div className="flex items-center gap-2">
              {lead.status === 'approved' && <CheckCircle size={16} className="text-green-600" />}
              {lead.status === 'pending' && <Clock size={16} className="text-orange-600" />}
              {lead.status === 'cancelled' && <XCircle size={16} className="text-red-600" />}
              {lead.status === 'completed' && <CheckCheck size={16} className="text-blue-600" />}
              {lead.status === 'rescheduled' && <RefreshCcw size={16} className="text-purple-600" />}
              
              <span className={`text-sm font-bold ${
                lead.status === 'approved' ? 'text-green-700' : 
                lead.status === 'cancelled' ? 'text-red-700' : 
                lead.status === 'completed' ? 'text-blue-700' : 
                lead.status === 'rescheduled' ? 'text-purple-700' : 
                'text-orange-700'
              }`}>
                {STATUS_LABELS[lead.status]}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-600 hover:text-orange-600"
                title="Edit Details"
              >
                <Pencil size={20} />
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Calendar className="text-gray-400 mt-0.5" size={18} />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-bold mb-0.5">תאריך האירוע</p>
                {isEditing ? (
                  <input type="date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full text-sm bg-white border border-gray-200 rounded p-1 focus:ring-1 focus:ring-orange-500 outline-none" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{lead.date}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Clock className="text-gray-400 mt-0.5" size={18} />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-bold mb-0.5">שעה</p>
                {isEditing ? (
                  <input type="time" value={formData.time || ''} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full text-sm bg-white border border-gray-200 rounded p-1 focus:ring-1 focus:ring-orange-500 outline-none" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{lead.time?.slice(0,5)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <MapPin className="text-gray-400 mt-0.5 min-w-[18px]" size={18} />
            <div className="w-full">
              <p className="text-xs text-gray-500 font-bold mb-0.5">מיקום האירוע</p>
              {isEditing ? (
                <input type="text" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full text-sm bg-white border border-gray-200 rounded p-1 focus:ring-1 focus:ring-orange-500 outline-none" />
              ) : (
                <p className="text-sm font-medium text-gray-900">{lead.location}</p>
              )}
            </div>
          </div>

          {/* Guests & Desserts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Users className="text-gray-400 mt-0.5 min-w-[18px]" size={18} />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-bold mb-0.5">כמות סועדים</p>
                {isEditing ? (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs flex items-center gap-2">מבוגרים: <input type="number" min="0" value={formData.adults_count || 0} onChange={(e) => setFormData({...formData, adults_count: Number(e.target.value)})} className="w-16 bg-white border border-gray-200 rounded p-1 text-center outline-none focus:ring-1 focus:ring-orange-500" /></label>
                    <label className="text-xs flex items-center gap-2">ילדים: <input type="number" min="0" value={formData.kids_count || 0} onChange={(e) => setFormData({...formData, kids_count: Number(e.target.value)})} className="w-16 bg-white border border-gray-200 rounded p-1 text-center outline-none focus:ring-1 focus:ring-orange-500" /></label>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900">
                    {lead.adults_count} מבוגרים {lead.kids_count > 0 ? `+ ${lead.kids_count} ילדים` : ``}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Cake className="text-gray-400 mt-0.5" size={18} />
              <div>
                <p className="text-xs text-gray-500 font-bold mb-0.5">קינוחים</p>
                {isEditing ? (
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input type="checkbox" checked={formData.desserts_included || false} onChange={(e) => setFormData({...formData, desserts_included: e.target.checked})} className="w-4 h-4 text-orange-600 accent-orange-500 rounded focus:ring-orange-500" />
                    <span className="text-sm">כלול קינוחים</span>
                  </label>
                ) : (
                  <p className={`text-sm font-bold ${lead.desserts_included ? 'text-green-600' : 'text-gray-500'}`}>
                    {lead.desserts_included ? 'כלול קינוחים 🍰' : 'ללא קינוחים'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 p-3 border-b border-gray-100">
            <span className="text-gray-400 font-bold">📞</span>
            <div className="w-full">
              <p className="text-xs text-gray-500 font-bold mb-0.5">טלפון ליצירת קשר</p>
              {isEditing ? (
                <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full text-sm bg-gray-50 border border-gray-200 rounded p-1 focus:ring-1 focus:ring-orange-500 outline-none" dir="ltr" />
              ) : (
                <a href={`tel:${lead.phone}`} className="text-sm font-medium text-orange-600 hover:underline" dir="ltr">
                  {lead.phone}
                </a>
              )}
            </div>
          </div>

          {/* Notes */}
          {(lead.notes || isEditing) && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50/50 rounded-xl border border-yellow-100">
              <FileText className="text-yellow-600 mt-0.5 min-w-[18px]" size={18} />
              <div className="w-full">
                <p className="text-xs text-yellow-800 font-bold mb-1">הערות / בקשות מיוחדות</p>
                {isEditing ? (
                  <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full text-sm bg-white/50 border border-yellow-200 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none resize-none" placeholder="כתוב הערות כאן..." />
                ) : (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Footer (Edit Mode vs View Mode) */}
        {isEditing ? (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 items-center">
            <button 
              onClick={handleSaveChanges} 
              disabled={isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              שמור שינויים
            </button>
            <button 
              onClick={() => { setIsEditing(false); setFormData(lead); setError(null); }} 
              disabled={isPending}
              className="flex-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              ביטול
            </button>
          </div>
        ) : (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 items-center">
            <div className="w-full flex-1">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
                className="w-full bg-white border border-gray-200 text-gray-900 font-medium py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow appearance-none cursor-pointer"
              >
                <option value="" disabled>-- בחר לאן להעביר --</option>
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                if (selectedStatus) handleStatusChange(selectedStatus as LeadStatus);
              }}
              disabled={isPending || !selectedStatus}
              className="w-full sm:w-auto bg-[#1e293b] hover:bg-black text-white py-3 px-6 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="animate-spin" size={18} /> : <ArrowLeft size={18} />}
              העבר אירוע
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}