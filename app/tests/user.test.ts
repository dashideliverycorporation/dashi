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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Test successful user creation with complete data
  it("should successfully create a restaurant user with complete data", async () => {
    // Create test data with proper CUID format for restaurantId
    // Using a mocked but valid-format CUID
    const testData = {
      ...validUserData.complete,
      restaurantId: "clh5bqq0f0000ju0dawau5qqd", // Valid CUID format
    };

    // Setup the mocks for successful user creation flow
    // 1. Restaurant exists check
    setupRestaurantExists({
      ...dbResponses.restaurant.create,
      id: testData.restaurantId,
    });

    // 2. No existing user with the same email
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    // 3. Transaction succeeds and returns user and restaurantManager
    setupSuccessfulTransaction(dbResponses.user.create, {
      ...dbResponses.restaurantManager.create,
      restaurantId: testData.restaurantId,
    });

    // Call the procedure with complete user data with valid CUID format
    const result = await caller.createRestaurantUser(testData);

    // Verify restaurant existence check was called with correct ID
    expect(prisma.restaurant.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.restaurant.findUnique).toHaveBeenCalledWith({
      where: { id: testData.restaurantId },
    });

    // Verify email uniqueness check was called with correct email
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: testData.email },
    });

    // Verify transaction was used
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);

    // Verify the response structure and content
    expect(result).toEqual({
      status: "success",
      message: "Restaurant user created successfully",
      data: {
        id: dbResponses.user.create.id,
        email: dbResponses.user.create.email,
        name: dbResponses.user.create.name,
        role: dbResponses.user.create.role,
        restaurantId: testData.restaurantId, // Use the testData restaurantId
      },
    });
  });

  // Test successful user creation with minimal required data
  it("should successfully create a restaurant user with minimal data", async () => {
    // Create test data with only required fields and proper CUID format for restaurantId
    const testData = {
      ...validUserData.minimal,
      restaurantId: "clh5bqq0f0000ju0dawau5qqd", // Valid CUID format
    };

    // Setup the mocks for successful user creation flow
    setupRestaurantExists({
      ...dbResponses.restaurant.create,
      id: testData.restaurantId,
    });

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    // Setup transaction with minimal user data
    setupSuccessfulTransaction(
      {
        ...dbResponses.user.create,
        name: testData.name,
        email: testData.email,
        password: `hashed_${testData.password}`, // Add the password field
      },
      {
        ...dbResponses.restaurantManager.create,
        restaurantId: testData.restaurantId,
      }
    );

    // Call the procedure with minimal user data
    const result = await caller.createRestaurantUser(testData);

    // Verify restaurant existence check was called
    expect(prisma.restaurant.findUnique).toHaveBeenCalledTimes(1);

    // Verify email uniqueness check was called
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);

    // Verify transaction was used
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);

    // Verify the response structure and content
    expect(result).toEqual({
      status: "success",
      message: "Restaurant user created successfully",
      data: expect.objectContaining({
        email: testData.email,
        name: testData.name,
        restaurantId: testData.restaurantId,
      }),
    });
  });

  // Test error handling when database operations fail
  it("should handle database errors during user creation", async () => {
    // Create test data with valid CUID format
    const testData = {
      ...validUserData.complete,
      restaurantId: "clh5bqq0f0000ju0dawau5qqd", // Valid CUID format
    };

    // Setup mocks
    // 1. Restaurant exists check succeeds
    setupRestaurantExists({
      ...dbResponses.restaurant.create,
      id: testData.restaurantId,
    });

    // 2. No existing user with the same email
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    // 3. Transaction fails with database error
    const dbError = new Error("Database connection error");
    setupFailedTransaction(dbError);

    // Call the procedure and expect it to throw a TRPC error
    await expect(caller.createRestaurantUser(testData)).rejects.toThrow(
      TRPCError
    );
    await expect(caller.createRestaurantUser(testData)).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create restaurant user",
    });

    // Verify that transaction was attempted
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
  });

  // Test validation for restaurant association
  it("should reject creation when restaurant does not exist", async () => {
    // Create test data with valid CUID format but non-existent restaurant
    const testData = {
      ...validUserData.complete,
      restaurantId: "clh5bqq0f0000ju0dawau5qqd", // Valid CUID format
    };

    // Setup mock to return null for restaurant lookup
    setupRestaurantNotFound();

    // Call the procedure and expect it to throw a TRPC error
    await expect(caller.createRestaurantUser(testData)).rejects.toThrow(
      TRPCError
    );
    await expect(caller.createRestaurantUser(testData)).rejects.toMatchObject({
      code: "NOT_FOUND",
      message: "Restaurant not found",
    });

    // Verify restaurant existence check was called with correct ID
    expect(prisma.restaurant.findUnique).toHaveBeenCalledTimes(2);
    expect(prisma.restaurant.findUnique).toHaveBeenCalledWith({
      where: { id: testData.restaurantId },
    });

    // Verify that no transaction was attempted
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  // Test validation for email uniqueness
  it("should reject creation when email is already in use", async () => {
    // Create test data with valid CUID format
    const testData = {
      ...validUserData.complete,
      restaurantId: "clh5bqq0f0000ju0dawau5qqd", // Valid CUID format
    };

    // Setup mocks
    // 1. Restaurant exists check succeeds
    setupRestaurantExists({
      ...dbResponses.restaurant.create,
      id: testData.restaurantId,
    });

    // 2. Existing user with the same email
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...dbResponses.user.create,
      email: testData.email,
      password: `hashed_${testData.password}`, // Use the hashed_password format consistent with our mock
    });

    // Call the procedure and expect it to throw a TRPC error
    await expect(caller.createRestaurantUser(testData)).rejects.toThrow(
      TRPCError
    );
    await expect(caller.createRestaurantUser(testData)).rejects.toMatchObject({
      code: "CONFLICT",
      message: "Email already in use",
    });

    // Verify email uniqueness check was called with correct email
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: testData.email },
    });

    // Verify that no transaction was attempted
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  // Test Zod validation for required fields
  it("should reject creation when required fields are missing", async () => {
    // Try to create a user with missing email
    const testDataMissingEmail = {
      name: "Test User",
      password: "Password123",
      restaurantId: "clh5bqq0f0000ju0dawau5qqd",
    };

    // Call the procedure and expect it to throw a validation error
    await expect(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      caller.createRestaurantUser(testDataMissingEmail as any)
    ).rejects.toThrow();

    // Try to create a user with missing password
    const testDataMissingPassword = {
      name: "Test User",
      email: "test@example.com",
      restaurantId: "clh5bqq0f0000ju0dawau5qqd",
    };

    // Call the procedure and expect it to throw a validation error
    await expect(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      caller.createRestaurantUser(testDataMissingPassword as any)
    ).rejects.toThrow();

    // Verify no database calls were made (validation happens before db access)
    expect(prisma.restaurant.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  // Test Zod validation for field constraints
  it("should reject creation when field constraints are violated", async () => {
    // Email format validation
    const testDataInvalidEmail = {
      ...validUserData.complete,
      email: "invalid-email",
      restaurantId: "clh5bqq0f0000ju0dawau5qqd",
    };

    await expect(
      caller.createRestaurantUser(testDataInvalidEmail)
    ).rejects.toThrow();

    // Password length validation
    const testDataShortPassword = {
      ...validUserData.complete,
      password: "short",
      restaurantId: "clh5bqq0f0000ju0dawau5qqd",
    };

    await expect(
      caller.createRestaurantUser(testDataShortPassword)
    ).rejects.toThrow();

    // Name length validation
    const testDataShortName = {
      ...validUserData.complete,
      name: "A", // Too short (min 2 chars)
      restaurantId: "clh5bqq0f0000ju0dawau5qqd",
    };

    await expect(
      caller.createRestaurantUser(testDataShortName)
    ).rejects.toThrow();

    // Verify no database calls were made (validation happens before db access)
    expect(prisma.restaurant.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
