import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse', '@prisma/client'],
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
