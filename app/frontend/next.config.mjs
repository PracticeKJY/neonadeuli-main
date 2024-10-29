/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `${"http://localhost:8000"}/:path*`,
        // source: "/api/:path*",
        // destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
