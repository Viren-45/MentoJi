// components/expert/apply/steps/step-two.tsx
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Linkedin, Globe, Twitter } from "lucide-react";

interface FormData {
  category: string;
  customCategory: string;
  skills: string[];
  bio: string;
  linkedinUrl: string;
  personalWebsite: string;
  twitterHandle: string;
}

interface StepTwoProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors?: Record<string, string>;
}

const StepTwo = ({ formData, updateFormData, errors = {} }: StepTwoProps) => {
  const [skillsInput, setSkillsInput] = useState("");

  const categories = [
    "Technology & Software",
    "Business & Strategy",
    "Design & Creativity",
    "Marketing & Sales",
    "Finance & Investment",
    "Health & Wellness",
    "Education & Training",
    "Consulting",
    "Other",
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const processSkillsInput = (value: string) => {
    // Handle comma-separated skills
    if (value.includes(',')) {
      const newSkills = value
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill && !formData.skills.includes(skill));
      
      if (newSkills.length > 0) {
        updateFormData({
          skills: [...formData.skills, ...newSkills],
        });
      }
      setSkillsInput('');
    } else {
      setSkillsInput(value);
    }
  };

  const addSkillOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedSkill = skillsInput.trim();
      if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
        updateFormData({
          skills: [...formData.skills, trimmedSkill],
        });
        setSkillsInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateFormData({
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      handleInputChange("bio", value);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          Category *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger className="h-11 border-gray-300 cursor-pointer">
              <SelectValue placeholder="Select your expertise category"/>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="cursor-pointer hover:bg-blue-200">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {formData.category === "Other" && (
            <Input
              type="text"
              value={formData.customCategory}
              onChange={(e) => handleInputChange("customCategory", e.target.value)}
              placeholder="Please specify your category *"
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-900">
          Skills & Expertise *
        </Label>
        
        {/* Skills Input with Tags */}
        <div className="relative">
          <div className={`min-h-[44px] border border-gray-300 rounded-md p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${
            errors.skills ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : ""
          }`}>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Display existing skills as badges */}
              {formData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1 text-base"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="w-4 h-4 cursor-pointer hover:text-red-600" />
                  </button>
                </Badge>
              ))}
              
              {/* Input for new skills */}
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => processSkillsInput(e.target.value)}
                onKeyPress={addSkillOnEnter}
                placeholder={formData.skills.length === 0 ? "Add skills (e.g., React, Project Management). Press Enter or use comma to add." : "Add more skills..."}
                className="flex-1 min-w-[200px] outline-none border-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {errors.skills && (
          <p className="text-sm text-red-600">{errors.skills}</p>
        )}

        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Describe your expertise to connect with clients who have similar interests and goals.
          </p>
          <p className="text-sm text-gray-500">
            Type skills and press Enter or use comma to add multiple skills. Clients will search for you using these keywords.
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-900">
            Professional Bio *
          </Label>
          <span className="text-sm text-gray-500">
            {formData.bio.length}/1000
          </span>
        </div>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={handleBioChange}
          className={`min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none ${
            errors.bio ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          rows={5}
        />
        {errors.bio && (
          <p className="text-sm text-red-600">{errors.bio}</p>
        )}
        <p className="text-sm text-gray-500">
          Tell us (and your clients) a little bit about yourself. Talk about yourself in the first person, as if you'd directly talk to a client. This will be public.
        </p>
      </div>

      {/* Social Links */}
      <div className="space-y-6">
        {/* LinkedIn and Twitter - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-900">
              LinkedIn Profile
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Linkedin className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Twitter */}
          <div className="space-y-2">
            <Label htmlFor="twitterHandle" className="text-sm font-medium text-gray-900">
              Twitter Handle
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Twitter className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                id="twitterHandle"
                type="text"
                value={formData.twitterHandle}
                onChange={(e) => handleInputChange("twitterHandle", e.target.value)}
                placeholder="yourusername"
                className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-gray-500">
              Omit the "@" (e.g., johnsmith)
            </p>
          </div>
        </div>

        {/* Personal Website - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="personalWebsite" className="text-sm font-medium text-gray-900">
            Personal Website
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Globe className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              id="personalWebsite"
              type="url"
              value={formData.personalWebsite}
              onChange={(e) => handleInputChange("personalWebsite", e.target.value)}
              placeholder="https://your-website.com"
              className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <p className="text-sm text-gray-500">
            You can add your personal website or blog here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;