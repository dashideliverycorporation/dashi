"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ICartContext, CartItem, CartState } from "@/types/cart";
import { toastNotification } from "@/components/custom/toast-notification";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Initial state for the cart
 */
const initialCartState: CartState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
  subtotal: 0,
};

/**
 * Create the cart context with default values
 */
export const CartContext = createContext<ICartContext>({
  state: initialCartState,
  addItem: () => {},
  clearCart: () => {},
  isCartEmpty: true,
  itemCount: 0,
});

/**
 * Props for the CartProvider component
 */
interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * CartProvider component that manages the cart state and provides it to child components
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<CartState>(initialCartState);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const [pendingItem, setPendingItem] = useState<{
    restaurantId: string;
    restaurantName: string;
    item: Omit<CartItem, "quantity">;
  } | null>(null);

  /**
   * Calculate if the cart is empty
   */
  const isCartEmpty = useMemo(() => state.items.length === 0, [state.items]);

  /**
   * Calculate the total number of items in the cart
   */
  const itemCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items]
  );

  /**
   * Calculate the subtotal based on items in the cart
   */
  const calculateSubtotal = useCallback((items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, []);

  /**
   * Load cart data from localStorage on initial render
   */
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("dashiCart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartState;
        setState(parsedCart);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  /**
   * Save cart data to localStorage whenever state changes
   */
  useEffect(() => {
    try {
      localStorage.setItem("dashiCart", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [state]);

  /**
   * Clear the cart state
   */
  const clearCart = useCallback(() => {
    setState(initialCartState);
    toastNotification.success(
      t("cart.cleared.title"),
      t("cart.cleared.message")
    );
  }, [t]);

  /**
   * Add an item to the cart
   */
  const addItem = useCallback(
    (
      restaurantId: string,
      restaurantName: string,
      item: Omit<CartItem, "quantity">
    ) => {
      // If cart has items from a different restaurant, show confirmation dialog
      if (
        state.restaurantId &&
        state.restaurantId !== restaurantId &&
        !isCartEmpty
      ) {
        setPendingItem({ restaurantId, restaurantName, item });
        setShowClearCartDialog(true);
        return;
      }

      setState((prevState) => {
        // Check if the item already exists in the cart
        const existingItemIndex = prevState.items.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Increase quantity if item already exists
          updatedItems = [...prevState.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          };
        } else {
          // Add new item with quantity 1
          updatedItems = [...prevState.items, { ...item, quantity: 1 }];
        }

        const newState = {
          restaurantId,
          restaurantName,
          items: updatedItems,
          subtotal: calculateSubtotal(updatedItems),
        };

        // Show toast notification
        toastNotification.success(
          t("cart.added.title"),
          // Using the defaultValue as a fallback if the translation key doesn't exist
          t("cart.added.message", {
            defaultValue: "Item added to your cart",
          }).replace("{{itemName}}", item.name)
        );

        return newState;
      });
    },
    [state.restaurantId, isCartEmpty, calculateSubtotal, t]
  );

  /**
   * Handle confirmation of clearing cart when adding item from different restaurant
   */
  const handleClearCartConfirm = useCallback(() => {
    if (pendingItem) {
      setState({
        restaurantId: pendingItem.restaurantId,
        restaurantName: pendingItem.restaurantName,
        items: [{ ...pendingItem.item, quantity: 1 }],
        subtotal: pendingItem.item.price,
      });

      setShowClearCartDialog(false);
      setPendingItem(null);

      toastNotification.success(
        t("cart.switched.title"),
        // Using the defaultValue as a fallback if the translation key doesn't exist
        t("cart.switched.message", {
          defaultValue: "Switched to a new restaurant",
        }).replace("{{restaurantName}}", pendingItem.restaurantName)
      );
    }
  }, [pendingItem, t]);

  /**
   * Handle cancellation of clearing cart
   */
  const handleClearCartCancel = useCallback(() => {
    setShowClearCartDialog(false);
    setPendingItem(null);
  }, []);

  /**
   * The cart context value to be provided to consumers
   */
  const contextValue = useMemo(
    () => ({
      state,
      addItem,
      clearCart,
      isCartEmpty,
      itemCount,
    }),
    [state, addItem, clearCart, isCartEmpty, itemCount]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
