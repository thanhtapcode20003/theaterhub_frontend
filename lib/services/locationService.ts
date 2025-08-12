import { get, post } from "@/lib/api";
import { API_ENDPOINTS } from "../config";
// Location types
export interface Location {
  id: number;
  name: string;
  location: string;
  description: string;
  map_url: string;
  event_id?: number;
}

export interface CreateLocationRequest {
  name: string;
  location: string;
  description: string;
  map_url: string;
}

export interface LocationResponse {
  success: boolean;
  message: string;
  location: Location;
}

// API endpoints

/**
 * Get all locations
 */
export const getLocations = async (): Promise<Location[]> => {
  const response = await get<Location[]>(API_ENDPOINTS.LOCATIONS.LIST);
  return response.success && response.data ? response.data : [];
};

export const getLocationById = async (id: number): Promise<Location | null> => {
  const response = await get<LocationResponse>(
    `${API_ENDPOINTS.LOCATIONS.DETAIL}/${id}`
  );
  return response.success && response.data ? response.data.location : null;
};

/**
 * Create a new location
 */
export const createLocation = async (
  locationData: CreateLocationRequest
): Promise<Location | string> => {
  try {
    const response = await post<LocationResponse>(
      API_ENDPOINTS.LOCATIONS.CREATE,
      locationData
    );

    if (response.success && response.data) {
      return response.data.location;
    }

    return response.data?.message || "Tạo địa điểm thất bại";
  } catch (error) {
    console.error("Failed to create location:", error);
    return error instanceof Error
      ? error.message
      : "Có lỗi xảy ra khi tạo địa điểm";
  }
};
