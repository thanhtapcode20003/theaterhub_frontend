"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";
import AuthService from "@/lib/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { LoginRequest } from "@/types";
import ROUTES from "@/constants/routes";

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = async (data: LoginRequest) => {
    try {
      const response = await AuthService.login(data);

      if (response.success && response.user && response.token) {
        // Use the context login method
        login(response.token, response.user);

        // Redirect to home page
        router.push(ROUTES.HOME);

        return { success: true };
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
        return { success: false };
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      return { success: false };
    }
  };

  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={handleSignIn}
    />
  );
};

export default SignIn;
