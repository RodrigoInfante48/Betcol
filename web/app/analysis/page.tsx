'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Prediction, FullAnalysis } from '@/lib/types'

const MARKET_LABEL: Record<string, string> = {
  home: '🏠 Local',
  draw: '🤝 Empate',
  away: '✈️ Visitante',
}

function ProbBar({ label, home, draw, away }: { label: string; home: number; draw: number; away: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-gray-200">{label}</span>
        <div className="flex gap-3 text-gray-400">
          <span>L: <span className="text-blue-400">{(home * 100).toFixed(0)}%</span></span>
          <span>E: <span className="text-gray-300">{(draw * 100).toFixed(0)}%</span></span>
          <span>V: <span className="text-orange-400">{(away * 100).toFixed(0)}%</span></span>
        </div>
      </div>
      <div className="flex h-3 rounded overflow-hidden gap-0.5">
        <div className="bg-blue-500 transition-all" style={{ width: `${home * 100}%` }} />
        <div className="bg-gray-500 transition-all" style={{ width: `${draw * 100}%` }} />
        <div className="bg-orange-500 transition-all" style={{ width: `${away * 100}%` }} />
      </div>
    </div>
  )
}

export default function AnalysisPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [analysis, setAnalysis] = useState<FullAnalysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('predictions').select('*, matches(*)').then(({ data }) => {
      if (data?.length) {
        setPredictions(data as unknown as Prediction[])
        setSelectedId((data[0] as any).event_id)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selectedId === null) return
    setAnalysis([])
    supabase.from('full_analysis').select('*').eq('event_id', selectedId).then(({ data }) => {
      if (data) setAnalysis(data as FullAnalysis[])
    })
  }, [selectedId])

  const pred = predictions.find(p => p.event_id === selectedId)

  if (loading) return <div className="text-gray-400 mt-16 text-center">Cargando análisis...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🔍 Análisis Detallado</h1>

      <div className="mb-6">
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Seleccionar partido</label>
        <select
          value={selectedId ?? ''}
          onChange={e => setSelectedId(Number(e.target.value))}
          className="w-full max-w-lg bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
        >
          {predictions.map(p => (
            <option key={p.event_id} value={p.event_id}>
              {p.matches?.home_team} vs {p.matches?.away_team}
            </option>
          ))}
        </select>
      </div>

      {pred?.matches && (
        <>
          <h2 className="text-xl font-semibold mb-5">
            <span className="text-blue-400">{pred.matches.home_team}</span>
            <span className="text-gray-500 mx-3">vs</span>
            <span className="text-orange-400">{pred.matches.away_team}</span>
            {pred.matches.event_date && (
              <span className="text-gray-500 text-base ml-3">
                — {new Date(pred.matches.event_date + 'T12:00:00Z').toLocaleDateString('es-ES')}
              </span>
            )}
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Probability sources */}
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="font-semibold mb-4 text-sm text-gray-300">Probabilidades por fuente</h3>
              <ProbBar label="Ensemble" home={pred.prob_home} draw={pred.prob_draw} away={pred.prob_away} />
              {pred.elo_prob_home != null && (
                <ProbBar label="ELO" home={pred.elo_prob_home} draw={pred.elo_prob_draw} away={pred.elo_prob_away} />
              )}
              {pred.bsd_prob_home != null && (
                <ProbBar
                  label="BSD"
                  home={pred.bsd_prob_home / 100}
                  draw={(pred.bsd_prob_draw ?? 0) / 100}
                  away={(pred.bsd_prob_away ?? 0) / 100}
                />
              )}
              <div className="flex gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-700">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full" /> Local</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-gray-500 rounded-full" /> Empate</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-500 rounded-full" /> Visitante</span>
              </div>
            </div>

            {/* Value per market */}
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="font-semibold mb-4 text-sm text-gray-300">Análisis de value por mercado</h3>
              {analysis.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin análisis de mercados disponible</p>
              ) : analysis.map(a => (
                <div key={a.market} className="mb-4 pb-4 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{MARKET_LABEL[a.market] || a.market}</span>
                    {a.is_value && (
                      <span className="text-xs bg-green-900/60 text-green-400 px-2 py-0.5 rounded-full font-medium">
                        Value ✓
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-gray-400">Odd: <span className="text-gray-200 font-mono">{a.odd_bookmaker?.toFixed(2) ?? '—'}</span></span>
                    <span className="text-gray-400">P.modelo: <span className="text-gray-200">{a.prob_modelo != null ? (a.prob_modelo * 100).toFixed(1) + '%' : '—'}</span></span>
                    <span className="text-gray-400">P.implícita: <span className="text-gray-200">{a.implied_prob != null ? (a.implied_prob * 100).toFixed(1) + '%' : '—'}</span></span>
                    <span className="text-gray-400">Edge: <span className={a.edge > 0 ? 'text-green-400' : 'text-red-400'}>{a.edge != null ? (a.edge > 0 ? '+' : '') + (a.edge * 100).toFixed(1) + '%' : '—'}</span></span>
                    <span className="text-gray-400">EV: <span className={a.ev > 0 ? 'text-green-400' : 'text-red-400'}>{a.ev != null ? (a.ev > 0 ? '+' : '') + (a.ev * 100).toFixed(1) + '%' : '—'}</span></span>
                    <span className="text-gray-400">Kelly: <span className="text-yellow-400">{a.kelly_pct != null ? (a.kelly_pct * 100).toFixed(1) + '%' : '—'}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model details */}
          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="font-semibold mb-4 text-sm text-gray-300">Detalles del modelo</h3>
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Marcador prob. (Poisson)', value: pred.poisson_most_likely_score, cls: 'text-green-400 font-mono text-xl' },
                { label: 'λ local (goles esperados)', value: pred.poisson_lambda_home?.toFixed(2) ?? '—', cls: 'font-mono text-xl' },
                { label: 'λ visitante (goles esperados)', value: pred.poisson_lambda_away?.toFixed(2) ?? '—', cls: 'font-mono text-xl' },
                { label: 'Confianza ensemble', value: (pred.confidence * 100).toFixed(1) + '%', cls: 'text-xl font-bold' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                  <p className={item.cls}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
