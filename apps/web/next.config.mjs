/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@funneldoctor/core"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
