'use client'
import { useState } from 'react'
import Link from 'next/link'
import { GROUPS, TEAMS, GROUP_STAGE_MATCHES } from '@/lib/worldcupData'
import { calculateProbabilities } from '@/lib/bettingCalc'
import TeamProfileModal from '@/components/TeamProfileModal'

const GROUP_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L']

const PHASE_LABELS: Record<string, string> = {
  r32: 'Eliminatoria de 32',
  r16: 'Octavos de final',
  qf: 'Cuartos de final',
  sf: 'Semifinales',
  tpp: 'Tercer lugar',
  final: 'Gran Final',
}

function MatchLine({ homeTeam, awayTeam, matchId, date, time, matchday }: {
  homeTeam: string; awayTeam: string; matchId: string
  date: string; time: string; matchday: number
}) {
  const home = TEAMS[homeTeam]
  const away = TEAMS[awayTeam]
  if (!home || !away) return null

  const probs = calculateProbabilities(home, away)
  const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const h12 = hour % 12 || 12
  const ampm = hour < 12 ? 'a.m.' : 'p.m.'

  return (
    <Link
      href={`/partidos/${matchId}`}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-800/60 transition-all group"
    >
      <div className="flex-1 flex items-center gap-1.5">
        <span className="text-sm">{home.flag}</span>
        <span className="text-xs text-gray-800 dark:text-gray-200 truncate">{home.name}</span>
        <span className="text-[10px] text-blue-500 dark:text-blue-400 ml-auto font-semibold">{Math.round(probs.pHome * 100)}%</span>
      </div>
      <div className="flex flex-col items-center min-w-[52px]">
        <span className="text-[10px] text-gray-400 dark:text-gray-600">{dateStr}</span>
        <span className="text-[9px] text-gray-300 dark:text-gray-700">{h12}:{m} {ampm}</span>
      </div>
      <div className="flex-1 flex items-center gap-1.5 flex-row-reverse">
        <span className="text-sm">{away.flag}</span>
        <span className="text-xs text-gray-800 dark:text-gray-200 truncate text-right">{away.name}</span>
        <span className="text-[10px] text-orange-400 mr-auto font-semibold">{Math.round(probs.pAway * 100)}%</span>
      </div>
    </Link>
  )
}

function GroupCard({ group, onTeamClick }: { group: string; onTeamClick: (team: string) => void }) {
  const teams = GROUPS[group] ?? []
  const matches = GROUP_STAGE_MATCHES.filter(m => m.group === group)
  const matchdays = [1, 2, 3] as const

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

      {/* Teams list */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
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
      </div>

      {/* Matches by jornada */}
      <div className="px-3 py-2 space-y-1">
        {matchdays.map(day => {
          const dayMatches = matches.filter(m => m.matchday === day)
          if (!dayMatches.length) return null
          return (
            <div key={day}>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5 px-2">Jornada {day}</p>
              {dayMatches.map(m => (
                <MatchLine
                  key={m.id}
                  homeTeam={m.homeTeam} awayTeam={m.awayTeam}
                  matchId={m.id} date={m.date} time={m.time}
                  matchday={m.matchday}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KnockoutBracket() {
  const rounds = [
    { label: 'Eliminatoria de 32', slots: 16, note: 'Los 2 mejores de cada grupo + 8 mejores 3ros' },
    { label: 'Octavos de final', slots: 8, note: '' },
    { label: 'Cuartos de final', slots: 4, note: '' },
    { label: 'Semifinales', slots: 2, note: '' },
    { label: 'Gran Final', slots: 1, note: '19 de julio · 2:00 p.m.' },
  ]

  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-700/30 rounded-xl text-sm text-yellow-600 dark:text-yellow-400">
        <strong>⚠️ Fase eliminatoria pendiente</strong> — Los cruces se definen al terminar la fase de grupos (28 junio – 3 julio 2026).
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {rounds.map(round => (
          <div key={round.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">{round.label}</h4>
            {round.note && <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-3">{round.note}</p>}
            <div className="space-y-1.5">
              {Array.from({ length: round.slots }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-gray-200/40 dark:bg-gray-800/40 border border-gray-300/30 dark:border-gray-700/30">
                  <span className="text-[10px] text-gray-400 dark:text-gray-600 w-4">{i * 2 + 1}.</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-600 flex-1">A definir</span>
                  <span className="text-[10px] text-gray-300 dark:text-gray-700">vs A definir</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LlavesPage() {
  const [tab, setTab] = useState<'grupos' | 'eliminatoria'>('grupos')
  const [selectedTeamProfile, setSelectedTeamProfile] = useState<string | null>(null)

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
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400 inline-block" /> % = probabilidad local
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> % = probabilidad visitante
            </div>
            <span className="ml-auto">Haz clic en un partido para ver el análisis completo</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {GROUP_LETTERS.map(g => (
              <GroupCard key={g} group={g} onTeamClick={setSelectedTeamProfile} />
            ))}
          </div>
        </>
      )}

      {tab === 'eliminatoria' && <KnockoutBracket />}

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
