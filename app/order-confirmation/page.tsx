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
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { OrderStatus } from "@/prisma/app/generated/prisma/client";
import { format } from "date-fns";

/**
 * Order Confirmation page shown after a successful order placement
 * @returns Order Confirmation Page
 */
export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string>('#0000');
  const [isLoadingLocal, setIsLoadingLocal] = useState<boolean>(true);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  
  // Use the query to fetch order details
  const { data, isLoading, error } = trpc.order.getOrderByDisplayNumber.useQuery(
    { displayOrderNumber: orderNumber },
    { 
      enabled: orderNumber !== '#0000',
      retry: 1,
    }
  );
  
  // Calculate progress percentage based on order status
  const getProgressPercentage = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return 25;
      case OrderStatus.PREPARING:
        return 50;
      case OrderStatus.READY_FOR_PICKUP_DELIVERY:
        return 75;
      case OrderStatus.COMPLETED:
        return 100;
      default:
        return 25;
    }
  };
  
  // Format the order time for estimated delivery
  const formatEstimatedDelivery = (createdAt: Date, deliveryTime?: string | null) => {
    // Parse delivery time range from restaurant (e.g., "30-45" minutes)
    const defaultTimeRange = "30-45";
    const timeRange = deliveryTime || defaultTimeRange;
    
    // Split the range into min and max
    const [minTime, maxTime] = timeRange.split('-').map(t => parseInt(t, 10));
    
    // Use the created time as base
    const orderTime = new Date(createdAt);
    
    return {
      formattedOrderTime: format(orderTime, "h:mm a"),
      estimatedRange: `${minTime}-${maxTime}`,
    };
  };
  
  useEffect(() => {
    // Get the order number from localStorage
    if (typeof window !== 'undefined') {
      const storedOrderNumber = localStorage.getItem('lastOrderNumber');
      if (storedOrderNumber) {
        setOrderNumber(storedOrderNumber);
      } else {
        setErrorLocal("Order number not found");
        setIsLoadingLocal(false);
      }
    }
  }, []);
  
  useEffect(() => {
    if (data) {
      setIsLoadingLocal(false);
    }
    
    if (error) {
      setErrorLocal(error.message);
      setIsLoadingLocal(false);
    }
  }, [data, error]);

  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white p-4 rounded-lg text-center shadow-sm">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">
          {t("order.thankYou", "Thank you for your order!")}
        </h1>

        <p className="lg:text-lg text-gray-700 mb-6">
          {t("order.number", "Order ")}
          {orderNumber}
        </p>

        {isLoading || isLoadingLocal ? (
          <div className="py-10 text-center">
            <p>{t("common.loading", "Loading order details...")}</p>
          </div>
        ) : error || errorLocal ? (
          <div className="py-10 text-center">
            <p className="text-red-500">{error?.message || errorLocal}</p>
            <p className="mt-4">{t("order.stillProcessing", "Your order is still being processed. Please check your order history.")}</p>
          </div>
        ) : data?.order ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg lg:text-xl font-medium mb-2">
              {t("order.received", "Order Received")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("order.from", "From")} {data.order.restaurant.name}
            </p>

            {/* Order progress bar */}
            <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className="absolute left-0 top-0 h-full bg-orange-500 rounded-full" 
                style={{ width: `${getProgressPercentage(data.order.status)}%` }}
              ></div>
            </div>

            {/* Progress step indicators */}
            <div className="flex justify-between text-xs text-gray-500 mb-6">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 ${data.order.status === OrderStatus.NEW || data.order.status === OrderStatus.PREPARING || data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                  <Store className={`w-4 h-4 ${data.order.status === OrderStatus.NEW || data.order.status === OrderStatus.PREPARING || data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'text-orange-500' : 'text-gray-500'}`} />
                </div>
                <span className={`${data.order.status === OrderStatus.NEW || data.order.status === OrderStatus.PREPARING || data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'text-orange-500 font-medium' : ''}`}>
                  {t("order.received", "Received")}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 ${data.order.status === OrderStatus.PREPARING || data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                  <ChefHat className={`w-4 h-4 ${data.order.status === OrderStatus.PREPARING || data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'text-orange-500' : 'text-gray-500'}`} />
                </div>
                <span className={`${data.order.status === OrderStatus.PREPARING || data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'text-orange-500 font-medium' : ''}`}>
                  {t("order.preparing", "Preparing")}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 ${data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                  <Truck className={`w-4 h-4 ${data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'text-orange-500' : 'text-gray-500'}`} />
                </div>
                <span className={`${data.order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY || data.order.status === OrderStatus.COMPLETED ? 'text-orange-500 font-medium' : ''}`}>
                  {t("order.onTheWay", "On the way")}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 ${data.order.status === OrderStatus.COMPLETED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                  <Package className={`w-4 h-4 ${data.order.status === OrderStatus.COMPLETED ? 'text-orange-500' : 'text-gray-500'}`} />
                </div>
                <span className={`${data.order.status === OrderStatus.COMPLETED ? 'text-orange-500 font-medium' : ''}`}>
                  {t("order.delivered", "Delivered")}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium text-gray-800">
                {t("order.estimatedArrival", "Estimated arrival time")}
              </p>
              {(() => {
                const { formattedOrderTime, estimatedRange } = formatEstimatedDelivery(
                  data.order.createdAt, 
                  data.order.restaurant.preparationTime
                );
                
                // Get the translation template
                const timeTemplate = t("order.timeRangeWithValue", "{{range}} minutes from");
                
                // Replace the placeholder with the actual range
                const formattedTimeRange = timeTemplate.replace('{{range}}', estimatedRange);
                
                return (
                  <p className="text-gray-600">
                    {formattedTimeRange} {formattedOrderTime}
                  </p>
                );
              })()}
              
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p>{t("order.notFound", "Order details not found")}</p>
          </div>
        )}

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
            className="w-full bg-white border border-orange-500 hover:bg-orange-50 text-orange-500 py-4 font-medium"
          >
            {t("order.orderMore", "Order more food")}
            <Home className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
