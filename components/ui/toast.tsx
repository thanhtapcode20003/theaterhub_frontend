"use client";

import React from "react";
import { toast } from "react-toastify";

export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
}

export const showToast = ({ type, title, message }: ToastOptions) => {
  const content = (
    <div>
      <div
        className={`font-semibold mb-1 ${
          type === "success"
            ? "text-green-800"
            : type === "error"
              ? "text-red-800"
              : "text-blue-800"
        }`}
      >
        {title}
      </div>
      {message && <div className="text-sm text-gray-600">{message}</div>}
    </div>
  );

  if (type === "success") toast.success(content);
  else if (type === "error") toast.error(content);
  else toast.info(content);
};

// Convenience functions
export const toastSuccess = (title: string, message?: string) =>
  showToast({ type: "success", title, message });

export const toastError = (title: string, message?: string) =>
  showToast({ type: "error", title, message });

export const toastInfo = (title: string, message?: string) =>
  showToast({ type: "info", title, message });
