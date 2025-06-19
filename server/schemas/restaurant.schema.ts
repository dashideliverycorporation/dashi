/**
 * Restaurant schemas for validation and types
 *
 * Contains Zod schemas for restaurant-related data validation
 */
import { z } from "zod";

/**
 * Schema for fetching a restaurant by slug
 * Validates the slug parameter for the getRestaurantBySlug procedure
 */
export const getRestaurantBySlugSchema = z.object({
  slug: z.string().min(1, "Restaurant slug is required"),
});

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
  imageUrl: z.string().url("Please enter a valid URL").optional(),
  category: z.string().max(100, "Category must be at most 100 characters").optional(),
  preparationTime: z.string().max(50, "Preparation time must be at most 50 characters").optional(),
  deliveryFee: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid delivery fee").optional(),
  discountTag: z.string().max(50, "Discount tag must be at most 50 characters").optional(),
  rating: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid rating between 0-5").optional(),
  ratingCount: z.string().regex(/^\d+$/, "Please enter a valid count").optional(),
});

/**
 * Schema for updating an existing restaurant
 * Extends the create schema to include the restaurant ID
 */
export const updateRestaurantSchema = z.object({
  id: z.string().cuid("Invalid restaurant ID"),
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
  imageUrl: z.string().url("Please enter a valid URL").optional(),
  category: z.string().max(100, "Category must be at most 100 characters").optional(),
  preparationTime: z.string().max(50, "Preparation time must be at most 50 characters").optional(),
  deliveryFee: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid delivery fee").optional(),
  discountTag: z.string().max(50, "Discount tag must be at most 50 characters").optional(),
  rating: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid rating between 0-5").optional(),
  ratingCount: z.string().regex(/^\d+$/, "Please enter a valid count").optional(),
  isActive: z.boolean().optional(),
});

/**
 * Type representing the input for creating a restaurant
 */
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

/**
 * Type representing the input for updating a restaurant
 */
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
