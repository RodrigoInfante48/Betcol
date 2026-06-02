'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  {
    href: '/',
    icon: '🗓️',
    label: 'Partidos',
    sub: 'Calendario y análisis',
    exact: true,
  },
  {
    href: '/llaves',
    icon: '🏟️',
    label: 'Llaves del Mundial',
    sub: 'Grupos y eliminatorias',
    exact: false,
  },
  {
    href: '/comparar',
    icon: '⚔️',
    label: 'Comparar Equipos',
    sub: 'Estadísticas frente a frente',
    exact: false,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="fixed w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col z-10">
      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-800">
        <Link href="/" className="block">
          <h1 className="text-xl font-extrabold text-green-400 tracking-tight">BETCOL</h1>
          <p className="text-gray-500 text-xs mt-0.5">Copa Mundial FIFA 2026</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(link => {
          const active = isActive(link.href, link.exact)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'text-gray-400 hover:bg-gray-800/70 hover:text-gray-100 border border-transparent'
              )}
            >
              <span className="text-lg leading-none flex-shrink-0">{link.icon}</span>
              <div className="min-w-0">
                <p className={clsx('leading-tight font-semibold truncate', active ? 'text-green-400' : 'text-gray-200')}>
                  {link.label}
                </p>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5 truncate">{link.sub}</p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer info */}
      <div className="px-5 py-4 border-t border-gray-800 space-y-2">
        <div className="text-xs text-gray-500">
          <p className="font-semibold text-gray-400 mb-1.5">Copa Mundial 2026</p>
          <p>48 selecciones · 12 grupos</p>
          <p className="mt-0.5">11 jun – 19 jul 2026</p>
          <p className="mt-0.5">🇺🇸 🇨🇦 🇲🇽 USA · Canadá · México</p>
        </div>
        <div className="pt-2 border-t border-gray-800/60">
          <p className="text-[10px] text-gray-700">
            Probabilidades calculadas a partir de estadísticas históricas de selecciones
          </p>
        </div>
      </div>
    </aside>
  )
}
