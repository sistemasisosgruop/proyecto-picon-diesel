/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  images: {
    domains: ["*"],
  },
  experimental: {
    appDir: true,
    allowMiddlewareResponseBody: true,
  },
};

module.exports = nextConfig;
