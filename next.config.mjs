/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    turbopack: {
      resolveAlias: {
        'framer-motion': false,
      },
      cacheDir: '.turbo-cache-invalidated',
    },
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  onDemandEntries: {
    maxInactiveAge: 200,
    pagesBufferLength: 1,
  },
  cacheMaxMemorySize: 0,
  staticPageGenerationTimeout: 120,
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

export default nextConfig
