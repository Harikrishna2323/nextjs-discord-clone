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
          "https://nextjs-discord-clone-production-52c3.up.railway.app//api/socket/io",
      },
    ];
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
