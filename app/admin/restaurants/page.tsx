"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { JSX } from "react/jsx-runtime";
import { trpc } from "@/lib/trpc/client";
import RestaurantTable from "./components/restaurant-table";
import { Suspense } from "react";

/**
 * Restaurant Management Page
 *
 * Displays a list of restaurants with options to add, edit, and manage
 *
 * @returns {JSX.Element} The restaurant management page
 */
export default function RestaurantsPage(): JSX.Element {
  // Check if there are restaurants
  const { data: restaurantsCheck, isLoading } =
    trpc.restaurant.getRestaurantsWithUsers.useQuery(
      {
        page: 1,
        limit: 1,
      },
      {
        // Disable automatic refetching to avoid extra API calls
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );

  const hasRestaurants =
    !isLoading &&
    restaurantsCheck?.pagination.total &&
    restaurantsCheck.pagination.total > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-muted-foreground mt-2">
            Manage restaurant listings on the Dashi platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/restaurants/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground">Loading restaurants...</p>
            </div>
          </CardContent>
        </Card>
      ) : hasRestaurants ? (
        <Suspense
          fallback={
            <div className="py-8 text-center">Loading restaurant table...</div>
          }
        >
          <RestaurantTable />
        </Suspense>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Management</CardTitle>
            <CardDescription>
              Add and manage restaurants on the Dashi platform. Create
              restaurant accounts to give owners access to their dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No restaurants added yet. Click the &quot;Add Restaurant&quot;
              button to add your first restaurant.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
