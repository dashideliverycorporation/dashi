"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import {
  ArrowLeft,
  Bike,
  CalendarDays,
  ChefHat,
  House,
  Store,
} from "lucide-react";
import { OrderStatus } from "@/prisma/app/generated/prisma/client";
import { Order } from "@/types/order";

/**
 * Format price safely, handling different types
 * @param price - The price to format (can be number, Decimal, etc.)
 * @param quantity - Optional quantity multiplier (default: 1)
 * @param adjustment - Optional adjustment to add/subtract from price (default: 0)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatPrice = (price: any, quantity: number = 1, adjustment: number = 0): string => {
  try {
    if (!price && price !== 0) return '0.00';
    
    let numericValue = 0;
    
    if (typeof price === 'object' && price !== null) {
      // It's a Prisma.Decimal or similar
      numericValue = parseFloat(String(price));
    } else if (typeof price === 'number') {
      numericValue = price;
    } else {
      // Try to parse it as a number if it's a string
      numericValue = parseFloat(String(price));
      if (isNaN(numericValue)) numericValue = 0;
    }
    
    // Apply quantity multiplier and adjustment
    const finalValue = (numericValue * quantity) + adjustment;
    return finalValue.toFixed(2);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return '0.00'; // Fallback if any errors occur
  }
};

interface OrderDetailsMobileProps {
  order: Order | null;
  onClose: () => void;
  t: (key: string, fallback: string) => string; // Translation function
}

export default function OrderDetailsMobile({
  order,
  onClose,
  t,
}: OrderDetailsMobileProps) {
  if (!order) return null;

  // Get realistic food images from Unsplash based on the item name
  const getImageUrl = (itemName: string) => {
    if (itemName.toLowerCase().includes("pizza")) {
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    } else if (itemName.toLowerCase().includes("bread")) {
      return "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    } else if (
      itemName.toLowerCase().includes("coke") ||
      itemName.toLowerCase().includes("soda")
    ) {
      return "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    } else if (
      itemName.toLowerCase().includes("burger") ||
      itemName.toLowerCase().includes("cheese")
    ) {
      return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    } else if (itemName.toLowerCase().includes("fries")) {
      return "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    } else if (itemName.toLowerCase().includes("roll")) {
      return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    } else if (
      itemName.toLowerCase().includes("salmon") ||
      itemName.toLowerCase().includes("sushi") ||
      itemName.toLowerCase().includes("sashimi")
    ) {
      return "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    } else {
      return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Mobile header with restaurant name and status */}
      <div className="relative bg-white p-4 border-b shadow-sm">
        <div className="flex items-center">
          <Button
            size={"icon"}
            variant="ghost"
            aria-label="Back"
            onClick={onClose}
            className="mr-2 rounded-md bg-gray-200 w-8 h-8 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back</span>
          </Button>
        </div>

        <h2 className="text-lg font-semibold">{order.restaurant.name}</h2>
        <div className="flex items-center mt-1">
          <CalendarDays size={14} className="text-gray-500 mr-1" />
          <div className="text-xs text-gray-500">
            {format(order.createdAt, "dd MMM yyyy, h:mm a")}
          </div>
        </div>

        <div className="text-sm text-gray-700 mt-1">
          Order #{order.id.replace("ord_", "")}
        </div>

        {/* Order progress bar based on status - simplified version */}
        <div className="mt-6 mb-4 flex items-center justify-center">
          <div className="w-full max-w-3xl relative">
            {/* Horizontal connecting lines centered vertically */}
            <div className="absolute top-4 left-0 right-0 h-0.5 flex">
              {/* Dividing the progress line into 4 segments */}
              <div
                className={`w-1/4 ${
                  order.status !== OrderStatus.CANCELLED
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-1/4 ${
                  order.status === OrderStatus.PREPARING ||
                  order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY ||
                  order.status === OrderStatus.COMPLETED
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-1/4 ${
                  order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY ||
                  order.status === OrderStatus.COMPLETED
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-1/4 ${
                  order.status === OrderStatus.COMPLETED
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              ></div>
            </div>

            {/* Circles and labels */}
            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${
                    order.status !== OrderStatus.CANCELLED
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  } flex items-center justify-center mb-1 shadow-sm`}
                >
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-600">Received</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${
                    order.status === OrderStatus.PREPARING ||
                    order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY ||
                    order.status === OrderStatus.COMPLETED
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-500"
                  } flex items-center justify-center mb-1 shadow-sm`}
                >
                  <span className="text-sm">
                    {order.status === OrderStatus.PREPARING ||
                    order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY ||
                    order.status === OrderStatus.COMPLETED
                      ? "✓"
                      : ""}
                  </span>
                </div>
                <span className="text-xs text-gray-600">Accepted</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${
                    order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY ||
                    order.status === OrderStatus.COMPLETED ||
                    order.status === OrderStatus.PREPARING
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-500"
                  } flex items-center justify-center mb-1 shadow-sm`}
                >
                  <ChefHat className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-600">Preparing</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${
                    order.status === OrderStatus.READY_FOR_PICKUP_DELIVERY
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-500"
                  } border border-gray-300 flex items-center justify-center mb-1 shadow-sm`}
                >
                  <Bike className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-600">Dispatched</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${
                    order.status === OrderStatus.COMPLETED
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-500"
                  } border border-gray-300 flex items-center justify-center mb-1 shadow-sm`}
                >
                  <House className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-600">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area with items, delivery info, and total */}
      <div className="flex-1 overflow-auto p-0 pb-24 bg-gray-50">
        {/* Order Items with Images */}
        <div className="bg-white p-4 mb-2">
          <h4 className="font-medium text-base mb-3">
            {t("orderHistory.orderItems", "Order Items")}
          </h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={getImageUrl(item.name)}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    unoptimized={true} // For external Unsplash URLs
                    priority={false} // Load only when in viewport
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      ${formatPrice(item.price)} × {item.quantity}
                    </p>
                    <p className="font-medium">
                      ${formatPrice(item.price, item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white p-4 mb-2">
          <h4 className="font-medium mb-3">
            {t("orderHistory.deliveryInfo", "Delivery Information")}
          </h4>
          <div>
            <p>{order.deliveryAddress}</p>
            {order.notes && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  {t("orderHistory.notes", "Notes")}
                </p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Total */}
        <div className="border-t pt-4 p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-gray-500">Subtotal</span>
            <span className="text-sm">${formatPrice(order.total, 1, -5)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="font-medium text-sm text-gray-500">Delivery fee</span>
            <span className="text-sm">${formatPrice(5)}</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-medium mt-3">
            <span>{t("orderHistory.total", "Total")}</span>
            <span>${formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between shadow-md">
          <Button
          variant="outline"
            onClick={onClose}
            
          >
            {t("orderHistory.close", "Back")}
          </Button>
          <Button className="px-5 py-2 bg-primary text-white rounded-md font-medium">
            {t("orderHistory.reorder", "Order Again")}
          </Button>
        </div>
      </div>
    </div>
  );
}
