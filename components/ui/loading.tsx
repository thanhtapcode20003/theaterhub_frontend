import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "red";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "primary",
  className,
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  const variantClasses = {
    primary: "border-red-500 border-t-transparent",
    white: "border-white border-t-transparent",
    red: "border-red-500 border-t-transparent",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      />
      {text && (
        <p className={cn("text-gray-300 font-medium", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Page Loading Component
export const PageLoading: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full animate-pulse" />
          {/* Inner Spinner */}
          <div className="absolute inset-2 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          {/* Center Dot */}
          <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
            TheaterHub
          </h2>
          <p className="text-gray-400 text-lg">{text}</p>
        </div>
      </div>
    </div>
  </div>
);

// Card Loading Skeleton
export const CardLoading: React.FC = () => (
  <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-zinc-700/50 rounded w-1/3" />
        <div className="h-8 bg-zinc-700/50 rounded w-1/2" />
        <div className="h-3 bg-zinc-700/50 rounded w-1/4" />
      </div>
      <div className="w-12 h-12 bg-zinc-700/50 rounded-xl" />
    </div>
  </div>
);

// Table Loading Skeleton
export const TableLoading: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-zinc-800/50 border-b border-zinc-700/50">
          <tr>
            {Array.from({ length: 6 }).map((_, i) => (
              <th key={i} className="py-4 px-6">
                <div className="h-4 bg-zinc-700/50 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-700/50">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <td key={colIndex} className="py-4 px-6">
                  <div className="h-4 bg-zinc-700/50 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Button Loading State
export const ButtonLoading: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    <span>{text}</span>
  </div>
);

export default Loading;
