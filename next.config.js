/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: ['*']
  },
  experimental: {
    allowMiddlewareResponseBody: true,
  },
};

module.exports = nextConfig;
