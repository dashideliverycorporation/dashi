/**
 * Sales Schema
 * 
 * Defines the schema for sales data and related operations
 */
import { z } from "zod";

/**
 * Input schema for fetching restaurant sales
 */
export const getSalesInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  sortField: z.string().default("totalSales"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z.object({
    restaurantName: z.string().optional(),
    period: z.enum(["ALL", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).default("ALL"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
});

/**
 * Output schema for restaurant sales data
 */
export const restaurantSalesSchema = z.object({
  id: z.string(),
  restaurantId: z.string(),
  restaurantName: z.string(),
  totalSales: z.number(),
  orderCount: z.number(),
  commission: z.number(),
  period: z.string().optional(),
});

/**
 * Output schema for restaurant sales response
 */
export const getSalesOutputSchema = z.object({
  sales: z.array(restaurantSalesSchema),
  pagination: z.object({
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    perPage: z.number(),
  }),
});

/**
 * Input schema for fetching specific restaurant sales details
 */
export const getRestaurantSalesDetailsInputSchema = z.object({
  restaurantId: z.string(),
  period: z.enum(["ALL", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).default("ALL"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
