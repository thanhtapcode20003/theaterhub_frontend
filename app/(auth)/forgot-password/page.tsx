"use client";

import AuthForm from "@/components/forms/AuthForm";
import { ForgotPasswordSchema } from "@/lib/validations";

const ForgotPasswordPage = () => {
  return (
    <AuthForm
      formType="FORGOT_PASSWORD"
      schema={ForgotPasswordSchema}
      defaultValues={{ email: "" }}
      onSubmit={async (data) => ({ success: true })}
    />
  );
};

export default ForgotPasswordPage;
