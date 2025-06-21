"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/use-cart";
import { AddToCartButtonProps } from "@/types/cart";

/**
 * Button component for adding items to the shopping cart
 *
 * @param props Component props containing item details and restaurant information
 * @returns A button component that adds the item to cart when clicked
 */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  restaurantId,
  restaurantName,
  deliveryFee = 0,
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(restaurantId, restaurantName, item, deliveryFee);
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className="flex items-center justify-center rounded-full h-8 w-8 bg-orange-500 hover:bg-orange-300 border border-orange-200"
      onClick={handleAddToCart}
      aria-label="Add to cart"
    >
      <Plus className="h-4 w-4 text-white" />
    </Button>
  );
};

export default AddToCartButton;
