"use client";

import React from "react";
import OAuthCallback from "@/components/auth/OAuthCallback";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-amber-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-50 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-amber-50 p-8">
      <OAuthCallback />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">TheaterHub</h1>

        {isAuthenticated && user ? (
          // Authenticated user content
          <div className="text-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="mb-6">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h2 className="text-2xl font-semibold mb-2">
                  Chào mừng, {user.name}!
                </h2>
                <p className="text-gray-400 mb-1">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize">
                  Role: {user.role}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="/events"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Khám phá sự kiện
                </a>
                <a
                  href="/tickets"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Vé đã mua
                </a>
              </div>
            </div>
          </div>
        ) : (
          // Non-authenticated user content
          <div className="flex justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Sign In</h2>
              <SocialAuthForm />
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-400">
          <p>Check the browser console for detailed authentication logs</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
