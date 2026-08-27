import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// 1. Define the authorized emails here (The "Guest List")
// REPLACE THIS with your actual Gmail address / the Chef's Gmail
const allowedEmailsString = process.env.ADMIN_EMAILS || '';
const ALLOWED_EMAILS = allowedEmailsString.split(',').map(email => email.trim());

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Initialize the Supabase client for the Edge Runtime (Middleware)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Fetch the current logged-in user securely from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define which paths require protection (e.g., the root '/' and any '/admin' routes)
  const isProtectedRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/admin');

  // 4. Enforce Authorization on protected routes
  if (isProtectedRoute) {
    // If no user is logged in, kick them to the login page
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If a user is logged in, but their email is NOT in our allowed list
    if (user.email && !ALLOWED_EMAILS.includes(user.email)) {
      // You can redirect them to a custom "Access Denied" page, or back to login with an error message
      return NextResponse.redirect(new URL('/login?error=UnauthorizedAccess', request.url));
    }
  }

  // 5. If an authorized user tries to visit the login page, redirect them to the dashboard
  if (request.nextUrl.pathname === '/login' && user && user.email && ALLOWED_EMAILS.includes(user.email)) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 6. If an authorized user tries to visit the root page, redirect them to the dashboard
  if (request.nextUrl.pathname === '/' && user && user.email && ALLOWED_EMAILS.includes(user.email)) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return supabaseResponse;
}

// 6. Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (the OAuth callback route we created)
     * - API routes or public assets like images (svg, png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};