"use client";

import React from "react";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "./use-cart";
import { useTranslation } from "@/hooks/useTranslation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toastNotification } from "@/components/custom/toast-notification";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Cart sheet component that shows a slide-out drawer with cart contents
 */
export const CartSheet: React.FC<CartSheetProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    state,
    isCartEmpty,
    activeRestaurant,
    addItem,
    decreaseItemQuantity,
    removeItem,
  } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[400px] p-0 flex flex-col bg-gray-100">
        <SheetHeader>
          <div className="flex items-center justify-between my-0 py-0">
            <SheetTitle className="text-xl font-bold m-0 flex gap-2 items-center justify-center">
              <ShoppingCart className="h-6 w-6" />{" "}
              <span>{t("cart.title", "My order")}</span>
            </SheetTitle>
          </div>
          {activeRestaurant.name && !isCartEmpty && (
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">{activeRestaurant.name}</span>
            </div>
          )}
        </SheetHeader>

        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center flex-grow py-12 px-6">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">
                {t("cart.empty.title", "Your cart is empty")}
              </h2>
              <p className="text-gray-500 text-sm max-w-[250px] mx-auto">
                {t(
                  "cart.empty.description",
                  "Looks like you haven't added any delicious meals to your order yet."
                )}
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow overflow-hidden">
              <div className="py-3 flex flex-col">
                {state.items.map((item) => (
                  <div key={item.id} className="px-2 py-2">
                    <div className="flex items-start p-2 rounded-lg bg-background">
                      {item.imageUrl && (
                        <div className="w-24 h-24 relative rounded-md overflow-hidden mr-4 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-medium text-base mb-1">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <div className="flex items-center">
                            <span>${item.price.toFixed(2)}</span>
                            <span className="mx-1">×</span>
                            <span>{item.quantity}</span>
                          </div>
                          <span className="font-medium text-black">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center">
                          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full p-0 hover:bg-orange-100 text-orange-500"
                              onClick={() => decreaseItemQuantity(item.id)}
                              aria-label="Decrease quantity"
                            >
                              <span className="font-bold">-</span>
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full p-0 hover:bg-orange-100 text-orange-500"
                              onClick={() =>
                                addItem(
                                  state.restaurantId!,
                                  state.restaurantName!,
                                  {
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    imageUrl: item.imageUrl,
                                  }
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              <span className="font-bold">+</span>
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full p-0 hover:bg-gray-100 ml-auto"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t py-4 px-6 bg-background shadow-md text-sm">
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {t("cart.subtotal", "Dishes")}
                  </span>
                  <span className="font-medium">
                    $ {state.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {t("cart.deliveryFee", "Delivery fee")}
                  </span>
                  <span className="font-medium">$ {state.deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center font-bold mt-3 pt-3 border-t">
                  <span>{t("cart.total", "Total")}</span>
                  <span>$ {(state.subtotal + state.deliveryFee).toFixed(2)}</span>
                </div>
              </div>{" "}
              <Button
                className="w-full py-6 bg-orange-500 hover:bg-orange-600 hover:shadow-md transition-all duration-200 active:scale-95 text-white font-medium rounded-md mt-2"
                onClick={() => {
                  if (!session) {
                    // Redirect to login with return URL to checkout
                    router.push(
                      `/signin?returnUrl=${encodeURIComponent("/checkout")}`
                    );
                    onOpenChange(false); // Close cart sheet
                    toastNotification.info(
                      t("auth.loginRequired"),
                      t("checkout.loginRequired")
                    );
                  } else {
                    // User is logged in, proceed to checkout
                    router.push("/checkout");
                    onOpenChange(false); // Close cart sheet
                  }
                }}
              >
                {t("cart.checkout", "Proceed to Checkout")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
