import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next-app',
  output: 'standalone',
  serverExternalPackages: ['pdf-parse', '@prisma/client'],
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
