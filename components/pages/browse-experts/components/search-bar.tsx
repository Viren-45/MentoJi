// components/pages/browse-experts/components/search-bar.tsx
"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search experts by skill, industry, or challenge...",
  defaultValue = ""
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Optional: Trigger search on every keystroke (debounced in real implementation)
    // if (onSearch) {
    //   onSearch(value.trim());
    // }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative pl-2 bg-background flex items-center border-2 border-gray-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">

          {/* Search Icon */}
          <Search className="w-5 h-5 text-gray-400" />

          {/* Input */}
          <Input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="bg-transparent flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-3 text-base"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          <Button
            type="submit"
            size="sm"
            className="rounded-r-md px-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;