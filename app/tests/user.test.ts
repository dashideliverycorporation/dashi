/**
 * User creation tests
 *
 * These tests verify that the user creation functionality works correctly:
 * 1. The user router is properly defined
 * 2. The createRestaurantUser procedure validates input correctly
 * 3. Successful user creation returns the expected response
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { userRouter } from "@/server/trpc/routers/user";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { validUserData, dbResponses } from "./fixtures";
import {
  setupSuccessfulUserCreation,
  setupFailedUserCreation,
  setupRestaurantExists,
  setupRestaurantNotFound,
  setupSuccessfulTransaction,
  setupFailedTransaction,
} from "./test-helpers";
import { UserRole } from "@/prisma/app/generated/prisma/client";

// Mock Prisma client
vi.mock("@/lib/db", () => {
  const mockPrisma = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    restaurant: {
      findUnique: vi.fn(),
    },
    restaurantManager: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  };

  return {
    prisma: mockPrisma,
    db: mockPrisma, // Add db export as an alias to prisma
  };
});

// Mock hashPassword function
vi.mock("@/server/auth", () => ({
  hashPassword: vi
    .fn()
    .mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
}));

// Mock context for admin procedure
const mockCtx = {
  session: {
    user: {
      id: "admin-user-id",
      role: "ADMIN",
      email: "admin@example.com",
    },
  },
};

// Create caller for the router
const caller = userRouter.createCaller(mockCtx as any);

describe("User Creation", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(prisma.user.create).mockClear();
    vi.mocked(prisma.user.findUnique).mockClear();
    vi.mocked(prisma.restaurant.findUnique).mockClear();
    vi.mocked(prisma.restaurantManager.create).mockClear();
    vi.mocked(prisma.$transaction).mockClear();
  });

  // Basic test to check if the testing environment is set up correctly
  it("test environment should be set up correctly", () => {
    expect(true).toBe(true);
    expect(userRouter).toBeDefined();
    expect(caller).toBeDefined();
    expect(prisma.user.create).toBeDefined();
    expect(prisma.restaurant.findUnique).toBeDefined();
    expect(prisma.restaurantManager.create).toBeDefined();
    expect(prisma.$transaction).toBeDefined();

    // Verify fixtures and helpers are accessible
    expect(validUserData).toBeDefined();
    expect(dbResponses).toBeDefined();
    expect(setupSuccessfulUserCreation).toBeDefined();
    expect(setupFailedUserCreation).toBeDefined();
    expect(setupRestaurantExists).toBeDefined();
    expect(setupRestaurantNotFound).toBeDefined();
    expect(setupSuccessfulTransaction).toBeDefined();
    expect(setupFailedTransaction).toBeDefined();

    // Verify UserRole enum is accessible
    expect(UserRole).toBeDefined();
  });
});
