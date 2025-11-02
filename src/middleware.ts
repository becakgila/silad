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


  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/component') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }


  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const authPaths = new Set(['/admin/signin', '/signup']);


  if (authPaths.has(pathname)) {
    if (token) {
    
      console.log('Redirecting authenticated user from auth page to home');
      return NextResponse.redirect(new URL('/', req.url));
    }
  
    return NextResponse.next();
  }


  if (!token) {
    const signInUrl = new URL('/admin/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }


  if (pathname.startsWith('/users') && (token as any).level !== 'admin') {
  
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware for root and any page except Next internals, static files, favicons and api routes
  matcher: [
    '/',
    '/((?!_next|static|public|favicon.ico|api).*)',
    '/admin/signin',
    '/signup',    
  ],
};
