// app/browse-experts/layout.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Experts - Mentoji',
  description: 'Browse and connect with expert professionals to get personalized guidance and support.',
};

const BrowseExpertsLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return children;
};

export default BrowseExpertsLayout;
