// Re-export types from separate files for backward compatibility
export type {
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationsResponse,
  LocationResponse,
} from "./locations";
export type {
  Seat,
  SeatType,
  CreateSeatRequest,
  UpdateSeatRequest,
  CreateSeatTypeRequest,
  UpdateSeatTypeRequest,
  SeatsResponse,
  SeatResponse,
  SeatTypesResponse,
  SeatTypeResponse,
} from "./seats";
export type {
  Showtime,
  SeatPrice,
  TicketType,
  CreateShowtimeRequest,
  UpdateShowtimeRequest,
  CreateSeatPriceRequest,
  UpdateSeatPriceRequest,
  CreateTicketTypeRequest,
  UpdateTicketTypeRequest,
  ShowtimesResponse,
  ShowtimeResponse,
  SeatPricesResponse,
  SeatPriceResponse,
  TicketTypesResponse,
  TicketTypeResponse,
} from "./showtimes";

// Note: This file maintains backward compatibility for imports that still use "./theater"
// All types have been moved to their respective dedicated files:
// - locations.ts: Location-related types
// - seats.ts: Seat and SeatType-related types
// - showtimes.ts: Showtime, SeatPrice, and TicketType-related types
