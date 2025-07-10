"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Home,
  ArrowRight,
  Store,
  ChefHat,
  Package,
  Bike,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { OrderStatus } from "@/prisma/app/generated/prisma/client";
import { format } from "date-fns";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WhatsAppSupportButton } from "@/components/custom/whatsapp-support-button";
import { useOrderStatus } from "@/components/context/order-status-provider";
import { ORDER_STATUS } from "@/lib/constants/order-status";

/**
 * Order Confirmation page shown after a successful order placement
 * @returns Order Confirmation Page
 */
export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getOrderStatusByDisplayNumber } = useOrderStatus();
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
      case OrderStatus.PLACED:
        return 25;
      case OrderStatus.PREPARING:
        return 50;
      case OrderStatus.DISPATCHED:
        return 75;
      case OrderStatus.DELIVERED:
        return 100;
      case OrderStatus.CANCELLED:
        return 0; // No progress for cancelled orders
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

  // Get the current order status - prioritize context over server data for real-time updates
  const getDisplayedOrderStatus = () => {
    if (!data?.order) return null;
    
    // Check if we have a real-time status update in context
    const contextStatus = getOrderStatusByDisplayNumber(orderNumber);
    if (contextStatus) {
      // Return the order data with updated status from context
      return {
        ...data.order,
        status: contextStatus.status,
        cancellationReason: contextStatus.cancellationReason
      };
    }
    
    // Fall back to server data
    return data.order;
  };

  const displayedOrder = getDisplayedOrderStatus();

  return (
    <>
     <Header/>
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white p-4 rounded-lg text-center shadow-sm">
        <h1 className="text-xl lg:text-2xl font-bold mb-1">
          {t("order.thankYou", "Thank you for your order!")}
        </h1>

        {/* Show skeleton for order number during loading */}
        {isLoading || isLoadingLocal ? (
          <div className="flex items-center justify-center space-x-1 mb-6">
            {/* <span className="lg:text-lg text-gray-700">{t("order.number", "Order ")}</span> */}
            <Skeleton className="h-6 w-40" />
          </div>
        ) : (
          <p className="lg:text-lg text-gray-700 mb-6">
            {t("order.number", "Order ")}
            {orderNumber}
          </p>
        )}

        {isLoading || isLoadingLocal ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            {/* Order status header skeleton */}
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-5 w-56 mb-4" />
            
            {/* Order progress bar skeleton */}
            <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
              <Skeleton className="absolute left-0 top-0 h-full w-1/4 rounded-full" />
            </div>
            
            {/* Progress step indicators skeleton */}
            <div className="flex justify-between text-xs text-gray-500 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="w-8 h-8 rounded-full mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            
            {/* Estimated arrival section skeleton */}
            <div className="mt-6">
              <Skeleton className="h-5 w-44 mb-2" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>
        ) : error || errorLocal ? (
          <div className="py-10 text-center">
            <p className="text-red-500">{error?.message || errorLocal}</p>
            <p className="mt-4">{t("order.stillProcessing", "Your order is still being processed. Please check your order history.")}</p>
          </div>
        ) : data?.order ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            {/* Show cancelled order message if applicable */}
            {displayedOrder?.status === ORDER_STATUS.CANCELLED ? (
              <div className="mb-6">
                <h2 className="text-lg lg:text-xl font-medium mb-2 text-red-600">
                  {t("order.cancelled", "Order Cancelled")}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t("order.from", "From")} {displayedOrder?.restaurant.name}
                </p>
                {displayedOrder?.cancellationReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      {t("order.cancellationReason", "Cancellation Reason")}:
                    </p>
                    <p className="text-sm text-red-700">{displayedOrder.cancellationReason}</p>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {t("order.cancelledMessage", "This order has been cancelled. If you have any questions, please contact our support team.")}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg lg:text-xl font-medium mb-2">
                  {t("order.received", "Order Received")}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t("order.from", "From")} {displayedOrder?.restaurant.name}
                </p>

                {/* Order progress bar */}
                <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
                  <div 
                    className="absolute left-0 top-0 h-full bg-orange-500 rounded-full" 
                    style={{ width: `${getProgressPercentage(displayedOrder?.status || OrderStatus.PLACED)}%` }}
                  ></div>
                </div>

                {/* Progress step indicators */}
                <div className="flex justify-between text-xs text-gray-500 mb-6 gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 ${displayedOrder?.status === OrderStatus.PLACED || displayedOrder?.status === OrderStatus.PREPARING || displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                      <Store className={`w-4 h-4 ${displayedOrder?.status === OrderStatus.PLACED || displayedOrder?.status === OrderStatus.PREPARING || displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500' : 'text-gray-500'}`} />
                    </div>
                    <span className={`${displayedOrder?.status === OrderStatus.PLACED || displayedOrder?.status === OrderStatus.PREPARING || displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500 font-medium' : ''}`}>
                      {t("order.received", "Received")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 ${displayedOrder?.status === OrderStatus.PREPARING || displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                      <ChefHat className={`w-4 h-4 ${displayedOrder?.status === OrderStatus.PREPARING || displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500' : 'text-gray-500'}`} />
                    </div>
                    <span className={`${displayedOrder?.status === OrderStatus.PREPARING || displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500 font-medium' : ''}`}>
                      {t("order.preparing", "Preparing")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 ${displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                      <Bike className={`w-4 h-4 ${displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500' : 'text-gray-500'}`} />
                    </div>
                    <span className={`${displayedOrder?.status === OrderStatus.DISPATCHED || displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500 font-medium' : ''}`}>
                      {t("order.onTheWay", "Dispatched")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 ${displayedOrder?.status === OrderStatus.DELIVERED ? 'bg-orange-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-1`}>
                      <Package className={`w-4 h-4 ${displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500' : 'text-gray-500'}`} />
                    </div>
                    <span className={`${displayedOrder?.status === OrderStatus.DELIVERED ? 'text-orange-500 font-medium' : ''}`}>
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
                      displayedOrder?.createdAt || new Date(), 
                      displayedOrder?.restaurant.preparationTime
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
              </>
            )}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p>{t("order.notFound", "Order details not found")}</p>
          </div>
        )}

        {/* Skeleton for buttons when loading */}
        {(isLoading || isLoadingLocal) && (
          <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        )}
        
        {/* Real buttons when not loading */}
        {!(isLoading || isLoadingLocal) && (
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
        )}
      </div>
    </div>
    <Footer/>
    
    {/* WhatsApp Chat Support Button */}
    {displayedOrder && (
      <WhatsAppSupportButton 
        orderNumber={orderNumber} 
        restaurantName={displayedOrder.restaurant.name}
        customerName={displayedOrder.customer?.user?.name || undefined}
        orderTime={displayedOrder.createdAt}
      />
    )}
    
    {!displayedOrder && !isLoading && !isLoadingLocal && (
      <WhatsAppSupportButton orderNumber={orderNumber} />
    )}
    </>
  );
}
