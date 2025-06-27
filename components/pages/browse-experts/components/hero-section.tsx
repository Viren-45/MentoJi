// components/pages/browse-experts/components/hero-section.tsx
import React from 'react';
import SearchBar from './search-bar';
import AIMatchButton from './ai-match-button';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onAIMatch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onAIMatch }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-500"></div>
        <div className="absolute bottom-32 right-32 w-8 h-8 bg-blue-300 rounded-full opacity-20 animate-pulse delay-1500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find the Perfect{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Expert
            </span>{' '}
            for You
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Get targeted advice from verified professionals in 15-30 minutes. 
            Browse by expertise or let AI find your perfect match.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search experts by skill, industry, or challenge..."
            />
          </div>

          {/* AI Match Button */}
          <div className="flex justify-center">
            <AIMatchButton 
              onClick={onAIMatch}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;