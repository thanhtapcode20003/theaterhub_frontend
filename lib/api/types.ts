import { z } from "zod";

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Auth Types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface User extends BaseEntity {
  email: string;
  userName: string;
  phoneNumber: string;
  address: string;
  role: "admin" | "user";
  isEmailVerified: boolean;
  avatar?: string;
}

// Validation Schemas
export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    userName: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const UpdateUserSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

// Form Types
export type SignInFormData = z.infer<typeof SignInSchema>;
export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;

// API Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  code?: string;
  errors?: ValidationError[];
  details?: any;
}

// Theater-specific types (based on your project context)
export interface Theater extends BaseEntity {
  name: string;
  address: string;
  city: string;
  capacity: number;
  description?: string;
  images?: string[];
  facilities: string[];
  status: "active" | "inactive" | "maintenance";
}

export interface Show extends BaseEntity {
  title: string;
  description: string;
  genre: string;
  duration: number; // in minutes
  ageRating: string;
  poster?: string;
  trailer?: string;
  cast: string[];
  director: string;
  language: string;
  status: "upcoming" | "active" | "ended";
}

export interface Booking extends BaseEntity {
  userId: string;
  showId: string;
  theaterId: string;
  showTime: string;
  seats: string[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "refunded";
  paymentId?: string;
}

// Query Types
export interface TheaterQuery extends PaginationParams {
  city?: string;
  status?: Theater["status"];
  search?: string;
}

export interface ShowQuery extends PaginationParams {
  genre?: string;
  status?: Show["status"];
  theaterId?: string;
  date?: string;
  search?: string;
}

export interface BookingQuery extends PaginationParams {
  userId?: string;
  status?: Booking["status"];
  dateFrom?: string;
  dateTo?: string;
}
