/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  
  // Optimize images
  images: {
    unoptimized: false,
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

  // Conditional configuration based on deployment target
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' && {
    // GitHub Pages configuration - only for static export builds
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
