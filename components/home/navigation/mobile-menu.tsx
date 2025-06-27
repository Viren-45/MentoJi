// components/home/navigation/mobile-menu.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [isExpertsOpen, setIsExpertsOpen] = useState(false);

  const menuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const expertMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-40 md:hidden overflow-hidden"
        >
          <div className="py-4">
            {/* Browse Experts */}
            <div>
              <button
                onClick={() => setIsExpertsOpen(!isExpertsOpen)}
                className="flex items-center justify-between w-full px-6 py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold">Browse Experts</span>
                <motion.div
                  animate={{ rotate: isExpertsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpertsOpen && (
                  <motion.div
                    variants={expertMenuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="overflow-hidden bg-gray-50"
                  >
                    <div className="py-2">
                      <Link
                        href="/browse/business"
                        className="block px-8 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={onClose}
                      >
                        Business Strategy
                      </Link>
                      <Link
                        href="/browse/marketing"
                        className="block px-8 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={onClose}
                      >
                        Marketing & Sales
                      </Link>
                      <Link
                        href="/browse/tech"
                        className="block px-8 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={onClose}
                      >
                        Tech & Product
                      </Link>
                      <Link
                        href="/browse/legal"
                        className="block px-8 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={onClose}
                      >
                        Legal & Compliance
                      </Link>
                      <Link
                        href="/browse/finance"
                        className="block px-8 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={onClose}
                      >
                        Finance & Accounting
                      </Link>
                      <div className="border-t border-gray-200 mx-6 my-2"></div>
                      <Link
                        href="/browse/all"
                        className="block px-8 py-3 font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={onClose}
                      >
                        View All Experts
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Menu Items */}
            <Link
              href="/how-it-works"
              className="block px-6 py-4 text-gray-800 text-lg font-semibold hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={onClose}
            >
              How it Works
            </Link>

            <Link
              href="/pricing"
              className="block px-6 py-4 text-gray-800 text-lg font-semibold hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={onClose}
            >
              Pricing
            </Link>

            <Link
              href="/blog"
              className="block px-6 py-4 text-gray-800 text-lg font-semibold hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={onClose}
            >
              Blog
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
