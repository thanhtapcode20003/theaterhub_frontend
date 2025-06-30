// Location Types
export interface Location {
  location_id: number;
  name: string;
  location?: string; // address/location text
  description?: string;
  map_url?: string;
  seats?: import("./seats").Seat[];
  showtimes?: import("./showtimes").Showtime[];
}

// Location Request Types
export interface CreateLocationRequest {
  name: string;
  location?: string;
  description?: string;
  map_url?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  location?: string;
  description?: string;
  map_url?: string;
}

// Location Response Types
export interface LocationsResponse {
  success: boolean;
  data: Location[];
  message?: string;
}

export interface LocationResponse {
  success: boolean;
  data: Location;
  message?: string;
}
