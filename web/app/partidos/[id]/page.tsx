'use client'
import { useState } from 'react'
import Link from 'next/link'
import { getMatchById, TEAMS, GROUP_STAGE_MATCHES } from '@/lib/worldcupData'
import { calculateProbabilitiesForMatch, pct, pctNum } from '@/lib/bettingCalc'
import TeamProfileModal from '@/components/TeamProfileModal'

function ProbCircle({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100)
  const size = 96
  const r = 38
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d1d5db" strokeWidth="8" className="dark:[stroke:#374151]" />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-extrabold leading-none" style={{ color }}>{pct}%</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium text-center">{label}</p>
    </div>
  )
}

function StatRow({ label, homeVal, awayVal, fmt }: {
  label: string
  homeVal: number
  awayVal: number
  fmt?: (v: number) => string
}) {
  const f = fmt ?? ((v: number) => v.toFixed(1))
  const total = (homeVal + awayVal) || 1
  const homePct = (homeVal / total) * 100
  const awayPct = (awayVal / total) * 100

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-blue-500 dark:text-blue-300 font-semibold">{f(homeVal)}</span>
        <span className="text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-wide">{label}</span>
        <span className="text-orange-500 dark:text-orange-300 font-semibold">{f(awayVal)}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-px bg-gray-200 dark:bg-gray-800">
        <div className="bg-blue-500 transition-all rounded-l-full" style={{ width: `${homePct}%` }} />
        <div className="bg-orange-500 transition-all rounded-r-full" style={{ width: `${awayPct}%` }} />
      </div>
    </div>
  )
}

function BettingCard({
  title, icon, optionA, optionB, pctA, pctB, colorA, colorB
}: {
  title: string; icon: string
  optionA: string; optionB: string
  pctA: number; pctB: number
  colorA: string; colorB: string
}) {
  const winner = pctA >= pctB ? 'A' : 'B'
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className={`rounded-lg p-3 text-center border ${winner === 'A' ? 'border-green-500/40 bg-green-500/15' : 'border-gray-200 dark:border-gray-800 bg-gray-200/40 dark:bg-gray-800/40'}`}>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 truncate">{optionA}</p>
          <p className="text-xl font-extrabold" style={{ color: colorA }}>{pctA}%</p>
        </div>
        <div className={`rounded-lg p-3 text-center border ${winner === 'B' ? 'border-green-500/40 bg-green-500/15' : 'border-gray-200 dark:border-gray-800 bg-gray-200/40 dark:bg-gray-800/40'}`}>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 truncate">{optionB}</p>
          <p className="text-xl font-extrabold" style={{ color: colorB }}>{pctB}%</p>
        </div>
      </div>
    </div>
  )
}

