/** @type {import('next').NextConfig} */
const nextConfig = {  
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    experimental: { scrollRestoration: true },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'development' ? false : true
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
