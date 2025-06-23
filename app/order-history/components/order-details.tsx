"use client";

import { format } from "date-fns";
import {
  CalendarDays,
  Store,
  ChefHat,
  Bike,
  House,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { OrderStatus } from "@/prisma/app/generated/prisma/client";
import { Order} from "@/types/order";

interface OrderDetailsProps {
  order: Order | null;
  onClose: () => void;
  t: (key: string, fallback: string) => string; // Translation function
}

export default function OrderDetails({ order, onClose, t }: OrderDetailsProps) {
  if (!order) return null;

  // Format price as currency
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatPrice = (price: any) => {
    try {
      if (!price && price !== 0) return '$0.00';
      
      let numericValue = 0;
      
      if (typeof price === 'object' && price !== null) {
        // Handle Prisma.Decimal or similar objects
        numericValue = parseFloat(String(price));
      } else if (typeof price === 'number') {
        numericValue = price;
      } else {
        // Try to parse it as a number if it's a string
        numericValue = parseFloat(String(price));
        if (isNaN(numericValue)) numericValue = 0;
      }
      
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(numericValue);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return '$0.00'; // Fallback if any errors occur
    }
  };

  // Format date according to user's locale
  const formatDate = (date: Date) => {
    return format(date, "do MMM yyyy, hh:mm a");
  };

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
    <>
      {/* Desktop and large screen */}
      <div className="hidden lg:block">
        <Dialog open={!!order} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Order Header with restaurant and status - fixed position */}
            <div className="bg-orange-100 p-6 rounded-t-lg">
              <DialogHeader className="p-0 mb-2">
                <DialogTitle>
                  <span>{order.restaurant.name}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays size={14} />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <p className="text-sm mt-2 mb-4 text-gray-700">
                Order #{order.id.replace("ord_", "")}
              </p>

              {/* Order Progress Steps */}
              <div className="mb-0 hidden md:flex items-center justify-center">
                <div className="w-full max-w-3xl relative">
                  {/* Horizontal connecting lines centered vertically */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 flex">
                    {/* Dividing the progress line into 4 segments */}
                    <div
                      className={`w-1/4 ${
                        order.status !== "CANCELLED"
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`w-1/4 ${
                        order.status === "PREPARING" ||
                        order.status === "READY_FOR_PICKUP_DELIVERY" ||
                        order.status === "COMPLETED"
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`w-1/4 ${
                        order.status ===
                          OrderStatus.READY_FOR_PICKUP_DELIVERY ||
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
                          order.status ===
                            OrderStatus.READY_FOR_PICKUP_DELIVERY ||
                          order.status === OrderStatus.COMPLETED
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-500"
                        } flex items-center justify-center mb-1 shadow-sm`}
                      >
                        <span className="text-sm">
                          {order.status === OrderStatus.PREPARING ||
                          order.status ===
                            OrderStatus.READY_FOR_PICKUP_DELIVERY ||
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
                          order.status ===
                            OrderStatus.READY_FOR_PICKUP_DELIVERY ||
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

            {/* Scrollable content area with better handling of variable content heights */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
              {/* Order Items with Images */}
              <div>
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
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/20 px-4 py-2">
                  <h4 className="font-medium">
                    {t("orderHistory.deliveryInfo", "Delivery Information")}
                  </h4>
                </div>
                <div className="p-4">
                  <p>{order.deliveryAddress}</p>
                  {order.notes && (
                    <div className="mt-3 bg-muted/10 rounded-md">
                      <p className="text-sm font-medium mb-1 text-gray-600 border-t pt-1 mb-2">
                        {t("orderHistory.notes", "Notes")}
                      </p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-500">Subtotal</span>
                  <span>{formatPrice(order.total - 5)}</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="font-medium text-gray-500 ">
                    Delivery fee
                  </span>
                  <span>{formatPrice(5)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-base mt-3">
                  <span>{t("orderHistory.total", "Total")}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={onClose}>
                  {t("orderHistory.close", "Close")}
                </Button>
                <Button variant="default" className="gap-1">
                  {t("orderHistory.reorder", "Order Again")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
