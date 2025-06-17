import { get, post } from "../api";
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from "../config";
import {
  User,
  RegisterRequest,
  LoginRequest,
  ResendOTPRequest,
  AuthResponse,
  ApiResponse,
} from "../../types";

export class AuthService {
  private static readonly TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
  private static readonly USER_KEY = STORAGE_KEYS.USER_DATA;

  /**
   * Register a new user with email and password
   * POST /api/email-auth/register
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      console.log(response);
      if (!response.success) {
        throw new Error(response.error || "Registration failed");
      }

      return response.data as AuthResponse;
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }

  /**
   * Verify email with OTP code
   * GET /api/email-auth/verify?code=
   */
  static async verifyEmail(code: string): Promise<AuthResponse> {
    try {
      const response = await get<AuthResponse>(
        `${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?code=${code}`
      );
      console.log(response);
      if (!response.success) {
        throw new Error(response.error || "Email verification failed");
      }

      const authResponse = response.data as AuthResponse;

      // Store user data and token if verification is successful
      if (authResponse.token) {
        this.setToken(authResponse.token);
      }
      if (authResponse.user) {
        this.setUser(authResponse.user);
      }

      return authResponse;
    } catch (error: any) {
      throw new Error(error.message || "Email verification failed");
    }
  }

  /**
   * Resend OTP to email
   * POST /api/email-auth/resend
   */
  static async resendOTP(data: ResendOTPRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(
        API_ENDPOINTS.AUTH.RESEND_OTP,
        data
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to resend OTP");
      }

      return response.data as AuthResponse;
    } catch (error: any) {
      throw new Error(error.message || "Failed to resend OTP");
    }
  }

  /**
   * Login with email and password
   * POST /api/email-auth/login
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (!response.success) {
        throw new Error(response.error || "Login failed");
      }

      const authResponse = response.data as AuthResponse;

      // Store authentication data
      if (authResponse.token) {
        this.setToken(authResponse.token);
      }
      if (authResponse.user) {
        this.setUser(authResponse.user);
      }

      return authResponse;
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }

  /**
   * Logout user and clear stored data
   */
  static logout(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /**
   * Get stored authentication token
   */
  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Set authentication token
   */
  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Get stored user data
   */
  static getUser(): User | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Set user data
   */
  static setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user email is verified
   */
  static isEmailVerified(): boolean {
    const user = this.getUser();
    return user?.email_verified || false;
  }

  /**
   * Check if user account is locked
   */
  static isAccountLocked(): boolean {
    const user = this.getUser();
    return user?.is_locked || false;
  }

  /**
   * Get user role
   */
  static getUserRole(): "admin" | "staff" | "customer" | null {
    const user = this.getUser();
    return user?.role || null;
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: "admin" | "staff" | "customer"): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    return this.hasRole("admin");
  }

  /**
   * Check if user is staff
   */
  static isStaff(): boolean {
    return this.hasRole("staff");
  }

  /**
   * Google OAuth login redirect
   */
  static initiateGoogleLogin(): void {
    if (typeof window !== "undefined") {
      window.location.href = `${API_CONFIG.OAUTH_BASE_URL}${API_ENDPOINTS.OAUTH.GOOGLE}`;
    }
  }

  /**
   * Get current user ID
   */
  static getUserId(): number | null {
    const user = this.getUser();
    return user?.user_id || null;
  }

  /**
   * Refresh user data (call this after profile updates)
   */
  static async refreshUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      // You might want to add a /me endpoint to get current user data
      // const response = await get<{ user: User }>('/auth/me');
      // if (response.success && response.data?.user) {
      //   this.setUser(response.data.user);
      //   return response.data.user;
      // }

      return this.getUser();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  }
}

export default AuthService;
