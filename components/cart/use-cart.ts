"use client";

import { useContext } from "react";
import { CartContext } from "./cart-provider";
import { CartItem, ICartContext } from "@/types/cart";

/**
 * Custom hook for accessing and manipulating cart state
 * 
 * This hook provides access to the cart context and adds additional
 * helper functions for common cart operations
 */
export function useCart(): ICartContext & {
  /**
   * Get the current number of a specific item in the cart
   */
  getItemQuantity: (itemId: string) => number;
  
  /**
   * Check if a specific item is already in the cart
   */
  isItemInCart: (itemId: string) => boolean;
  
  /**
   * Format the subtotal as a currency string
   */
  formattedSubtotal: string;
  
  /**
   * Get the active restaurant information
   */
  activeRestaurant: {
    id: string | null;
    name: string | null;
  };
  
  /**
   * Check if the cart contains items from a specific restaurant
   */
  isFromRestaurant: (restaurantId: string) => boolean;
} {
  const cartContext = useContext(CartContext);
  
  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  /**
   * Get the quantity of a specific item in the cart
   */
  const getItemQuantity = (itemId: string): number => {
    const item = cartContext.state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  /**
   * Check if a specific item is in the cart
   */
  const isItemInCart = (itemId: string): boolean => {
    return cartContext.state.items.some(item => item.id === itemId);
  };
  
  /**
   * Format the subtotal as a currency string
   * Using USD formatting as default
   */
  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cartContext.state.subtotal);
  
  /**
   * Get active restaurant information
   */
  const activeRestaurant = {
    id: cartContext.state.restaurantId,
    name: cartContext.state.restaurantName,
  };
  
  /**
   * Check if the cart contains items from a specific restaurant
   */
  const isFromRestaurant = (restaurantId: string): boolean => {
    return cartContext.state.restaurantId === restaurantId;
  };

  // Return the original context plus our additional helper functions
  return {
    ...cartContext,
    getItemQuantity,
    isItemInCart,
    formattedSubtotal,
    activeRestaurant,
    isFromRestaurant,
  };
}

export default useCart;
