import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)"],
  matcher: ['/dashboard/:path*'],
};