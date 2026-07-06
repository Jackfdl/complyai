import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La root reindirizza alla lingua predefinita (IT). EN disponibile su /en.
      { source: "/", destination: "/it", permanent: false },
    ];
  },
};

export default nextConfig;
