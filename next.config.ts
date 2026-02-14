import type { NextConfig } from "next";
import dns from "node:dns";

// Force IPv4 — Sanity's IPv6 endpoints are unreachable on some networks
dns.setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
