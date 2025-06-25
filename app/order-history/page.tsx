"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Container } from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronRight, Package, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderDetails from "./components/order-details";
import OrderDetailsMobile from "./components/order-details-mobile";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Order, OrderItem } from "@/types/order";
import { OrderStatus } from "@/prisma/app/generated/prisma/client";

/**
 * Safely formats any price value to a string with 2 decimal places
 * Handles different input types (number, string, Prisma.Decimal, etc.)
 *
 * @param price - The price value to format
 * @param quantity - Optional quantity multiplier (default: 1)
 * @returns A string representation of the price with 2 decimal places
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatPrice = (price: any, quantity: number = 1): string => {
  try {
    if (!price && price !== 0) return "0.00";

    let numericValue = 0;

    if (typeof price === "object" && price !== null) {
      // Handle Prisma.Decimal or similar objects
      numericValue = parseFloat(String(price));
    } else if (typeof price === "number") {
      numericValue = price;
    } else {
      // Try to parse as number if it's a string
      numericValue = parseFloat(String(price));
      if (isNaN(numericValue)) numericValue = 0;
    }

    // Apply quantity multiplier
    const finalValue = numericValue * quantity;
    return finalValue.toFixed(2);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return "0.00"; // Fallback if any errors occur
  }
};

// Using shared Order and OrderItem types from /types/order.ts

/**
 * Status badge component with appropriate colors
 * Uses translation for status text and applies appropriate styling
 */
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();
  // Update variant type to match what Badge component accepts
  let variant: "default" | "secondary" | "outline" | "destructive" = "default";

  switch (status) {
    case "NEW":
      variant = "default"; // Primary color (orange)
      break;
    case "PREPARING":
      variant = "secondary"; // Gray
      break;
    case "READY_FOR_PICKUP_DELIVERY":
      variant = "outline"; // Using outline instead of success
      break;
    case "COMPLETED":
      variant = "outline"; // Using outline instead of success
      break;
    case "CANCELLED":
      variant = "destructive"; // Red
      break;
  }

  // Display appropriate status text
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "READY_FOR_PICKUP_DELIVERY":
        return t("orderHistory.status.ready", "READY");
      case "NEW":
        return t("orderHistory.status.new", "NEW");
      case "PREPARING":
        return t("orderHistory.status.preparing", "PREPARING");
      case "COMPLETED":
        return t("orderHistory.status.completed", "COMPLETED");
      case "CANCELLED":
        return t("orderHistory.status.cancelled", "CANCELLED");
      default:
        return status;
    }
  };

  return <Badge variant={variant}>{getStatusText(status)}</Badge>;
};

// Define filter types
type OrderFilter = "pending" | "delivered" | "failed"; // Function to get restaurant image or fallback based on name
const getRestaurantImageUrl = (restaurant: {
  imageUrl?: string;
  name: string;
}) => {
  // If restaurant has an image URL from the database, use it
  if (restaurant.imageUrl) {
    return restaurant.imageUrl;
  }

  // Otherwise fall back to pattern matching based on restaurant name
  const name = restaurant.name.toLowerCase();

  // Return specific images based on restaurant name patterns
  if (name.includes("pizza") || name.includes("palace")) {
    return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } else if (name.includes("burger") || name.includes("joint")) {
    return "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } else if (
    name.includes("sushi") ||
    name.includes("express") ||
    name.includes("asia")
  ) {
    return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } else if (name.includes("coffee") || name.includes("kichi")) {
    return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } else if (name.includes("royal") || name.includes("food")) {
    return "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } else if (name.includes("hiroshima") || name.includes("restaurant")) {
    return "https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } else if (
    name.includes("store") ||
    name.includes("market") ||
    name.includes("vinamilk")
  ) {
    return "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  } else {
    // Default image for any other restaurant
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  }
};

