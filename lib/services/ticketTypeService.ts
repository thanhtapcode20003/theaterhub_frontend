import { API_ENDPOINTS } from "../config";
import { get, post, patch, remove } from "../api";

export interface Ticket {
  ticket_type_id: number;
  price: string;
  quantity: number;
}

export interface ZonedTicket {
  ticket_type_id: number;
  type_name: string;
  price: string;
  quantity: number;
}

export interface Seat {
  seat_id: number;
  seat_row: string;
  seat_number: number;
  seat_type_code: string;
  seat_type_name: string;
  price: string;
  status: "available" | "paid" | "selected" | "disabled";
}

export interface Showtime {
  showtime_id: number;
  start_time: string;
  location_name: string;
  location_address: string;
  tickets: Ticket[];
}

export interface ZonedShowtime {
  showtime_id: number;
  start_time: string;
  location_name: string;
  location_address: string;
  ticket_types: ZonedTicket[];
}

export interface GeneralTicketTypesResponse {
  event_id: string;
  showtimes: Showtime[];
}

export interface ZonedTicketTypesResponse {
  event_id: string;
  showtimes: ZonedShowtime[];
}

export interface SeatedTicketTypesResponse {
  success: boolean;
  seats: Seat[];
}

export interface TicketTypesResponse {
  event_id: string;
  showtimes: Showtime[];
}

export const getPublicZonedTicketTypes = async (
  id: number
): Promise<ZonedTicketTypesResponse | null> => {
  try {
    const response = await get<ZonedTicketTypesResponse>(
      API_ENDPOINTS.SHOWTIMES.LIST_PUBLIC_ZONED_TICKET_TYPES(id)
    );
    return response.success && response.data ? response.data : null;
  } catch (error) {
    console.error("Error fetching zoned ticket types:", error);
    return null;
  }
};

export const getPublicGeneralTicketTypes = async (
  id: number
): Promise<GeneralTicketTypesResponse | null> => {
  try {
    const response = await get<GeneralTicketTypesResponse>(
      API_ENDPOINTS.SHOWTIMES.LIST_PUBLIC_GENERAL_TICKET_TYPES(id)
    );
    return response.success && response.data ? response.data : null;
  } catch (error) {
    console.error("Error fetching general ticket types:", error);
    return null;
  }
};

export const getPublicSeatedTicketTypes = async (
  showtimeId: number
): Promise<SeatedTicketTypesResponse | null> => {
  try {
    const response = await get<SeatedTicketTypesResponse>(
      API_ENDPOINTS.SHOWTIMES.LIST_PUBLIC_SEATED_TICKET_TYPES(showtimeId)
    );
    return response.success && response.data ? response.data : null;
  } catch (error) {
    console.error("Error fetching seated ticket types:", error);
    return null;
  }
};
