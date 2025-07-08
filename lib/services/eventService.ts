import { API_ENDPOINTS } from "../config";
import { get, post, patch, remove } from "../api";
import { CreateEventRequest, Event, UpdateEventRequest } from "../../types";

export const getPublicEvents = async (): Promise<Event[]> => {
  const response = await get<{ success: boolean; events: Event[] }>(
    API_ENDPOINTS.EVENTS.LIST_PUBLIC
  );
  return response.success && response.data ? response.data.events || [] : [];
};

export const getEvents = async (): Promise<Event[]> => {
  const response = await get<Event[]>(API_ENDPOINTS.EVENTS.LIST);
  return response.success ? response.data || [] : [];
};

export const getPublicEventById = async (id: number): Promise<Event | null> => {
  const response = await get<{ success: boolean; event: Event }>(
    `${API_ENDPOINTS.EVENTS.LIST_PUBLIC}/${id}`
  );
  return response.success && response.data ? response.data.event || null : null;
};
// export const getPublicEventById = async (id: number): Promise<Event | null> => {
//   const response = await get<Event>(
//     `${API_ENDPOINTS.EVENTS.LIST_PUBLIC}/${id}`
//   );
//   return response.success ? response.data || null : null;
// };

export const getEventById = async (id: number): Promise<Event | null> => {
  const response = await get<Event>(`${API_ENDPOINTS.EVENTS.DETAIL}/${id}`);
  return response.success ? response.data || null : null;
};

// export const createEvent = async (
//   event: CreateEventRequest
// ): Promise<Event | string> => {
//   const response = await post<Event>(API_ENDPOINTS.EVENTS.CREATE, event);
//   return response.success
//     ? response.data || "Create event failed"
//     : "Create event failed";
// };

// export const updateEvent = async (
//   id: number,
//   values: UpdateEventRequest
// ): Promise<Event | string> => {
//   const response = await patch<Event>(
//     `${API_ENDPOINTS.EVENTS.UPDATE}/${id}`,
//     values
//   );
//   return response.success
//     ? response.data || "Update event failed"
//     : "Update event failed";
// };

// export const deleteEvent = async (id: number): Promise<boolean | string> => {
//   const response = await remove<Event>(`${API_ENDPOINTS.EVENTS.DELETE}/${id}`);
//   return response.success ? true : response.error || "Delete event failed";
// };

// Update event description with form data (supports file uploads)
// export const updateEventDescription = async (
//   id: number,
//   updates: Array<{ index: number; type: "text" | "image"; value: string }>,
//   imageFile?: File
// ): Promise<Event | string> => {
//   const formData = new FormData();

//   // Add updates array to form data
//   formData.append("updates", JSON.stringify(updates));

//   // Add image file if provided
//   if (imageFile) {
//     formData.append("image_1", imageFile);
//   }

//   const response = await patch<Event>(
//     `${API_ENDPOINTS.EVENTS.UPDATE_DESCRIPTION}/${id}/description-form`,
//     formData
//   );

//   return response.success
//     ? response.data || "Update description failed"
//     : response.error || "Update description failed";
// };
