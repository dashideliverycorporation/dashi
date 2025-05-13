"use client";
import { ReactNode, useState} from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { useSession } from "next-auth/react";

// Mock admin user for development
const placeholderAdminUser = {
  name: "Admin User",
  email: "admin@dashi.com",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session} = useSession();

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
        {/* Header with user info from session */}
        <Header
          username={session?.user?.name || placeholderAdminUser.name}
          email={session?.user?.email || placeholderAdminUser.email}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
