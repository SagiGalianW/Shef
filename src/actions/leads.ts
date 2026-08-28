'use server';

import { revalidatePath } from 'next/cache';

// NOTE: We will need to update this Zod schema next to include the new fields!
import { BookingFormData } from '../schema/booking';
import { createClient } from '../utils/supabase/server'; 
import { Lead, LeadStatus } from '../types';

/*
  GET
*/

// Fetch leads based on their current status and order them by date
export async function getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
  // Initialize the secure client for this specific request
  const supabase = await createClient();

  // select('*') automatically fetches our newly added logistics and serving style columns
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', status)
    .order('date', { ascending: true });

  if (error) {
    // Log the error on the server for debugging
    console.error('Error fetching leads from Supabase:', error.message);
    throw new Error('Failed to fetch leads data');
  }

  return data as Lead[];
}

/*
  PUT
*/

// Server Action to update the full details of an existing lead (including the new fields)
export async function updateLeadDetails(leadId: string, updatedData: Partial<Lead>) {
  try {
    const supabase = await createClient();

    // Remove fields we don't want to accidentally update (like id, created_at, status)
    // The rest of the fields (including city, street, property_type, etc.) are dynamically extracted
    const { id, created_at, status, ...safeDataToUpdate } = updatedData as any;

    const { error } = await supabase
      .from('leads')
      .update(safeDataToUpdate)
      .eq('id', leadId);

    if (error) {
      console.error('Supabase Update Error:', error.message);
      throw new Error('Failed to update lead details');
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Server Action Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Server Action to insert a new lead from the client booking form
export async function createNewLead(data: BookingFormData) {
  try {
    // Initialize the secure client
    const supabase = await createClient();
    
    // The data object will now contain our new fields once BookingFormData is updated
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          ...data,
          status: 'pending', // All new requests start as pending
        }
      ]);

    if (error) {
      console.error('Supabase Insert Error:', error.message);
      throw new Error('Failed to insert new lead');
    }

    // Optionally revalidate paths so the admin dashboard updates immediately
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Server Action Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Server Action to update the status of an existing lead
export async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
  try {
    // Initialize the secure client
    const supabase = await createClient();

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (error) {
      console.error('Supabase Update Error:', error.message);
      throw new Error(`Failed to update lead status to ${newStatus}`);
    }

    // Refresh the admin UI automatically after a successful update
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error('Server Action Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Server Action to automatically move past 'approved' events to 'completed'
export async function autoCompletePastEvents() {
  try {
    const supabase = await createClient();
    
    // Calculate today's date in Israel time
    const todayObj = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    const todayString = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

    const { error } = await supabase
      .from('leads')
      .update({ status: 'completed' })
      .eq('status', 'approved')
      .lt('date', todayString);

    if (error) {
      console.error('Failed to auto-complete past events:', error.message);
    }
  } catch (error) {
    console.error('Automation Error:', error);
  }
}

/*
  DELETE
*/

// Server Action to delete an existing lead by its ID
export async function deleteLead(leadId: string) {
  try {
    // Initialize the secure client for this specific request
    const supabase = await createClient();

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      console.error('Supabase Delete Error:', error.message);
      throw new Error('Failed to delete lead');
    }

    // Refresh the admin UI and calendar automatically after a successful deletion
    revalidatePath('/admin');
    revalidatePath('/admin/calendar');

    return { success: true };
  } catch (error: any) {
    console.error('Server Action Error:', error.message);
    return { success: false, error: error.message };
  }
}