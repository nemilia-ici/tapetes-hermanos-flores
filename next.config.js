/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // Ocultar X-Powered-By
  reactStrictMode: true,
  swcMinify: true,

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },

  // Configuración de dominios permitidos
  allowedDevOrigins: ['192.168.3.24', 'localhost'],
}

module.exports = nextConfig
