/**
 * User management router for the Dashi platform
 *
 * This router contains procedures for managing users, including:
 * - Creating restaurant users
 * - Managing user accounts
 */
import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { createRestaurantUserSchema } from "@/server/schemas/user.schema";
import { hashPassword } from "@/server/auth";
import { UserRole } from "@/prisma/app/generated/prisma/client";

/**
 * User router with procedures for user management
 */
export const userRouter = router({
  /**
   * Create a new restaurant user (admin-only procedure)
   * Takes user details and restaurant ID, creates a user with RESTAURANT role,
   * and links them to the specified restaurant
   */
  createRestaurantUser: adminProcedure
    .input(createRestaurantUserSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if restaurant exists
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: input.restaurantId },
        });

        if (!restaurant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Restaurant not found",
          });
        }

        // Check if email is already in use
        const existingUser = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already in use",
          });
        }

        // Hash the password
        const hashedPassword = await hashPassword(input.password);

        // Use a transaction to ensure both user and restaurant manager are created
        const result = await prisma.$transaction(async (tx) => {
          // Create the user with RESTAURANT role
          const user = await tx.user.create({
            data: {
              email: input.email,
              name: input.name,
              password: hashedPassword,
              role: UserRole.RESTAURANT,
            },
          });

          // Create the restaurant manager linking user to restaurant
          const restaurantManager = await tx.restaurantManager.create({
            data: {
              userId: user.id,
              restaurantId: input.restaurantId,
              phoneNumber: input.phoneNumber,
            },
          });

          return {
            user,
            restaurantManager,
          };
        });

        return {
          status: "success",
          message: "Restaurant user created successfully",
          data: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            restaurantId: result.restaurantManager.restaurantId,
            phoneNumber: result.restaurantManager.phoneNumber,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error creating restaurant user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create restaurant user",
        });
      }
    }),
});
