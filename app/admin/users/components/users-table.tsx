/**
 * Users Table Component for Admin Dashboard
 *
 * Displays a paginated, sortable table of users
 * Includes filtering capability for user role and status
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";


// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Users,
} from "lucide-react";

// Hooks
import { useTranslation } from "@/hooks/useTranslation";
import { RestaurantUserFormModal } from "./user-form-modal";

// Type definitions
interface UserTableColumn {
  id: string;
  accessorKey: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell?: (info: any) => React.ReactNode;
  enableSorting?: boolean;
}

interface UserFilterState {
  name?: string;
  role?: string;
}

/**
 * UsersTable Component props
 */
interface UsersTableProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSortField?: string;
  initialSortOrder?: "asc" | "desc";
  initialFilter?: string;
}

/**
 * UsersTable Component
 * 
 * Displays a table of all users with filtering and pagination
 * 
 * @returns {JSX.Element} The users table component
 */
export default function UsersTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSortField = "createdAt",
  initialSortOrder = "desc",
  initialFilter = "",
}: UsersTableProps = {}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  // State management for pagination, sorting and filtering
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize] = useState<number>(initialPageSize);
  const [sortField, setSortField] = useState<string>(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [filters, setFilters] = useState<UserFilterState>({
    name: initialFilter,
    role: "ALL",
  });
  const [filterInputValue, setFilterInputValue] = useState(initialFilter);
  const [isFiltering, setIsFiltering] = useState(!!initialFilter);
  
  // Placeholder for actual data fetching with trpc
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - replace with actual API call
  const mockUsers = [
    { 
      id: "1", 
      name: "Restaurant Manager", 
      email: "manager@example.com", 
      role: "RESTAURANT", 
      createdAt: new Date(),
      restaurantName: "Pizza Palace",
      status: "ACTIVE"
    },
    { 
      id: "2", 
      name: "Admin User", 
      email: "admin@dashi.com", 
      role: "ADMIN", 
      createdAt: new Date(),
      restaurantName: null,
      status: "ACTIVE" 
    },
    { 
      id: "3", 
      name: "Customer John", 
      email: "john@example.com", 
      role: "CUSTOMER", 
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      restaurantName: null,
      status: "ACTIVE"
    },
    { 
      id: "4", 
      name: "Restaurant User", 
      email: "user@burger.com", 
      role: "RESTAURANT", 
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      restaurantName: "Burger Joint",
      status: "ACTIVE"
    },
    { 
      id: "5", 
      name: "Inactive User", 
      email: "inactive@example.com", 
      role: "CUSTOMER", 
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      restaurantName: null,
      status: "INACTIVE"
    }
  ];
  
  // Mock pagination data
  const mockData = {
    users: mockUsers.filter(user => {
      // Apply role filter
      if (filters.role && filters.role !== "ALL") {
        if (user.role !== filters.role) return false;
      }
      
      // Apply name/email filter
      if (filters.name && filters.name.trim() !== "") {
        const searchTerm = filters.name.toLowerCase().trim();
        return (
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    }),
    pagination: {
      total: 5,
      totalPages: 1,
    },
  };
  
  // Mocked data for now - replace with actual trpc query
  /* 
  const { data, isLoading } = trpc.user.getAllUsers.useQuery(
    {
      page,
      limit: pageSize,
      sortField,
      sortOrder,
      filters: {
        name: filters.name,
        role: filters.role,
      },
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  */
  
  // Get role badge based on user role
  const getRoleBadge = (role: string) => {
    switch(role) {
      case "ADMIN":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">{t("user.role.admin", "Admin")}</Badge>;
      case "RESTAURANT":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100 hover:text-orange-800">{t("user.role.restaurant", "Restaurant")}</Badge>;
      case "CUSTOMER":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">{t("user.role.customer", "Customer")}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  // Format date using date-fns
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };

  // Define table columns
  const columns: UserTableColumn[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
      cell: (info) => {
        const role = info.getValue() as string;
        return getRoleBadge(role);
      },
      enableSorting: true,
    },
    {
      id: "restaurant",
      accessorKey: "restaurantName",
      header: "Restaurant",
      cell: (info) => {
        const restaurant = info.getValue() as string | null;
        return restaurant || "—";
      },
      enableSorting: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Joined",
      cell: (info) =>
        formatDate(info.getValue() as Date),
      enableSorting: true,
    },
    {
      id: "actions",
      accessorKey: "id",
      header: "Actions",
      cell: (info) => {
        const userId = info.getValue() as string;
        
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditUser(userId)}
            >
              {t("common.edit", "Edit")}
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];
  
  // Calculate pagination values from the API response
  const totalUsers = mockData?.pagination.total || 0;
  const totalPages = mockData?.pagination.totalPages || 1;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalUsers);

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
    setFilters({ ...filters, name: filterInputValue });
    setIsFiltering(!!filterInputValue || filters.role !== "ALL");
    setPage(1); // Reset to first page when filter changes
  };

  // Handle role filter change
  const handleRoleChange = (value: string) => {
    setFilters({ ...filters, role: value });
    setIsFiltering(!!filterInputValue || value !== "ALL");
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterInputValue("");
    setFilters({ name: "", role: "ALL" });
    setIsFiltering(false);
    setPage(1);
  };
  
  // Handle edit user action
  const handleEditUser = (userId: string) => {
    // In real implementation, this would navigate to edit form or show modal
    console.log(`Editing user with ID: ${userId}`);
  };

  // Update URL search params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== 1) params.set("page", page.toString());
    if (pageSize !== 10) params.set("size", pageSize.toString());
    if (sortField !== "createdAt") params.set("sort", sortField);
    if (sortOrder !== "desc") params.set("order", sortOrder);
    if (filters.name) params.set("filter", filters.name);
    if (filters.role && filters.role !== "ALL") params.set("role", filters.role);

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
                      cell === 1 ? "w-24" : 
                      cell === 2 ? "w-32" : 
                      cell === 3 ? "w-20" : 
                      cell === 4 ? "w-28" : 
                      cell === 5 ? "w-24" :
                      "w-20"
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

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 font-medium">{t("user.role.admin", "Admins")}</p>
              <p className="text-2xl font-bold">{mockData.users.filter(u => u.role === "ADMIN").length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-600 font-medium">{t("user.role.restaurant", "Restaurant Users")}</p>
              <p className="text-2xl font-bold">{mockData.users.filter(u => u.role === "RESTAURANT").length}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-full">
              <UserCog className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 font-medium">{t("user.role.customer", "Customers")}</p>
              <p className="text-2xl font-bold">{mockData.users.filter(u => u.role === "CUSTOMER").length}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <UserCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">{t("admin.users.title", "Users")}</h2>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Role filter */}
          <Select
            value={filters.role || "ALL"}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("admin.users.filterByRole", "Filter by role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("common.allRoles", "All Roles")}</SelectItem>
              <SelectItem value="ADMIN">{t("user.role.admin", "Admin")}</SelectItem>
              <SelectItem value="RESTAURANT">{t("user.role.restaurant", "Restaurant")}</SelectItem>
              <SelectItem value="CUSTOMER">{t("user.role.customer", "Customer")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Name/email filter */}
          <form
            onSubmit={handleFilterSubmit}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="text"
              placeholder={t("admin.users.searchPlaceholder", "Search by name or email...")}
              value={filterInputValue}
              onChange={(e) => setFilterInputValue(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="outline" className="cursor-pointer">
              <Search className="h-4 w-4" />
              <span className="sr-only">{t("common.search", "Search")}</span>
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

        <RestaurantUserFormModal/>
      </div>



      {/* No users message */}
      {mockData.users.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">{t("admin.users.noUsersFound", "No users found")}</h3>
          <p className="mt-2 text-muted-foreground mx-auto max-w-md text-center">
            {isFiltering
              ? t("admin.users.noUsersFilter", "No users match your current filters")
              : t("admin.users.noUsersYet", "No users have been added yet")}
          </p>
          {isFiltering && (
            <Button
              className="mt-6"
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              {t("common.clearFilters", "Clear all filters")}
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Users table */}
          <ScrollArea className="w-full md:max-w-[1150px]">
            <Table>
              <TableHeader className="rounded-b-lg">
                <TableRow className="bg-muted-foreground/5 border-none rounded-b-lg">
                  {columns.map((column) => (
                    <TableHead 
                      key={column.id} 
                      className={`whitespace-nowrap ${column.enableSorting ? 'cursor-pointer hover:text-primary' : ''}`}
                      onClick={() => column.enableSorting && handleSort(column.id)}
                    >
                      <div className="flex items-center">
                        {t(`admin.users.table.${column.id}`, column.header)}
                        {sortField === column.id && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? " ▲" : " ▼"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.restaurantName || "—"}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user.id)}
                      >
                        {t("common.edit", "Edit")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Pagination controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("admin.users.showing", `Showing ${start}–${end} of ${totalUsers} users`)}
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
                <span className="sr-only">{t("pagination.firstPage", "First page")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">{t("pagination.previousPage", "Previous page")}</span>
              </Button>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {t("pagination.pageCount", `Page ${page} of ${totalPages}`)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">{t("pagination.nextPage", "Next page")}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page >= totalPages}
                className="hidden sm:flex"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">{t("pagination.lastPage", "Last page")}</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
