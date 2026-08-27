'use client';

import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '@/types';
import { Trash2, Edit, CalendarDays, Clock, MapPin, Users, Cake, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { updateLeadStatus, deleteLead } from '@/actions/leads'; // Adjust path if needed
import LeadModal from './LeadModal'; 

const STATUS_LABELS: Record<LeadStatus, string> = {
  pending: 'ממתינים',
  approved: 'אושרו',
  rescheduled: 'תיאום מחדש',
  completed: 'הסתיימו',
  cancelled: 'בוטלו'
};

interface LeadCardProps {
  event: Lead;
  removeLeadLocally: (id: string) => void;
}

export default function LeadCard({ event, removeLeadLocally }: LeadCardProps) {
  // Local state for Optimistic UI updates
  const [localLead, setLocalLead] = useState<Lead>(event);
  
  // Keep local state in sync if parent data changes
  useEffect(() => {
    setLocalLead(event);
  }, [event]);

  // UI Control states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle quick status transfer via the dropdown menu
  const handleLeadTransfer = async (to: LeadStatus) => {
    setIsMenuOpen(false); 
    removeLeadLocally(localLead.id); // Instantly remove from current tab UI
    
    const result = await updateLeadStatus(localLead.id, to);
    if (!result.success) {
      console.error(`Failed to update lead status to ${to}`);
    }
  };

  // Statuses available for transfer (excluding the current one)
  const availableStatuses = (Object.keys(STATUS_LABELS) as LeadStatus[]).filter(
    (status) => status !== localLead.status
  );
  
  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow duration-300 relative"
        dir="rtl"
      >
        <div className="p-4 md:p-5 flex flex-col gap-4 flex-1">
          {/* Card Header: Name and Contact */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-black text-[#1e293b] leading-tight">
                {localLead.name}
              </h2>
              <p className="text-sm md:text-base font-medium text-gray-500 mt-1" dir="ltr text-right">
                {localLead.phone}
              </p>
            </div>
            
            {/* Date & Time Badge */}
            <div className="text-left bg-orange-50 border border-orange-100 rounded-xl p-2 min-w-[90px]">
              <div className="flex items-center justify-end gap-1.5 text-orange-600 font-bold mb-1 text-sm md:text-base">
                <span>
                  {new Date(localLead.date).toLocaleDateString('he-IL')}
                </span>
                <CalendarDays size={16} />
              </div>
              <div className="flex items-center justify-end gap-1.5 text-gray-600 text-xs md:text-sm">
                <span>
                  {localLead.time ? localLead.time.slice(0, 5) : ''}
                </span>
                <Clock size={14} />
              </div>
            </div>
          </div>

          {/* Card Body: Details with Icons */}
          <div className="text-sm md:text-base text-gray-700 bg-gray-50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-100">
            <div className="flex items-start gap-2">
              <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />
              <p><span className="font-bold text-gray-900">מיקום:</span> {localLead.location}</p>
            </div>
            
            <div className="flex items-start gap-2">
              <Users className="text-gray-400 shrink-0 mt-0.5" size={16} />
              <p>
                <span className="font-bold text-gray-900">סועדים:</span> {localLead.adults_count} מבוגרים 
                {localLead.kids_count > 0 && <span className="text-gray-500 text-sm"> (+{localLead.kids_count} ילדים)</span>}
              </p>
            </div>

            <div className="flex items-start gap-2 md:col-span-2">
              <Cake className={`shrink-0 mt-0.5 ${localLead.desserts_included ? 'text-orange-500' : 'text-gray-300'}`} size={16} />
              <p>
                <span className="font-bold text-gray-900">קינוחים:</span> 
                <span className={localLead.desserts_included ? 'text-orange-600 font-semibold mx-1' : 'text-gray-500 mx-1'}>
                  {localLead.desserts_included ? 'כלול בהזמנה' : 'ללא'}
                </span>
              </p>
            </div>
          </div>

          {/* Client Notes Section */}
          {localLead.notes && (
            <div className="text-sm text-gray-600 bg-orange-50/50 p-3 rounded-lg border-l-2 border-orange-300">
              <span className="font-bold block mb-1">הערות לקוח:</span>
              {localLead.notes}
            </div>
          )}
        </div>

        {/* Action Buttons Container */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col gap-2 mt-auto rounded-b-2xl">
          
          <div className="relative w-full">
            {/* Floating Dropdown Menu (Drops UPWARDS to avoid grid overlapping) */}
            {isMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-xl p-1 z-50 flex flex-col">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleLeadTransfer(status)}
                    className="w-full text-right px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            )}

            <button 
              className="w-full bg-[#1e293b] text-white py-3 px-4 rounded-xl text-base font-bold hover:bg-black transition-colors flex items-center justify-between shadow-sm shadow-gray-400/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="flex items-center gap-2">
                <Send size={18} /> 
                <span>העבר אל...</span>
              </div>
              {isMenuOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>
          
          <div className="flex gap-2 w-full">
            {/* Opens the LeadModal for deep editing */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={16} className="text-gray-500" /> עריכה
            </button>
            
            <button 
              className="bg-white border border-red-200 text-red-600 py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center"
              onClick={() => {
                if (confirm('האם אתה בטוח שברצונך למחוק את הליד הזה? פעולה זו אינה ניתנת לביטול.')) {
                  removeLeadLocally(localLead.id); // Remove immediately from UI
                  deleteLead(localLead.id);        // Delete from server
                }
              }}
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline sm:mr-2">מחק</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        Mount the Modal Component.
        We pass callbacks to let the modal control the LeadCard's local state and UI behavior.
      */}
      <LeadModal 
        lead={localLead} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        // Fired when the user saves edits - updates the card text instantly
        onLeadUpdate={(updatedLead) => setLocalLead(updatedLead)} 
        // Fired when the user changes status - removes the card from the current tab instantly
        onStatusChange={(newStatus) => {
          setIsModalOpen(false);
          removeLeadLocally(localLead.id); 
        }}
      />
    </>
  );
}