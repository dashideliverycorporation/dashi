/**
 * Restaurant type definitions for the Dashi platform
 * 
 * Contains types for restaurant data and table structure used in admin dashboard
 */

import { JSX } from "react/jsx-runtime";

/**
 * Type representing a restaurant with associated users for listing in admin dashboard
 */
export type RestaurantWithUsers = {
  id: string;
  name: string;
  description: string | null;
  email: string | null;
  phoneNumber: string;
  address: string | null;
  serviceArea: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  managers: Array<{
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
};

/**
 * Type for restaurant table column in admin dashboard
 */
export type RestaurantTableColumn = {
  id: string;
  accessorKey: keyof RestaurantWithUsers | string;
  header: string;
  cell?: (info: any) => JSX.Element | string | null;
  enableSorting?: boolean;
};

/**
 * Type for restaurant table filtering state
 */
export type RestaurantFilterState = {
  name: string;
};
