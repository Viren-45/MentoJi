// components/auth/forms/form-components/auth-tabs.tsx
"use client";

import React from "react";

interface AuthTabsProps {
  activeTab: "client" | "expert";
  onTabChange: (tab: "client" | "expert") => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => onTabChange("client")}
        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 relative cursor-pointer ${
          activeTab === "client"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        I&apos;m a Client
      </button>
      <button
        onClick={() => onTabChange("expert")}
        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 relative cursor-pointer ${
          activeTab === "expert"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        I&apos;m an Expert
      </button>
    </div>
  );
};

export default AuthTabs;
