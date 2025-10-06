/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    // Ensure that API routes can use Node.js modules like fs/path/pino
    serverComponentsExternalPackages: ['pino'],
  },
  
};

export default nextConfig;
