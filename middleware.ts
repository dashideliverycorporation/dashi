/**
 * Middleware to protect routes based on authentication and roles
 * 
 * This middleware:
 * 1. Checks user authentication for protected routes
 * 2. Verifies role-based access for admin routes
 * 3. Redirects unauthorized users to appropriate pages
 */
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const authRequiredPaths = ['/admin'];

// Routes that require admin role
const adminRequiredPaths = ['/admin'];

/**
 * Middleware function to protect routes
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if the route needs authentication or admin permission
  const needsAuth = authRequiredPaths.some(path => pathname.startsWith(path));
  const needsAdmin = adminRequiredPaths.some(path => pathname.startsWith(path));
  
  if (needsAuth) {
    // Get the user token from the session
    const token = await getToken({ req });
    
    // If not authenticated, redirect to signin page with callback
    if (!token) {
      const url = new URL('/signin', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    // If route requires admin role, check user role
    if (needsAdmin && token.role !== 'ADMIN') {
      // Create a new URL for the denied page
      const deniedUrl = new URL('/denied', req.url);
      return NextResponse.redirect(deniedUrl);
    }
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Apply to all routes in /admin
    '/admin/:path*',
  ],
};