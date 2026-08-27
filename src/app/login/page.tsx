'use client';

import { useState } from 'react';
// אנחנו משתמשים בפונקציה המיוחדת לדפדפן (Browser Client)
import { createBrowserClient } from '@supabase/ssr'; 
import { ChefHat, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error logging in:', error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Top Banner Color */}
        <div className="h-3 w-full bg-gradient-to-l from-orange-400 to-orange-600" />
        
        <div className="p-8 flex flex-col items-center text-center">
          {/* Logo / Icon */}
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <ChefHat size={40} className="text-orange-600" />
          </div>
          
          <h1 className="text-3xl font-black text-[#1e293b] mb-2">
            ברוך שובך, שף!
          </h1>
          <p className="text-gray-500 font-medium mb-10">
            התחבר כדי לנהל את האירועים והלידים שלך
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full relative flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3.5 px-4 rounded-xl text-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-gray-500" size={24} />
            ) : (
              <>
                {/* Google SVG Icon */}
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <span>התחברות עם Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}