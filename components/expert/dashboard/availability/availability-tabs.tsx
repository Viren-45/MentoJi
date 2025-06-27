// components/expert/dashboard/availability/schedules/shared/availability-tabs.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  name: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
}

const AvailabilityTabs = () => {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    {
      name: "Schedules",
      href: "/expert/dashboard/availability",
      current: pathname === "/expert/dashboard/availability"
    },
    {
      name: "Holidays (Coming Soon)",
      disabled: true,
      comingSoon: true
    }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          tab.disabled ? (
            <span
              key={tab.name}
              className="py-2 px-1 border-b-2 border-transparent text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              {tab.name}
            </span>
          ) : (
            <Link
              key={tab.name}
              href={tab.href!}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-150",
                tab.current
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.name}
            </Link>
          )
        ))}
      </nav>
    </div>
  );
};

export default AvailabilityTabs;