// components/pages/browse-experts/components/expert-cards-grid.tsx
import React from 'react';
import ExpertCard from './expert-card';
import { BrowseExpert } from './browse-experts-layout';
import { Users, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpertCardsGridProps {
  experts: BrowseExpert[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const ExpertCardsGrid: React.FC<ExpertCardsGridProps> = ({ 
  experts, 
  loading = false, 
  error = null,
  onRetry 
}) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="w-full h-96 bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-[180px] h-[250px] bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
              <div className="h-3 bg-gray-200 rounded w-12 ml-2"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load experts</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {error || 'Something went wrong while loading experts. Please try again.'}
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No experts found</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn't find any experts matching your criteria. Try adjusting your search terms or filters.
      </p>
      <Button 
        variant="outline"
        onClick={() => window.location.reload()}
        className="border-gray-300 hover:border-gray-400"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Page
      </Button>
    </div>
  );

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-8">
      {error ? (
        // Error state
        <div className="grid grid-cols-1">
          <ErrorState />
        </div>
      ) : loading ? (
        // Loading state - 2 cards per row
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      ) : experts.length === 0 ? (
        // Empty state
        <div className="grid grid-cols-1">
          <EmptyState />
        </div>
      ) : (
        // Expert cards grid - 2 cards per row with increased width
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertCardsGrid;