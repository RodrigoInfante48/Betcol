'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/', label: '🏆 Predicciones' },
  { href: '/value-bets', label: '💰 Value Bets' },
  { href: '/analysis', label: '🔍 Análisis' },
  { href: '/head-to-head', label: '⚔️ Head-to-Head' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col p-6 z-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400">BETCOL ⚽</h1>
        <p className="text-gray-400 text-sm mt-1">Modelo predictivo Mundial 2026</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              pathname === link.href
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="pt-6 border-t border-gray-800 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-gray-400 mb-2">Modelo ensemble</p>
        <p>Poisson 45% | ELO 30% | BSD 25%</p>
        <p className="mt-2">Partidos analizados: 50</p>
        <p>Actualizado: {new Date().toLocaleDateString('es-ES')}</p>
      </div>
    </aside>
  )
}
