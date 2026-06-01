'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { ValueBet } from '@/lib/types'

const BET_MAP: Record<string, string> = { home: '🏠 Local', draw: '🤝 Empate', away: '✈️ Visitante' }

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-green-400 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1 truncate">{sub}</p>}
    </div>
  )
}

export default function ValueBetsPage() {
  const [bets, setBets] = useState<ValueBet[]>([])
  const [loading, setLoading] = useState(true)
  const [minEdge, setMinEdge] = useState(5)
  const [minEv, setMinEv] = useState(0)
  const [market, setMarket] = useState('Todos')

  useEffect(() => {
    supabase
      .from('value_bets')
      .select('*')
      .order('best_ev', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setBets(data as ValueBet[])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    let data = bets.filter(b => b.edge_best >= minEdge / 100 && b.best_ev >= minEv / 100)
    if (market !== 'Todos') {
      const map: Record<string, string> = { Local: 'home', Empate: 'draw', Visitante: 'away' }
      data = data.filter(b => b.best_bet === map[market])
    }
    return data
  }, [bets, minEdge, minEv, market])

  const metrics = useMemo(() => {
    if (!bets.length) return null
    const avgEdge = bets.reduce((s, b) => s + b.edge_best, 0) / bets.length
    const maxKelly = bets.reduce((m, b) => b.best_kelly > m.best_kelly ? b : m, bets[0])
    return { total: bets.length, top: bets[0], avgEdge, maxKelly }
  }, [bets])

  if (loading) return <div className="text-gray-400 mt-16 text-center">Cargando value bets...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">💰 Value Bets Detectadas</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Value bets" value={metrics?.total ?? 0} />
        <MetricCard
          label="Mayor EV"
          value={metrics ? `+${(metrics.top.best_ev * 100).toFixed(1)}%` : 'N/A'}
          sub={metrics?.top.match_label}
        />
        <MetricCard
          label="Mayor Kelly"
          value={metrics ? `${(metrics.maxKelly.best_kelly * 100).toFixed(1)}%` : 'N/A'}
          sub={metrics?.maxKelly.match_label}
        />
        <MetricCard
          label="Edge promedio"
          value={metrics ? `${(metrics.avgEdge * 100).toFixed(1)}%` : 'N/A'}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Edge mínimo: <span className="text-green-400">{minEdge}%</span>
          </label>
          <input type="range" min={0} max={20} value={minEdge}
            onChange={e => setMinEdge(Number(e.target.value))} className="w-full accent-green-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            EV mínimo: <span className="text-green-400">{minEv}%</span>
          </label>
          <input type="range" min={0} max={30} value={minEv}
            onChange={e => setMinEv(Number(e.target.value))} className="w-full accent-green-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Mercado</label>
          <select value={market} onChange={e => setMarket(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500">
            {['Todos', 'Local', 'Empate', 'Visitante'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-800/30 rounded-lg border border-gray-800">
          No hay value bets con los filtros actuales
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Partido</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Mercado</th>
                <th className="px-4 py-3 text-right">Odd</th>
                <th className="px-4 py-3 text-right">P.modelo</th>
                <th className="px-4 py-3 text-right">P.implícita</th>
                <th className="px-4 py-3 text-right">Edge</th>
                <th className="px-4 py-3 text-right">EV</th>
                <th className="px-4 py-3 text-right">Kelly%</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const dateStr = b.event_date
                  ? new Date(b.event_date + 'T12:00:00Z').toLocaleDateString('es-ES')
                  : '—'
                return (
                  <tr key={b.id} className={`border-t border-gray-800 hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/60'}`}>
                    <td className="px-4 py-3 font-medium">{b.match_label}</td>
                    <td className="px-4 py-3 text-gray-400">{dateStr}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs font-medium">
                        {BET_MAP[b.best_bet] || b.best_bet}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{b.odd_best?.toFixed(2) ?? '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{b.prob_modelo_best != null ? (b.prob_modelo_best * 100).toFixed(1) + '%' : '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-400">{b.implied_prob_best != null ? (b.implied_prob_best * 100).toFixed(1) + '%' : '—'}</td>
                    <td className={`px-4 py-3 text-right font-semibold tabular-nums ${b.edge_best > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {b.edge_best > 0 ? '+' : ''}{(b.edge_best * 100).toFixed(1)}%
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold tabular-nums ${b.best_ev > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {b.best_ev > 0 ? '+' : ''}{(b.best_ev * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-yellow-400">{(b.best_kelly * 100).toFixed(1)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-800/40 rounded-lg border border-gray-700 text-sm text-gray-400">
        <strong className="text-gray-200">¿Qué es un value bet?</strong>{' '}
        Una apuesta tiene valor cuando tu estimación de probabilidad es mayor a la del bookmaker.
        El Kelly % indica qué fracción del bankroll apostar según el criterio matemático de Kelly.
      </div>
    </div>
  )
}
