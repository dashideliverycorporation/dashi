"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  User,
  Phone,
  Mail
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
import { OrderStatus } from "@/prisma/app/generated/prisma/client";
import { Order } from "@/types/order";
import { trpc } from "@/lib/trpc/client";
import { ORDER_STATUS } from "@/lib/constants/order-status";
import { toastNotification } from "@/components/custom/toast-notification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Extended TranslationOptions to include dynamic values
interface ExtendedTranslationOptions {
  [key: string]: string | number | undefined;
}

interface OrderDetailsRestaurantProps {
  order: Order | null;
  onClose: () => void;
  t: (key: string | string[], options?: ExtendedTranslationOptions | string) => string;
}

export default function OrderDetailsRestaurant({ order, onClose, t }: OrderDetailsRestaurantProps) {
  // Get TRPC utils for query invalidation
  const utils = trpc.useContext();
  
  // State for the order status and cancellation reason
  // Initialize with the existing cancellation reason if available
  const [status, setStatus] = useState<OrderStatus>(order?.status as OrderStatus || ORDER_STATUS.PLACED);
  const [cancellationReason, setCancellationReason] = useState<string>(
    order?.cancellationReason || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Early return if no order is provided
  if (!order) return null;

  // Setup mutation for updating order status
  const updateOrderStatusMutation = trpc.order.updateOrderStatus.useMutation({
    onSuccess: () => {
      // Invalidate orders query to refresh data
      utils.order.getRestaurantOrders.invalidate();
      toastNotification.success(
        t("orders.statusUpdated", "Order status updated"),
        t("orders.statusUpdatedSuccess", "The order status has been updated successfully.")
      );
      setIsUpdating(false);
    },
    onError: (error) => {
      toastNotification.error(
        t("orders.updateFailed", "Update failed"),
        error.message
      );
      setIsUpdating(false);
    }
  });

  // Handle status change
  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    // Clear cancellation reason if changing from CANCELLED to another status
    if (newStatus !== ORDER_STATUS.CANCELLED) {
      setCancellationReason("");
    }
  };

  // Handle status update submission
  const handleUpdateStatus = async () => {
    if (status === order.status) return;
    
    // Prevent updates if order is already cancelled
    if (order.status === ORDER_STATUS.CANCELLED) {
      toastNotification.error(
        t("orders.cannotUpdateCancelledOrder", "Cannot update cancelled order"),
        t("orders.orderAlreadyCancelledDesc", "This order has already been cancelled and cannot be updated.")
      );
      return;
    }
    
    // Validate cancellation reason if status is CANCELLED
    if (status === ORDER_STATUS.CANCELLED && !cancellationReason.trim()) {
      toastNotification.error(
        t("orders.cancellationReasonRequired", "Cancellation reason required"),
        t("orders.pleaseProvideReason", "Please provide a reason for cancellation.")
      );
      return;
    }
    
    setIsUpdating(true);
    updateOrderStatusMutation.mutate({
      orderId: order.id,
      status,
      cancellationReason: status === ORDER_STATUS.CANCELLED ? cancellationReason : undefined
    });
  };

  // Format price as currency
  const formatPrice = (price: 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any) => {
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

  // Parse delivery fee to ensure we have a usable number
  const deliveryFee = (() => {
    if (order.restaurant?.deliveryFee === undefined || order.restaurant?.deliveryFee === null) {
      return 0;
    }
    
    // Handle Prisma.Decimal or string or number conversions
    if (typeof order.restaurant.deliveryFee === 'object' || typeof order.restaurant.deliveryFee === 'string') {
      return parseFloat(String(order.restaurant.deliveryFee));
    }
    
    // Already a number
    return order.restaurant.deliveryFee;
  })();

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
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Order Header with restaurant and status - fixed position */}
        <div className="bg-orange-100 p-6 rounded-t-lg">
          <DialogHeader className="p-0 mb-2">
            <DialogTitle>
              <div className="flex justify-between items-center">
                <span>{t("orders.orderDetails", "Order Details")}</span>
                
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays size={14} />
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <span className="text-orange-600 font-bold">
                  Order {order.displayOrderNumber || `#${order.orderNumber}`}
          </span>

          {/* Status management for restaurant staff */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">{t("orders.currentStatus", "Current Status")}</p>
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <Select 
                  value={status} 
                  onValueChange={(value) => handleStatusChange(value as OrderStatus)}
                  disabled={order.status === ORDER_STATUS.CANCELLED} // Disable selection if order is already cancelled
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("orders.selectStatus", "Select Status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ORDER_STATUS.PLACED}>
                      {t("orders.statusOptions.placed", "Placed")}
                    </SelectItem>
                    <SelectItem value={ORDER_STATUS.PREPARING}>
                      {t("orders.statusOptions.preparing", "Preparing")}
                    </SelectItem>
                    <SelectItem value={ORDER_STATUS.DISPATCHED}>
                      {t("orders.statusOptions.dispatched", "Ready for Delivery")}
                    </SelectItem>
                    <SelectItem value={ORDER_STATUS.DELIVERED}>
                      {t("orders.statusOptions.delivered", "Delivered")}
                    </SelectItem>
                    <SelectItem value={ORDER_STATUS.CANCELLED}>
                      {t("orders.statusOptions.cancelled", "Cancelled")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="default" 
                disabled={status === order.status || isUpdating || updateOrderStatusMutation.isPending || order.status === ORDER_STATUS.CANCELLED}
                onClick={handleUpdateStatus}
                className="whitespace-nowrap"
              >
                {isUpdating || updateOrderStatusMutation.isPending 
                  ? t("orders.updating", "Updating...") 
                  : t("orders.updateStatus", "Update Status")}
              </Button>
            </div>
            
            {/* Cancellation reason textarea - show when status is CANCELLED or order has existing reason */}
            {(status === ORDER_STATUS.CANCELLED || order.cancellationReason) && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">
                  {t("orders.cancellationReason", "Cancellation Reason")} 
                  {status === "CANCELLED" && order.status !== "CANCELLED" && <span className="text-red-500">*</span>}
                </p>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md h-20 text-sm"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder={t("orders.enterCancellationReason", "Please enter the reason for cancellation...")}
                  disabled={isUpdating || updateOrderStatusMutation.isPending || order.status === "CANCELLED"}
                  readOnly={order.status === "CANCELLED"}
                ></textarea>
                {order.status === "CANCELLED" && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {t("orders.orderAlreadyCancelled", "This order has been cancelled and cannot be updated.")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {/* Customer Information (Restaurant view specific) */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/20 px-4 py-2">
              <h4 className="font-medium text-base">
                {t("orders.customerInfo", "Customer Information")}
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
                  {t("orders.deliveryInfo", "Delivery Information")}
                </h5>
                <p>{order.deliveryAddress}</p>
                {order.notes && (
                  <div className="mt-3 bg-muted/10 rounded-md p-2">
                    <p className="text-sm font-medium mb-1 text-gray-600">
                      {t("orders.customerNotes", "Customer Notes")}
                    </p>
                    <p className="text-sm italic">{order.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Payment Transaction Information */}
              <div className="border-t mt-4 pt-4">
                <h5 className="font-medium text-sm mb-2">
                  {t("orders.paymentInfo", "Payment Information")}
                </h5>
                {order.paymentTransaction ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("orders.paymentMethod", "Payment Method")}:</span>
                      <span className="font-medium">{order.paymentTransaction.paymentMethod || 'Mobile Money'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("orders.mobileNumber", "Mobile Number")}:</span>
                      <span className="font-medium">{order.paymentTransaction.mobileNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("orders.operator", "Operator")}:</span>
                      <span className="font-medium">{order.paymentTransaction.providerName || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("orders.reference", "Reference Number")}:</span>
                      <span className="font-medium">{order.paymentTransaction.transactionId || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("orders.status", "Status")}:</span>
                      <span className="font-medium">{order.paymentTransaction.status || '-'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">{t("orders.noPaymentInfo", "No payment information available")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items with Images */}
          <div>
            <h4 className="font-medium text-base mb-3">
              {t("orders.orderItems", "Order Items")}
            </h4>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? order.items.map((item) => (
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
              )) : (
                <div className="text-gray-400 p-2 text-center">
                  {t("orders.noItems", "No items in this order")}
                </div>
              )}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-500">{t("orders.subtotal", "Subtotal")}</span>
              <span>{formatPrice(
                parseFloat(String(order.totalAmount || 0)) - 
                deliveryFee
              )}</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="font-medium text-gray-500">
                {t("orders.deliveryFee", "Delivery fee")}
              </span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-base mt-3">
              <span>{t("orders.total", "Total")}</span>
              <span>{formatPrice(order.totalAmount || 0)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="bg-gray-50 p-4">
          <Button variant="outline" onClick={onClose}>
            {t("orders.close", "Close")}
          </Button>
          <Button 
            variant="default" 
            disabled={
              status === order.status || 
              isUpdating || 
              updateOrderStatusMutation.isPending || 
              order.status === "CANCELLED" ||
              (status === "CANCELLED" && !cancellationReason.trim())
            }
            onClick={handleUpdateStatus}
          >
            {isUpdating || updateOrderStatusMutation.isPending 
              ? t("orders.updating", "Updating...") 
              : t("orders.updateStatus", "Update Status")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
