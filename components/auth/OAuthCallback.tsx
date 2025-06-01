"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface User {
  user_id: number;
  avatar: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
}

const OAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const processedRef = useRef(false); // Prevent multiple executions

  useEffect(() => {
    // Early return if already processed
    if (processedRef.current) return;

    const handleOAuthCallback = async () => {
      try {
        const success = searchParams.get("success");
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const messageParam = searchParams.get("message");

        // Only process if we have the success parameter and haven't processed yet
        if (success === "true" && token && userParam && !processedRef.current) {
          // Mark as processed immediately to prevent multiple calls
          processedRef.current = true;

          // Decode the user data
          const decodedUser = decodeURIComponent(userParam);
          const user: User = JSON.parse(decodedUser);

          // Decode the message
          const decodedMessage = messageParam
            ? decodeURIComponent(messageParam)
            : "Đăng nhập thành công";

          // Log authentication details
          console.log("🎉 OAuth Callback Success!");
          console.log("📋 Authentication Details:");
          console.log("  ✅ Success:", success);
          console.log("  🔑 Token:", token);
          console.log("  👤 User Information:");
          console.log("    - ID:", user.user_id);
          console.log("    - Name:", user.name);
          console.log("    - Email:", user.email);
          console.log("    - Role:", user.role);
          console.log("    - Avatar:", user.avatar);
          console.log("    - Phone:", user.phone || "Not provided");
          console.log("  💬 Message:", decodedMessage);

          // Use context login function - this handles localStorage, state updates, and toast
          login(token, user);

          // Clean up URL after delay
          setTimeout(() => {
            router.replace("/", { scroll: false });
          }, 2000);
        } else if ((success || token || userParam) && !processedRef.current) {
          // Mark as processed for partial parameters too
          processedRef.current = true;

          // Partial parameters detected
          const errorContent = (
            <div>
              <div className="font-semibold text-red-800 mb-1">
                Lỗi xác thực
              </div>
              <div className="text-sm text-gray-600">
                Thông tin xác thực không đầy đủ
              </div>
            </div>
          );

          toast.error(errorContent);
        }
      } catch (error) {
        if (!processedRef.current) {
          processedRef.current = true;
          console.error("❌ OAuth callback error:", error);

          const errorContent = (
            <div>
              <div className="font-semibold text-red-800 mb-1">
                Lỗi xử lý đăng nhập
              </div>
              <div className="text-sm text-gray-600">Vui lòng thử lại</div>
            </div>
          );

          toast.error(errorContent);
        }
      }
    };

    // Only run if we haven't processed yet
    if (!processedRef.current) {
      const timer = setTimeout(handleOAuthCallback, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Remove dependencies to prevent re-running

  return null;
};

export default OAuthCallback;
