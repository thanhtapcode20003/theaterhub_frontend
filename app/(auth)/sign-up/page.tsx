"use client";

import React from "react";
import { toast } from "react-toastify";

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validations";
import { RegisterRequest } from "@/types";

const SignUp = () => {
  const handleSignUp = async (data: RegisterRequest) => {
    try {
      // This is handled by the AuthForm component itself now
      // The form will call AuthService.register internally
      console.log("Sign up data:", data);
      return { success: true };
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      return { success: false };
    }
  };

  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={handleSignUp}
    />
  );
};

export default SignUp;
