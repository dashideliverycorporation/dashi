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
import { UserRole, PaymentMethod, PaymentStatus, OrderStatus } from "@/prisma/app/generated/prisma/client";
import { z } from "zod";
import { sendHtmlEmail } from "@/lib/notifications/email";
import { sendSMSMessage, createOrderNotificationSMS } from "@/lib/notifications/sms";

/**
 * Creates HTML email template for order notifications
 */
const createOrderNotificationEmail = (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  restaurantName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  customerNotes?: string;
  orderDate: Date;
  payment?: {
    method: PaymentMethod;
    mobileNumber?: string;
    providerName?: string;
    transactionId?: string;
  };
}) => {
  const itemsHtml = orderData.items
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: left;">${item.name}</td>
          <td style="padding: 12px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 12px; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - ${orderData.orderNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; margin-bottom: 30px; border-radius: 10px;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🍕 New Order Alert!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">You have received a new order on Dashi</p>
      </div>

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #f97316; margin-top: 0; font-size: 22px;">Order Details</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Restaurant:</strong> ${orderData.restaurantName}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderData.orderDate.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Customer Information</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${orderData.customerName}</p>
        ${orderData.customerEmail ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customerEmail}</p>` : ''}
        ${orderData.customerPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.customerPhone}</p>` : ''}
        <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${orderData.deliveryAddress}</p>
        ${orderData.customerNotes ? `<p style="margin: 5px 0;"><strong>Special Instructions:</strong> ${orderData.customerNotes}</p>` : ''}
      </div>

      ${orderData.payment ? `
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Payment Information</h3>
        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.payment.method}</p>
        ${orderData.payment.mobileNumber ? `<p style="margin: 5px 0;"><strong>Mobile Number:</strong> ${orderData.payment.mobileNumber}</p>` : ''}
        ${orderData.payment.providerName ? `<p style="margin: 5px 0;"><strong>Operator:</strong> ${orderData.payment.providerName}</p>` : ''}
        ${orderData.payment.transactionId ? `<p style="margin: 5px 0;"><strong>Reference Number:</strong> ${orderData.payment.transactionId}</p>` : ''}
      </div>
      ` : ''}

      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #f97316; margin-top: 0;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #f97316;">
          <p style="text-align: right; font-size: 18px; font-weight: bold; color: #f97316; margin: 0;">
            Total Amount: $${orderData.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <h3 style="color: #92400e; margin-top: 0;">⚡ Action Required</h3>
        <p style="color: #92400e; margin: 0;">Please log in to your restaurant dashboard to confirm this order and update its status.</p>
      </div>

      <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          This email was sent from <strong style="color: #f97316;">Dashi</strong> - Your Food Delivery Platform
        </p>
        <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
          Please do not reply to this email. For support, contact us through your restaurant dashboard.
        </p>
      </div>
    </body>
    </html>
  `;
};

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
              // Non-critical error, continue with SMS notification and order creation
            }
          } else {
            console.warn(`No email address available for restaurant ${restaurant.name}. Order notification email not sent.`);
          }
          
          // Send SMS notification to restaurant
          if (restaurant.phoneNumber) {
            try {
              // Create SMS message content
              const smsMessage = createOrderNotificationSMS({
                orderNumber: newOrder.displayOrderNumber,
                customerName: user.name || "Customer",
                restaurantName: restaurant.name,
                totalAmount: total,
                deliveryAddress: delivery.deliveryAddress,
              });
              
              // Send SMS
              const smsResponse = await sendSMSMessage({
                to: { phoneNumber: `+243849108485`},
                message: smsMessage
              });
              
              // Log the SMS response to console for debugging
              console.log(`SMS Response for order ${newOrder.displayOrderNumber}:`, JSON.stringify(smsResponse, null, 2));
              console.log(`Order notification SMS sent to ${restaurant.phoneNumber} for order ${newOrder.displayOrderNumber}`);
            } catch (smsError) {
              console.error(`Failed to send SMS notification for order ${newOrder.displayOrderNumber}:`, smsError);
              // Non-critical error, continue with order creation
            }
          } else {
            console.warn(`No phone number available for restaurant ${restaurant.name}. Order notification SMS not sent.`);
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
            orderStatuses = ["NEW", "PREPARING", "READY"];
            break;
          case "delivered":
            orderStatuses = ["COMPLETED"];
            break;
          case "failed":
            orderStatuses = ["CANCELLED"];
            break;
          default:
            orderStatuses = ["NEW", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
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
            status: z.enum(["ALL", "NEW", "PREPARING", "READY", "COMPLETED", "CANCELLED"]).optional(),
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
