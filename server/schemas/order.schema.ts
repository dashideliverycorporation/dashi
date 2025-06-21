import { z } from "zod";

/**
 * Schema for checkout form validation
 */
export const checkoutSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  deliveryAddress: z
    .string()
    .min(1, { message: "Delivery address is required" }),
  notes: z.string().optional(),
});

/**
 * Type for checkout form values
 */
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

/**
 * Schema for mobile money payment details
 */
export const mobileMoneyPaymentSchema = z.object({
  paymentMethod: z.literal("mobile_money"),
  mobileNumber: z.string().min(10),
  transactionId: z.string().min(6).max(20),
  providerName: z.string().min(2).optional(),
});

/**
 * Schema for cart item used in order creation
 */
export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().optional(),
});

/**
 * Schema for creating a new order
 */
export const createOrderSchema = z.object({
  // Customer delivery information
  delivery: checkoutSchema,
  
  // Payment details - currently only supporting mobile money
  payment: mobileMoneyPaymentSchema,
  
  // Order items from cart
  items: z.array(cartItemSchema),
  
  // Restaurant ID
  restaurantId: z.string(),
  
  // Total amount including delivery fee
  total: z.number().positive(),
});

/**
 * Type for create order input
 */
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
