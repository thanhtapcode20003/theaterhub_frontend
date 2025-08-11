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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EventDescriptionContent } from "@/types";
import ExpandableDescription from "@/components/ui/ExpandableDescription";

const DescriptionSection = ({
  description,
}: {
  description: EventDescriptionContent[];
}) => {
  // Combine all text content
  const textContent = description
    .filter((item) => item.type === "text")
    .map((item) => item.value)
    .join("\n\n");

  // Get image URLs
  const imageUrls = description
    .filter((item) => item.type === "image")
    .map((item) => item.value);

  return (
    <div>
      <div className="space-y-4">
        {/* Text and Image Content with ExpandableDescription */}
        {(textContent || imageUrls.length > 0) && (
          <div className="text-gray-300 leading-relaxed">
            <ExpandableDescription
              content={textContent}
              images={imageUrls}
              maxHeight="150px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton for Description Section
const DescriptionSectionSkeleton = () => (
  <div className="mt-10">
    <div className="background-black_ticket_detail rounded-lg p-6">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
    </div>
  </div>
);

// Skeleton for Showtime Section
const ShowtimeSectionSkeleton = () => (
  <div className="mt-10">
    <div className="background-black_ticket_detail rounded-lg p-6">
      <Skeleton className="h-8 w-1/4 mb-4" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`showtime-skeleton-${index}`}
          className="border-b border-gray-600 py-4"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
      <>
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
        {/* Description Section Skeleton */}
        <DescriptionSectionSkeleton />

        {/* Showtime Section Skeleton */}
        <ShowtimeSectionSkeleton />
      </>
    );
  }

  if (!event) {
    return notFound();
  }

  // console.log(event);

  return (
    <>
      {/* Ticket Section */}
      <div className="h-auto background-black_ticket_detail rounded-3xl">
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
                        ? getFormattedLowestPrice(
                            event.showtimes[0].seat_prices
                          )
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
                      eventType: event.event_type,
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
      </div>

      {/* Description Section */}
      {event.description && event.description.length > 0 && (
        <div className="mt-10">
          <div className="background-black_ticket_detail rounded-lg">
            <DescriptionSection description={event.description} />
          </div>
        </div>
      )}

      {/* Showtime Section */}
      {event.showtimes && event.showtimes.length > 0 && (
        <div className="mt-10">
          <div className="background-black_ticket_detail rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Thông tin vé</h2>

            <Accordion type="single" collapsible className="w-full">
              {event.showtimes.map((showtime) => (
                <AccordionItem
                  key={showtime.showtime_id}
                  value={`showtime-${showtime.showtime_id}`}
                  className="border-none"
                >
                  <div className="flex justify-between items-center w-full border-b border-gray-600 py-4">
                    <AccordionTrigger className="hover:no-underline flex-1 justify-start">
                      <div className="text-white font-medium">
                        {formatDateTime(showtime.start_time)}
                      </div>
                    </AccordionTrigger>
                    <Link
                      href={{
                        pathname: APP_ROUTES.EVENT_BOOKING(
                          parseInt(eventId),
                          showtime.showtime_id
                        ),
                        query: {
                          eventName: event.title,
                          eventId: event.event_id,
                          eventType: event.event_type,
                        },
                      }}
                      className="ml-4"
                    >
                      <Button className="primary-gradient px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                        Mua vé ngay
                      </Button>
                    </Link>
                  </div>

                  <AccordionContent>
                    <div className="pt-2 ">
                      {/* Ticket Types */}
                      {showtime.ticket_types &&
                        showtime.ticket_types.length > 0 && (
                          <div className="space-y-2">
                            {showtime.ticket_types.map((ticketType) => (
                              <div
                                key={ticketType.ticket_type_id}
                                className="background-black_showtime_item flex justify-between items-center py-2 px-4 rounded-lg"
                              >
                                <span className="text-gray-300 text-lg">
                                  {ticketType.type_name || "Vé"}
                                </span>
                                <span className="text-red-500 font-semibold text-lg">
                                  {getFormattedLowestPrice([ticketType])}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Seat Prices */}
                      {showtime.seat_prices &&
                        showtime.seat_prices.length > 0 && (
                          <div className="space-y-2">
                            {showtime.seat_prices.map((seatPrice, index) => (
                              <div
                                key={index}
                                className={`flex justify-between items-center py-2 px-4 rounded-lg ${
                                  index % 2 === 0
                                    ? "bg-[#2E2F32]"
                                    : "bg-[#2D2F31]"
                                }`}
                              >
                                <div className="text-gray-300">
                                  {`Hạng ${index + 1}`}
                                </div>
                                <div className="text-red-400 font-semibold">
                                  {getFormattedLowestPrice([seatPrice])}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </>
  );
};

export default EventPage;
