/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: ''
      }
    ]
  }
};

module.exports = nextConfig;
