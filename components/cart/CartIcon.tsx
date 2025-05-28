"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../cart/use-cart";
import { cn } from "@/lib/utils";
import CartSheet from "./CartSheet";

interface CartIconProps {
  mobile?: boolean;
}

/**
 * Cart icon component with item count indicator
 * Shows the number of items in the cart and opens cart sheet when clicked
 */
export const CartIcon: React.FC<CartIconProps> = ({ mobile = false }) => {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "relative rounded p-2 transition-all duration-200 hover:bg-orange-100 hover:text-orange-600 hover:shadow-sm active:scale-95 cursor-pointer",
          mobile ? "flex items-center p-0" : "hidden md:flex"
        )}
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-0 -right-0 flex items-center justify-center rounded-full bg-orange-500 text-[10px] text-white min-w-[18px] h-[18px] p-0 hover:bg-orange-600"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default CartIcon;
