import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ticketbox.vn",
        port: "",
      },
      {
        protocol: "https",
        hostname:
          "storage.googleapis.com/theaterhub-storage.firebasestorage.app",
        port: "",
      },
      {
        protocol: "https",
        hostname: "theaterhub-storage.firebasestorage.app",
        port: "",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
