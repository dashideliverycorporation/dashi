/**
 * Order Status Constants
 * 
 * Simple string constants for order statuses to ensure consistency across the application.
 */
export const ORDER_STATUS = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  DISPATCHED: "DISPATCHED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

/**
 * Type definition for order status values
 */
export type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];