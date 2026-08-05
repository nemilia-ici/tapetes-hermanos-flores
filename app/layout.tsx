import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Tapetes Hermanos Flores | Lavado Profesional de Tapetes en CDMX',
  description: 'Lavado profesional de tapetes persas, modernos y de mano. Más de 20 años de experiencia en CDMX. Recogida a domicilio y limpieza con técnicas tradicionales.',
  keywords: 'lavado de tapetes, tapetes persas, limpieza de tapetes, CDMX, tapetes modernos',
  authors: [{ name: 'Tapetes Hermanos Flores' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Tapetes Hermanos Flores | Lavado Profesional de Tapetes',
    description: 'Devolvemos la vida a tus tapetes con técnicas tradicionales.',
    url: 'https://tapetesflores.com',
    type: 'website',
    images: [
      {
        url: 'https://tapetesflores.com/images/hero-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Tapetes Hermanos Flores',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${playfair.variable} font-sans`}>
        <GoogleAnalytics GA_MEASUREMENT_ID="G-TU_ID_AQUI" />
        {children}
      </body>
    </html>
  )
}
