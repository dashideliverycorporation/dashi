/**
 * Restaurant Menu Page
 *
 * Displays a list of menu items for the logged-in restaurant
 * This is a protected route that only restaurant users can access
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
import { MenuItemFormModal } from "./components/menu-item-form-modal";

/**
 * Restaurant Menu Page Component
 *
 * Displays all menu items for the logged-in restaurant
 *
 * @returns {JSX.Element} The restaurant menu page
 */
export default async function RestaurantMenuPage() {
  const session = await getServerSession(authOptions);

  // Ensure user is logged in and has the RESTAURANT role
  if (!session || session.user.role !== "RESTAURANT") {
    redirect("/denied-restaurant");
  }

  // Get the restaurant name for display
  const restaurantName = session?.user?.name || "Restaurant";

  return (
    <div className="space-y-6 bg-background p-6 md:p-8 rounded-md">
      {" "}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {restaurantName} Menu
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your restaurant&apos;s menu items
          </p>
        </div>{" "}
        <MenuItemFormModal />
      </div>
      {/* Menu Items List Section */}{" "}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>
              View and manage your restaurant&apos;s menu items
            </CardDescription>
          </div>
        
        </CardHeader>
        <CardContent>
          {/* This is a placeholder. The actual menu item list component will be 
              implemented in a later task */}
          <p>Menu items list will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}
