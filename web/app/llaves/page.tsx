'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GROUPS, TEAMS, GROUP_STAGE_MATCHES } from '@/lib/worldcupData'
import { calculateProbabilitiesForMatch } from '@/lib/bettingCalc'
import TeamProfileModal from '@/components/TeamProfileModal'
import WorldCupBracket from '@/components/WorldCupBracket'

const GROUP_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L']
const GROUPS_LS_KEY = 'wc2026_groups_v1'

const PHASE_LABELS: Record<string, string> = {
  r32: 'Eliminatoria de 32',
  r16: 'Octavos de final',
  qf: 'Cuartos de final',
  sf: 'Semifinales',
  tpp: 'Tercer lugar',
  final: 'Gran Final',
}

type GroupScore = { h: string; a: string }

function computeStandings(group: string, groupScores: Record<string, GroupScore>) {
  const teams = GROUPS[group] ?? []
  const matches = GROUP_STAGE_MATCHES.filter(m => m.group === group)

  type Stat = { pts: number; gd: number; gf: number; played: number }
  const stats: Record<string, Stat> = {}
  for (const t of teams) stats[t] = { pts: 0, gd: 0, gf: 0, played: 0 }

  let hasResults = false
  for (const match of matches) {
    const sc = groupScores[match.id]
    if (!sc || sc.h === '' || sc.a === '') continue
    hasResults = true
    const h = parseInt(sc.h), a = parseInt(sc.a)
    stats[match.homeTeam].played++
    stats[match.awayTeam].played++
    stats[match.homeTeam].gf += h
    stats[match.homeTeam].gd += h - a
    stats[match.awayTeam].gf += a
    stats[match.awayTeam].gd += a - h
    if (h > a) stats[match.homeTeam].pts += 3
    else if (h === a) { stats[match.homeTeam].pts += 1; stats[match.awayTeam].pts += 1 }
    else stats[match.awayTeam].pts += 3
  }

  const sorted = hasResults
    ? [...teams].sort((a, b) => {
        const sa = stats[a], sb = stats[b]
        if (sb.pts !== sa.pts) return sb.pts - sa.pts
        if (sb.gd !== sa.gd) return sb.gd - sa.gd
        if (sb.gf !== sa.gf) return sb.gf - sa.gf
        return (TEAMS[a]?.ranking ?? 999) - (TEAMS[b]?.ranking ?? 999)
      })
    : teams

  return { sorted, stats, hasResults }
}

