"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMyTicketDetail,
  MyTicketDetail,
} from "@/lib/services/ticketService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  DollarSign,
  ArrowLeft,
  Receipt,
  User,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";

export default function TicketDetailPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = Array.isArray(params["order-id"])
    ? params["order-id"][0]
    : params["order-id"];

  const [ticketDetail, setTicketDetail] = useState<MyTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(true);
    }

    if (!orderId) {
      setError("ID đơn hàng không hợp lệ");
      setLoading(false);
      return;
    }

    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        const data = await getMyTicketDetail(parseInt(orderId));
        if (data) {
          setTicketDetail(data);
        } else {
          setError("Không tìm thấy thông tin vé");
        }
      } catch (err) {
        setError("Không thể tải thông tin vé. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, [isAuthenticated, router, orderId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, dd/MM/yyyy 'lúc' HH:mm");
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numPrice);
  };

  const calculateTotalPrice = () => {
    if (!ticketDetail) return "0";
    return ticketDetail.tickets
      .reduce((total, ticket) => {
        return total + parseFloat(ticket.price);
      }, 0)
      .toString();
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        size="lg"
        variant="primary"
        text="Đang tải thông tin vé..."
      />
    );
  }

  if (error || !ticketDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-300 to-dark-400">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p>{error || "Không tìm thấy thông tin vé"}</p>
              <div className="mt-3 space-x-2">
                <Button
                  onClick={() => router.push("/tickets")}
                  className="btn-glass"
                >
                  Quay lại danh sách
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="btn-red-primary"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-300 to-dark-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/tickets")}
            className="btn-glass mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách vé
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Chi tiết đơn hàng #{ticketDetail.order_id}
            </h1>
            <p className="text-light-400 text-lg">
              Thông tin chi tiết về vé đã mua
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Event Information */}
          <Card className="bg-dark-400 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-primary-500" />
                Thông tin sự kiện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-light-400">
                    <Calendar className="w-4 h-4 mr-3 text-primary-500" />
                    <span className="text-sm">
                      {formatDate(ticketDetail.showtime)}
                    </span>
                  </div>
                  <div className="flex items-center text-light-400">
                    <MapPin className="w-4 h-4 mr-3 text-primary-500" />
                    <span className="text-sm">
                      {ticketDetail.location_name}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-light-400">
                    <User className="w-4 h-4 mr-3 text-primary-500" />
                    <span className="text-sm">
                      {user?.name || "Người dùng"}
                    </span>
                  </div>
                  <div className="flex items-center text-light-400">
                    <CreditCard className="w-4 h-4 mr-3 text-primary-500" />
                    <span className="text-sm">Đã thanh toán</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-dark-300" />

              <div>
                <h3 className="text-white font-semibold mb-2">
                  {ticketDetail.event_title}
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Details */}
          <Card className="bg-dark-400 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-primary-500" />
                Chi tiết vé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketDetail.tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="border border-dark-300 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {ticket.ticket_type_name}
                          </h4>
                          {ticket.seat_row && ticket.seat_number && (
                            <p className="text-light-400 text-sm">
                              Ghế {ticket.seat_row}-{ticket.seat_number}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary-500 font-semibold text-lg">
                          {formatPrice(ticket.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-dark-400 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary-500" />
                Tổng quan đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-light-400">Số lượng vé:</span>
                  <span className="text-white font-medium">
                    {ticketDetail.tickets.length} vé
                  </span>
                </div>
                <Separator className="bg-dark-300" />
                <div className="flex justify-between items-center">
                  <span className="text-light-400">Tổng tiền:</span>
                  <span className="text-primary-500 font-bold text-xl">
                    {formatPrice(calculateTotalPrice())}
                  </span>
                </div>
                <Separator className="bg-dark-300" />
                <div className="flex justify-between items-center">
                  <span className="text-light-400">Trạng thái:</span>
                  <span className="bg-green-100 text-green-800 border-green-200 border px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Đã thanh toán
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-6">
            <Button
              onClick={() => router.push("/tickets")}
              className="btn-glass"
            >
              Quay lại danh sách
            </Button>
            <Button
              onClick={() => router.push("/events")}
              className="btn-red-primary"
            >
              Khám phá sự kiện khác
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