// Main Order History Page Component
export default function OrderHistoryPage() {
  const { t } = useTranslation();
  const [selectedDesktopOrder, setSelectedDesktopOrder] =
    useState<Order | null>(null);
  const [selectedMobileOrder, setSelectedMobileOrder] = useState<Order | null>(
    null
  );
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("pending");

  // Query orders using tRPC
  const orderQuery = trpc.order.getCustomerOrders.useQuery({
    status: activeFilter,
  });

  const { data, isLoading, isError, error } = orderQuery;

  // No need for manual refetch as the query key (activeFilter) change will trigger a refetch

  const orders = data?.orders || [];

  // Format date according to user's locale
  const formatDate = (date: Date) => {
    return format(date, "do MMM yyyy, hh:mm a");
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      {/* Desktop and large screen */}
      <div className="hidden lg:block">
        <ScrollArea className="flex-grow">
          <Container>
            <div className="py-8">
              <h1 className="text-xl lg:text-2xl font-bold mb-2">
                {t("orderHistory.title", "Orders")}
              </h1>

              {/* Order Status Filters */}
              <div className="mb-6 mt-6 w-auto rounded-xl">
                <nav className="flex space-x-2" aria-label="Order filters">
                  <button
                    onClick={() => setActiveFilter("pending")}
                    className={`py-1 px-4 rounded-full text-sm font-medium ${
                      activeFilter === "pending"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.pending", "Pending Orders")}
                  </button>
                  <button
                    onClick={() => setActiveFilter("delivered")}
                    className={`py-1 px-4 rounded-full text-sm font-medium ${
                      activeFilter === "delivered"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.delivered", "Delivered Orders")}
                  </button>
                  <button
                    onClick={() => setActiveFilter("failed")}
                    className={`py-1 px-4 rounded-full text-sm font-medium ${
                      activeFilter === "failed"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.failed", "Failed Orders")}
                  </button>
                </nav>
              </div>

              {isLoading ? (
                <div className="grid gap-6">
                  {/* Loading skeletons - show 3 skeleton orders */}
                  {[...Array(3)].map((_, i) => (
                    <Card key={`skeleton-${i}`} className="overflow-hidden border-none p-0">
                      <div className="bg-orange-100 p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[...Array(4)].map((_, j) => (
                            <div key={`skeleton-field-${j}`}>
                              <Skeleton className="h-3 w-20 mb-2" />
                              <Skeleton className="h-4 w-28" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {[...Array(2)].map((_, j) => (
                          <div key={`skeleton-item-${j}`} className="flex items-center gap-4 py-3 border-b last:border-0">
                            <Skeleton className="w-24 h-20 rounded" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-40 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : isError ? (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("common.error", "Error")}</AlertTitle>
                  <AlertDescription>
                    {error?.message || t("orderHistory.errorLoading", "Failed to load orders. Please try again later.")}
                  </AlertDescription>
                </Alert>
              ) : orders.length > 0 ? (
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <Card
                      key={order.id}
                      className="overflow-hidden hover:shadow-md border-none transition-shadow p-0 cursor-pointer"
                      onClick={() => setSelectedDesktopOrder(order)}
                    >
                      {/* Header in yellow-ish background similar to the image */}
                      <div className="bg-orange-100 p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {t("orderHistory.orderNumber", "Order number")}
                            </p>
                            <p className="font-medium">
                              {order.orderNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {t("orderHistory.restaurant", "Restaurant")}
                            </p>
                            <p className="font-medium">
                              {order.restaurant.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {t("orderHistory.statusLabel", "Status")}
                            </p>
                            <StatusBadge status={order.status} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {t("orderHistory.scheduledFor", "Scheduled for")}
                            </p>
                            <p className="font-medium">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        {/* <Button
                        className="mt-3 ml-auto flex"
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {t("orderHistory.viewDetails", "Leave Review")}{" "}
                        <ChevronRight size={16} />
                      </Button> */}
                      </div>

                      {/* Order items with images */}
                      <div className="p-4">
                        {order.items.map((item) => {
                          // Get realistic food images from item or fallback to Unsplash based on the item name
                          const getImageUrl = (item: OrderItem) => {
                            // If item has an image URL from the database, use it
                            if (item.imageUrl) {
                              return item.imageUrl;
                            }

                            // Otherwise fall back to pattern matching based on item name
                            const itemName = item.name.toLowerCase();

                            if (itemName.includes("pizza")) {
                              return "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (itemName.includes("bread")) {
                              return "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (
                              itemName.includes("coke") ||
                              itemName.includes("soda")
                            ) {
                              return "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (
                              itemName.includes("burger") ||
                              itemName.includes("cheese")
                            ) {
                              return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (itemName.includes("fries")) {
                              return "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (itemName.includes("roll")) {
                              return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (
                              itemName.includes("salmon") ||
                              itemName.includes("sushi") ||
                              itemName.includes("sashimi")
                            ) {
                              return "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else {
                              return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            }
                          };

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 py-3 border-b last:border-0"
                            >
                              <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={getImageUrl(item)}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                  unoptimized={true} // For external Unsplash URLs
                                  priority={false} // Load only when in viewport
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start">
                                  <p className="font-medium">{item.name}</p>
                                </div>
                                <p className="text-gray-500 text-sm">
                                  ${formatPrice(item.price)} {t("orderHistory.perItem", "per item")}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">× {item.quantity}</p>
                              </div>
                              <div className="text-right min-w-[60px]">
                                <p className="font-medium">
                                  ${formatPrice(item.price, item.quantity)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer with total and status */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`
                          ${
                            order.status === "COMPLETED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : order.status === "CANCELLED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        `}
                          >
                            {order.status === "COMPLETED"
                              ? t("orderHistory.status.delivered", "Delivered")
                              : order.status === "CANCELLED"
                              ? t("orderHistory.status.cancelled", "Cancelled")
                              : t("orderHistory.status.pending", "Pending")}
                          </Badge>
                          <Button
                            variant="ghost"
                            className="text-primary font-medium hover:bg-transparent hover:text-primary/80 px-2 h-8"
                            onClick={() => setSelectedDesktopOrder(order)}
                          >
                            {t("orderHistory.viewDetails", "View Details")}
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{t("orderHistory.total", "Total")}</span>
                          <span className="font-bold text-lg">
                            ${formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-50 rounded-full p-5 mb-4">
                    <Package size={64} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {activeFilter === "pending"
                      ? t(
                          "orderHistory.noPendingOrders.title",
                          "No pending orders"
                        )
                      : activeFilter === "delivered"
                      ? t(
                          "orderHistory.noDeliveredOrders.title",
                          "No delivered orders"
                        )
                      : t(
                          "orderHistory.noFailedOrders.title",
                          "No failed orders"
                        )}
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    {activeFilter === "pending"
                      ? t(
                          "orderHistory.noPendingOrders.description",
                          "You don't have any orders in progress. Place an order to see it here."
                        )
                      : activeFilter === "delivered"
                      ? t(
                          "orderHistory.noDeliveredOrders.description",
                          "You don't have any delivered orders yet. Orders will appear here once they are completed."
                        )
                      : t(
                          "orderHistory.noFailedOrders.description",
                          "You don't have any failed or cancelled orders."
                        )}
                  </p>
                  <Button asChild variant="default" className="px-6">
                    <Link href="/">
                      {t(
                        "orderHistory.browseRestaurants",
                        "Browse Restaurants"
                      )}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </ScrollArea>
      </div>
      {/* Mobile version */}
      <div className="lg:hidden">
        <ScrollArea className="flex-grow h-[calc(100vh-8rem)]">
          <Container>
            <div className="py-8">
              <h1 className="text-xl font-bold mb-4">
                {t("orderHistory.title", "Orders")}
              </h1>

              {/* Mobile Order Status Filters */}
              <div className="mb-6 w-full overflow-x-auto no-scrollbar">
                <nav
                  className="flex space-x-2 justify-between bg-white rounded-lg"
                  aria-label="Order filters"
                >
                  <button
                    onClick={() => setActiveFilter("pending")}
                    className={`py-1 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeFilter === "pending"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.mobile.pending", "Pending")}
                  </button>
                  <button
                    onClick={() => setActiveFilter("delivered")}
                    className={`py-1 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeFilter === "delivered"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.mobile.delivered", "Delivered")}
                  </button>
                  <button
                    onClick={() => setActiveFilter("failed")}
                    className={`py-1 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeFilter === "failed"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.mobile.failed", "Failed")}
                  </button>
                </nav>
              </div>

              {/* Mobile Order Cards */}
              {isLoading ? (
                <div className="mt-6">
                  {/* Loading skeletons - show 3 skeleton orders */}
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`mobile-skeleton-${i}`}
                      className="flex items-center gap-3 p-2 bg-white rounded-md my-4 shadow-sm"
                    >
                      <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-16 mr-1" />
                        </div>
                        <Skeleton className="h-3 w-32 mb-1" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("common.error", "Error")}</AlertTitle>
                  <AlertDescription>
                    {error?.message || t("orderHistory.errorLoading", "Failed to load orders. Please try again later.")}
                  </AlertDescription>
                </Alert>
              ) : orders.length > 0 ? (
                <div className="mt-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 p-2 bg-white rounded-md my-4 shadow-sm active:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedMobileOrder(order)}
                    >
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={getRestaurantImageUrl(order.restaurant)}
                          alt={order.restaurant.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          unoptimized={true} // For external Unsplash URLs
                          priority={false} // Load only when in viewport
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-base mb-1">
                            {order.restaurant.name}
                          </h3>
                          <div className="text-sm font-medium text-orange-600">
                            {order.orderNumber}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.items.length > 1
                            ? t(
                                "orderHistory.itemsWithCount", 
                                {
                                  defaultValue: "{{firstItem}} & {{count}} more items",
                                  firstItem: order.items[0].name,
                                  count: order.items.length - 1
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                } as any
                              )
                            : order.items[0].name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(order.createdAt, "MMM dd, yyyy, h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-50 rounded-full p-5 mb-4">
                    <Package size={48} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {activeFilter === "pending"
                      ? t(
                          "orderHistory.noPendingOrders.title",
                          "No pending orders"
                        )
                      : activeFilter === "delivered"
                      ? t(
                          "orderHistory.noDeliveredOrders.title",
                          "No delivered orders"
                        )
                      : t(
                          "orderHistory.noFailedOrders.title",
                          "No failed orders"
                        )}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mb-6 px-4">
                    {activeFilter === "pending"
                      ? t(
                          "orderHistory.noPendingOrders.description",
                          "You don't have any orders in progress."
                        )
                      : activeFilter === "delivered"
                      ? t(
                          "orderHistory.noDeliveredOrders.description",
                          "You don't have any delivered orders yet."
                        )
                      : t(
                          "orderHistory.noFailedOrders.description",
                          "You don't have any failed or cancelled orders."
                        )}
                  </p>
                  <Button asChild variant="default" size="sm" className="px-5">
                    <Link href="/">
                      {t(
                        "orderHistory.browseRestaurants",
                        "Browse Restaurants"
                      )}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </ScrollArea>
      </div>{" "}
      {/* Order Details Components */}
      {/* Desktop version */}
      <div className="hidden lg:block">
        <OrderDetails
          order={selectedDesktopOrder}
          onClose={() => setSelectedDesktopOrder(null)}
          t={t}
        />
      </div>
      {/* Mobile version */}
      <div className="lg:hidden">
        <OrderDetailsMobile
          order={selectedMobileOrder}
          onClose={() => setSelectedMobileOrder(null)}
          t={t}
        />
      </div>
      <Footer />
    </div>
  );
}
