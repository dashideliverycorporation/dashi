/**
 * Sales Router for the Dashi platform
 *
 * This router contains procedures for managing sales data, including:
 * - Retrieving sales data for all restaurants
 * - Getting sales summary statistics
 * - Fetching detailed sales information for specific restaurants
 */
import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { prisma } from "@/lib/db";
import { UserRole } from "@/prisma/app/generated/prisma/client";

/**
 * Sales router with procedures for sales data operations
 */
export const salesRouter = router({
  /**
   * Get paginated, filtered restaurant sales data (admin only)
   * Returns sales data for all restaurants with pagination and filtering options
   */
  getSales: adminProcedure
    .input(
      z.object({
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
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, sortField, sortOrder, filters } = input;
        const skip = (page - 1) * limit;
        
        // Build the query conditions
        const where: any = {};
        
        if (filters?.restaurantName) {
          where.restaurant = {
            name: {
              contains: filters.restaurantName,
              mode: 'insensitive',
            },
          };
        }
        
        // Handle date filtering based on period
        let dateFilter = {};
        if (filters?.period && filters.period !== "ALL") {
          let startDate;
          const now = new Date();
          
          switch (filters.period) {
            case "DAILY":
              startDate = startOfDay(now);
              break;
            case "WEEKLY":
              startDate = startOfWeek(now, { weekStartsOn: 1 });
              break;
            case "MONTHLY":
              startDate = startOfMonth(now);
              break;
            case "YEARLY":
              startDate = startOfYear(now);
              break;
          }
          
          if (startDate) {
            dateFilter = {
              createdAt: {
                gte: startDate,
              },
            };
          }
        } else if (filters?.startDate && filters?.endDate) {
          dateFilter = {
            createdAt: {
              gte: new Date(filters.startDate),
              lte: new Date(filters.endDate),
            },
          };
        }
        
        // Count total restaurants for pagination
        const totalRestaurants = await prisma.restaurant.count();
        
        // Get all restaurants
        const restaurants = await prisma.restaurant.findMany({
          skip,
          take: limit,
          orderBy: sortField === 'restaurantName' 
            ? { name: sortOrder }
            : { id: 'asc' }, // Default ordering if not sorting by name
          where: filters?.restaurantName 
            ? { name: { contains: filters.restaurantName, mode: 'insensitive' } }
            : {},
        });
        
        // For each restaurant, get their order data
        const salesData = await Promise.all(
          restaurants.map(async (restaurant: any) => {
            // Aggregate only delivered orders for this restaurant
            const orderStats = await prisma.order.aggregate({
              where: {
                restaurantId: restaurant.id,
                status: "DELIVERED", // Only count delivered orders for sales
                ...dateFilter,
              },
              _sum: {
                totalAmount: true,
              },
              _count: true,
            });
            
            // Convert Decimal to number before arithmetic operations
            const totalSalesValue = orderStats._sum.totalAmount ? orderStats._sum.totalAmount.toNumber() : 0;
            const orderCount = orderStats._count || 0;
            const commission = totalSalesValue * 0.1; // 10% commission rate
            
            return {
              id: restaurant.id,
              restaurantId: restaurant.id,
              restaurantName: restaurant.name,
              totalSales: totalSalesValue,
              orderCount,
              commission,
              period: filters?.period || "ALL",
            };
          })
        );
        
        // Sort the results based on the requested field
        const sortedSales = [...salesData].sort((a, b) => {
          let aValue, bValue;
          
          switch (sortField) {
            case 'totalSales':
              aValue = a.totalSales;
              bValue = b.totalSales;
              break;
            case 'orderCount':
              aValue = a.orderCount;
              bValue = b.orderCount;
              break;
            case 'commission':
              aValue = a.commission;
              bValue = b.commission;
              break;
            case 'restaurantName':
              aValue = a.restaurantName;
              bValue = b.restaurantName;
              break;
            default:
              aValue = a.totalSales;
              bValue = b.totalSales;
          }
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' 
              ? aValue.localeCompare(bValue) 
              : bValue.localeCompare(aValue);
          }
          
          return sortOrder === 'asc' ? (aValue - bValue) : (bValue - aValue);
        });
        
        // Calculate pagination values
        const total = totalRestaurants;
        const totalPages = Math.ceil(total / limit);
        
        return {
          sales: sortedSales,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            perPage: limit,
          },
        };
      } catch (error) {
        console.error("Error retrieving sales data:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve sales data",
        });
      }
    }),

  /**
   * Get sales summary statistics for the dashboard (admin only)
   * Returns aggregate sales figures across all restaurants
   */
  getSalesSummary: adminProcedure
    .input(
      z.object({
        period: z.enum(["ALL", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).default("ALL"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { period } = input;
        
        // Handle date filtering based on period
        const where: any = {
          status: "DELIVERED" // Only count delivered orders for sales calculations
        };
        
        if (period !== "ALL") {
          let startDate;
          const now = new Date();
          
          switch (period) {
            case "DAILY":
              startDate = startOfDay(now);
              break;
            case "WEEKLY":
              startDate = startOfWeek(now, { weekStartsOn: 1 });
              break;
            case "MONTHLY":
              startDate = startOfMonth(now);
              break;
            case "YEARLY":
              startDate = startOfYear(now);
              break;
          }
          
          if (startDate) {
            where.createdAt = {
              gte: startDate,
            };
          }
        }
        
        // Get total sales and order count
        const orderStats = await prisma.order.aggregate({
          where,
          _sum: {
            totalAmount: true,
          },
          _count: {
            id: true,
          },
        });
        
        // Get restaurant count
        const restaurantCount = await prisma.restaurant.count();
        
        // Convert Decimal to number before arithmetic operations
        const totalSales = orderStats._sum.totalAmount ? orderStats._sum.totalAmount.toNumber() : 0;
        
        return {
          totalSales,
          totalOrders: orderStats._count.id || 0,
          commission: totalSales * 0.1, // 10% commission
          restaurantCount,
        };
      } catch (error) {
        console.error("Error retrieving sales summary:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve sales summary",
        });
      }
    }),

  /**
   * Get detailed sales data for a specific restaurant (admin/restaurant manager)
   * Takes restaurant ID and period filters
   * Returns detailed sales data for the specified restaurant
   */
  getRestaurantSalesDetails: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        period: z.enum(["ALL", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).default("ALL"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { restaurantId, period, startDate, endDate } = input;
        const userId = ctx.session?.user?.id;
        
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view sales details",
          });
        }
        
        // Verify restaurant exists
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurantId },
        });
        
        if (!restaurant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Restaurant not found",
          });
        }
        
        // Check user permissions
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            restaurantManager: true,
          },
        });
        
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
        
        // Allow restaurant managers of this restaurant or admins
        const isRestaurantManager = user.restaurantManager?.restaurantId === restaurantId;
        const isAdmin = user.role === UserRole.ADMIN;
        
        if (!isRestaurantManager && !isAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to view these sales details",
          });
        }
        
        // Build query conditions
        const where: any = {
          restaurantId,
          status: "DELIVERED" // Only count delivered orders for sales calculations
        };
        
        // Handle date filtering based on period
        if (period !== "ALL") {
          let periodStartDate;
          const now = new Date();
          
          switch (period) {
            case "DAILY":
              periodStartDate = startOfDay(now);
              break;
            case "WEEKLY":
              periodStartDate = startOfWeek(now, { weekStartsOn: 1 });
              break;
            case "MONTHLY":
              periodStartDate = startOfMonth(now);
              break;
            case "YEARLY":
              periodStartDate = startOfYear(now);
              break;
          }
          
          if (periodStartDate) {
            where.createdAt = {
              gte: periodStartDate,
            };
          }
        } else if (startDate && endDate) {
          where.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate),
          };
        }
        
        // Get orders for this restaurant
        const orders = await prisma.order.findMany({
          where,
          include: {
            customer: {
              include: {
                user: true,
              },
            },
            orderItems: {
              include: {
                menuItem: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        
        // Calculate summary statistics
        // Convert Decimal to number before reducing
        const totalSales = orders.reduce((sum: number, order: any) => {
          const amount = order.totalAmount ? 
            (typeof order.totalAmount.toNumber === 'function' ? order.totalAmount.toNumber() : Number(order.totalAmount)) 
            : 0;
          return sum + amount;
        }, 0);
        const orderCount = orders.length;
        const commission = totalSales * 0.1; // 10%
        
        return {
          restaurant,
          orders,
          summary: {
            totalSales,
            orderCount,
            commission,
            averageOrderValue: orderCount > 0 ? totalSales / orderCount : 0,
          },
        };
      } catch (error) {
        console.error("Error retrieving restaurant sales details:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve restaurant sales details",
        });
      }
    }),
});
