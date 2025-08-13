"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";

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
import { PasswordInput } from "@/components/ui/password-input";
import { showToast } from "@/components/ui/toast";
import ROUTES from "@/constants/routes";
import AuthService from "@/lib/services/authService";
import {
  SignUpSchema,
  OTPVerificationSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/validations";
import { RegisterRequest, AuthResponse } from "@/types";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  schema: z.ZodSchema<any, any, any>;
  defaultValues: any;
  onSubmit: (data: any) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD";
}

type SignUpStep = "registration" | "otp_verification" | "completed";
type ForgotPasswordStep = "forgot_password" | "reset_password" | "completed";

const AuthForm = ({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps) => {
  // Sign-up specific state
  const [signUpStep, setSignUpStep] = useState<SignUpStep>("registration");
  const [registrationData, setRegistrationData] =
    useState<RegisterRequest | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Forgot password specific state
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>("forgot_password");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordResendTimer, setForgotPasswordResendTimer] = useState(0);
  const [isForgotPasswordResending, setIsForgotPasswordResending] =
    useState(false);

  // Form setup
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  // OTP form for verification step
  const otpForm = useForm<z.infer<typeof OTPVerificationSchema>>({
    resolver: zodResolver(OTPVerificationSchema),
    defaultValues: { code: "" },
  });

  // Forgot password form
  const forgotPasswordForm = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Reset password form
  const resetPasswordForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Countdown timer for forgot password resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (forgotPasswordResendTimer > 0) {
      interval = setInterval(() => {
        setForgotPasswordResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [forgotPasswordResendTimer]);

  // Handle registration form submission
  const handleRegistrationSubmit: SubmitHandler<any> = async (data) => {
    try {
      if (formType === "SIGN_IN") {
        // Handle sign in
        const result = await onSubmit(data);
        if (result.success) {
          showToast({
            type: "success",
            title: "Đăng nhập thành công!",
            message: "Chào mừng bạn quay trở lại",
          });
        }
        return;
      }

      // Handle sign up registration step
      const registerData = data as unknown as RegisterRequest;
      setRegistrationData(registerData);

      // Call register API
      const response: AuthResponse = await AuthService.register(registerData);

      if (response.success) {
        showToast({
          type: "success",
          title: "Đăng ký thành công!",
          message: `Mã OTP đã được gửi đến ${registerData.email}`,
        });
        setSignUpStep("otp_verification");
        setResendTimer(60); // Start 60-second countdown
      } else {
        showToast({
          type: "error",
          title: "Đăng ký thất bại",
          message: response.message || "Có lỗi xảy ra khi đăng ký",
        });
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      showToast({
        type: "error",
        title: "Đăng ký thất bại",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    }
  };

  // Handle OTP verification
  const handleOTPVerification = async (
    otpData: z.infer<typeof OTPVerificationSchema>
  ) => {
    try {
      const response: AuthResponse = await AuthService.verifyEmail(
        otpData.code
      );

      if (response.success) {
        showToast({
          type: "success",
          title: "Xác thực thành công!",
          message: "Tài khoản của bạn đã được kích hoạt",
        });
        setSignUpStep("completed");

        // Auto redirect to sign in after 2 seconds
        setTimeout(() => {
          window.location.href = ROUTES.SIGN_IN;
        }, 2000);
      } else {
        showToast({
          type: "error",
          title: "Xác thực thất bại",
          message: response.message || "Mã OTP không hợp lệ hoặc đã hết hạn",
        });
      }
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      showToast({
        type: "error",
        title: "Xác thực thất bại",
        message: error.message || "Có lỗi xảy ra khi xác thực",
      });
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!registrationData || resendTimer > 0 || isResending) return;

    try {
      setIsResending(true);
      const response: AuthResponse = await AuthService.resendOTP({
        email: registrationData.email,
      });

      if (response.success) {
        showToast({
          type: "success",
          title: "Gửi lại mã OTP thành công!",
          message: `Mã OTP mới đã được gửi đến ${registrationData.email}`,
        });
        setResendTimer(60); // Reset countdown
        setOtpCode(""); // Clear current OTP input
        otpForm.reset(); // Reset OTP form
      } else {
        showToast({
          type: "error",
          title: "Gửi lại mã OTP thất bại",
          message: response.message || "Không thể gửi lại mã OTP",
        });
      }
    } catch (error: any) {
      console.error("Resend OTP failed:", error);
      showToast({
        type: "error",
        title: "Gửi lại mã OTP thất bại",
        message: error.message || "Có lỗi xảy ra khi gửi lại mã OTP",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Handle forgot password form submission
  const handleForgotPassword = async (
    data: z.infer<typeof ForgotPasswordSchema>
  ) => {
    try {
      const response = await AuthService.forgotPassword(data.email);

      if (response.success) {
        setForgotPasswordEmail(data.email);
        resetPasswordForm.setValue("email", data.email);
        setForgotPasswordStep("reset_password");
        setForgotPasswordResendTimer(60); // Start 60-second countdown
        showToast({
          type: "success",
          title: "Gửi OTP thành công!",
          message: `Mã OTP đã được gửi đến ${data.email}`,
        });
      } else {
        showToast({
          type: "error",
          title: "Gửi OTP thất bại",
          message: response.message || "Có lỗi xảy ra khi gửi OTP",
        });
      }
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      showToast({
        type: "error",
        title: "Gửi OTP thất bại",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    }
  };

  // Handle reset password form submission
  const handleResetPassword = async (
    data: z.infer<typeof ResetPasswordSchema>
  ) => {
    try {
      const response = await AuthService.resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      if (response.success) {
        setForgotPasswordStep("completed");
        showToast({
          type: "success",
          title: "Đặt lại mật khẩu thành công!",
          message: "Mật khẩu của bạn đã được thay đổi",
        });
      } else {
        showToast({
          type: "error",
          title: "Đặt lại mật khẩu thất bại",
          message: response.message || "Có lỗi xảy ra khi đặt lại mật khẩu",
        });
      }
    } catch (error: any) {
      console.error("Reset password failed:", error);
      showToast({
        type: "error",
        title: "Đặt lại mật khẩu thất bại",
        message: error.message || "Có lỗi xảy ra khi đặt lại mật khẩu",
      });
    }
  };

  // Handle resend OTP for forgot password
  const handleForgotPasswordResendOTP = async () => {
    if (
      !forgotPasswordEmail ||
      forgotPasswordResendTimer > 0 ||
      isForgotPasswordResending
    )
      return;

    try {
      setIsForgotPasswordResending(true);
      const response = await AuthService.forgotPassword(forgotPasswordEmail);

      if (response.success) {
        showToast({
          type: "success",
          title: "Gửi lại mã OTP thành công!",
          message: `Mã OTP mới đã được gửi đến ${forgotPasswordEmail}`,
        });
        setForgotPasswordResendTimer(60); // Reset countdown
        resetPasswordForm.setValue("otp", ""); // Clear OTP input
      } else {
        showToast({
          type: "error",
          title: "Gửi lại mã OTP thất bại",
          message: response.message || "Không thể gửi lại mã OTP",
        });
      }
    } catch (error: any) {
      console.error("Resend OTP failed:", error);
      showToast({
        type: "error",
        title: "Gửi lại mã OTP thất bại",
        message: error.message || "Có lỗi xảy ra khi gửi lại mã OTP",
      });
    } finally {
      setIsForgotPasswordResending(false);
    }
  };

  // Render registration form
  const renderRegistrationForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegistrationSubmit)}
        className="mt-10 space-y-6"
        noValidate
      >
        {Object.keys(defaultValues).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as Path<any>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-gray-700">
                  {fieldName === "name" && "Họ và tên"}
                  {fieldName === "email" && "Email"}
                  {fieldName === "password" && "Mật khẩu"}
                  {fieldName === "confirmPassword" && "Xác nhận mật khẩu"}
                </FormLabel>
                <FormControl>
                  {fieldName === "password" ||
                  fieldName === "confirmPassword" ? (
                    <PasswordInput {...field} />
                  ) : (
                    <Input
                      type={fieldName === "email" ? "email" : "text"}
                      {...field}
                      className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>
      </form>
    </Form>
  );

  // Render OTP verification form
  const renderOTPForm = () => (
    <Form {...otpForm}>
      <form
        onSubmit={otpForm.handleSubmit(handleOTPVerification)}
        className="mt-10 space-y-6"
        noValidate
      >
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Xác thực email
          </h3>
          <p className="text-sm text-gray-600">
            Chúng tôi đã gửi mã OTP 6 chữ số đến
          </p>
          <p className="text-sm font-medium text-gray-800">
            {registrationData?.email}
          </p>
        </div>

        <FormField
          control={otpForm.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="paragraph-medium text-gray-700 text-center">
                Nhập mã OTP
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={6}
                  placeholder="_ _ _ _ _ _"
                  className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border text-center text-lg tracking-widest font-mono"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                    field.onChange(value);
                    setOtpCode(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={otpForm.formState.isSubmitting || otpCode.length !== 6}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          {otpForm.formState.isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Đang xác thực...
            </>
          ) : (
            "Xác thực"
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Không nhận được mã?</p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={resendTimer > 0 || isResending}
            className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
          >
            {isResending ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Đang gửi...
              </>
            ) : resendTimer > 0 ? (
              `Gửi lại sau ${resendTimer}s`
            ) : (
              "Gửi lại mã OTP"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  // Render completion message
  const renderCompletionMessage = () => (
    <div className="mt-10 text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">
          Đăng ký thành công!
        </h3>
        <p className="text-gray-600">
          Tài khoản của bạn đã được tạo và xác thực thành công.
        </p>
        <p className="text-sm text-gray-500">
          Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
        </p>
      </div>

      <Button
        onClick={() => (window.location.href = ROUTES.SIGN_IN)}
        className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
      >
        Đến trang đăng nhập
      </Button>
    </div>
  );

  // Render sign in form
  const renderSignInForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegistrationSubmit)}
        className="mt-10 space-y-6"
        noValidate
      >
        {Object.keys(defaultValues).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as Path<any>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-gray-700">
                  {fieldName === "email" ? "Email" : "Mật khẩu"}
                </FormLabel>
                <FormControl>
                  {fieldName === "password" ? (
                    <PasswordInput {...field} />
                  ) : (
                    <Input
                      type="email"
                      {...field}
                      className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              "Đang đăng nhập..."
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>

        {/* Forgot password link */}
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </form>
    </Form>
  );

  // Render forgot password form
  const renderForgotPasswordForm = () => (
    <div className="w-full">
      <Form {...forgotPasswordForm}>
        <form
          onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
          className="mt-10 space-y-6"
          noValidate
        >
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-600">
              Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
            </p>
          </div>
          <FormField
            control={forgotPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={forgotPasswordForm.formState.isSubmitting}
            className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
          >
            {forgotPasswordForm.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Đang gửi...
              </>
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );

  // Render reset password form
  const renderResetPasswordForm = () => (
    <div className="w-full">
      <Form {...resetPasswordForm}>
        <form
          onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
          className="mt-10 space-y-6"
          noValidate
        >
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600">Nhập mã OTP và mật khẩu mới</p>
            <p className="text-sm text-gray-500 mt-1">
              Mã OTP đã được gửi đến {forgotPasswordEmail}
            </p>
          </div>
          <FormField
            control={resetPasswordForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-gray-700">
                  Mã OTP
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="_ _ _ _ _ _"
                    maxLength={6}
                    className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border text-center text-lg tracking-widest font-mono"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={resetPasswordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-gray-700">
                  Mật khẩu mới
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Nhập mật khẩu mới"
                    className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={resetPasswordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-gray-700">
                  Xác nhận mật khẩu
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Nhập lại mật khẩu mới"
                    className="paragraph-regular bg-white border-gray-300 text-gray-900 no-focus min-h-12 rounded-1.5 border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={resetPasswordForm.formState.isSubmitting}
            className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
          >
            {resetPasswordForm.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Đang đặt lại...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Không nhận được mã?</p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleForgotPasswordResendOTP}
              disabled={
                forgotPasswordResendTimer > 0 || isForgotPasswordResending
              }
              className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
            >
              {isForgotPasswordResending ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : forgotPasswordResendTimer > 0 ? (
                `Gửi lại sau ${forgotPasswordResendTimer}s`
              ) : (
                "Gửi lại mã OTP"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          onClick={() => setForgotPasswordStep("forgot_password")}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Quay lại
        </Button>
      </div>
    </div>
  );

  // Render forgot password completion message
  const renderForgotPasswordCompletionMessage = () => (
    <div className="w-full text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Đặt lại mật khẩu thành công!
      </h1>
      <p className="text-gray-600 mb-6">
        Mật khẩu của bạn đã được thay đổi thành công.
      </p>

      <Button
        onClick={() => (window.location.href = ROUTES.SIGN_IN)}
        className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98] mb-4"
      >
        Đến trang đăng nhập
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          setForgotPasswordStep("forgot_password");
          forgotPasswordForm.reset();
          resetPasswordForm.reset();
          setForgotPasswordEmail("");
        }}
        className="w-full"
      >
        Đặt lại mật khẩu khác
      </Button>
    </div>
  );

  return (
    <div className="w-full">
      {formType === "SIGN_UP" ? (
        <>
          {signUpStep === "registration" && renderRegistrationForm()}
          {signUpStep === "otp_verification" && renderOTPForm()}
          {signUpStep === "completed" && renderCompletionMessage()}
        </>
      ) : formType === "FORGOT_PASSWORD" ? (
        <>
          {forgotPasswordStep === "forgot_password" &&
            renderForgotPasswordForm()}
          {forgotPasswordStep === "reset_password" && renderResetPasswordForm()}
          {forgotPasswordStep === "completed" &&
            renderForgotPasswordCompletionMessage()}
        </>
      ) : (
        renderSignInForm()
      )}

      {/* Footer links - only show for registration and sign in, not during OTP or completion */}
      {(formType === "SIGN_IN" || signUpStep === "registration") && (
        <div className="mt-6 text-center">
          {formType === "SIGN_IN" ? (
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                href={ROUTES.SIGN_UP}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          ) : (
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href={ROUTES.SIGN_IN}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthForm;
