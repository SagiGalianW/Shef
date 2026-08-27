import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // 1. Extract the auth code Google appended to the URL
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // The route to redirect the chef to after a successful login (Dashboard Home)
  const next = '/admin';

  if (code) {
    // Next.js 15 requires awaiting the cookies() function
    const cookieStore = await cookies(); 
    
    // 2. Create a Supabase client configured to handle server-side cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // We can safely ignore set errors here because this is a 
              // Server Route Handler, and Supabase handles it properly.
            }
          },
        },
      }
    );

    // 3. Exchange the Google code for a secure Session (writes the auth cookie)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 4. Authentication successful! Redirect the user to the main page
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Auth error:', error.message);
    }
  }

  // If we reach this point, the authentication failed 
  // (either no code was provided, or Supabase rejected the code).
  // We redirect the user back to the login page with an error parameter.
  return NextResponse.redirect(`${origin}/login?error=CouldNotAuthenticate`);
}