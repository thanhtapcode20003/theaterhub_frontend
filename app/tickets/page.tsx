"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getMyTickets, MyTicket } from "@/lib/services/ticketService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Calendar, MapPin, Ticket, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function MyTicketsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(true);
    }

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await getMyTickets();
        setTickets(data);
      } catch (err) {
        setError("Không thể tải danh sách vé. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isAuthenticated, router]);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "booked":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "Đã thanh toán";
      case "booked":
        return "Đã đặt";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        size="lg"
        variant="primary"
        text="Đang tải vé của bạn..."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-300 to-dark-400">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-3 btn-red-primary"
              >
                Thử lại
              </Button>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vé của tôi</h1>
          <p className="text-light-400 text-lg">
            Quản lý và xem chi tiết các vé đã mua
          </p>
        </div>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-light-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Bạn chưa có vé nào
            </h3>
            <p className="text-light-400 mb-6">
              Hãy khám phá các sự kiện và đặt vé để bắt đầu!
            </p>
            <Button
              onClick={() => router.push("/events")}
              className="btn-red-primary"
            >
              Khám phá sự kiện
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket.order_id}
                className="bg-dark-400 border-dark-300 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`${getStatusColor(ticket.status)} border px-2.5 py-0.5 rounded-full text-xs font-semibold`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                    <span className="text-xs text-light-400">
                      #{ticket.order_id}
                    </span>
                  </div>
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {ticket.event_title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Event Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-light-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {formatDate(ticket.showtime)}
                      </span>
                    </div>
                    <div className="flex items-center text-light-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{ticket.location_name}</span>
                    </div>
                    <div className="flex items-center text-light-400">
                      <Ticket className="w-4 h-4 mr-2" />
                      <span className="text-sm">{ticket.ticket_type_name}</span>
                    </div>
                    {ticket.seat_row && ticket.seat_number && (
                      <div className="flex items-center text-light-400">
                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        </div>
                        <span className="text-sm">
                          Ghế {ticket.seat_row}-{ticket.seat_number}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-3 border-t border-dark-300">
                    <div className="flex items-center text-primary-500">
                      <span className="font-semibold text-lg">
                        {formatPrice(ticket.price)}
                      </span>
                    </div>
                    <Button
                      onClick={() => router.push(`/tickets/${ticket.order_id}`)}
                      size="sm"
                      className="btn-glass"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
