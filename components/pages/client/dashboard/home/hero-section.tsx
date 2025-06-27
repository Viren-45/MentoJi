// components/pages/client/dashboard/home/hero-section.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/auth/use-auth';

const HeroSection = () => {
  const { user } = useAuth();

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
          {/* Welcome Message */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Welcome to your dashboard
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Welcome,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {user?.first_name || 'there'}
              </span>
              !
            </h1>
          </div>

          {/* Friendly Message */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-4">
              Ready to solve your next business challenge?
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Connect with verified experts who can provide targeted advice in just 15-30 minutes. 
              Get the insights you need to move forward with confidence.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Expert Professionals</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-purple-600 mb-1">15-30</div>
              <div className="text-sm text-gray-600">Minute Sessions</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-indigo-600 mb-1">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/browse-experts">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
              >
                Browse Experts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/how-it-works">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-700 hover:bg-white hover:border-blue-300 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                How It Works
              </Button>
            </Link>
          </div>

          {/* Quick Action Hint */}
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              💡 <span className="font-medium">Pro tip:</span> Most questions can be resolved in a single 15-minute session
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;