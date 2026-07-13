import type { NextConfig } from "next";

// Baseline security headers applied to every response. A Content-Security-Policy
// is intentionally left commented out because it needs to be tuned to the pages
// and third-party origins each product actually uses.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Example CSP to adapt and enable in production:
  // { key: "Content-Security-Policy", value: "default-src 'self'; ..." },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
