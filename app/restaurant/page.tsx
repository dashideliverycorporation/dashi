import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Utensils, ShoppingBag, Clock, Users } from "lucide-react";
import { JSX } from "react/jsx-runtime";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

/**
 * Restaurant Dashboard Page Component
 *
 * Displays an overview dashboard for restaurant owners with key metrics
 *
 * @returns {JSX.Element} The restaurant dashboard page
 */
export default async function RestaurantDashboardPage(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  const restaurantName = session?.user?.name || "Your Restaurant";

  // In a real implementation, these would be fetched from the database
  const placeholderStats = {
    menuItems: 15,
    activeOrders: 5,
    todaysOrders: 12,
    customers: 48,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{restaurantName}</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your restaurant dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {placeholderStats.menuItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your menu items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {placeholderStats.activeOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Orders being prepared
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {placeholderStats.todaysOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {placeholderStats.customers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique customers this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Menu Management</CardTitle>
            <CardDescription>
              Add, edit, or remove items from your restaurant menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will show your menu items once you add them. Use the
              menu navigation to add new items.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
