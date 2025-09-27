const { AUTH_URL } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth",
        destination: `${AUTH_URL}/auth`,
      },
    ];
  },
};

module.exports = nextConfig;