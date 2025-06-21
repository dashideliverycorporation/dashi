/**
 * Order management router for the Dashi platform
 *
 * This router contains procedures for managing orders, including:
 * - Creating new orders
 * - Retrieving order information
 * - Updating order status
 */
import { protectedProcedure, router } from "../trpc";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { createOrderSchema } from "@/server/schemas/order.schema";
import { UserRole, PaymentMethod, PaymentStatus } from "@/prisma/app/generated/prisma/client";
import { z } from "zod";

/**
 * Order router with procedures for order management
 */
export const orderRouter = router({
  /**
   * Create a new order
   * Takes order details including delivery info, payment info, items, restaurant ID, and total
   * Creates an order record with related order items
   */
  createOrder: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { delivery, payment, items, restaurantId, total } = input;
        
        // Ensure the user is authenticated
        const userId = ctx.session?.user?.id;
        
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to place an order",
          });
        }
        
        // Check if the user has a customer profile
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { customer: true },
        });
        
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
        
        if (user.role !== UserRole.CUSTOMER || !user.customer) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only customers can place orders",
          });
        }
        
        // At this point, we know customer exists because of the check above
        const { customer } = user;
        
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
        
        // Create the order and order items in a transaction
        const order = await prisma.$transaction(async (tx) => {
          // Function to generate a random 4-digit number (between 1000-9999)
          const generateRandomOrderNumber = () => Math.floor(1000 + Math.random() * 9000);
          
          // Maximum number of retry attempts
          const MAX_RETRIES = 5;
          let retryCount = 0;
          let newOrder = null;
          
          // Keep trying until we get a unique order number or reach max retries
          while (retryCount < MAX_RETRIES) {
            const randomNumber = generateRandomOrderNumber();
            const displayOrderNumber = `#${randomNumber}`;
            
            try {
              newOrder = await tx.order.create({
                data: {
                  totalAmount: total,
                  deliveryAddress: delivery.deliveryAddress,
                  customerNotes: delivery.notes,
                  customerId: customer.id,
                  restaurantId,
                  orderNumber: randomNumber,
                  displayOrderNumber: displayOrderNumber,
                },
              });
              
              // Success! Exit the retry loop
              break;
            } catch (error) {
              const err = error as Error;
              
              // Check if the error is a unique constraint violation on displayOrderNumber
              if (err.message?.includes('displayOrderNumber') || err.message?.includes('unique constraint')) {
                // Increment retry count and try again with a different random number
                retryCount++;
                console.log(`Order number collision on ${displayOrderNumber}, attempt ${retryCount} of ${MAX_RETRIES}`);
                
                // If we've reached max retries, throw an error
                if (retryCount >= MAX_RETRIES) {
                  console.error(`Failed to generate unique order number after ${MAX_RETRIES} attempts`);
                  throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate unique order number, please try again",
                  });
                }
                
                // Continue to next iteration to try with a new random number
                continue;
              }
              
              // Re-throw other errors
              throw error;
            }
          }
          
          if (!newOrder) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create order",
            });
          }
          
          // Create order items
          const orderItemsData = items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            menuItemId: item.id,
            orderId: newOrder!.id, // Safe to use non-null assertion as we've checked above
          }));
          
          await tx.orderItem.createMany({
            data: orderItemsData,
          });
          
          // Create payment transaction record
          if (payment.paymentMethod === "mobile_money") {
            await tx.paymentTransaction.create({
              data: {
                orderId: newOrder!.id,
                amount: total,
                paymentMethod: PaymentMethod.MOBILE_MONEY,
                status: PaymentStatus.PENDING, // Payments start as pending until confirmed by restaurant
                transactionId: payment.transactionId,
                mobileNumber: payment.mobileNumber,
                providerName: payment.providerName,
                customerId: customer.id,
                restaurantId,
              },
            });
          }
          
          // Return the created order
          return newOrder!;
        });
        
        return {
          status: "success",
          data: {
            orderId: order.id,
            orderNumber: order.displayOrderNumber,
            createdAt: order.createdAt,
          },
          message: "Order placed successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error("Error creating order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to place order",
        });
      }
    }),
    
  /**
   * Get payment transactions for a restaurant
   * Takes restaurant ID and filters
   * Returns list of payment transactions with order details
   */
  getRestaurantPaymentTransactions: protectedProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        status: z.enum([PaymentStatus.PENDING, PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.REFUNDED]).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullable().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { restaurantId, status, limit, cursor } = input;
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view transactions",
        });
      }

      // Check if the user is authorized to view this restaurant's transactions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { restaurantManager: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Allow restaurant managers of this restaurant or admins
      if (user.role !== UserRole.ADMIN && 
          (user.role !== UserRole.RESTAURANT || 
           !user.restaurantManager || 
           user.restaurantManager.restaurantId !== restaurantId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to view these transactions",
        });
      }

      // Build query filter
      const filter: any = {
        restaurantId,
        ...(status && { status }),
      };

      // Build pagination
      const paginationOptions = {
        take: limit,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { createdAt: 'desc' as const },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  phoneNumber: true,
                  user: {
                    select: {
                      name: true,
                      email: true,
                    }
                  }
                }
              }
            }
          }
        }
      };

      try {
        // Get transactions with pagination
        const transactions = await prisma.paymentTransaction.findMany({
          where: filter,
          ...paginationOptions,
        });

        // Get the next cursor
        let nextCursor: string | null = null;
        if (transactions.length === limit) {
          nextCursor = transactions[transactions.length - 1].id;
        }

        return {
          transactions,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching payment transactions:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load payment transactions",
        });
      }
    }),

  /**
   * Update payment transaction status
   * Takes transaction ID and new status
   * Updates the payment transaction status (e.g., from PENDING to COMPLETED)
   */
  updatePaymentTransactionStatus: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
        status: z.enum([PaymentStatus.PENDING, PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.REFUNDED]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { transactionId, status, notes } = input;
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to update a transaction",
        });
      }

      // Get the transaction with restaurant ID
      const transaction = await prisma.paymentTransaction.findUnique({
        where: { id: transactionId },
        select: { restaurantId: true, id: true },
      });

      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      // Check if user is authorized to update this transaction
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { restaurantManager: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Allow restaurant managers of this restaurant or admins
      if (user.role !== UserRole.ADMIN && 
          (user.role !== UserRole.RESTAURANT || 
           !user.restaurantManager || 
           user.restaurantManager.restaurantId !== transaction.restaurantId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to update this transaction",
        });
      }

      try {
        // Update the transaction status
        const updatedTransaction = await prisma.paymentTransaction.update({
          where: { id: transactionId },
          data: {
            status,
            notes: notes ? (notes ? `${notes}\n` : "") + notes : undefined,
            updatedAt: new Date(),
          },
        });

        return {
          status: "success",
          data: updatedTransaction,
          message: `Payment status updated to ${status}`,
        };
      } catch (error) {
        console.error("Error updating payment transaction:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update payment status",
        });
      }
    }),

  /**
   * Get order details by display order number
   * Takes the display order number (e.g., #1234)
   * Returns order details with restaurant information
   */
  getOrderByDisplayNumber: protectedProcedure
    .input(
      z.object({
        displayOrderNumber: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { displayOrderNumber } = input;
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view order details",
        });
      }

      try {
        // Find the order with restaurant and items
        const order = await prisma.order.findUnique({
          where: { displayOrderNumber },
          include: {
            restaurant: {
              select: {
                name: true,
                id: true,
                imageUrl: true,
                description: true,
                preparationTime: true,
              }
            },
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
            paymentTransaction: true,
          },
        });

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        // Ensure user is authorized to view this order (either the customer or admin)
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { 
            customer: true,
            restaurantManager: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check user permissions
        const isOrderCustomer = user.customer?.id === order.customerId;
        const isRestaurantManager = user.restaurantManager?.restaurantId === order.restaurantId;
        const isAdmin = user.role === UserRole.ADMIN;

        if (!isOrderCustomer && !isRestaurantManager && !isAdmin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to view this order",
          });
        }

        return {
          order
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error("Error fetching order details:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load order details",
        });
      }
    }),
});
