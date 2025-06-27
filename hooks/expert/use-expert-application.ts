// hooks/expert/use-expert-application.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  completeApplicationSchema,
  CompleteApplicationFormData,
  validateStepOne,
  validateStepTwo,
  validateStepThree,
} from "@/lib/validations/expert/expert-application";

export interface ExpertApplicationErrors {
  [key: string]: string;
}

export function useExpertApplication() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ExpertApplicationErrors>({});

  // Validate individual steps (now async for step 1 to include email check)
  const validateStep = async (stepNumber: number, formData: any) => {
    let validation;

    switch (stepNumber) {
      case 1:
        // Run basic validation first
        validation = validateStepOne(formData);

        // If basic validation passes, check email availability
        if (validation.success) {
          try {
            const response = await fetch("/api/expert/check-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: formData.email }),
            });

            const emailResult = await response.json();

            if (!emailResult.available) {
              validation = {
                success: false,
                errors: {
                  ...validation.errors,
                  email: emailResult.error || "Email is not available",
                },
              };
            }
          } catch (error) {
            validation = {
              success: false,
              errors: {
                ...validation.errors,
                email: "Error checking email availability",
              },
            };
          }
        }
        break;
      case 2:
        validation = validateStepTwo(formData);
        break;
      case 3:
        validation = validateStepThree(formData);
        break;
      default:
        return { success: true, errors: {} };
    }

    if (!validation.success) {
      setErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }

    setErrors({});
    return { success: true, errors: {} };
  };

  // Submit complete application
  const submitApplication = async (formData: CompleteApplicationFormData) => {
    setIsLoading(true);
    setErrors({});

    try {
      // Final validation of complete form
      const validatedData = completeApplicationSchema.parse(formData);

      // Prepare FormData for API call
      const formDataObj = new FormData();

      // Append all fields to FormData
      Object.entries(validatedData).forEach(([key, value]) => {
        if (key === "skills") {
          formDataObj.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formDataObj.append(key, value as string | Blob);
        }
      });

      // Submit to API route
      const response = await fetch("/api/expert/apply", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to a success page
        router.push("/expert/application-success");
      } else {
        toast.error(
          result.error || "Failed to submit application. Please try again."
        );
      }

      return result;
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.errors) {
        const fieldErrors: ExpertApplicationErrors = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please check the form for errors and try again.");
        return { success: false, errors: fieldErrors };
      } else {
        const errorMessage = "An unexpected error occurred. Please try again.";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear specific field errors
  const clearFieldErrors = (fields: string[]) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      fields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  // Clear all errors
  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    submitApplication,
    validateStep, // Now async for step 1
    clearFieldErrors,
    clearAllErrors,
    isLoading,
    errors,
  };
}

// Hook for username availability checking
export function useUsernameCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setStatus("idle");
      return;
    }

    setIsChecking(true);
    setStatus("checking");

    try {
      const response = await fetch("/api/expert/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (result.error) {
        setStatus("error");
      } else {
        setStatus(result.available ? "available" : "taken");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsChecking(false);
    }
  };

  const resetStatus = () => {
    setStatus("idle");
    setIsChecking(false);
  };

  return {
    checkUsername,
    resetStatus,
    isChecking,
    status,
    isAvailable: status === "available",
    isTaken: status === "taken",
    hasError: status === "error",
  };
}
