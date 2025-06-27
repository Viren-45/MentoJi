// components/expert/apply/navigation/step-navigation.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

const StepNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLoading = false,
}: StepNavigationProps) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className="flex items-center gap-2 px-6 py-2 text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* Next/Submit Button - Always Active */}
      <Button
        type="button"
        onClick={onNext}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {isLastStep ? "Submitting..." : "Processing..."}
          </>
        ) : (
          <>
            {isLastStep ? "Submit Application" : "Next"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </>
        )}
      </Button>
    </div>
  );
};

export default StepNavigation;