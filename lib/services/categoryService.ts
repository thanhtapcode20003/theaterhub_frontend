import { get } from "../api";
import { API_ENDPOINTS } from "../config";
import { EventCategoriesResponse, EventCategory } from "@/types";

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

export const getEventCategoryById = async (
  id: number
): Promise<EventCategoriesResponse | null> => {
  const response = await get<EventCategoriesResponse>(
    `${API_ENDPOINTS.EVENT_CATEGORIES.DETAIL}/${id}`
  );
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

// Get event category by slug
export const getEventCategoryBySlug = async (
  slug: string
): Promise<EventCategory | null> => {
  try {
    // First get all categories
    const categoriesResponse = await getCategories();

    if (categoriesResponse.success && categoriesResponse.data) {
      // Find the category with matching slug
      const category = categoriesResponse.data.find((cat) => cat.slug === slug);
      return category || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
};
