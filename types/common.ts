// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: "asc" | "desc";
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: FormError[];
  isValid: boolean;
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    filename: string;
    size: number;
    type: string;
  };
  error?: string;
}

// Notification Types
export interface Notification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationRequest {
  user_id: number;
  title: string;
  message: string;
}

// Toast Types
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  actions?: ToastAction[];
}

export interface ToastAction {
  label: string;
  action: () => void;
  style?: "primary" | "secondary";
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: string;
}

// Generic CRUD Operations
export interface CrudOperations<T, CreateT = Partial<T>, UpdateT = Partial<T>> {
  getAll: (params?: PaginationParams) => Promise<PaginatedResponse<T>>;
  getById: (id: number) => Promise<ApiResponse<T>>;
  create: (data: CreateT) => Promise<ApiResponse<T>>;
  update: (id: number, data: UpdateT) => Promise<ApiResponse<T>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
}

// Date and Time Types
export interface DateRange {
  start: string;
  end: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Environment Types
export type Environment = "development" | "staging" | "production" | "test";

// Theme Types
export type Theme = "light" | "dark" | "system";

// Language Types
export type Language = "vi" | "en";

// Status Types
export type Status = "active" | "inactive" | "pending" | "suspended";
