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
      header: "Order ID",
      cell: (info) => <span className="font-medium">#{info.getValue()}</span>,
      enableSorting: true,
    },
    {
      id: "orderDate",
      accessorKey: "orderDate",
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      enableSorting: true,
    },
    {
      id: "customerName",
      accessorKey: "customerName",
      header: "Customer",
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      id: "itemCount",
      accessorKey: "itemCount",
      header: "Items",
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: "Amount",
      cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
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
        <h3 className="text-xl font-medium">Unable to load sales data</h3>
        <p className="mt-2 text-muted-foreground mx-auto max-w-md text-center">
          Your restaurant information is not available. Please try refreshing or contact support.
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
        <h2 className="text-xl font-semibold">Restaurant Sales</h2>
        
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
                placeholder="Search by Order ID..."
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
                onClick={clearFilter}
                className="ml-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
  
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Period:</span>
            </div>
            <Select
              value={filters.period || "ALL"}
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Time</SelectItem>
                <SelectItem value="TODAY">Today</SelectItem>
                <SelectItem value="THIS_WEEK">This Week</SelectItem>
                <SelectItem value="THIS_MONTH">This Month</SelectItem>
                <SelectItem value="LAST_30_DAYS">Last 30 Days</SelectItem>
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
              <p className="text-blue-600 font-medium">Total Sales</p>
              <p className="text-2xl font-bold">
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
              <p className="text-yellow-600 font-medium">Total Orders</p>
              <p className="text-2xl font-bold">{orderCount}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <ShoppingBag className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 font-medium">Average Order</p>
              <p className="text-2xl font-bold">
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
              <p className="text-purple-600 font-medium">Commission (10%)</p>
              <p className="text-2xl font-bold">
                ${commission.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>



      {/* Sales table */}
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
            {isLoading ? (
              // Loading state
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-5 w-24 animate-pulse bg-muted-foreground/5 rounded"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))                ) : tableData.sales.length === 0 ? (
                  // No data state
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No sales data found
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data rows
                  tableData.sales.map((sale) => (
                <TableRow key={sale.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell ? column.cell({ getValue: () => sale[column.accessorKey as keyof typeof sale] }) : sale[column.accessorKey as keyof typeof sale]?.toString()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* No results message (when sales.length is 0) */}
      {!isLoading && tableData.sales.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No sales data found</h3>
          <p className="mt-2 text-muted-foreground mx-auto max-w-md text-center">
            {isFiltering
              ? "No sales data matches your current filters"
              : "No sales data has been recorded yet"}
          </p>
          {isFiltering && (
            <Button
              className="mt-6"
              variant="outline"
              size="sm"
              onClick={clearFilter}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">
            {tableData.sales.length > 0
              ? (page - 1) * pageSize + 1
              : 0}
          </span>
          {" to "}
          <span className="font-medium">
            {Math.min(page * pageSize, totalOrders)}
          </span>{" "}
          of{" "}
          <span className="font-medium">{totalOrders}</span>{" "}
          results
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="flex items-center">
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            className="hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
