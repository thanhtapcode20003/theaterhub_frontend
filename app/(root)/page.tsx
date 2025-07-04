"use client";

import React, { useEffect, useState } from "react";
import VideoCard from "@/components/card/VideoCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { getPublicEvents } from "@/lib/services/eventService";
import { Event } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getPublicEvents();
        setEvents(eventsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Event Card Skeleton Component
  const EventCardSkeleton = () => (
    <div className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <Skeleton className="w-full aspect-video" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
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

        {/* First Events Carousel Skeleton */}
        <div className="mt-8 md:mt-12">
          <div className="mb-4 md:mb-6 px-4 sm:px-0">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Dành cho bạn
            </h2>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <EventCardSkeleton key={`skeleton-1-${index}`} />
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Second Events Carousel Skeleton */}
        <div className="mt-8 md:mt-12">
          <div className="mb-4 md:mb-6 px-4 sm:px-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Sự kiện sắp diễn ra
              </h2>
              <div className="text-gray-400 flex items-center gap-1 text-sm md:text-base">
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
              </div>
            </div>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-2-${index}`}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
                >
                  <div className="cursor-pointer">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <Skeleton className="w-full aspect-video" />
                    </div>
                    <div className="p-2">
                      <Skeleton className="h-5 w-4/5 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2 " />
                      <Skeleton className="h-4 w-1/3 mb-1 " />
                      <Skeleton className="h-3 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 top-[40%]" />
            <CarouselNext className="right-2 top-[40%]" />
          </Carousel>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  console.log(events);

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

      {/* Events Carousel Section */}
      <div className="mt-8 md:mt-12">
        {/* Section Title */}
        <div className="mb-4 md:mb-6 px-4 sm:px-0">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Dành cho bạn
          </h2>
        </div>

        {events.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {events.map((event) => (
                <CarouselItem
                  key={event.event_id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <Link href={`/events/${event.event_id}`}>
                    <div className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer">
                      <Image
                        src={event.poster_url || ""}
                        alt={event.title}
                        width={1920}
                        height={1080}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-white font-semibold text-sm line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-white/80 text-xs mt-1">
                          {event.category?.category_name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No events available
          </div>
        )}
      </div>

      {/* Second Carousel Section - Upcoming Events with Prices */}
      <div className="mt-8 md:mt-12">
        {/* Section Title */}
        <div className="mb-4 md:mb-6 px-4 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Sự kiện sắp diễn ra
              </h2>
            </div>
            <Link
              href="/events"
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
            </Link>
          </div>
        </div>

        {events.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {events.map((event) => {
                return (
                  <CarouselItem
                    key={`price-${event.event_id}`}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
                  >
                    <Link href={`/events/${event.event_id}`}>
                      <div className="cursor-pointer">
                        <div className="rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src={event.poster_url || ""}
                            alt={event.title}
                            width={1920}
                            height={1080}
                            className="w-full aspect-video object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {event.category?.category_name}
                          </p>
                          {event.showtimes && event.showtimes.length > 0 && (
                            <p className="text-red-500 font-bold text-md mb-1">
                              Từ {formatPriceVND(200000)}
                            </p>
                          )}
                          {event.showtimes && event.showtimes[0] && (
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                                />
                              </svg>
                              {formatDate(event.showtimes[0].start_time)}
                            </div>
                          )}
                          {event.showtimes && event.showtimes[0] && (
                            <div className="flex items-center text-gray-400 text-xs mt-1">
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
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Location Available
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 top-[40%]" />
            <CarouselNext className="right-2 top-[40%]" />
          </Carousel>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No events available
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
