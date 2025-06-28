/**
 * Sales Table Component for Admin Dashboard
 *
 * Displays a paginated, sortable table of restaurant sales data
 * Includes filtering capability for restaurant name and date range
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Store,
  Calendar,
  DollarSign,
  BarChart,
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

interface SalesFilterState {
  restaurantName?: string;
  period?: string;
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
 * SalesTable component for the admin dashboard
 * Displays restaurant sales data with pagination, sorting and filtering
 */
export default function SalesTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSortField = "totalSales",
  initialSortOrder = "desc",
  initialFilter = "",
}: SalesTableProps) {
  // Router for URL manipulation
  const router = useRouter();
  const pathname = usePathname();

  // State management for pagination, sorting and filtering
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize] = useState<number>(initialPageSize);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [filters, setFilters] = useState<SalesFilterState>({
    restaurantName: initialFilter,
    period: "ALL",
  });
  const [filterInputValue, setFilterInputValue] = useState(initialFilter);
  const [isFiltering, setIsFiltering] = useState(!!initialFilter);
  
  // Fetch sales data with tRPC
  const { data, isLoading } = trpc.sales.getSales.useQuery(
    {
      page,
      limit: pageSize,
      sortField,
      sortOrder,
      filters: {
        restaurantName: filters.restaurantName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        period: filters.period as any,
      },
    },
    {
      // Disable automatic refetching to avoid extra API calls
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  
  // Fetch summary statistics
  const { data: summaryData } = trpc.sales.getSalesSummary.useQuery(
    {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      period: filters.period as any,
    },
    {
      // Disable automatic refetching to avoid extra API calls
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  // Define table columns
  const columns: SalesTableColumn[] = [
    {
      id: "restaurantName",
      accessorKey: "restaurantName",
      header: "Restaurant",
      enableSorting: true,
    },
    {
      id: "totalSales",
      accessorKey: "totalSales",
      header: "Total Sales",
      cell: (info) => {
        const value = info.getValue();
        if (!value) return "—";
        
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        return !isNaN(numValue) ? `$${numValue.toFixed(2)}` : "—";
      },
      enableSorting: true,
    },
    {
      id: "orderCount",
      accessorKey: "orderCount",
      header: "Orders",
      cell: (info) => {
        return info.getValue() || "—";
      },
      enableSorting: true,
    },
    {
      id: "commission",
      accessorKey: "commission",
      header: "Commission (10%)",
      cell: (info) => {
        const value = info.getValue();
        if (!value) return "—";
        
        const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
        return !isNaN(numValue) ? `$${numValue.toFixed(2)}` : "—";
      },
      enableSorting: true,
    },
    {
      id: "period",
      accessorKey: "period",
      header: "Period",
      enableSorting: false,
    },
    {
      id: "actions",
      accessorKey: "restaurantId",
      header: "Actions",
      cell: () => {
        return (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
            >
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
            >
              Export
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  // Calculate pagination values from API response
  const totalSales = data?.pagination.total || 0;
  const totalPages = data?.pagination.totalPages || 1;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalSales);

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
    setFilters({ ...filters, restaurantName: filterInputValue });
    setIsFiltering(!!filterInputValue || !!filters.period);
    setPage(1); // Reset to first page when filter changes
  };

  // Handle period filter change
  const handlePeriodChange = (value: string) => {
    setFilters({ ...filters, period: value });
    setIsFiltering(!!filterInputValue || !!value);
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterInputValue("");
    setFilters({ restaurantName: "", period: "ALL" });
    setIsFiltering(false);
    setPage(1);
  };

  // Update URL search params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (pageSize !== 10) params.set("size", pageSize.toString());
    if (sortField !== "totalSales") params.set("sort", sortField);
    if (sortOrder !== "desc") params.set("order", sortOrder);
    if (filters.restaurantName) params.set("filter", filters.restaurantName);
    if (filters.period && filters.period !== "ALL") params.set("period", filters.period);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [page, pageSize, sortField, sortOrder, filters, pathname, router]);

  // Handle pagination
  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Loading state is handled by tRPC's useQuery hook

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <div className="p-1">
          {/* Table header skeleton */}
          <div className="flex items-center p-4 bg-muted-foreground/5">
            {/* Column skeletons */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-1">
                <Skeleton className="h-5 w-32 bg-muted-foreground/5" />
              </div>
            ))}
          </div>

          {/* Table rows skeleton */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center p-4 border-t">
              {/* Cell skeletons */}
              {[1, 2, 3, 4, 5, 6].map((cell) => (
                <div
                  key={`${row}-${cell}`}
                  className="flex-1"
                >
                  <Skeleton
                    className={`h-5 bg-muted-foreground/5 ${
                      cell === 1 ? "w-40" : 
                      cell === 2 ? "w-32" : 
                      cell === 3 ? "w-20" : 
                      cell === 4 ? "w-32" :
                      cell === 5 ? "w-28" :
                      "w-40"
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
        <h2 className="text-xl font-semibold">Sales Reports</h2>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Time period filter */}
          <Select
            value={filters.period || "ALL"}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Time</SelectItem>
              <SelectItem value="DAILY">Today</SelectItem>
              <SelectItem value="WEEKLY">This Week</SelectItem>
              <SelectItem value="MONTHLY">This Month</SelectItem>
              <SelectItem value="YEARLY">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Restaurant name filter */}
          <form
            onSubmit={handleFilterSubmit}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Search by Restaurant..."
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
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Sales summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 font-medium">Total Sales</p>
              <p className="text-2xl font-bold">
                ${summaryData?.totalSales ? Number(summaryData.totalSales).toFixed(2) : "0.00"}
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
              <p className="text-2xl font-bold">{summaryData?.totalOrders || 0}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <BarChart className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 font-medium">Commission</p>
              <p className="text-2xl font-bold">
                ${summaryData?.commission ? Number(summaryData.commission).toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-600 font-medium">Restaurants</p>
              <p className="text-2xl font-bold">{summaryData?.restaurantCount || 0}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Store className="h-5 w-5 text-purple-600" />
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
                  onClick={() => column.enableSorting && handleSort(column.id)}
                  style={{ cursor: column.enableSorting ? 'pointer' : 'default' }}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.enableSorting && sortField === column.id && (
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
            {data?.sales && Array.isArray(data.sales) && data.sales.length > 0 ? (
              data.sales.map((sale) => (
                <TableRow key={sale.id || `sale-${Math.random()}`}>
                  {columns.map((column) => (
                    <TableCell key={`${sale.id || Math.random()}-${column.id}`}>
                      {column.cell 
                        ? column.cell({ getValue: () => sale[column.accessorKey as keyof typeof sale], row: { original: sale } })
                        : sale[column.accessorKey as keyof typeof sale] || '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No sales data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* No results message (when sales.length is 0) */}
      {data?.sales && data.sales.length === 0 && (
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
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {start}–{end} of {totalSales} records
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
          <div className="flex items-center">
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
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
    </div>
  );
}
