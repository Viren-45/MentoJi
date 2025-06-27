// components/expert/apply/expert-apply-form.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "./progress-bar";
import StepNavigation from "./navigation/step-navigation";
import StepOne from "./steps/step-one";
import StepTwo from "./steps/step-two";
import StepThree from "./steps/step-three";
import { useExpertApplication } from "@/hooks/expert/use-expert-application";
import { CompleteApplicationFormData } from "@/lib/validations/expert/expert-application";

interface FormData {
  // Step 1 - Personal Info
  profilePhoto: File | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  jobTitle: string;
  company: string;
  location: string;

  // Step 2 - Professional
  category: string;
  customCategory: string;
  skills: string[];
  bio: string;
  linkedinUrl: string;
  personalWebsite: string;
  twitterHandle: string;

  // Step 3 - Additional Details
  introVideoLink: string;
  featuredArticleLink: string;
  motivation: string;
  greatestAchievement: string;
}

const ExpertApplyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    profilePhoto: null,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    jobTitle: "",
    company: "",
    location: "",

    // Step 2
    category: "",
    customCategory: "",
    skills: [],
    bio: "",
    linkedinUrl: "",
    personalWebsite: "",
    twitterHandle: "",

    // Step 3
    introVideoLink: "",
    featuredArticleLink: "",
    motivation: "",
    greatestAchievement: "",
  });

  // Use the validation hook
  const { 
    submitApplication, 
    validateStep, 
    isLoading, 
    errors,
    clearFieldErrors 
  } = useExpertApplication();

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    clearFieldErrors(updatedFields);
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      // Validate current step before proceeding
      const validation = await validateStep(currentStep, formData);
      
      if (validation.success) {
        setCurrentStep(prev => prev + 1);
      }
      // If validation fails, errors will be set by the hook and displayed
    } else {
      // Handle final submission
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if profile photo is uploaded
    if (!formData.profilePhoto) {
      // This should be caught by validation, but adding as safety check
      return;
    }

    // Convert FormData to CompleteApplicationFormData type
    const applicationData: CompleteApplicationFormData = {
      ...formData,
      profilePhoto: formData.profilePhoto, // Now TypeScript knows it's not null
    };

    // Final validation and submission
    await submitApplication(applicationData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Step 1 Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-1 mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Welcome to MentoJi!</h4>
                <p className="text-blue-100 mb-2">
                  We're excited to have you join our community of experts and mentors!
                </p>
                <p className="text-blue-100">
                  Let's start by getting to know you better. Share your basic information and professional background to help us create your expert profile.
                </p>
              </div>
            </div>
          </div>
          <StepOne formData={formData} updateFormData={updateFormData} errors={errors} />
        </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Step 2 Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Great progress!</h4>
                  <p className="text-blue-100 mb-2">
                    Now let's dive into your professional expertise and skills.
                  </p>
                  <p className="text-blue-100">
                    This information helps us match you with the right clients and showcase your areas of expertise. Your skills and bio will be visible to potential clients looking for guidance.
                  </p>
                </div>
              </div>
            </div>
            <StepTwo formData={formData} updateFormData={updateFormData} errors={errors} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {/* Step 3 Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Almost there!</h4>
                  <p className="text-blue-100 mb-2">
                    You're just one step away from becoming an expert and connecting with clients all over the world!
                  </p>
                  <p className="text-blue-100">
                    In this final step, showcase your accomplishments and let us know what motivates you. Many of these fields are optional, but they help us get better insights into your work and expertise.
                  </p>
                </div>
              </div>
            </div>
            <StepThree formData={formData} updateFormData={updateFormData} errors={errors} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Become an Expert
          </h1>
          <p className="text-gray-600">
            Join our community of experts and share your knowledge with others.
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={3} />

        {/* Form Card */}
        <Card className="bg-white shadow-lg">

          <CardContent>
            {/* Step Content */}
            {renderCurrentStep()}

            {/* Navigation */}
            <StepNavigation
              currentStep={currentStep}
              totalSteps={3}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertApplyForm;