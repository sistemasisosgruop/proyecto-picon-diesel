/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: ['*']
  },
  experimental: {
    appDir: true,
    allowMiddlewareResponseBody: true,
  },
};

module.exports = nextConfig;
