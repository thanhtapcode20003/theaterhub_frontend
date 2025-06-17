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
    LOGOUT: "/email-auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
  },
  // OAuth endpoints
  OAUTH: {
    GOOGLE: "/google",
  },
  // User endpoints
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
  },
  // Events endpoints
  EVENTS: {
    LIST: "/events",
    CREATE: "/events",
    DETAIL: "/events",
    UPDATE: "/events",
    DELETE: "/events",
  },
  // Tickets endpoints
  TICKETS: {
    LIST: "/tickets",
    CREATE: "/tickets",
    DETAIL: "/tickets",
    CANCEL: "/tickets",
  },
  // Theaters endpoints
  THEATERS: {
    LIST: "/theaters",
    DETAIL: "/theaters",
    ROOMS: "/theaters/{id}/rooms",
  },
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
  APP_CONFIG,
  isDevelopment,
  isProduction,
  isTest,
};
