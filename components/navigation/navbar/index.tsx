"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import {
  Ticket,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Plus,
  Search,
  Tag,
  Calendar,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import OAuthCallback from "@/components/auth/OAuthCallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/services/categoryService";
import { getPublicEvents } from "@/lib/services/eventService";
import { EventCategory } from "@/types";
import { Event } from "@/types/events";

// Dynamic menu configuration
const getDropdownMenuItems = (userRole?: string) => [
  {
    href: "/tickets",
    icon: Ticket,
    label: "Vé đã mua",
    visible: true,
  },
  {
    href: "/profile",
    icon: User,
    label: "Sự kiện của tôi",
    visible: true,
  },
  {
    href: "/account",
    icon: Settings,
    label: "Tài khoản của tôi",
    visible: true,
  },
  {
    href: userRole === "admin" || userRole === "staff" ? `/${userRole}` : "/",
    icon: Settings,
    label: userRole === "admin" ? "Admin Panel" : "Staff Panel",
    visible: userRole === "admin" || userRole === "staff",
  },
];

const Navbar = () => {
  const { user, isAuthenticated, loading, logout, getUserRole } = useAuth();
  const userRole = getUserRole();

  // Get dynamic menu items based on user role
  const dropdownMenuItems = getDropdownMenuItems(user?.role);
  const visibleMenuItems = dropdownMenuItems.filter((item) => item.visible);

  // Search state
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<
    Array<EventCategory | Event>
  >([]);
  const [searchLoading, setSearchLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setSearchLoading(true);
      try {
        const [categoriesResponse, eventsResponse] = await Promise.all([
          getCategories(),
          getPublicEvents(),
        ]);
        setCategories(categoriesResponse.data || []);
        setEvents(eventsResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality with skeleton loading like your React project
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults([]);
      setShowSkeleton(true);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Search categories
    const matchingCategories = categories.filter((category) =>
      category.category_name.toLowerCase().includes(searchTermLower)
    );

    // Search events
    const matchingEvents = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTermLower) ||
        (event.category?.category_name &&
          event.category.category_name.toLowerCase().includes(searchTermLower))
    );

    // Combine and limit results (categories first, then events)
    const combinedResults = [
      ...matchingCategories.map((cat) => ({ ...cat, isCategory: true })),
      ...matchingEvents,
    ].slice(0, 100);

    setFilteredResults(combinedResults);

    // Show skeleton for 500ms like your React project
    setShowSkeleton(true);
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, categories, events]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (result: any) => {
    if (result.isCategory) {
      window.location.href = `/categories/${result.slug}`;
    } else {
      window.location.href = `/events/${result.event_id}`;
    }
    setSearchTerm("");
    setShowResults(false);
  };

  const handleClickOutside = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  // Skeleton component
  const SearchSkeleton = () => (
    <div className="space-y-2">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex items-center p-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderSearchResults = () => {
    if (searchLoading || showSkeleton) {
      return <SearchSkeleton />;
    }

    if (filteredResults.length === 0 && searchTerm.trim() !== "") {
      return (
        <div className="p-4 text-center text-gray-500">
          Không tìm thấy kết quả nào
        </div>
      );
    }

    return filteredResults.map((result: any) => {
      if (result.isCategory) {
        // Category result
        const category = result as EventCategory;
        return (
          <div
            key={`category-${category.category_id}`}
            className="flex items-center p-3 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors bg-red-25 border-l-4 border-l-red-500"
            onMouseDown={() => handleResultClick(result)}
          >
            <div className="mr-3 p-2 bg-red-100 rounded-full">
              <Tag className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-700">
                Danh mục: {category.category_name}
              </p>
              <p className="text-sm text-gray-500">
                Xem tất cả sự kiện trong danh mục này
              </p>
            </div>
          </div>
        );
      } else {
        // Event result
        const event = result as Event;
        return (
          <div
            key={`event-${event.event_id}`}
            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            onMouseDown={() => handleResultClick(result)}
          >
            <div className="mr-3">
              {event.poster_url ? (
                <img
                  src={event.poster_url}
                  alt={event.title}
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/icons/default-avatar.png";
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-gray-900 truncate">
                {event.title}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                {event.category && (
                  <span className="mr-2">{event.category.category_name}</span>
                )}
                {event.custom_location && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{event.custom_location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    });
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <nav className="flex w-full flex-col">
        <div className="flex justify-between items-center bg-black w-full p-3 px-6 md:px-30">
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <Image
                src="/logo/logo_icon.png"
                alt="TheaterHub Logo"
                width={50}
                height={50}
                className="sm:hidden w-[50px] h-[50px]"
              />
              <Image
                src="/logo/logo_text.png"
                alt="TheaterHub Logo"
                width={200}
                height={50}
                className="hidden sm:block w-[200px] h-[50px]"
              />
            </Link>

            {/* Loading indicator */}
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex w-full flex-col">
      <OAuthCallback />

      {/* Top navigation bar */}
      <div className="flex justify-between items-center bg-black w-full p-3 px-6 md:px-30">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            {/* Logo for small screens */}
            <Image
              src="/logo/logo_icon.png"
              alt="TheaterHub Logo"
              width={50}
              height={50}
              className="sm:hidden w-[50px] h-[50px]"
            />
            {/* Logo for larger screens */}
            <Image
              src="/logo/logo_text.png"
              alt="TheaterHub Logo"
              width={200}
              height={50}
              className="hidden sm:block w-[200px] h-[50px]"
            />
          </Link>

          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-white rounded-full overflow-visible shadow-sm border border-gray-200 max-w-md flex-1 mx-8 relative z-50">
            {searchLoading ? (
              <div className="flex-1 px-3 py-3">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center flex-1">
                  <Search className="w-5 h-5 text-gray-400 ml-4" />
                  <input
                    type="text"
                    placeholder="Bạn tìm gì hôm nay?"
                    className="flex-1 px-3 py-3 outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                    value={searchTerm}
                    onChange={handleSearch}
                    onBlur={handleClickOutside}
                  />
                </div>
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-700 rounded-full cursor-pointer hover:text-black">
                  <Search className="text-xl" />
                </button>

                {/* Search Results Dropdown */}
                {showResults && searchTerm.trim() !== "" && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-[9999] min-w-full">
                    {filteredResults.length > 0 ||
                    searchLoading ||
                    showSkeleton ? (
                      <>
                        {!searchLoading && !showSkeleton && (
                          <div className="p-2 text-xs text-gray-500 border-b bg-gray-50">
                            {filteredResults.length} kết quả cho "{searchTerm}"
                          </div>
                        )}
                        <div className="p-2">{renderSearchResults()}</div>
                      </>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Không tìm thấy kết quả nào
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right navigation buttons */}
          <div className="flex items-center gap-4 lg:gap-12">
            {isAuthenticated && userRole && (
              <>
                {userRole === "customer" && (
                  <Link
                    href="/tickets"
                    className="hidden md:flex items-center text-white"
                  >
                    <Ticket className="w-6 h-6 mr-1" />
                    <span className="base-medium text-white">Vé đã mua</span>
                  </Link>
                )}
                {/* Create Event Button */}
                {userRole === "staff" && (
                  <Link
                    href="/staff/events"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Tạo sự kiện</span>
                  </Link>
                )}
              </>
            )}

            {/* Authentication section */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-white hover:text-gray-300 cursor-pointer outline-none">
                  <div className="flex items-center mr-2">
                    <Image
                      src={user.avatar || "/icons/default-avatar.png"}
                      alt={user.name || "null"}
                      width={32}
                      height={32}
                      className="rounded-full mr-2"
                    />
                    <span className="base-medium">Tài khoản</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-60 bg-white rounded-md shadow-lg border border-gray-200"
                  align="end"
                  sideOffset={5}
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : user.role === "staff"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* Menu Items */}
                  {visibleMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <DropdownMenuItem key={index} className="cursor-pointer">
                        <Link
                          href={item.href}
                          className="flex items-center w-full px-2 py-1"
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          <span className="body-medium">{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}

                  <DropdownMenuSeparator />

                  {/* Logout */}
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="body-medium">Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center text-white">
                <Link href="/sign-in" className="hover:text-gray-300">
                  <span className="base-medium">Đăng nhập</span>
                </Link>
                <span className="mx-2 base-medium">|</span>
                <Link href="/sign-up" className="hover:text-gray-300">
                  <span className="base-medium">Đăng ký</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category menu */}
      <div className="bg-black text-white w-full py-3 px-6 md:px-30">
        <div className="max-w-7xl mx-auto">
          <ul className="flex gap-6">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.category_id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="base-medium text-white hover:text-gray-300"
                  >
                    {category.category_name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-400">Loading categories...</li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
