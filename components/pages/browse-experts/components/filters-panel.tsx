// components/pages/browse-experts/components/filters-panel.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Briefcase, 
  TrendingUp, 
  Code, 
  DollarSign, 
  Palette, 
  Scale,
  Star,
  Clock,
  RotateCcw
} from 'lucide-react';

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FiltersPanel = ({ isOpen, onClose }: FiltersPanelProps) => {
  const categories = [
    { id: 'business', name: 'Business Strategy', icon: Briefcase, count: 45 },
    { id: 'marketing', name: 'Marketing & Sales', icon: TrendingUp, count: 38 },
    { id: 'technology', name: 'Technology', icon: Code, count: 62 },
    { id: 'finance', name: 'Finance', icon: DollarSign, count: 29 },
    { id: 'design', name: 'Design', icon: Palette, count: 24 },
    { id: 'legal', name: 'Legal', icon: Scale, count: 18 },
  ];

  const availability = [
    { id: 'today', label: 'Available Today', count: 45 },
    { id: 'week', label: 'This Week', count: 128 },
    { id: 'month', label: 'This Month', count: 256 },
  ];

  const sessionLengths = [
    { id: '15min', label: '15 minutes', count: 89 },
    { id: '30min', label: '30 minutes', count: 145 },
    { id: '45min', label: '45 minutes', count: 67 },
    { id: '60min', label: '60 minutes', count: 23 },
  ];

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-gray-200 animate-in slide-in-from-top-2 duration-300">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filter Experts</h3>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
              Categories
            </h4>
            <div className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="flex items-center space-x-3">
                    <Checkbox id={category.id} />
                    <Label 
                      htmlFor={category.id} 
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs bg-gray-100">
                        {category.count}
                      </Badge>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
              Price Range
            </h4>
            <div className="space-y-4">
              <div className="px-2">
                <Slider
                  defaultValue={[0, 200]}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>$0</span>
                <span className="font-medium">$10 - $200</span>
                <span>$500+</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Star className="w-4 h-4 mr-2 text-gray-500" />
              Minimum Rating
            </h4>
            <div className="space-y-3">
              {[5, 4.5, 4, 3.5].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <Checkbox id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-2 cursor-pointer">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(rating) 
                              ? 'text-yellow-400 fill-current' 
                              : rating % 1 !== 0 && i === Math.floor(rating)
                              ? 'text-yellow-400 fill-current opacity-50'
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{rating}+</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Availability & Session Length */}
          <div className="space-y-6">
            {/* Availability */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                Availability
              </h4>
              <div className="space-y-3">
                {availability.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Checkbox id={item.id} />
                    <Label htmlFor={item.id} className="flex items-center justify-between cursor-pointer flex-1">
                      <span className="text-sm">{item.label}</span>
                      <Badge variant="secondary" className="text-xs bg-gray-100">
                        {item.count}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Length */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Session Length</h4>
              <div className="space-y-3">
                {sessionLengths.map((session) => (
                  <div key={session.id} className="flex items-center space-x-3">
                    <Checkbox id={session.id} />
                    <Label htmlFor={session.id} className="flex items-center justify-between cursor-pointer flex-1">
                      <span className="text-sm">{session.label}</span>
                      <Badge variant="secondary" className="text-xs bg-gray-100">
                        {session.count}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-medium"
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;