"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateTime, getFormattedLowestPrice } from "@/lib/utils";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicEventById } from "@/lib/services/eventService";
import { Event } from "@/types";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
const EventPage = () => {
  const params = useParams();
  const eventId = params["event-id"] as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getPublicEventById(parseInt(eventId));
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="h-auto background-black_ticket_detail rounded-3xl">
        {/* Skeleton Loading */}
        <div className="flex">
          {/* Event Information Skeleton */}
          <div className="flex-1 container mx-auto p-6 relative">
            {/* Event Details - Top Section */}
            <div>
              {/* Title Skeleton */}
              <Skeleton className="h-8 w-3/4 mb-6" />

              {/* Date & Time Section Skeleton */}
              <div className="flex items-center mb-4">
                <Skeleton className="w-6 h-6 mr-4 " />
                <Skeleton className="h-5 w-48 " />
              </div>

              {/* Location Section Skeleton */}
              <div className="flex items-center mb-6">
                <Skeleton className="w-6 h-6 mr-4 " />
                <div>
                  <Skeleton className="h-5 w-64 mb-1 " />
                  <Skeleton className="h-4 w-40 " />
                </div>
              </div>
            </div>

            {/* Price Section - Fixed Bottom Skeleton */}
            <div className="absolute bottom-6 left-6 right-6 border-t border-gray-600 pt-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20 " />
                <Skeleton className="h-8 w-32 " />
              </div>

              {/* Book Button Skeleton */}
              <Skeleton className="w-full h-12 mt-6 rounded-xl " />
            </div>
          </div>

          {/* Poster Skeleton */}
          <div className="flex-2">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <Skeleton className="w-220 h-120 object-cover" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return notFound();
  }

  console.log(event);

  return (
    <div className="h-auto background-black_ticket_detail rounded-3xl">
      {/* Ticket Section */}
      <div className="flex">
        {/* Event Information */}
        <div className="flex-1 container mx-auto p-6 relative">
          {/* Event Details - Top Section */}
          <div>
            {/* title */}
            <h1 className="text-xl font-bold text-white mb-6 leading-tight">
              {event.title}
            </h1>
            {/* Date & Time Section */}
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <FaCalendar className="w-6 h-6 text-white transition-all duration-200 hover:text-red-400 hover:scale-110" />
              </div>
              <div>
                {event.showtimes && event.showtimes.length > 0 && (
                  <p className="text-red-500 font-semibold text-sm">
                    {formatDateTime(event.showtimes[0].start_time)}
                  </p>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="flex items-center mb-6">
              <div className="mr-4 mt-1">
                <FaMapMarkerAlt className="w-6 h-6 text-white transition-all duration-200 hover:text-red-400 hover:scale-110" />
              </div>
              {event.showtimes &&
                event.showtimes.length > 0 &&
                event.showtimes[0].location_name && (
                  <div>
                    <p className="text-red-500 font-semibold text-sm">
                      {event.showtimes[0].location_name}
                    </p>
                    {event.custom_location && (
                      <p className="text-gray-300 text-sm mt-1">
                        {event.custom_location}
                      </p>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Price Section - Fixed Bottom */}
          <div className="absolute bottom-6 left-6 right-6 border-t border-gray-600 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-white text-xl font-medium">Giá từ</span>
              {event.showtimes &&
                event.showtimes.length > 0 &&
                (event.showtimes[0].seat_prices ||
                  event.showtimes[0].ticket_types) && (
                  <span className="text-red-500 text-2xl font-bold">
                    {event.event_type === "seated"
                      ? getFormattedLowestPrice(event.showtimes[0].seat_prices)
                      : getFormattedLowestPrice(
                          event.showtimes[0].ticket_types
                        )}
                  </span>
                )}
            </div>

            {/* Book Button */}
            {event.showtimes && (
              <Link
                href={{
                  pathname: APP_ROUTES.EVENT_BOOKING(
                    parseInt(eventId),
                    (() => {
                      const now = new Date();
                      const nearestShowtime = event.showtimes
                        .filter(
                          (showtime) => new Date(showtime.start_time) > now
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.start_time).getTime() -
                            new Date(b.start_time).getTime()
                        )[0];
                      return nearestShowtime
                        ? nearestShowtime.showtime_id
                        : event.showtimes[0].showtime_id;
                    })()
                  ),
                  query: {
                    eventName: event.title,
                    eventId: event.event_id,
                  },
                }}
              >
                <Button className="w-full mt-6 primary-gradient py-3 text-lg font-semibold rounded-xl transition-all duration-400 ease-in-out transform hover:scale-105">
                  Mua vé ngay
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Poster */}
        <div className="flex-2">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={event.poster_url || ""}
              alt={event.title}
              width={900}
              height={300}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
      {/* </div>

    {/* Full Width Description Section */}
      {/* <div className="w-screen bg-white text-black py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-black">Giới thiệu</h2> */}

      {/* Ticket Sale Information */}
      {/* <div className="mb-6">
          <p className="text-red-600 font-semibold mb-2">
            *CÔNG BÁN VÉ ĐỢT 1 ĐÃ ĐÓNG LÚC 23:59, 03.06.2025
          </p>
          <p className="text-red-600 font-semibold mb-4">
            **CÔNG BÁN VÉ ĐỢT 2 SẼ MỞ LÚC 10:30, 27.06.2025
          </p>
        </div> */}

      {/* Event Description */}
      {/* <div className="space-y-4">
          {event?.description && event.description.length > 0 ? (
            event.description.map((content, index) => (
              <div key={index}>
                {content.type === "text" ? (
                  <p className="text-gray-800 leading-relaxed">{content.value}</p>
                ) : content.type === "image" ? (
                  <div className="my-6">
                    <Image
                      src={content.value}
                      alt={`Description image ${index + 1}`}
                      width={800}
                      height={400}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-black mb-3">
                  SUPERFEST 2025 – CONCERT MÙA HÈ RỰC SÁNG
                </h3>
                <p className="text-gray-600 font-medium mb-3">
                  20 nghệ sĩ, 1 concert, 1 mùa hè đáng nhớ!
                </p>
                <p className="text-gray-800 leading-relaxed mb-3">
                  Mùa hè này, đại tiệc âm nhạc bùng nổ nhất chính thức trở lại tại Hạ Long với phiên bản nâng cấp chưa từng có – nơi ánh sáng, âm nhạc và cảm xúc cùng chạm đỉnh!
                </p>
                <p className="text-gray-800 leading-relaxed mb-3">
                  SUPERFEST 2025 quy tụ 20 nghệ sĩ tài sắc vẹn toàn, mang đến những màn trình diễn độc nhất, lần đầu hội tụ trên một sân khấu rực cháy duy nhất trong năm.
                </p>
                <p className="text-gray-800 leading-relaxed">
                  Đây không chỉ là một concert – mà là hành trình đánh thức thanh xuân, nơi bạn sẽ cháy hết mình, sống trọn cảm xúc và tạo nên những ký niệm rực sáng nhất mùa hè này!
                </p>
              </div>
            </div>
          )}
        </div> */}
    </div>
  );
};

export default EventPage;
