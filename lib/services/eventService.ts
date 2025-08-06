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

// Description type for formatting
export interface DescriptionItem {
  type: "text" | "image";
  value: string;
}

// Create event with JSON data
export const createEvent = async (
  event: CreateEventRequest
): Promise<Event | string> => {
  const response = await post<Event>(API_ENDPOINTS.EVENTS.CREATE, event);
  return response.success
    ? response.data || "Create event failed"
    : "Create event failed";
};

// Create event with FormData (supports file uploads)
export const createEventWithFormData = async (
  title: string,
  eventType: string,
  organizerId: number,
  categoryId: number,
  description: DescriptionItem[],
  posterFile?: File,
  descriptionImages?: File[]
): Promise<Event | string> => {
  const formData = new FormData();

  // Add basic event data
  formData.append("title", title);
  formData.append("event_type", eventType);
  formData.append("organizer_id", organizerId.toString());
  formData.append("category_id", categoryId.toString());

  // Add formatted description
  formData.append("description", JSON.stringify(description));

  // Add poster file
  if (posterFile) {
    formData.append("poster", posterFile);
  }

  // Add description images
  if (descriptionImages && descriptionImages.length > 0) {
    descriptionImages.forEach((file, index) => {
      formData.append("description_images", file);
    });
  }

  const response = await post<Event>(API_ENDPOINTS.EVENTS.CREATE, formData);
  return response.success
    ? response.data || "Create event failed"
    : response.error || "Create event failed";
};

// Update event with JSON data
export const updateEvent = async (
  id: number,
  values: UpdateEventRequest
): Promise<Event | string> => {
  const response = await patch<Event>(
    `${API_ENDPOINTS.EVENTS.UPDATE}/${id}`,
    values
  );
  return response.success
    ? response.data || "Update event failed"
    : "Update event failed";
};

// Update event with FormData (supports file uploads)
export const updateEventWithFormData = async (
  id: number,
  title?: string,
  eventType?: string,
  organizerId?: number,
  categoryId?: number,
  description?: DescriptionItem[],
  posterFile?: File,
  descriptionImages?: File[]
): Promise<Event | string> => {
  const formData = new FormData();

  // Add basic event data if provided
  if (title) formData.append("title", title);
  if (eventType) formData.append("event_type", eventType);
  if (organizerId) formData.append("organizer_id", organizerId.toString());
  if (categoryId) formData.append("category_id", categoryId.toString());

  // Add formatted description if provided
  if (description) {
    formData.append("description", JSON.stringify(description));
  }

  // Add poster file if provided
  if (posterFile) {
    formData.append("poster", posterFile);
  }

  // Add description images if provided
  if (descriptionImages && descriptionImages.length > 0) {
    descriptionImages.forEach((file, index) => {
      formData.append("description_images", file);
    });
  }

  const response = await patch<Event>(
    `${API_ENDPOINTS.EVENTS.UPDATE}/${id}`,
    formData
  );
  return response.success
    ? response.data || "Update event failed"
    : response.error || "Update event failed";
};

// Delete event
export const deleteEvent = async (id: number): Promise<boolean | string> => {
  const response = await remove<Event>(`${API_ENDPOINTS.EVENTS.DELETE}/${id}`);
  return response.success ? true : response.error || "Delete event failed";
};

// Utility function to format text into description array
export const formatDescriptionFromText = (
  text: string,
  includeImagePlaceholder: boolean = true
): DescriptionItem[] => {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const description: DescriptionItem[] = [];

  // Add each line as a text item
  lines.forEach((line) => {
    description.push({
      type: "text",
      value: line.trim(),
    });
  });

  // Always include image placeholder if specified
  if (includeImagePlaceholder) {
    description.push({
      type: "image",
      value: "image_0",
    });
  }

  return description;
};

// Utility function to create description with custom image placeholders
export const createDescriptionWithImages = (
  textLines: string[],
  imageCount: number = 1
): DescriptionItem[] => {
  const description: DescriptionItem[] = [];

  // Add text lines
  textLines.forEach((line) => {
    if (line.trim() !== "") {
      description.push({
        type: "text",
        value: line.trim(),
      });
    }
  });

  // Add image placeholders
  for (let i = 0; i < imageCount; i++) {
    description.push({
      type: "image",
      value: `image_${i}`,
    });
  }

  return description;
};

// Utility function to create event from form data directly
export const createEventFromForm = async (
  formData: FormData
): Promise<Event | string> => {
  const response = await post<Event>(API_ENDPOINTS.EVENTS.CREATE, formData);
  return response.success
    ? response.data || "Create event failed"
    : response.error || "Create event failed";
};

// Update event description with form data (supports file uploads)
export const updateEventDescription = async (
  id: number,
  updates: Array<{ index: number; type: "text" | "image"; value: string }>,
  imageFile?: File
): Promise<Event | string> => {
  const formData = new FormData();

  // Add updates array to form data
  formData.append("updates", JSON.stringify(updates));

  // Add image file if provided
  if (imageFile) {
    formData.append("image_1", imageFile);
  }

  const response = await patch<Event>(
    `${API_ENDPOINTS.EVENTS.UPDATE_DESCRIPTION}/${id}/description-form`,
    formData
  );

  return response.success
    ? response.data || "Update description failed"
    : response.error || "Update description failed";
};
