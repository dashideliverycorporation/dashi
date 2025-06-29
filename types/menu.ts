/**
 * Menu Item Types
 *
 * Contains type definitions for menu items used throughout the application
 */

import { JSX } from "react/jsx-runtime";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Type representing a menu item with category information
 */
export type MenuItemWithCategory = {
  id: string;
  name: string;
  description: string | null;
  price: number | string | Decimal;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  restaurantId: string;
  deletedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

/**
 * Type for menu item table column
 */
export type MenuItemTableColumn = {
  id: string;
  accessorKey: keyof MenuItemWithCategory | string;
  header: string;
  cell?: (info: any) => JSX.Element | string | null;
  enableSorting?: boolean;
};

/**
 * Type for menu item filtering state
 */
export type MenuItemFilterState = {
  name: string;
  category: string;
};