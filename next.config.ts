import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // App Router is at root `app/` — no srcDir override needed
  experimental: {
    // Required for streaming responses in API routes
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
