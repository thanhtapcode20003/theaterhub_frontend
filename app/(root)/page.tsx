"use client";

import React from "react";
import VideoCard from "@/components/card/VideoCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import playsData from "@/data/plays.json";
import seatPricesData from "@/data/seat_prices.json";
import showtimesData from "@/data/showtimes.json";
import { formatDate, formatPriceVND } from "@/lib/utils";

const Home = () => {
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

    // Sort by start_time and get the first one
    const sortedShowtimes = playShowtimes.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return sortedShowtimes[0];
  };

  return (
    <div className="w-full mx-auto px-0 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        <VideoCard
          videoSrc="/videos/trailer1.mp4"
          posterSrc="/images/trailer1.png"
          title="Trailer 1"
        />
        <VideoCard
          videoSrc="/videos/trailer2.mp4"
          posterSrc="/images/trailer2.png"
          title="Trailer 2"
        />
      </div>

      {/* Plays Carousel Section */}
      <div className="mt-8 md:mt-12">
        {/* Section Title */}
        <div className="mb-4 md:mb-6 px-4 sm:px-0">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Mới cập nhật
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {playsData.map((play) => (
              <CarouselItem
                key={play.play_id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={play.poster_url}
                    alt={play.title}
                    width={300}
                    height={420}
                    className="w-full h-80 object-cover"
                  />
                  {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm">
                      {play.title}
                    </h3>
                    <p className="text-white/80 text-xs mt-1">
                      {play.duration} phút
                    </p>
                  </div> */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Second Carousel Section - Upcoming Plays with Prices */}
      <div className="mt-8 md:mt-12">
        {/* Section Title */}
        <div className="mb-4 md:mb-6 px-4 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Các vở kịch gần nhất
              </h2>
            </div>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm md:text-base"
            >
              <span className="hidden sm:inline">Xem thêm</span>
              <span className="sm:hidden">Xem</span>
              <svg
                className="w-3 h-3 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Second Carousel */}
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {playsData.map((play) => {
              const lowestPrice = getLowestPrice(play.play_id);
              const nearestShowtime = getNearestShowtime(play.play_id);

              return (
                <CarouselItem
                  key={`price-${play.play_id}`}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
                >
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={play.poster_url}
                      alt={play.title}
                      width={300}
                      height={240}
                      className="w-full h-70 object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                      {play.title}
                    </h3>
                    {lowestPrice && (
                      <p className="text-red-500 font-bold text-md mb-1">
                        {formatPriceVND(lowestPrice)}
                      </p>
                    )}
                    {nearestShowtime && (
                      <div className="flex items-center text-gray-400 text-xs">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(nearestShowtime.start_time)}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-[40%]" />
          <CarouselNext className="right-2 top-[40%]" />
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
