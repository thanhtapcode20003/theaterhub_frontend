import { post } from "@/lib/api";
import { API_ENDPOINTS } from "../config";

// Showtime types
export interface Showtime {
  id: number;
  location_id: number;
  start_time: string;
  event_id: number;
}

export interface CreateShowtimeRequest {
  location_id: number;
  start_time: string;
}

export interface ShowtimeResponse {
  success: boolean;
  message: string;
  showtime?: Showtime;
}

/**
 * Create a new showtime for an event
 */
export const createShowtime = async (
  eventId: number,
  showtimeData: CreateShowtimeRequest
): Promise<Showtime | string> => {
  try {
    const response = await post<ShowtimeResponse>(
      `${API_ENDPOINTS.EVENTS.DETAIL}/${eventId}/showtimes`,
      showtimeData
    );

    if (response.success && response.data) {
      return response.data.showtime || (response.data as unknown as Showtime);
    }

    return response.data?.message || "Tạo thời gian thất bại";
  } catch (error) {
    console.error("Failed to create showtime:", error);
    return error instanceof Error
      ? error.message
      : "Có lỗi xảy ra khi tạo thời gian";
  }
};
