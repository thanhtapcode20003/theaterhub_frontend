"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { LuTicketCheck, LuUser, LuLogOut, LuSettings } from "react-icons/lu";
// import Theme from "./Theme";
// import MobileNavigation from "./MobileNavigation";

const Navbar = () => {
  // TODO: Replace with actual authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="flex w-full flex-col">
      {/* Top navigation bar */}
      <div className="flex justify-between items-center bg-black w-full p-3 px-6 md:px-30">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/logo/logo_text.png"
            alt="TheaterHub Logo"
            width={200}
            height={50}
          />
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex items-center rounded-md bg-white overflow-hidden">
          <input
            type="text"
            placeholder="Bạn tìm gì hôm nay?"
            className="p-2 px-4 outline-none"
          />
          <button className="bg-white px-4 py-2 text-gray-700">Tìm kiếm</button>
        </div>

        {/* Right navigation buttons */}
        <div className="flex items-center gap-15">
          {isLoggedIn && (
            <Link
              href="/tickets"
              className="hidden md:flex items-center text-white"
            >
              <LuTicketCheck className="w-6 h-6 mr-1" />
              <span>Vé đã mua</span>
            </Link>
          )}

          {/* Authentication section */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-white hover:text-gray-300 cursor-pointer"
              >
                <span className="mr-1">Tài khoản</span>
                <span>▼</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/tickets"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LuTicketCheck className="w-4 h-4 mr-2" />
                    Vé đã mua
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LuUser className="w-4 h-4 mr-2" />
                    Sự kiện của tôi
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LuSettings className="w-4 h-4 mr-2" />
                    Tài khoản của tôi
                  </Link>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LuLogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center text-white">
              <Link href="/sign-in" className="hover:text-gray-300">
                Đăng nhập
              </Link>
              <span className="mx-2">|</span>
              <Link href="/sign-up" className="hover:text-gray-300">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category menu */}
      <div className="bg-black text-white w-full py-3 px-6 md:px-30">
        <ul className="flex gap-6">
          <li>
            <Link href="/music">Nhạc sống</Link>
          </li>
          <li>
            <Link href="/theatre">Sân khấu & Nghệ thuật</Link>
          </li>
          <li>
            <Link href="/sports">Thể Thao</Link>
          </li>
          <li>
            <Link href="/other">Khác</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
