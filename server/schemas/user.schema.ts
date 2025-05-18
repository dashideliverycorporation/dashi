/**
 * User schemas for validation and types
 *
 * Contains Zod schemas for user-related data validation
 */
import { z } from "zod";

/**
 * Schema for creating a new restaurant user
 * Validates restaurant user data before saving to database
 */
export const createRestaurantUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  restaurantId: z.string().cuid("Restaurant is required"),
});

/**
 * Type representing the input for creating a restaurant user
 */
export type CreateRestaurantUserInput = z.infer<
  typeof createRestaurantUserSchema
>;
