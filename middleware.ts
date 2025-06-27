/**
 * Middleware to protect routes based on authentication and roles
 *
 * This middleware:
 * 1. Redirects authenticated users with specific roles to their dashboards when visiting the root path
 * 2. Checks user authentication for protected routes
 * 3. Verifies role-based access for admin and restaurant routes
 * 4. Redirects unauthorized users to appropriate pages
 */
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const authRequiredPaths = ["/admin", "/restaurant"];

// Routes that require admin role
const adminRequiredPaths = ["/admin"];

// Routes that require restaurant role
const restaurantRequiredPaths = ["/restaurant"];

/**
 * Middleware function to protect routes
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle root path redirection for restaurant and admin users
  if (pathname === "/") {
    // Get the user token from the session
    const token = await getToken({ req });
    
    // If user is authenticated and has restaurant role, redirect to restaurant dashboard
    if (token && token.role === "RESTAURANT") {
      return NextResponse.redirect(new URL("/restaurant", req.url));
    }
    
    // If user is authenticated and has admin role, redirect to admin dashboard
    if (token && token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Check if the route needs authentication, admin, or restaurant permission
  const needsAuth = authRequiredPaths.some((path) => pathname.startsWith(path));
  const needsAdmin = adminRequiredPaths.some((path) =>
    pathname.startsWith(path)
  );
  const needsRestaurant = restaurantRequiredPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (needsAuth) {
    // Get the user token from the session
    const token = await getToken({ req });

    // If not authenticated, redirect to signin page with callback
    if (!token) {
      const url = new URL("/signin", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // If route requires admin role, check user role
    if (needsAdmin && token.role !== "ADMIN") {
      // Create a new URL for the denied page
      const deniedUrl = new URL("/denied", req.url);
      return NextResponse.redirect(deniedUrl);
    }

    // If route requires restaurant role, check user role
    if (needsRestaurant && token.role !== "RESTAURANT") {
      // Create a new URL for the denied page
      const deniedUrl = new URL("/denied-restaurant", req.url);
      return NextResponse.redirect(deniedUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Include the root path
    "/",
    // Apply to all routes in /admin and /restaurant
    "/admin/:path*",
    "/restaurant/:path*",
  ],
};
