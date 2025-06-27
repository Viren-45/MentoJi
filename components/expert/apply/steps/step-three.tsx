// components/expert/apply/steps/step-three.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  introVideoLink: string;
  featuredArticleLink: string;
  motivation: string;
  greatestAchievement: string;
}

interface StepThreeProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors?: Record<string, string>;
}

const StepThree = ({ formData, updateFormData, errors = {} }: StepThreeProps) => {
  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Video and Article Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intro Video */}
        <div className="space-y-2">
          <Label htmlFor="introVideoLink" className="text-sm font-medium text-gray-900">
            Introduction Video <span className="text-gray-500">(optional)</span>
          </Label>
          <Input
            id="introVideoLink"
            type="url"
            value={formData.introVideoLink}
            onChange={(e) => handleInputChange("introVideoLink", e.target.value)}
            placeholder="https://your-intro-video-URL"
            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">
            Upload a YouTube video or record a Loom for your potential clients
          </p>
        </div>

        {/* Featured Article */}
        <div className="space-y-2">
          <Label htmlFor="featuredArticleLink" className="text-sm font-medium text-gray-900">
            Featured Work <span className="text-gray-500">(optional)</span>
          </Label>
          <Input
            id="featuredArticleLink"
            type="url"
            value={formData.featuredArticleLink}
            onChange={(e) => handleInputChange("featuredArticleLink", e.target.value)}
            placeholder="https://your-blog-article-URL"
            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">
            Share an interview, podcast, or piece of content you are proud of or were featured in.
          </p>
        </div>
      </div>

      {/* Motivation Question */}
      <div className="space-y-2">
        <Label htmlFor="motivation" className="text-sm font-medium text-gray-900">
          Why do you want to become an expert? <span className="text-gray-500">(Not publicly visible)</span>
        </Label>
        <Textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => handleInputChange("motivation", e.target.value)}
          placeholder="Share your motivation for joining our community of professional experts..."
          className={`min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none ${
            errors.motivation ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          rows={5}
        />
        {errors.motivation && (
          <p className="text-sm text-red-600">{errors.motivation}</p>
        )}
      </div>

      {/* Greatest Achievement */}
      <div className="space-y-2">
        <Label htmlFor="greatestAchievement" className="text-sm font-medium text-gray-900">
          What, in your opinion, has been your greatest achievement so far? <span className="text-gray-500">(Not publicly visible)</span>
        </Label>
        <Textarea
          id="greatestAchievement"
          value={formData.greatestAchievement}
          onChange={(e) => handleInputChange("greatestAchievement", e.target.value)}
          placeholder="Describe a professional accomplishment you're most proud of..."
          className={`min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none ${
            errors.greatestAchievement ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          rows={5}
        />
        {errors.greatestAchievement && (
          <p className="text-sm text-red-600">{errors.greatestAchievement}</p>
        )}
      </div>
    </div>
  );
};

export default StepThree;