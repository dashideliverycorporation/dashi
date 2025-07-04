/**
 * Sales Table Component for Restaurant Dashboard
 *
 * Displays a paginated, sortable table of restaurant's sales data
 * Includes filtering capability for order ID, date range, and other attributes
 */
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

// tRPC
import { trpc } from "@/lib/trpc/client";

// Hooks
import { useTranslation } from "@/hooks/useTranslation";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Calendar,
  DollarSign,
  BarChart,
  ShoppingBag,
} from "lucide-react";

// Types
interface SalesTableColumn {
  id: string;
  accessorKey: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell?: (info: any) => React.ReactNode;
  enableSorting?: boolean;
}

// UI-specific period values
type UIPeriod = "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "LAST_30_DAYS";

// API-specific period values
type APIPeriod = "ALL" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface SalesFilterState {
  orderId?: string;
  period?: UIPeriod;
  startDate?: string;
  endDate?: string;
}

/**
 * SalesTable component props
 */
interface SalesTableProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSortField?: string;
  initialSortOrder?: "asc" | "desc";
  initialFilter?: string;
}

/**
 * RestaurantSalesTable component for the restaurant dashboard
 * Displays restaurant-specific sales data with pagination, sorting and filtering
 */
export default function RestaurantSalesTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSortField = "orderDate",
  initialSortOrder = "desc",
  initialFilter = "",
}: SalesTableProps) {
  // Get session data for restaurant ID
  const { data: session } = useSession();
  const restaurantId = session?.user?.id;
  
  // Translation hook
  const { t } = useTranslation();
  
  // Debug logging for session data
  console.log("Session data:", session);
  console.log("Using user ID as restaurant ID:", restaurantId);
  
  // State management for pagination, sorting and filtering
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize] = useState<number>(initialPageSize);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [filters, setFilters] = useState<SalesFilterState>({
    orderId: initialFilter,
    period: "ALL" as const,
  });
  const [filterInputValue, setFilterInputValue] = useState(initialFilter);
  const [isFiltering, setIsFiltering] = useState(!!initialFilter);

  // Table columns definition
  const columns: SalesTableColumn[] = [
    {
      id: "orderId",
      accessorKey: "orderId",
      header: t("restaurantSales.table.orderId"),
      cell: (info) => <span className="font-medium">#{info.getValue()}</span>,
      enableSorting: true,
    },
    {
      id: "orderDate",
      accessorKey: "orderDate",
      header: t("restaurantSales.table.date"),
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      enableSorting: true,
    },
    {
      id: "customerName",
      accessorKey: "customerName",
      header: t("restaurantSales.table.customer"),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      id: "itemCount",
      accessorKey: "itemCount",
      header: t("restaurantSales.table.items"),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: t("restaurantSales.table.amount"),
      cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
      enableSorting: true,
    },
  ];

  // Return early if no restaurantId is available
  if (!restaurantId) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Calendar className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium">{t("restaurantSales.error.unableToLoad")}</h3>
        <p className="mt-2 text-muted-foreground mx-auto max-w-md text-center">
          {t("restaurantSales.error.restaurantInfoNotAvailable")}
        </p>
      </div>
    );
  }
  
  /**
   * Maps UI period values to API-expected period values
   * @param uiPeriod The period value from the UI
   * @returns A period value the API can understand
   */
  const mapPeriodToApiValue = (uiPeriod?: UIPeriod): APIPeriod | undefined => {
    switch(uiPeriod) {
      case "TODAY":
        return "DAILY";
      case "THIS_WEEK":
        return "WEEKLY";
      case "THIS_MONTH":
        return "MONTHLY";
      case "LAST_30_DAYS":
        return "ALL"; // Using ALL with date range
      case "ALL":
        return "ALL";
      default:
        return "ALL";
    }
  };
  
  // Fetch restaurant sales data based on the current filters and pagination
  const { data: salesData, isLoading } = trpc.restaurant.getSales.useQuery({
    restaurantId: restaurantId as string,
    page,
    pageSize,
    sortField,
    sortOrder,
    filters: {
      orderId: filters.orderId,
      period: mapPeriodToApiValue(filters.period),
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
  }, {
    enabled: !!restaurantId,
    refetchOnWindowFocus: false,
  });
  
  // Debug logging for sales data response
  console.log("Sales data response:", salesData);
  
  // Add more detailed debug logs
  if (salesData) {
    console.log("Orders found:", salesData.orders.length);
    console.log("Total sales amount:", salesData.summary?.totalSales);
  } else {
    console.log("No sales data received yet");
  }
  
  /**
   * Handles sorting when a column header is clicked
   * @param field The field to sort by
   */
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending order
      setSortField(field);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    setPage(1);
  };

  /**
   * Applies the current filter input value
   */
  const applyFilter = () => {
    setFilters((prev) => ({
      ...prev,
      orderId: filterInputValue.trim(),
    }));
    setIsFiltering(!!filterInputValue.trim());
    setPage(1);
  };

  /**
   * Clears the current filter
   */
  const clearFilter = () => {
    setFilterInputValue("");
    setFilters((prev) => ({
      ...prev,
      orderId: "",
    }));
    setIsFiltering(false);
    setPage(1);
  };

  /**
   * Handles time period filter change
   * @param value The selected period value
   */
  const handlePeriodChange = (value: string) => {
    let startDate: string | undefined;
    let endDate: string | undefined;
    
    const today = new Date();
    
    switch(value) {
      case "TODAY":
        startDate = today.toISOString().split("T")[0];
        endDate = startDate;
        break;
      case "THIS_WEEK": {
        const firstDay = new Date(today);
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        firstDay.setDate(diff);
        startDate = firstDay.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      }
      case "THIS_MONTH": {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      }
      case "LAST_30_DAYS": {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        startDate = thirtyDaysAgo.toISOString().split("T")[0];
        endDate = today.toISOString().split("T")[0];
        break;
      }
      case "ALL":
      default:
        startDate = undefined;
        endDate = undefined;
    }
    
    setFilters((prev) => ({
      ...prev,
      period: value as UIPeriod,
      startDate,
      endDate,
    }));
    setPage(1);
  };

  // Extract and format data from the server response
  const orders = salesData?.orders || [];
  const totalOrders = salesData?.pagination?.total || 0;
  const totalPages = salesData?.pagination?.totalPages || 1;
  const totalSales = salesData?.summary?.totalSales || 0;
  const orderCount = salesData?.summary?.orderCount || 0;
  const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
  // Calculate commission (10% of total sales)
  const commission = totalSales * 0.1;
  
  // Format the data for the table
  const tableData = {
    sales: orders,
    pagination: {
      total: totalOrders,
      totalPages,
      currentPage: page,
    },
    totalSales,
    totalOrders,
    averageOrderValue,
    commission,
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">{t("restaurantSales.title")}</h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex w-full md:w-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                applyFilter();
              }}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                type="text"
                placeholder={t("restaurantSales.searchByOrderId")}
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
                onClick={clearFilter}
                className="ml-2"
              >
                {t("restaurantSales.clearFilters")}
              </Button>
            )}
          </div>
  
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("restaurantSales.period")}:</span>
            </div>
            <Select
              value={filters.period || "ALL"}
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("restaurantSales.filterByPeriod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("restaurantSales.periods.allTime")}</SelectItem>
                <SelectItem value="TODAY">{t("restaurantSales.periods.today")}</SelectItem>
                <SelectItem value="THIS_WEEK">{t("restaurantSales.periods.thisWeek")}</SelectItem>
                <SelectItem value="THIS_MONTH">{t("restaurantSales.periods.thisMonth")}</SelectItem>
                <SelectItem value="LAST_30_DAYS">{t("restaurantSales.periods.last30Days")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sales summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 font-medium">{t("restaurantSales.summaryCards.totalSales")}</p>
              <p className="text-xl font-bold">
                ${totalSales.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-yellow-600 font-medium">{t("restaurantSales.summaryCards.totalOrders")}</p>
              <p className="text-xl font-bold">{orderCount}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <ShoppingBag className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 font-medium">{t("restaurantSales.summaryCards.averageOrder")}</p>
              <p className="text-xl font-bold">
                ${averageOrderValue.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <BarChart className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-600 font-medium">{t("restaurantSales.summaryCards.commission")}</p>
              <p className="text-xl font-bold">
                ${commission.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="w-full space-y-4">
          {/* Desktop table skeleton */}
          <div className="hidden md:block rounded-lg border">
            <div className="p-1">
              {/* Table header skeleton */}
              <div className="flex items-center p-4 bg-muted-foreground/5">
                {columns.map((_, i) => (
                  <div key={i} className="flex-1">
                    <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
                  </div>
                ))}
              </div>

              {/* Table rows skeleton */}
              {Array.from({ length: pageSize }).map((_, row) => (
                <div key={row} className="flex items-center p-4 border-t">
                  {columns.map((_, cell) => (
                    <div key={`${row}-${cell}`} className="flex-1">
                      <Skeleton
                        className={`h-5 bg-muted-foreground/5 ${
                          cell === 0 ? "w-24" : 
                          cell === 1 ? "w-28" : 
                          cell === 2 ? "w-32" : 
                          cell === 3 ? "w-16" : 
                          "w-20"
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
            {Array.from({ length: pageSize }).map((_, card) => (
              <Card key={card}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : tableData.sales.length === 0 ? (
        /* No results message */
        <div className="rounded-lg border p-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">{t("restaurantSales.noSalesDataFound")}</h3>
          <p className="mt-2 text-muted-foreground mx-auto max-w-md text-center">
            {isFiltering
              ? t("restaurantSales.noSalesDataMatches")
              : t("restaurantSales.noSalesDataRecorded")}
          </p>
          {isFiltering && (
            <Button
              className="mt-6"
              variant="outline"
              size="sm"
              onClick={clearFilter}
            >
              {t("restaurantSales.clearAllFilters")}
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="hidden md:block">
            <ScrollArea className="w-full whitespace-nowrap">
              <Table>
                <TableHeader className="rounded-b-lg">
                  <TableRow className="bg-muted-foreground/5 border-none rounded-b-lg">
                    {columns.map((column) => (
                      <TableHead 
                        key={column.id} 
                        className="whitespace-nowrap"
                        onClick={() => column.enableSorting && handleSort(column.accessorKey)}
                        style={{ cursor: column.enableSorting ? 'pointer' : 'default' }}
                      >
                        <div className="flex items-center">
                          {column.header}
                          {column.enableSorting && sortField === column.accessorKey && (
                            <span className="ml-1">
                              {sortOrder === 'asc' ? '▲' : '▼'}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.sales.map((sale) => (
                    <TableRow key={sale.id}>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.cell ? column.cell({ getValue: () => sale[column.accessorKey as keyof typeof sale] }) : sale[column.accessorKey as keyof typeof sale]?.toString()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-4">
            {tableData.sales.map((sale) => (
              <Card key={sale.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Sale header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{t("restaurantSales.orderNumber")} #{sale.orderId}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(sale.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">
                          ${Number(sale.totalAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Sale details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("restaurantSales.mobileLabels.customer")}:</span>
                        <span>{sale.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("restaurantSales.mobileLabels.items")}:</span>
                        <span>{sale.itemCount} {sale.itemCount !== 1 ? t("restaurantSales.itemsPlural") : t("restaurantSales.itemSingular")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {t("restaurantSales.pagination.showing")}{" "}
              <span className="font-medium">
                {tableData.sales.length > 0
                  ? (page - 1) * pageSize + 1
                  : 0}
              </span>
              {" "}{t("restaurantSales.pagination.to")}{" "}
              <span className="font-medium">
                {Math.min(page * pageSize, totalOrders)}
              </span>{" "}
              {t("restaurantSales.pagination.of")}{" "}
              <span className="font-medium">{totalOrders}</span>{" "}
              {t("restaurantSales.pagination.results")}
            </div>
            
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="hidden sm:flex"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">{t("restaurantSales.pagination.firstPage")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">{t("restaurantSales.pagination.previousPage")}</span>
              </Button>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {t("restaurantSales.pagination.page")} {page} {t("restaurantSales.pagination.of")} {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">{t("restaurantSales.pagination.nextPage")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className="hidden sm:flex"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">{t("restaurantSales.pagination.lastPage")}</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
