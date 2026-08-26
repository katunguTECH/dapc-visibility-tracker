/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['@prisma/client', 'prisma'],
    experimental: {},
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs'];
            // Add alias for @
            config.resolve.alias['@'] = __dirname + '/src';
        }
        return config;
    }
};

module.exports = nextConfig;
