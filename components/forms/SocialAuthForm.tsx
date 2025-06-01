"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const SocialAuthForm = () => {
  const buttonClass =
    "group background-light900 body-medium text-dark200 min-h-12 w-full rounded-2 px-4 py-3.5 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-200/50 active:scale-[0.98] border border-gray-200 hover:border-gray-300";

  const handleGoogleSignIn = () => {
    try {
      console.log("Initiating Google Sign In...");
      window.location.href = "http://localhost:8080/auth/google";
    } catch (error) {
      console.error("Error during Google Sign In redirect:", error);
    }
  };

  return (
    <div className="mt-10">
      <Button className={buttonClass} onClick={handleGoogleSignIn}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 w-[20px] h-[20px]"
        />
        <span className="transition-colors duration-300 ease-in-out">
          Log in with Google
        </span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
