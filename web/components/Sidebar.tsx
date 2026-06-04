'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
}

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

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside
      className={clsx(
        'fixed h-screen bg-gray-900 border-r border-gray-800 flex flex-col z-30 transition-all duration-300',
        // Mobile: drawer slide-in
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: always visible, override translate
        'lg:translate-x-0',
        // Width: full on mobile, responsive on desktop
        collapsed ? 'w-64 lg:w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          'pt-5 pb-4 border-b border-gray-800 flex items-center gap-2',
          collapsed ? 'lg:justify-center px-3' : 'justify-end px-4'
        )}
      >
        <Link href="/" onClick={onCloseMobile} className="block min-w-0">
          {collapsed ? (
            <span className="hidden lg:block text-green-400 font-extrabold text-base tracking-tight">BC</span>
          ) : null}
          <div className={collapsed ? 'lg:hidden' : ''}>
            <h1 className="text-xl font-extrabold text-green-400 tracking-tight">BETCOL</h1>
            <p className="text-gray-500 text-xs mt-0.5">Copa Mundial FIFA 2026</p>
          </div>
        </Link>

        {/* Desktop collapse toggle */}
        <button
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-gray-100 hover:bg-gray-800 transition-colors flex-shrink-0"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expandir panel' : 'Colapsar panel'}
        >
          {collapsed ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className={clsx('flex-1 py-4 space-y-1 overflow-y-auto', collapsed ? 'lg:px-2 px-3' : 'px-3')}>
        {links.map(link => {
          const active = isActive(link.href, link.exact)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onCloseMobile}
              title={collapsed ? link.label : undefined}
              className={clsx(
                'flex items-center rounded-xl text-sm font-medium transition-all',
                collapsed ? 'lg:justify-center lg:px-2 lg:py-3 gap-3 px-3 py-3' : 'gap-3 px-3 py-3',
                active
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'text-gray-400 hover:bg-gray-800/70 hover:text-gray-100 border border-transparent'
              )}
            >
              <span className="text-lg leading-none flex-shrink-0">{link.icon}</span>
              <div className={clsx('min-w-0', collapsed ? 'lg:hidden' : '')}>
                <p className={clsx('leading-tight font-semibold truncate', active ? 'text-green-400' : 'text-gray-200')}>
                  {link.label}
                </p>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5 truncate">{link.sub}</p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={clsx('border-t border-gray-800', collapsed ? 'lg:hidden' : '')}>
        <div className="px-5 py-4 space-y-2">
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
      </div>
    </aside>
  )
}
