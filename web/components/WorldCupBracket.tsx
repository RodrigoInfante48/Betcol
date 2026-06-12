'use client'
import React, { useState, useEffect } from 'react'
import { TEAMS, GROUPS, GROUP_STAGE_MATCHES } from '@/lib/worldcupData'

/* ─── Layout constants ─── */
const CARD_H = 96   // px per bracket slot
const CARD_W = 168  // px per round column
const CONN_W = 22   // px for SVG connectors between rounds
const TOTAL_H = 16 * CARD_H // 1536px

const GROUPS_LS_KEY = 'wc2026_groups_v1'

/* ─── Types ─── */
type Score = { h: string; a: string; pen?: 'h' | 'a' }
type GroupScore = { h: string; a: string }

/* ─── Bracket data ─── */
const R32_DEF = [
  { id: 'm1',  hl: '1° A', al: '2° B', date: '28 jun' },
  { id: 'm2',  hl: '1° C', al: '2° D', date: '28 jun' },
  { id: 'm3',  hl: '1° E', al: '2° F', date: '29 jun' },
  { id: 'm4',  hl: '1° G', al: '2° H', date: '29 jun' },
  { id: 'm5',  hl: '1° I', al: '2° J', date: '30 jun' },
  { id: 'm6',  hl: '1° K', al: '2° L', date: '30 jun' },
  { id: 'm7',  hl: '2° A', al: '1° B', date: '1 jul' },
  { id: 'm8',  hl: '2° C', al: '1° D', date: '1 jul' },
  { id: 'm9',  hl: '2° E', al: '1° F', date: '2 jul' },
  { id: 'm10', hl: '2° G', al: '1° H', date: '2 jul' },
  { id: 'm11', hl: '2° I', al: '1° J', date: '3 jul' },
  { id: 'm12', hl: '2° K', al: '1° L', date: '3 jul' },
  { id: 'm13', hl: '3° (1)', al: '3° (2)', date: '28 jun' },
  { id: 'm14', hl: '3° (3)', al: '3° (4)', date: '29 jun' },
  { id: 'm15', hl: '3° (5)', al: '3° (6)', date: '30 jun' },
  { id: 'm16', hl: '3° (7)', al: '3° (8)', date: '1 jul' },
] as const

type MatchRef = { id: string; hf: string; af: string; date: string }

const R16_DEF: MatchRef[] = [
  { id: 'r16_1', hf: 'm1',  af: 'm2',  date: '5 jul' },
  { id: 'r16_2', hf: 'm3',  af: 'm4',  date: '5 jul' },
  { id: 'r16_3', hf: 'm5',  af: 'm6',  date: '6 jul' },
  { id: 'r16_4', hf: 'm7',  af: 'm8',  date: '6 jul' },
  { id: 'r16_5', hf: 'm9',  af: 'm10', date: '7 jul' },
  { id: 'r16_6', hf: 'm11', af: 'm12', date: '7 jul' },
  { id: 'r16_7', hf: 'm13', af: 'm14', date: '8 jul' },
  { id: 'r16_8', hf: 'm15', af: 'm16', date: '8 jul' },
]

const QF_DEF: MatchRef[] = [
  { id: 'qf_1', hf: 'r16_1', af: 'r16_2', date: '11 jul' },
  { id: 'qf_2', hf: 'r16_3', af: 'r16_4', date: '11 jul' },
  { id: 'qf_3', hf: 'r16_5', af: 'r16_6', date: '12 jul' },
  { id: 'qf_4', hf: 'r16_7', af: 'r16_8', date: '12 jul' },
]

const SF_DEF: MatchRef[] = [
  { id: 'sf_1', hf: 'qf_1', af: 'qf_2', date: '15 jul' },
  { id: 'sf_2', hf: 'qf_3', af: 'qf_4', date: '16 jul' },
]

const FINAL_DEF: MatchRef = { id: 'final', hf: 'sf_1', af: 'sf_2', date: '19 jul' }

/* ─── Lookup indexes ─── */
const R32_IDX: Record<string, typeof R32_DEF[number]> = {}
R32_DEF.forEach(m => { R32_IDX[m.id] = m })

const ALL_REFS: Record<string, MatchRef> = {}
;[...R16_DEF, ...QF_DEF, ...SF_DEF, FINAL_DEF].forEach(m => { ALL_REFS[m.id] = m })

