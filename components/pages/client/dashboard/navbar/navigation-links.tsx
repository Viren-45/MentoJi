// components/pages/client/dashboard/navbar/navigation-links.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Video, History, FileText } from 'lucide-react';

const NavigationLinks = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Home',
      href: '/client/dashboard/home',
      icon: Home,
      isActive: pathname === '/client/dashboard/home' || pathname === '/client/dashboard'
    },
    {
      name: 'My Sessions',
      href: '/client/dashboard/sessions',
      icon: Video,
      isActive: pathname === '/client/dashboard/sessions'
    },
    {
      name: 'Session History',
      href: '/client/dashboard/history',
      icon: History,
      isActive: pathname === '/client/dashboard/history'
    },
    {
      name: 'Session Summaries',
      href: '/client/dashboard/summaries',
      icon: FileText,
      isActive: pathname === '/client/dashboard/summaries'
    }
  ];

  return (
    <nav className="flex items-center space-x-8">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              item.isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationLinks;