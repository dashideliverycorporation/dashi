/**
 * Cart type definitions for the Dashi platform
 *
 * Contains types for shopping cart state and context used in the frontend
 */

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/**
 * Represents the state of the shopping cart
 */
export interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  subtotal: number;
}

/**
 * Context for cart operations throughout the application
 */
export interface ICartContext {
  state: CartState;
  addItem: (
    restaurantId: string,
    restaurantName: string,
    item: Omit<CartItem, "quantity">
  ) => void;
  clearCart: () => void;
  isCartEmpty: boolean;
  itemCount: number;
}

/**
 * Props for the Add to Cart button component
 */
export interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  restaurantId: string;
  restaurantName: string;
}
