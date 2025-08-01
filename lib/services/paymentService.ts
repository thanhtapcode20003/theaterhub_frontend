import { API_ENDPOINTS } from "../config";
import { get, post } from "../api";

// Request/Response interfaces
export interface CreateGeneralBookingRequest {
  showtime_id: number;
  quantity: number;
}

export interface CreateGeneralBookingResponse {
  success: boolean;
  message: string;
  order_id: number;
}

export interface CreatePaymentLinkRequest {
  order_id: number;
}

export interface CreatePaymentLinkResponse {
  success: boolean;
  paymentLink: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;
    qrCode: string;
  };
}

/**
 * Create a general booking
 * POST /api/bookings/general
 */
export const createGeneralBooking = async (
  data: CreateGeneralBookingRequest
): Promise<CreateGeneralBookingResponse | string> => {
  const response = await post<CreateGeneralBookingResponse>(
    API_ENDPOINTS.PAYMENT.CREATE_GENERAL_BOOKING,
    data
  );
  return response.success
    ? response.data || "Create booking failed"
    : response.error || "Create booking failed";
};

/**
 * Create payment link
 * POST /api/payments/create-link
 */
export const createPaymentLink = async (
  data: CreatePaymentLinkRequest
): Promise<CreatePaymentLinkResponse | string> => {
  const response = await post<CreatePaymentLinkResponse>(
    API_ENDPOINTS.PAYMENT.CREATE_PAYMENT,
    data
  );
  return response.success
    ? response.data || "Create payment link failed"
    : response.error || "Create payment link failed";
};

/**
 * Complete payment flow: create booking -> create payment link -> return checkout URL
 */
export const processPayment = async (
  showtimeId: number,
  quantity: number
): Promise<string> => {
  try {
    // Step 1: Create booking
    console.log("Creating booking...", { showtime_id: showtimeId, quantity });

    const bookingResult = await createGeneralBooking({
      showtime_id: showtimeId,
      quantity: quantity,
    });

    if (typeof bookingResult === "string") {
      throw new Error(bookingResult);
    }

    if (!bookingResult.success || !bookingResult.order_id) {
      throw new Error(bookingResult.message || "Failed to create booking");
    }

    const orderId = bookingResult.order_id;
    console.log("Booking created with order_id:", orderId);

    // Step 2: Create payment link
    console.log("Creating payment link for order_id:", orderId);

    const paymentResult = await createPaymentLink({
      order_id: orderId,
    });

    if (typeof paymentResult === "string") {
      throw new Error(paymentResult);
    }

    if (!paymentResult.success || !paymentResult.paymentLink?.checkoutUrl) {
      throw new Error("Failed to create payment link");
    }

    const checkoutUrl = paymentResult.paymentLink.checkoutUrl;
    console.log("Payment link created, checkout URL:", checkoutUrl);

    return checkoutUrl;
  } catch (error: any) {
    console.error("Payment process error:", error);
    throw new Error(error.message || "Payment process failed");
  }
};

/**
 * Verify payment status (for future use)
 * GET /api/payments/verify/{paymentLinkId}
 */
export const verifyPayment = async (paymentLinkId: string): Promise<any> => {
  const response = await get<any>(`/payments/verify/${paymentLinkId}`);
  return response.success ? response.data || null : null;
};
