// components/expert/dashboard/connected-calendars/calendar-connections-list.tsx
"use client";

import React from "react";
import CalendarConnectionCard from "./calendar-connection-card";
import { useCalendarConnections } from "@/hooks/expert/calendar-connections/use-calendar-connections";

const CALENDAR_PROVIDERS = [
  {
    id: "google",
    name: "Google Calendar",
    description: "Gmail, G Suite",
    enabled: true,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    name: "Apple Calendar",
    description: "iCloud calendar",
    enabled: true,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24">
        <path
          fill="#000000"
          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        />
      </svg>
    ),
  },
  {
    id: "microsoft",
    name: "Microsoft Outlook",
    description: "Office 365, Outlook.com, live.com, or hotmail calendar",
    enabled: false,
    comingSoon: true,
    icon: (
      <svg className="w-8 h-8 opacity-50" viewBox="0 0 24 24">
        <path
          fill="#0078D4"
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568H6.432V6.432h11.136v11.136z"
        />
        <path
          fill="#FFFFFF"
          d="M8.5 15.5h7v-1h-7v1zm0-2h7v-1h-7v1zm0-2h7v-1h-7v1zm0-2h7v-1h-7v1z"
        />
      </svg>
    ),
  },
];

const CalendarConnectionsList = () => {
  const {
    connections,
    isLoading,
    isConnecting,
    handleConnect,
    handleDisconnect,
  } = useCalendarConnections();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {CALENDAR_PROVIDERS.map((provider) => {
        const connection = connections.find(c => c.provider === provider.id);
        
        return (
          <CalendarConnectionCard
            key={provider.id}
            provider={provider}
            connection={connection}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isLoading={isConnecting}
          />
        );
      })}
    </div>
  );
};

export default CalendarConnectionsList;