import { apiClient } from "../client";
import type {
  User,
  UpdateUserFormData,
  PaginatedResponse,
  PaginationParams,
} from "../types";
import type { ApiResponse } from "../client";

class UserService {
  private readonly endpoint = "users";

  /**
   * Get all users with pagination and filtering
   */
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const query = queryParams.toString();
    const endpoint = query ? `${this.endpoint}?${query}` : this.endpoint;

    const response = await apiClient.get<PaginatedResponse<User>>(endpoint);
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${this.endpoint}/profile`);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserFormData): Promise<User> {
    const response = await apiClient.put<User>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(data: UpdateUserFormData): Promise<User> {
    const response = await apiClient.put<User>(
      `${this.endpoint}/profile`,
      data
    );
    return response.data;
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.upload<{ avatarUrl: string }>(
      `${this.endpoint}/avatar`,
      formData
    );
    return response.data;
  }

  /**
   * Change user password
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await apiClient.post(`${this.endpoint}/change-password`, data);
  }

  /**
   * Search users by query
   */
  async searchUsers(
    query: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams({
      search: query,
    });

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get<PaginatedResponse<User>>(
      `${this.endpoint}/search?${queryParams.toString()}`
    );
    return response.data;
  }
}

// Export singleton instance
export const userService = new UserService();
