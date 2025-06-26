/** @type {import('next/config').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig