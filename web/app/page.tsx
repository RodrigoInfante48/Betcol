'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Prediction } from '@/lib/types'

function confClass(val: number) {
  if (val >= 60) return 'bg-green-900/60 text-green-300'
  if (val >= 40) return 'bg-yellow-900/60 text-yellow-300'
  return 'bg-red-900/60 text-red-300'
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [teamFilter, setTeamFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('Fecha')
  const [minConf, setMinConf] = useState(0)

  useEffect(() => {
    supabase
      .from('predictions')
      .select('*, matches(*)')
      .then(({ data, error }) => {
        if (!error && data) setPredictions(data as unknown as Prediction[])
        setLoading(false)
      })
  }, [])

  const allTeams = useMemo(() => {
    const s = new Set<string>()
    predictions.forEach(p => {
      if (p.matches) { s.add(p.matches.home_team); s.add(p.matches.away_team) }
    })
    return Array.from(s).sort()
  }, [predictions])

  const filtered = useMemo(() => {
    let data = [...predictions].filter(p => p.confidence >= minConf / 100)
    if (teamFilter.length > 0) {
      data = data.filter(p =>
        p.matches && (teamFilter.includes(p.matches.home_team) || teamFilter.includes(p.matches.away_team))
      )
    }
    if (sortBy === 'Confianza del modelo') {
      data.sort((a, b) => b.confidence - a.confidence)
    } else if (sortBy === 'Favorito más claro') {
      data.sort((a, b) =>
        Math.max(b.prob_home, b.prob_draw, b.prob_away) - Math.max(a.prob_home, a.prob_draw, a.prob_away)
      )
    } else {
      data.sort((a, b) =>
        new Date(a.matches?.event_date || 0).getTime() - new Date(b.matches?.event_date || 0).getTime()
      )
    }
    return data
  }, [predictions, teamFilter, sortBy, minConf])

  if (loading) return <div className="text-gray-400 mt-16 text-center">Cargando predicciones...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🏆 Predicciones — Fase de Grupos</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Filtrar por equipo</label>
          <select
            multiple
            value={teamFilter}
            onChange={e => setTeamFilter(Array.from(e.target.selectedOptions, o => o.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm h-24 focus:outline-none focus:border-green-500"
          >
            {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Ordenar por</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
          >
            {['Fecha', 'Confianza del modelo', 'Favorito más claro'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Confianza mínima: <span className="text-green-400">{minConf}%</span>
          </label>
          <input
            type="range" min={0} max={100} step={5} value={minConf}
            onChange={e => setMinConf(Number(e.target.value))}
            className="w-full mt-3 accent-green-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Partido</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Favorito</th>
              <th className="px-4 py-3 text-right">P(local)%</th>
              <th className="px-4 py-3 text-right">P(empate)%</th>
              <th className="px-4 py-3 text-right">P(visit.)%</th>
              <th className="px-4 py-3 text-left">Marcador</th>
              <th className="px-4 py-3 text-right">Confianza</th>
              <th className="px-4 py-3 text-right">λ local</th>
              <th className="px-4 py-3 text-right">λ visit.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                  No hay partidos con los filtros actuales
                </td>
              </tr>
            ) : filtered.map((p, i) => {
              const m = p.matches
              if (!m) return null
              const winner = p.predicted_winner === 'home' ? m.home_team
                : p.predicted_winner === 'away' ? m.away_team : 'Empate'
              const conf = Math.round(p.confidence * 100)
              const dateStr = m.event_date
                ? new Date(m.event_date + 'T12:00:00Z').toLocaleDateString('es-ES')
                : '—'
              return (
                <tr key={p.event_id} className={`border-t border-gray-800 hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/60'}`}>
                  <td className="px-4 py-3 font-medium">{m.home_team} vs {m.away_team}</td>
                  <td className="px-4 py-3 text-gray-400">{dateStr}</td>
                  <td className="px-4 py-3 text-green-400">{winner}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{(p.prob_home * 100).toFixed(1)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-400">{(p.prob_draw * 100).toFixed(1)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{(p.prob_away * 100).toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-yellow-400">{p.poisson_most_likely_score}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${confClass(conf)}`}>{conf}%</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-500">{p.poisson_lambda_home?.toFixed(2) ?? '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-500">{p.poisson_lambda_away?.toFixed(2) ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-600">Mostrando {filtered.length} de {predictions.length} partidos</p>
    </div>
  )
}
