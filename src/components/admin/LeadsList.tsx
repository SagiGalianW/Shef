'use client';

import { useState } from 'react';
import { Lead } from '../../types';
import LeadCard from './LeadCard';

export default function LeadsList({ initialLeads }: { initialLeads: Lead[] }) {
  // Initialize local state with the server-fetched leads
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  // Optimistic UI approach: visually remove the lead immediately without waiting for server response
  const removeLeadLocally = (id: string) => {
    setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
  };

  if (leads.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        לא נמצאו ערכים בסטטוס הזה.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {leads.map((lead) => (
        <LeadCard 
          key={lead.id} 
          event={lead} 
          removeLeadLocally={removeLeadLocally} 
        />
      ))}
    </div>
  );
}