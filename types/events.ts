import type { Organizer } from "./organizers";
import type { EventCategory } from "./categories";
import type { Showtime } from "./showtimes";

// Description Content Types
export interface EventDescriptionContent {
  type: "text" | "image";
  value: string;
}

// Event Types
export interface Event {
  event_id: number;
  title: string;
  description?: EventDescriptionContent[]; // Array of description content objects
  event_type: "general" | "zoned" | "seated";
  custom_location?: string;
  poster_url?: string;
  organizer_id?: number;
  category_id?: number;
  status: "draft" | "pending" | "upcoming" | "ongoing" | "ended" | "canceled";
  created_at: string;
  organizer?: Organizer;
  category?: EventCategory;
  showtimes?: Showtime[];
}

// Event Request Types
export interface CreateEventRequest {
  title: string;
  description?: EventDescriptionContent[];
  event_type: "general" | "zoned" | "seated";
  custom_location?: string;
  poster_url?: string;
  organizer_id?: number;
  category_id?: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: EventDescriptionContent[];
  event_type?: "general" | "zoned" | "seated";
  custom_location?: string;
  poster_url?: string;
  organizer_id?: number;
  category_id?: number;
  status?: "draft" | "pending" | "upcoming" | "ongoing" | "ended" | "canceled";
}

export interface EventFilters {
  category_id?: number;
  organizer_id?: number;
  status?: "draft" | "pending" | "upcoming" | "ongoing" | "ended" | "canceled";
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
