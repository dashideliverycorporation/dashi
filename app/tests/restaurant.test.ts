/**
 * Restaurant creation tests
 *
 * These tests verify that the restaurant creation functionality works correctly:
 * 1. The restaurant router is properly defined
 * 2. The createRestaurant procedure validates input correctly
 * 3. Successful restaurant creation returns the expected response
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { restaurantRouter } from "@/server/trpc/routers/restaurant";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { validRestaurantData, dbResponses } from "./fixtures";
import {
  setupSuccessfulRestaurantCreation,
  setupFailedRestaurantCreation,
} from "./test-helpers";

// Mock Prisma client
vi.mock("@/lib/db", () => {
  const mockPrisma = {
    restaurant: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  };

  return {
    prisma: mockPrisma,
    db: mockPrisma, // Add db export as an alias to prisma
  };
});

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
const caller = restaurantRouter.createCaller(mockCtx as any);

describe("Restaurant Creation", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(prisma.restaurant.create).mockClear();
    vi.mocked(prisma.restaurant.findMany).mockClear();
  });

  // Basic test to check if the testing environment is set up correctly
  it("test environment should be set up correctly", () => {
    expect(true).toBe(true);
    expect(restaurantRouter).toBeDefined();
    expect(caller).toBeDefined();
    expect(prisma.restaurant.create).toBeDefined();

    // Verify fixtures and helpers are accessible
    expect(validRestaurantData).toBeDefined();
    expect(setupSuccessfulRestaurantCreation).toBeDefined();
  });

  // Test successful restaurant creation with complete data
  it("should successfully create a restaurant with complete data", async () => {
    // Setup the mock to return a successful response
    setupSuccessfulRestaurantCreation(dbResponses.restaurant.create);

    // Call the procedure with complete restaurant data
    const result = await caller.createRestaurant(validRestaurantData.complete);

    // Verify prisma create was called with the correct data
    expect(prisma.restaurant.create).toHaveBeenCalledTimes(1);
    expect(prisma.restaurant.create).toHaveBeenCalledWith({
      data: {
        name: validRestaurantData.complete.name,
        description: validRestaurantData.complete.description,
        email: validRestaurantData.complete.email,
        phoneNumber: validRestaurantData.complete.phoneNumber,
        address: validRestaurantData.complete.address,
        serviceArea: validRestaurantData.complete.serviceArea,
      },
    });

    // Verify the response structure and content
    expect(result).toEqual({
      status: "success",
      message: "Restaurant added successfully",
      data: dbResponses.restaurant.create,
    });
  });

  // Test successful restaurant creation with minimal required data
  it("should successfully create a restaurant with minimal required data", async () => {
    // Prepare a minimal response that matches what Prisma would return
    const minimalResponse = {
      ...dbResponses.restaurant.create,
      name: validRestaurantData.minimal.name,
      phoneNumber: validRestaurantData.minimal.phoneNumber,
      description: null,
      email: null,
      address: null,
      serviceArea: null,
    };

    // Setup the mock to return a successful response with minimal data
    setupSuccessfulRestaurantCreation(minimalResponse);

    // Call the procedure with minimal restaurant data
    const result = await caller.createRestaurant(validRestaurantData.minimal);

    // Verify prisma create was called with the correct data
    expect(prisma.restaurant.create).toHaveBeenCalledTimes(1);
    expect(prisma.restaurant.create).toHaveBeenCalledWith({
      data: {
        name: validRestaurantData.minimal.name,
        phoneNumber: validRestaurantData.minimal.phoneNumber,
        // Optional fields should not be included in the data object
      },
    });

    // Verify the response structure and content
    expect(result).toEqual({
      status: "success",
      message: "Restaurant added successfully",
      data: minimalResponse,
    });
  });

  // Test error handling when database operations fail
  it("should handle database errors correctly", async () => {
    // Create a mock database error
    const dbError = new Error("Database connection error");

    // Setup the mock to reject with the error
    setupFailedRestaurantCreation(dbError);

    // Call the procedure and expect it to throw a TRPCError
    await expect(
      caller.createRestaurant(validRestaurantData.complete)
    ).rejects.toThrow(TRPCError);

    // Verify that the error is of the correct type
    try {
      await caller.createRestaurant(validRestaurantData.complete);
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
      expect((error as TRPCError).message).toBe("Failed to create restaurant");
    }

    // Verify prisma create was called
    expect(prisma.restaurant.create).toHaveBeenCalledTimes(2);
  });
});
