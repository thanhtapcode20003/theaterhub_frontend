// Showtime Types
export interface Showtime {
  showtime_id: number;
  event_id: number;
  location_id: number;
  location_name?: string;
  start_time: string; // DATETIME
  location?: import("./locations").Location;
  seat_prices?: SeatPrice[];
  ticket_types?: TicketType[];
}

// Seat Price Types
export interface SeatPrice {
  seat_price_id: number;
  showtime_id: number;
  seat_type_code: string;
  price: string; // DECIMAL(10,2)
  showtime?: Showtime;
  seat_type?: import("./seats").SeatType;
}

// Ticket Type Types
export interface TicketType {
  ticket_type_id: number;
  showtime_id: number;
  type_name?: string; // nullable for general events
  price: string; // DECIMAL(10,2)
  quantity: number;
  showtime?: Showtime;
}

// Showtime Request Types
export interface CreateShowtimeRequest {
  event_id: number;
  location_id: number;
  start_time: string;
}

export interface UpdateShowtimeRequest {
  location_id?: number;
  start_time?: string;
}

// Seat Price Request Types
export interface CreateSeatPriceRequest {
  showtime_id: number;
  seat_type_code: string;
  price: number;
}

export interface UpdateSeatPriceRequest {
  price?: number;
}

// Ticket Type Request Types
export interface CreateTicketTypeRequest {
  showtime_id: number;
  type_name?: string;
  price: number;
  quantity: number;
}

export interface UpdateTicketTypeRequest {
  type_name?: string;
  price?: number;
  quantity?: number;
}

// Showtime Response Types
export interface ShowtimesResponse {
  success: boolean;
  data: Showtime[];
  message?: string;
}

export interface ShowtimeResponse {
  success: boolean;
  data: Showtime;
  message?: string;
}

// Seat Price Response Types
export interface SeatPricesResponse {
  success: boolean;
  data: SeatPrice[];
  message?: string;
}

export interface SeatPriceResponse {
  success: boolean;
  data: SeatPrice;
  message?: string;
}

// Ticket Type Response Types
export interface TicketTypesResponse {
  success: boolean;
  data: TicketType[];
  message?: string;
}

export interface TicketTypeResponse {
  success: boolean;
  data: TicketType;
  message?: string;
}
