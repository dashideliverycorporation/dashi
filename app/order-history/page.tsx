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
import { ChevronRight, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderDetails from "./components/order-details";
import OrderDetailsMobile from "./components/order-details-mobile";
import Image from "next/image";
import Link from "next/link";

// Order status enum to match what we have in the Prisma schema
enum OrderStatus {
  NEW = "NEW",
  PREPARING = "PREPARING",
  READY_FOR_PICKUP_DELIVERY = "READY_FOR_PICKUP_DELIVERY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Mock order item type
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Mock order data structure
interface Order {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  total: number;
  deliveryAddress: string;
  notes: string | null;
  restaurant: {
    id: string;
    name: string;
  };
  items: OrderItem[];
}

// Mock orders for display
const mockOrders: Order[] = [
  {
    id: "ord_123456",
    createdAt: new Date(2025, 4, 25, 14, 30), // May 25, 2025, 2:30 PM
    status: OrderStatus.COMPLETED,
    total: 42.99,
    deliveryAddress: "123 Main St, Goma",
    notes: "Please deliver to back door",
    restaurant: {
      id: "rest_1",
      name: "Pizza Palace",
    },
    items: [
      { id: "item_1", name: "Margherita Pizza", price: 12.99, quantity: 2 },
      { id: "item_2", name: "Garlic Bread", price: 4.99, quantity: 1 },
      { id: "item_3", name: "Coke", price: 2.99, quantity: 4 },
    ],
  },
  {
    id: "ord_789012",
    createdAt: new Date(2025, 4, 27, 18, 15), // May 27, 2025, 6:15 PM
    status: OrderStatus.PREPARING,
    total: 36.5,
    deliveryAddress: "456 Park Ave, Goma",
    notes: null,
    restaurant: {
      id: "rest_2",
      name: "Burger Joint",
    },
    items: [
      { id: "item_4", name: "Double Cheeseburger", price: 14.5, quantity: 2 },
      { id: "item_5", name: "French Fries", price: 3.5, quantity: 2 },
    ],
  },
  {
    id: "ord_345678",
    createdAt: new Date(2025, 4, 28, 20, 45), // May 28, 2025, 8:45 PM
    status: OrderStatus.NEW,
    total: 54.25,
    deliveryAddress: "789 Beach Road, Goma",
    notes: "Call when you arrive",
    restaurant: {
      id: "rest_3",
      name: "Sushi Express",
    },
    items: [
      { id: "item_6", name: "California Roll", price: 16.99, quantity: 2 },
      { id: "item_7", name: "Salmon Sashimi", price: 19.99, quantity: 1 },
    ],
  },
];

// Status badge component with appropriate colors
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  // Update variant type to match what Badge component accepts
  let variant: "default" | "secondary" | "outline" | "destructive" = "default";

  switch (status) {
    case OrderStatus.NEW:
      variant = "default"; // Primary color (orange)
      break;
    case OrderStatus.PREPARING:
      variant = "secondary"; // Gray
      break;
    case OrderStatus.READY_FOR_PICKUP_DELIVERY:
      variant = "outline"; // Using outline instead of success
      break;
    case OrderStatus.COMPLETED:
      variant = "outline"; // Using outline instead of success
      break;
    case OrderStatus.CANCELLED:
      variant = "destructive"; // Red
      break;
  }

  // Display appropriate status text
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.READY_FOR_PICKUP_DELIVERY:
        return "READY";
      default:
        return status;
    }
  };

  return <Badge variant={variant}>{getStatusText(status)}</Badge>;
};

// Define filter types
type OrderFilter = "pending" | "delivered" | "failed";

// Function to get restaurant image based on name
const getRestaurantImageUrl = (restaurantName: string) => {
  const name = restaurantName.toLowerCase();

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

  // Format date according to user's locale
  const formatDate = (date: Date) => {
    return format(date, "do MMM yyyy, hh:mm a");
  };

  // Filter orders based on selected filter
  const filteredOrders = mockOrders.filter((order) => {
    if (activeFilter === "pending") {
      return [
        OrderStatus.NEW,
        OrderStatus.PREPARING,
        OrderStatus.READY_FOR_PICKUP_DELIVERY,
      ].includes(order.status);
    } else if (activeFilter === "delivered") {
      return [OrderStatus.COMPLETED].includes(order.status);
    } else if (activeFilter === "failed") {
      return [OrderStatus.CANCELLED].includes(order.status);
    } else {
      // Default case
      return true;
    }
  });

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

              {filteredOrders.length > 0 ? (
                <div className="grid gap-6">
                  {filteredOrders.map((order) => (
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
                              Order number
                            </p>
                            <p className="font-medium">
                              #{order.id.replace("ord_", "")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Restaurant
                            </p>
                            <p className="font-medium">
                              {order.restaurant.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Status
                            </p>
                            <StatusBadge status={order.status} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Scheduled for
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
                          // Get realistic food images from Unsplash based on the item name
                          const getImageUrl = (itemName: string) => {
                            if (itemName.toLowerCase().includes("pizza")) {
                              return "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (
                              itemName.toLowerCase().includes("bread")
                            ) {
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
                            } else if (
                              itemName.toLowerCase().includes("fries")
                            ) {
                              return "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";
                            } else if (
                              itemName.toLowerCase().includes("roll")
                            ) {
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
                            <div
                              key={item.id}
                              className="flex items-center gap-4 py-3 border-b last:border-0"
                            >
                              <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0">
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
                                <div className="flex items-start">
                                  <p className="font-medium">{item.name}</p>
                                </div>
                                <p className="text-gray-500 text-sm">
                                  ${item.price.toFixed(2)} per item
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">× {item.quantity}</p>
                              </div>
                              <div className="text-right min-w-[60px]">
                                <p className="font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
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
                            order.status === OrderStatus.COMPLETED
                              ? "bg-green-50 text-green-700 border-green-200"
                              : order.status === OrderStatus.CANCELLED
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        `}
                          >
                            {order.status === OrderStatus.COMPLETED
                              ? "Delivered"
                              : order.status === OrderStatus.CANCELLED
                              ? "Cancelled"
                              : "Pending"}
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
                          <span className="text-sm font-medium">Total</span>
                          <span className="font-bold text-lg">
                            ${order.total.toFixed(2)}
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
                    {t("orderHistory.filter.pending", "Pending")}
                  </button>
                  <button
                    onClick={() => setActiveFilter("delivered")}
                    className={`py-1 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeFilter === "delivered"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.delivered", "Delivered")}
                  </button>
                  <button
                    onClick={() => setActiveFilter("failed")}
                    className={`py-1 px-4 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeFilter === "failed"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t("orderHistory.filter.failed", "Failed")}
                  </button>
                </nav>
              </div>

              {/* Mobile Order Cards */}
              {filteredOrders.length > 0 ? (
                <div className="mt-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 p-2 bg-white rounded-md my-4 shadow-sm active:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedMobileOrder(order)}
                    >
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={getRestaurantImageUrl(order.restaurant.name)}
                          alt={order.restaurant.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback image if the main one fails to load
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
                          }}
                        />
                        <Image
                          src={getRestaurantImageUrl(order.restaurant.name)}
                          alt={order.restaurant.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          unoptimized={true} // For external Unsplash URLs
                          priority={false} // Load only when in viewport
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-base mb-1">
                          {order.restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.items.length > 1
                            ? `${order.items[0].name} & ${
                                order.items.length - 1
                              } more items`
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
