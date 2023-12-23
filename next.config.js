/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Ignore ESLint during build process to avoid issues
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
