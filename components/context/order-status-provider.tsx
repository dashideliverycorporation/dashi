"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { OrderStatus } from "@/prisma/app/generated/prisma/client";

/**
 * Interface for order status update data
 */
interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  cancellationReason?: string;
  displayOrderNumber?: string;
}

/**
 * Interface for the order status context
 */
interface IOrderStatusContext {
  /**
   * Map of order IDs to their current status
   */
  orderStatuses: Map<string, OrderStatusUpdate>;
  
  /**
   * Update the status of an order
   */
  updateOrderStatus: (update: OrderStatusUpdate) => void;
  
  /**
   * Get the current status of an order by ID
   */
  getOrderStatus: (orderId: string) => OrderStatusUpdate | undefined;
  
  /**
   * Get the current status of an order by display number
   */
  getOrderStatusByDisplayNumber: (displayNumber: string) => OrderStatusUpdate | undefined;
  
  /**
   * Clear all order statuses (useful for logout)
   */
  clearOrderStatuses: () => void;
}

/**
 * Create the order status context with default values
 */
const OrderStatusContext = createContext<IOrderStatusContext>({
  orderStatuses: new Map(),
  updateOrderStatus: () => {},
  getOrderStatus: () => undefined,
  getOrderStatusByDisplayNumber: () => undefined,
  clearOrderStatuses: () => {},
});

/**
 * Props for the OrderStatusProvider component
 */
interface OrderStatusProviderProps {
  children: React.ReactNode;
}

/**
 * OrderStatusProvider component that manages order status state across the application
 * This allows real-time status updates between restaurant dashboard and customer order confirmation
 */
export const OrderStatusProvider: React.FC<OrderStatusProviderProps> = ({ children }) => {
  const [orderStatuses, setOrderStatuses] = useState<Map<string, OrderStatusUpdate>>(new Map());

  /**
   * Update the status of an order
   */
  const updateOrderStatus = useCallback((update: OrderStatusUpdate) => {
    setOrderStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(update.orderId, update);
      return newMap;
    });
  }, []);

  /**
   * Get the current status of an order by ID
   */
  const getOrderStatus = useCallback((orderId: string) => {
    return orderStatuses.get(orderId);
  }, [orderStatuses]);

  /**
   * Get the current status of an order by display number
   */
  const getOrderStatusByDisplayNumber = useCallback((displayNumber: string) => {
    // Find order by display number
    for (const [, orderUpdate] of orderStatuses) {
      if (orderUpdate.displayOrderNumber === displayNumber) {
        return orderUpdate;
      }
    }
    return undefined;
  }, [orderStatuses]);

  /**
   * Clear all order statuses
   */
  const clearOrderStatuses = useCallback(() => {
    setOrderStatuses(new Map());
  }, []);

  const contextValue: IOrderStatusContext = {
    orderStatuses,
    updateOrderStatus,
    getOrderStatus,
    getOrderStatusByDisplayNumber,
    clearOrderStatuses,
  };

  return (
    <OrderStatusContext.Provider value={contextValue}>
      {children}
    </OrderStatusContext.Provider>
  );
};

/**
 * Custom hook to use the order status context
 */
export const useOrderStatus = (): IOrderStatusContext => {
  const context = useContext(OrderStatusContext);
  if (!context) {
    throw new Error("useOrderStatus must be used within an OrderStatusProvider");
  }
  return context;
};
