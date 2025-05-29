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
