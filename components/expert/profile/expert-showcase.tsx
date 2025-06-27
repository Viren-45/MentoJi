// components/expert/profile/expert-showcase.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Play, FileText, Globe } from 'lucide-react';

interface ExpertShowcaseProps {
  firstName: string;
  personalWebsite?: string | null;
  introVideoLink?: string | null;
  featuredArticleLink?: string | null;
}

const ExpertShowcase: React.FC<ExpertShowcaseProps> = ({
  firstName,
  personalWebsite,
  introVideoLink,
  featuredArticleLink,
}) => {
  // Filter out null/empty links
  const showcaseItems = [
    {
      id: 'website',
      title: `${firstName}'s Portfolio`,
      description: `Explore ${firstName}'s personal website and professional portfolio showcasing their expertise and projects.`,
      link: personalWebsite,
      icon: Globe,
      type: 'WEBSITE',
      color: 'blue',
    },
    {
      id: 'video',
      title: `Meet ${firstName}`,
      description: `Watch ${firstName}'s introduction video to get to know their background, expertise, and mentoring approach.`,
      link: introVideoLink,
      icon: Play,
      type: 'VIDEO',
      color: 'red',
    },
    {
      id: 'article',
      title: `${firstName}'s Featured Article`,
      description: `Read ${firstName}'s featured article showcasing their thought leadership and expertise in their field.`,
      link: featuredArticleLink,
      icon: FileText,
      type: 'ARTICLE',
      color: 'green',
    },
  ].filter(item => item.link && item.link.trim() !== '');

  if (showcaseItems.length === 0) {
    return null; // Don't render the section if no content is available
  }

  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600',
          border: 'border-blue-200',
          hover: 'hover:border-blue-300'
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          text: 'text-red-600',
          border: 'border-red-200',
          hover: 'hover:border-red-300'
        };
      case 'green':
        return {
          bg: 'bg-green-500',
          text: 'text-green-600',
          border: 'border-green-200',
          hover: 'hover:border-green-300'
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-600',
          border: 'border-gray-200',
          hover: 'hover:border-gray-300'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Get to know {firstName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcaseItems.map((item) => {
          const IconComponent = item.icon;
          const colors = getColorClasses(item.color);
          
          return (
            <Link
              key={item.id}
              href={item.link!}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className={`bg-white border-2 ${colors.border} ${colors.hover} rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5`}>
                {/* Simple header with icon and type */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`${colors.bg} rounded-lg p-2.5`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${colors.text} uppercase tracking-wider`}>
                        {item.type}
                      </span>
                      <ExternalLink className={`w-3 h-3 ${colors.text}`} />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
                
                {/* Footer with link */}
                <div className="px-6 pb-6 pt-2">
                  <div className={`flex items-center gap-2 ${colors.text} text-sm font-semibold`}>
                    <span className="truncate">{getDisplayUrl(item.link!)}</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ExpertShowcase;