// components/auth/forms/sign-up-form.tsx
import React from "react";
import ClientSignup from "./form-components/client-signup";
import Link from "next/link";

const SignUpForm = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sign up to{" "}
          <Link href="/">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Mento
            </span>
            <span className="text-blue-900">Ji</span>
          </Link>
        </h1>
      </div>

      {/* Form Content */}
      <div className="mt-6">
        <ClientSignup />
      </div>
    </div>
  );
};

export default SignUpForm;
