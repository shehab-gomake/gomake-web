/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  future: {
    webpack5: true,
  },
  images: {
    domains: [process.env.BASE_HOST || "localhost", "i.ibb.co"],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'child_process': false,
      'nativescript-xmpp-client': false,
      'fs': false,
      'net': false,
      'tls': false,
    };
    return config;
  },
  productionBrowserSourceMaps: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
};
module.exports = nextConfig;