function MatchLine({ homeTeam, awayTeam, matchId, date, time, score, onScore }: {
  homeTeam: string; awayTeam: string; matchId: string
  date: string; time: string
  score: GroupScore
  onScore: (id: string, s: GroupScore) => void
}) {
  const home = TEAMS[homeTeam]
  const away = TEAMS[awayTeam]
  if (!home || !away) return null

  const probs = calculateProbabilitiesForMatch(matchId, home, away)
  const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
  const [hh, mm] = time.split(':')
  const hour = parseInt(hh)
  const h12 = hour % 12 || 12
  const ampm = hour < 12 ? 'a.m.' : 'p.m.'

  const hNum = score.h !== '' ? parseInt(score.h) : null
  const aNum = score.a !== '' ? parseInt(score.a) : null
  const hasScore = hNum !== null && aNum !== null
  const homeWins = hasScore && hNum! > aNum!
  const awayWins = hasScore && aNum! > hNum!

  function bump(side: 'h' | 'a', delta: number) {
    const cur = side === 'h' ? score.h : score.a
    const val = Math.max(0, Math.min(20, (cur === '' ? 0 : parseInt(cur)) + delta))
    onScore(matchId, { ...score, [side]: String(val) })
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-all">
      {/* Home team */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className="text-sm leading-none flex-shrink-0">{home.flag}</span>
        <span className={`text-[11px] truncate font-medium ${homeWins ? 'text-green-700 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}>
          {home.name}
        </span>
        {!hasScore && (
          <span className="text-[10px] text-blue-500 dark:text-blue-400 ml-auto font-semibold flex-shrink-0">
            {Math.round(probs.pHome * 100)}%
          </span>
        )}
      </div>

      {/* Score entry */}
      <div className="flex items-center gap-px flex-shrink-0">
        <button
          onClick={() => bump('h', -1)}
          className="w-4 h-4 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-[11px] leading-none transition-colors"
        >−</button>
        <span className={`w-5 text-center text-xs font-bold ${homeWins ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {score.h !== '' ? score.h : <span className="text-gray-300 dark:text-gray-700 text-[10px]">·</span>}
        </span>
        <button
          onClick={() => bump('h', 1)}
          className="w-4 h-4 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-[11px] leading-none transition-colors"
        >+</button>
        <span className="text-gray-300 dark:text-gray-700 text-[10px] mx-0.5">:</span>
        <button
          onClick={() => bump('a', -1)}
          className="w-4 h-4 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-[11px] leading-none transition-colors"
        >−</button>
        <span className={`w-5 text-center text-xs font-bold ${awayWins ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {score.a !== '' ? score.a : <span className="text-gray-300 dark:text-gray-700 text-[10px]">·</span>}
        </span>
        <button
          onClick={() => bump('a', 1)}
          className="w-4 h-4 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-[11px] leading-none transition-colors"
        >+</button>
      </div>

      {/* Away team */}
      <div className="flex items-center gap-1 flex-1 min-w-0 flex-row-reverse">
        <span className="text-sm leading-none flex-shrink-0">{away.flag}</span>
        <span className={`text-[11px] truncate font-medium text-right ${awayWins ? 'text-green-700 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}>
          {away.name}
        </span>
        {!hasScore && (
          <span className="text-[10px] text-orange-400 mr-auto font-semibold flex-shrink-0">
            {Math.round(probs.pAway * 100)}%
          </span>
        )}
      </div>

      {/* Date info or analysis link */}
      <div className="flex-shrink-0 ml-0.5">
        {hasScore ? (
          <Link
            href={`/partidos/${matchId}`}
            className="text-[10px] text-blue-400 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Ver análisis"
          >→</Link>
        ) : (
          <div className="text-[9px] text-gray-400 dark:text-gray-600 text-right hidden sm:block leading-tight">
            <div>{dateStr}</div>
            <div>{h12}:{mm} {ampm}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function GroupCard({ group, groupScores, onScore, onTeamClick }: {
  group: string
  groupScores: Record<string, GroupScore>
  onScore: (id: string, s: GroupScore) => void
  onTeamClick: (team: string) => void
}) {
  const teams = GROUPS[group] ?? []
  const matches = GROUP_STAGE_MATCHES.filter(m => m.group === group)
  const matchdays = [1, 2, 3] as const
  const { sorted: sortedTeams, stats, hasResults } = computeStandings(group, groupScores)

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-200/60 dark:bg-gray-800/60 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Grupo {group}</h3>
        <div className="flex gap-1.5">
          {teams.map(t => (
            <button
              key={t}
              title={t}
              onClick={() => onTeamClick(t)}
              className="text-base hover:scale-125 transition-transform cursor-pointer"
            >
              {TEAMS[t]?.flag ?? '🏳️'}
            </button>
          ))}
        </div>
      </div>

      {/* Standings or team list */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        {hasResults ? (
          <table className="w-full">
            <thead>
              <tr className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">
                <th className="text-left font-normal pb-0.5 w-4"></th>
                <th className="text-left font-normal pb-0.5">Equipo</th>
                <th className="text-center font-normal pb-0.5 w-5">J</th>
                <th className="text-center font-normal pb-0.5 w-7">Pts</th>
                <th className="text-center font-normal pb-0.5 w-9">DG</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((t, i) => {
                const s = stats[t]
                return (
                  <tr key={t}>
                    <td className="py-0.5">
                      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold ${
                        i === 0 ? 'bg-yellow-400/20 text-yellow-700 dark:text-yellow-400' :
                        i === 1 ? 'bg-sky-400/20 text-sky-700 dark:text-sky-400' :
                        i === 2 ? 'text-gray-500 dark:text-gray-500' :
                        'text-gray-400 dark:text-gray-600'
                      }`}>{i + 1}</span>
                    </td>
                    <td className="py-0.5">
                      <button
                        onClick={() => onTeamClick(t)}
                        className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-colors text-left w-full"
                      >
                        <span className="text-xs">{TEAMS[t]?.flag}</span>
                        <span className={`text-[11px] truncate max-w-[90px] ${
                          i < 2 ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-500'
                        }`}>{t}</span>
                      </button>
                    </td>
                    <td className="text-center text-[10px] text-gray-500 dark:text-gray-400 py-0.5">{s.played}</td>
                    <td className={`text-center text-[11px] font-bold py-0.5 ${
                      i < 2 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'
                    }`}>{s.pts}</td>
                    <td className={`text-center text-[10px] py-0.5 ${
                      s.gd > 0 ? 'text-green-600 dark:text-green-400' :
                      s.gd < 0 ? 'text-red-500 dark:text-red-400' :
                      'text-gray-400 dark:text-gray-600'
                    }`}>
                      {s.gd > 0 ? `+${s.gd}` : s.gd === 0 ? '±0' : s.gd}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            {teams.map((t, i) => (
              <button
                key={t}
                onClick={() => onTeamClick(t)}
                className="flex items-center gap-1.5 py-0.5 hover:text-green-600 dark:hover:text-green-400 transition-colors text-left w-full group/team"
              >
                <span className="text-gray-400 dark:text-gray-600 text-[10px] w-3">{i + 1}.</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{TEAMS[t]?.flag}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300 group-hover/team:text-green-600 dark:group-hover/team:text-green-400 transition-colors">{t}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Matches by jornada */}
      <div className="px-3 py-2 space-y-1">
        {matchdays.map(day => {
          const dayMatches = matches.filter(m => m.matchday === day)
          if (!dayMatches.length) return null
          return (
            <div key={day}>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5 px-2">
                Jornada {day}
              </p>
              {dayMatches.map(m => (
                <MatchLine
                  key={m.id}
                  homeTeam={m.homeTeam} awayTeam={m.awayTeam}
                  matchId={m.id} date={m.date} time={m.time}
                  score={groupScores[m.id] ?? { h: '', a: '' }}
                  onScore={onScore}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}


export default function LlavesPage() {
  const [tab, setTab] = useState<'grupos' | 'eliminatoria'>('grupos')
  const [selectedTeamProfile, setSelectedTeamProfile] = useState<string | null>(null)
  const [groupScores, setGroupScores] = useState<Record<string, GroupScore>>({})
  const [groupsHydrated, setGroupsHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GROUPS_LS_KEY)
      if (saved) setGroupScores(JSON.parse(saved))
    } catch {}
    setGroupsHydrated(true)
  }, [])

  useEffect(() => {
    if (!groupsHydrated) return
    try {
      localStorage.setItem(GROUPS_LS_KEY, JSON.stringify(groupScores))
    } catch {}
  }, [groupScores, groupsHydrated])

  function updateScore(matchId: string, score: GroupScore) {
    setGroupScores(prev => ({ ...prev, [matchId]: score }))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Llaves del Mundial 2026</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">48 equipos · 12 grupos · USA, Canadá y México como sede</p>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-0">
        {[
          { key: 'grupos', label: '🏆 Fase de grupos', sub: '11 jun – 27 jun' },
          { key: 'eliminatoria', label: '⚔️ Fase eliminatoria', sub: '28 jun – 19 jul' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? 'border-green-600 dark:border-green-400 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
            <span className="hidden sm:inline text-xs font-normal text-gray-400 dark:text-gray-600 ml-2">{t.sub}</span>
          </button>
        ))}
      </div>

      {tab === 'grupos' && (
        <>
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
            <span>Ingresa marcadores con − y + · la tabla de posiciones se actualiza en tiempo real.</span>
            <span className="ml-auto hidden sm:inline">→ ver análisis del partido</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {GROUP_LETTERS.map(g => (
              <GroupCard
                key={g}
                group={g}
                groupScores={groupScores}
                onScore={updateScore}
                onTeamClick={setSelectedTeamProfile}
              />
            ))}
          </div>
        </>
      )}

      {tab === 'eliminatoria' && <WorldCupBracket />}

      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-400 dark:text-gray-600">
        Probabilidades estimadas con base en últimos 10 partidos internacionales de cada selección.
        Fixture extraído de fuentes públicas (FIFA / Google). Los horarios son en hora Colombia (GMT-5).
      </div>

      {selectedTeamProfile && (
        <TeamProfileModal
          teamName={selectedTeamProfile}
          onClose={() => setSelectedTeamProfile(null)}
        />
      )}
    </div>
  )
}
