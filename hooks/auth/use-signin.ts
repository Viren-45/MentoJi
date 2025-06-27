// hooks/auth/use-signin.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema, SignInFormData } from "@/lib/validations/auth/auth";
import { signInClient, signInExpert } from "@/lib/auth/signin";

export interface SignInFormErrors {
  email?: string;
  password?: string;
}

export function useSignin(userType: "client" | "expert" = "client") {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignInFormErrors>({});

  const signIn = async (formData: SignInFormData) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data with Zod
      const validatedData = signInSchema.parse(formData);

      // Choose signin function based on user type
      const signinFunction =
        userType === "expert" ? signInExpert : signInClient;
      const result = await signinFunction(validatedData);

      if (result.success) {
        toast.success("Welcome back!");

        // Handle redirect based on user type and calendar status
        if (userType === "expert") {
          // Check if expert needs to connect calendar
          if (result.calendarConnected === false) {
            router.push("/expert/calendar-setup");
          } else {
            router.push("/expert/dashboard/availability");
          }
        } else {
          router.push("/client/dashboard/home");
        }
      } else {
        toast.error(result.error || "Sign in failed. Please try again.");
      }
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.errors) {
        const fieldErrors: SignInFormErrors = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0] as keyof SignInFormErrors] = err.message;
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
    signIn,
    isLoading,
    errors,
  };
}
