/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  serverRuntimeConfig: {
    API_SERVER: process.env.API_SERVER,
    ERP_SERVER: process.env.ERP_SERVER,
    MESSAGING_SERVER: process.env.MESSAGING_SERVER,
    CHATWOOT_SERVER: process.env.CHATWOOT_SERVER,
    ENVIROMENT: process.env.ENVIROMENT,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    MONDAY_API_TOKEN: process.env.MONDAY_API_TOKEN,
    MONDAY_BOARD_ID: process.env.MONDAY_BOARD_ID,
    TOPICS_GROUP_ID: process.env.TOPICS_GROUP_ID,
  },
  publicRuntimeConfig: {
    API_SERVER: process.env.API_SERVER,
    ERP_SERVER: process.env.ERP_SERVER,
    MESSAGING_SERVER: process.env.MESSAGING_SERVER,
    CHATWOOT_SERVER: process.env.CHATWOOT_SERVER,
    ENVIROMENT: process.env.ENVIROMENT,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    MONDAY_API_TOKEN: process.env.MONDAY_API_TOKEN,
    MONDAY_BOARD_ID: process.env.MONDAY_BOARD_ID,
    TOPICS_GROUP_ID: process.env.TOPICS_GROUP_ID,
  },
  images: {
    domains: [process.env.BASE_HOST || "localhost", "i.ibb.co"],
    unoptimized: true,
  },
  
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      "nativescript-xmpp-client": false,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  productionBrowserSourceMaps: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  experimental: {
    optimizePackageImports: ["icon-library"],
    useDeploymentId: true,
    // Optionally, use with Server Actions
    useDeploymentIdServerActions: true,
  },
};
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
