/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  // images: {
  //   remotePatterns: [
  //     // Configuración para AWS S3
  //     {
  //       protocol: 'https',
  //       hostname: '*.s3.amazonaws.com',
  //       port: '',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: '*.s3.*.amazonaws.com',
  //       port: '',
  //     },
  //   ],
  // },
};

module.exports = nextConfig;
