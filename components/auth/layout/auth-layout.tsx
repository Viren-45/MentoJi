// components/auth/layout/auth-layout.tsx
import React from "react";
import AuthPoster from "./auth-poster";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Poster */}
      <div className="hidden lg:flex lg:w-[30%] flex-shrink-0">
        <AuthPoster />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[70%] flex items-center justify-center bg-white flex-shrink-0">
        <div className="w-full max-w-md px-8 py-12">{children}</div>
      </div>

      {/* Mobile Poster Background */}
      <div className="lg:hidden absolute inset-0 opacity-5">
        <AuthPoster />
      </div>
    </div>
  );
};

export default AuthLayout;
