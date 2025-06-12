/**
 * Menu Item schemas for validation and types
 *
 * Contains Zod schemas for menu item-related data validation
 */
import { z } from "zod";

/**
 * Schema for creating a new menu item
 * Validates menu item data before saving to database
 */
export const createMenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image URL is required"),
  available: z.boolean(),
});

/**
 * Schema for updating an existing menu item
 * Extends the create schema to include the menu item ID
 */
export const updateMenuItemSchema = z.object({
  id: z.string().cuid("Invalid menu item ID"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image URL is required"),
  available: z.boolean(),
});

/**
 * Type representing the input for creating a menu item
 */
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

/**
 * Type representing the input for updating a menu item
 */
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
