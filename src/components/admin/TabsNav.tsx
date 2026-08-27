'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
// שים לב לוודא שהנתיב לטיפוסים נכון עבור הקובץ שלך
import { LeadStatus } from '../../types';

const TABS: { id: LeadStatus; label: string }[] = [
  { id: 'pending', label: 'ממתינים' },
  { id: 'approved', label: 'אושרו' },
  { id: 'rescheduled', label: 'תיאום מחדש' },
  { id: 'completed', label: 'הסתיימו' },
  { id: 'cancelled', label: 'בוטלו' }
];

export default function TabsNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pending';

  return (
    <nav className="bg-white px-2 md:px-4 pt-2 shadow-sm overflow-x-auto" dir="rtl">
      {/* 
        The parent ul needs flex and w-full. 
        We add a subtle gray bottom border here instead of on the nav 
        so the orange indicator can overlap it perfectly.
      */}
      <ul className="flex w-full relative border-b border-gray-200 min-w-[400px]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <Link
                href={`/admin?tab=${tab.id}`}
                prefetch={false}
                className={`relative block text-center pb-3 px-2 text-sm md:text-base font-bold transition-colors ${
                  isActive
                    ? 'text-[#1e293b]' // Black/Slate color for active text
                    : 'text-gray-500 hover:text-[#1e293b] hover:bg-gray-50'
                }`}
              >
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                
                {/* Sliding Orange Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-orange-500 rounded-t-md z-20"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}