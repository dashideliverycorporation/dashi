import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Users, Clock, ArrowUpRight } from "lucide-react";
import { JSX } from "react/jsx-runtime";

/**
 * Admin Dashboard Page Component
 *
 * Displays an overview dashboard for administrators with key metrics
 *
 * @returns {JSX.Element} The admin dashboard page
 */
export default function AdminDashboardPage(): JSX.Element {

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Restaurants
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,203</div>
            <p className="text-xs text-muted-foreground mt-1">
              +189 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">352</div>
            <p className="text-xs text-muted-foreground mt-1">
              +24 in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Overview of recent orders and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="p-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          New order placed at Restaurant {i}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Order #{1000 + i} - $
                          {Math.floor(Math.random() * 50) + 10}.00
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 50) + 10} min ago
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full flex items-center justify-between rounded-md border px-4 py-3 text-sm font-medium hover:bg-muted">
              <span>Add new restaurant</span>
              <Building2 className="h-4 w-4" />
            </button>

            <button className="w-full flex items-center justify-between rounded-md border px-4 py-3 text-sm font-medium hover:bg-muted">
              <span>Create user account</span>
              <Users className="h-4 w-4" />
            </button>

            <button className="w-full flex items-center justify-between rounded-md border px-4 py-3 text-sm font-medium hover:bg-muted">
              <span>View sales report</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
