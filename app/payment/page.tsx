"use client";

import { useEffect, useState } from "react";
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
import {
  PaymentForm,
  type PaymentFormValues,
} from "@/components/payment/payment-form";
import OrderSummary from "@/components/checkout/order-summary";

/**
 * Payment page component
 * Integrates OrderSummary and PaymentForm components
 * Handles authentication, cart state, and form submission
 * @returns Payment Page
 */
export default function PaymentPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { status } = useSession();
  const { state, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  // Retrieve delivery details from session storage (without auth checks)
  useEffect(() => {
    // Only try to get delivery details when the component mounts
    if (typeof window !== "undefined") {
      try {
        const deliveryDetails = sessionStorage.getItem("deliveryDetails");
        if (deliveryDetails) {
          // Store for later use with final order
          setDeliveryInfo(JSON.parse(deliveryDetails));
        }
      } catch (error) {
        console.error("Error retrieving delivery details:", error);
      }
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);

    try {
      // Get delivery details from state
      const deliveryDetails = deliveryInfo || {};

      // Combine order data
      const orderData = {
        delivery: deliveryDetails,
        payment: data,
        items: state.items,
        restaurantId: state.restaurantId,
        total: state.subtotal,
      };

      // Placeholder for future API call to create order
      console.log("Complete order data:", orderData);

      // Simulate successful order placement
      setTimeout(() => {
        setIsSubmitting(false);
        // Clean up session storage
        sessionStorage.removeItem("deliveryDetails");
        // Redirect to confirmation page
        router.push("/order-confirmation");
        // Clear the cart
        clearCart();
      }, 1500);
    } catch (error) {
      console.error("Error processing payment:", error);
      setIsSubmitting(false);
      toastNotification.error(
        t("payment.error", "Payment Error"),
        t(
          "payment.errorProcessing",
          "There was an error processing your payment. Please try again."
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
          <h1 className="text-xl font-semibold">
            {t("common.loading", "Loading...")}
          </h1>
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
          <div className="absolute top-4 left-8 right-4 flex items-center">
            <div className="h-0.5 w-[60%] bg-orange-500"></div>
            <div className="h-0.5 w-[40%] bg-gray-200"></div>
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
                <span className="text-sm">✓</span>
              </div>
              <span className="text-xs text-gray-600">
                {t("checkout.deliveryDetails", "Delivery Details")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mb-1 shadow-sm">
                <span className="text-sm">3</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
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
            <div className="h-0.5 w-2/3 bg-orange-500"></div>
            <div className="h-0.5 w-1/3 bg-gray-200"></div>
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
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mb-1 shadow-sm">
                <CreditCard className="h-4 w-4 text-white" />
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
        {/* Payment Form */}
        <div className="p-4 lg:p-8 bg-white rounded-lg mb-8 w-full lg:flex-1">
          <PaymentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        {/* Order Summary */}
        <div className="hidden lg:block lg:w-[400px]">
          <OrderSummary
            className="border-0 shadow-none bg-transparent"
            isSubmitting={isSubmitting}
            showCheckoutButton={false}
          />

          {/* Back to shopping button on mobile */}
          <div className="mt-4 lg:hidden">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("checkout.backToCheckout", "Back to Checkout")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
