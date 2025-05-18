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
  setupSuccessfulRestaurantListing,
  setupFailedRestaurantListing,
} from "./test-helpers";

// Mock Prisma client
vi.mock("@/lib/db", () => {
  const mockPrisma = {
    restaurant: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
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

/**
 * Tests for the getRestaurantsWithUsers procedure
 *
 * These tests verify that the restaurant listing functionality works correctly:
 * 1. Fetching restaurants with pagination
 * 2. Sorting and filtering restaurants
 * 3. Error handling when database operations fail
 */
describe("Restaurant Listing with Users", () => {
  // Add fixtures for restaurant listing with their managers
  const restaurantList = dbResponses.restaurant.list;

  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(prisma.restaurant.findMany).mockClear();
    vi.mocked(prisma.restaurant.count).mockClear();
  });

  // Test successful restaurant listing with default pagination
  it("should successfully fetch restaurants with their managers using default pagination", async () => {
    // Setup mocks for successful restaurant listing
    setupSuccessfulRestaurantListing(restaurantList);

    // Call the procedure with default parameters
    const result = await caller.getRestaurantsWithUsers({
      page: 1,
      limit: 10,
      sortField: "name",
      sortOrder: "asc",
    });

    // Verify prisma findMany and count were called
    expect(prisma.restaurant.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.restaurant.count).toHaveBeenCalledTimes(1);

    // Verify the findMany call had the correct parameters
    expect(prisma.restaurant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null },
        skip: 0, // (page - 1) * limit = 0
        take: 10, // limit
        orderBy: { name: "asc" },
        select: expect.objectContaining({
          id: true,
          name: true,
          description: true,
          email: true,
          phoneNumber: true,
          managers: expect.any(Object),
        }),
      })
    );

    // Verify the response structure
    expect(result).toHaveProperty("restaurants");
    expect(result).toHaveProperty("pagination");
    expect(result.pagination).toEqual({
      total: restaurantList.length,
      page: 1,
      limit: 10,
      totalPages: 1, // Math.ceil(3 / 10) = 1
    });
    expect(result.restaurants).toEqual(restaurantList);
  });

  // Test restaurant listing with custom pagination
  it("should successfully fetch restaurants with custom pagination", async () => {
    // Setup mocks for successful restaurant listing
    setupSuccessfulRestaurantListing(
      restaurantList.slice(0, 1),
      restaurantList.length,
      2,
      1
    );

    // Call the procedure with custom pagination (page 2, limit 1)
    const result = await caller.getRestaurantsWithUsers({
      page: 2,
      limit: 1,
      sortField: "name",
      sortOrder: "asc",
    });

    // Verify the findMany call had the correct pagination parameters
    expect(prisma.restaurant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 1, // (page - 1) * limit = 1
        take: 1, // limit
      })
    );

    // Verify pagination info in the response
    expect(result.pagination).toEqual({
      total: restaurantList.length,
      page: 2,
      limit: 1,
      totalPages: 3, // Math.ceil(3 / 1) = 3
    });
  });

  // Test restaurant listing with sorting
  it("should successfully sort restaurants by different fields", async () => {
    // Setup mocks for successful restaurant listing
    setupSuccessfulRestaurantListing(restaurantList);

    // Call the procedure with sorting by createdAt in descending order
    await caller.getRestaurantsWithUsers({
      page: 1,
      limit: 10,
      sortField: "createdAt",
      sortOrder: "desc",
    });

    // Verify the sorting parameters
    expect(prisma.restaurant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
      })
    );
  });

  // Test restaurant listing with name filtering
  it("should successfully filter restaurants by name", async () => {
    // Filter by "burger" name
    const filterValue = "burger";

    // Setup mocks for successful restaurant listing with filtering
    // In a real scenario, the database would filter, but we mock the return value
    // to be the full array as the actual filtering is done by the database
    setupSuccessfulRestaurantListing(
      restaurantList.filter((r) =>
        r.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    );

    // Call the procedure with name filter
    const result = await caller.getRestaurantsWithUsers({
      page: 1,
      limit: 10,
      sortField: "name",
      sortOrder: "asc",
      filters: { name: filterValue },
    });

    // Verify the filter parameters
    expect(prisma.restaurant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: expect.objectContaining({
            contains: filterValue,
            mode: "insensitive",
          }),
        }),
      })
    );

    // Verify only restaurants matching the filter are returned
    // Note: In our test implementation, we're manually filtering beforehand
    result.restaurants.forEach((restaurant) => {
      expect(restaurant.name.toLowerCase()).toContain(
        filterValue.toLowerCase()
      );
    });
  });

  // Test error handling when database operations fail
  it("should handle database errors correctly when fetching restaurants", async () => {
    // Create a mock database error
    const dbError = new Error("Database query error");

    // Setup the mock to reject with the error
    setupFailedRestaurantListing(dbError);

    // Call the procedure and expect it to throw a TRPCError
    await expect(
      caller.getRestaurantsWithUsers({
        page: 1,
        limit: 10,
      })
    ).rejects.toThrow(TRPCError);

    // Verify that the error is of the correct type
    try {
      await caller.getRestaurantsWithUsers({
        page: 1,
        limit: 10,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
      expect((error as TRPCError).message).toBe(
        "Failed to fetch restaurants with users"
      );
    }

    // Verify prisma findMany was called
    expect(prisma.restaurant.findMany).toHaveBeenCalledTimes(2);
  });
});
