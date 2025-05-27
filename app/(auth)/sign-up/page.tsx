"use client";

import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  const handleSignUp = async (data: any) => {
    // Here you would integrate with your backend API
    console.log("Sign up data:", data);
    // Simulate API call
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: "", name: "", password: "", confirmPassword: "" }}
      onSubmit={handleSignUp}
    />
  );
};

export default SignUp;
