// Organizer Types
export interface Organizer {
  organizer_id: number;
  name: string;
  logo_url?: string;
  description?: string;
}

// Organizer Request Types
export interface CreateOrganizerRequest {
  name: string;
  logo_url?: string;
  description?: string;
}

export interface UpdateOrganizerRequest {
  name?: string;
  logo_url?: string;
  description?: string;
}

// Organizer Response Types
export interface OrganizersResponse {
  success: boolean;
  data: Organizer[];
  message?: string;
}

export interface OrganizerResponse {
  success: boolean;
  data: Organizer;
  message?: string;
}
