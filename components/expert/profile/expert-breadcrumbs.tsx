// components/expert/profile/expert-breadcrumbs.tsx
"use client";

import React from 'react';
import { Home } from 'lucide-react';

interface ExpertBreadcrumbsProps {
  firstName: string;
  lastName: string;
}

export const ExpertBreadcrumbs: React.FC<ExpertBreadcrumbsProps> = ({
  firstName,
  lastName,
}) => {
  return (
    <nav className="flex items-center space-x-2 text-white text-xl font-semibold mb-8">
      <Home className="w-5 h-5" />
      <span className="mx-2 text-2xl">›</span>
      <span className="text-xl">Browse Experts</span>
      <span className="mx-2 text-2xl">›</span>
      <span className="text-xl">{firstName} {lastName}</span>
    </nav>
  );
};