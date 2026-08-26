/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'prisma']
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Fix for require() of ES modules
            config.resolve.alias['@'] = __dirname + '/src';
        }
        return config;
    }
};

module.exports = nextConfig;
