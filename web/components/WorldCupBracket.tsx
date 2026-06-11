'use client'
import { useState, useEffect } from 'react'
import { TEAMS, GROUPS } from '@/lib/worldcupData'

/* ─── Layout constants ─── */
const CARD_H = 100   // px per bracket slot
const CARD_W = 212   // px per round column
const CONN_W = 24    // px for SVG connectors
const TOTAL_H = 16 * CARD_H // 1600px

/* ─── Types ─── */
type Score = { h: string; a: string; pen?: 'h' | 'a' }
type BracketState = {
  r32: Record<string, string>   // "m1:h" | "m1:a" → team name
  scores: Record<string, Score>
}

/* ─── R32 bracket definition ─── */
// hg/ag = group letter for team selector; null = best 3rd (any team)
type R32Match = {
  id: string; hg: string | null; ag: string | null
  hl: string; al: string; date: string
}
const R32_DEF: R32Match[] = [
  { id: 'm1',  hg: 'A', ag: 'B', hl: '1° A', al: '2° B', date: '28 jun' },
  { id: 'm2',  hg: 'C', ag: 'D', hl: '1° C', al: '2° D', date: '28 jun' },
  { id: 'm3',  hg: 'E', ag: 'F', hl: '1° E', al: '2° F', date: '29 jun' },
  { id: 'm4',  hg: 'G', ag: 'H', hl: '1° G', al: '2° H', date: '29 jun' },
  { id: 'm5',  hg: 'I', ag: 'J', hl: '1° I', al: '2° J', date: '30 jun' },
  { id: 'm6',  hg: 'K', ag: 'L', hl: '1° K', al: '2° L', date: '30 jun' },
  { id: 'm7',  hg: 'A', ag: 'B', hl: '2° A', al: '1° B', date: '1 jul' },
  { id: 'm8',  hg: 'C', ag: 'D', hl: '2° C', al: '1° D', date: '1 jul' },
  { id: 'm9',  hg: 'E', ag: 'F', hl: '2° E', al: '1° F', date: '2 jul' },
  { id: 'm10', hg: 'G', ag: 'H', hl: '2° G', al: '1° H', date: '2 jul' },
  { id: 'm11', hg: 'I', ag: 'J', hl: '2° I', al: '1° J', date: '3 jul' },
  { id: 'm12', hg: 'K', ag: 'L', hl: '2° K', al: '1° L', date: '3 jul' },
  { id: 'm13', hg: null, ag: null, hl: '3° (1)', al: '3° (2)', date: '28 jun' },
  { id: 'm14', hg: null, ag: null, hl: '3° (3)', al: '3° (4)', date: '29 jun' },
  { id: 'm15', hg: null, ag: null, hl: '3° (5)', al: '3° (6)', date: '30 jun' },
  { id: 'm16', hg: null, ag: null, hl: '3° (7)', al: '3° (8)', date: '1 jul' },
]

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

/* ─── Indexes ─── */
const R32_IDX: Record<string, R32Match> = {}
R32_DEF.forEach(m => { R32_IDX[m.id] = m })

const ALL_REFS: Record<string, MatchRef> = {}
;[...R16_DEF, ...QF_DEF, ...SF_DEF, FINAL_DEF].forEach(m => { ALL_REFS[m.id] = m })

const ALL_TEAM_NAMES = Object.keys(TEAMS).sort((a, b) => a.localeCompare(b, 'es'))

/* ─── Position formula ─── */
function topY(roundIndex: number, matchIndex: number): number {
  const pow = Math.pow(2, roundIndex)
  return (pow * matchIndex + (pow - 1) / 2) * CARD_H
}

/* ─── Bracket logic ─── */
function getWinner(matchId: string, scores: Record<string, Score>): 'h' | 'a' | null {
  const sc = scores[matchId]
  if (!sc || sc.h === '' || sc.a === '') return null
  const h = parseInt(sc.h), a = parseInt(sc.a)
  if (h > a) return 'h'
  if (a > h) return 'a'
  return sc.pen ?? null
}

function getSlotTeam(
  matchId: string,
  side: 'h' | 'a',
  scores: Record<string, Score>,
  r32: Record<string, string>
): { name: string; flag: string } {
  if (R32_IDX[matchId]) {
    const name = r32[`${matchId}:${side}`] ?? ''
    return { name, flag: TEAMS[name]?.flag ?? '' }
  }
  const ref = ALL_REFS[matchId]
  if (!ref) return { name: '', flag: '' }
  const sourceId = side === 'h' ? ref.hf : ref.af
  const w = getWinner(sourceId, scores)
  if (!w) return { name: '', flag: '' }
  return getSlotTeam(sourceId, w, scores, r32)
}

function getTeamOptions(matchId: string, side: 'h' | 'a'): string[] {
  const def = R32_IDX[matchId]
  if (!def) return ALL_TEAM_NAMES
  const group = side === 'h' ? def.hg : def.ag
  if (!group) return ALL_TEAM_NAMES
  return GROUPS[group] ?? ALL_TEAM_NAMES
}

