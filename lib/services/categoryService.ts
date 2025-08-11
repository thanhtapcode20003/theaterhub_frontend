import { get } from "../api";
import { API_ENDPOINTS } from "../config";
import { EventCategoriesResponse } from "@/types";

export const getCategories = async (): Promise<EventCategoriesResponse> => {
  const response = await get<EventCategoriesResponse>(
    API_ENDPOINTS.EVENT_CATEGORIES.LIST
  );
  // The get function wraps the response in ApiResponse, but the actual API returns EventCategoriesResponse
  // So we need to return the data from the ApiResponse wrapper
  if (response.success && response.data) {
    return response.data;
  } else {
    // Return a default structure if the API call fails
    return {
      success: false,
      data: [],
      message: response.error || "Failed to fetch categories",
    };
  }
};
