import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email không được để trống." })
    .email({ message: "Vui lòng cung cấp địa chỉ email hợp lệ." }),

  password: z
    .string()
    .min(1, { message: "Mật khẩu không được để trống." })
    .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số.",
    }),
});

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Tên không được để trống." })
      .max(50, { message: "Tên không được vượt quá 50 ký tự." })
      .regex(/^[a-zA-ZÀ-ỹ\s]+$/, {
        message: "Tên chỉ có thể chứa chữ cái và khoảng trắng.",
      }),

    email: z
      .string()
      .min(1, { message: "Email không được để trống." })
      .email({ message: "Vui lòng cung cấp địa chỉ email hợp lệ." }),

    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." })
      .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số.",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "Xác nhận mật khẩu không được để trống." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

// OTP Verification Schema
export const OTPVerificationSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Mã OTP phải có 6 chữ số." })
    .max(6, { message: "Mã OTP phải có 6 chữ số." })
    .regex(/^\d{6}$/, { message: "Mã OTP chỉ được chứa số." }),
});

// Email Verification Schema (for initial step)
export const EmailVerificationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email không được để trống." })
    .email({ message: "Vui lòng cung cấp địa chỉ email hợp lệ." }),
});
