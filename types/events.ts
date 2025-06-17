import { Showtime } from "./theater";

// Event Types
export interface Event {
  event_id: number;
  title: string;
  description: Record<string, any>; // JSON field
  event_type: "general" | "zoned" | "seated";
  custom_location?: string;
  poster_url?: string;
  organizer_id?: number;
  category_id?: number;
  status: "draft" | "upcoming" | "ongoing" | "ended" | "canceled";
  created_at: string;
  organizer?: Organizer;
  category?: EventCategory;
  showtimes?: Showtime[];
}

export interface Organizer {
  organizer_id: number;
  name: string;
  logo_url?: string;
  description?: string;
}

export interface EventCategory {
  category_id: number;
  category_name: string;
  slug: string;
}

// Event Request Types
export interface CreateEventRequest {
  title: string;
  description: Record<string, any>;
  event_type: "general" | "zoned" | "seated";
  custom_location?: string;
  poster_url?: string;
  organizer_id?: number;
  category_id?: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: Record<string, any>;
  event_type?: "general" | "zoned" | "seated";
  custom_location?: string;
  poster_url?: string;
  organizer_id?: number;
  category_id?: number;
  status?: "draft" | "upcoming" | "ongoing" | "ended" | "canceled";
}

export interface EventFilters {
  category_id?: number;
  organizer_id?: number;
  status?: "draft" | "upcoming" | "ongoing" | "ended" | "canceled";
  event_type?: "general" | "zoned" | "seated";
  search?: string;
}

// Event Response Types
export interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface EventResponse {
  success: boolean;
  data: Event;
  message?: string;
}

// Organizer Types
export interface CreateOrganizerRequest {
  name: string;
  logo_url?: string;
  description?: string;
}

export interface UpdateOrganizerRequest {
  name?: string;
  logo_url?: string;
  description?: string;
}

// Event Category Types
export interface CreateEventCategoryRequest {
  category_name: string;
  slug: string;
}

export interface UpdateEventCategoryRequest {
  category_name?: string;
  slug?: string;
}
