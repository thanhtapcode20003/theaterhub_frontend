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
import { PasswordInput } from "@/components/ui/password-input";
import { showToast } from "@/components/ui/toast";
import ROUTES from "@/constants/routes";
import AuthService from "@/lib/services/authService";
import { SignUpSchema, OTPVerificationSchema } from "@/lib/validations";
import { RegisterRequest, AuthResponse } from "@/types";
import { Loader2 } from "lucide-react";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

type SignUpStep = "registration" | "otp_verification" | "completed";

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  // Sign-up specific state
  const [signUpStep, setSignUpStep] = useState<SignUpStep>("registration");
  const [registrationData, setRegistrationData] =
    useState<RegisterRequest | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Form setup
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // OTP form for verification step
  const otpForm = useForm<z.infer<typeof OTPVerificationSchema>>({
    resolver: zodResolver(OTPVerificationSchema),
    defaultValues: { code: "" },
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

  // Handle registration form submission
  const handleRegistrationSubmit: SubmitHandler<T> = async (data) => {
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
            name={fieldName as Path<T>}
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
            name={fieldName as Path<T>}
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
      </form>
    </Form>
  );

  return (
    <div className="w-full">
      {formType === "SIGN_UP" ? (
        <>
          {signUpStep === "registration" && renderRegistrationForm()}
          {signUpStep === "otp_verification" && renderOTPForm()}
          {signUpStep === "completed" && renderCompletionMessage()}
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
