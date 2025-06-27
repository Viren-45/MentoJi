// app/browse-experts/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/home/navigation/navbar';

export const metadata: Metadata = {
  title: 'Browse Experts - Mentoji',
  description: 'Browse and connect with expert professionals to get personalized guidance and support.',
};

const BrowseExpertsLayout = ({ children }: Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="min-h-screen">
      {/* Browse Experts Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default BrowseExpertsLayout;
