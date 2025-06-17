import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-dark-100 text-light-900 w-full">
      <div className="mx-auto px-6 md:px-30 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-40">
          {/* Logo and Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo/logo_text.png"
                alt="TheaterHub Logo"
                width={200}
                height={50}
                className="w-[200px] h-[50px]"
              />
            </Link>
            <p className="text-light-400 text-[14px] font-normal leading-[19.6px] mb-4 max-w-md">
              TheaterHub là nền tảng dành cho những người đam mê nghệ thuật kịch
              nói. Chúng tôi cung cấp không gian để chia sẻ những trải nghiệm về
              các vở kịch, phim ảnh và các buổi biểu diễn khác nhau.
            </p>
            <div className="flex space-x-4">
              <FaFacebook />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-light900 base-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-secondary body-regular">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/music"
                  className="text-gray-secondary body-regular"
                >
                  Nhạc sống
                </Link>
              </li>
              <li>
                <Link
                  href="/theatre"
                  className="text-gray-secondary body-regular"
                >
                  Sân khấu & Nghệ thuật
                </Link>
              </li>
              <li>
                <Link
                  href="/sports"
                  className="text-gray-secondary body-regular"
                >
                  Thể Thao
                </Link>
              </li>
              <li>
                <Link
                  href="/other"
                  className="text-gray-secondary body-regular"
                >
                  Khác
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-light900 base-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-secondary body-regular"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-secondary body-regular">
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-secondary body-regular"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-secondary body-regular"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-secondary body-regular">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="light-border border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-light400 body-regular">
              © 2024 TheaterHub. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-secondary body-regular"
              >
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-gray-secondary body-regular">
                Điều khoản
              </Link>
              <Link
                href="/cookies"
                className="text-gray-secondary body-regular"
              >
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
