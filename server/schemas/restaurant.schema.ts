/**
 * Restaurant schemas for validation and types
 *
 * Contains Zod schemas for restaurant-related data validation
 */
import { z } from "zod";

/**
 * Schema for creating a new restaurant
 * Validates restaurant data before saving to database
 */
export const createRestaurantSchema = z.object({
  name: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number"),
  address: z.string().optional(),
  serviceArea: z
    .string()
    .max(200, "Service area description must be at most 200 characters")
    .optional(),
});

/**
 * Type representing the input for creating a restaurant
 */
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
