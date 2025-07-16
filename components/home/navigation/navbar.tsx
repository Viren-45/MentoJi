// components/home/navigation/navbar.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DesktopNavigation from "./desktop-navigation";
import MobileMenu from "./mobile-menu";
import { useAuth } from "@/hooks/auth/use-auth";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, userInitials, signOut, isClient, isExpert } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Optionally redirect to home page
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (isClient) return '/client/dashboard/home';
    if (isExpert) return '/expert/dashboard/home';
    return '/dashboard'; // fallback
  };

  // Show loading state
  if (isLoading) {
    return (
      <nav className="bg-white sticky top-0 z-40">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/Logo/logo-transparent.png"
                alt="MentoJi Logo"
                width={48}
                height={48}
                className="h-10 w-10 md:h-12 md:w-12"
              />
              <span className="hidden md:block text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                  Mento
                </span>
                <span className="text-blue-900">Ji</span>
              </span>
            </Link>

            {/* Loading placeholder */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white sticky top-0 z-40">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/Logo/logo-transparent.png"
                  alt="MentoJi Logo"
                  width={48}
                  height={48}
                  className="h-10 w-10 md:h-12 md:w-12"
                />
                {/* Show full logo text on desktop only */}
                <span className="hidden md:block text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Mento
                  </span>
                  <span className="text-blue-900">Ji</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <DesktopNavigation />

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Dashboard Button - Hidden on mobile */}
                  <Link
                    href={getDashboardLink()}
                    className="hidden md:flex items-center space-x-2 font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  {/* User Avatar Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none">
                        <Avatar className="w-8 h-8 md:w-10 md:h-10 cursor-pointer ring-2 ring-transparent hover:ring-blue-200 transition-all">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-sm md:text-base">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Dashboard link for mobile */}
                      <DropdownMenuItem asChild className="md:hidden">
                        <Link href={getDashboardLink()} className="flex items-center space-x-2">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Sign Up */}
                  <Link
                    href="/auth/sign-up"
                    className="font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200 text-sm md:text-base"
                  >
                    Sign Up
                  </Link>

                  {/* Log in Button */}
                  <Button
                    asChild
                    className="rounded-full"
                  >
                    <Link href="/auth/sign-in">Log in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </nav>
    </>
  );
};

export default Navbar;