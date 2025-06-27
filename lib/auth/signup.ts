// lib/auth/signup.ts
import supabase from "@/lib/supabase/supabase-client";
import { SignUpFormData } from "@/lib/validations/auth/auth";

export interface SignUpResult {
  success: boolean;
  error?: string;
  user?: any;
}

export async function signUpClient(
  data: SignUpFormData
): Promise<SignUpResult> {
  try {
    const { firstName, lastName, email, password } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: "client",
          full_name: `${firstName} ${lastName}`,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      user: authData.user,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
