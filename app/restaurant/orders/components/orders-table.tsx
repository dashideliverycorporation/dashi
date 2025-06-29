/**
 * Orders Table Component for Restaurant Dashboard
 *
 * Displays a paginated, sortable table of orders
 * Includes filtering capability for order status and date range
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";

// tRPC
import { trpc } from "@/lib/trpc/client";

// Components
import OrderDetailsRestaurant from "./order-details-restaurant";

// Hooks
import useTranslation from "@/hooks/useTranslation";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Truck,
  ChefHat
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Types
import { type OrderStatus} from "@/prisma/app/generated/prisma/client";
import { ORDER_STATUS } from "@/lib/constants/order-status";

// Type definitions
interface OrderTableColumn {
  id: string;
  accessorKey: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell?: (info: any) => React.ReactNode;
  enableSorting?: boolean;
}

interface OrderFilterState {
  orderId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * OrdersTable component props
 */
interface OrdersTableProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSortField?: string;
  initialSortOrder?: "asc" | "desc";
  initialFilter?: string;
  restaurantId: string;
}

/**
 * Get status badge UI based on order status
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatusBadge = (status: OrderStatus, t: (key: string, options?: any) => string) => {
  switch (status) {
    case ORDER_STATUS.PLACED:
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">{t("orders.statusOptions.placed")}</Badge>;
    case ORDER_STATUS.PREPARING:
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">{t("orders.statusOptions.preparing")}</Badge>;
    case ORDER_STATUS.DISPATCHED:
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">{t("orders.statusOptions.dispatched")}</Badge>;
    case ORDER_STATUS.DELIVERED:
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800">{t("orders.statusOptions.delivered")}</Badge>;
    case ORDER_STATUS.CANCELLED:
      return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">{t("orders.statusOptions.cancelled")}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

/**
 * Orders table component for the restaurant dashboard
 * Displays orders with pagination, sorting and filtering
 */
