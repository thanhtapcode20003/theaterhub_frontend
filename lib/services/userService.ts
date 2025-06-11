interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

import { get, post, put, remove } from "../api";

export const getUsers = async (): Promise<User[]> => {
  const response = await get<User[]>("/users");
  return response.success ? response.data || [] : [];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const response = await get<User>(`/users/${id}`);
  return response.success ? response.data || null : null;
};

export const createUser = async (user: User): Promise<User | string> => {
  const response = await post<User>("/users", user);
  return response.success ? response.data || "Create failed" : "Create failed";
};

export const updateUser = async (
  id: string,
  values: Partial<User>
): Promise<User | string> => {
  const response = await put<User>(`/users/${id}`, values);
  return response.success ? response.data || "Update failed" : "Update failed";
};

export const deleteUser = async (id: string): Promise<boolean | string> => {
  const response = await remove<User>(`/users/${id}`);
  return response.success ? true : response.error || "Delete failed";
};
