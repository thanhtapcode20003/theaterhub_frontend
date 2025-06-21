"use client";

import React, { useState } from "react";
import {
  Play,
  Download,
  RefreshCw,
  Save,
  Upload,
  Settings,
  Database,
  Zap,
} from "lucide-react";
import { useLoading, useAsyncOperation } from "@/contexts/LoadingContext";
import Loading, {
  CardLoading,
  TableLoading,
  ButtonLoading,
} from "@/components/ui/loading";

const LoadingDemo = () => {
  const { showLoading, hideLoading, setLoadingText } = useLoading();
  const { executeWithLoading } = useAsyncOperation();

  const [localLoadings, setLocalLoadings] = useState({
    button1: false,
    button2: false,
    button3: false,
    cards: false,
    table: false,
  });

  // Global loading examples
  const handleGlobalLoading1 = () => {
    showLoading("Processing your request...");
    setTimeout(() => hideLoading(), 3000);
  };

  const handleGlobalLoading2 = () => {
    showLoading("Uploading files...");
    setTimeout(() => {
      setLoadingText("Processing files...");
      setTimeout(() => {
        setLoadingText("Almost done...");
        setTimeout(() => hideLoading(), 1500);
      }, 2000);
    }, 2000);
  };

  const handleAsyncOperation = async () => {
    await executeWithLoading(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }, "Syncing with database...");
  };

  // Local loading examples
  const handleLocalLoading = async (key: string, duration: number) => {
    setLocalLoadings((prev) => ({ ...prev, [key]: true }));
    await new Promise((resolve) => setTimeout(resolve, duration));
    setLocalLoadings((prev) => ({ ...prev, [key]: false }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 px-6 py-6 space-y-8">
        {/* Header */}
        <div className="pt-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Play className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Loading System Demo
              </h1>
              <p className="text-gray-400 text-lg">
                Interactive examples of all loading states
              </p>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        </div>

        {/* Global Loading Examples */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-400" />
            Global Full-Screen Loading
          </h2>
          <p className="text-gray-400 mb-6">
            These buttons trigger full-screen loading overlays that cover the
            entire application.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleGlobalLoading1}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="h-5 w-5" />
              Simple Loading (3s)
            </button>

            <button
              onClick={handleGlobalLoading2}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Upload className="h-5 w-5" />
              Multi-Stage Loading (6s)
            </button>

            <button
              onClick={handleAsyncOperation}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Database className="h-5 w-5" />
              Async Operation (4s)
            </button>
          </div>
        </div>

        {/* Local Loading Examples */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="h-6 w-6 text-red-400" />
            Component-Level Loading
          </h2>
          <p className="text-gray-400 mb-6">
            These examples show loading states within specific components
            without covering the entire screen.
          </p>

          <div className="space-y-6">
            {/* Button Loading States */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Button Loading States
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleLocalLoading("button1", 2000)}
                  disabled={localLoadings.button1}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-75"
                >
                  {localLoadings.button1 ? (
                    <ButtonLoading text="Saving..." />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleLocalLoading("button2", 3000)}
                  disabled={localLoadings.button2}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-75"
                >
                  {localLoadings.button2 ? (
                    <ButtonLoading text="Refreshing..." />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Refresh Data
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleLocalLoading("button3", 2500)}
                  disabled={localLoadings.button3}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-75"
                >
                  {localLoadings.button3 ? (
                    <ButtonLoading text="Processing..." />
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload File
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Inline Spinners */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Inline Loading Spinners
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-zinc-800/30 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <Loading size="sm" variant="primary" />
                  <span className="text-sm text-gray-400">Small Blue</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Loading size="md" variant="red" />
                  <span className="text-sm text-gray-400">Medium Red</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Loading size="lg" variant="white" />
                  <span className="text-sm text-gray-400">Large White</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Loading size="xl" variant="primary" text="Loading..." />
                  <span className="text-sm text-gray-400">XL with Text</span>
                </div>
              </div>
            </div>

            {/* Card Loading */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Card Loading Skeletons
              </h3>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleLocalLoading("cards", 3000)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {localLoadings.cards ? "Loading..." : "Show Card Loading"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {localLoadings.cards
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <CardLoading key={i} />
                    ))
                  : Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm font-medium">
                              Sample Metric
                            </p>
                            <p className="text-3xl font-bold text-white">
                              1,234
                            </p>
                            <p className="text-green-400 text-sm font-medium">
                              +12% this week
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30">
                            <Database className="h-6 w-6 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Table Loading */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Table Loading Skeleton
              </h3>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleLocalLoading("table", 4000)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {localLoadings.table ? "Loading..." : "Show Table Loading"}
                </button>
              </div>
              {localLoadings.table ? (
                <TableLoading rows={5} />
              ) : (
                <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-800/50 border-b border-zinc-700/50">
                        <tr>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                            Name
                          </th>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                            Email
                          </th>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                            Role
                          </th>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                            Status
                          </th>
                          <th className="text-left py-4 px-6 text-gray-300 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-700/50">
                        <tr className="hover:bg-zinc-800/30">
                          <td className="py-4 px-6 text-white">John Doe</td>
                          <td className="py-4 px-6 text-gray-300">
                            john@example.com
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Admin
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-500/20 text-green-400 border-green-500/30">
                              Active
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                              Edit
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 backdrop-blur-sm border border-amber-700/30 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-amber-200 mb-4">
            🎯 How to Use
          </h2>
          <div className="space-y-3 text-amber-100">
            <p>
              • <strong>Global Loading:</strong> Click the top buttons to see
              full-screen loading overlays
            </p>
            <p>
              • <strong>Button Loading:</strong> Click the colored buttons to
              see in-button loading states
            </p>
            <p>
              • <strong>Skeleton Loading:</strong> Use "Show Card Loading" and
              "Show Table Loading" buttons
            </p>
            <p>
              • <strong>Inline Spinners:</strong> See different sizes and colors
              of loading spinners
            </p>
            <p>
              • <strong>Real Usage:</strong> Check the{" "}
              <code className="bg-amber-900/30 px-2 py-1 rounded">
                examples/loading-usage.md
              </code>{" "}
              file for code examples
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDemo;
