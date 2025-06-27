/**
 * Orders Table Component for Admin Dashboard
 *
 * Displays a paginated, sortable table of orders across all restaurants
 * Includes filtering capability for order status, restaurant, and date range
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";

// tRPC
import { trpc } from "@/lib/trpc/client";

// Components
import OrderDetailsAdmin from "./order-details-admin";

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
  ChefHat,
  Ban
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
  restaurantName?: string; // Added restaurant filter
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
}

/**
 * Get status badge UI based on order status
 */
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case ORDER_STATUS.PLACED:
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">Placed</Badge>;
    case ORDER_STATUS.PREPARING:
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">Preparing</Badge>;
    case ORDER_STATUS.DISPATCHED:
      return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">Dispatched</Badge>;
    case ORDER_STATUS.DELIVERED:
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800">Delivered</Badge>;
    case ORDER_STATUS.CANCELLED:
      return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

/**
 * Orders table component for the admin dashboard
 * Displays all orders across restaurants with pagination, sorting and filtering
 */
export default function OrdersTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSortField = "createdAt",
  initialSortOrder = "desc",
  initialFilter = "",
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
    restaurantName: "",
  });
  const [filterInputValue, setFilterInputValue] = useState(initialFilter);
  const [restaurantFilterValue, setRestaurantFilterValue] = useState("");
  const [isFiltering, setIsFiltering] = useState(!!initialFilter);
  
  // State for order details modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Get translation hook
  const { t } = useTranslation();
  
  // Get TRPC utils for query invalidation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const utils = trpc.useContext();
  
  // Get restaurants for filter dropdown
  const { data: restaurants } = trpc.restaurant.getAllRestaurants.useQuery();

  // Define table columns
  const columns: OrderTableColumn[] = [
    {
      id: "displayOrderNumber",
      accessorKey: "displayOrderNumber",
      header: "Order ID",
      enableSorting: true,
    },
    {
      id: "restaurant",
      accessorKey: "restaurant",
      header: "Restaurant",
      cell: (info) => {
        const restaurant = info.getValue() as { name: string };
        return restaurant?.name || "—";
      },
      enableSorting: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as OrderStatus;
        return getStatusBadge(status);
      },
      enableSorting: true,
    },
    {
      id: "customer",
      accessorKey: "customer",
      header: "Customer",
      cell: (info) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customer = info.getValue() as any;
        return customer?.user?.name || 'Anonymous';
      },
      enableSorting: false,
    },
    {
      id: "orderItems",
      accessorKey: "orderItems",
      header: "Items",
      cell: (info) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = info.getValue() as any[];
        return items ? `${items.length} item${items.length !== 1 ? 's' : ''}` : '—';
      },
      enableSorting: false,
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: "Total",
      cell: (info) => {
        const total = info.getValue() as number;
        return total ? `$${parseFloat(total.toString()).toFixed(2)}` : '—';
      },
      enableSorting: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Date",
      cell: (info) => {
        const date = info.getValue() as string;
        return date ? format(new Date(date), 'MMM d, yyyy h:mm a') : '—';
      },
      enableSorting: true,
    },
    {
      id: "actions",
      accessorKey: "id",
      header: "Actions",
      cell: (info) => {
        const order = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Format the order object for the details modal
                const formattedOrder = {
                  id: order.id,
                  status: order.status,
                  displayOrderNumber: order.displayOrderNumber,
                  createdAt: order.createdAt,
                  deliveryAddress: order.deliveryAddress,
                  customerNotes: order.customerNotes,
                  customer: order.customer,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  items: order.orderItems?.map((item: any) => ({
                    id: item.id,
                    name: item.menuItem?.name || "Unknown Item",
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
                    name: "Unknown Restaurant",
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
              View Details
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  // Fetch order data with pagination, sorting and filtering
  const { data, isLoading } =
    trpc.order.getAllOrders.useQuery(
      {
        page,
        limit: pageSize,
        sortField,
        sortOrder,
        filters: {
          orderId: filters.orderId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: filters.status as any,
          restaurantName: filters.restaurantName,
          startDate: filters.startDate,
          endDate: filters.endDate,
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

  // Handle filter submit
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      orderId: filterInputValue,
      restaurantName: restaurantFilterValue
    }));
    setIsFiltering(true);
    setPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterInputValue("");
    setRestaurantFilterValue("");
    setFilters({ orderId: "", status: "ALL", restaurantName: "" });
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
    if (filters.restaurantName) params.set("restaurant", filters.restaurantName);
    
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
      <div className="rounded-lg border">
        <div className="p-1">
          {/* Table header skeleton */}
          <div className="flex items-center p-4 bg-muted-foreground/5">
            {/* Column skeletons */}
            {Array.from({ length: columns.length }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${i === columns.length - 1 ? "flex-0 w-16" : ""}`}
              >
                <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
              </div>
            ))}
          </div>

          {/* Table rows skeleton */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center p-4 border-t">
              {Array.from({ length: columns.length }).map((_, cell) => (
                <div
                  key={`${row}-${cell}`}
                  className={`flex-1 ${cell === columns.length - 1 ? "flex-0 w-16" : ""}`}
                >
                  <Skeleton
                    className={`h-5 bg-muted-foreground/5 ${
                      cell === 0 ? "w-24" : 
                      cell === 1 ? "w-32" : 
                      cell === 2 ? "w-20" : 
                      cell === 3 ? "w-28" :
                      "w-16"
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">{t("admin.orders.title", "Orders")}</h2>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Status filter */}
          <Select
            value={filters.status || "ALL"}
            onValueChange={(value) => {
              setFilters(prev => ({ ...prev, status: value }));
              setPage(1);
              setIsFiltering(true);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("orders.allStatuses", "All Statuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("orders.allStatuses", "All Statuses")}</SelectItem>
              <SelectItem value="PLACED">{t("orders.statusPlaced", "Placed")}</SelectItem>
              <SelectItem value="PREPARING">{t("orders.statusPreparing", "Preparing")}</SelectItem>
              <SelectItem value="DISPATCHED">{t("orders.statusDispatched", "Dispatched")}</SelectItem>
              <SelectItem value="DELIVERED">{t("orders.statusDelivered", "Delivered")}</SelectItem>
              <SelectItem value="CANCELLED">{t("orders.statusCancelled", "Cancelled")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Restaurant filter */}
          <Select
            value={restaurantFilterValue}
            onValueChange={setRestaurantFilterValue}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("orders.allRestaurants", "All Restaurants")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("orders.allRestaurants", "All Restaurants")}</SelectItem>
              {restaurants?.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.name}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Order ID filter */}
          <form
            onSubmit={handleFilterSubmit}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="text"
              placeholder={t("orders.searchOrderId", "Search by Order ID...")}
              value={filterInputValue}
              onChange={(e) => setFilterInputValue(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="outline" className="cursor-pointer">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          {isFiltering && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              {t("common.clearFilters", "Clear Filters")}
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
          <h3 className="text-xl font-medium">No orders found</h3>
          <p className="mt-2 text-muted-foreground mx-auto max-w-md text-center">
            {isFiltering
              ? t("orders.noOrdersFilter", "No orders match your current filters")
              : t("orders.noOrdersYet", "No orders have been placed yet")}
          </p>
          {isFiltering && (
            <Button
              className="mt-6"
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              {t("common.clearFilters", "Clear filters")}
            </Button>
          )}
        </div>
      ) : (
        <>
          {data && data.orders.length > 0 && (
            <>
              {/* Order status summary */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-600 font-medium">Placed</p>
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
                  <p className="text-yellow-600 font-medium">Preparing</p>
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
                  <p className="text-green-600 font-medium">Dispatched</p>
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
                  <p className="text-purple-600 font-medium">Delivered</p>
                  <p className="text-2xl font-bold">{data.orders.filter(o => o.status === "DELIVERED").length}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-red-600 font-medium">Cancelled</p>
                  <p className="text-2xl font-bold">{data.orders.filter(o => o.status === "CANCELLED").length}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <Ban className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders table */}
          <ScrollArea className="w-[1150px]">
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
                      let value;
                      if (column.accessorKey.includes(".")) {
                        const keys = column.accessorKey.split(".");
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        let obj = order as any;
                        for (const key of keys) {
                          obj = obj?.[key];
                          if (obj === undefined || obj === null) break;
                        }
                        value = obj;
                      } else if (order.hasOwnProperty(column.accessorKey)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        value = (order as any)[column.accessorKey];
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

          {/* Pagination controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {start}–{end} of {totalOrders} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="hidden sm:flex"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <div className="text-sm font-medium">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page >= totalPages}
                className="hidden sm:flex"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
            </>
          )}
        </>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsAdmin
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          t={t}
        />
      )}
    </div>
  );
}
