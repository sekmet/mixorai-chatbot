/** @type {import('next').NextConfig} */
const nextConfig = {  
    productionBrowserSourceMaps: true,
    reactStrictMode: false,
    experimental: { scrollRestoration: true },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'development' ? false : true
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin' }
          ]
        }
      ];
    },
    images: {
      dangerouslyAllowSVG: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'eu.ui-avatars.com',
          port: '',
          pathname: '/**',
        }
      ]
    }
}

export default nextConfig;
