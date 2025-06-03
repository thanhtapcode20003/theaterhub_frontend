"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const [signUpStep, setSignUpStep] = useState<
    "email" | "verification" | "complete"
  >("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      if (formType === "SIGN_UP" && signUpStep !== "complete") {
        return;
      }

      // For sign-up, pre-fill the email that was verified earlier
      if (formType === "SIGN_UP" && userEmail) {
        data = { ...data, email: userEmail } as T;
      }

      const result = await onSubmit(data);

      if (result.success) {
        // Handle successful authentication
        console.log("Authentication successful");
        // Here you would typically redirect the user or update UI state
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  const handleVerifyEmail = () => {
    if ("email" in defaultValues) {
      const emailValue = form.getValues("email" as Path<T>);
      if (emailValue) {
        setUserEmail(emailValue);
        // Simulate sending verification code
        // In a real app, you would call an API to send the verification code
        console.log(`Verification code sent to ${emailValue}`);
        setSignUpStep("verification");
      } else {
        form.setError("email" as Path<T>, {
          type: "manual",
          message: "Please enter your email address",
        });
      }
    }
  };

  const handleVerifyCode = () => {
    // In a real app, you would validate the code with your API
    if (verificationCode.length === 6) {
      console.log("Verification successful");
      setSignUpStep("complete");
    } else {
      // Show error for invalid code
      console.error("Invalid verification code");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {formType === "SIGN_UP" ? (
          <>
            {/* Step 1: Email */}
            {signUpStep === "email" && (
              <>
                {"email" in defaultValues && (
                  <FormField
                    control={form.control}
                    name={"email" as Path<T>}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col gap-2.5">
                        <FormLabel className="paragraph-medium text-dark500">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="email"
                            {...field}
                            className="paragraph-regular background-light900_dark300 light-border-2 text-dark500 no-focus min-h-12 rounded-1.5 border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  Verify Email
                </Button>
              </>
            )}

            {/* Step 2: Verification Code */}
            {signUpStep === "verification" && (
              <>
                <div className="flex w-full flex-col gap-2.5">
                  <p className="paragraph-medium text-dark500">
                    Enter the 6-digit code sent to {userEmail}
                  </p>
                  <Input
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6-digit code"
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark500 no-focus min-h-12 rounded-1.5 border text-center text-lg tracking-widest"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  Verify Code
                </Button>
              </>
            )}

            {/* Step 3: Complete Registration */}
            {signUpStep === "complete" && (
              <>
                {Object.keys(defaultValues)
                  .filter((field) => field !== "email")
                  .map((field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field as Path<T>}
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-2.5">
                          <FormLabel className="paragraph-medium text-dark500">
                            {field.name === "confirmPassword"
                              ? "Confirm Password"
                              : field.name.charAt(0).toUpperCase() +
                                field.name.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              required
                              type={
                                field.name === "password" ||
                                field.name === "confirmPassword"
                                  ? "password"
                                  : "text"
                              }
                              {...field}
                              className="paragraph-regular background-light900_dark300 light-border-2 text-dark500 no-focus min-h-12 rounded-1.5 border"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                <Button
                  type="submit"
                  className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                >
                  {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            {/* Sign In Form */}
            {Object.keys(defaultValues).map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2.5">
                    <FormLabel className="paragraph-medium text-gray-700">
                      {field.name === "email"
                        ? "Email Address"
                        : field.name.charAt(0).toUpperCase() +
                          field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type={field.name === "password" ? "password" : "text"}
                        {...field}
                        className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              disabled={form.formState.isSubmitting}
              className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
            >
              {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </>
        )}

        {formType === "SIGN_IN" ? (
          <p>
            Don't have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
