// components/auth/forms/sign-in-form.tsx
"use client";

import React, { useState } from "react";
import AuthTabs from "./form-components/auth-tabs";
import ClientLogin from "./form-components/client-login";
import ExpertLogin from "./form-components/expert-login";
import Link from "next/link";

const SignInForm = () => {
  const [activeTab, setActiveTab] = useState<"client" | "expert">("client");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sign in to{" "}
          <Link href="/">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Mento
            </span>
            <span className="text-blue-900">Ji</span>
          </Link>
        </h1>
      </div>

      {/* Tabs */}
      <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Form Content */}
      <div className="mt-6">
        {activeTab === "client" ? <ClientLogin /> : <ExpertLogin />}
      </div>
    </div>
  );
};

export default SignInForm;
