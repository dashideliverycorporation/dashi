/**
 * Test helpers for restaurant, user, and menu item tests
 *
 * This file provides utility functions to help with testing.
 */
import { vi } from "vitest";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";

/**
 * Setup database mocks for successful restaurant creation
 *
 * @param response The mock response to return from the create function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupSuccessfulRestaurantCreation(response: any) {
  vi.mocked(prisma.restaurant.create).mockResolvedValue(response);
}

/**
 * Setup database mocks for failed restaurant creation
 *
 * @param error The error to throw from the create function
 */
export function setupFailedRestaurantCreation(error: Error) {
  vi.mocked(prisma.restaurant.create).mockRejectedValue(error);
}

/**
 * Setup database mocks for successful user creation
 *
 * @param response The mock response to return from the create function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupSuccessfulUserCreation(response: any) {
  vi.mocked(prisma.user.create).mockResolvedValue(response);
}

/**
 * Setup database mocks for failed user creation
 *
 * @param error The error to throw from the create function
 */
export function setupFailedUserCreation(error: Error) {
  vi.mocked(prisma.user.create).mockRejectedValue(error);
}

/**
 * Create a mock TRPCError
 *
 * @param code The error code
 * @param message The error message
 * @returns A TRPCError
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTRPCError(code: any, message: string): TRPCError {
  return new TRPCError({
    code,
    message,
  });
}

/**
 * Setup mock for restaurant findUnique to return success
 *
 * @param restaurant The restaurant data to return
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupRestaurantExists(restaurant: any) {
  vi.mocked(prisma.restaurant.findUnique).mockResolvedValue(restaurant);
}

/**
 * Setup mock for restaurant findUnique to return null (not found)
 */
export function setupRestaurantNotFound() {
  vi.mocked(prisma.restaurant.findUnique).mockResolvedValue(null);
}

/**
 * Setup mock for successful transaction with user and restaurant manager creation
 *
 * @param userResponse The user data to return
 * @param restaurantManagerResponse The restaurant manager data to return
 */
export function setupSuccessfulTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userResponse: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurantManagerResponse: any
) {
  vi.mocked(prisma.$transaction).mockImplementation(async () => {
    return {
      user: userResponse,
      restaurantManager: restaurantManagerResponse,
    };
  });
}

/**
 * Setup mock for failed transaction
 *
 * @param error The error to throw from the transaction
 */
export function setupFailedTransaction(error: Error) {
  vi.mocked(prisma.$transaction).mockRejectedValue(error);
}

/**
 * Setup mock for successful restaurant listing with users
 *
 * @param restaurants The list of restaurants with users to return
 * @param total The total number of restaurants (for pagination)
 * @param page The current page number
 * @param limit The number of restaurants per page
 */
export function setupSuccessfulRestaurantListing(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurants: any[],
  total: number = restaurants.length
) {
  vi.mocked(prisma.restaurant.findMany).mockResolvedValue(restaurants);
  vi.mocked(prisma.restaurant.count).mockResolvedValue(total);
}

/**
 * Setup mock for failed restaurant listing
 *
 * @param error The error to throw from the findMany function
 */
export function setupFailedRestaurantListing(error: Error) {
  vi.mocked(prisma.restaurant.findMany).mockRejectedValue(error);
}

/**
 * Setup mock for successful menu item creation
 *
 * @param response The mock response to return from the create function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupSuccessfulMenuItemCreation(response: any) {
  vi.mocked(prisma.menuItem.create).mockResolvedValue(response);
}

/**
 * Setup mock for failed menu item creation
 *
 * @param error The error to throw from the create function
 */
export function setupFailedMenuItemCreation(error: Error) {
  vi.mocked(prisma.menuItem.create).mockRejectedValue(error);
}

/**
 * Setup mock for restaurant manager findUnique to return success
 *
 * @param manager The restaurant manager data to return
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupRestaurantManagerExists(manager: any) {
  vi.mocked(prisma.restaurantManager.findUnique).mockResolvedValue(manager);
}

/**
 * Setup mock for restaurant manager findUnique to return null (not found)
 */
export function setupRestaurantManagerNotFound() {
  vi.mocked(prisma.restaurantManager.findUnique).mockResolvedValue(null);
}
