const EXPRESS_API_URL = process.env.EXPRESS_API_URL || 'http://localhost:3001';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${EXPRESS_API_URL}/api/:path*` },
    ];
  },
};

export default nextConfig;
