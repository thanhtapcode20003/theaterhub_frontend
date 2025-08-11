import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Showtime, SeatPrice, TicketType } from "@/types/showtimes";
import type { Event } from "@/types/events";

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

  // Get time part (HH:mm)
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Get date part (dd tháng MM, yyyy)
  const datePart = date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${time}, ${datePart}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatVND = (amount: number | string) => {
  // Convert string to number if needed
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${numAmount.toLocaleString("vi-VN")} đ`;
};

// Helper function to get the lowest price from seat prices
export const getLowestSeatPrice = (
  seatPrices: SeatPrice[] | Record<string, string>
): number => {
  if (!seatPrices || !Array.isArray(seatPrices) || seatPrices.length === 0)
    return 0;

  const prices = seatPrices.map((sp) => parseFloat(String(sp.price)));

  return prices.length > 0 ? Math.min(...prices) : 0;
};

// Helper function to get the lowest price from ticket types
export const getLowestTicketPrice = (
  ticketTypes: TicketType[] | undefined
): number => {
  if (!ticketTypes || !Array.isArray(ticketTypes) || ticketTypes.length === 0)
    return 0;

  const prices = ticketTypes.map((tt) => parseFloat(String(tt.price)));
  return prices.length > 0 ? Math.min(...prices) : 0;
};

// Helper function to get formatted lowest price - overloaded for different parameter types
export const getFormattedLowestPrice = (
  data: SeatPrice[] | TicketType[] | undefined
): string => {
  if (!data || !Array.isArray(data) || data.length === 0) return "99.000 đ";

  let lowestPrice = 0;

  // Check if it's SeatPrice array by checking if it has seat_type_code
  if (data.length > 0 && "seat_type_code" in data[0]) {
    lowestPrice = getLowestSeatPrice(data as SeatPrice[]);
  } else if (
    data.length > 0 &&
    ("ticket_type_id" in data[0] || "type_name" in data[0])
  ) {
    // It's TicketType array
    lowestPrice = getLowestTicketPrice(data as TicketType[]);
  }

  return formatVND(lowestPrice);
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

export const getEarliestTimeEvents = (events: Event[]) => {
  return [...events].sort((a, b) => {
    const aStartTime =
      a.showtimes && a.showtimes.length > 0
        ? new Date(a.showtimes[0].start_time).getTime()
        : Infinity;
    const bStartTime =
      b.showtimes && b.showtimes.length > 0
        ? new Date(b.showtimes[0].start_time).getTime()
        : Infinity;
    return aStartTime - bStartTime;
  });
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
