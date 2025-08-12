import { API_ENDPOINTS } from "../config";
import { get, post, patch, remove } from "../api";
import {
  EventCategory,
  CreateEventCategoryRequest,
  UpdateEventCategoryRequest,
  EventCategoriesResponse,
  EventCategoryResponse,
} from "../../types/categories";

// Get all event categories
export const getEventCategories = async (): Promise<EventCategory[]> => {
  const response = await get<EventCategoriesResponse>(
    API_ENDPOINTS.EVENT_CATEGORIES.LIST
  );
  return response.success && response.data ? response.data.data || [] : [];
};

// Get event category by ID
export const getEventCategoryById = async (
  id: number
): Promise<EventCategory | null> => {
  const response = await get<EventCategoryResponse>(
    `${API_ENDPOINTS.EVENT_CATEGORIES.DETAIL}/${id}`
  );
  return response.success && response.data ? response.data.data || null : null;
};

// Create event category
export const createEventCategory = async (
  category: CreateEventCategoryRequest
): Promise<EventCategory | string> => {
  const response = await post<EventCategoryResponse>(
    API_ENDPOINTS.EVENT_CATEGORIES.CREATE,
    category
  );
  return response.success && response.data
    ? response.data.data
    : response.error || "Create event category failed";
};

// Update event category
export const updateEventCategory = async (
  id: number,
  updates: UpdateEventCategoryRequest
): Promise<EventCategory | string> => {
  const response = await patch<EventCategoryResponse>(
    `${API_ENDPOINTS.EVENT_CATEGORIES.UPDATE}/${id}`,
    updates
  );
  return response.success && response.data
    ? response.data.data
    : response.error || "Update event category failed";
};

// Delete event category
export const deleteEventCategory = async (
  id: number
): Promise<boolean | string> => {
  const response = await remove<{ success: boolean; message?: string }>(
    `${API_ENDPOINTS.EVENT_CATEGORIES.DELETE}/${id}`
  );
  return response.success
    ? true
    : response.error || "Delete event category failed";
};

// Utility function to generate slug from category name
export const generateSlug = (categoryName: string): string => {
  return categoryName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

// Create event category with auto-generated slug
export const createEventCategoryWithAutoSlug = async (
  categoryName: string
): Promise<EventCategory | string> => {
  const slug = generateSlug(categoryName);
  return createEventCategory({ category_name: categoryName, slug });
};

// Update event category with auto-generated slug
export const updateEventCategoryWithAutoSlug = async (
  id: number,
  categoryName: string
): Promise<EventCategory | string> => {
  const slug = generateSlug(categoryName);
  return updateEventCategory(id, { category_name: categoryName, slug });
};

// Get categories by name search (client-side filtering)
export const searchEventCategories = async (
  searchTerm: string
): Promise<EventCategory[]> => {
  const categories = await getEventCategories();
  return categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
