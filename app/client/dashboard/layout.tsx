// app/client/dashboard/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import DashboardNavbar from '@/components/pages/client/dashboard/navbar/navbar';

export const metadata: Metadata = {
  title: 'Dashboard - Mentoji',
  description: 'Your personal dashboard to manage sessions, view summaries, and connect with expert professionals.',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <DashboardNavbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;