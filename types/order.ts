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
  createdAt: Date;
  status: OrderStatus | string;  // Allow both enum and string formats
  total: number | Prisma.Decimal | any;  // Support for Prisma.Decimal and other formats
  deliveryAddress: string;
  notes: string | null;
  restaurant: {
    id: string;
    name: string;
    imageUrl?: string;  // Optional restaurant image
  };
  items: OrderItem[];
}
