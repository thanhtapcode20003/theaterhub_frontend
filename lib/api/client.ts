import { z } from "zod";

// Types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:7007/api/",
  timeout: 10000,
  retries: 3,
} as const;

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.retries = config.retries;
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await this.request<{
        token: string;
        refreshToken: string;
      }>("auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.success) {
        TokenManager.setToken(response.data.token);
        TokenManager.setRefreshToken(response.data.refreshToken);
        return response.data.token;
      }
    } catch (error) {
      TokenManager.clearTokens();
    }

    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {},
    attempt = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    // Prepare headers with proper typing
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const customHeaders = options.headers || {};
    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...customHeaders,
    };

    // Add auth header if token exists and not expired
    if (token && !TokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    } else if (token && TokenManager.isTokenExpired(token)) {
      // Try to refresh token
      const newToken = await this.refreshToken();
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(options.timeout || this.timeout),
    };

    try {
      const response = await fetch(url, config);

      // Handle different response statuses
      if (response.status === 401) {
        // Unauthorized - try to refresh token
        const newToken = await this.refreshToken();
        if (newToken && attempt === 1) {
          // Retry with new token
          return this.request<T>(endpoint, options, attempt + 1);
        } else {
          TokenManager.clearTokens();
          // Redirect to login or emit event
          if (typeof window !== "undefined") {
            window.location.href = "/sign-in";
          }
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError({
          message: data.message || `HTTP ${response.status}`,
          status: response.status,
          code: data.code,
          details: data,
        });
      }

      return {
        data,
        success: true,
        message: data.message,
      };
    } catch (error: unknown) {
      // Retry logic for network errors
      if (
        attempt < (options.retries || this.retries) &&
        (error instanceof TypeError || (error as any)?.name === "NetworkError")
      ) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, attempt + 1);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError({
        message: error instanceof Error ? error.message : "Network error",
        status: 0,
        details: error,
      });
    }
  }

  // HTTP Methods
  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", ...config });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", ...config });
  }

  // File upload method
  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: Omit<RequestConfig, "headers">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
      ...config,
    });
  }
}

// Custom Error Class
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor({
    message,
    status,
    code,
    details,
  }: {
    message: string;
    status: number;
    code?: string;
    details?: any;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(API_CONFIG);
export { TokenManager };
