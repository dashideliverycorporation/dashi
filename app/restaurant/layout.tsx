"use client";
import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/restaurant/Sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/restaurant/Header";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RestaurantLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session, status } = useSession();

  // If the user is not logged in or not a restaurant, redirect to denied page
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "RESTAURANT") {
    redirect("/denied");
  }

  // Extract restaurant name from session
  const restaurantName = session?.user?.name || "Restaurant Dashboard";

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation with collapse state management */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content Area with dynamic margin based on sidebar state */}
      <div
        className={`flex flex-1 flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"
        }`}
      >
        {/* Header with restaurant info from session */}
        <Header
          restaurantName={restaurantName}
          username={session?.user?.name || ""}
          email={session?.user?.email || ""}
        />
        {/* Page Content with theme-aware background */}
        <ScrollArea className="flex-1 overflow-hidden p-6 md:p-8 rounded-md">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