function FormBadge({ r }: { r: string }) {
  const cls = r === 'W' ? 'bg-green-500 text-white' : r === 'L' ? 'bg-red-500 text-white' : 'bg-gray-400 dark:bg-gray-600 text-gray-900 dark:text-gray-200'
  const lbl = r === 'W' ? 'G' : r === 'D' ? 'E' : 'P'
  return <span className={`inline-flex w-6 h-6 rounded-full text-xs font-bold items-center justify-center ${cls}`}>{lbl}</span>
}

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const match = getMatchById(id)
  const [selectedTeamProfile, setSelectedTeamProfile] = useState<string | null>(null)

  if (!match) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-lg mb-4">Partido no encontrado</p>
        <Link href="/" className="text-green-600 dark:text-green-400 hover:underline text-sm">← Volver a partidos</Link>
      </div>
    )
  }

  const home = TEAMS[match.homeTeam]
  const away = TEAMS[match.awayTeam]

  if (!home || !away) {
    return <div className="text-gray-400 dark:text-gray-500 p-8">Datos de equipo no disponibles.</div>
  }

  const probs = calculateProbabilitiesForMatch(match.id, home, away)

  const formatDate = (d: string, t: string) => {
    const date = new Date(d + 'T12:00:00')
    const dayStr = date.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    const h12 = hour % 12 || 12
    const ampm = hour < 12 ? 'a.m.' : 'p.m.'
    return `${dayStr} · ${h12}:${m} ${ampm}`
  }

  // Other matches in same group for context
  const groupMatches = GROUP_STAGE_MATCHES.filter(m => m.group === match.group && m.id !== match.id)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a partidos
      </Link>

      {/* Match header */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Grupo {match.group} · Jornada {match.matchday}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(match.date, match.time)}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setSelectedTeamProfile(match.homeTeam)} className="flex-1 text-center hover:opacity-75 transition-opacity">
            <div className="text-4xl mb-2">{home.flag}</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{home.name}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Ranking FIFA #{home.ranking}</p>
          </button>
          <div className="text-2xl font-black text-gray-400 dark:text-gray-600 px-4">VS</div>
          <button onClick={() => setSelectedTeamProfile(match.awayTeam)} className="flex-1 text-center hover:opacity-75 transition-opacity">
            <div className="text-4xl mb-2">{away.flag}</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{away.name}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Ranking FIFA #{away.ranking}</p>
          </button>
        </div>
      </div>

      {/* Probability circles */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-5">Probabilidad de resultado</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <ProbCircle label={`Gana ${home.name}`} value={probs.pHome} color="#3b82f6" />
          </div>
          <div className="text-center">
            <ProbCircle label="Empate" value={probs.pDraw} color="#6b7280" />
          </div>
          <div className="text-center">
            <ProbCircle label={`Gana ${away.name}`} value={probs.pAway} color="#f97316" />
          </div>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center mt-4">
          Basado en últimos 10 partidos internacionales · No es recomendación de apuesta
        </p>
      </div>

      {/* Team comparison */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Comparativa (últimos 10 partidos)</h3>

        <div className="flex justify-between text-sm font-semibold mb-4">
          <button onClick={() => setSelectedTeamProfile(match.homeTeam)} className="text-blue-500 dark:text-blue-400 flex items-center gap-2 hover:opacity-75 transition-opacity">{home.flag} {home.name}</button>
          <button onClick={() => setSelectedTeamProfile(match.awayTeam)} className="text-orange-400 flex items-center gap-2 hover:opacity-75 transition-opacity">{away.name} {away.flag}</button>
        </div>

        <StatRow label="Victorias" homeVal={home.wins} awayVal={away.wins} fmt={v => `${v}`} />
        <StatRow label="Goles anotados (prom.)" homeVal={home.goalsFor / 10} awayVal={away.goalsFor / 10} />
        <StatRow label="Goles recibidos (prom.)" homeVal={home.goalsAgainst / 10} awayVal={away.goalsAgainst / 10} />
        <StatRow label="Tasa de victorias" homeVal={home.wins} awayVal={away.wins} fmt={v => `${Math.round(v * 10)}%`} />

        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
          {[
            { team: home, color: 'text-blue-500 dark:text-blue-400 border-blue-500/20' },
            { team: away, color: 'text-orange-400 border-orange-500/20' },
          ].map(({ team, color }) => (
            <div key={team.name} className={`rounded-xl p-3 bg-gray-200/40 dark:bg-gray-800/40 border ${color.split(' ').slice(1).join(' ')}`}>
              <p className={`text-xs font-bold mb-3 ${color.split(' ')[0]}`}>{team.flag} {team.name}</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                <div className="flex flex-col items-center"><p className="text-green-600 dark:text-green-400 font-bold text-lg leading-tight">{team.wins}</p><p className="text-gray-400 dark:text-gray-500">G</p></div>
                <div className="flex flex-col items-center"><p className="text-yellow-600 dark:text-yellow-400 font-bold text-lg leading-tight">{team.draws}</p><p className="text-gray-400 dark:text-gray-500">E</p></div>
                <div className="flex flex-col items-center"><p className="text-red-600 dark:text-red-400 font-bold text-lg leading-tight">{team.losses}</p><p className="text-gray-400 dark:text-gray-500">P</p></div>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">Forma:</span>
                <div className="flex flex-wrap gap-1">
                  {team.form.map((r, i) => <FormBadge key={i} r={r} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Betting cards */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Cuadros de apuesta</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🏆</span>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">¿Quién gana?</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: home.name, p: pctNum(probs.pHome), color: '#3b82f6' },
                { label: 'Empate', p: pctNum(probs.pDraw), color: '#6b7280' },
                { label: away.name, p: pctNum(probs.pAway), color: '#f97316' },
              ].map(opt => {
                const isMax = opt.p === Math.max(pctNum(probs.pHome), pctNum(probs.pDraw), pctNum(probs.pAway))
                return (
                  <div key={opt.label} className={`rounded-lg p-2.5 text-center border ${isMax ? 'border-green-500/40 bg-green-500/15' : 'border-gray-200 dark:border-gray-800 bg-gray-200/30 dark:bg-gray-800/30'}`}>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 truncate leading-tight">{opt.label}</p>
                    <p className="text-lg font-extrabold" style={{ color: opt.color }}>{opt.p}%</p>
                  </div>
                )
              })}
            </div>
          </div>

          <BettingCard
            title="Goles totales"
            icon="⚽"
            optionA="Más de 2.5"
            optionB="Menos de 2.5"
            pctA={pctNum(probs.pOver25)}
            pctB={pctNum(probs.pUnder25)}
            colorA="#10b981"
            colorB="#ef4444"
          />

          <BettingCard
            title="¿Ambos equipos anotan?"
            icon="🎯"
            optionA="Sí"
            optionB="No"
            pctA={pctNum(probs.pBothScore)}
            pctB={pctNum(probs.pNoBothScore)}
            colorA="#10b981"
            colorB="#ef4444"
          />

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">📊</span>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Goles esperados</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-200/40 dark:bg-gray-800/40 rounded-lg p-3 text-center border border-blue-500/20">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{home.flag} {home.name}</p>
                <p className="text-2xl font-extrabold text-blue-500 dark:text-blue-400">{probs.lambdaHome.toFixed(1)}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">goles</p>
              </div>
              <div className="bg-gray-200/40 dark:bg-gray-800/40 rounded-lg p-3 text-center border border-orange-500/20">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{away.flag} {away.name}</p>
                <p className="text-2xl font-extrabold text-orange-400">{probs.lambdaAway.toFixed(1)}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">goles</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-2">
              Total esperado: {probs.expectedTotal.toFixed(1)} goles
            </p>
          </div>
        </div>
      </div>

      {selectedTeamProfile && (
        <TeamProfileModal teamName={selectedTeamProfile} onClose={() => setSelectedTeamProfile(null)} />
      )}

      {/* Other group matches */}
      {groupMatches.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Otros partidos del Grupo {match.group}</h3>
          <div className="space-y-2">
            {groupMatches.map(m => {
              const mHome = TEAMS[m.homeTeam]
              const mAway = TEAMS[m.awayTeam]
              if (!mHome || !mAway) return null
              const dateStr = new Date(m.date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
              return (
                <Link
                  key={m.id}
                  href={`/partidos/${m.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-800/60 transition-colors text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-300">{mHome.flag} {mHome.name} <span className="text-gray-400 dark:text-gray-600">vs</span> {mAway.name} {mAway.flag}</span>
                  <span className="text-gray-400 dark:text-gray-600 text-xs">{dateStr} · J{m.matchday}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
