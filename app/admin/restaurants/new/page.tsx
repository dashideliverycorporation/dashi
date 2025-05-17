import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";
import { RestaurantForm } from "../components/restaurant-form";

/**
 * Add New Restaurant Page
 *
 * Page for administrators to add a new restaurant
 *
 * @returns {JSX.Element} The add restaurant page
 */
export default function AddRestaurantPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/admin/restaurants" aria-label="Go back to restaurants">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Restaurant</h1>
          <p className="text-muted-foreground mt-2">
            Create a new restaurant profile on the Dashi platform
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>
            Enter the details for the new restaurant. Required fields are marked
            with a red asterisk (<span className="text-red-500">*</span>).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RestaurantForm />
        </CardContent>
      </Card>
    </div>
  );
}
