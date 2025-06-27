// components/expert/dashboard/layout/dashboard-sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Calendar, Link as LinkIcon, Settings } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  {
    name: "Home",
    href: "/expert/dashboard/home",
    icon: Home,
  },
  {
    name: "Availability",
    href: "/expert/dashboard/availability",
    icon: Calendar,
  },
  {
    name: "Connected Calendars",
    href: "/expert/dashboard/connected-calendars",
    icon: LinkIcon,
  },
  {
    name: "Session Settings",
    href: "/expert/dashboard/session-settings",
    icon: Settings,
  }
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/expert/dashboard/home") {
      return pathname === href || pathname === "/expert/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        {/* Navigation Title */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Dashboard
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your expert profile
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-150",
                  active
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150",
                    active 
                      ? "text-blue-600" 
                      : "text-gray-500 group-hover:text-gray-700"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <span className="block">{item.name}</span>
                </div>
                
                {/* Active indicator */}
                {active && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;