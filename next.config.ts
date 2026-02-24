import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'pywgiruurpzjtmelzkbb.supabase.co' },
      { hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
