"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Users,
  PieChart,
  X,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/public/logo.svg";

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Building2,
    label: "Restaurants",
    href: "/admin/restaurants",
  },
  {
    icon: ShoppingBag,
    label: "Orders",
    href: "/admin/orders",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: PieChart,
    label: "Sales",
    href: "/admin/sales",
  },
];

type SidebarProps = {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export function Sidebar({
  collapsed: externalCollapsed,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Use either the external controlled state or internal state
  const collapsed =
    externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  // Handle sidebar collapse toggle
  const handleToggleCollapse = () => {
    if (onCollapsedChange) {
      onCollapsedChange(!collapsed);
    } else {
      setInternalCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}{" "}
      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed z-50 flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "left-0" : "-left-full md:left-0"
        )}
      >
        {/* Collapse/Expand Button - Positioned on the right edge */}
        <div className="absolute -right-4 top-20 hidden md:block">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleCollapse}
            className="h-6 w-6 rounded-full border border-neutral-mediumGray bg-white shadow-md cursor-pointer hover:bg-neutral-lightGray"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4">
          {collapsed ? (
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo-icon.svg" width={100} height={100} alt="logo" />
            </Link>
          ) : (
            <Link href="/admin" className="flex items-center gap-2">
              <Image src={logo} width={100} height={100} alt="logo" />
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-4">
          {!collapsed && (
            <div className="text-xs text-muted-foreground">
              Dashi Admin v1.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
