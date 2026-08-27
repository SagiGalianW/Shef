import { autoCompletePastEvents, getLeadsByStatus } from "../../actions/leads";
import { createClient } from '@/utils/supabase/server';
import { LeadStatus } from "../../types";
import TabsNav from "../../components/admin/TabsNav";
import LeadsList from "../../components/admin/LeadsList";
import Header from "@/components/admin/Header";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  
  // Resolve searchParams promise for Next.js 15 compatibility
  const resolvedParams = await searchParams;
  const activeTab = (resolvedParams.tab as LeadStatus) || "pending";
  
  const supabase = await createClient();
  const todayObj = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
  const todayString = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
  
  // Automation for transferring approved leads to completed if their date has passed
  // activeTab == completed is for edge cases where the admin is currently viewing the completed tab and we want to ensure that any approved leads that have passed are moved to completed
  if (activeTab === 'approved' || activeTab === 'completed') {
    await autoCompletePastEvents();
  }

  // Fetch leads securely on the server side
  const leads = await getLeadsByStatus(activeTab);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      {/* Top Navigation / App Bar */}
      <Header />

      <TabsNav />
      
      <div className="flex-1 p-4">
        {/* 
          Passing 'activeTab' as a key forces React to completely unmount and remount 
          the component when the tab changes, ensuring the useState gets fresh initialLeads.
        */}
        <LeadsList key={activeTab} initialLeads={leads} />
      </div>
    </main>
  );
}