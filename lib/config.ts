// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  OAUTH_BASE_URL:
    process.env.NEXT_PUBLIC_OAUTH_URL || "http://localhost:8080/auth",
  TIMEOUT: 30000, // 30 seconds
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/email-auth/register",
    LOGIN: "/email-auth/login",
    VERIFY_EMAIL: "/email-auth/verify",
    RESEND_OTP: "/email-auth/resend",
    // LOGOUT: "/email-auth/logout",
    // REFRESH_TOKEN: "/auth/refresh",
  },
  // OAuth endpoints
  OAUTH: {
    GOOGLE: "/google",
  },
  // User endpoints
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    DETAIL: "/users",
    UPDATE: "/users",
    DELETE: "/users",
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
  },
  // Events endpoints
  EVENTS: {
    LIST: "/events",
    LIST_PUBLIC: "/public/events",
    CREATE: "/events",
    DETAIL: "/events",
    UPDATE: "/events",
    UPDATE_DESCRIPTION: "/events",
    DELETE: "/events",
  },
  // Organizers endpoints
  ORGANIZERS: {
    LIST: "/organizers",
    CREATE: "/organizers",
    DETAIL: "/organizers",
    UPDATE: "/organizers",
    DELETE: "/organizers",
  },
  // Event Categories endpoints
  EVENT_CATEGORIES: {
    LIST: "/event-categories",
    CREATE: "/event-categories",
    DETAIL: "/event-categories",
    UPDATE: "/event-categories",
    DELETE: "/event-categories",
    BY_SLUG: "/event-categories/slug",
  },
  // Tickets endpoints
  TICKETS: {
    LIST: "/tickets",
    CREATE: "/tickets",
    DETAIL: "/tickets",
    CANCEL: "/tickets",
  },
  // Locations endpoints
  LOCATIONS: {
    LIST: "/location",
    CREATE: "/location",
    DETAIL: "/location",
    UPDATE: "/location",
    DELETE: "/location",
    SEATS: "/location/{id}/seats",
  },
  // Showtimes endpoints
  SHOWTIMES: {
    LIST_PUBLIC_GENERAL_TICKET_TYPES: (id: number) =>
      `/public/events/${id}/general-ticket-types`,
    LIST_PUBLIC_ZONED_TICKET_TYPES: (id: number) =>
      `/public/events/${id}/zoned-ticket-types`,
    LIST: "/showtimes",
    CREATE: "/showtimes",
    DETAIL: "/showtimes",
    UPDATE: "/showtimes",
    DELETE: "/showtimes",
  },
  // Showtimes endpoints
  PAYMENT: {
    CREATE_GENERAL_BOOKING: "/bookings/general",
    CREATE_PAYMENT: "/payments/create-link",
  },
} as const;

// App Routes Configuration
export const APP_ROUTES = {
  // Public routes
  HOME: "/",
  EVENTS: "/events",
  EVENT_DETAIL: (id: number) => `/events/${id}`,
  EVENT_BOOKING: (eventId: number, showtimeId: number) =>
    `/events/${eventId}/booking/${showtimeId}`,

  // Auth routes
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",

  // Role-based routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_EVENTS: "/admin/events",
  STAFF_DASHBOARD: "/staff",
  STAFF_EVENTS: "/staff/events",
} as const;

// App Configuration
export const APP_CONFIG = {
  APP_NAME: "TheaterHub",
  VERSION: "1.0.0",
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
} as const;

// Environment check
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

export default {
  API_CONFIG,
  STORAGE_KEYS,
  API_ENDPOINTS,
  APP_ROUTES,
  APP_CONFIG,
  isDevelopment,
  isProduction,
  isTest,
};
