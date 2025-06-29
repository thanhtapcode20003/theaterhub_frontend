import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (date: Date) => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - new Date(date).getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

// Function to format date in Vietnamese format
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Function to format VND currency with proper spacing
export const formatVND = (amount: number) => {
  return `${amount.toLocaleString("vi-VN")} đ`;
};

// Function to format VND with "Từ" prefix for pricing display
export const formatPriceVND = (amount: number) => {
  return `Từ ${formatVND(amount)}`;
};

/**
 * Get the dashboard route based on user role
 * Uses dynamic [role] routing structure
 */
export function getDashboardRoute(userRole?: string | null): string {
  switch (userRole) {
    case "admin":
    case "staff":
      return `/${userRole}`;
    default:
      return "/";
  }
}

/**
 * Get role-specific route
 */
export function getRoleRoute(userRole: string, page: string = ""): string {
  const basePath = `/${userRole}`;
  return page ? `${basePath}/${page}` : basePath;
}
