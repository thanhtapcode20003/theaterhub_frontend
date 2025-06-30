import { API_ENDPOINTS } from "../config";
import { get, patch, post, remove } from "../api";
import { User } from "../../types";

export const getUsers = async (): Promise<User[]> => {
  const response = await get<User[]>(API_ENDPOINTS.USERS.LIST);
  return response.success ? response.data || [] : [];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const response = await get<User>(`${API_ENDPOINTS.USERS.DETAIL}/${id}`);
  return response.success ? response.data || null : null;
};

export const createUser = async (user: User): Promise<User | string> => {
  const response = await post<User>(API_ENDPOINTS.USERS.CREATE, user);
  return response.success ? response.data || "Create failed" : "Create failed";
};

export const updateUser = async (
  id: string,
  values: Partial<User>
): Promise<User | string> => {
  const response = await patch<User>(
    `${API_ENDPOINTS.USERS.UPDATE}/${id}`,
    values
  );
  return response.success ? response.data || "Update failed" : "Update failed";
};

export const deleteUser = async (id: string): Promise<boolean | string> => {
  const response = await remove<User>(`${API_ENDPOINTS.USERS.DELETE}/${id}`);
  return response.success ? true : response.error || "Delete failed";
};
