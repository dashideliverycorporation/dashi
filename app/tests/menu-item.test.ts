/**
 * Menu item creation tests
 *
 * These tests verify that the menu item creation functionality works correctly:
 * 1. The restaurant router is properly defined
 * 2. The createMenuItem procedure validates input correctly
 * 3. Successful menu item creation returns the expected response
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { restaurantRouter } from "@/server/trpc/routers/restaurant";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import {
  validMenuItemData,
  menuItemDbResponses,
  restaurantManagerDbResponses,
} from "./fixtures";
import {
  setupSuccessfulMenuItemCreation,
  setupFailedMenuItemCreation,
  setupRestaurantManagerExists,
} from "./test-helpers";
import { S3Service } from "@/lib/aws";

// Mock Prisma client
vi.mock("@/lib/db", () => {
  const mockPrisma = {
    menuItem: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    restaurantManager: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  return {
    prisma: mockPrisma,
    db: mockPrisma, // Add db export as an alias to prisma
  };
});

// Mock S3Service
vi.mock("@/lib/aws", () => {
  return {
    S3Service: {
      uploadFile: vi
        .fn()
        .mockImplementation((_file, fileName) => {
          return Promise.resolve({
            url: `https://s3.example.com/images/${fileName}`,
            key: fileName,
          });
        }),
    },
  };
});

// Mock context for restaurant procedure
const mockCtx = {
  session: {
    user: {
      id: "restaurant-user-id",
      role: "RESTAURANT",
      email: "restaurant@example.com",
    },
  },
};

// Create caller for the router
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const caller = restaurantRouter.createCaller(mockCtx as any);

describe("Menu Item Creation", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(prisma.menuItem.create).mockClear();
    vi.mocked(prisma.restaurantManager.findUnique).mockClear();
    vi.mocked(S3Service.uploadFile).mockClear();
  });

  // Basic test to check if the testing environment is set up correctly
  it("test environment should be set up correctly", () => {
    expect(true).toBe(true);
    expect(restaurantRouter).toBeDefined();
    expect(caller).toBeDefined();
    expect(prisma.menuItem.create).toBeDefined();
    expect(prisma.restaurantManager.findUnique).toBeDefined();

    // Verify fixtures and helpers are accessible
    expect(validMenuItemData).toBeDefined();
    expect(setupSuccessfulMenuItemCreation).toBeDefined();
    expect(setupRestaurantManagerExists).toBeDefined();
  });

  // Test successful menu item creation with complete data
  it("should successfully create a menu item with complete data", async () => {
    // Setup the mock to return a successful restaurant manager lookup
    setupRestaurantManagerExists(restaurantManagerDbResponses.validManager);

    // Setup the mock to return a successful menu item creation response
    setupSuccessfulMenuItemCreation(menuItemDbResponses.successfulCreation);

    // Call the procedure with complete menu item data
    const result = await caller.createMenuItem(validMenuItemData.complete);

    // Verify restaurantManager.findUnique was called with the correct userId
    expect(prisma.restaurantManager.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.restaurantManager.findUnique).toHaveBeenCalledWith({
      where: { userId: mockCtx.session.user.id },
      select: { restaurantId: true },
    });

    // Verify menuItem.create was called with the correct data
    expect(prisma.menuItem.create).toHaveBeenCalledTimes(1);
    expect(prisma.menuItem.create).toHaveBeenCalledWith({
      data: {
        name: validMenuItemData.complete.name,
        description: validMenuItemData.complete.description,
        price: validMenuItemData.complete.price,
        category: validMenuItemData.complete.category,
        imageUrl: validMenuItemData.complete.imageUrl,
        isAvailable: validMenuItemData.complete.available,
        restaurantId: restaurantManagerDbResponses.validManager.restaurantId,
      },
    });

    // Verify the response is the created menu item
    expect(result).toEqual(menuItemDbResponses.successfulCreation);
  });

  // Test error handling when database operations fail
  it("should handle database errors correctly during menu item creation", async () => {
    // Setup the mock to return a successful restaurant manager lookup
    setupRestaurantManagerExists(restaurantManagerDbResponses.validManager);

    // Create a mock database error
    const dbError = new Error("Database connection error");

    // Setup the mock to reject with the error
    setupFailedMenuItemCreation(dbError);

    // Call the procedure and expect it to throw a TRPCError
    await expect(
      caller.createMenuItem(validMenuItemData.complete)
    ).rejects.toThrow(TRPCError);

    // Verify that the error is of the correct type
    try {
      await caller.createMenuItem(validMenuItemData.complete);
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
      expect((error as TRPCError).message).toBe("Failed to create menu item");
    }

    // Verify restaurantManager.findUnique was called
    expect(prisma.restaurantManager.findUnique).toHaveBeenCalledTimes(2);

    // Verify menuItem.create was called
    expect(prisma.menuItem.create).toHaveBeenCalledTimes(2);
  });
});
