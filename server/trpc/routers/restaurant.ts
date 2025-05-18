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
import { z } from "zod";

/**
 * Restaurant router with procedures for restaurant management
 */
export const restaurantRouter = router({
  /**
   * Get all active restaurants (admin-only procedure)
   * Returns a list of all active restaurants for selection in forms
   */
  getAllRestaurants: adminProcedure.query(async () => {
    try {
      const restaurants = await prisma.restaurant.findMany({
        where: {
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });

      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch restaurants",
      });
    }
  }),

  /**
   * Get all restaurants with their associated users for admin dashboard (admin-only procedure)
   * Returns a paginated list of restaurants with their associated managers/users
   */
  getRestaurantsWithUsers: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        sortField: z.string().optional().default("name"),
        sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
        filters: z
          .object({
            name: z.string().optional().default(""),
          })
          .optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { page, limit, sortField, sortOrder, filters } = input;
        const skip = (page - 1) * limit;

        // Prepare filter conditions
        const whereClause: any = {
          deletedAt: null,
        };

        // Add name filter if provided
        if (filters?.name) {
          whereClause.name = {
            contains: filters.name,
            mode: "insensitive", // Case-insensitive search
          };
        }

        // Get total count for pagination
        const totalCount = await prisma.restaurant.count({
          where: whereClause,
        });

        // Get restaurants with their managers and associated users
        const restaurants = await prisma.restaurant.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: {
            [sortField]: sortOrder,
          },
          select: {
            id: true,
            name: true,
            description: true,
            email: true,
            phoneNumber: true,
            address: true,
            serviceArea: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            managers: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        return {
          restaurants,
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      } catch (error) {
        console.error("Error fetching restaurants with users:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch restaurants with users",
        });
      }
    }),

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
