/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['./prisma/**'],
    },
  },
};

module.exports = nextConfig;
