/**
 * Test helpers for restaurant and user tests
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
  userResponse: any,
  restaurantManagerResponse: any
) {
  vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
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
