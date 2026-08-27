import { autoCompletePastEvents } from '@/actions/leads';
import Header from '@/components/admin/Header';
import CalendarView from '@/components/admin/CalendarView';
import { createClient } from '@/utils/supabase/server'; 
import { Lead } from '@/types';

export default async function CalendarPage() {
  await autoCompletePastEvents();
  
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching calendar events:', error.message);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <Header />
      
      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#1e293b] mb-2">יומן אירועים</h1>
          <p className="text-gray-500">תצוגה חודשית של כל האירועים המאושרים ואלו שבהמתנה.</p>
        </div>

        <CalendarView leads={(leads as Lead[]) || []} />
      </div>
    </main>
  );
}