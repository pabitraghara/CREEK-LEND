import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "zod"],
    optimizeCss: true,
    // inlineCss: true,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is required");
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: https://www.google-analytics.com https://www.facebook.com https://maps.googleapis.com https://maps.gstatic.com; connect-src 'self' https://api.creeklend.com https://www.google-analytics.com https://www.facebook.com https://graph.facebook.com https://maps.googleapis.com https://places.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self';",
        },
      ],
    },
  ],
};

export default nextConfig;
