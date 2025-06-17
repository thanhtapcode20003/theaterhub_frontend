"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import playsData from "@/data/plays.json";
import showtimesData from "@/data/showtimes.json";
import seatPricesData from "@/data/seat_prices.json";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PlaysPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "title" | "duration" | "created_at" | "price"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Function to get the lowest price for a play
  const getLowestPrice = (playId: number) => {
    const playShowtimes = showtimesData.filter(
      (showtime) => showtime.play_id === playId
    );
    const showtimeIds = playShowtimes.map((showtime) => showtime.showtime_id);
    const playPrices = seatPricesData.filter((price) =>
      showtimeIds.includes(price.showtime_id)
    );

    if (playPrices.length === 0) return null;

    const lowestPrice = Math.min(...playPrices.map((price) => price.price));
    return lowestPrice;
  };

  // Function to get nearest showtime for a play
  const getNearestShowtime = (playId: number) => {
    const playShowtimes = showtimesData.filter(
      (showtime) => showtime.play_id === playId
    );
    if (playShowtimes.length === 0) return null;

    const sortedShowtimes = playShowtimes.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return sortedShowtimes[0];
  };

  // Filter and sort plays
  const filteredAndSortedPlays = useMemo(() => {
    let filtered = playsData.filter(
      (play) =>
        play.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        play.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort plays
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "duration":
          aValue = a.duration;
          bValue = b.duration;
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "price":
          aValue = getLowestPrice(a.play_id) || 0;
          bValue = getLowestPrice(b.play_id) || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Tất cả các vở kịch</h1>
          <p className="text-gray-300 text-lg">
            Khám phá bộ sưu tập đa dạng các vở kịch đặc sắc
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm vở kịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="created_at">Ngày tạo</option>
                <option value="title">Tên vở kịch</option>
                <option value="duration">Thời lượng</option>
                <option value="price">Giá vé</option>
              </select>

              <Button
                variant="outline"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                {sortOrder === "asc" ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-400">
            Tìm thấy {filteredAndSortedPlays.length} vở kịch
          </div>
        </div>

        {/* Plays Grid */}
        {filteredAndSortedPlays.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              Không tìm thấy vở kịch nào phù hợp với từ khóa "{searchTerm}"
            </div>
            <Button
              onClick={() => setSearchTerm("")}
              className="bg-green-600 hover:bg-green-700"
            >
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredAndSortedPlays.map((play) => {
              const lowestPrice = getLowestPrice(play.play_id);
              const nearestShowtime = getNearestShowtime(play.play_id);

              return (
                <Link key={play.play_id} href={`/plays/${play.play_id}`}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    {/* Poster */}
                    <div className="relative">
                      <Image
                        src={play.poster_url}
                        alt={play.title}
                        width={300}
                        height={420}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {play.duration} phút
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14">
                        {play.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2 h-10">
                        {play.description}
                      </p>

                      {/* Price and Date */}
                      <div className="space-y-2">
                        {lowestPrice && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              Giá từ:
                            </span>
                            <span className="text-green-400 font-bold">
                              {formatPriceVND(lowestPrice).replace("Từ ", "")}
                            </span>
                          </div>
                        )}

                        {nearestShowtime && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              Suất gần nhất:
                            </span>
                            <span className="text-blue-400 text-sm">
                              {formatDate(nearestShowtime.start_time)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaysPage;
