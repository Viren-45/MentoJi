// components/pages/client/dashboard/home/recommended-experts.tsx
"use client";

import React from 'react';
import Autoplay from "embla-carousel-autoplay"
import ExpertCard from './expert-card';
import { mockExperts } from './mock-data';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from '@/lib/utils';

const RecommendedExperts = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <section className="py-16 bg-white overflow-x-clip">
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

        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{ align: 'start', loop: true }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent className="-ml-4">
            {mockExperts.map((expert, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2">
                <ExpertCard expert={expert} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-[50%] z-10 size-10 shadow-lg hover:shadow-xl hover:scale-105" />
          <CarouselNext className="right-0 translate-x-[50%] size-10 shadow-lg hover:shadow-xl hover:scale-105" />
        </Carousel>

        {/* Page Indicators */}
        <div className="flex items-center justify-center mt-8 space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-300',
                index + 1 === current ? 'bg-blue-600' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedExperts;