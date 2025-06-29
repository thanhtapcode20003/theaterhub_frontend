"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Ticket,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Plus,
  Search,
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
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Get dynamic menu items based on user role
  const dropdownMenuItems = getDropdownMenuItems(user?.role);
  const visibleMenuItems = dropdownMenuItems.filter((item) => item.visible);

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
          <div className="hidden lg:flex items-center bg-white rounded-full overflow-hidden shadow-sm border border-gray-200 max-w-md flex-1 mx-8">
            <div className="flex items-center flex-1">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Bạn tìm gì hôm nay?"
                className="flex-1 px-3 py-3 outline-none text-gray-900 placeholder-gray-500 bg-transparent"
              />
            </div>
            <Button
              className="bg-white hover:bg-white text-gray-700 hover:text-black outline-none border-none"
              size="sm"
            >
              Tìm kiếm
            </Button>
          </div>

          {/* Right navigation buttons */}
          <div className="flex items-center gap-4 lg:gap-12">
            {isAuthenticated && (
              <>
                <Link
                  href="/tickets"
                  className="hidden md:flex items-center text-white"
                >
                  <Ticket className="w-6 h-6 mr-1" />
                  <span className="base-medium text-white">Vé đã mua</span>
                </Link>

                {/* Create Event Button */}
                <Link
                  href="/create-event"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Tạo sự kiện</span>
                </Link>
              </>
            )}

            {/* Authentication section */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-white hover:text-gray-300 cursor-pointer outline-none">
                  <div className="flex items-center mr-2">
                    <Image
                      src={user.avatar || "/icons/default-avatar.png"}
                      alt={user.name}
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
            <li>
              <Link
                href="/music"
                className="base-medium text-white hover:text-gray-300"
              >
                Nhạc sống
              </Link>
            </li>
            <li>
              <Link
                href="/theatre"
                className="base-medium text-white hover:text-gray-300"
              >
                Sân khấu & Nghệ thuật
              </Link>
            </li>
            <li>
              <Link
                href="/sports"
                className="base-medium text-white hover:text-gray-300"
              >
                Thể Thao
              </Link>
            </li>
            <li>
              <Link
                href="/other"
                className="base-medium text-white hover:text-gray-300"
              >
                Khác
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
