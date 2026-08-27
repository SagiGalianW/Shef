'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { Lead, LeadStatus } from '@/types';
import LeadModal from './LeadModal'; 

interface CalendarViewProps {
  leads: Lead[];
}

export default function CalendarView({ leads }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State חדש לניהול הסינון (ברירת מחדל: כולם דלוקים)
  const [activeFilters, setActiveFilters] = useState<Record<LeadStatus, boolean>>({
    approved: true,
    pending: true,
    rescheduled: true,
    completed: true,
    cancelled: true,
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
  
  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  const daysOfWeek = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));

  const days = Array.from({ length: daysInMonth + firstDayOfMonth }, (_, i) => {
    if (i < firstDayOfMonth) return null;
    return i - firstDayOfMonth + 1;
  });

  const handleEventClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // פונקציה שמדליקה/מכבה סטטוס מהסינון
  const toggleFilter = (status: LeadStatus) => {
    setActiveFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // מערך עזר לרינדור המקרא בצורה נקייה
  const STATUS_LEGEND: { id: LeadStatus; label: string; colorClass: string }[] = [
    { id: 'approved', label: 'מאושר', colorClass: 'bg-green-500' },
    { id: 'pending', label: 'ממתין', colorClass: 'bg-orange-500' },
    { id: 'rescheduled', label: 'תיאום מחדש', colorClass: 'bg-purple-500' },
    { id: 'completed', label: 'הסתיים', colorClass: 'bg-blue-500' },
    { id: 'cancelled', label: 'בוטל', colorClass: 'bg-red-400' },
  ];

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#1e293b]">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex gap-2">
              <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <ChevronRight size={20} className="text-gray-600" />
              </button>
              <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Interactive Status Legend (Filters) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-sm">
            <div className="pr-2 pl-1 border-l border-gray-200 text-gray-400">
              <Filter size={16} />
            </div>
            {STATUS_LEGEND.map((status) => {
              const isActive = activeFilters[status.id];
              return (
                <button
                  key={status.id}
                  onClick={() => toggleFilter(status.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-200 hover:bg-gray-50 ${
                    isActive ? 'opacity-100' : 'opacity-40 grayscale'
                  }`}
                  title={isActive ? 'לחץ כדי להסתיר' : 'לחץ כדי להציג'}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${status.colorClass}`}></span>
                  <span className={`text-xs font-bold ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {daysOfWeek.map(day => (
            <div key={day} className="py-3 text-center text-sm font-bold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="border-b border-l border-gray-100 bg-gray-50/30" />;
            }

            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // סינון הלידים גם לפי התאריך וגם לפי הסינון הפעיל!
            const dayEvents = leads.filter(lead => 
              lead.date === dateString && activeFilters[lead.status]
            );

            return (
              <div key={day} className="border-b border-l border-gray-100 p-2 hover:bg-gray-50 transition-colors relative group">
                <span className="text-sm font-bold text-gray-400 mb-1 inline-block group-hover:text-orange-600 transition-colors">{day}</span>
                
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dayEvents.map(event => {
                    const statusStyles = 
                      event.status === 'approved' ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' :
                      event.status === 'completed' ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' :
                      event.status === 'rescheduled' ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' :
                      event.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' :
                      'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100';

                    return (
                      <button 
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`text-right w-full text-xs p-1.5 rounded-lg border transition-colors ${statusStyles}`}
                      >
                        <div className="font-bold truncate">{event.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LeadModal 
        lead={selectedLead} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}