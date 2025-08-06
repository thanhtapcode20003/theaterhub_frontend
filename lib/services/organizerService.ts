import { API_ENDPOINTS } from "../config";
import { get, post, patch, remove } from "../api";
import {
  Organizer,
  CreateOrganizerRequest,
  UpdateOrganizerRequest,
  OrganizersResponse,
  OrganizerResponse,
} from "../../types/organizers";

// Get all organizers
export const getOrganizers = async (): Promise<Organizer[]> => {
  const response = await get<OrganizersResponse>(API_ENDPOINTS.ORGANIZERS.LIST);
  return response.success && response.data ? response.data.data || [] : [];
};

// Get organizer by ID
export const getOrganizerById = async (
  id: number
): Promise<Organizer | null> => {
  const response = await get<OrganizerResponse>(
    `${API_ENDPOINTS.ORGANIZERS.DETAIL}/${id}`
  );
  return response.success && response.data ? response.data.data || null : null;
};

// Create organizer with JSON data
export const createOrganizer = async (
  organizer: CreateOrganizerRequest
): Promise<Organizer | string> => {
  const response = await post<OrganizerResponse>(
    API_ENDPOINTS.ORGANIZERS.CREATE,
    organizer
  );
  return response.success && response.data
    ? response.data.data
    : response.error || "Create organizer failed";
};

// Create organizer with FormData (supports file upload)
export const createOrganizerWithFile = async (
  name: string,
  description?: string,
  logoFile?: File
): Promise<Organizer | string> => {
  const formData = new FormData();
  formData.append("name", name);

  if (description) {
    formData.append("description", description);
  }

  if (logoFile) {
    formData.append("logo", logoFile);
  }

  const response = await post<OrganizerResponse>(
    API_ENDPOINTS.ORGANIZERS.CREATE,
    formData
  );

  return response.success && response.data
    ? response.data.data
    : response.error || "Create organizer failed";
};

// Update organizer with JSON data
export const updateOrganizer = async (
  id: number,
  updates: UpdateOrganizerRequest
): Promise<Organizer | string> => {
  const response = await patch<OrganizerResponse>(
    `${API_ENDPOINTS.ORGANIZERS.UPDATE}/${id}`,
    updates
  );
  return response.success && response.data
    ? response.data.data
    : response.error || "Update organizer failed";
};

// Update organizer with FormData (supports file upload)
export const updateOrganizerWithFile = async (
  id: number,
  name?: string,
  description?: string,
  logoFile?: File
): Promise<Organizer | string> => {
  const formData = new FormData();

  if (name) {
    formData.append("name", name);
  }

  if (description) {
    formData.append("description", description);
  }

  if (logoFile) {
    formData.append("logo", logoFile);
  }

  const response = await patch<OrganizerResponse>(
    `${API_ENDPOINTS.ORGANIZERS.UPDATE}/${id}`,
    formData
  );

  return response.success && response.data
    ? response.data.data
    : response.error || "Update organizer failed";
};

// Delete organizer
export const deleteOrganizer = async (
  id: number
): Promise<boolean | string> => {
  const response = await remove<{ success: boolean; message?: string }>(
    `${API_ENDPOINTS.ORGANIZERS.DELETE}/${id}`
  );
  return response.success ? true : response.error || "Delete organizer failed";
};

// Utility function to create organizer from form data
export const createOrganizerFromForm = async (
  formData: FormData
): Promise<Organizer | string> => {
  const response = await post<OrganizerResponse>(
    API_ENDPOINTS.ORGANIZERS.CREATE,
    formData
  );

  return response.success && response.data
    ? response.data.data
    : response.error || "Create organizer failed";
};

// Utility function to update organizer from form data
export const updateOrganizerFromForm = async (
  id: number,
  formData: FormData
): Promise<Organizer | string> => {
  const response = await patch<OrganizerResponse>(
    `${API_ENDPOINTS.ORGANIZERS.UPDATE}/${id}`,
    formData
  );

  return response.success && response.data
    ? response.data.data
    : response.error || "Update organizer failed";
};
