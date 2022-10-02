/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ref: https://github.com/vercel/next.js/tree/canary/examples/svg-components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },

  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'ja',
  },
}

module.exports = nextConfig
