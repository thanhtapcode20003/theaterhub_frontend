"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#2D2D2D] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Trang không tồn tại
        </h1>

        {/* 404 Image */}
        <div className="mb-8">
          <Image
            src="/images/404_image.png"
            alt="404 Error - Page not found"
            width={800}
            height={600}
            className="mx-auto"
            priority
          />
        </div>

        {/* Explanation Text */}
        <div className="text-white mb-8 space-y-2">
          <p className="text-lg">
            Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên, hoặc tạm
            thời không khả dụng.
          </p>
          <p className="text-base">
            Vui lòng quay về trang trước hoặc đi đến Trang chủ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 border-2 border-[#4CAF50] text-[#4CAF50] bg-transparent rounded-lg hover:bg-[#4CAF50] hover:text-white transition-all duration-300 font-medium"
          >
            Quay về trang trước
          </button>

          <Link
            href="/"
            className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/90 transition-all duration-300 font-medium"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

