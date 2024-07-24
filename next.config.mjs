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
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
