// Phase 4: repointed from the old Express API (port 3001) to Strapi.
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${STRAPI_API_URL}/api/:path*` },
    ];
  },
};

export default nextConfig;
