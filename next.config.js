/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    API_SERVER: process.env.API_SERVER,
    ERP_SERVER: process.env.ERP_SERVER,
    ENVIROMENT: process.env.ENVIROMENT,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  },
  publicRuntimeConfig: {
    API_SERVER: process.env.API_SERVER,
    ERP_SERVER: process.env.ERP_SERVER,
    ENVIROMENT: process.env.ENVIROMENT,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  },
  future: {
    webpack5: true,
  },
  images: {
    domains: [process.env.BASE_HOST || "localhost","i.ibb.co"],
    unoptimized:true
  },
  productionBrowserSourceMaps: true,  
    pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js']

};

module.exports = nextConfig;