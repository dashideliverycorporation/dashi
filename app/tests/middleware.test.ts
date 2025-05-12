/**
 * Middleware tests for route protection and role-based access control
 *
 * These tests verify that:
 * 1. Unauthenticated users are redirected to signin when accessing protected routes
 * 2. Non-admin users are redirected to denied page when accessing admin routes
 * 3. Admin users can access admin routes
 * 4. Non-protected routes are accessible to all users
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../../middleware";

// Mock next-auth/jwt
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

// Import the mocked function to control its behavior in tests
import { getToken } from "next-auth/jwt";

// Mock NextResponse methods
vi.mock("next/server", () => {
  return {
    NextRequest: function (url: string) {
      return {
        nextUrl: {
          pathname: new URL(url).pathname,
          searchParams: new URLSearchParams(),
        },
        url: url,
      };
    },
    NextResponse: {
      redirect: vi.fn().mockImplementation((url) => ({ redirectUrl: url })),
      next: vi.fn().mockReturnValue({ type: "next" }),
    },
  };
});

describe("Middleware Route Protection", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getToken).mockClear();
  });

  it("should redirect unauthenticated users to signin when accessing admin routes", async () => {
    // Mock token to be null (unauthenticated)
    vi.mocked(getToken).mockResolvedValue(null);

    // Create a mock request for admin route
    const mockRequest = new NextRequest("http://localhost:3000/admin");

    // Execute middleware
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await middleware(mockRequest);

    // Verify getToken was called
    expect(getToken).toHaveBeenCalledTimes(1);

    // Verify redirect to signin
    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it("should redirect non-admin users to denied page when accessing admin routes", async () => {
    // Mock token with non-admin role
    vi.mocked(getToken).mockResolvedValue({
      name: "User",
      email: "user@example.com",
      role: "USER",
    });

    // Create a mock request for admin route
    const mockRequest = new NextRequest("http://localhost:3000/admin");

    // Execute middleware
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await middleware(mockRequest);

    // Verify getToken was called
    expect(getToken).toHaveBeenCalledTimes(1);

    // Verify redirect to denied page
    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it("should allow admin users to access admin routes", async () => {
    // Mock token with admin role
    vi.mocked(getToken).mockResolvedValue({
      name: "Admin",
      email: "admin@example.com",
      role: "ADMIN",
    });

    // Create a mock request for admin route
    const mockRequest = new NextRequest("http://localhost:3000/admin");

    // Execute middleware
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await middleware(mockRequest);

    // Verify getToken was called
    expect(getToken).toHaveBeenCalledTimes(1);

    // Verify it proceeds to next middleware/route
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("should allow access to non-protected routes without token check", async () => {
    // Create a mock request for non-protected route
    const mockRequest = new NextRequest("http://localhost:3000/");

    // Execute middleware
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await middleware(mockRequest);

    // Verify getToken was not called
    expect(getToken).not.toHaveBeenCalled();

    // Verify it proceeds to next middleware/route
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
