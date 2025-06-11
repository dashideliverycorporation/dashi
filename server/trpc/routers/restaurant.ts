/**
 * Restaurant management router for the Dashi platform
 *
 * This router contains procedures for managing restaurants, including:
 * - Adding new restaurants
 * - Retrieving restaurant information
 * - Updating restaurant details
 * - Managing menu items
 */
import { adminProcedure, restaurantProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { S3Service } from "@/lib/aws";
import { TRPCError } from "@trpc/server";
import { createRestaurantSchema, updateRestaurantSchema } from "@/server/schemas/restaurant.schema";
import { createMenuItemSchema, updateMenuItemSchema } from "@/server/schemas/menu-item.schema";
import { z } from "zod";

/**
 * Schema for deleting a restaurant
 */
const deleteRestaurantSchema = z.object({
  id: z.string().cuid("Invalid restaurant ID"),
});

/**
 * Schema for deleting a menu item
 */
const deleteMenuItemSchema = z.object({
  id: z.string().cuid("Invalid menu item ID"),
});

/**
 * Extracts file data from a data URL or processes an image URL
 *
 * @param imageUrl - The image URL from the client which might be a data URL
 * @param prefix - Prefix for the filename (e.g., 'menu-item' or 'restaurant')
 * @returns Promise with the actual AWS S3 URL to be stored in the database
 */
async function processImageUrl(imageUrl: string, prefix: string = 'image'): Promise<string> {
  // Check if the URL is a data URL (base64 encoded)
  if (imageUrl?.startsWith("data:")) {
    // Extract the MIME type and base64 data
    const matches = imageUrl.match(/^data:(.+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      throw new Error("Invalid data URL format");
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a filename based on content type
    const extension = contentType.split("/")[1] || "png";
    const fileName = `${prefix}-${Date.now()}.${extension}`;

    // Upload to S3 and get the URL
    const result = await S3Service.uploadFile(buffer, fileName, contentType);
    return result.url;
  }

  // If it's not a data URL, return as is
  // Note: In a production app, you might want to validate external URLs
  return imageUrl || "";
}

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
            imageUrl: true,
            category: true,
            preparationTime: true,
            deliveryFee: true,
            rating: true,
            ratingCount: true,
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
        // Process the image URL if provided (convert data URLs to S3 URLs)
        let processedImageUrl = input.imageUrl;
        if (input.imageUrl) {
          processedImageUrl = await processImageUrl(input.imageUrl, 'restaurant');
        }

        // Create the restaurant in the database
        const restaurant = await prisma.restaurant.create({
          data: {
            name: input.name,
            description: input.description,
            email: input.email,
            phoneNumber: input.phoneNumber,
            address: input.address,
            serviceArea: input.serviceArea,
            imageUrl: processedImageUrl || "",
            category: input.category || "",
            preparationTime: input.preparationTime || "",
            deliveryFee: input.deliveryFee ? parseFloat(input.deliveryFee) : 0,
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

  /**
   * Update an existing restaurant (admin-only procedure)
   * Takes restaurant ID and updated details and updates the record in the database
   */
  updateRestaurant: adminProcedure
    .input(updateRestaurantSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if the restaurant exists
        const existingRestaurant = await prisma.restaurant.findUnique({
          where: { id: input.id },
        });

        if (!existingRestaurant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Restaurant not found",
          });
        }

        // Process the image URL if provided (convert data URLs to S3 URLs)
        let processedImageUrl = input.imageUrl;
        if (input.imageUrl && input.imageUrl !== existingRestaurant.imageUrl && input.imageUrl.startsWith("data:")) {
          processedImageUrl = await processImageUrl(input.imageUrl, 'restaurant');
        }

        // Update the restaurant in the database
        const updatedRestaurant = await prisma.restaurant.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            email: input.email,
            phoneNumber: input.phoneNumber,
            address: input.address,
            serviceArea: input.serviceArea,
            imageUrl: processedImageUrl || existingRestaurant.imageUrl,
            category: input.category || "",
            preparationTime: input.preparationTime || "",
            deliveryFee: input.deliveryFee ? parseFloat(input.deliveryFee) : existingRestaurant.deliveryFee,
            isActive: input.isActive !== undefined ? input.isActive : existingRestaurant.isActive,
            updatedAt: new Date(),
          },
        });

        return {
          status: "success",
          message: "Restaurant updated successfully",
          data: updatedRestaurant,
        };
      } catch (error) {
        // Handle any database errors
        console.error("Error updating restaurant:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update restaurant",
        });
      }
    }),

  /**
   * Delete a restaurant (admin-only procedure)
   * Performs a soft delete by setting deletedAt field and making the restaurant inactive
   */
  deleteRestaurant: adminProcedure
    .input(deleteRestaurantSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if the restaurant exists
        const existingRestaurant = await prisma.restaurant.findUnique({
          where: { id: input.id },
        });

        if (!existingRestaurant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Restaurant not found",
          });
        }
        
        // Check if restaurant has associated orders
        const orderCount = await prisma.order.count({
          where: {
            restaurantId: input.id,
          },
        });
        
        if (orderCount > 0) {
          // Soft delete - update isActive and deletedAt if the restaurant has orders
          const deletedRestaurant = await prisma.restaurant.update({
            where: { id: input.id },
            data: {
              isActive: false,
              deletedAt: new Date(),
            },
          });
          
          return {
            status: "success",
            message: "Restaurant has been deactivated",
            data: deletedRestaurant,
          };
        } else {
          // Hard delete if no orders exist for this restaurant
          await prisma.restaurant.delete({
            where: { id: input.id },
          });
          
          return {
            status: "success",
            message: "Restaurant has been permanently deleted",
            data: null,
          };
        }
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete restaurant",
        });
      }
    }),

  /**
   * Create a new menu item for the authenticated restaurant user
   * Validates the input using Zod schema and creates a new MenuItem in the database
   * Associates the menu item with the restaurant of the authenticated user
   */ 
  createMenuItem: restaurantProcedure
    .input(createMenuItemSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the restaurant ID for the authenticated user
        const userId = ctx.session.user.id;
        const restaurantManager = await prisma.restaurantManager.findUnique({
          where: { userId },
          select: { restaurantId: true },
        });

        if (!restaurantManager) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "User is not associated with any restaurant",
          });
        }

        // Process the image URL if provided (convert data URLs to S3 URLs)
        const processedImageUrl = await processImageUrl(input.imageUrl, 'menu-item');

        // Map input fields to match the Prisma model (isAvailable instead of available)
        const menuItem = await prisma.menuItem.create({
          data: {
            name: input.name,
            description: input.description,
            price: input.price,
            category: input.category,
            imageUrl: processedImageUrl, // Use the processed S3 URL
            isAvailable: input.available,
            restaurantId: restaurantManager.restaurantId,
          },
        });

        return menuItem;
      } catch (error) {
        console.error("Error creating menu item:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create menu item",
        });
      }
    }),

  /**
   * Get all menu items for a restaurant with pagination, sorting and filtering
   * Returns menu items for the restaurant associated with the authenticated user
   * or by restaurant ID for admin users
   */
  getMenuItems: restaurantProcedure
    .input(
      z.object({
        restaurantId: z.string().cuid("Invalid restaurant ID").optional(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        sortField: z.string().optional().default("name"),
        sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
        filters: z
          .object({
            name: z.string().optional().default(""),
            category: z.string().optional(),
            isAvailable: z.boolean().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, sortField, sortOrder, filters, restaurantId } = input;
        const skip = (page - 1) * limit;
        const userId = ctx.session.user.id;
        
        // Determine which restaurant ID to use
        let targetRestaurantId: string;
        
        if (restaurantId) {
          // If restaurant ID is directly provided and user has admin role, use it
          if (ctx.session.user.role === "ADMIN") {
            targetRestaurantId = restaurantId;
          } else {
            // Non-admin users can only access their own restaurant's menu items
            const restaurantManager = await prisma.restaurantManager.findUnique({
              where: { userId },
              select: { restaurantId: true },
            });
            
            if (!restaurantManager) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: "User is not associated with any restaurant",
              });
            }
            
            if (restaurantManager.restaurantId !== restaurantId) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: "Cannot access menu items for other restaurants",
              });
            }
            
            targetRestaurantId = restaurantManager.restaurantId;
          }
        } else {
          // If no restaurant ID provided, use the user's associated restaurant
          const restaurantManager = await prisma.restaurantManager.findUnique({
            where: { userId },
            select: { restaurantId: true },
          });
          
          if (!restaurantManager) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "User is not associated with any restaurant",
            });
          }
          
          targetRestaurantId = restaurantManager.restaurantId;
        }
        
        // Prepare filter conditions
        const whereClause: any = {
          restaurantId: targetRestaurantId,
        };
        
        // Add name filter if provided
        if (filters?.name) {
          whereClause.name = {
            contains: filters.name,
            mode: "insensitive", // Case-insensitive search
          };
        }
        
        // Add category filter if provided
        if (filters?.category) {
          whereClause.category = {
            contains: filters.category,
            mode: "insensitive", // Case-insensitive search
          };
        }
        
        // Add availability filter if provided
        if (filters?.isAvailable !== undefined) {
          whereClause.isAvailable = filters.isAvailable;
        }
        
        // Get total count for pagination
        const totalCount = await prisma.menuItem.count({
          where: whereClause,
        });
        
        // Get menu items with pagination and sorting
        const menuItems = await prisma.menuItem.findMany({
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
            price: true,
            category: true,
            imageUrl: true,
            isAvailable: true,
            createdAt: true,
            updatedAt: true,
            restaurantId: true,
          },
        });
        
        return {
          menuItems,
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      } catch (error) {
        console.error("Error fetching menu items:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch menu items",
        });
      }
    }),
    
  /**
   * Update an existing menu item (restaurant procedure)
   * Takes menu item ID and updated details and updates the record in the database
   */
  updateMenuItem: restaurantProcedure
    .input(updateMenuItemSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        
        // Check if the menu item exists
        const existingMenuItem = await prisma.menuItem.findUnique({
          where: { id: input.id },
          include: { restaurant: true },
        });

        if (!existingMenuItem) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Menu item not found",
          });
        }
        
        // Check if user has permission to update this menu item
        if (ctx.session.user.role !== "ADMIN") {
          // For non-admin users, verify they are associated with the restaurant
          const restaurantManager = await prisma.restaurantManager.findUnique({
            where: { userId },
            select: { restaurantId: true },
          });
          
          if (!restaurantManager || restaurantManager.restaurantId !== existingMenuItem.restaurantId) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to update this menu item",
            });
          }
        }
        
        // Process the image URL if provided (convert data URLs to S3 URLs)
        let processedImageUrl = input.imageUrl;
        if (input.imageUrl && input.imageUrl !== existingMenuItem.imageUrl && input.imageUrl.startsWith("data:")) {
          processedImageUrl = await processImageUrl(input.imageUrl, 'menu-item');
        }

        // Update the menu item in the database
        const updatedMenuItem = await prisma.menuItem.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description || existingMenuItem.description,
            price: input.price,
            category: input.category,
            imageUrl: processedImageUrl || existingMenuItem.imageUrl,
            isAvailable: input.available,
            updatedAt: new Date(),
          },
        });

        return {
          status: "success",
          message: "Menu item updated successfully",
          data: updatedMenuItem,
        };
      } catch (error) {
        // Handle any database errors
        console.error("Error updating menu item:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update menu item",
        });
      }
    }),
    
  /**
   * Delete a menu item (restaurant procedure)
   * Performs either a soft delete by setting deletedAt field and making the item unavailable
   * or a hard delete if the item has not been used in any orders
   */
  deleteMenuItem: restaurantProcedure
    .input(deleteMenuItemSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        
        // Check if the menu item exists
        const existingMenuItem = await prisma.menuItem.findUnique({
          where: { id: input.id },
          include: { restaurant: true },
        });

        if (!existingMenuItem) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Menu item not found",
          });
        }
        
        // Check if user has permission to delete this menu item
        if (ctx.session.user.role !== "ADMIN") {
          // For non-admin users, verify they are associated with the restaurant
          const restaurantManager = await prisma.restaurantManager.findUnique({
            where: { userId },
            select: { restaurantId: true },
          });
          
          if (!restaurantManager || restaurantManager.restaurantId !== existingMenuItem.restaurantId) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You don't have permission to delete this menu item",
            });
          }
        }
        
        // Check if menu item has been used in any orders
        const orderItemCount = await prisma.orderItem.count({
          where: {
            menuItemId: input.id,
          },
        });
        
        if (orderItemCount > 0) {
          // Soft delete - update isAvailable and deletedAt if the menu item has been used in orders
          const deletedMenuItem = await prisma.menuItem.update({
            where: { id: input.id },
            data: {
              isAvailable: false,
              deletedAt: new Date(),
            },
          });
          
          return {
            status: "success",
            message: "Menu item has been deactivated",
            data: deletedMenuItem,
          };
        } else {
          // Hard delete if no order items exist for this menu item
          await prisma.menuItem.delete({
            where: { id: input.id },
          });
          
          return {
            status: "success",
            message: "Menu item has been permanently deleted",
            data: null,
          };
        }
      } catch (error) {
        console.error("Error deleting menu item:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete menu item",
        });
      }
    }),
});
