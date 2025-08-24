/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/JSC-Tracker',  // Set the base path for all assets
  assetPrefix: '/JSC-Tracker/',  // Set the prefix for all assets (note the trailing slash)
  trailingSlash: true,  // Ensure trailing slashes for consistent routing
  images: {
    unoptimized: true,  // Required for static export
  }
}

module.exports = nextConfig
