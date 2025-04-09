/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // Update the configuration to properly handle binary files like GLB
    config.module.rules.push({
      test: /\.(stl|obj|mtl|gltf|glb)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: false,
          publicPath: '/_next/static/files',
          outputPath: 'static/files',
          name: '[name].[hash].[ext]',
        },
      },
    });
    return config;
  },
  // Ensure Next.js knows these are binary files
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/**/*.wasm']
    }
  }
};

module.exports = nextConfig;