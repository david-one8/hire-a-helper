import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const token = await getToken({ req: request })

  // No session at all — redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Session exists but email not verified — redirect to OTP page
  if (token.emailVerified === false) {
    const verifyUrl = new URL('/verify-otp', request.url)
    verifyUrl.searchParams.set('email', token.email)
    return NextResponse.redirect(verifyUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/feed/:path*',
    '/my-tasks/:path*',
    '/requests/:path*',
    '/my-requests/:path*',
    '/add-task/:path*',
    '/settings/:path*',
  ],
}
