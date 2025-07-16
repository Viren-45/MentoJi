// app/browse-experts/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/home/navigation/navbar';

const MainLayoout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
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

export default MainLayoout;
