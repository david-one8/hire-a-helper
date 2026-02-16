export { default } from 'next-auth/middleware'

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
