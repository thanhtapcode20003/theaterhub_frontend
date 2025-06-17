"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, User } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

/**
 * OAuth Callback Handler Component
 * Processes OAuth authentication responses and manages user login state
 */
const OAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const processedRef = useRef(false);

  // Extract URL parameters
  const getCallbackParams = () => {
    return {
      success: searchParams.get("success"),
      token: searchParams.get("token"),
      userParam: searchParams.get("user"),
      messageParam: searchParams.get("message"),
    };
  };

  // Parse and validate user data
  const parseUserData = (userParam: string): User | null => {
    try {
      const decodedUser = decodeURIComponent(userParam);
      return JSON.parse(decodedUser) as User;
    } catch (error) {
      console.error("❌ Failed to parse user data:", error);
      return null;
    }
  };

  // Show success toast
  const showSuccessToast = (user: User, message?: string) => {
    const decodedMessage = message
      ? decodeURIComponent(message)
      : "Đăng nhập thành công";

    const successContent = (
      <div>
        <div className="font-semibold text-green-800 mb-1">
          Chào mừng, {user.name}!
        </div>
        <div className="text-sm text-gray-600">{decodedMessage}</div>
      </div>
    );

    toast.success(successContent);
  };

  // Show error toast
  const showErrorToast = (title: string, message: string) => {
    const errorContent = (
      <div>
        <div className="font-semibold text-red-800 mb-1">{title}</div>
        <div className="text-sm text-gray-600">{message}</div>
      </div>
    );

    toast.error(errorContent);
  };

  // Log authentication details for debugging
  const logAuthDetails = (
    params: ReturnType<typeof getCallbackParams>,
    user: User
  ) => {
    console.log("🎉 OAuth Callback Success!");
    console.log("📋 Authentication Details:");
    console.log("  ✅ Success:", params.success);
    console.log("  🔑 Token:", params.token);
    console.log("  👤 User Information:");
    console.log("    - ID:", user.user_id);
    console.log("    - Name:", user.name);
    console.log("    - Email:", user.email);
    console.log("    - Role:", user.role);
    console.log("    - Avatar:", user.avatar);
    console.log("    - Phone:", user.phone || "Not provided");
    console.log(
      "  💬 Message:",
      params.messageParam
        ? decodeURIComponent(params.messageParam)
        : "Default success message"
    );
  };

  // Handle successful OAuth callback
  const handleSuccessfulAuth = (
    params: ReturnType<typeof getCallbackParams>
  ) => {
    const { token, userParam, messageParam } = params;

    if (!token || !userParam) {
      showErrorToast("Lỗi xác thực", "Thông tin xác thực không đầy đủ");
      return;
    }

    const user = parseUserData(userParam);
    if (!user) {
      showErrorToast(
        "Lỗi xử lý dữ liệu",
        "Không thể xử lý thông tin người dùng"
      );
      return;
    }

    // Log details for debugging
    logAuthDetails(params, user);

    // Login user (this handles localStorage, state updates, and shows toast)
    login(token, user);

    // Navigate back to home after a short delay
    setTimeout(() => {
      router.replace("/", { scroll: false });
    }, 2000);
  };

  // Handle failed OAuth callback
  const handleFailedAuth = () => {
    showErrorToast("Lỗi xác thực", "Thông tin xác thực không đầy đủ");
  };

  // Main OAuth callback handler
  const handleOAuthCallback = () => {
    // Prevent multiple executions
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      const params = getCallbackParams();
      const { success, token, userParam } = params;

      // Check if we have a successful OAuth response
      if (success === "true" && token && userParam) {
        handleSuccessfulAuth(params);
      } else if (success || token || userParam) {
        // Partial parameters detected - likely an error case
        handleFailedAuth();
      }
      // If no OAuth params at all, do nothing (user probably navigated here directly)
    } catch (error) {
      console.error("❌ OAuth callback error:", error);
      showErrorToast("Lỗi xử lý đăng nhập", "Vui lòng thử lại");
    }
  };

  useEffect(() => {
    // Only process if we haven't already
    if (!processedRef.current) {
      // Small delay to ensure URL params are fully loaded
      const timer = setTimeout(handleOAuthCallback, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array is intentional

  // This component doesn't render anything visible
  return null;
};

export default OAuthCallback;
