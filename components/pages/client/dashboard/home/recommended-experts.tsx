// components/pages/client/dashboard/home/recommended-experts.tsx
"use client";
import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExpertCard from './expert-card';
import { mockExperts } from './mock-data';

const RecommendedExperts = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const cardsPerPage = 2;
  const totalPages = Math.ceil(mockExperts.length / cardsPerPage);

  // Check scroll position to update current page
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      
      // Calculate current page based on scroll position
      const newPage = Math.round(scrollLeft / clientWidth);
      setCurrentPage(newPage);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoScrolling && scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        // If we've reached the end, scroll back to start
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Scroll to next set of cards (full container width)
          scrollContainerRef.current.scrollBy({
            left: clientWidth,
            behavior: 'smooth'
          });
        }
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Manual scroll functions with infinite scroll
  const scrollLeft = () => {
    setIsAutoScrolling(false);
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // If at the beginning, go to the end
      if (scrollLeft <= 0) {
        scrollContainerRef.current.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: 'smooth'
        });
      } else {
        // Normal scroll left
        scrollContainerRef.current.scrollBy({
          left: -clientWidth,
          behavior: 'smooth'
        });
      }
    }
    // Resume auto-scroll after 10 seconds
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const scrollRight = () => {
    setIsAutoScrolling(false);
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // If at the end, go to the beginning
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        scrollContainerRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Normal scroll right
        scrollContainerRef.current.scrollBy({
          left: clientWidth,
          behavior: 'smooth'
        });
      }
    }
    // Resume auto-scroll after 10 seconds
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Recommended for you
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Based on trending topics and popular expertise areas, here are some experts who can help you right now.
          </p>
        </div>

        {/* Experts Grid with Navigation */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:shadow-xl hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:shadow-xl hover:scale-105"
          >
            <ChevronRight className="w-6 h-6 cursor-pointer" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex space-x-6">
              {mockExperts.map((expert) => (
                <div key={expert.id} className="flex-shrink-0" style={{ width: 'calc(50% - 20px)' }}>
                  <ExpertCard expert={expert} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex items-center justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentPage ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default RecommendedExperts;