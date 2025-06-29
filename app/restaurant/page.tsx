"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Utensils, ShoppingBag, Clock, Users } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { useTranslation } from "@/hooks/useTranslation";
import { JSX } from "react/jsx-runtime";

/**
 * Restaurant Dashboard Page Component
 *
 * Displays an overview dashboard for restaurant owners with key metrics
 * fetched from the backend API using tRPC
 *
 * @returns {JSX.Element} The restaurant dashboard page
 */
export default function RestaurantDashboardPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  
  // Ensure translations are ready to avoid hydration mismatch
  const isTranslationReady = i18n.isInitialized && i18n.hasLoadedNamespace('common');

  // Helper function to get translated text with fallback
  const getTranslation = (key: string, fallback: string): string => {
    if (!isTranslationReady) {
      return fallback;
    }
    const translated = t(key);
    // If translation returns the key itself, use fallback
    return translated === key ? fallback : translated;
  };
  
  // Fetch dashboard statistics using tRPC
  const { data: dashboardStats, isLoading, error } = trpc.restaurant.getDashboardStats.useQuery();
  
  // We'll get a simplified sales summary directly in the dashboard stats for now
  // In the future, we could create a separate dashboard sales summary endpoint

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Loading cards */}
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Loading cards for bottom section */}
        <div className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={`bottom-${i}`} className="border-none">
                <CardHeader>
                  <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-5 w-12 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                      <div className="h-5 w-14 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              {getTranslation('restaurantDashboard.errorLoading', 'Error loading dashboard:')} {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use placeholder data if no data is available
  const stats = dashboardStats || {
    menuItems: 0,
    activeOrders: 0,
    todaysOrders: 0,
    customers: 0,
    monthlySales: {
      totalSales: 0,
      orderCount: 0,
      averageOrderValue: 0,
    },
  };

  // Calculate commission (10% of total sales)
  const totalSales = stats.monthlySales.totalSales;
  const commissionRate = 0.10; // 10%
  const commissionOwed = totalSales * commissionRate;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{getTranslation('restaurantDashboard.menuItems', 'Menu Items')}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Utensils className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.menuItems}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getTranslation('restaurantDashboard.menuItemsDescription', 'Manage your menu items')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{getTranslation('restaurantDashboard.activeOrders', 'Active Orders')}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getTranslation('restaurantDashboard.activeOrdersDescription', 'Orders being prepared')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {getTranslation('restaurantDashboard.todaysOrders', "Today's Orders")}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todaysOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getTranslation('restaurantDashboard.todaysOrdersDescription', 'Orders placed today')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{getTranslation('restaurantDashboard.customers', 'Customers')}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.customers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getTranslation('restaurantDashboard.customersDescription', 'Customers this month')}
            </p>
          </CardContent>
        </Card>
      </div>{" "}
      <div className="mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-none">
            <CardHeader>
              <CardTitle className="text-lg">{getTranslation('restaurantDashboard.monthlySales', 'Monthly Sales')}</CardTitle>
              <CardDescription>
                {getTranslation('restaurantDashboard.monthlySalesDescription', "Your restaurant's sales performance this month")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{getTranslation('restaurantDashboard.totalSales', 'Total Sales')}</span>
                  <span className="text-xl font-bold">
                    ${totalSales.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{getTranslation('restaurantDashboard.ordersCompleted', 'Orders Completed')}</span>
                  <span className="text-lg font-semibold">
                    {stats.monthlySales.orderCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{getTranslation('restaurantDashboard.averageOrderValue', 'Average Order Value')}</span>
                  <span className="text-lg font-semibold">
                    ${stats.monthlySales.averageOrderValue.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none">
            <CardHeader>
              <CardTitle className="text-lg">{getTranslation('restaurantDashboard.commissionSummary', 'Commission Summary')}</CardTitle>
              <CardDescription>
                {getTranslation('restaurantDashboard.commissionSummaryDescription', 'Platform commission (10% of sales)')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{getTranslation('restaurantDashboard.commissionRate', 'Commission Rate')}</span>
                  <span className="text-lg font-semibold">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{getTranslation('restaurantDashboard.commissionOwed', 'Commission Owed')}</span>
                  <span className="text-xl font-bold text-orange-600">
                    ${commissionOwed.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {getTranslation('restaurantDashboard.commissionNote', 'Commission is calculated automatically and will be collected via the agreed payment method.')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
