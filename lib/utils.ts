import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Showtime, SeatPrice } from "@/types/showtimes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const formatDate = (dateString: string): string => {
  const date = parseDate(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = parseDate(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatVND = (amount: number | string) => {
  // Convert string to number if needed
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${numAmount.toLocaleString("vi-VN")} đ`;
};

// Helper function to get the lowest price from seat prices
export const getLowestSeatPrice = (seatPrices: SeatPrice[]): number => {
  if (!seatPrices || seatPrices.length === 0) return 0;

  const prices = seatPrices.map((sp) => parseFloat(sp.price));
  return Math.min(...prices);
};

// Helper function to get formatted lowest price
export const getFormattedLowestPrice = (seatPrices: SeatPrice[]): string => {
  const lowestPrice = getLowestSeatPrice(seatPrices);
  return formatVND(lowestPrice);
};

// Helper function to format all seat prices
export const formatSeatPrices = (seatPrices: SeatPrice[]) => {
  return seatPrices.map((sp) => ({
    ...sp,
    formattedPrice: formatVND(sp.price),
  }));
};

// Helper function to get formatted price for a specific seat type
export const getFormattedSeatPrice = (
  seatPrices: SeatPrice[],
  seatType: string
): string => {
  const seatPrice = seatPrices.find((sp) => sp.seat_type_code === seatType);
  return seatPrice ? formatVND(seatPrice.price) : "Không có thông tin giá";
};

// Helper function to get the nearest showtime
export const getNearestShowtime = (showtimes: Showtime[]): Showtime | null => {
  if (!showtimes || showtimes.length === 0) return null;

  const now = new Date();
  const futureShowtimes = showtimes.filter(
    (st) => new Date(st.start_time) > now
  );

  if (futureShowtimes.length === 0) return showtimes[0]; // Return first if no future showtimes

  return futureShowtimes.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )[0];
};

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
