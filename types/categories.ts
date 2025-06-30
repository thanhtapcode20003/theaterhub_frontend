// Event Category Types
export interface EventCategory {
  category_id: number;
  category_name: string;
  slug: string;
}

// Event Category Request Types
export interface CreateEventCategoryRequest {
  category_name: string;
  slug: string;
}

export interface UpdateEventCategoryRequest {
  category_name?: string;
  slug?: string;
}

// Event Category Response Types
export interface EventCategoriesResponse {
  success: boolean;
  data: EventCategory[];
  message?: string;
}

export interface EventCategoryResponse {
  success: boolean;
  data: EventCategory;
  message?: string;
}
