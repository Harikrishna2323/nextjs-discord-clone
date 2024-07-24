/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config) => {
  //   config.externals.push({
  //     "utf-8-validate": "commonjs utf-8-validate",
  //     bufferUtil: "commonjs bufferutil",
  //   });

  //   return config;
  // },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "https://nextjs-discord-clone-production-52c3.up.railway.app",
      "nextjs-discord-clone-production-52c3.up.railway.app",
    ],
  },
};

export default nextConfig;
