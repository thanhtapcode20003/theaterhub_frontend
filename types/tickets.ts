import type { User } from "./users";
import type { Showtime, TicketType } from "./showtimes";
import type { Seat } from "./seats";

// Ticket Types
export interface Ticket {
  ticket_id: number;
  showtime_id: number;
  seat_id?: number;
  ticket_type_id?: number;
  user_id?: number;
  status: "booked" | "paid" | "cancelled";
  booked_at: string;
  showtime?: Showtime;
  seat?: Seat;
  ticket_type?: TicketType;
  user?: User;
  payment?: Payment;
}

// Payment Types
export interface Payment {
  payment_id: number;
  ticket_id?: number;
  amount: number;
  method: string;
  status: "success" | "failed" | "pending";
  paid_at: string;
  ticket?: Ticket;
}

// Request Types
export interface CreateTicketRequest {
  showtime_id: number;
  seat_id?: number;
  ticket_type_id?: number;
  user_id?: number;
}

export interface UpdateTicketRequest {
  status?: "booked" | "paid" | "cancelled";
}

export interface CreatePaymentRequest {
  ticket_id: number;
  amount: number;
  method: string;
}

export interface BookingRequest {
  showtime_id: number;
  seats?: number[]; // For seated events
  ticket_types?: {
    // For general events
    ticket_type_id: number;
    quantity: number;
  }[];
}

// Response Types
export interface TicketsResponse {
  success: boolean;
  data: {
    tickets: Ticket[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface TicketResponse {
  success: boolean;
  data: Ticket;
  message?: string;
}

export interface PaymentResponse {
  success: boolean;
  data: Payment;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  data: {
    tickets: Ticket[];
    total_amount: number;
    booking_id: string;
  };
  message?: string;
}

// Booking Summary Types
export interface BookingSummary {
  showtime: Showtime;
  seats?: Seat[];
  ticket_types?: {
    type: TicketType;
    quantity: number;
  }[];
  total_amount: number;
  user: User;
}

// Ticket Filters
export interface TicketFilters {
  user_id?: number;
  showtime_id?: number;
  status?: "booked" | "paid" | "cancelled";
  start_date?: string;
  end_date?: string;
}
