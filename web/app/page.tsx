'use client'
import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { GROUP_STAGE_MATCHES, TEAMS, getMatchesByDate } from '@/lib/worldcupData'
import { calculateProbabilities, pct } from '@/lib/bettingCalc'

const GROUP_COLORS: Record<string, string> = {
  A: 'bg-rose-900/40 text-rose-300 border-rose-700/40',
  B: 'bg-orange-900/40 text-orange-300 border-orange-700/40',
  C: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
  D: 'bg-lime-900/40 text-lime-300 border-lime-700/40',
  E: 'bg-green-900/40 text-green-300 border-green-700/40',
  F: 'bg-teal-900/40 text-teal-300 border-teal-700/40',
  G: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/40',
  H: 'bg-sky-900/40 text-sky-300 border-sky-700/40',
  I: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  J: 'bg-violet-900/40 text-violet-300 border-violet-700/40',
  K: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  L: 'bg-fuchsia-900/40 text-fuchsia-300 border-fuchsia-700/40',
}

function FormBadge({ r }: { r: string }) {
  const cls = r === 'W' ? 'bg-green-500 text-white' : r === 'L' ? 'bg-red-500 text-white' : 'bg-gray-400 dark:bg-gray-600 text-gray-900 dark:text-gray-200'
  return <span className={`inline-flex w-5 h-5 rounded-full text-xs font-bold items-center justify-center ${cls}`}>{r === 'W' ? 'G' : r === 'D' ? 'E' : 'P'}</span>
}

export default function PartidosPage() {
  const [groupFilter, setGroupFilter] = useState<string>('Todos')
  const [dayFilter, setDayFilter] = useState<string>('Todos')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadMsg, setUploadMsg] = useState('')

  const allDates = useMemo(() => {
    const s = new Set(GROUP_STAGE_MATCHES.map(m => m.date))
    return Array.from(s).sort()
  }, [])

  const filtered = useMemo(() => {
    return GROUP_STAGE_MATCHES.filter(m => {
      if (groupFilter !== 'Todos' && m.group !== groupFilter) return false
      if (dayFilter !== 'Todos' && m.date !== dayFilter) return false
      return true
    })
  }, [groupFilter, dayFilter])

  const byDate = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const m of filtered) {
      const list = map.get(m.date) ?? []
      list.push(m)
      map.set(m.date, list)
    }
    return map
  }, [filtered])

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split('\n').length
      setUploadMsg(`Archivo cargado: ${file.name} (${lines} líneas). Próximamente: análisis automático del calendario.`)
    }
    reader.readAsText(file)
  }

  const formatDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  const formatTime = (t: string) => {
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    const ampm = hour < 12 ? 'a.m.' : 'p.m.'
    const h12 = hour % 12 || 12
    return `${h12}:${m} ${ampm}`
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Copa Mundial FIFA 2026</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fase de grupos · Todos los horarios en hora Colombia (GMT-5)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Actualizar calendario
          </button>
          <input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {uploadMsg && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700/40 rounded-lg text-green-700 dark:text-green-300 text-sm">
          {uploadMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Grupo</label>
          <div className="flex gap-1 flex-wrap">
            {['Todos', 'A','B','C','D','E','F','G','H','I','J','K','L'].map(g => (
              <button
                key={g}
                onClick={() => setGroupFilter(g)}
                className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                  groupFilter === g
                    ? 'bg-green-500 text-white border-green-500'
                    : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setDayFilter('Todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            dayFilter === 'Todos' ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          Todos
        </button>
        {allDates.map(d => {
          const label = new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
          return (
            <button
              key={d}
              onClick={() => setDayFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                dayFilter === d ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Match list grouped by date */}
      {Array.from(byDate.entries()).map(([date, matches]) => (
        <div key={date} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200 dark:border-gray-800 capitalize">
            {formatDate(date)}
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {matches.map(match => {
              const home = TEAMS[match.homeTeam]
              const away = TEAMS[match.awayTeam]
              if (!home || !away) return null
              const probs = calculateProbabilities(home, away)

              return (
                <Link
                  key={match.id}
                  href={`/partidos/${match.id}`}
                  className="group block bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-green-500/40 hover:bg-gray-100 dark:hover:bg-gray-900/80 transition-all"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${GROUP_COLORS[match.group]}`}>
                      Grupo {match.group} · J{match.matchday}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatTime(match.time)}</span>
                  </div>

                  {/* Teams row */}
                  <div className="flex items-center gap-3">
                    {/* Home team */}
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xl">{home.flag}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{home.name}</p>
                        <div className="flex gap-0.5 mt-1">
                          {home.form.slice(-3).map((r, i) => <FormBadge key={i} r={r} />)}
                        </div>
                      </div>
                    </div>

                    {/* Center: probabilities */}
                    <div className="flex flex-col items-center gap-1.5 min-w-[90px]">
                      <div className="flex gap-1 text-xs font-bold">
                        <span className="text-blue-500 dark:text-blue-400 w-8 text-center">{pct(probs.pHome)}</span>
                        <span className="text-gray-400 dark:text-gray-500 w-8 text-center">{pct(probs.pDraw)}</span>
                        <span className="text-orange-400 w-8 text-center">{pct(probs.pAway)}</span>
                      </div>
                      <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
                        <div className="bg-blue-500 transition-all" style={{ width: pct(probs.pHome) }} />
                        <div className="bg-gray-400 dark:bg-gray-600 transition-all" style={{ width: pct(probs.pDraw) }} />
                        <div className="bg-orange-500 transition-all" style={{ width: pct(probs.pAway) }} />
                      </div>
                      <div className="flex gap-2 text-[10px] text-gray-400 dark:text-gray-600">
                        <span>L</span><span>E</span><span>V</span>
                      </div>
                    </div>

                    {/* Away team */}
                    <div className="flex-1 flex items-center gap-2 flex-row-reverse text-right">
                      <span className="text-xl">{away.flag}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{away.name}</p>
                        <div className="flex gap-0.5 mt-1 justify-end">
                          {away.form.slice(-3).map((r, i) => <FormBadge key={i} r={r} />)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: favorite tag + cta */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-800/60">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      Favorito: <span className="text-green-600 dark:text-green-400 font-medium">{probs.favoritoName}</span>
                      <span className="text-gray-400 dark:text-gray-600 ml-1">({pct(probs.favoritoPct)})</span>
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-600 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex items-center gap-1">
                      Ver análisis
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      {byDate.size === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 bg-gray-50/40 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-800">
          No hay partidos con los filtros seleccionados.
        </div>
      )}

      <p className="text-xs text-gray-300 dark:text-gray-700 mt-4">
        Probabilidades calculadas con base en los últimos 10 partidos internacionales de cada selección.
        No son recomendaciones de apuesta.
      </p>
    </div>
  )
}
