// components/auth/layout/auth-poster.tsx
import React from "react";
import Image from "next/image";

const AuthPoster = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/Images/auth-poster.png"
          alt="MentoJi Authentication"
          fill
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Optional Overlay for better text readability if needed */}
      <div className="absolute inset-0 bg-black/60 w-full h-full"></div>

      {/* Optional Content Overlay - You can add text/branding here if needed */}
      <div className="relative z-10 text-center text-white px-8">
        {/* Uncomment if you want to add text overlay */}

        {/* <h1 className="text-4xl font-bold mb-4">
          Connect with <span className="text-blue-300">Expert</span> Advice
        </h1>
        <p className="text-xl opacity-90">
          Get instant professional consultation for your business challenges
        </p> */}
      </div>
    </div>
  );
};

export default AuthPoster;
