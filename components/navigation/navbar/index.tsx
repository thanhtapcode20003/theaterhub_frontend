"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { LuTicketCheck, LuUser, LuLogOut, LuSettings } from "react-icons/lu";
const Navbar = () => {
  // TODO: Replace with actual authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="flex w-full flex-col">
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
              className="sm:hidden"
            />
            {/* Logo for larger screens */}
            <Image
              src="/logo/logo_text.png"
              alt="TheaterHub Logo"
              width={200}
              height={50}
              className="hidden sm:block"
            />
          </Link>

          {/* Search bar */}
          <div className="hidden lg:flex items-center rounded-md bg-white overflow-hidden">
            <input
              type="text"
              placeholder="Bạn tìm gì hôm nay?"
              className="p-2 px-4 outline-none placeholder"
            />
            <button className="bg-white px-4 py-2 text-dark400">
              Tìm kiếm
            </button>
          </div>

          {/* Right navigation buttons */}
          <div className="flex items-center gap-4 lg:gap-12">
            {isLoggedIn && (
              <Link
                href="/tickets"
                className="hidden md:flex items-center text-white"
              >
                <LuTicketCheck className="w-6 h-6 mr-1" />
                <span className="base-medium text-white">Vé đã mua</span>
              </Link>
            )}

            {/* Authentication section */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center text-white hover:text-gray-300 cursor-pointer"
                >
                  <span className="mr-1 base-medium">Tài khoản</span>
                  <span className="small-regular">▼</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-light100 py-1 z-50">
                    <Link
                      href="/tickets"
                      className="flex items-center px-4 py-2 text-dark400 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LuTicketCheck className="w-4 h-4 mr-2" />
                      <span className="body-medium">Vé đã mua</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-dark400 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LuUser className="w-4 h-4 mr-2" />
                      <span className="body-medium">Sự kiện của tôi</span>
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center px-4 py-2 text-dark400 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LuSettings className="w-4 h-4 mr-2" />
                      <span className="body-medium">Tài khoản của tôi</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-dark400 hover:bg-gray-100"
                    >
                      <LuLogOut className="w-4 h-4 mr-2" />
                      <span className="body-medium">Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
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
