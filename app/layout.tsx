import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'C.O.A | Cursos Online Avanzados',
  description:
    'Academia de programación online (C.O.A). Aprende Python, desarrollo web, bases de datos e inteligencia artificial con cursos prácticos y proyectos reales.',
  icons: {
    icon: '/coa-app-icon.png',
    shortcut: '/coa-app-icon.png',
    apple: '/coa-app-icon.png',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#4f5fe0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`light ${poppins.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
