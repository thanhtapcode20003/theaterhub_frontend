import { API_ENDPOINTS } from "../config";
import { get, post, patch, remove } from "../api";

export interface Ticket {
  ticket_type_id: number;
  price: string;
  quantity: number;
}

export interface Showtime {
  showtime_id: number;
  start_time: string;
  location_name: string;
  location_address: string;
  tickets: Ticket[];
}

export interface TicketTypesResponse {
  event_id: string;
  showtimes: Showtime[];
}

export const getPublicZonedTicketTypes = async (
  id: number
): Promise<TicketTypesResponse | null> => {
  try {
    const response = await get<TicketTypesResponse>(
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
): Promise<TicketTypesResponse | null> => {
  try {
    const response = await get<TicketTypesResponse>(
      API_ENDPOINTS.SHOWTIMES.LIST_PUBLIC_GENERAL_TICKET_TYPES(id)
    );
    return response.success && response.data ? response.data : null;
  } catch (error) {
    console.error("Error fetching general ticket types:", error);
    return null;
  }
};
