/**
 * Shared order-related types for the Dashi application
 */

import { OrderStatus, Prisma } from "@/prisma/app/generated/prisma/client";

/**
 * Order item representation
 */
export interface OrderItem {
  id: string;
  name: string;
  price: number | Prisma.Decimal | any; // Support for Prisma.Decimal and other formats
  quantity: number;
  imageUrl?: string;
}

/**
 * Order data structure
 */
export interface Order {
  id: string;
  orderNumber: string;  // Display order number like #5822
  displayOrderNumber?: string; // Optional formatted display order number
  createdAt: Date;
  status: OrderStatus | string;  // Allow both enum and string formats
  // Both field names are supported for backwards compatibility - either can be used
  totalAmount?: number | Prisma.Decimal | any;  // Field name in new API responses
  total?: number | Prisma.Decimal | any;  // Field name in older API responses
  deliveryAddress: string;
  notes: string | null;
  cancellationReason?: string | null;  // Reason for cancellation when status is CANCELLED
  restaurant: {
    id: string;
    name: string;
    imageUrl?: string;  // Optional restaurant image
    deliveryFee?: number | Prisma.Decimal;  // Restaurant's delivery fee
  };
  items: OrderItem[];
  customer?: {
    id?: string;
    phoneNumber?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
    };
  };
  paymentTransaction?: {
    id?: string;
    transactionId?: string; // Reference number
    amount?: number | Prisma.Decimal;
    paymentMethod?: string;
    providerName?: string;  // Mobile money operator
    mobileNumber?: string;  // Mobile money number
    status?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
