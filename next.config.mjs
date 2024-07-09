/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    largePageDataBytes: 30000000, // デフォルトの2MBから3MBに増加
  },
};

export default nextConfig;
