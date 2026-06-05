import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'Betcol — Mundial 2026',
  description: 'Modelo predictivo para el Mundial 2026',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden">
        <div className="flex">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
