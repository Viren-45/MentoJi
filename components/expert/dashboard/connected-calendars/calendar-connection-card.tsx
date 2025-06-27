// components/expert/dashboard/connected-calendars/calendar-connection-card.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ConnectionStatusBadge from "./connection-status-badge";

interface CalendarProvider {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  comingSoon?: boolean;
}

interface CalendarConnection {
  id: string;
  provider: string;
  nylas_email: string;
  connection_status: string;
  last_sync_at: string;
}

interface CalendarConnectionCardProps {
  provider: CalendarProvider;
  connection?: CalendarConnection;
  onConnect: (providerId: string) => void;
  onDisconnect: (connectionId: string) => void;
  isLoading?: boolean;
}

const CalendarConnectionCard = ({
  provider,
  connection,
  onConnect,
  onDisconnect,
  isLoading = false
}: CalendarConnectionCardProps) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Debug logs to see what we're getting
  console.log(`${provider.name} connection:`, connection);
  console.log(`${provider.name} connection_status:`, connection?.connection_status);
  
  const isConnected = !!connection && connection.connection_status === 'active';
  
  console.log(`${provider.name} isConnected:`, isConnected);

  const handleConnect = () => {
    if (provider.enabled && !isLoading) {
      onConnect(provider.id);
    }
  };

  const handleDisconnect = async () => {
    if (!connection) return;
    
    setIsDisconnecting(true);
    try {
      await onDisconnect(connection.id);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getButtonText = () => {
    if (provider.comingSoon) return "Coming Soon";
    if (isConnected) return "Disconnect";
    return "Connect";
  };

  const getButtonVariant = () => {
    if (provider.comingSoon) return "secondary";
    if (isConnected) return "outline";
    return "default";
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      {/* Left side - Provider info */}
      <div className="flex items-center space-x-4">
        {/* Provider icon */}
        <div className="w-12 h-12 flex items-center justify-center">
          {provider.icon}
        </div>
        
        {/* Provider details */}
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900">
              {provider.name}
            </h3>
            <ConnectionStatusBadge 
              isConnected={isConnected}
              comingSoon={provider.comingSoon}
            />
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {provider.description}
          </p>
          
          {/* Show connected email if connected */}
          {isConnected && connection && (
            <p className="text-sm text-blue-600 mt-2 font-medium">
              Connected: {connection.nylas_email}
            </p>
          )}
          
          {/* Show last sync if connected */}
          {isConnected && connection?.last_sync_at && (
            <p className="text-xs text-gray-500 mt-1">
              Last synced: {new Date(connection.last_sync_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Right side - Action button */}
      <div className="flex-shrink-0">
        <Button
          onClick={isConnected ? handleDisconnect : handleConnect}
          variant={getButtonVariant()}
          disabled={!provider.enabled || isLoading || isDisconnecting}
          className={`min-w-[100px] ${
            isConnected 
              ? "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" 
              : provider.comingSoon 
                ? "cursor-not-allowed opacity-60 bg-gray-200 text-gray-500" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isDisconnecting ? "Disconnecting..." : getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default CalendarConnectionCard;