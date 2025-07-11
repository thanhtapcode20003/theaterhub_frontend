"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import QuantityBox from "@/components/ui/QuantityBox";
import {
  getPublicGeneralTicketTypes,
  Ticket,
  TicketTypesResponse,
  Showtime,
} from "@/lib/services/ticketTypeService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, MapPin, Loader2 } from "lucide-react";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_ROUTES } from "@/lib/config";

// Extended ticket type for display
interface DisplayTicket extends Ticket {
  showtime_id: number;
  start_time: string;
  location_name: string;
  location_address: string;
  type_name: string;
}

const BookingPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = parseInt(params["event-id"] as string);
  const showtimeId = parseInt(params["showtime-id"] as string);
  const eventName = searchParams.get("eventName") || "Event";
  const [processing, setProcessing] = useState(false);

  const buttonCheckoutClass =
    "primary-gradient paragraph-semibold min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 transition-all duration-300 hover:opacity-90 active:scale-[0.98]";

  // State for API data
  const [ticketData, setTicketData] = useState<TicketTypesResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for ticket quantities - dynamic based on API data
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Fetch ticket data
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const data = await getPublicGeneralTicketTypes(eventId);
        console.log(data);

        if (data) {
          setTicketData(data);
          // Initialize quantities for all ticket types
          const initialQuantities: Record<number, number> = {};
          data.showtimes.forEach((showtime: Showtime) => {
            showtime.tickets.forEach((ticket: Ticket) => {
              initialQuantities[ticket.ticket_type_id] = 0;
            });
          });
          setQuantities(initialQuantities);
        } else {
          setError("Failed to load ticket data");
        }
      } catch (err) {
        setError("Error loading ticket data");
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchTicketData();
    }
  }, [eventId]);

  // Handle quantity changes
  const handleQuantityChange = (ticketTypeId: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketTypeId]: value,
    }));
  };

  // Handle back navigation
  const handleGoBack = () => {
    router.push(APP_ROUTES.EVENT_DETAIL(eventId));
  };

  // Handle checkout
  const handleCheckout = () => {
    if (Object.values(quantities).every((q) => q === 0)) {
      showToast({
        type: "info",
        title: "Chưa chọn vé",
        message: "Vui lòng chọn ít nhất một vé để tiếp tục!",
      });
      return;
    }

    setProcessing(true);

    const selectedTicket = getSelectedShowtimeTicket();
    const selectedShowtime = ticketData?.showtimes.find(
      (showtime: Showtime) => showtime.showtime_id === showtimeId
    );

    if (!selectedTicket || !selectedShowtime) {
      showToast({
        type: "error",
        title: "Lỗi tải thông tin",
        message: "Không thể tải thông tin vé. Vui lòng thử lại!",
      });
      setProcessing(false);
      return;
    }

    // Prepare ticket data for payment page
    const tickets = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketTypeId, qty]) => ({
        typeId: parseInt(ticketTypeId),
        typeName: selectedTicket.type_name || "Vé thường",
        quantity: qty,
        price: parseFloat(selectedTicket.price),
      }));

    const totalQuantity = Object.values(quantities).reduce(
      (sum, qty) => sum + qty,
      0
    );
    const totalAmount = calculateTotal();

    // Prepare URL parameters
    const params = new URLSearchParams({
      eventName: eventName,
      showtime: selectedShowtime.start_time,
      location: selectedShowtime.location_name,
      address: selectedShowtime.location_address,
      totalAmount: totalAmount.toString(),
      totalQuantity: totalQuantity.toString(),
      tickets: encodeURIComponent(JSON.stringify(tickets)),
    });

    // Navigate to payment page
    router.push(
      `${APP_ROUTES.EVENT_BOOKING(eventId, showtimeId)}/payment?${params.toString()}`
    );

    // Reset processing state after navigation
    setTimeout(() => setProcessing(false), 1000);
  };

  // Calculate total
  const calculateTotal = () => {
    if (!ticketData) return 0;

    return Object.entries(quantities).reduce((total, [ticketTypeId, qty]) => {
      const ticket = getSelectedShowtimeTicket();
      if (ticket && ticket.ticket_type_id === parseInt(ticketTypeId)) {
        return total + parseFloat(ticket.price) * qty;
      }
      return total;
    }, 0);
  };

  // Get ticket for the specific showtime only
  const getSelectedShowtimeTicket = (): DisplayTicket | null => {
    if (!ticketData) return null;

    const selectedShowtime = ticketData.showtimes.find(
      (showtime: Showtime) => showtime.showtime_id === showtimeId
    );

    if (!selectedShowtime || !selectedShowtime.tickets[0]) return null;

    return {
      ...selectedShowtime.tickets[0],
      showtime_id: selectedShowtime.showtime_id,
      start_time: selectedShowtime.start_time,
      location_name: selectedShowtime.location_name,
      location_address: selectedShowtime.location_address,
      type_name: `${new Date(selectedShowtime.start_time).toLocaleTimeString(
        "vi-VN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        {/* Left Section - Ticket Selection Skeleton */}
        <div className="flex-1 lg:flex-[2] p-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-20" />
            <div></div>
          </div>

          {/* Ticket Types Skeleton */}
          <div className="space-y-4 px-40">
            {/* Header Row Skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Ticket Card Skeleton */}
            <div className="flex items-center justify-between py-6 px-6 border border-gray-600 rounded-lg">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-5 w-24 mb-2" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Payment Summary Skeleton */}
        <div className="w-100 background-black_showtime_detail p-6">
          {/* Event Info Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-6 w-48 mb-4" />

            {/* Date Section */}
            <div className="flex items-center gap-3 mt-5">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-5 w-40" />
            </div>

            {/* Location Section */}
            <div className="flex items-center gap-3 mt-5">
              <Skeleton className="w-8 h-8" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>

          {/* Ticket Breakdown Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="text-center py-4">
              <Skeleton className="h-4 w-36 mx-auto" />
            </div>
          </div>

          {/* Total Quantity Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-12 w-full rounded" />
          </div>

          {/* Total and Checkout Skeleton */}
          <div className="mt-auto space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">
            {error || "Không thể tải thông tin vé"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Get the selected showtime ticket for display
  const selectedTicket = getSelectedShowtimeTicket();
  const selectedShowtime = ticketData.showtimes.find(
    (showtime: Showtime) => showtime.showtime_id === showtimeId
  ); // For location info

  console.log(ticketData);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Section - Ticket Selection (2/3 width) */}
      <div className="flex-1 lg:flex-[2] p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={handleGoBack}
            className="flex items-center outline-none bg-black text-red-primary text-lg font-bold hover:bg-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" />
            Trở về
          </Button>
          <h1 className="text-red-primary text-xl font-bold">Chọn vé</h1>
          <div></div> {/* Spacer for center alignment */}
        </div>

        {/* Ticket Types */}
        <div className="space-y-4 px-40">
          {/* Header Row */}
          <div className="flex items-center justify-between ">
            <h2 className="text-white text-lg font-semibold">Loại vé</h2>
            <h2 className="text-white text-lg font-semibold">Số lượng</h2>
          </div>
          {selectedTicket ? (
            <div
              key={selectedTicket.ticket_type_id}
              className={`flex items-center justify-between py-6 px-6 border border-gray-600 rounded-lg transition-all duration-300 hover:border-red-primary ${
                selectedTicket.quantity === 0 ? "opacity-60" : ""
              } ${quantities[selectedTicket.ticket_type_id] > 0 ? "border-red-primary bg-gray-900/30" : ""}`}
            >
              <div>
                <h3 className="text-red-primary text-xl font-bold">
                  {/* Hour */}
                  {selectedTicket.type_name}
                </h3>
                <p className="text-white text-base">
                  {formatCurrency(parseFloat(selectedTicket.price))}
                </p>
                {selectedTicket.quantity === 0 && (
                  <p className="text-red-primary text-lg">Hết vé</p>
                )}
              </div>

              {selectedTicket.quantity > 0 ? (
                <div className="flex items-center space-x-3">
                  <QuantityBox
                    initialValue={
                      quantities[selectedTicket.ticket_type_id] || 0
                    }
                    onQuantityChange={(value) =>
                      handleQuantityChange(selectedTicket.ticket_type_id, value)
                    }
                    min={0}
                    max={Math.min(selectedTicket.quantity, 10)}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <p className="text-red-primary text-lg">Hết vé</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Không tìm thấy thông tin vé cho suất chiếu này
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Payment Summary (1/3 width) */}
      <div className="w-100 background-black_showtime_detail p-6">
        {/* Event Info */}
        <div className="mb-6">
          <h2 className="text-white font-bold text-lg mb-2">{eventName}</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-3 mt-5">
              <CalendarDays className="w-6 h-6 text-red-primary" />
              <div>
                <div className="text-white text-base font-semibold">
                  {formatDateTime(selectedShowtime?.start_time || "")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <MapPin className="w-8 h-8 text-red-primary" />
              <div className="">
                <div className="text-white text-base font-semibold">
                  {selectedShowtime?.location_name}
                </div>
                <div className="text-xs text-gray-400">
                  {selectedShowtime?.location_address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Breakdown */}
        <div className="mb-6 h-90">
          <h3 className="text-red-primary font-semibold mb-4 text-xl">
            Chi tiết đơn hàng
          </h3>
          <div className="space-y-3 ">
            {selectedTicket &&
              (() => {
                const qty = quantities[selectedTicket.ticket_type_id] || 0;
                if (qty === 0) return null;

                return (
                  <div
                    key={selectedTicket.ticket_type_id}
                    className="flex justify-between"
                  >
                    <span className="text-white text-lg font-bold">
                      {selectedTicket.type_name} x{qty}
                    </span>
                    <span className="text-red-500 text-lg font-bold">
                      {formatCurrency(parseFloat(selectedTicket.price) * qty)}
                    </span>
                  </div>
                );
              })()}
            {Object.values(quantities).every((q) => q === 0) && (
              <div className="text-gray-500 text-center py-4">
                Chưa chọn vé nào
              </div>
            )}
          </div>
        </div>

        {/* Total and Checkout */}
        <div className="mt-auto ">
          <Button
            onClick={handleCheckout}
            className={buttonCheckoutClass}
            disabled={
              Object.values(quantities).every((q) => q === 0) || processing
            }
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : Object.values(quantities).every((q) => q === 0) ? (
              "Chọn vé để tiếp tục"
            ) : (
              `Đặt vé ngay - ${formatCurrency(calculateTotal())}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
