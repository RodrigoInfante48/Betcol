'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { TEAMS, GROUP_STAGE_MATCHES } from '@/lib/worldcupData'
import { calculateProbabilities, pctNum } from '@/lib/bettingCalc'

const ALL_TEAM_NAMES = Object.keys(TEAMS).sort((a, b) => a.localeCompare(b, 'es'))

function FormBadge({ r }: { r: string }) {
  const cls = r === 'W' ? 'bg-green-500 text-white' : r === 'L' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-200'
  const lbl = r === 'W' ? 'G' : r === 'D' ? 'E' : 'P'
  return <span className={`inline-flex w-7 h-7 rounded-full text-xs font-bold items-center justify-center ${cls}`}>{lbl}</span>
}

function StatCompare({ label, homeVal, awayVal, higher = 'max', fmt }: {
  label: string; homeVal: number; awayVal: number; higher?: 'max' | 'min'; fmt?: (v: number) => string
}) {
  const f = fmt ?? ((v: number) => v.toFixed(2))
  const homeWins = higher === 'max' ? homeVal > awayVal : homeVal < awayVal
  const awayWins = higher === 'max' ? awayVal > homeVal : awayVal < homeVal
  const total = (homeVal + awayVal) || 1

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className={`font-bold ${homeWins ? 'text-blue-400' : 'text-gray-400'}`}>{f(homeVal)}</span>
        <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
        <span className={`font-bold ${awayWins ? 'text-orange-400' : 'text-gray-400'}`}>{f(awayVal)}</span>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-800">
        <div
          className={`transition-all rounded-l-full ${homeWins ? 'bg-blue-500' : 'bg-blue-800'}`}
          style={{ width: `${(homeVal / total) * 100}%` }}
        />
        <div
          className={`transition-all rounded-r-full ${awayWins ? 'bg-orange-500' : 'bg-orange-800'}`}
          style={{ width: `${(awayVal / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

function TeamSelector({ value, onChange, label, color }: {
  value: string; onChange: (v: string) => void; label: string; color: 'blue' | 'orange'
}) {
  const borderCls = color === 'blue' ? 'border-blue-500/30 focus:border-blue-400' : 'border-orange-500/30 focus:border-orange-400'
  const textCls = color === 'blue' ? 'text-blue-400' : 'text-orange-400'
  const team = TEAMS[value]

  return (
    <div className="flex-1">
      <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${textCls}`}>{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
          {team?.flag ?? '🏳️'}
        </div>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${borderCls} rounded-xl text-sm font-medium ${textCls} focus:outline-none transition-colors appearance-none`}
        >
          {ALL_TEAM_NAMES.map(name => (
            <option key={name} value={name} className="text-gray-200 bg-gray-800">
              {TEAMS[name]?.flag} {name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {team && (
        <p className="text-xs text-gray-600 mt-1.5 pl-1">
          Ranking FIFA #{team.ranking} · Grupo {team.group}
        </p>
      )}
    </div>
  )
}

export default function CompararPage() {
  const [homeTeam, setHomeTeam] = useState('Brasil')
  const [awayTeam, setAwayTeam] = useState('Argentina')

  const home = TEAMS[homeTeam]
  const away = TEAMS[awayTeam]

  const probs = useMemo(() => {
    if (!home || !away) return null
    return calculateProbabilities(home, away)
  }, [home, away])

  const scheduledMatch = useMemo(() => {
    return GROUP_STAGE_MATCHES.find(m =>
      (m.homeTeam === homeTeam && m.awayTeam === awayTeam) ||
      (m.homeTeam === awayTeam && m.awayTeam === homeTeam)
    )
  }, [homeTeam, awayTeam])

  const sameGroup = home?.group === away?.group

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Comparar Equipos</h1>
        <p className="text-gray-400 text-sm">Selecciona dos selecciones para comparar su historial y ver las probabilidades del enfrentamiento</p>
      </div>

      {/* Team selectors */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <TeamSelector value={homeTeam} onChange={v => { if (v !== awayTeam) setHomeTeam(v) }} label="Equipo A" color="blue" />
          <div className="flex flex-col items-center gap-2 mt-4">
            <button
              onClick={() => { const tmp = homeTeam; setHomeTeam(awayTeam); setAwayTeam(tmp) }}
              className="p-2 rounded-full border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
              title="Intercambiar equipos"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            <span className="text-xs text-gray-700">vs</span>
          </div>
          <TeamSelector value={awayTeam} onChange={v => { if (v !== homeTeam) setAwayTeam(v) }} label="Equipo B" color="orange" />
        </div>

        {homeTeam === awayTeam && (
          <p className="text-yellow-400 text-xs mt-3 text-center">Selecciona equipos diferentes</p>
        )}
      </div>

      {home && away && probs && homeTeam !== awayTeam && (
        <>
          {/* Match info if they're in same group */}
          {sameGroup && scheduledMatch && (
            <div className="mb-5 p-4 bg-green-900/20 border border-green-700/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-wide mb-1">
                    ✅ Estos equipos se enfrentan en Grupo {home.group}
                  </p>
                  <p className="text-sm text-gray-300">
                    {new Date(scheduledMatch.date + 'T12:00:00').toLocaleDateString('es-CO', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })} · {scheduledMatch.time.split(':')[0]}:{scheduledMatch.time.split(':')[1]} Colombia
                  </p>
                </div>
                <Link
                  href={`/partidos/${scheduledMatch.id}`}
                  className="text-xs px-3 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  Ver análisis →
                </Link>
              </div>
            </div>
          )}

          {!sameGroup && (
            <div className="mb-5 p-3 bg-gray-900/60 border border-gray-800 rounded-xl">
              <p className="text-xs text-gray-500 text-center">
                Estos equipos están en grupos distintos ({home.group} y {away.group}) — podrían encontrarse en fase eliminatoria
              </p>
            </div>
          )}

          {/* Win probabilities summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: `Gana ${home.name}`, p: pctNum(probs.pHome), flag: home.flag, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-900/10' },
              { label: 'Empate', p: pctNum(probs.pDraw), flag: '🤝', color: 'text-gray-300', border: 'border-gray-700', bg: 'bg-gray-800/20' },
              { label: `Gana ${away.name}`, p: pctNum(probs.pAway), flag: away.flag, color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-900/10' },
            ].map(opt => {
              const isMax = opt.p === Math.max(pctNum(probs.pHome), pctNum(probs.pDraw), pctNum(probs.pAway))
              return (
                <div key={opt.label} className={`${opt.bg} border ${isMax ? 'border-green-500/40 ring-1 ring-green-500/20' : opt.border} rounded-xl p-4 text-center`}>
                  <div className="text-2xl mb-1">{opt.flag}</div>
                  <p className={`text-3xl font-extrabold ${opt.color}`}>{opt.p}%</p>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">{opt.label}</p>
                  {isMax && <p className="text-[10px] text-green-400 mt-1 font-semibold">Favorito</p>}
                </div>
              )
            })}
          </div>

          {/* Stats comparison */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">
              Comparativa estadística <span className="text-gray-600 font-normal">(últimos 10 partidos)</span>
            </h3>

            <div className="flex justify-between text-sm font-semibold mb-5">
              <span className="text-blue-400">{home.flag} {home.name}</span>
              <span className="text-orange-400">{away.name} {away.flag}</span>
            </div>

            <StatCompare label="Victorias" homeVal={home.wins} awayVal={away.wins} fmt={v => `${v}`} />
            <StatCompare label="Goles anotados (prom.)" homeVal={home.goalsFor / 10} awayVal={away.goalsFor / 10} />
            <StatCompare label="Goles recibidos (prom.)" homeVal={home.goalsAgainst / 10} awayVal={away.goalsAgainst / 10} higher="min" />
            <StatCompare label="Ranking FIFA" homeVal={away.ranking} awayVal={home.ranking} higher="max" fmt={v => `#${v}`} />
          </div>

          {/* Team cards with full stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { team: home, color: 'blue' as const, label: 'Equipo A' },
              { team: away, color: 'orange' as const, label: 'Equipo B' },
            ].map(({ team, color, label }) => {
              const borderCls = color === 'blue' ? 'border-blue-500/20' : 'border-orange-500/20'
              const textCls = color === 'blue' ? 'text-blue-400' : 'text-orange-400'
              return (
                <div key={team.name} className={`bg-gray-900 border ${borderCls} rounded-2xl p-5`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{team.flag}</span>
                    <div>
                      <p className={`font-bold text-base ${textCls}`}>{team.name}</p>
                      <p className="text-xs text-gray-500">Grupo {team.group} · FIFA #{team.ranking}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <div className="bg-gray-800/50 rounded-xl py-3">
                      <p className="text-2xl font-extrabold text-green-400">{team.wins}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Victorias</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl py-3">
                      <p className="text-2xl font-extrabold text-yellow-400">{team.draws}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Empates</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl py-3">
                      <p className="text-2xl font-extrabold text-red-400">{team.losses}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Derrotas</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center mb-4">
                    <div className="bg-gray-800/30 rounded-lg py-2.5">
                      <p className="text-lg font-bold text-white">{(team.goalsFor / 10).toFixed(1)}</p>
                      <p className="text-[10px] text-gray-500">Goles/partido</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg py-2.5">
                      <p className="text-lg font-bold text-white">{(team.goalsAgainst / 10).toFixed(1)}</p>
                      <p className="text-[10px] text-gray-500">Recibidos/partido</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Forma reciente</p>
                    <div className="flex gap-1.5">
                      {team.form.map((r, i) => <FormBadge key={i} r={r} />)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Betting summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Resumen de apuestas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-1">Más de 2.5 goles</p>
                <p className="text-xl font-extrabold text-green-400">{pctNum(probs.pOver25)}%</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-1">Menos de 2.5 goles</p>
                <p className="text-xl font-extrabold text-red-400">{pctNum(probs.pUnder25)}%</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-1">Ambos anotan</p>
                <p className="text-xl font-extrabold text-yellow-400">{pctNum(probs.pBothScore)}%</p>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-1">Goles esperados</p>
                <p className="text-xl font-extrabold text-white">{probs.expectedTotal.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-gray-700 mt-6">
        Estadísticas basadas en estimaciones de rendimiento histórico internacional. No son recomendaciones de apuesta.
        Para datos en tiempo real se recomienda integrar football-data.org o API-Football.
      </p>
    </div>
  )
}
