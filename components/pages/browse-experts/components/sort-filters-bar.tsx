// components/pages/browse-experts/components/sort-filters-bar.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ListFilter } from 'lucide-react';
import SortDropdown from './sort-dropdown';

interface SortFiltersBarProps {
  sortValue: string;
  onSortChange: (value: string) => void;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  resultsCount?: number;
}

const SortFiltersBar = ({ 
  sortValue, 
  onSortChange, 
  isFiltersOpen, 
  onToggleFilters,
  resultsCount = 0
}: SortFiltersBarProps) => {
  return (
    <div className="bg-white px-6 py-4">
      <div className="max-w-[1700px] px-6 mx-auto">
        <div className="flex items-center justify-between">
          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {resultsCount > 0 ? (
              <span>
                Showing <span className="font-semibold">{resultsCount}</span> expert{resultsCount !== 1 ? 's' : ''}
              </span>
            ) : (
              <span>No experts found</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <SortDropdown 
              value={sortValue}
              onValueChange={onSortChange}
            />

            {/* Filters Button */}
            <Button
              variant="ghost"
              onClick={onToggleFilters}
              className={`flex items-center space-x-2 px-4 py-2 border-2 transition-all duration-200 cursor-pointer ${
                isFiltersOpen 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {isFiltersOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortFiltersBar;