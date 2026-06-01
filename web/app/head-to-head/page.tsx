'use client'
import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { TeamStats, Prediction } from '@/lib/types'

function StatBar({
  label, homeVal, awayVal,
  fmt = (v: number) => v.toFixed(2),
}: {
  label: string; homeVal: number; awayVal: number; fmt?: (v: number) => string
}) {
  const total = (homeVal + awayVal) || 1
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-blue-400 font-semibold">{fmt(homeVal)}</span>
        <span className="text-gray-400">{label}</span>
        <span className="text-orange-400 font-semibold">{fmt(awayVal)}</span>
      </div>
      <div className="flex h-2.5 rounded overflow-hidden gap-px">
        <div className="bg-blue-500 transition-all" style={{ width: `${(homeVal / total) * 100}%` }} />
        <div className="bg-orange-500 transition-all" style={{ width: `${(awayVal / total) * 100}%` }} />
      </div>
    </div>
  )
}

function FormBadge({ char }: { char: string }) {
  const cls = char === 'W' ? 'bg-green-500' : char === 'L' ? 'bg-red-500' : 'bg-gray-500'
  return <span className={`inline-block w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center ${cls}`}>{char}</span>
}

export default function HeadToHeadPage() {
  const [teams, setTeams] = useState<TeamStats[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('teams_stats').select('*').order('team_name'),
      supabase.from('predictions').select('*, matches(*)'),
    ]).then(([{ data: t }, { data: p }]) => {
      if (t?.length) {
        setTeams(t as TeamStats[])
        setHomeTeam(t[0].team_name)
        setAwayTeam(t[1]?.team_name || t[0].team_name)
      }
      if (p) setPredictions(p as unknown as Prediction[])
      setLoading(false)
    })
  }, [])

  const homeStats = useMemo(() => teams.find(t => t.team_name === homeTeam), [teams, homeTeam])
  const awayStats = useMemo(() => teams.find(t => t.team_name === awayTeam), [teams, awayTeam])

  const matchPred = useMemo(() => predictions.find(p =>
    p.matches && (
      (p.matches.home_team === homeTeam && p.matches.away_team === awayTeam) ||
      (p.matches.home_team === awayTeam && p.matches.away_team === homeTeam)
    )
  ), [predictions, homeTeam, awayTeam])

  if (loading) return <div className="text-gray-400 mt-16 text-center">Cargando datos...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">⚔️ Head-to-Head</h1>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg">
        {[
          { label: 'Equipo local', value: homeTeam, set: setHomeTeam, cls: 'text-blue-400' },
          { label: 'Equipo visitante', value: awayTeam, set: setAwayTeam, cls: 'text-orange-400' },
        ].map(field => (
          <div key={field.label}>
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">{field.label}</label>
            <select
              value={field.value}
              onChange={e => field.set(e.target.value)}
              className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 ${field.cls}`}
            >
              {teams.map(t => <option key={t.team_id} value={t.team_name}>{t.team_name}</option>)}
            </select>
          </div>
        ))}
      </div>

      {homeStats && awayStats && (
        <>
          <div className="text-center mb-6">
            <p className="text-3xl font-bold">
              <span className="text-blue-400">{homeTeam}</span>
              <span className="text-gray-600 mx-4">vs</span>
              <span className="text-orange-400">{awayTeam}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Stats bars */}
            <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="font-semibold mb-1 text-sm text-gray-300">Estadísticas comparativas</h3>
              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <span className="text-blue-400">{homeTeam}</span>
                <span className="text-orange-400">{awayTeam}</span>
              </div>
              <StatBar label="Goles/partido" homeVal={homeStats.goals_scored_avg} awayVal={awayStats.goals_scored_avg} />
              <StatBar label="Concedidos/partido" homeVal={homeStats.goals_conceded_avg} awayVal={awayStats.goals_conceded_avg} />
              <StatBar label="Win rate" homeVal={homeStats.win_rate} awayVal={awayStats.win_rate} fmt={v => `${(v * 100).toFixed(0)}%`} />
              <StatBar label="ELO rating" homeVal={homeStats.elo_rating || 1500} awayVal={awayStats.elo_rating || 1500} fmt={v => v.toFixed(0)} />
              <StatBar label="Portería a cero" homeVal={homeStats.clean_sheets} awayVal={awayStats.clean_sheets} fmt={v => v.toString()} />
            </div>

            {/* Team cards */}
            <div className="space-y-4">
              {([
                { stats: homeStats, color: 'blue' as const },
                { stats: awayStats, color: 'orange' as const },
              ]).map(({ stats, color }) => (
                <div key={stats.team_id} className={`bg-gray-800 rounded-lg p-4 border ${color === 'blue' ? 'border-blue-500/30' : 'border-orange-500/30'}`}>
                  <h3 className={`font-bold mb-3 ${color === 'blue' ? 'text-blue-400' : 'text-orange-400'}`}>{stats.team_name}</h3>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    {[
                      { label: 'V', val: stats.wins, cls: 'text-green-400' },
                      { label: 'E', val: stats.draws, cls: 'text-yellow-400' },
                      { label: 'D', val: stats.losses, cls: 'text-red-400' },
                    ].map(({ label, val, cls }) => (
                      <div key={label} className="bg-gray-900/60 rounded-lg py-2">
                        <p className={`text-2xl font-bold ${cls}`}>{val}</p>
                        <p className="text-gray-500 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                  {stats.last_5_form && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Forma:</span>
                      <div className="flex gap-1">
                        {stats.last_5_form.split('').map((c, i) => <FormBadge key={i} char={c} />)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {matchPred ? (
            <div className="bg-gray-800 rounded-lg p-5 border border-green-500/30">
              <h3 className="font-semibold mb-4 text-green-400">Predicción del partido (modelo ensemble)</h3>
              <div className="grid grid-cols-4 gap-6 text-center">
                {[
                  {
                    label: `P(${homeTeam})`,
                    value: matchPred.matches?.home_team === homeTeam ? matchPred.prob_home : matchPred.prob_away,
                    cls: 'text-blue-400',
                  },
                  { label: 'P(Empate)', value: matchPred.prob_draw, cls: 'text-gray-300' },
                  {
                    label: `P(${awayTeam})`,
                    value: matchPred.matches?.home_team === homeTeam ? matchPred.prob_away : matchPred.prob_home,
                    cls: 'text-orange-400',
                  },
                  { label: 'Marcador más probable', value: null, score: matchPred.poisson_most_likely_score },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-gray-400 text-xs mb-2">{item.label}</p>
                    {item.score != null ? (
                      <p className="font-mono font-bold text-green-400 text-2xl">{item.score}</p>
                    ) : (
                      <p className={`font-bold text-2xl ${item.cls}`}>{((item.value ?? 0) * 100).toFixed(0)}%</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700 text-center text-gray-500 text-sm">
              No hay partido programado entre estos dos equipos en la fase de grupos
            </div>
          )}
        </>
      )}

      {teams.length === 0 && (
        <div className="text-center py-16 text-gray-500 bg-gray-800/30 rounded-lg border border-gray-800">
          Sin datos de equipos. Ejecuta el pipeline Python y sube los datos a Supabase.
        </div>
      )}
    </div>
  )
}
