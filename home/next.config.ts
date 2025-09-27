import type { NextConfig } from 'next';

const { AUTH_URL = 'http://localhost:3001' } = process.env;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: `${AUTH_URL}/auth/:path*`,
      },
      {
        source: '/_next/static/:path*',
        destination: `${AUTH_URL}/_next/static/:path*`,
      },
      {
        source: '/_next/data/:path*',
        destination: `${AUTH_URL}/_next/data/:path*`,
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