"use client";

import { format } from "date-fns";
import {
  CalendarDays,
  User,
  Phone,
  Mail,
  Store,
  ChefHat,
  Bike,
  Home as House
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Order } from "@/types/order";

interface ExtendedTranslationOptions {
  orderItems?: {
    name: string;
    price: number;
    quantity: number;
  }[];
  total?: number;
}

interface OrderDetailsAdminProps {
  order: Order;
  onClose: () => void;
  t: (key: string, fallback: string, options?: ExtendedTranslationOptions) => string;
}

export default function OrderDetailsAdmin({ order, onClose, t }: OrderDetailsAdminProps) {
  if (!order) return null;

  // Format order creation date
  const formattedDate = order.createdAt
    ? format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')
    : 'Unknown date';

  // Calculate order summary
  const subtotal = order.items?.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  ) || 0;
  const deliveryFee = order.restaurant?.deliveryFee || 0;
  const total = (order.totalAmount !== undefined) ? order.totalAmount : (subtotal + Number(deliveryFee));

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
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Order Header with restaurant and status - fixed position */}
        <div className="bg-orange-100 p-6 rounded-t-lg">
          <DialogHeader className="p-0 mb-2">
            <DialogTitle>
              <div className="flex justify-between items-center">
                <span>{t('orders.orderDetails', 'Order Details')}</span>
                {/* <span className="inline-block">
                  {getStatusBadge(order.status as OrderStatus)}
                </span> */}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays size={14} />
            <span>{formattedDate}</span>
          </div>
          
          <span className="text-orange-600 font-bold">
            Order {order.displayOrderNumber || `#${order.id?.substring(0, 8)}`}
          </span>
          {/* Restaurant info */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Store size={14} />
            <span>{order.restaurant?.name || 'Unknown Restaurant'}</span>
          </div>

          {/* Order Progress Steps */}
          <div className="mb-0 hidden md:flex items-center justify-center mt-5">
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
                    order.status === "DISPATCHED" ||
                    order.status === "DELIVERED"
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-1/4 ${
                    order.status === "DISPATCHED" ||
                    order.status === "DELIVERED"
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-1/4 ${
                    order.status === "DELIVERED"
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
                      order.status !== "CANCELLED"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    } flex items-center justify-center mb-1 shadow-sm`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600">{t("orderHistory.status.received", "Received")}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      order.status === "PREPARING" ||
                      order.status === "DISPATCHED" ||
                      order.status === "DELIVERED"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-500"
                    } flex items-center justify-center mb-1 shadow-sm border border-gray-300`}
                  >
                    <span className="text-sm">
                      {"✓"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">{t("orderHistory.status.accepted", "Accepted")}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      order.status === "DISPATCHED" ||
                      order.status === "DELIVERED" ||
                      order.status === "PREPARING"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-500"
                    } flex items-center justify-center mb-1 shadow-sm border border-gray-300`}
                  >
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600">{t("orderHistory.status.preparing", "Preparing")}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      order.status === "DISPATCHED"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-500"
                    } border border-gray-300 flex items-center justify-center mb-1 shadow-sm`}
                  >
                    <Bike className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600">{t("orderHistory.status.dispatched", "Dispatched")}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      order.status === "DELIVERED"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-500"
                    } border border-gray-300 flex items-center justify-center mb-1 shadow-sm`}
                  >
                    <House className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600">{t("orderHistory.status.delivered", "Delivered")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {/* Customer Information */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/20 px-4 py-2">
              <h4 className="font-medium text-base">
                {t('orders.customerInfo', 'Customer Information')}
              </h4>
            </div>
            <div className="p-4">
              <div className="space-y-2 mb-4 text-sm">
                {order.customer && order.customer.user?.name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{order.customer.user.name}</span>
                  </div>
                )}
                {order.customer?.user?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{order.customer.user.email}</span>
                  </div>
                )}
                {order.customer?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{order.customer.phoneNumber}</span>
                  </div>
                )}
              </div>
              
              {/* Delivery Information - Now part of the customer card */}
              <div className="border-t pt-4">
                <h5 className="font-medium text-sm mb-2">
                  {t('orders.deliveryInfo', 'Delivery Information')}
                </h5>
                <p>{order.deliveryAddress}</p>
                {order.notes && (
                  <div className="mt-3 bg-muted/10 rounded-md p-2">
                    <p className="text-sm font-medium mb-1 text-gray-600">
                      {t('orders.customerNotes', 'Customer Notes')}
                    </p>
                    <p className="text-sm italic">{order.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Payment Transaction Information */}
              {order.paymentTransaction && (
                <div className="border-t mt-4 pt-4">
                  <h5 className="font-medium text-sm mb-2">
                    {t('orders.paymentInfo', 'Payment Information')}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('orders.paymentMethod', 'Payment Method')}:</span>
                      <span className="font-medium capitalize">{order.paymentTransaction.paymentMethod?.replace('_', ' ') || 'Mobile Money'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('orders.mobileNumber', 'Mobile Number')}:</span>
                      <span className="font-medium">{order.paymentTransaction.mobileNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('orders.operator', 'Operator')}:</span>
                      <span className="font-medium">{order.paymentTransaction.providerName || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('orders.reference', 'Reference Number')}:</span>
                      <span className="font-medium">{order.paymentTransaction.transactionId || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('orders.status', 'Status')}:</span>
                      <span className="font-medium capitalize">{order.paymentTransaction.status || '-'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items with Images */}
          <div>
            <h4 className="font-medium text-base mb-3">
              {t('orders.orderItems', 'Order Items')}
            </h4>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl || getImageUrl(item.name)}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      unoptimized={!item.imageUrl} // For external Unsplash URLs
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
              )) : (
                <div className="text-gray-400 p-2 text-center">
                  {t('orders.noItems', 'No items in this order')}
                </div>
              )}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-500">{t('orders.subtotal', 'Subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="font-medium text-gray-500">
                {t('orders.deliveryFee', 'Delivery fee')}
              </span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-base mt-3">
              <span>{t('orders.total', 'Total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="bg-gray-50 p-4">
          <Button variant="outline" onClick={onClose}>
            {t('common.close', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

