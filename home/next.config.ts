import type { NextConfig } from 'next';

const { AUTH_URL = 'http://localhost:3001' } = process.env;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // ✅ JS/CSS
      {
        source: '/auth/_next/static/:path*',
        destination: `${AUTH_URL}/auth/_next/static/:path*`,
      },
      // ✅ ISR/SSG
      {
        source: '/auth/_next/data/:path*',
        destination: `${AUTH_URL}/auth/_next/data/:path*`,
      },
      // ✅ NextAuth API
      {
        source: '/api/:path*',
        destination: `${AUTH_URL}/auth/api/:path*`,
      },
      // ✅ All other pages
      {
        source: '/auth/:path*',
        destination: `${AUTH_URL}/auth/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
