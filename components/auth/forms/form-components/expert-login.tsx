// components/auth/forms/form-components/expert-login.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useSignin } from "@/hooks/auth/use-signin";

const ExpertLogin = () => {
  const { signIn, isLoading, errors } = useSignin('expert');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-900"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full h-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
            errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-900"
          >
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline hover:font-medium"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full h-12 pr-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
              errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {formData.password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Sign In Button */}
      <Button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base rounded-full h-12 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      {/* Sign Up Links */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up as Client
          </Link>{" "}
          or{" "}
          <Link
            href="/expert"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Apply to be an Expert
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ExpertLogin;