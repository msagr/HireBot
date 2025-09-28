import type { NextConfig } from 'next';

// const { AUTH_URL = 'http://localhost:3001' } = process.env;

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/auth/:path*',
  //       destination: `${AUTH_URL}/auth/:path*`,
  //     },
  //     {
  //       source: '/api/:path*',
  //       destination: `${AUTH_URL}/auth/api/:path*`,
  //     },
  //     {
  //       source: '/auth/_next/:path*',
  //       destination: `${AUTH_URL}/auth/_next/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
