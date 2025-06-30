// Main Types Export File
// This file re-exports all types for easy importing

// User and Authentication Types
export * from "./users";

// Common/Shared Types (export first to avoid conflicts)
export * from "./common";

// Location, Seat, Showtime, and Theater-related Types (separate files)
export * from "./locations";
export * from "./seats";
export * from "./showtimes";
export * from "./theater"; // For backward compatibility

// Event-related Types
export * from "./events";
export * from "./organizers";
export * from "./categories";

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
