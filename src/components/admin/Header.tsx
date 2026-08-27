'use client';

import { useTransition } from 'react';
import { Settings, CalendarSearch, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/actions/auth'; // ודא שהנתיב תואם למיקום הפונקציה אצלך

export default function Header() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* System Title */}
        <Link href="/admin">
          <h1 className="text-xl md:text-2xl font-black text-[#1e293b]">
            מערכת ניהול לשף
          </h1>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            disabled={isPending}
            className="p-2 md:px-4 md:py-2 text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200 flex items-center gap-2 disabled:opacity-50"
            title="התנתק"
          >
            {isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <LogOut size={20} />
            )}
            <span className="hidden sm:inline font-bold text-sm">התנתק</span>
          </button>

          {/* Calendar Button */}
          <Link href="/admin/calendar">
            <button 
              className="p-2 md:px-4 md:py-2 text-gray-600 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors border border-transparent hover:border-orange-200 flex items-center gap-2"
            >
              <CalendarSearch size={20} />
              <span className="hidden sm:inline font-bold text-sm">לוח שנה</span>
            </button>
          </Link>

          {/* Settings Button */}
          <button 
            className="p-2 md:px-4 md:py-2 text-gray-600 hover:text-[#1e293b] bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-gray-200 flex items-center gap-2"
            title="הגדרות מערכת"
          >
            <Settings size={20} />
            <span className="hidden sm:inline font-bold text-sm">הגדרות</span>
          </button>
          
        </div>
      </div>
    </header>
  );
}