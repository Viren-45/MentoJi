// lib/validations/expert/expert-application.ts
import { z } from "zod";

// Step 1 Validation Schema (No Password)
export const stepOneSchema = z.object({
  profilePhoto: z
    .instanceof(File, { message: "Profile photo is required" })
    .refine((val) => val !== null, { message: "Profile photo is required" }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().optional(), // Optional field
  location: z.string().min(1, "Location is required"),
});

// Step 2 Validation Schema (unchanged)
export const stepTwoSchema = z
  .object({
    category: z.string().min(1, "Category is required"),
    customCategory: z.string().optional(),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    bio: z
      .string()
      .min(50, "Professional bio must be at least 50 characters")
      .max(500, "Professional bio must be less than 500 characters"),
    linkedinUrl: z.string().optional(), // Optional field
    personalWebsite: z.string().optional(), // Optional field
    twitterHandle: z.string().optional(), // Optional field
  })
  .refine(
    (data) => {
      // If category is "Other", customCategory is required
      if (data.category === "Other") {
        return data.customCategory && data.customCategory.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify your category when selecting 'Other'",
      path: ["customCategory"],
    }
  );

// Step 3 Validation Schema (unchanged)
export const stepThreeSchema = z.object({
  introVideoLink: z.string().optional(), // Optional field
  featuredArticleLink: z.string().optional(), // Optional field
  motivation: z
    .string()
    .min(
      20,
      "Please provide at least 20 characters explaining your motivation"
    ),
  greatestAchievement: z
    .string()
    .min(
      20,
      "Please provide at least 20 characters describing your greatest achievement"
    ),
});

// Complete Application Schema (No Password)
export const completeApplicationSchema = z
  .object({
    // Step 1 fields (No Password)
    profilePhoto: z
      .instanceof(File, { message: "Profile photo is required" })
      .nullable()
      .refine((val) => val !== null, { message: "Profile photo is required" }),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters"),
    email: z.string().email("Please enter a valid email address"),
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().optional(),
    location: z.string().min(1, "Location is required"),

    // Step 2 fields
    category: z.string().min(1, "Category is required"),
    customCategory: z.string().optional(),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    bio: z
      .string()
      .min(50, "Professional bio must be at least 50 characters")
      .max(1000, "Professional bio must be less than 1000 characters"),
    linkedinUrl: z.string().optional(),
    personalWebsite: z.string().optional(),
    twitterHandle: z.string().optional(),

    // Step 3 fields
    introVideoLink: z.string().optional(),
    featuredArticleLink: z.string().optional(),
    motivation: z
      .string()
      .min(
        20,
        "Please provide at least 20 characters explaining your motivation"
      ),
    greatestAchievement: z
      .string()
      .min(
        20,
        "Please provide at least 20 characters describing your greatest achievement"
      ),
  })
  .refine(
    (data) => {
      if (data.category === "Other") {
        return data.customCategory && data.customCategory.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify your category when selecting 'Other'",
      path: ["customCategory"],
    }
  );

// Type definitions
export type StepOneFormData = z.infer<typeof stepOneSchema>;
export type StepTwoFormData = z.infer<typeof stepTwoSchema>;
export type StepThreeFormData = z.infer<typeof stepThreeSchema>;
export type CompleteApplicationFormData = z.infer<
  typeof completeApplicationSchema
>;

// Individual step validation functions
export const validateStepOne = (data: any) => {
  try {
    stepOneSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    return { success: false, errors };
  }
};

export const validateStepTwo = (data: any) => {
  try {
    stepTwoSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    return { success: false, errors };
  }
};

export const validateStepThree = (data: any) => {
  try {
    stepThreeSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    return { success: false, errors };
  }
};
