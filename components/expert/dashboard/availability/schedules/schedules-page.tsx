// components/expert/dashboard/availability/schedules/schedules-page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, List, Calendar, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import WeeklySchedule from "./list-view/weekly-schedule";
import CalendarView from "./calendar-view/calendar-view";

const SchedulesPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [activeEventType, setActiveEventType] = useState("1 event type");

  return (
    <div className="p-6 space-y-6">
      {/* Schedule Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium text-blue-600">Weekly Schedule</h2>
          </div>
        </div>

        {/* View Controls - Only show on large devices */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* List/Calendar Toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1 text-sm cursor-pointer",
                viewMode === "list" 
                  ? "bg-blue-600 shadow-sm text-white" 
                  : "bg-transparent hover:bg-gray-200"
              )}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-3 py-1 text-sm cursor-pointer",
                viewMode === "calendar" 
                  ? "bg-blue-600 shadow-sm text-white" 
                  : "bg-transparent hover:bg-gray-200"
              )}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Calendar
            </Button>
          </div>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit schedule</DropdownMenuItem>
              <DropdownMenuItem>Duplicate schedule</DropdownMenuItem>
              <DropdownMenuItem>Delete schedule</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile - Only More Options */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit schedule</DropdownMenuItem>
              <DropdownMenuItem>Duplicate schedule</DropdownMenuItem>
              <DropdownMenuItem>Delete schedule</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* View Content */}
      <div>
        {/* Desktop: Show selected view */}
        <div className="hidden lg:block">
          {viewMode === "list" ? <WeeklySchedule /> : <CalendarView />}
        </div>

        {/* Mobile/Tablet: Always show list view */}
        <div className="lg:hidden">
          <WeeklySchedule />
        </div>
      </div>
    </div>
  );
};

export default SchedulesPage;