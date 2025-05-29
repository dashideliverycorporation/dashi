"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Home,
  ArrowRight,
  Store,
  ChefHat,
  Truck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Order Confirmation page shown after a successful order placement
 * @returns Order Confirmation Page
 */
export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white p-4 rounded-lg text-center shadow-sm">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">
          {t("order.thankYou", "Thank you for your order!")}
        </h1>

        <p className="lg:text-lg text-gray-700 mb-6">
          {t("order.number", "Order #")}
          {Math.floor(1000 + Math.random() * 9000)}
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg lg:text-xl font-medium mb-2">
            {t("order.received", "Order Received")}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("order.from", "From")} Angolo Ristorante Italiano
          </p>

          {/* Order progress bar */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
            <div className="absolute left-0 top-0 h-full w-1/4 bg-orange-500 rounded-full"></div>
          </div>

          {/* Progress step indicators */}
          <div className="flex justify-between text-xs text-gray-500 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                <Store className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-orange-500 font-medium">
                {t("order.received", "Received")}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <ChefHat className="w-4 h-4 text-gray-500" />
              </div>
              <span>{t("order.preparing", "Preparing")}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <Truck className="w-4 h-4 text-gray-500" />
              </div>
              <span>{t("order.onTheWay", "On the way")}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <Package className="w-4 h-4 text-gray-500" />
              </div>
              <span>{t("order.delivered", "Delivered")}</span>
            </div>
          </div>

          

          <div className="mt-6">
            <p className="font-medium text-gray-800">
              {t("order.estimatedArrival", "Estimated arrival time")}
            </p>
            <p className="text-gray-600">
              {t("order.timeRange", "30-45 minutes from")}{" "}
              {new Date().getHours()}:
              {new Date().getMinutes() < 10
                ? "0" + new Date().getMinutes()
                : new Date().getMinutes()}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
          <Button
            onClick={() => router.push("/order-history")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 font-medium"
          >
            {t("order.track", "Track your order")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full py-4 font-medium"
          >
            <Home className="mr-2 h-4 w-4" />
            {t("common.backToHome", "Back to Home")}
          </Button>
        </div>
      </div>
    </div>
  );
}
