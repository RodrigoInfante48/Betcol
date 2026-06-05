'use client'

import { useEffect, useCallback, useState } from 'react'
import { TEAM_PROFILES, TEAMS, type Player } from '@/lib/worldcupData'

interface Props {
  teamName: string
  onClose: () => void
}

type Tab = 'plantilla' | 'estadisticas'

const POSITION_ORDER: Record<Player['position'], number> = { GK: 0, DF: 1, MF: 2, FW: 3 }
const POSITION_LABEL: Record<Player['position'], string> = { GK: 'Porteros', DF: 'Defensas', MF: 'Mediocampistas', FW: 'Delanteros' }

const RESULT_COLOR: Record<string, string> = {
  W: 'bg-green-500 text-white',
  D: 'bg-yellow-500 text-black',
  L: 'bg-red-500 text-white',
}

export default function TeamProfileModal({ teamName, onClose }: Props) {
  const profile = TEAM_PROFILES[teamName]
  const stats = TEAMS[teamName]
  const [tab, setTab] = useState<Tab>('plantilla')
  const [visible, setVisible] = useState(false)

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 200)
  }, [onClose])

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() },
    [handleClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => setVisible(true))
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!profile) return null

  const sorted = [...profile.players].sort(
    (a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position] || a.number - b.number,
  )

  const totalMatches = stats ? stats.wins + stats.draws + stats.losses : 0
  const winPct = totalMatches > 0 ? Math.round((stats!.wins / totalMatches) * 100) : 0
  const goalDiff = stats ? stats.goalsFor - stats.goalsAgainst : 0

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-gray-900 text-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col transition-transform duration-200 ${visible ? 'translate-y-0 scale-100' : 'translate-y-8 sm:translate-y-0 sm:scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 bg-gray-900 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <img
              src={profile.crestImageUrl}
              alt={`${teamName} crest`}
              className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <div>
              <div className="flex items-center gap-2">
                <img
                  src={profile.flagImageUrl}
                  alt={`${teamName} flag`}
                  className="h-4 w-6 sm:h-5 sm:w-8 object-cover rounded-sm border border-gray-600"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <h2 className="text-base sm:text-xl font-bold leading-tight">{teamName}</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                DT: <span className="text-gray-200">{profile.coach}</span>
                <span className="mx-2 text-gray-600">·</span>
                <span className="font-mono text-green-400">{profile.formation}</span>
                {stats && (
                  <>
                    <span className="mx-2 text-gray-600">·</span>
                    <span className="text-gray-400">FIFA #{stats.ranking}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none ml-2 flex-shrink-0"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex border-b border-gray-700 px-4 sm:px-6">
          {(['plantilla', 'estadisticas'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2.5 px-3 sm:px-4 text-sm font-medium border-b-2 transition-colors capitalize -mb-px ${
                tab === t
                  ? 'border-green-400 text-green-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {t === 'plantilla' ? 'Plantilla' : 'Estadísticas'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {tab === 'plantilla' && (
            <div className="px-4 sm:px-6 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-700">
                    <th className="text-right pr-3 pb-2 w-8">#</th>
                    <th className="text-left pb-2">Jugador</th>
                    <th className="text-left pb-2">Pos.</th>
                    <th className="text-left pb-2 hidden sm:table-cell">Club</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, i) => {
                    const isNewGroup = i === 0 || sorted[i - 1].position !== p.position
                    return (
                      <>
                        {isNewGroup && (
                          <tr key={`hdr-${p.position}`}>
                            <td colSpan={4} className="pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                              {POSITION_LABEL[p.position]}
                            </td>
                          </tr>
                        )}
                        <tr
                          key={p.number}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="text-right pr-3 py-2 font-mono text-gray-400">{p.number}</td>
                          <td className="py-2 font-medium">
                            <span>{p.name}</span>
                            <span className="sm:hidden text-xs text-gray-400 ml-1.5">{p.club}</span>
                          </td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                              p.position === 'GK' ? 'bg-yellow-500/20 text-yellow-300' :
                              p.position === 'DF' ? 'bg-blue-500/20 text-blue-300' :
                              p.position === 'MF' ? 'bg-green-500/20 text-green-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {p.position}
                            </span>
                          </td>
                          <td className="py-2 text-gray-300 hidden sm:table-cell">{p.club}</td>
                        </tr>
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'estadisticas' && (
            <div className="px-4 sm:px-6 py-4 space-y-6">
              {!stats ? (
                <p className="text-gray-400 text-sm text-center py-8">No hay datos estadísticos disponibles.</p>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Victorias', value: stats.wins, color: 'text-green-400' },
                      { label: 'Empates', value: stats.draws, color: 'text-yellow-400' },
                      { label: 'Derrotas', value: stats.losses, color: 'text-red-400' },
                      { label: '% victorias', value: `${winPct}%`, color: 'text-blue-400' },
                    ].map(card => (
                      <div key={card.label} className="bg-gray-800 rounded-xl p-3 text-center">
                        <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Goals */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Goles (últimos {totalMatches} partidos)</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-bold text-white">{stats.goalsFor}</div>
                        <div className="text-xs text-gray-400 mt-0.5">A favor</div>
                      </div>
                      <div className="text-gray-600 text-2xl">—</div>
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-bold text-white">{stats.goalsAgainst}</div>
                        <div className="text-xs text-gray-400 mt-0.5">En contra</div>
                      </div>
                      <div className="text-gray-600 text-2xl">—</div>
                      <div className="flex-1 text-center">
                        <div className={`text-3xl font-bold ${goalDiff > 0 ? 'text-green-400' : goalDiff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {goalDiff > 0 ? '+' : ''}{goalDiff}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">Diferencia</div>
                      </div>
                    </div>
                  </div>

                  {/* Form strip */}
                  {stats.form.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Forma reciente (más antiguo → más reciente)</h3>
                      <div className="flex flex-wrap gap-2">
                        {stats.form.map((r, i) => (
                          <span
                            key={i}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${RESULT_COLOR[r] ?? 'bg-gray-600 text-white'}`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Per-game averages */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Promedios por partido</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goles anotados</span>
                        <span className="font-semibold">{totalMatches > 0 ? (stats.goalsFor / totalMatches).toFixed(2) : '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goles recibidos</span>
                        <span className="font-semibold">{totalMatches > 0 ? (stats.goalsAgainst / totalMatches).toFixed(2) : '—'}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
