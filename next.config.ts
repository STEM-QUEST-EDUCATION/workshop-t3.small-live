// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dashboard.codeparrot.ai',
        pathname: '/api/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'grid.codepen.io',
        pathname: '/**',
      },
      // Add any additional domains below as needed
    ],
  },
  // async rewrites() {
  //   return {
  //     beforeFiles: [
  //       // Add any necessary rewrites here
  //     ],
  //   };
  // },
};

module.exports = nextConfig;
