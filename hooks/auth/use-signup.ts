// hooks/auth/use-signup.ts
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema, SignUpFormData } from "@/lib/validations/auth/auth";
import { signUpClient } from "@/lib/auth/signup";

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export function useSignup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const signUp = async (formData: SignUpFormData) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = signUpSchema.parse(formData);

      // Attempt signup
      const result = await signUpClient(validatedData);

      if (result.success) {
        toast.success("Sign up successful! Welcome to MentoJi.");
        router.push("/client/dashboard/home");
      } else {
        toast.error(result.error || "Sign up failed. Please try again.");
      }
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.errors) {
        const fieldErrors: FormErrors = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0] as keyof FormErrors] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    errors,
  };
}
