// components/pages/client/dashboard/navbar/navbar.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import NavigationLinks from './navigation-links';
import UserAvatarDropdown from './user-avatar-dropdown';

const DashboardNavbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/client/dashboard/home" className="flex items-center">
            <Image
              src="/Logo/logo-transparent.png"
              alt="MentoJi Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="ml-2 text-xl font-bold">
              <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Mento
              </span>
              <span className="text-blue-900">Ji</span>
            </span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex">
            <NavigationLinks />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Browse Experts Button */}
            <Link href="/browse-experts">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Experts
              </Button>
            </Link>

            {/* User Avatar */}
            <UserAvatarDropdown />
          </div>
        </div>

        {/* Mobile Navigation - Shows below main navbar on mobile */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 py-3 space-y-1">
            <NavigationLinks />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;