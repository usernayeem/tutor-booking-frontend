import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes configuration
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // In a real app, this should verify the actual JWT token securely
    // For now, we check the dummy cookie set during login
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
    
    if (!isLoggedIn) {
      // Redirect to login if trying to access protected route without auth
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
