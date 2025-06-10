import { apiClient, TokenManager } from "../client";
import type {
  AuthResponse,
  SignInFormData,
  SignUpFormData,
  User,
} from "../types";

class AuthService {
  private readonly endpoint = "auth";

  /**
   * Sign in user
   */
  async signIn(data: SignInFormData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.endpoint}/sign-in`,
      data
    );

    // Store tokens after successful login
    TokenManager.setToken(response.data.token);
    TokenManager.setRefreshToken(response.data.refreshToken);

    return response.data;
  }

  /**
   * Sign up user
   */
  async signUp(data: SignUpFormData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.endpoint}/sign-up`,
      data
    );

    // Store tokens after successful registration
    TokenManager.setToken(response.data.token);
    TokenManager.setRefreshToken(response.data.refreshToken);

    return response.data;
  }

  /**
   * Send email verification code
   */
  async sendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${this.endpoint}/send-verification`,
      { email }
    );
    return response.data;
  }

  /**
   * Verify email with code
   */
  async verifyEmail(
    email: string,
    code: string
  ): Promise<{ verified: boolean }> {
    const response = await apiClient.post<{ verified: boolean }>(
      `${this.endpoint}/verify-email`,
      { email, code }
    );
    return response.data;
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        await apiClient.post(`${this.endpoint}/sign-out`, { refreshToken });
      }
    } finally {
      // Always clear tokens, even if API call fails
      TokenManager.clearTokens();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<{
      token: string;
      refreshToken: string;
    }>(`${this.endpoint}/refresh`, { refreshToken });

    // Update stored tokens
    TokenManager.setToken(response.data.token);
    TokenManager.setRefreshToken(response.data.refreshToken);

    return response.data;
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${this.endpoint}/forgot-password`,
      { email }
    );
    return response.data;
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${this.endpoint}/reset-password`,
      data
    );
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = TokenManager.getToken();
    return token !== null && !TokenManager.isTokenExpired(token);
  }

  /**
   * Get current user from token
   */
  getCurrentUserFromToken(): User | null {
    const token = TokenManager.getToken();
    if (!token || TokenManager.isTokenExpired(token)) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user || null;
    } catch {
      return null;
    }
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<User> {
    const response = await apiClient.get<User>(`${this.endpoint}/me`);
    return response.data;
  }
}

// Export singleton instance
export const authService = new AuthService();
