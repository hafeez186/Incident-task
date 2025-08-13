/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment - only for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  
  // Optimize images
  images: {
    unoptimized: process.env.NODE_ENV === 'production', // Only for static export compatibility in production
    domains: [],
  },

  // Enable compression
  compress: true,

  // Optimize for production
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Environment variables for client side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }

    return config
  },

  // Experimental features
  serverExternalPackages: ['@prisma/client'], // Updated from experimental.serverComponentsExternalPackages

  // Only use basePath and assetPrefix for production static deployments
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' && {
    basePath: '/AI-based-incidentmanagement',
    assetPrefix: '/AI-based-incidentmanagement',
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
