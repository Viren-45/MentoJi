// components/expert/apply/steps/step-one.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";
import ProfilePictureUpload from "@/components/shared/profile-picture-upload";
import { useUsernameCheck } from "@/hooks/expert/use-expert-application";

interface FormData {
  profilePhoto: File | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  jobTitle: string;
  company: string;
  location: string;
}

interface StepOneProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors?: Record<string, string>;
}

const StepOne = ({ formData, updateFormData, errors = {} }: StepOneProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { checkUsername, status, isChecking } = useUsernameCheck();

  useEffect(() => {
    if (formData.username.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkUsername(formData.username);
      }, 500); // Debounce for 500ms
  
      return () => clearTimeout(timeoutId);
    }
  }, [formData.username]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleImageSelect = (file: File, previewUrl: string) => {
    updateFormData({ profilePhoto: file });
    setPhotoPreview(previewUrl);
  };

  const handleImageRemove = () => {
    updateFormData({ profilePhoto: null });
    setPhotoPreview(null);
  };

  return (
    <div className="space-y-8">
      {/* Profile Photo and Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Profile Photo Upload */}
        <div className="md:col-span-2 flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={photoPreview || ""} />
            <AvatarFallback className="bg-gray-100">
              <User className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsUploadModalOpen(true)}
            className={`px-6 py-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer ${
              errors.profilePhoto ? "border-red-500 text-red-600 hover:bg-red-50 hover:text-red-600" : ""
            }`}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload Photo
          </Button>
          {errors.profilePhoto && (
            <p className="text-sm text-red-600 text-center">{errors.profilePhoto}</p>
          )}
        </div>

        {/* Name Fields - Stacked Vertically */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">
              First Name *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className={`h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className={`h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Username and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-900">
            Username *
          </Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="Choose a unique username"
            className={`h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.username || status === 'taken' ? "border-red-500 focus:border-red-500 focus:ring-red-500" : 
              status === 'available' ? "border-green-500 focus:border-green-500 focus:ring-green-500" : ""
            }`}
          />
          {formData.username.length >= 3 && (
            <div className="text-sm">
              {isChecking && <span className="text-gray-500">Checking availability...</span>}
              {status === 'available' && <span className="text-green-600">✓ Username is available</span>}
              {status === 'taken' && <span className="text-red-600">✗ Username is already taken</span>}
              {status === 'error' && <span className="text-red-600">Error checking username</span>}
            </div>
          )}
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
            className={`h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Job Title and Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-900">
            Job Title *
          </Label>
          <Input
            id="jobTitle"
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className={`h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.jobTitle ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.jobTitle && (
            <p className="text-sm text-red-600">{errors.jobTitle}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium text-gray-900">
            Company
          </Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Enter your company name"
            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-900">
            Location *
          </Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="City, Country"
            className={`h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location}</p>
          )}
        </div>
      </div>

      <ProfilePictureUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentImage={photoPreview}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
      />
    </div>
  );
};

export default StepOne;