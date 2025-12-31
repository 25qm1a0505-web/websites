/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Optimize for production
  swcMinify: true,
  compress: true,
  // Enable static optimization
  output: 'standalone',
}

module.exports = nextConfig

