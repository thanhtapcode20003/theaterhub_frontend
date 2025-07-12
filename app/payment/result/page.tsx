"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, XCircle, ArrowLeft, Receipt, Home } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/contexts/AuthContext";
import ROUTES from "@/constants/routes";

interface PaymentResult {
  success: boolean;
  code: string;
  id: string;
  cancel: boolean;
  status: string;
  orderCode: string;
}

const PaymentResultPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract payment result from URL parameters
    const code = searchParams.get("code") || "";
    const id = searchParams.get("id") || "";
    const cancel = searchParams.get("cancel") === "true";
    const status = searchParams.get("status") || "";
    const orderCode = searchParams.get("orderCode") || "";

    // Determine if payment was successful
    // Based on your backend: code=00 and status=PAID means success
    const success = code === "00" && status === "PAID" && !cancel;

    setPaymentResult({
      success,
      code,
      id,
      cancel,
      status,
      orderCode,
    });

    setLoading(false);
  }, [searchParams]);

  const handleGoHome = () => {
    router.push(ROUTES.HOME);
  };

  const handleViewTickets = () => {
    if (user?.role) {
      router.push(`/${user.role}`);
    } else {
      router.push(ROUTES.HOME);
    }
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        size="lg"
        variant="primary"
        text="Đang xử lý kết quả thanh toán..."
      />
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Không tìm thấy thông tin thanh toán
          </h2>
          <p className="text-gray-400 mb-4">Vui lòng quay lại và thử lại</p>
          <Button onClick={handleGoHome} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const { success, orderCode, status } = paymentResult;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Payment Result Card */}
        <div className="flex justify-center">
          <Card className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg ">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                {/* Success/Failure Icon and Image */}
                <div className="flex flex-col items-center">
                  {success ? (
                    <>
                      <div className="relative w-24 h-24 mb-4">
                        <Image
                          src="/images/payment_success.png"
                          alt="Payment Success"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h1 className="text-3xl font-bold text-green-500 text-center">
                        Thanh toán thành công
                      </h1>
                      <p className="text-gray-400 text-center mt-2">
                        Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử
                        lý.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative w-24 h-24 mb-4">
                        <Image
                          src="/images/payment_fail.png"
                          alt="Payment Failed"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h1 className="text-3xl font-bold text-red-500 text-center">
                        Thanh toán thất bại
                      </h1>
                      <p className="text-gray-400 text-center mt-2">
                        Rất tiếc, thanh toán của bạn không thành công. Vui lòng
                        thử lại.
                      </p>
                    </>
                  )}
                </div>

                {/* Payment Details */}
                <div className="w-full space-y-4">
                  <Separator className="bg-gray-700" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Mã đơn hàng:</span>
                      <span className="font-medium text-black">
                        #{orderCode}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Trạng thái:</span>
                      <span
                        className={`font-medium ${success ? "text-green-500" : "text-red-500"}`}
                      >
                        {success ? "Đã thanh toán" : "Thất bại"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">
                        Phương thức thanh toán:
                      </span>
                      <span className="font-medium text-black">VietQR</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Thời gian:</span>
                      <span className="font-medium text-black">
                        {new Date().toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleGoHome}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Về trang chủ
                  </Button>

                  {success && (
                    <Button
                      onClick={handleViewTickets}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Xem vé đã đặt
                    </Button>
                  )}

                  {!success && (
                    <Button
                      onClick={handleGoHome}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Về trang chủ
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
