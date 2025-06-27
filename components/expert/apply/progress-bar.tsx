import React from "react";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Professional" },
    { number: 3, title: "Additional Details" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${
                    step.number < currentStep
                      ? "bg-green-500 text-white"
                      : step.number === currentStep
                      ? "bg-white text-blue-600 border-2 border-blue-600"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {step.number < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step Title */}
              <span
                className={`
                  mt-2 text-sm font-medium transition-colors duration-300
                  ${
                    step.number <= currentStep
                      ? "text-gray-900"
                      : "text-gray-500"
                  }
                `}
              >
                {step.title}
              </span>
            </div>
          </React.Fragment>
        ))}

        {/* Continuous Progress Line - Positioned between circles */}
        <div className="absolute top-5 left-5 right-10 flex items-center z-0">
          <div className="w-full h-0.5 bg-gray-200">
            <div 
              className="h-full bg-green-500 transition-all duration-500 ease-in-out"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;