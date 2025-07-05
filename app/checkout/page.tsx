"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/components/cart/use-cart";
import { toastNotification } from "@/components/custom/toast-notification";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Map,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { CheckoutFormValues } from "@/server/schemas/order.schema";
import OrderSummary from "@/components/checkout/order-summary";
import { CheckoutForm } from "@/components/checkout/checkout-form";

/**
 * Checkout page component
 * Integrates OrderSummary and CheckoutForm components
 * Handles authentication, cart state, and form submission
 * @returns Checkout Page
 */
export default function CheckoutPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { status } = useSession();
  const { state } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the cart is empty
  const isCartEmpty = state.items.length === 0;
  
  // Protect the route from unauthenticated users and empty carts
  useEffect(() => {
    // Check authentication status - handled by useSession
    
    // Check if cart is empty
    if (status !== "loading" && isCartEmpty) {
      router.push("/");
      toastNotification.info(
        t("cart.empty", "Your cart is empty"),
        t("checkout.emptyCartMessage", "Your cart is empty. Please add items before proceeding to checkout.")
      );
      return;
    }
    
    // Check if we just returned from authentication (via localStorage flag)
    const authReturn = localStorage.getItem('authCallbackUrl') === '/checkout';
    if (authReturn && status === 'authenticated') {
      console.debug("Detected return to checkout after authentication");
      localStorage.removeItem('authCallbackUrl');
    }
  }, [status, isCartEmpty, router, t]);
  
  // Handle authentication redirection
  useEffect(() => {
    if (status === "unauthenticated") {
      // Save the current URL for redirection after authentication
      localStorage.setItem('authCallbackUrl', '/checkout');
      console.debug("Saving /checkout to localStorage and redirecting to signin");
      
      // Redirect to sign in page
      router.push("/signin");
      
      // Show notification
      toastNotification.info(
        t("auth.loginRequired", "Login Required"),
        t("checkout.loginRequired", "Please login to proceed to checkout")
      );
    }
  }, [status, router, t]);

  // Handle form submission
  const handleSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);

    try {
      // Store delivery information in session storage for use in payment page
      sessionStorage.setItem("deliveryDetails", JSON.stringify(data));

      console.log("Delivery details:", {
        ...data,
        items: state.items,
        restaurantId: state.restaurantId,
        total: state.subtotal,
      });

      // Redirect to payment page after a brief delay to show processing state
      setTimeout(() => {
        setIsSubmitting(false);
        router.push("/payment");
      }, 800);
    } catch (error) {
      console.error("Error processing delivery details:", error);
      setIsSubmitting(false);
      toastNotification.error(
        t("common.error", "An error occurred"),
        t(
          "checkout.errorProcessingDetails",
          "Error processing your details. Please try again."
        )
      );
    }
  };

  // Loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <ShoppingBag className="h-12 w-12 text-orange-500" />
          <h1 className="text-xl font-semibold">{t("common.loading")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-6xl">
      {/* Checkout Progress Steps */}
      {/* Desktop version */}
      <div className="mb-8 hidden md:flex items-center justify-center">
        <div className="w-full max-w-3xl relative">
          {/* Horizontal connecting lines centered vertically */}
          <div className="absolute top-4 left-3 right-0 flex items-center">
            <div className="h-0.5 w-[40%] bg-orange-500"></div>
            <div className="h-0.5 w-[90%] bg-gray-200"></div>
          </div>

          {/* Circles and labels */}
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mb-1 shadow-sm">
                <span className="text-sm">✓</span>
              </div>
              <span className="text-xs text-gray-600">
                {t("cart.title", "Your Cart")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mb-1 shadow-sm">
                <span className="text-sm">2</span>
              </div>
              <span className="text-xs text-gray-600">
                {t("checkout.deliveryDetails", "Delivery Details")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center mb-1 shadow-sm">
                <span className="text-sm text-gray-500">3</span>
              </div>
              <span className="text-xs text-gray-600">
                {t("checkout.paymentMethod", "Payment Method")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center mb-1 shadow-sm">
                <span className="text-sm text-gray-500">4</span>
              </div>
              <span className="text-xs text-gray-600">
                {t("order.confirmation", "Order Confirmation")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="mb-6 md:hidden">
        <div className="relative px-2">
          {/* Horizontal connecting lines centered vertically */}
          <div className="absolute top-4 left-2 right-0 flex">
            <div className="h-0.5 w-1/3 bg-orange-500"></div>
            <div className="h-0.5 w-2/3 bg-gray-200"></div>
          </div>

          {/* Step indicators with icons */}
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mb-1 shadow-sm">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mb-1 shadow-sm">
                <Map className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center mb-1 shadow-sm">
                <CreditCard className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center mb-1 shadow-sm">
                <CheckCircle className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="gap-2 hover:bg-orange-50 p-0 bg-white rounded-full shadow-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex gap-6 overflow-hidden">
        {/* Checkout Form */}
        <div className="p-4 lg:p-8 bg-white rounded-lg mb-8 w-full">
          <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        {/* Order Summary */}
        <div className="hidden lg:block lg:w-[400px]">
          <OrderSummary
            className="border-0 shadow-none bg-transparent"
            isSubmitting={isSubmitting}
          />

          {/* Back to shopping button on mobile */}
          <div className="mt-4 lg:hidden">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("checkout.backToCart", "Back to Cart")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