/* ─── Match Card ─── */
function MatchCard({ id, scores, r32, onScore, onR32Team }: {
  id: string
  scores: Record<string, Score>
  r32: Record<string, string>
  onScore: (id: string, s: Score) => void
  onR32Team: (key: string, name: string) => void
}) {
  const sc = scores[id] ?? { h: '', a: '' }
  const isR32 = !!R32_IDX[id]
  const def = R32_IDX[id]
  const date = isR32 ? def.date : (ALL_REFS[id]?.date ?? '')

  const home = getSlotTeam(id, 'h', scores, r32)
  const away = getSlotTeam(id, 'a', scores, r32)
  const hOptions = isR32 ? getTeamOptions(id, 'h') : []
  const aOptions = isR32 ? getTeamOptions(id, 'a') : []

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

  // A side is "ready" when it has a team name
  const hReady = !!home.name
  const aReady = !!away.name
  const canScore = hReady && aReady

  const teamRow = (
    side: 'h' | 'a',
    team: { name: string; flag: string },
    options: string[],
    goalVal: string,
  ) => {
    const isWin = winner === side
    const ready = !!team.name
    return (
      <div className={`flex items-center gap-1 px-1.5 py-1.5 ${isWin ? 'bg-green-500/10 dark:bg-green-500/10' : ''}`}>
        {/* Flag */}
        <span className="text-sm leading-none flex-shrink-0 w-5 text-center select-none">
          {team.flag || '🏳️'}
        </span>

        {/* Team name: select for R32, plain text for later rounds */}
        {isR32 ? (
          <select
            value={team.name}
            onChange={e => onR32Team(`${id}:${side}`, e.target.value)}
            className={`flex-1 min-w-0 text-[11px] font-medium bg-transparent border-none outline-none cursor-pointer truncate ${
              isWin
                ? 'text-green-700 dark:text-green-300'
                : ready
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <option value="">
              {side === 'h' ? (def?.hl ?? 'Equipo local') : (def?.al ?? 'Equipo visitante')}
            </option>
            {options.map(t => (
              <option key={t} value={t}>{TEAMS[t]?.flag} {t}</option>
            ))}
          </select>
        ) : (
          <span className={`flex-1 min-w-0 text-[11px] font-medium truncate ${
            isWin
              ? 'text-green-700 dark:text-green-300 font-semibold'
              : ready
              ? 'text-gray-800 dark:text-gray-200'
              : 'text-gray-400 dark:text-gray-600 italic'
          }`}>
            {team.name || '···'}
          </span>
        )}

        {/* Score */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => bump(side, -1)}
            disabled={!canScore}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-25 disabled:cursor-not-allowed"
          >−</button>
          <span className={`w-6 text-center text-sm font-bold tabular-nums ${
            isWin ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {goalVal !== '' ? goalVal : <span className="text-gray-300 dark:text-gray-700 text-xs font-normal">—</span>}
          </span>
          <button
            onClick={() => bump(side, 1)}
            disabled={!canScore}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-25 disabled:cursor-not-allowed"
          >+</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`absolute left-0 right-0 rounded-lg overflow-hidden border shadow-sm transition-colors ${
        winner
          ? 'border-green-400/40 dark:border-green-600/30'
          : 'border-gray-200 dark:border-gray-700'
      } bg-white dark:bg-gray-900`}
      style={{ top: 2, bottom: 2 }}
    >
      {/* Date header */}
      <div className="px-2 py-0.5 bg-gray-100/70 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
        <span className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium">{date}</span>
        {winner && <span className="text-[9px] text-green-600 dark:text-green-500">✓</span>}
      </div>

      {teamRow('h', home, hOptions, sc.h)}
      <div className="border-t border-gray-100 dark:border-gray-800" />
      {teamRow('a', away, aOptions, sc.a)}

      {/* Penalties row when tied */}
      {tied && canScore && (
        <div className="border-t border-amber-200/70 dark:border-amber-800/40 px-2 py-0.5 bg-amber-50/70 dark:bg-amber-900/10 flex items-center gap-1.5">
          <span className="text-[8px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wide">Pen</span>
          <button
            onClick={() => setPen('h')}
            className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors ${
              sc.pen === 'h' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >{home.name.slice(0, 7) || 'L'}</button>
          <span className="text-[8px] text-gray-300 dark:text-gray-700">vs</span>
          <button
            onClick={() => setPen('a')}
            className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors ${
              sc.pen === 'a' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >{away.name.slice(0, 7) || 'V'}</button>
        </div>
      )}
    </div>
  )
}

/* ─── Round Column ─── */
function RoundColumn({ roundIndex, matchIds, scores, r32, onScore, onR32Team }: {
  roundIndex: number
  matchIds: string[]
  scores: Record<string, Score>
  r32: Record<string, string>
  onScore: (id: string, s: Score) => void
  onR32Team: (key: string, name: string) => void
}) {
  return (
    <div className="relative flex-shrink-0" style={{ width: CARD_W, height: TOTAL_H }}>
      {matchIds.map((id, i) => (
        <div key={id} className="absolute left-0 right-0" style={{ top: topY(roundIndex, i), height: CARD_H }}>
          <MatchCard
            id={id} scores={scores} r32={r32}
            onScore={onScore} onR32Team={onR32Team}
          />
        </div>
      ))}
    </div>
  )
}

/* ─── SVG Connectors ─── */
function Connectors({ fromRound, toRound }: { fromRound: number; toRound: number }) {
  const toCount = Math.round(16 / Math.pow(2, toRound))
  const MID = CONN_W / 2
  return (
    <svg width={CONN_W} height={TOTAL_H} className="flex-shrink-0" style={{ overflow: 'visible' }}>
      {Array.from({ length: toCount }, (_, j) => {
        const y1 = topY(fromRound, 2 * j) + CARD_H / 2
        const y2 = topY(fromRound, 2 * j + 1) + CARD_H / 2
        const ym = topY(toRound, j) + CARD_H / 2
        return (
          <g key={j} className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="1.5" fill="none">
            <line x1={0} y1={y1} x2={MID} y2={y1} />
            <line x1={0} y1={y2} x2={MID} y2={y2} />
            <line x1={MID} y1={y1} x2={MID} y2={y2} />
            <line x1={MID} y1={ym} x2={CONN_W} y2={ym} />
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Rounds config ─── */
const ROUNDS = [
  { label: 'Eliminatoria 32', sub: '28 jun – 3 jul', roundIndex: 0, matchIds: R32_DEF.map(m => m.id) },
  { label: 'Octavos',          sub: '5–8 jul',        roundIndex: 1, matchIds: R16_DEF.map(m => m.id) },
  { label: 'Cuartos',          sub: '11–12 jul',      roundIndex: 2, matchIds: QF_DEF.map(m => m.id) },
  { label: 'Semifinales',      sub: '15–16 jul',      roundIndex: 3, matchIds: SF_DEF.map(m => m.id) },
  { label: 'Final',            sub: '19 jul',         roundIndex: 4, matchIds: [FINAL_DEF.id] },
]

const TOTAL_WIDTH = ROUNDS.length * CARD_W + (ROUNDS.length - 1) * CONN_W
const LS_KEY = 'wc2026_bracket_v2'

/* ─── Main Component ─── */
export default function WorldCupBracket() {
  const [state, setState] = useState<BracketState>({ r32: {}, scores: {} })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) setState(JSON.parse(saved))
    } catch {}
    setHydrated(true)
  }, [])

  function save(next: BracketState) {
    setState(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch {}
  }

  function onScore(id: string, s: Score) {
    save({ ...state, scores: { ...state.scores, [id]: s } })
  }

  function onR32Team(key: string, name: string) {
    save({ ...state, r32: { ...state.r32, [key]: name } })
  }

  function reset() {
    if (!confirm('¿Reiniciar todo el bracket? Se borrarán equipos y marcadores.')) return
    save({ r32: {}, scores: {} })
  }

  const filledMatches = Object.values(state.scores).filter(s => s.h !== '' && s.a !== '').length
  const filledTeams = Object.values(state.r32).filter(Boolean).length

  if (!hydrated) {
    return <div className="flex items-center justify-center h-32 text-sm text-gray-400 dark:text-gray-600">Cargando bracket…</div>
  }

  return (
    <div className="space-y-4">
      {/* Instructions + controls */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Paso 1:</span> Elige el equipo clasificado en cada cupo de la Eliminatoria 32 usando el menú desplegable.
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Paso 2:</span> Ingresa el marcador con <span className="font-semibold">− y +</span>. El ganador avanza automáticamente.
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Empate:</span> Selecciona el ganador de penaltis cuando aparezca la fila <span className="text-amber-600 dark:text-amber-500 font-semibold">Pen</span>.
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          {filledMatches > 0 && (
            <span className="text-[11px] text-green-600 dark:text-green-500">{filledMatches}/31 partidos · {filledTeams}/32 equipos</span>
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
        <div style={{ width: TOTAL_WIDTH }}>

          {/* Round headers */}
          <div className="flex mb-2">
            {ROUNDS.map((r, ri) => (
              <div key={r.label} className="flex-shrink-0 text-center" style={{ width: CARD_W + (ri < ROUNDS.length - 1 ? CONN_W : 0) }}>
                <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200 leading-tight">{r.label}</p>
                <p className="text-[9px] text-gray-400 dark:text-gray-600 leading-tight">{r.sub}</p>
              </div>
            ))}
          </div>

          {/* Columns + SVG connectors */}
          <div className="flex items-start">
            {ROUNDS.map((r, ri) => (
              <div key={r.label} className="flex items-start flex-shrink-0">
                <RoundColumn
                  roundIndex={r.roundIndex}
                  matchIds={r.matchIds}
                  scores={state.scores}
                  r32={state.r32}
                  onScore={onScore}
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
      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-600">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500/15 border border-green-400/40 inline-block" /> Ganador / avanza</span>
        <span className="flex items-center gap-1"><span className="text-amber-500 font-semibold">Pen</span> Penaltis (al empatar en goles)</span>
        <span className="ml-auto">Los cruces reales se definen el 28 jun – 3 jul 2026</span>
      </div>
    </div>
  )
}