export default function OrdersTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSortField = "createdAt",
  initialSortOrder = "desc",
  initialFilter = "",
  restaurantId,
}: OrdersTableProps) {
  // Router for URL manipulation
  const router = useRouter();
  const pathname = usePathname();

  // State management for pagination, sorting and filtering
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize] = useState<number>(initialPageSize);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [filters, setFilters] = useState<OrderFilterState>({
    orderId: initialFilter,
    status: "ALL",
  });
  const [filterInputValue, setFilterInputValue] = useState(initialFilter);
  const [isFiltering, setIsFiltering] = useState(!!initialFilter);
  
  // State for order details modal
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Get translation hook
  const { t } = useTranslation();
  
  // Get TRPC utils for query invalidation
  const utils = trpc.useContext();
  
  // Setup mutation for updating order status
  const updateOrderStatusMutation = trpc.order.updateOrderStatus.useMutation({
    onSuccess: () => {
      // Invalidate orders query to refresh data
      utils.order.getRestaurantOrders.invalidate();
    }
  });

  // Define table columns
  const columns: OrderTableColumn[] = [
    {
      id: "displayOrderNumber",
      accessorKey: "displayOrderNumber",
      header: t("orders.table.orderId"),
      enableSorting: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("orders.table.status"),
      cell: (info) => {
        const status = info.getValue() as OrderStatus;
        return getStatusBadge(status, t);
      },
      enableSorting: true,
    },
    {
      id: "customer",
      accessorKey: "customer",
      header: t("orders.table.customer"),
      cell: (info) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customer = info.getValue() as any;
        return customer?.user?.name || t("orders.table.anonymous");
      },
      enableSorting: false,
    },
    {
      id: "orderItems",
      accessorKey: "orderItems",
      header: t("orders.table.items"),
      cell: (info) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = info.getValue() as any[];
        return items ? (items.length === 1 
          ? t("orders.table.oneItem")
          : t("orders.table.multipleItems", { count: items.length })
        ) : '—';
      },
      enableSorting: false,
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: t("orders.table.total"),
      cell: (info) => {
        const value = info.getValue();
        // Handle different possible types for total amount
        if (!value) return "—";
        
        // Convert to number if it's a string or already a number
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        
        // Check if we have a valid number after conversion
        return !isNaN(numValue) ? `$${numValue.toFixed(2)}` : "—";
      },
      enableSorting: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: t("orders.table.placedAt"),
      cell: (info) =>
        format(new Date(info.getValue() as string), "MMM d, yyyy h:mm a"),
      enableSorting: true,
    },
    {
      id: "actions",
      accessorKey: "id",
      header: t("orders.table.actions"),
      cell: (info) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const order = info.row.original as any;

        return (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Transform order data to match the expected format
                const formattedOrder = {
                  ...order,
                  // Map orderItems to items
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  items: order.orderItems?.map((item: any) => ({
                    id: item.id,
                    name: item.menuItem?.name || t("orders.unknownItem"),
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.menuItem?.imageUrl
                  })) || [],
                  // Use totalAmount for order total
                  totalAmount: order.totalAmount,
                  // Include restaurant with deliveryFee
                  restaurant: order.restaurant ? {
                    id: order.restaurant.id,
                    name: order.restaurant.name,
                    imageUrl: order.restaurant.imageUrl,
                    deliveryFee: order.restaurant.deliveryFee
                  } : {
                    id: order.restaurantId,
                    name: t("orders.unknownRestaurant"),
                    deliveryFee: 0
                  },
                  // Ensure paymentTransaction is passed through correctly
                  paymentTransaction: order.paymentTransaction ? {
                    ...order.paymentTransaction,
                  } : undefined
                };
                setSelectedOrder(formattedOrder);
              }}
            >
              {t("orders.viewDetails")}
            </Button>
            <Select
              value={order.status}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(newStatus: any) => {
                updateOrderStatusMutation.mutate({
                  orderId: order.id,
                  status: newStatus
                });
              }}
              disabled={updateOrderStatusMutation.isPending || order.status === "CANCELLED"}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t("orders.updateStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ORDER_STATUS.PLACED}>{t("orders.statusOptions.placed")}</SelectItem>
                <SelectItem value={ORDER_STATUS.PREPARING}>{t("orders.statusOptions.preparing")}</SelectItem>
                <SelectItem value={ORDER_STATUS.DISPATCHED}>{t("orders.statusOptions.dispatched")}</SelectItem>
                <SelectItem value={ORDER_STATUS.DELIVERED}>{t("orders.statusOptions.delivered")}</SelectItem>
                <SelectItem value={ORDER_STATUS.CANCELLED} disabled>{t("orders.statusOptions.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  // Fetch order data with pagination, sorting and filtering
  const { data, isLoading } =
    trpc.order.getRestaurantOrders.useQuery(
      {
        restaurantId,
        page,
        limit: pageSize,
        sortField,
        sortOrder,
        filters: {
          orderId: filters.orderId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: filters.status as any,
        },
      },
      {
        // Disable automatic refetching to avoid extra API calls
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );
    
  // Calculate pagination values from the API response
  const totalOrders = data?.pagination.total || 0;
  const totalPages = data?.pagination.totalPages || 1;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalOrders);

  // Handle sort toggle
  const handleSort = (columnId: string) => {
    if (sortField === columnId) {
      // Toggle sort direction if already sorting by this column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Sort by new column in ascending order
      setSortField(columnId);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    setPage(1);
  };

  // Handle filter submission
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, orderId: filterInputValue });
    setIsFiltering(!!filterInputValue || !!filters.status);
    setPage(1); // Reset to first page when filter changes
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value });
    setIsFiltering(!!filterInputValue || !!value);
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterInputValue("");
    setFilters({ orderId: "", status: "ALL" });
    setIsFiltering(false);
    setPage(1);
  };

  // Update URL search params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (pageSize !== 10) params.set("size", pageSize.toString());
    if (sortField !== "createdAt") params.set("sort", sortField);
    if (sortOrder !== "desc") params.set("order", sortOrder);
    if (filters.orderId) params.set("filter", filters.orderId);
    if (filters.status) params.set("status", filters.status);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [page, pageSize, sortField, sortOrder, filters, pathname, router]);

  // Handle pagination
  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Skeleton className="h-8 w-32" />
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-full md:w-80" />
            <Skeleton className="h-10 w-full md:w-32" />
          </div>
        </div>

        {/* Status summary skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted/20 p-4 rounded-lg border">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table skeleton */}
        <div className="hidden md:block rounded-lg border">
          <div className="p-1">
            {/* Table header skeleton */}
            <div className="flex items-center p-4 bg-muted-foreground/5">
              {/* Column skeletons */}
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex-1">
                  <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
                </div>
              ))}
            </div>

            {/* Table rows skeleton */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="flex items-center p-4 border-t">
                {/* Cell skeletons */}
                {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                  <div
                    key={`${row}-${cell}`}
                    className="flex-1"
                  >
                    <Skeleton
                      className={`h-5 bg-muted-foreground/5 ${
                        cell === 1 ? "w-24" : 
                        cell === 2 ? "w-20" : 
                        cell === 3 ? "w-28" : 
                        cell === 4 ? "w-16" : 
                        cell === 5 ? "w-20" :
                        cell === 6 ? "w-32" :
                        "w-24"
                      }`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile cards skeleton */}
        <div className="md:hidden space-y-4">
          {[1, 2, 3, 4, 5].map((card) => (
            <Card key={card}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">{t("orders.title")}</h2>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Status filter */}
          <Select
            value={filters.status || "ALL"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("orders.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("orders.allStatuses")}</SelectItem>
              <SelectItem value="PLACED">{t("orders.statusOptions.placed")}</SelectItem>
              <SelectItem value="PREPARING">{t("orders.statusOptions.preparing")}</SelectItem>
              <SelectItem value="DISPATCHED">{t("orders.statusOptions.dispatched")}</SelectItem>
              <SelectItem value="DELIVERED">{t("orders.statusOptions.delivered")}</SelectItem>
              <SelectItem value="CANCELLED">{t("orders.statusOptions.cancelled")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Order ID filter */}
          <form
            onSubmit={handleFilterSubmit}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="text"
              placeholder={t("orders.searchByOrderId")}
              value={filterInputValue}
              onChange={(e) => setFilterInputValue(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="outline" className="cursor-pointer">
              <Search className="h-4 w-4" />
              <span className="sr-only">{t("common.search")}</span>
            </Button>
          </form>

          {isFiltering && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              {t("orders.clearFilters")}
            </Button>
          )}
        </div>
      </div>

      {/* No results message */}
      {!data || (data && data.orders.length === 0) ? (
        <div className="rounded-lg border p-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Clock className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">{t("orders.noOrdersFound")}</h3>
          <p className="mt-2 text-muted-foreground mx-auto max-w-md text-center">
            {isFiltering
              ? t("orders.noOrdersFilter")
              : t("orders.noOrdersYet")}
          </p>
          {isFiltering && (
            <Button
              className="mt-6"
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              {t("orders.clearAllFilters")}
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Order status summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-600 font-medium">{t("orders.summaryCards.placed")}</p>
                  <p className="text-2xl font-bold">{data.orders.filter(o => o.status === "PLACED").length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-yellow-600 font-medium">{t("orders.summaryCards.preparing")}</p>
                  <p className="text-2xl font-bold">{data.orders.filter(o => o.status === "PREPARING").length}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <ChefHat className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-600 font-medium">{t("orders.summaryCards.dispatched")}</p>
                  <p className="text-2xl font-bold">{data.orders.filter(o => o.status === "DISPATCHED").length}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-600 font-medium">{t("orders.summaryCards.delivered")}</p>
                  <p className="text-2xl font-bold">{data.orders.filter(o => o.status === "DELIVERED").length}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader className="rounded-b-lg">
                  <TableRow className="bg-muted-foreground/5 border-none rounded-b-lg">
                    {columns.map((column) => (
                      <TableHead 
                        key={column.id} 
                        className="whitespace-nowrap"
                        onClick={() => column.enableSorting && handleSort(column.id)}
                      >
                        <div className="flex items-center">
                          {column.header}
                          {column.enableSorting && (
                            <div className="ml-1">
                              {sortField === column.id ? (
                                sortOrder === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
                              )}
                            </div>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.orders.map((order) => (
                    <TableRow key={order.id}>
                      {columns.map((column) => {
                        // Handle nested properties with dot notation
                        const accessorKey = column.accessorKey;
                        let value: unknown;

                        if (
                          typeof accessorKey === "string" &&
                          accessorKey.includes(".")
                        ) {
                          // Handle dot notation for nested properties
                          const keys = accessorKey.split(".");
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          let nestedValue: any = order;
                          
                          for (const key of keys) {
                            if (nestedValue && typeof nestedValue === "object") {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              nestedValue = (nestedValue as any)[key];
                            } else {
                              nestedValue = undefined;
                              break;
                            }
                          }
                          
                          value = nestedValue;
                        } else if (typeof accessorKey === "string") {
                          // Handle direct property access
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          value = (order as any)[accessorKey];
                        } else {
                          value = undefined;
                        }

                        return (
                          <TableCell key={column.id}>
                            {column.cell
                              ? column.cell({
                                  getValue: () => value,
                                  row: { original: order },
                                })
                              : (value as React.ReactNode)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-4">
            {data.orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Order header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{t("orders.table.orderId")} {order.displayOrderNumber}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status, t)}
                      </div>
                    </div>

                    {/* Order details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("orders.mobileLabels.customer")}</span>
                        <span>{(
                          order 
                          ).customer?.user?.name || t("orders.table.anonymous")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("orders.mobileLabels.items")}</span>
                        <span>
                          {(order).orderItems ? (
                            (order).orderItems.length === 1
                              ? t("orders.table.oneItem")
                              : t("orders.table.multipleItems", { count: (order).orderItems.length })
                          ) : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("orders.mobileLabels.total")}</span>
                        <span className="font-medium">
                          ${typeof order.totalAmount === 'string' 
                            ? parseFloat(order.totalAmount).toFixed(2)
                            : Number(order.totalAmount).toFixed(2)
                          }
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          // Transform order data to match the expected format
                          const formattedOrder = {
                            ...order,
                            // Map orderItems to items
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            items: (order as any).orderItems?.map((item: any) => ({
                              id: item.id,
                              name: item.menuItem?.name || t("orders.unknownItem"),
                              price: item.price,
                              quantity: item.quantity,
                              imageUrl: item.menuItem?.imageUrl
                            })) || [],
                            // Use totalAmount for order total
                            totalAmount: order.totalAmount,
                            // Include restaurant with deliveryFee
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            restaurant: (order as any).restaurant ? {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              id: (order as any).restaurant.id,
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              name: (order as any).restaurant.name,
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              imageUrl: (order as any).restaurant.imageUrl,
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              deliveryFee: (order as any).restaurant.deliveryFee
                            } : {
                              id: order.restaurantId,
                              name: t("orders.unknownRestaurant"),
                              deliveryFee: 0
                            },
                            // Ensure paymentTransaction is passed through correctly
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            paymentTransaction: (order as any).paymentTransaction ? {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              ...(order as any).paymentTransaction,
                            } : undefined
                          };
                          setSelectedOrder(formattedOrder);
                        }}
                      >
                        {t("orders.viewDetails")}
                      </Button>
                      <Select
                        value={order.status}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onValueChange={(newStatus: any) => {
                          updateOrderStatusMutation.mutate({
                            orderId: order.id,
                            status: newStatus
                          });
                        }}
                        disabled={updateOrderStatusMutation.isPending || order.status === "CANCELLED"}
                      >
                        <SelectTrigger className="flex-1 sm:w-32 sm:flex-none w-full">
                          <SelectValue placeholder={t("orders.updateStatus")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ORDER_STATUS.PLACED}>{t("orders.statusOptions.placed")}</SelectItem>
                          <SelectItem value={ORDER_STATUS.PREPARING}>{t("orders.statusOptions.preparing")}</SelectItem>
                          <SelectItem value={ORDER_STATUS.DISPATCHED}>{t("orders.statusOptions.dispatched")}</SelectItem>
                          <SelectItem value={ORDER_STATUS.DELIVERED}>{t("orders.statusOptions.delivered")}</SelectItem>
                          <SelectItem value={ORDER_STATUS.CANCELLED} disabled>{t("orders.statusOptions.cancelled")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {t("orders.pagination.showing")} {start}–{end} {t("orders.pagination.of")} {totalOrders} {t("orders.pagination.orders")}
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="hidden sm:flex"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">{t("orders.pagination.firstPage")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">{t("orders.pagination.previousPage")}</span>
              </Button>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {t("orders.pagination.page")} {page} {t("orders.pagination.of")} {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">{t("orders.pagination.nextPage")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page >= totalPages}
                className="hidden sm:flex"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">{t("orders.pagination.lastPage")}</span>
              </Button>
            </div>
          </div>
        </>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsRestaurant
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
