import { API_ENDPOINTS } from "../config";
import { get } from "../api";

// Interface for the ticket data structure from the API
export interface MyTicket {
  order_id: number;
  event_title: string;
  seat_row: string | null;
  seat_number: string | null;
  ticket_type_name: string;
  showtime: string;
  location_name: string;
  price: string;
  status: string;
}

// Interface for the ticket detail response
export interface MyTicketDetail {
  order_id: number;
  event_title: string;
  showtime: string;
  location_name: string;
  tickets: Array<{
    seat_row: string | null;
    seat_number: string | null;
    ticket_type_name: string;
    price: string;
  }>;
}

// Get all tickets for the current user
export const getMyTickets = async (): Promise<MyTicket[]> => {
  try {
    const response = await get<MyTicket[]>(API_ENDPOINTS.TICKETS.MY_TICKETS);
    return response.success ? response.data || [] : [];
  } catch (error) {
    console.error("Error fetching my tickets:", error);
    return [];
  }
};

// Get specific ticket detail by order ID
export const getMyTicketDetail = async (orderId: number): Promise<MyTicketDetail | null> => {
  try {
    const response = await get<MyTicketDetail>(`${API_ENDPOINTS.TICKETS.MY_TICKETS}/${orderId}`);
    return response.success ? response.data || null : null;
  } catch (error) {
    console.error("Error fetching ticket detail:", error);
    return null;
  }
};
