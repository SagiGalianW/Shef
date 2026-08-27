// Define the exact statuses our system supports
export type LeadStatus = 'pending' | 'approved' | 'rescheduled' | 'completed' | 'cancelled';

// Define the structure of a single lead
export interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  adults_count: number;
  kids_count: number;
  desserts_included: boolean;
  notes: string | null;
  status: LeadStatus;
}