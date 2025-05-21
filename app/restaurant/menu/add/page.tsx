/**
 * Add Menu Item Page
 *
 * This page provides a form for restaurant users to add new menu items.
 * It is a protected route that only restaurant users can access.
 */
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MenuItemForm } from "../components/menu-item-form";

/**
 * Add Menu Item Page Component
 *
 * Provides a form for restaurant users to create new menu items
 *
 * @returns {JSX.Element} The add menu item page
 */
export default async function AddMenuItemPage() {
  const session = await getServerSession(authOptions);

  // Ensure user is logged in and has the RESTAURANT role
  if (!session || session.user.role !== "RESTAURANT") {
    redirect("/denied-restaurant");
  }

  // Get the restaurant name for display
  const restaurantName = session?.user?.name || "Restaurant";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Menu Item
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a new menu item for {restaurantName}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/restaurant/menu">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Link>
        </Button>
      </div>

      {/* Menu Item Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Item Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new menu item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MenuItemForm />
        </CardContent>
      </Card>
    </div>
  );
}
