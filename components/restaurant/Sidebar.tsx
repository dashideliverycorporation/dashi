"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Utensils,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  Settings,
  DollarSign,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useTranslation } from "@/hooks/useTranslation";

type NavItem = {
  icon: React.ElementType;
  labelKey: string;
  href: string;
};

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
  const { t, i18n } = useTranslation();

  // Ensure translations are ready to avoid hydration mismatch
  const isTranslationReady = i18n.isInitialized && i18n.hasLoadedNamespace('common');

  const navItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      labelKey: "restaurantSidebar.dashboard",
      href: "/restaurant",
    },
    {
      icon: Utensils,
      labelKey: "restaurantSidebar.menu",
      href: "/restaurant/menu",
    },
    {
      icon: ShoppingBag,
      labelKey: "restaurantSidebar.orders",
      href: "/restaurant/orders",
    },
    {
      icon: DollarSign,
      labelKey: "restaurantSidebar.sales",
      href: "/restaurant/sales",
    },
    {
      icon: Settings,
      labelKey: "restaurantSidebar.settings",
      href: "/restaurant/settings",
    },
  ];

  // Helper function to get translated text with fallback
  const getTranslation = (key: string, fallback: string): string => {
    if (!isTranslationReady) {
      return fallback;
    }
    const translated = t(key);
    // If translation returns the key itself, use fallback
    return translated === key ? fallback : translated;
  };

  // Fallback labels for navigation items
  const navItemFallbacks: Record<string, string> = {
    "restaurantSidebar.dashboard": "Dashboard",
    "restaurantSidebar.menu": "Menu",
    "restaurantSidebar.orders": "Orders",
    "restaurantSidebar.sales": "Sales",
    "restaurantSidebar.settings": "Settings",
  };

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
          aria-label={mobileOpen ? getTranslation('restaurantSidebar.closeMenu', 'Close menu') : getTranslation('restaurantSidebar.openMenu', 'Open menu')}
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
      )}
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
            className="h-6 w-6 rounded-full border border-neutral-mediumGray bg-white shadow-md cursor-pointer hover:bg-neutral-lightGray "
            aria-label={collapsed ? getTranslation('restaurantSidebar.expandSidebar', 'Expand sidebar') : getTranslation('restaurantSidebar.collapseSidebar', 'Collapse sidebar')}
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
                    {!collapsed && <span>{getTranslation(item.labelKey, navItemFallbacks[item.labelKey] || item.labelKey)}</span>}
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
              {getTranslation('restaurantSidebar.version', 'Dashi Restaurant v1.0')}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
