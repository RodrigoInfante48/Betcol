'use client'

import { useEffect, useCallback } from 'react'
import { TEAM_PROFILES, type Player } from '@/lib/worldcupData'

interface Props {
  teamName: string
  onClose: () => void
}

const POSITION_ORDER: Record<Player['position'], number> = { GK: 0, DF: 1, MF: 2, FW: 3 }
const POSITION_LABEL: Record<Player['position'], string> = { GK: 'Portero', DF: 'Defensa', MF: 'Mediocampista', FW: 'Delantero' }

export default function TeamProfileModal({ teamName, onClose }: Props) {
  const profile = TEAM_PROFILES[teamName]

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!profile) return null

  const sorted = [...profile.players].sort(
    (a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position] || a.number - b.number,
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 text-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {/* Crest */}
            <img
              src={profile.crestImageUrl}
              alt={`${teamName} crest`}
              className="h-14 w-14 object-contain"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
            <div>
              <div className="flex items-center gap-2">
                {/* Flag */}
                <img
                  src={profile.flagImageUrl}
                  alt={`${teamName} flag`}
                  className="h-5 w-8 object-cover rounded-sm border border-gray-600"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <h2 className="text-xl font-bold">{teamName}</h2>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">
                DT: <span className="text-gray-200">{profile.coach}</span>
                <span className="mx-2 text-gray-600">·</span>
                <span className="font-mono text-green-400">{profile.formation}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none ml-4"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Player table */}
        <div className="px-6 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-700">
                <th className="text-right pr-3 pb-2 w-8">#</th>
                <th className="text-left pb-2">Jugador</th>
                <th className="text-left pb-2">Pos.</th>
                <th className="text-left pb-2">Club</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const isNewGroup =
                  i === 0 || sorted[i - 1].position !== p.position

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
                      <td className="py-2 font-medium">{p.name}</td>
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
                      <td className="py-2 text-gray-300">{p.club}</td>
                    </tr>
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
