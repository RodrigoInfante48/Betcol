import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Betcol — Mundial 2026',
  description: 'Modelo predictivo para el Mundial 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 ml-64 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  )
}
