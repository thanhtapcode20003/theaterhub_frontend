"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate, getFormattedLowestPrice } from "@/lib/utils";
import { getEventCategoryBySlug } from "@/lib/services/categoryService";
import { getPublicEvents } from "@/lib/services/eventService";
import { Event, EventCategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<EventCategory | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category by slug
        const categoryData = await getEventCategoryBySlug(slug);
        if (!categoryData) {
          setError("Category not found");
          return;
        }
        setCategory(categoryData);

        // Fetch all public events
        const allEvents = await getPublicEvents();

        // Filter events by category
        const filteredEvents = allEvents.filter(
          (event) => event.category?.category_id === categoryData.category_id
        );

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setError("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  // Event Card Skeleton Component
  const EventCardSkeleton = () => (
    <div className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <Skeleton className="w-full aspect-video" />
      </div>
      <div className="p-2 flex flex-col">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );

  // Category Section Skeleton
  const CategorySectionSkeleton = ({ index }: { index: number }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between px-4 sm:px-0 mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 sm:px-0">
        {Array.from({ length: 5 }).map((_, eventIndex) => (
          <EventCardSkeleton key={`event-skeleton-${index}-${eventIndex}`} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full mx-auto px-0 sm:px-4">
        {/* Header Skeleton */}
        <div className="mb-8 px-4 sm:px-0">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Events Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 sm:px-0">
          {Array.from({ length: 10 }).map((_, index) => (
            <EventCardSkeleton key={`loading-event-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="w-full mx-auto px-4 sm:px-0">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">
              {error === "Category not found"
                ? "Category not found"
                : "Error loading category"}
            </div>
            <div className="text-gray-400">
              {error === "Category not found"
                ? "The category you're looking for doesn't exist."
                : "Please try again later."}
            </div>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-0 sm:px-4">
      {/* Header */}
      <div className="mb-8 px-4 sm:px-0">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {category.category_name}
        </h1>
        {/* <p className="text-gray-400">
          {events.length} event{events.length !== 1 ? "s" : ""} available
        </p> */}
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 sm:px-0">
          {events.map((event) => (
            <Link key={event.event_id} href={`/events/${event.event_id}`}>
              <div className="cursor-pointer group">
                <div className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={event.poster_url || ""}
                    alt={event.title}
                    width={1920}
                    height={1080}
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div className="p-2 flex flex-col">
                  <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2 leading-tight h-8 group-hover:text-red-400 transition-colors">
                    {event.title}
                  </h4>
                  <div className="mt-auto">
                    {event.showtimes &&
                      event.showtimes.length > 0 &&
                      (event.showtimes[0].seat_prices ||
                        event.showtimes[0].ticket_types) && (
                        <p className="text-red-500 font-bold text-md mb-1">
                          Từ{" "}
                          {event.event_type === "seated"
                            ? getFormattedLowestPrice(
                                event.showtimes[0].seat_prices
                              )
                            : getFormattedLowestPrice(
                                event.showtimes[0].ticket_types
                              )}
                        </p>
                      )}
                    {event.showtimes && event.showtimes[0] && (
                      <div className="flex items-center text-white text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(event.showtimes[0].start_time)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-16">
          <div className="text-xl mb-2">No events found</div>
          <div className="text-sm mb-6">
            There are no events available in this category at the moment.
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Browse All Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
