"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { ShoppingCart } from "lucide-react";
import CartSheet from "@/components/cart/CartSheet";
import { useCart } from "@/components/cart/use-cart";
import { Badge } from "../ui/badge";

interface NavLinksProps {
  className?: string;
  mobile?: boolean;
}

/**
 * Navigation links component that shows different options based on authentication state
 */
export function NavLinks({ className, mobile = false }: NavLinksProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  // Check if a link is active
  const isActive = (path: string) => pathname === path;

  // Base styles for navigation links
  const linkBaseClass = "font-medium transition-colors hover:text-orange-600";
  const linkActiveClass = "text-orange-500";

  const linkClass = (path: string) =>
    cn(linkBaseClass, {
      [linkActiveClass]: isActive(path),
    });

  // Container class for navigation
  const containerClass = cn(
    "flex items-center",
    {
      "flex-row gap-x-4": !mobile,
      "flex-col gap-y-6 w-full": mobile,
    },
    className
  );

  return (
    <nav className={containerClass}>
      {" "}
      {/* Home Link - Only for mobile */}
      {mobile && (
        <Link
          href="/"
          className={cn(linkClass("/"), "w-full px-6 py-2 hover:bg-gray-100")}
        >
          {t("nav.home", "Home")}
        </Link>
      )}{" "}
      {/* Cart Link */}{" "}
      <div
        className={cn(
          "flex items-center cursor-pointer",
          mobile ? "w-full px-6 py-2 hover:bg-gray-100" : ""
        )}
        onClick={() => setIsCartOpen(true)}
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-orange-500 text-[10px] text-white min-w-[18px] h-[18px] p-0 hover:bg-orange-600"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </div>
        {mobile && <span className="ml-2">{t("nav.cart", "Cart")}</span>}
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </nav>
  );
}

export default NavLinks;
