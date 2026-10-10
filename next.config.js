const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  cleanDistDir: !process.env.NEXT_BUILD_DIR,
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas', 'mammoth'],
  outputFileTracingIncludes: {
    '/api/admin/upload-doc': [
      // PDF.js loads its worker and canvas bindings dynamically, beyond NFT's trace.
      './node_modules/pdf-parse/dist/pdf-parse/cjs/**/*',
      './node_modules/pdf-parse/dist/pdf-parse/esm/**/*',
      './node_modules/pdf-parse/package.json',
      './node_modules/pdfjs-dist/legacy/build/*.mjs',
      './node_modules/pdfjs-dist/package.json',
      './node_modules/@napi-rs/canvas/**/*',
      './node_modules/@napi-rs/canvas-*/**/*',
    ],
  },
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com", "via.placeholder.com"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
