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

/**
 * Restaurant Management Page
 *
 * Displays a list of restaurants with options to add, edit, and manage
 *
 * @returns {JSX.Element} The restaurant management page
 */
export default function RestaurantsPage(): JSX.Element {
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
          <Link href="/admin/restaurants/new" className='border-2 border-black'>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Management</CardTitle>
          <CardDescription>
            Add and manage restaurants on the Dashi platform. Create restaurant
            accounts to give owners access to their dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No restaurants added yet. Click the "Add Restaurant" button to add
            your first restaurant.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