/* ─── R32 auto-population helpers ─── */
function getSortedGroupTeams(group: string): string[] {
  return [...(GROUPS[group] ?? [])].sort(
    (a, b) => (TEAMS[a]?.ranking ?? 999) - (TEAMS[b]?.ranking ?? 999)
  )
}

function computeGroupStandingsSorted(group: string, groupScores: Record<string, GroupScore>): string[] {
  const teams = GROUPS[group] ?? []
  const matches = GROUP_STAGE_MATCHES.filter(m => m.group === group)

  const stats: Record<string, { pts: number; gd: number; gf: number }> = {}
  for (const t of teams) stats[t] = { pts: 0, gd: 0, gf: 0 }

  let hasResults = false
  for (const match of matches) {
    const sc = groupScores[match.id]
    if (!sc || sc.h === '' || sc.a === '') continue
    hasResults = true
    const h = parseInt(sc.h), a = parseInt(sc.a)
    stats[match.homeTeam].gf += h
    stats[match.homeTeam].gd += h - a
    stats[match.awayTeam].gf += a
    stats[match.awayTeam].gd += a - h
    if (h > a) stats[match.homeTeam].pts += 3
    else if (h === a) { stats[match.homeTeam].pts += 1; stats[match.awayTeam].pts += 1 }
    else stats[match.awayTeam].pts += 3
  }

  if (!hasResults) return getSortedGroupTeams(group)

  return [...teams].sort((a, b) => {
    const sa = stats[a], sb = stats[b]
    if (sb.pts !== sa.pts) return sb.pts - sa.pts
    if (sb.gd !== sa.gd) return sb.gd - sa.gd
    if (sb.gf !== sa.gf) return sb.gf - sa.gf
    return (TEAMS[a]?.ranking ?? 999) - (TEAMS[b]?.ranking ?? 999)
  })
}

function computeDefaultR32Teams(groupScores: Record<string, GroupScore> = {}): Record<string, string> {
  const sorted: Record<string, string[]> = {}
  for (const g of Object.keys(GROUPS)) sorted[g] = computeGroupStandingsSorted(g, groupScores)

  // Best 3rd-place teams sorted by ranking
  const thirdPlace = Object.values(sorted)
    .map(teams => teams[2])
    .filter(Boolean)
    .sort((a, b) => (TEAMS[a]?.ranking ?? 999) - (TEAMS[b]?.ranking ?? 999))

  const result: Record<string, string> = {}
  let t3 = 0
  for (const match of R32_DEF) {
    for (const side of ['h', 'a'] as const) {
      const label = side === 'h' ? match.hl : match.al
      const key = `${match.id}:${side}`
      const m12 = label.match(/^([12])°\s+([A-L])$/)
      if (m12) {
        result[key] = sorted[m12[2]]?.[+m12[1] - 1] ?? ''
        continue
      }
      if (/^3°/.test(label)) {
        result[key] = thirdPlace[t3++] ?? ''
      }
    }
  }
  return result
}

function getR32Options(slotLabel: string): string[] {
  const m12 = slotLabel.match(/^[12]°\s+([A-L])$/)
  if (m12) return GROUPS[m12[1]] ?? []
  if (/^3°/.test(slotLabel)) {
    return Object.keys(GROUPS)
      .map(g => getSortedGroupTeams(g)[2])
      .filter(Boolean)
  }
  return []
}

/* ─── Utility functions ─── */

// Top pixel position for match at round k, index i within that round
function topY(roundIndex: number, matchIndex: number): number {
  const pow = Math.pow(2, roundIndex)
  return (pow * matchIndex + (pow - 1) / 2) * CARD_H
}

function getWinner(matchId: string, scores: Record<string, Score>): 'h' | 'a' | null {
  const sc = scores[matchId]
  if (!sc || sc.h === '' || sc.a === '') return null
  const h = parseInt(sc.h), a = parseInt(sc.a)
  if (h > a) return 'h'
  if (a > h) return 'a'
  return sc.pen ?? null
}

function getTeamLabel(
  matchId: string,
  side: 'h' | 'a',
  scores: Record<string, Score>,
  r32Teams: Record<string, string>,
): string {
  if (R32_IDX[matchId]) {
    const key = `${matchId}:${side}`
    return r32Teams[key] || (side === 'h' ? R32_IDX[matchId].hl : R32_IDX[matchId].al)
  }
  const ref = ALL_REFS[matchId]
  if (!ref) return '?'
  const sourceId = side === 'h' ? ref.hf : ref.af
  const w = getWinner(sourceId, scores)
  if (!w) return '···'
  return getTeamLabel(sourceId, w, scores, r32Teams)
}

