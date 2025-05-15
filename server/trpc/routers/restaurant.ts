/**
 * Restaurant management router for the Dashi platform
 *
 * This router contains procedures for managing restaurants, including:
 * - Adding new restaurants
 * - Retrieving restaurant information
 * - Updating restaurant details
 */
import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { createRestaurantSchema } from "@/server/schemas/restaurant.schema";

/**
 * Restaurant router with procedures for restaurant management
 */
export const restaurantRouter = router({
  /**
   * Create a new restaurant (admin-only procedure)
   * Takes restaurant details and saves them to the database
   */
  createRestaurant: adminProcedure
    .input(createRestaurantSchema)
    .mutation(async ({ input }) => {
      try {
        // Create the restaurant in the database
        const restaurant = await prisma.restaurant.create({
          data: {
            name: input.name,
            description: input.description,
            email: input.email,
            phoneNumber: input.phoneNumber,
            address: input.address,
            serviceArea: input.serviceArea,
          },
        });

        return {
          status: "success",
          message: "Restaurant added successfully",
          data: restaurant,
        };
      } catch (error) {
        // Handle any database errors
        console.error("Error creating restaurant:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create restaurant",
        });
      }
    }),
});
