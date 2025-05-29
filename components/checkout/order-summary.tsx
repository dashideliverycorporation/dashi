"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/components/cart/use-cart";
import { CartItem } from "@/types/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

/**
 * Props for the OrderSummary component
 */
interface OrderSummaryProps {
  /**
   * Optional className for styling the component
   */
  className?: string;
  /**
   * Boolean to indicate if the form is currently submitting
   */
  isSubmitting?: boolean;
  /**
   * Whether to show the checkout button (defaults to true)
   */
  showCheckoutButton?: boolean;
}

/**
 * OrderSummary component displays a summary of cart contents
 * including item names, quantities, prices, and the total
 *
 * @component
 */
export function OrderSummary({
  className = "",
  isSubmitting = false,
  showCheckoutButton = true,
}: OrderSummaryProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { state } = useCart();
  const { items, subtotal } = state;

  return (
    <Card className={`overflow-hidden ${className} shadow-sm p-4`}>
      <CardHeader className="p-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            {t("checkout.orderSummary")}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-2">
        {/* Items list */}
        {items.length > 0 ? (
          <div>
            <ScrollArea className="max-h-[250px] pr-2">
              <ul className="space-y-4 mb-6">
                {items.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </ul>
            </ScrollArea>

            {/* Order summary calculations */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("checkout.subtotal")}
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("cart.deliveryFee", "Delivery fee")}
                  </span>
                  <span className="text-gray-600">FREE</span>
                </div>

                <div className="pt-3 mt-2 border-t border-gray-200">
                  <div className="flex justify-between font-bold text-base">
                    <span>{t("checkout.total")}</span>
                    <span className="text-orange-600">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {session?.user?.email && (
                <p className="text-sm text-gray-600 mt-2">
                  {session.user.email}
                </p>
              )}
            </div>

            {showCheckoutButton && (
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full py-4 font-bold transition-all text-white"
                  aria-label={t("checkout.continueToPayment")}
                  disabled={isSubmitting}
                  onClick={() => {
                    document
                      .querySelector("form")
                      ?.dispatchEvent(
                        new Event("submit", { bubbles: true, cancelable: true })
                      );
                  }}
                >
                  {isSubmitting
                    ? t("checkout.processing")
                    : t("checkout.continueToPayment")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t("cart.empty")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Props for the OrderItem component
 */
interface OrderItemProps {
  /**
   * The cart item to display
   */
  item: CartItem;
}

/**
 * OrderItem component displays a single item in the order summary
 *
 * @component
 */
function OrderItem({ item }: OrderItemProps) {
  const { name, price, quantity, imageUrl } = item;
  const itemTotal = price * quantity;

  return (
    <li className="flex items-center">
      <div className="flex items-start gap-3 flex-1">
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="text-sm text-gray-400">
              {name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className="font-medium text-sm">{name}</p>
            <p className="ml-2 font-medium">${itemTotal.toFixed(2)}</p>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <p>Quantity: {quantity}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default OrderSummary;
