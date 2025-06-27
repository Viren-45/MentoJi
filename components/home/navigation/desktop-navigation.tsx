// components/home/navigation/desktop-navigation.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DesktopNavigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8">
      {/* Browse Experts Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button className="flex items-center font-semibold text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2">
          Browse Experts
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="ml-1 h-4 w-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
            >
              <Link
                href="/browse/business"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                Business Strategy
              </Link>
              <Link
                href="/browse/marketing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                Marketing & Sales
              </Link>
              <Link
                href="/browse/tech"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                Tech & Product
              </Link>
              <Link
                href="/browse/legal"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                Legal & Compliance
              </Link>
              <Link
                href="/browse/finance"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              >
                Finance & Accounting
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <Link
                href="/browse/all"
                className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-150"
              >
                View All Experts
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link
        href="/how-it-works"
        className="font-semibold text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
      >
        How it Works
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
      </Link>

      <Link
        href="/pricing"
        className="font-semibold text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
      >
        Pricing
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
      </Link>

      <Link
        href="/blog"
        className="font-semibold text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
      >
        Blog
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
      </Link>
    </div>
  );
};

export default DesktopNavigation;
