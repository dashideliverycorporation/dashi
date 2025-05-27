"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

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
      )}
      {/* Cart Link */}
      <Link
        href="/cart"
        className={cn(
          linkClass("/cart"),
          mobile ? "w-full px-6 py-2 hover:bg-gray-100" : ""
        )}
      >
        <div className="flex items-center">
          {" "}
          <ShoppingCart className="h-5 w-5" />
          {mobile && <span className="ml-2">{t("nav.cart", "Cart")}</span>}
        </div>
      </Link>{" "}
      {/* Sign In Link */}
      <Link
        href="/signin"
        className={cn(
          linkClass("/signin"),
          mobile ? "w-full px-6 py-2 hover:bg-gray-100" : ""
        )}
      >
        {t("auth.signIn", "Sign In")}
      </Link>
      {/* Sign Up Link */}
      <Link
        href="/signup"
        className={cn(
          linkClass("/signup"),
          mobile ? "w-full px-6 py-2 hover:bg-gray-100" : ""
        )}
      >
        {" "}
        {!mobile ? (
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            {t("auth.signUp", "Sign Up")}
          </Button>
        ) : (
          t("auth.signUp", "Sign Up")
        )}
      </Link>
    </nav>
  );
}

export default NavLinks;
