/**
 * Order management router for the Dashi platform
 *
 * This router contains procedures for managing orders, including:
 * - Creating new orders
 * - Retrieving order information
 * - Updating order status
 */
import { protectedProcedure, router, restaurantProcedure, adminProcedure } from "../trpc";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { createOrderSchema } from "@/server/schemas/order.schema";
import { UserRole, PaymentMethod, PaymentStatus} from "@/prisma/app/generated/prisma/client";
import { z } from "zod";
import { sendHtmlEmail } from "@/lib/notifications/email";
import { sendSMSMessage, createOrderNotificationSMS } from "@/lib/notifications/sms";
import { createOrderNotificationEmail } from "@/lib/email/templates/order-notification";
import { createCustomerOrderConfirmationEmail } from "@/lib/email/templates/customer-order-confirmation";

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
        // Use a separate transaction for database operations only (no email/SMS)
        let newOrder;
        
        // Function to generate a random 4-digit number (between 1000-9999)
        const generateRandomOrderNumber = () => Math.floor(1000 + Math.random() * 9000);
        
        // Create the order with DB operations only in the transaction
        newOrder = await prisma.$transaction(async (tx) => {
          // Maximum number of retry attempts
          const MAX_RETRIES = 5;
          let retryCount = 0;
          let createdOrder = null;
          
          // Keep trying until we get a unique order number or reach max retries
          while (retryCount < MAX_RETRIES) {
            const randomNumber = generateRandomOrderNumber();
            const displayOrderNumber = `#${randomNumber}`;
            
            try {
              createdOrder = await tx.order.create({
                data: {
                  totalAmount: total.toString(), // Convert to string for proper Decimal handling
                  deliveryAddress: delivery.deliveryAddress,
                  customerNotes: delivery.notes || "", // Ensure customerNotes is not null/undefined
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
          
          if (!createdOrder) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create order",
            });
          }
          
          // Create order items
          const orderItemsData = items.map((item) => ({
            quantity: item.quantity,
            price: item.price.toString(), // Convert to string for Decimal
            menuItemId: item.id,
            orderId: createdOrder!.id, // Safe to use non-null assertion as we've checked above
          }));
          
          await tx.orderItem.createMany({
            data: orderItemsData,
          });
          
          // Create payment transaction record
          if (payment.paymentMethod === "mobile_money") {
            await tx.paymentTransaction.create({
              data: {
                orderId: createdOrder!.id,
                amount: total.toString(), // Convert to string for proper Decimal handling
                paymentMethod: PaymentMethod.MOBILE_MONEY,
                status: PaymentStatus.PENDING, // Payments start as pending until confirmed by restaurant
                transactionId: payment.transactionId,
                mobileNumber: payment.mobileNumber,
                providerName: payment.providerName || "", // Ensure providerName is not null/undefined
                customerId: customer.id,
                restaurantId,
              },
            });
          }
          
          return createdOrder;
        });
        
        // Order is now created, we can send notifications outside the transaction
        // These are non-critical operations that don't need to be atomic with the database changes
        
        // Send order notification email to restaurant
        const emailHtml = createOrderNotificationEmail({
          orderNumber: newOrder.displayOrderNumber,
          customerName: user.name || "Customer",
          customerEmail: user.email,
          customerPhone: user.customer?.phoneNumber,
          restaurantName: restaurant.name,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
          deliveryAddress: delivery.deliveryAddress,
          customerNotes: delivery.notes,
          orderDate: newOrder.createdAt,
          payment: payment.paymentMethod === "mobile_money" ? {
            method: PaymentMethod.MOBILE_MONEY,
            mobileNumber: payment.mobileNumber,
            providerName: payment.providerName,
            transactionId: payment.transactionId,
          } : undefined,
        });
        
        // Send email notification to restaurant
        if (restaurant.email) {
          try {
            await sendHtmlEmail(
              { email: `alvincalvin7@gmail.com`, name: restaurant.name }, // Recipient
              `New Order Received: ${newOrder.displayOrderNumber}`, // Subject
              emailHtml // HTML content
            );
            
            console.log(`Order notification email sent to ${restaurant.email} for order ${newOrder.displayOrderNumber}`);
          } catch (emailError) {
            console.error(`Failed to send email notification for order ${newOrder.displayOrderNumber}:`, emailError);
            // Non-critical error, continue with other operations
          }
        } else {
          console.warn(`No email address available for restaurant ${restaurant.name}. Order notification email not sent.`);
        }
        
        // Send order confirmation email to customer
        if (user.email) {
          try {
            // Create customer order confirmation email
            const customerEmailHtml = createCustomerOrderConfirmationEmail({
              orderNumber: newOrder.displayOrderNumber,
              customerName: user.name || "Customer",
              restaurantName: restaurant.name,
              restaurantImage: restaurant.imageUrl,
              restaurantPhone: restaurant.phoneNumber,
              items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              totalAmount: total,
              deliveryAddress: delivery.deliveryAddress,
              customerNotes: delivery.notes,
              orderDate: newOrder.createdAt,
              estimatedDeliveryTime: restaurant.preparationTime,
              payment: payment.paymentMethod === "mobile_money" ? {
                method: PaymentMethod.MOBILE_MONEY,
                mobileNumber: payment.mobileNumber,
                providerName: payment.providerName,
                transactionId: payment.transactionId,
              } : undefined,
            });
            
            // Send email to customer
            await sendHtmlEmail(
              { email: user.email, name: user.name || "Customer" }, // Recipient 
              `Order Confirmation: ${newOrder.displayOrderNumber}`, // Subject
              customerEmailHtml // HTML content
            );
            
            console.log(`Order confirmation email sent to ${user.email} for order ${newOrder.displayOrderNumber}`);
          } catch (emailError) {
            console.error(`Failed to send customer confirmation email for order ${newOrder.displayOrderNumber}:`, emailError);
            // Non-critical error, continue with other operations
          }
        } else {
          console.warn(`No email address available for customer. Order confirmation email not sent.`);
        }
        
        // Due to sms credit being expensive, we will not send SMS notifications for now. We can uncomment when we are ready for production
        // if (restaurant.phoneNumber) {
        //   try {
        //     // Create SMS message content
        //     const smsMessage = createOrderNotificationSMS({
        //       orderNumber: newOrder.displayOrderNumber,
        //       customerName: user.name || "Customer",
        //       restaurantName: restaurant.name,
        //       totalAmount: total,
        //       deliveryAddress: delivery.deliveryAddress,
        //     });
            
        //     // Send SMS
        //     const smsResponse = await sendSMSMessage({
        //       to: { phoneNumber: `+243849108485` },
        //       message: smsMessage
        //     });
              
        //     // Log the SMS response for monitoring and debugging
        //     console.log(`SMS API Response for order ${newOrder.displayOrderNumber}:`, JSON.stringify(smsResponse, null, 2));
        //     console.log(`Order notification SMS sent to +243849108485 for order ${newOrder.displayOrderNumber}`);
        //   } catch (smsError) {
        //     console.error(`Failed to send SMS notification for order ${newOrder.displayOrderNumber}:`, smsError);
        //     // Non-critical error, continue with other operations
        //   }
        // } else {
        //   console.warn(`No phone number available for restaurant ${restaurant.name}. Order notification SMS not sent.`);
        // }
        
        const order = newOrder;
        
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

  /**
   * Get orders for the current authenticated customer
   * Returns a list of orders with restaurant and order item details
   */
  getCustomerOrders: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "delivered", "failed"]).optional().default("pending"),
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(), // for pagination
      })
    )
    .query(async ({ input, ctx }) => {
      const { status, limit, cursor } = input;
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view your orders",
        });
      }

      try {
        // Get customer ID from user
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { customer: true },
        });

        if (!user || !user.customer) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only customers can view their orders",
          });
        }

        // Determine the order statuses to filter by
        let orderStatuses;
        switch (status) {
          case "pending":
            orderStatuses = ["PLACED", "PREPARING", "DISPATCHED"];
            break;
          case "delivered":
            orderStatuses = ["DELIVERED"];
            break;
          case "failed":
            orderStatuses = ["CANCELLED"];
            break;
          default:
            orderStatuses = ["PLACED", "PREPARING", "DISPATCHED", "DELIVERED", "CANCELLED"];
        }

        // Build the query
        const orders = await prisma.order.findMany({
          where: {
            customerId: user.customer.id,
            status: { in: orderStatuses as any[] },
          },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: limit + 1, // +1 to check if there are more items
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), // Skip the cursor if provided
        });

        // Check if there are more items
        let nextCursor: string | undefined = undefined;
        if (orders.length > limit) {
          const nextItem = orders.pop(); // Remove the extra item
          nextCursor = nextItem!.id; // Set the new cursor
        }

        // Format the orders to match the frontend model
        const formattedOrders = orders.map(order => ({
          id: order.id,
          orderNumber: order.displayOrderNumber,
          createdAt: order.createdAt,
          status: order.status,
          total: order.totalAmount,
          deliveryAddress: order.deliveryAddress || "",
          notes: order.customerNotes,
          restaurant: {
            id: order.restaurant.id,
            name: order.restaurant.name,
            imageUrl: order.restaurant.imageUrl,
          },
          items: order.orderItems.map(item => ({
            id: item.id,
            name: item.menuItem.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.menuItem.imageUrl,
          })),
        }));

        return {
          orders: formattedOrders,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error("Error fetching customer orders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load orders",
        });
      }
    }),

  /**
   * Get orders for a restaurant with pagination, sorting and filtering
   * Restaurant users can only access their own restaurant's orders
   */
  getRestaurantOrders: restaurantProcedure
    .input(
      z.object({
        restaurantId: z.string().cuid("Invalid restaurant ID"),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
        sortField: z.string().optional().default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
        filters: z
          .object({
            orderId: z.string().optional(),
            status: z.enum(["ALL", "PLACED", "PREPARING", "DISPATCHED", "DELIVERED", "CANCELLED"]).optional(),
            startDate: z.string().optional(), // ISO date string
            endDate: z.string().optional(), // ISO date string
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, sortField, sortOrder, filters, restaurantId } = input;
        const skip = (page - 1) * limit;
        const userId = ctx.session.user.id;
        
        // Verify that the user is associated with this restaurant
        const restaurantManager = await prisma.restaurantManager.findUnique({
          where: { userId },
          select: { restaurantId: true },
        });
        
        if (!restaurantManager || restaurantManager.restaurantId !== restaurantId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot access orders for other restaurants",
          });
        }
        
        // Build filter conditions
        const where: any = {
          restaurantId,
        };
        
        // Apply filters if provided
        if (filters) {
          // Filter by order ID (display number)
          if (filters.orderId) {
            where.displayOrderNumber = {
              contains: filters.orderId,
              mode: 'insensitive',
            };
          }
          
          // Filter by order status (if not "ALL")
          if (filters.status && filters.status !== "ALL") {
            where.status = filters.status;
          }
          
          // Filter by date range
          if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            
            if (filters.startDate) {
              where.createdAt.gte = new Date(filters.startDate);
            }
            
            if (filters.endDate) {
              // Add 1 day to include the end date fully
              const endDate = new Date(filters.endDate);
              endDate.setDate(endDate.getDate() + 1);
              where.createdAt.lt = endDate;
            }
          }
        }
        
        // Count total matching orders for pagination
        const total = await prisma.order.count({ where });
        
        // Get paginated orders with customer, restaurant, and order items
        const orders = await prisma.order.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            [sortField]: sortOrder,
          },
          include: {
            customer: {
              select: {
                id: true,
                phoneNumber: true,
                address: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  }
                }
              },
            },
            restaurant: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                deliveryFee: true,  // Explicitly include deliveryFee
              }
            },
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                  },
                },
              },
            },
            paymentTransaction: true,
          },
        });
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        
        return {
          orders,
          pagination: {
            total,
            pageSize: limit,
            currentPage: page,
            totalPages,
          },
        };
      } catch (error) {
        console.error("Error getting restaurant orders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch restaurant orders",
          cause: error,
        });
      }
    }),
    
  /**
   * Update order status
   * Restaurant users can only update status of orders for their own restaurant
   */
  updateOrderStatus: restaurantProcedure
    .input(
      z.object({
        orderId: z.string().cuid("Invalid order ID"),
        status: z.enum(["PLACED", "PREPARING", "DISPATCHED", "DELIVERED", "CANCELLED"]),
        cancellationReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { orderId, status, cancellationReason } = input;
        const userId = ctx.session.user.id;
        
        // First, get the order to verify it belongs to the restaurant
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          select: {
            id: true,
            restaurantId: true,
          },
        });
        
        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }
        
        // Verify that the user is associated with this restaurant
        const restaurantManager = await prisma.restaurantManager.findUnique({
          where: { userId },
          select: { restaurantId: true },
        });
        
        if (!restaurantManager || restaurantManager.restaurantId !== order.restaurantId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot update orders for other restaurants",
          });
        }
        
        // Prepare update data including status and optional cancellation reason
        const updateData: any = { 
          status,
          // Include cancellation reason only when status is CANCELLED and reason is provided
          ...(status === "CANCELLED" && cancellationReason 
            ? { cancellationReason } 
            : {})
        };
        
        // If changing to a status other than CANCELLED, clear any existing cancellation reason
        if (status !== "CANCELLED") {
          updateData.cancellationReason = null;
        }
        
        // Update the order status
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: updateData,
          include: {
            customer: {
              select: {
                id: true,
                phoneNumber: true,
                address: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  }
                }
              },
            },
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    imageUrl: true,
                  },
                },
              },
            },
            paymentTransaction: true,
          },
        });
        
        return { success: true, order: updatedOrder };
      } catch (error) {
        console.error("Error updating order status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order status",
          cause: error,
        });
      }
    }),

  /**
   * Get all orders for admin dashboard
   * 
   * This procedure returns all orders across all restaurants with filters, sorting, and pagination.
   * Only administrators can access this endpoint.
   */
  getAllOrders: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(10),
        sortField: z.string().default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        filters: z.object({
          orderId: z.string().optional(),
          status: z.enum(["ALL", "PLACED", "PREPARING", "DISPATCHED", "DELIVERED", "CANCELLED"]).optional(),
          restaurantName: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional()
        }).optional()
      })
    )
    .query(async ({ input }) => {
      try {
        const { page, limit, sortField, sortOrder, filters } = input;
        const skip = (page - 1) * limit;

        // Build where clause based on filters
        let where: any = {};
        
        if (filters) {
          // Filter by order ID (display order number)
          if (filters.orderId) {
            where.displayOrderNumber = {
              contains: filters.orderId,
              mode: 'insensitive'
            };
          }
          
          // Filter by order status
          if (filters.status && filters.status !== "ALL") {
            where.status = filters.status;
          }
          
          // Filter by restaurant name
          if (filters.restaurantName) {
            where.restaurant = {
              name: {
                contains: filters.restaurantName,
                mode: 'insensitive'
              }
            };
          }

          // Filter by date range
          if (filters.startDate) {
            where.createdAt = {
              ...where.createdAt,
              gte: new Date(filters.startDate)
            };
          }

          if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setDate(endDate.getDate() + 1); // Include the entire end date

            where.createdAt = {
              ...where.createdAt,
              lt: endDate
            };
          }
        }

        // Execute query with filters, sorting, and pagination
        const [orders, total] = await Promise.all([
          prisma.order.findMany({
            skip,
            take: limit,
            where,
            orderBy: { [sortField]: sortOrder },
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  deliveryFee: true
                }
              },
              customer: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              },
              orderItems: {
                include: {
                  menuItem: {
                    select: {
                      id: true,
                      name: true,
                      imageUrl: true
                    }
                  }
                }
              },
              paymentTransaction: true
            }
          }),
          prisma.order.count({ where })
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);

        return {
          orders,
          pagination: {
            total,
            page,
            limit,
            totalPages
          }
        };
      } catch (error) {
        console.error("Error fetching all orders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch orders"
        });
      }
    }),
});
