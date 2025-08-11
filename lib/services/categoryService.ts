import { get } from "../api";
import { API_ENDPOINTS } from "../config";
import { EventCategory } from "@/types";

export const getCategories = async (): Promise<EventCategory[]> => {
  const response = await get<EventCategory[]>(
    API_ENDPOINTS.EVENT_CATEGORIES.LIST
  );
  return response.success && response.data ? response?.data : [];
};
