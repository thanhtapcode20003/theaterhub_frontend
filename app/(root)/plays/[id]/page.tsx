"use client";

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import playsData from "@/data/plays.json";
import showtimesData from "@/data/showtimes.json";
import seatPricesData from "@/data/seat_prices.json";
import theatersData from "@/data/theaters.json";
import roomsData from "@/data/rooms.json";
import { formatDate, formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PlayDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PlayDetailPage = async ({ params }: PlayDetailPageProps) => {
  const { id } = await params;
  const playId = parseInt(id);
  const play = playsData.find((p) => p.play_id === playId);

  if (!play) {
    notFound();
  }

  // Get all showtimes for this play
  const playShowtimes = showtimesData.filter(
    (showtime) => showtime.play_id === playId
  );

  // Get all prices for this play's showtimes
  const showtimeIds = playShowtimes.map((showtime) => showtime.showtime_id);
  const playPrices = seatPricesData.filter((price) =>
    showtimeIds.includes(price.showtime_id)
  );

  // Get unique seat types and their prices
  const seatTypes = Array.from(
    new Set(playPrices.map((price) => price.seat_type_code))
  );

  // Get price ranges
  const priceRange = playPrices.reduce(
    (acc, price) => ({
      min: Math.min(acc.min, price.price),
      max: Math.max(acc.max, price.price),
    }),
    { min: Infinity, max: -Infinity }
  );

  // Get theater and room information
  const getTheaterInfo = (showtimeId: number) => {
    const showtime = playShowtimes.find((s) => s.showtime_id === showtimeId);
    if (!showtime) return null;

    const room = roomsData.find((r) => r.room_id === showtime.room_id);
    if (!room) return null;

    const theater = theatersData.find((t) => t.theater_id === room.theater_id);
    return { theater, room };
  };

  // Group showtimes by date
  const showtimesByDate = playShowtimes.reduce(
    (acc, showtime) => {
      const date = new Date(showtime.start_time).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(showtime);
      return acc;
    },
    {} as Record<string, typeof playShowtimes>
  );

  return (
    <div className="min-h-screen background-black_ticket_detail rounded-3xl">
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={play.poster_url}
                  alt={play.title}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>

            {/* Play Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {play.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-gray-300">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {play.duration} phút
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Khởi chiếu từ {formatDate(play.created_at)}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Nội dung</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {play.description}
                </p>
              </div>

              {/* Price Information */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Thông tin giá vé</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Giá vé từ</p>
                    <p className="text-3xl font-bold text-green-400">
                      {formatVND(priceRange.min)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Loại ghế có sẵn</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {seatTypes.map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-gray-700 rounded-full text-sm capitalize"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Lịch chiếu</h2>

        {Object.keys(showtimesByDate).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Chưa có lịch chiếu cho vở kịch này.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(showtimesByDate).map(([date, showtimes]) => (
              <div key={date} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {new Date(date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {showtimes.map((showtime) => {
                    const theaterInfo = getTheaterInfo(showtime.showtime_id);
                    const showtimePrices = playPrices.filter(
                      (price) => price.showtime_id === showtime.showtime_id
                    );
                    const minPrice = Math.min(
                      ...showtimePrices.map((p) => p.price)
                    );

                    return (
                      <div
                        key={showtime.showtime_id}
                        className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-lg font-semibold">
                                {new Date(
                                  showtime.start_time
                                ).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {theaterInfo && (
                                <div className="text-sm text-gray-300">
                                  <p>{theaterInfo.theater?.name}</p>
                                  <p>{theaterInfo.room?.name}</p>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Từ</p>
                              <p className="text-lg font-bold text-green-400">
                                {formatVND(minPrice)}
                              </p>
                            </div>
                          </div>

                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            Đặt vé
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theater Information Section */}
      <div className="bg-gray-800">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Thông tin rạp</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from(
              new Set(
                playShowtimes.map((showtime) => {
                  const room = roomsData.find(
                    (r) => r.room_id === showtime.room_id
                  );
                  return room?.theater_id;
                })
              )
            )
              .filter(Boolean)
              .map((theaterId) => {
                const theater = theatersData.find(
                  (t) => t.theater_id === theaterId
                );
                if (!theater) return null;

                return (
                  <div
                    key={theater.theater_id}
                    className="bg-gray-700 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      {theater.name}
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 mr-2 mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p>{theater.location}</p>
                      </div>
                      <p className="text-sm">{theater.description}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayDetailPage;
