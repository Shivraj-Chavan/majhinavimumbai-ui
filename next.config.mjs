/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['69.62.84.113', 'api-dev.majhinavimumbai.com'],
  },
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
    ];
  },
};

export default nextConfig;
