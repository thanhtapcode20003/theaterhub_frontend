// Seat Type Types
export interface SeatType {
  seat_type_code: string; // PRIMARY KEY
  seat_type_name: string;
}

// Seat Types
export interface Seat {
  seat_id: number;
  location_id: number;
  seat_row?: string; // CHAR(2)
  seat_number?: number;
  seat_type_code?: string;
  location?: import("./locations").Location;
  seat_type?: SeatType;
}

// Seat Request Types
export interface CreateSeatRequest {
  location_id: number;
  seat_row?: string;
  seat_number?: number;
  seat_type_code?: string;
}

export interface UpdateSeatRequest {
  seat_row?: string;
  seat_number?: number;
  seat_type_code?: string;
}

// Seat Type Request Types
export interface CreateSeatTypeRequest {
  seat_type_code: string;
  seat_type_name: string;
}

export interface UpdateSeatTypeRequest {
  seat_type_name?: string;
}

// Seat Response Types
export interface SeatsResponse {
  success: boolean;
  data: Seat[];
  message?: string;
}

export interface SeatResponse {
  success: boolean;
  data: Seat;
  message?: string;
}

// Seat Type Response Types
export interface SeatTypesResponse {
  success: boolean;
  data: SeatType[];
  message?: string;
}

export interface SeatTypeResponse {
  success: boolean;
  data: SeatType;
  message?: string;
}
