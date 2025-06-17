// Main Types Export File
// This file re-exports all types for easy importing

// Authentication Types
export * from "./auth";

// Common/Shared Types (export first to avoid conflicts)
export * from "./common";

// Theater, Room, Seat, and Showtime Types
export * from "./theater";

// Event Types
export * from "./events";

// Ticket and Payment Types
export * from "./tickets";

// Type Guards
export const isUser = (obj: any): obj is import("./auth").User => {
  return (
    obj && typeof obj.user_id === "number" && typeof obj.email === "string"
  );
};

export const isEvent = (obj: any): obj is import("./events").Event => {
  return (
    obj && typeof obj.event_id === "number" && typeof obj.title === "string"
  );
};

export const isTicket = (obj: any): obj is import("./tickets").Ticket => {
  return (
    obj &&
    typeof obj.ticket_id === "number" &&
    typeof obj.showtime_id === "number"
  );
};

// Utility type combinations
export type EntityWithId = {
  [K in string as `${K}_id`]: number;
};

export type TimestampedEntity = {
  created_at: string;
  updated_at?: string;
};

export type SoftDeletableEntity = {
  deleted_at?: string;
  is_deleted?: boolean;
};

// Common entity patterns
export type BaseEntity = EntityWithId & TimestampedEntity;
export type DeletableEntity = BaseEntity & SoftDeletableEntity;
