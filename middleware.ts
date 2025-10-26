import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware to protect application routes.
 * - Allows public paths (signin, signup, static files, API auth, _next)
 * - Redirects unauthenticated users to /signin (with a callbackUrl)
 * - Example role check: blocks non-admins from /users
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // let through Next.js internals and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/auth') // next-auth routes
  ) {
    return NextResponse.next();
  }

  // Public pages that don't require authentication
  const publicPaths = ['/signin', '/signup', '/login'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  

  // Get the token from next-auth (uses NEXTAUTH_SECRET)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not signed in -> redirect to sign in with callback
  if (!token) {
    const signInUrl = new URL('/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Example role-based restriction: only 'admin' can access /users routes
  // Adjust 'level' to match your user/session property (next-auth callbacks put it on session.user.level)
  if (pathname.startsWith('/users') && (token as any).level !== 'admin') {
    // You can redirect to a forbidden page or return 403
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

// Apply middleware to all routes except Next internals, API auth and public pages
export const config = {
  matcher: [
    '/', // explicitly protect root path
    '/((?!_next|static|public|favicon.ico|api/auth|signin|signup|login).*)', // protect all other non-public routes
  ],
};
