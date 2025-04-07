import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "zany-invention-w5vpjv5qp525vv6-3000.app.github.dev",
      ],
      // allowedForwardedHosts: [
      //   "localhost:3000",
      //   "zany-invention-w5vpjv5qp525vv6-3000.app.github.dev",
      // ],
      // ^ You might have to use this property depending on your exact version.
    },
  },
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
