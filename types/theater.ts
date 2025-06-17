// Theater Types
export interface Theater {
  theater_id: number;
  name: string;
  location?: string;
  rooms?: Room[];
}

export interface Room {
  room_id: number;
  theater_id: number;
  name: string;
  theater?: Theater;
  seats?: Seat[];
  showtimes?: Showtime[];
}

// Seat Types
export interface SeatType {
  seat_type_code: string;
  seat_type_name: string;
}

export interface Seat {
  seat_id: number;
  room_id: number;
  seat_row: string;
  seat_number: number;
  seat_type_code: string;
  room?: Room;
  seat_type?: SeatType;
}

// Showtime Types
export interface Showtime {
  showtime_id: number;
  event_id: number;
  room_id?: number;
  start_time: string;
  room?: Room;
  seat_prices?: SeatPrice[];
  ticket_types?: TicketType[];
}

export interface SeatPrice {
  seat_price_id: number;
  showtime_id: number;
  seat_type_code: string;
  price: number;
  showtime?: Showtime;
  seat_type?: SeatType;
}

export interface TicketType {
  ticket_type_id: number;
  showtime_id: number;
  type_name: string;
  price: number;
  quantity: number;
  showtime?: Showtime;
}

// Request Types
export interface CreateTheaterRequest {
  name: string;
  location?: string;
}

export interface UpdateTheaterRequest {
  name?: string;
  location?: string;
}

export interface CreateRoomRequest {
  theater_id: number;
  name: string;
}

export interface UpdateRoomRequest {
  name?: string;
}

export interface CreateShowtimeRequest {
  event_id: number;
  room_id?: number;
  start_time: string;
}

export interface UpdateShowtimeRequest {
  room_id?: number;
  start_time?: string;
}

export interface CreateSeatPriceRequest {
  showtime_id: number;
  seat_type_code: string;
  price: number;
}

export interface CreateTicketTypeRequest {
  showtime_id: number;
  type_name: string;
  price: number;
  quantity: number;
}

// Response Types
export interface TheatersResponse {
  success: boolean;
  data: Theater[];
  message?: string;
}

export interface TheaterResponse {
  success: boolean;
  data: Theater;
  message?: string;
}

export interface RoomsResponse {
  success: boolean;
  data: Room[];
  message?: string;
}

export interface ShowtimesResponse {
  success: boolean;
  data: Showtime[];
  message?: string;
}

// Note: Event and Ticket types are imported where needed to avoid circular dependencies
