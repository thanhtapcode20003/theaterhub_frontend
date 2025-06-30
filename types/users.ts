// Authentication Types
export interface User {
  user_id: number;
  avatar?: string;
  name?: string; // nullable in DB
  email?: string; // nullable in DB
  phone?: string; // UNIQUE in DB
  password?: string; // only for requests, not responses
  google_id?: string;
  role: "admin" | "staff" | "customer";
  provider: "local" | "google";
  email_verified: boolean;
  is_locked: boolean;
  created_at: string;
}

// Authentication Request Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

// Authentication Response Types
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: User;
    token?: string;
  };
  token?: string;
  user?: User;
}

export interface EmailVerificationResponse {
  success: boolean;
  message?: string;
  verified?: boolean;
}

// OAuth Types
export interface GoogleOAuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface OAuthCallbackParams {
  success: string | null;
  token: string | null;
  user: string | null;
  message: string | null;
}

// Email Verification Types
export interface EmailVerification {
  id: number;
  user_id: number;
  verification_code: string;
  expired_at: string;
  is_used: boolean;
}

export interface VerifyEmailRequest {
  verification_code: string;
}

// OTP Types
export interface OTPLog {
  otp_id: number;
  phone: string;
  otp_code: string;
  expired_at: string;
  is_used: boolean;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshAuth: () => void;
  isEmailVerified: () => boolean;
  isAccountLocked: () => boolean;
  getUserRole: () => "admin" | "staff" | "customer" | null;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  getUserId: () => number | null;
}
