import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { log } from 'console'

// Routes that don't require authentication
const PUBLIC_FILE = /\.(.*)$/
const PUBLIC_ROUTES = [
  '/signin',
  '/signup',
  '/api/auth',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  // Allow public routes (exact or prefix)
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    return NextResponse.next()
  }

  // Check the token (uses NEXTAUTH_SECRET)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  console.log(token, 'middleware token')

  if (!token) {
    // Redirect to signin if not authenticated
    const signInUrl = new URL('/signin', req.nextUrl.origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
