// Define the exact statuses our system supports
export type LeadStatus = 'pending' | 'approved' | 'rescheduled' | 'completed' | 'cancelled';

// Define the structure of a single lead
// export interface Lead {
//   id: string;
//   created_at: string;
//   name: string;
//   phone: string;
//   date: string;
//   time: string;
//   location: string;
//   adults_count: number;
//   kids_count: number;
//   desserts_included: boolean;
//   notes: string | null;
//   status: LeadStatus;
// }


export interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  
  city: string;
  street: string;
  house_number: string;
  property_type: 'house' | 'apartment';
  floor?: string; // relevant only for apartments
  
  adults_count: number;
  kids_count: number;
  
  serving_style: 'buffet' | 'center';
  desserts_included: boolean;
  
  notes?: string;
  status: LeadStatus;
}