function getMatchDate(matchId: string): string {
  if (R32_IDX[matchId]) return R32_IDX[matchId].date
  return ALL_REFS[matchId]?.date ?? ''
}

/* ─── Match Card ─── */
function MatchCard({
  id, scores, onScore, r32Teams, onR32Team,
}: {
  id: string
  scores: Record<string, Score>
  onScore: (id: string, s: Score) => void
  r32Teams: Record<string, string>
  onR32Team: (key: string, name: string) => void
}) {
  const sc = scores[id] ?? { h: '', a: '' }
  const hl = getTeamLabel(id, 'h', scores, r32Teams)
  const al = getTeamLabel(id, 'a', scores, r32Teams)
  const date = getMatchDate(id)
  const isR32 = !!R32_IDX[id]

  const hNum = sc.h !== '' ? parseInt(sc.h) : null
  const aNum = sc.a !== '' ? parseInt(sc.a) : null
  const tied = hNum !== null && aNum !== null && hNum === aNum
  const winner: 'h' | 'a' | null =
    hNum !== null && aNum !== null
      ? hNum > aNum ? 'h' : aNum > hNum ? 'a' : (sc.pen ?? null)
      : null

  function bump(side: 'h' | 'a', delta: number) {
    const cur = side === 'h' ? sc.h : sc.a
    const val = Math.max(0, Math.min(20, (cur === '' ? 0 : parseInt(cur)) + delta))
    const next: Score = { ...sc, [side]: String(val) }
    const nh = side === 'h' ? val : (hNum ?? 0)
    const na = side === 'a' ? val : (aNum ?? 0)
    if (nh !== na) delete next.pen
    onScore(id, next)
  }

  function setPen(p: 'h' | 'a') {
    onScore(id, { ...sc, pen: sc.pen === p ? undefined : p })
  }

  const isPending = hl === '···' || al === '···'

  const teamRow = (side: 'h' | 'a', label: string) => {
    const isWinner = winner === side
    const goalVal = side === 'h' ? sc.h : sc.a
    const flag = TEAMS[label]?.flag ?? ''
    const slotLabel = isR32 ? (side === 'h' ? R32_IDX[id].hl : R32_IDX[id].al) : ''
    const r32Key = `${id}:${side}`
    const options = isR32 ? getR32Options(slotLabel) : []

    return (
      <div className={`flex items-center gap-1 px-2 py-1.5 ${isWinner ? 'bg-green-500/10' : ''}`}>
        {isR32 ? (
          <div className="flex flex-1 min-w-0 items-center gap-1">
            <span className="text-sm leading-none flex-shrink-0">{flag}</span>
            <select
              value={r32Teams[r32Key] ?? ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onR32Team(r32Key, e.target.value)}
              className={`text-[10px] flex-1 min-w-0 bg-transparent border-none outline-none font-medium leading-tight cursor-pointer ${
                isWinner
                  ? 'text-green-700 dark:text-green-300 font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {options.map(t => (
                <option key={t} value={t} className="bg-white dark:bg-gray-900 text-gray-800">
                  {t}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className={`text-[11px] flex-1 min-w-0 truncate font-medium leading-tight ${
            isPending
              ? 'text-gray-400 dark:text-gray-600 italic'
              : isWinner
              ? 'text-green-700 dark:text-green-300 font-semibold'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {flag && !isPending ? `${flag} ` : ''}{label}
          </span>
        )}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => bump(side, -1)}
            disabled={isPending}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-[13px] disabled:opacity-30 disabled:cursor-not-allowed leading-none"
          >−</button>
          <span className={`w-6 text-center text-sm font-bold leading-none ${
            isWinner ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {goalVal !== '' ? goalVal : <span className="text-gray-300 dark:text-gray-700 text-xs">—</span>}
          </span>
          <button
            onClick={() => bump(side, 1)}
            disabled={isPending}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-[13px] disabled:opacity-30 disabled:cursor-not-allowed leading-none"
          >+</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`absolute left-0 right-0 rounded-lg overflow-hidden border shadow-sm transition-all ${
      winner
        ? 'border-green-400/40 dark:border-green-600/30 shadow-green-100/60 dark:shadow-green-900/20'
        : 'border-gray-200 dark:border-gray-700/80'
    } bg-white dark:bg-gray-900`}
      style={{ top: 2, bottom: 2 }}
    >
      {/* Date header */}
      <div className="px-2 py-0.5 bg-gray-100/70 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
        <span className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium">{date}</span>
        {winner && <span className="text-[9px] text-green-600 dark:text-green-500">✓</span>}
      </div>

      {teamRow('h', hl)}
      <div className="border-t border-gray-100 dark:border-gray-800" />
      {teamRow('a', al)}

      {/* Penalties row — only shown when tied with scores entered */}
      {tied && (
        <div className="border-t border-amber-200/70 dark:border-amber-900/40 px-2 py-0.5 bg-amber-50/60 dark:bg-amber-900/10 flex items-center gap-1.5">
          <span className="text-[8px] text-amber-600 dark:text-amber-500 font-semibold uppercase tracking-wide">Pen</span>
          <button
            onClick={() => setPen('h')}
            className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors ${
              sc.pen === 'h'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >L</button>
          <span className="text-[8px] text-gray-300 dark:text-gray-700">vs</span>
          <button
            onClick={() => setPen('a')}
            className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors ${
              sc.pen === 'a'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >V</button>
        </div>
      )}
    </div>
  )
}

/* ─── Round Column ─── */
function RoundColumn({
  roundIndex, matchIds, scores, onScore, r32Teams, onR32Team,
}: {
  roundIndex: number
  matchIds: string[]
  scores: Record<string, Score>
  onScore: (id: string, s: Score) => void
  r32Teams: Record<string, string>
  onR32Team: (key: string, name: string) => void
}) {
  return (
    <div className="relative flex-shrink-0" style={{ width: CARD_W, height: TOTAL_H }}>
      {matchIds.map((id, i) => (
        <div
          key={id}
          className="absolute left-0 right-0"
          style={{ top: topY(roundIndex, i), height: CARD_H }}
        >
          <MatchCard
            id={id}
            scores={scores}
            onScore={onScore}
            r32Teams={r32Teams}
            onR32Team={onR32Team}
          />
        </div>
      ))}
    </div>
  )
}

/* ─── SVG Connectors between rounds ─── */
function Connectors({ fromRound, toRound }: { fromRound: number; toRound: number }) {
  const toCount = Math.round(16 / Math.pow(2, toRound))
  const W = CONN_W
  const MID = W / 2

  return (
    <svg
      width={W}
      height={TOTAL_H}
      className="flex-shrink-0"
      style={{ overflow: 'visible' }}
    >
      {Array.from({ length: toCount }, (_, j) => {
        const y1 = topY(fromRound, 2 * j) + CARD_H / 2
        const y2 = topY(fromRound, 2 * j + 1) + CARD_H / 2
        const ym = topY(toRound, j) + CARD_H / 2
        return (
          <g key={j} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1.5" fill="none">
            {/* From upper source → midpoint-x */}
            <line x1={0} y1={y1} x2={MID} y2={y1} />
            {/* From lower source → midpoint-x */}
            <line x1={0} y1={y2} x2={MID} y2={y2} />
            {/* Vertical connector */}
            <line x1={MID} y1={y1} x2={MID} y2={y2} />
            {/* Horizontal to next column */}
            <line x1={MID} y1={ym} x2={W} y2={ym} />
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Main Bracket Component ─── */
const ROUNDS = [
  { label: 'Eliminatoria 32', sub: '28 jun – 3 jul', roundIndex: 0, matchIds: R32_DEF.map(m => m.id) },
  { label: 'Octavos',          sub: '5–8 jul',        roundIndex: 1, matchIds: R16_DEF.map(m => m.id) },
  { label: 'Cuartos',          sub: '11–12 jul',      roundIndex: 2, matchIds: QF_DEF.map(m => m.id) },
  { label: 'Semifinales',      sub: '15–16 jul',      roundIndex: 3, matchIds: SF_DEF.map(m => m.id) },
  { label: 'Final',            sub: '19 jul',         roundIndex: 4, matchIds: [FINAL_DEF.id] },
]

const LS_KEY = 'wc2026_bracket_v2'

export default function WorldCupBracket() {
  const [scores, setScores] = useState<Record<string, Score>>({})
  const [r32Teams, setR32Teams] = useState<Record<string, string>>({})
  const [hydrated, setHydrated] = useState(false)
  const [hasGroupResults, setHasGroupResults] = useState(false)

  useEffect(() => {
    let groupScores: Record<string, GroupScore> = {}
    try {
      const savedGroups = localStorage.getItem(GROUPS_LS_KEY)
      if (savedGroups) {
        groupScores = JSON.parse(savedGroups)
        setHasGroupResults(
          Object.values(groupScores).some((s: GroupScore) => s.h !== '' && s.a !== '')
        )
      }
    } catch {}

    const defaults = computeDefaultR32Teams(groupScores)
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.scores) setScores(data.scores)
        setR32Teams(data.r32Teams ?? defaults)
      } else {
        setR32Teams(defaults)
      }
    } catch {
      setR32Teams(defaults)
    }
    setHydrated(true)
  }, [])

  // Persist on every state change after hydration
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ scores, r32Teams }))
    } catch {}
  }, [scores, r32Teams, hydrated])

  function onScore(id: string, s: Score) {
    setScores((prev: Record<string, Score>) => ({ ...prev, [id]: s }))
  }

  function onR32Team(key: string, name: string) {
    setR32Teams((prev: Record<string, string>) => ({ ...prev, [key]: name }))
  }

  function recalcFromGroups() {
    let groupScores: Record<string, GroupScore> = {}
    try {
      const saved = localStorage.getItem(GROUPS_LS_KEY)
      if (saved) groupScores = JSON.parse(saved)
    } catch {}
    setR32Teams(computeDefaultR32Teams(groupScores))
  }

  function reset() {
    if (!confirm('¿Reiniciar todo el bracket? Se borrarán todos los marcadores.')) return
    let groupScores: Record<string, GroupScore> = {}
    try {
      const saved = localStorage.getItem(GROUPS_LS_KEY)
      if (saved) groupScores = JSON.parse(saved)
    } catch {}
    setScores({})
    setR32Teams(computeDefaultR32Teams(groupScores))
    try { localStorage.removeItem(LS_KEY) } catch {}
  }

  // Count filled matches for progress indicator
  const filledCount = (Object.values(scores) as Score[]).filter(s => s.h !== '' && s.a !== '').length

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400 dark:text-gray-600">
        Cargando bracket…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info + controls */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Los equipos están pre-cargados por {hasGroupResults ? 'posición real en grupos' : 'ranking FIFA'} — puedes cambiarlos con el selector.
            Usa <span className="font-semibold text-gray-700 dark:text-gray-300">− y +</span> para ingresar goles.
            El ganador avanza automáticamente. En empate, elige <span className="font-semibold">penaltis (L = local, V = visitante)</span>.
          </p>
          {filledCount > 0 && (
            <p className="text-[11px] text-green-600 dark:text-green-500">
              {filledCount} de 31 partidos completados
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {hasGroupResults && (
            <button
              onClick={recalcFromGroups}
              className="text-xs text-blue-500 border border-blue-200 dark:border-blue-900/60 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
            >
              Recalcular desde grupos
            </button>
          )}
          <button
            onClick={reset}
            className="text-xs text-red-500 border border-red-200 dark:border-red-900/60 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Bracket — horizontally scrollable */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div style={{ minWidth: ROUNDS.length * CARD_W + (ROUNDS.length - 1) * CONN_W }}>

          {/* Round header labels */}
          <div className="flex items-end mb-2" style={{ gap: 0 }}>
            {ROUNDS.map((r, ri) => (
              <div key={r.label} className="flex-shrink-0 text-center" style={{ width: CARD_W + (ri < ROUNDS.length - 1 ? CONN_W : 0) }}>
                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200 leading-tight">{r.label}</p>
                <p className="text-[9px] text-gray-400 dark:text-gray-600 leading-tight">{r.sub}</p>
              </div>
            ))}
          </div>

          {/* Columns + connectors */}
          <div className="flex items-start">
            {ROUNDS.map((r, ri) => (
              <div key={r.label} className="flex items-start flex-shrink-0">
                <RoundColumn
                  roundIndex={r.roundIndex}
                  matchIds={r.matchIds}
                  scores={scores}
                  onScore={onScore}
                  r32Teams={r32Teams}
                  onR32Team={onR32Team}
                />
                {ri < ROUNDS.length - 1 && (
                  <Connectors fromRound={r.roundIndex} toRound={ROUNDS[ri + 1].roundIndex} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-1 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-500/15 border border-green-400/40" />
          Ganador del partido
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-amber-500">Pen</span>
          Selector de penaltis (cuando hay empate en goles)
        </span>
        <span className="ml-auto">
          Los cruces reales se sortean al finalizar grupos · 28 jun – 3 jul 2026
        </span>
      </div>
    </div>
  )
}
