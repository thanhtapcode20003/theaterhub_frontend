"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Loading from "@/components/ui/loading";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { processPayment } from "@/lib/services/paymentService";
import { showToast } from "@/components/ui/toast";
import VietQR_logo from "@/public/logo/VietQR_logo.png";

interface BookingData {
  eventId: number;
  eventName: string;
  showtimeId: number;
  showtime: string;
  location: string;
  address: string;
  tickets: Array<{
    typeId: number;
    typeName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  totalQuantity: number;
}

const Payment = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vietqr");
  const buttonPaymentClass =
    "primary-gradient paragraph-semibold min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 transition-all duration-300 hover:opacity-90 active:scale-[0.98]";

  // Extract booking data from URL params
  useEffect(() => {
    const eventId = parseInt(params["event-id"] as string);
    const showtimeId = parseInt(params["showtime-id"] as string);
    const eventName = searchParams.get("eventName") || "Event";
    const showtime = searchParams.get("showtime") || "";
    const location = searchParams.get("location") || "";
    const address = searchParams.get("address") || "";
    const totalAmount = parseFloat(searchParams.get("totalAmount") || "0");
    const totalQuantity = parseInt(searchParams.get("totalQuantity") || "0");

    // Parse tickets data
    const ticketsParam = searchParams.get("tickets");
    let tickets: BookingData["tickets"] = [];

    if (ticketsParam) {
      try {
        tickets = JSON.parse(decodeURIComponent(ticketsParam));
      } catch (error) {
        console.error("Error parsing tickets data:", error);
      }
    }

    if (eventId && showtimeId && totalAmount > 0) {
      setBookingData({
        eventId,
        eventName,
        showtimeId,
        showtime,
        location,
        address,
        tickets,
        totalAmount,
        totalQuantity,
      });
    }

    setLoading(false);
  }, [params, searchParams]);

  const handleGoBack = () => {
    router.back();
  };

  const handlePayment = async () => {
    if (!bookingData) return;

    setProcessing(true);

    try {
      // Use PaymentService to handle the complete payment flow
      const checkoutUrl = await processPayment(
        bookingData.showtimeId,
        bookingData.totalQuantity
      );

      // Navigate to checkout URL
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment process error:", error);
      showToast({
        type: "error",
        title: "Lỗi thanh toán",
        message: error instanceof Error ? error.message : "Vui lòng thử lại",
      });
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        size="lg"
        variant="primary"
        text="Đang tải thông tin thanh toán..."
      />
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Không tìm thấy thông tin đặt vé
          </h2>
          <p className="text-gray-400 mb-4">Vui lòng quay lại và thử lại</p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={handleGoBack}
            className="flex items-center outline-none bg-black text-red-primary text-lg font-bold hover:bg-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" />
            Quay lại
          </Button>
          <h1 className="text-red-primary text-xl font-bold">Thanh toán</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="background-black_ticket_detail rounded-lg p-6">
              <h3 className="text-red-500 font-semibold text-lg mb-4">
                Thông tin nhận vé
              </h3>
              <p className="text-gray-300">
                Vé điện tử sẽ được hiển thị trong mục{" "}
                <strong>"Vé của tôi"</strong> của tài khoản:{" "}
                <span className="text-red-400 font-medium">
                  {user?.email || "Chưa đăng nhập"}
                </span>
              </p>
            </div>

            {/* Payment Information */}
            <div className="background-black_ticket_detail rounded-lg p-6">
              <h3 className="text-red-500 font-semibold text-lg mb-4">
                Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  <div className="flex items-center space-x-3 p-3">
                    <RadioGroupItem
                      value="vietqr"
                      id="vietqr"
                      className="bg-red-500 text-white"
                    />
                    <img
                      src={VietQR_logo.src}
                      alt="VietQR"
                      className="w-10 h-10 rounded-lg"
                    />
                    <label htmlFor="vietqr" className="flex-1 cursor-pointer">
                      <span className=" text-white font-bold">VietQR</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h3 className="text-dark300 font-bold text-xl mb-4">
              Thông tin đặt vé
            </h3>

            {/* Event Info */}
            <div className="mb-6">
              <h4 className="font-medium text-lg mb-2 text-gray-800">
                {bookingData.eventName}
              </h4>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span>{formatDateTime(bookingData.showtime)}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-gray-600">{bookingData.location}</div>
                    <div className="text-xs text-gray-500">
                      {bookingData.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Ticket Details */}
            <div className="space-y-3 mb-6">
              <h5 className="font-medium text-gray-800">Chi tiết vé</h5>
              {bookingData.tickets.map((ticket, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-800">{ticket.typeName}</div>
                    <div className="text-gray-500">x{ticket.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-800">
                      {formatCurrency(ticket.price * ticket.quantity)}
                    </div>
                    <div className="text-gray-500">
                      {formatCurrency(ticket.price)}/vé
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Total */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Tổng số vé:</span>
                <span className="font-bold text-base">
                  {bookingData.totalQuantity} vé
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-800">Tổng cộng:</span>
                <span className="text-red-500 font-extrabold text-xl">
                  {formatCurrency(bookingData.totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className={buttonPaymentClass}
            >
              {processing ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <span>
                  Thanh toán {formatCurrency(bookingData.totalAmount)}
                </span>
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Bằng cách thanh toán, bạn đồng ý với{" "}
              <span className="text-red-600 cursor-pointer hover:text-red-700">
                Điều khoản dịch vụ
              </span>{" "}
              và{" "}
              <span className="text-red-600 cursor-pointer hover:text-red-700">
                Chính sách bảo mật
              </span>{" "}
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
