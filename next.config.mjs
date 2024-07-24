/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config) => {
  //   config.externals.push({
  //     "utf-8-validate": "commonjs utf-8-validate",
  //     bufferUtil: "commonjs bufferutil",
  //   });

  //   return config;
  // },
  async rewrites() {
    return [
      {
        source: "/api/socket/io",
        destination:
          "https://nextjs-discord-clone-production-52c3.up.railway.app/api/socket/io",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nextjs-discord-clone-production-52c3.up.railway.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
