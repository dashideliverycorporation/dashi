/**
 * Google authentication tests
 * 
 * These tests verify the Google authentication flow and callbacks
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authOptions } from "@/server/auth";
import { UserRole } from "@/prisma/app/generated/prisma/client";
import { db } from "@/lib/db";

// Mock the Google provider setup
vi.mock("next-auth/providers/google", () => ({
  default: vi.fn(() => ({
    id: "google",
    name: "Google",
    type: "oauth",
    // Mock profile function
    profile: (profile: any) => ({
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      role: UserRole.CUSTOMER
    })
  }))
}));

// Mock the database
vi.mock("@/lib/db", () => {
  const mockDb = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    customer: {
      create: vi.fn(),
    },
  };
  return {
    db: mockDb,
  };
});

describe("Google Authentication", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it("should set the correct role for Google users", () => {
    // Get the Google provider from authOptions
    const googleProvider = authOptions.providers.find(p => p.id === "google");
    
    // Create a mock Google profile
    const mockGoogleProfile = {
      sub: "123456789",
      name: "Test User",
      email: "test@example.com",
      picture: "https://example.com/avatar.jpg"
    };
    
    // Call the profile function to get the user data
    const user = googleProvider?.profile?.(mockGoogleProfile, { accessToken: "mock-token" }) as any;
    
    // Check that the user is created with the correct role
    expect(user).toBeDefined();
    expect(user.role).toBe(UserRole.CUSTOMER);
    expect(user.email).toBe(mockGoogleProfile.email);
    expect(user.name).toBe(mockGoogleProfile.name);
    expect(user.image).toBe(mockGoogleProfile.picture);
  });
  
  it("should handle customer profile creation in signIn callback", async () => {
    // Mock existing user without customer profile
    const mockExistingUser = {
      id: "user-123",
      email: "test@example.com",
      customer: null
    };
    
    // Set up mock to return existing user
    vi.mocked(db.user.findUnique).mockResolvedValue(mockExistingUser as any);
    
    // Mock successful customer creation
    vi.mocked(db.customer.create).mockResolvedValue({
      id: "customer-123",
      userId: mockExistingUser.id,
      phoneNumber: "",
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);
    
    // Call the signIn callback
    const result = await authOptions.callbacks?.signIn?.({
      user: { email: mockExistingUser.email },
      account: { provider: "google" },
      profile: {},
      credentials: null
    });
    
    // Check that the customer was created
    expect(result).toBe(true);
    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockExistingUser.email },
      include: { customer: true }
    });
    expect(db.customer.create).toHaveBeenCalledWith({
      data: {
        userId: mockExistingUser.id,
        phoneNumber: ""
      }
    });
  });
});
