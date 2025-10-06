/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    // Ensure that API routes can use Node.js modules like fs/path/pino
    serverComponentsExternalPackages: ['pino'],
  },
  
  // This ensures all API routes use the Node.js runtime by default
  // (so you don't have to specify export const runtime = 'nodejs' in every file)
  outputFileTracingIncludes: {
    '/api/**': ['./server/**', './lib/**', './logs/**'],
  },
};

export default nextConfig;
