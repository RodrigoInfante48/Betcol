'use client'

import { useEffect, useCallback, useState } from 'react'
import { TEAM_PROFILES, TEAMS, type Player } from '@/lib/worldcupData'

interface Props {
  teamName: string
  onClose: () => void
}

type Tab = 'panini' | 'plantilla' | 'estadisticas'

const POSITION_ORDER: Record<Player['position'], number> = { GK: 0, DF: 1, MF: 2, FW: 3 }
const POSITION_LABEL: Record<Player['position'], string> = {
  GK: 'Porteros',
  DF: 'Defensas',
  MF: 'Mediocampistas',
  FW: 'Delanteros',
}

const RESULT_COLOR: Record<string, string> = {
  W: 'bg-green-500 text-white',
  D: 'bg-yellow-500 text-black',
  L: 'bg-red-500 text-white',
}

const RESULT_LABEL: Record<string, string> = { W: 'V', D: 'E', L: 'D' }

// Map team names to Wikimedia Commons file names for flags
const FLAG_WIKIMEDIA: Record<string, string> = {
  'México': 'Flag_of_Mexico.svg',
  'Sudáfrica': 'Flag_of_South_Africa.svg',
  'Corea del Sur': 'Flag_of_South_Korea.svg',
  'Chequia': 'Flag_of_the_Czech_Republic.svg',
  'Canadá': 'Flag_of_Canada.svg',
  'Bosnia y Herzegovina': 'Flag_of_Bosnia_and_Herzegovina.svg',
  'Catar': 'Flag_of_Qatar.svg',
  'Suiza': 'Flag_of_Switzerland.svg',
  'Brasil': 'Flag_of_Brazil.svg',
  'Marruecos': 'Flag_of_Morocco.svg',
  'Escocia': 'Flag_of_Scotland.svg',
  'Haití': 'Flag_of_Haiti.svg',
  'Estados Unidos': 'Flag_of_the_United_States.svg',
  'Paraguay': 'Flag_of_Paraguay.svg',
  'Australia': 'Flag_of_Australia.svg',
  'Turquía': 'Flag_of_Turkey.svg',
  'Alemania': 'Flag_of_Germany.svg',
  'Curazao': 'Flag_of_Curaçao.svg',
  'Costa de Marfil': 'Flag_of_Côte_d%27Ivoire.svg',
  'Ecuador': 'Flag_of_Ecuador.svg',
  'Países Bajos': 'Flag_of_the_Netherlands.svg',
  'Japón': 'Flag_of_Japan.svg',
  'Suecia': 'Flag_of_Sweden.svg',
  'Túnez': 'Flag_of_Tunisia.svg',
  'Bélgica': 'Flag_of_Belgium.svg',
  'Irán': 'Flag_of_Iran.svg',
  'Nueva Zelanda': 'Flag_of_New_Zealand.svg',
  'Egipto': 'Flag_of_Egypt.svg',
  'España': 'Flag_of_Spain.svg',
  'Cabo Verde': 'Flag_of_Cape_Verde.svg',
  'Arabia Saudita': 'Flag_of_Saudi_Arabia.svg',
  'Uruguay': 'Flag_of_Uruguay.svg',
  'Francia': 'Flag_of_France.svg',
  'Senegal': 'Flag_of_Senegal.svg',
  'Irak': 'Flag_of_Iraq.svg',
  'Noruega': 'Flag_of_Norway.svg',
  'Argentina': 'Flag_of_Argentina.svg',
  'Argelia': 'Flag_of_Algeria.svg',
  'Austria': 'Flag_of_Austria.svg',
  'Jordania': 'Flag_of_Jordan.svg',
  'Portugal': 'Flag_of_Portugal.svg',
  'RD Congo': 'Flag_of_the_Democratic_Republic_of_the_Congo.svg',
  'Uzbekistán': 'Flag_of_Uzbekistan.svg',
  'Colombia': 'Flag_of_Colombia.svg',
  'Inglaterra': 'Flag_of_England.svg',
  'Croacia': 'Flag_of_Croatia.svg',
  'Ghana': 'Flag_of_Ghana.svg',
  'Panamá': 'Flag_of_Panama.svg',
}

// Map team names to Wikimedia Commons file names for crests
const CREST_WIKIMEDIA: Record<string, string> = {
  'México': 'Logo_de_la_Selección_de_fútbol_de_México.svg',
  'Sudáfrica': 'South_Africa_national_football_team_badge.svg',
  'Corea del Sur': 'Football_pictogram.svg',
  'Chequia': 'Czech_Football_Association_logo.svg',
  'Brasil': 'CBF_logo.svg',
  'Argentina': 'Argentina_football_badge.svg',
  'Francia': 'FFF_Logo.svg',
  'Alemania': 'Logo_der_Deutschen_Fußballnationalmannschaft.svg',
  'España': 'RFEF_Escudo.svg',
  'Portugal': 'FPF_logo.svg',
  'Inglaterra': 'England_national_football_team_crest.svg',
  'Países Bajos': 'KNVB_logo.svg',
  'Bélgica': 'Belgium_football_federation_logo.svg',
  'Japón': 'JFA_logo.svg',
  'Uruguay': 'AUF_Logo.svg',
  'Colombia': 'FCF_logo.svg',
  'Suiza': 'SFV_ASF_logo.svg',
  'Croacia': 'HNS_Logo.svg',
  'Marruecos': 'Royal_Moroccan_Football_Federation_logo.svg',
  'Senegal': 'FSF_logo.svg',
  'Estados Unidos': 'United_States_Soccer_Federation_2016_logo.svg',
  'Canadá': 'Canada_Soccer_logo.svg',
  'Australia': 'Football_Federation_Australia_logo.svg',
  'Suecia': 'Sweden_national_football_team_badge.svg',
  'Noruega': 'NFF_logo.svg',
  'Austria': 'ÖFB_Logo.svg',
  'Turquía': 'TFF_logo.svg',
  'Ecuador': 'FEF_logo.svg',
  'Paraguay': 'APF_logo.svg',
  'Irán': 'FFIRI_logo.svg',
  'Egipto': 'EFA_logo.svg',
  'Arabia Saudita': 'SAFF_logo.svg',
  'Irak': 'Iraqi_Football_Association_logo.svg',
  'Ghana': 'GFA_logo.svg',
  'Argelia': 'FAF_logo.svg',
  'Túnez': 'FTF_logo.svg',
  'Jordania': 'Jordan_FA.svg',
  'Haití': 'FHF_logo.svg',
  'Bosnia y Herzegovina': 'NSBiH_logo.svg',
  'Catar': 'Qatar_Football_Association_Logo.svg',
  'Uzbekistán': 'UFA_logo.svg',
  'RD Congo': 'FecoFa_logo.svg',
  'Cabo Verde': 'FCF_logo_Cape_Verde.svg',
  'Nueva Zelanda': 'NZF_logo.svg',
  'Escocia': 'Scotland_national_football_team_badge.svg',
  'Panamá': 'FEPAFUT_logo.svg',
  'Curazao': 'FFK_Curaçao_logo.svg',
  'Costa de Marfil': 'FIF_logo.svg',
}

function wikimediaFlag(name: string): string {
  const file = FLAG_WIKIMEDIA[name]
  if (!file) return ''
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`
}

function wikimediaCrest(name: string): string {
  const file = CREST_WIKIMEDIA[name]
  if (!file) return ''
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`
}

// Group background colors for panini card
const GROUP_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  A: { bg: 'from-red-900 to-red-700', accent: 'bg-red-500', text: 'text-red-200' },
  B: { bg: 'from-blue-900 to-blue-700', accent: 'bg-blue-500', text: 'text-blue-200' },
  C: { bg: 'from-green-900 to-green-700', accent: 'bg-green-500', text: 'text-green-200' },
  D: { bg: 'from-purple-900 to-purple-700', accent: 'bg-purple-500', text: 'text-purple-200' },
  E: { bg: 'from-orange-900 to-orange-700', accent: 'bg-orange-500', text: 'text-orange-200' },
  F: { bg: 'from-pink-900 to-pink-700', accent: 'bg-pink-500', text: 'text-pink-200' },
  G: { bg: 'from-teal-900 to-teal-700', accent: 'bg-teal-500', text: 'text-teal-200' },
  H: { bg: 'from-yellow-900 to-yellow-700', accent: 'bg-yellow-500', text: 'text-yellow-200' },
  I: { bg: 'from-cyan-900 to-cyan-700', accent: 'bg-cyan-500', text: 'text-cyan-200' },
  J: { bg: 'from-indigo-900 to-indigo-700', accent: 'bg-indigo-500', text: 'text-indigo-200' },
  K: { bg: 'from-rose-900 to-rose-700', accent: 'bg-rose-500', text: 'text-rose-200' },
  L: { bg: 'from-emerald-900 to-emerald-700', accent: 'bg-emerald-500', text: 'text-emerald-200' },
}

function PaniniCard({ teamName }: { teamName: string }) {
  const stats = TEAMS[teamName]
  const profile = TEAM_PROFILES[teamName]
  const group = stats?.group ?? '?'
  const colors = GROUP_COLORS[group] ?? GROUP_COLORS.A
  const flagUrl = profile?.flagImageUrl ?? wikimediaFlag(teamName)
  const crestUrl = profile?.crestImageUrl ?? wikimediaCrest(teamName)
  const totalMatches = stats ? stats.wins + stats.draws + stats.losses : 0
  const winPct = totalMatches > 0 ? Math.round((stats!.wins / totalMatches) * 100) : 0
  const goalDiff = stats ? stats.goalsFor - stats.goalsAgainst : 0

  return (
    <div className="flex justify-center py-4 px-2">
      <div className="w-64 sm:w-72 select-none">
        {/* Card */}
        <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/10`}>

          {/* Top gradient header */}
          <div className={`bg-gradient-to-b ${colors.bg} p-4 pb-8 relative`}>
            {/* World Cup 2026 badge */}
            <div className="flex justify-between items-start mb-2">
              <div className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                FIFA World Cup™
              </div>
              <div className={`text-[10px] font-black ${colors.text} bg-white/10 px-2 py-0.5 rounded-full`}>
                GRUPO {group}
              </div>
            </div>

            {/* Flag background watermark */}
            {flagUrl && (
              <div className="absolute inset-0 opacity-10">
                <img src={flagUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Crest / main image */}
            <div className="relative flex justify-center mt-2 mb-1">
              {crestUrl ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/10 rounded-full flex items-center justify-center p-2 backdrop-blur-sm border border-white/20">
                  <img
                    src={crestUrl}
                    alt={`${teamName} crest`}
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={e => {
                      const el = e.currentTarget as HTMLImageElement
                      el.style.display = 'none'
                      const fallback = el.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-5xl">
                    {stats?.flag ?? '🏳️'}
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/10 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border border-white/20">
                  {stats?.flag ?? '🏳️'}
                </div>
              )}
            </div>

            {/* FIFA ranking badge */}
            {stats && (
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
                <div className="text-[9px] text-white/60 uppercase">FIFA</div>
                <div className="text-base font-black text-white leading-none">#{stats.ranking}</div>
              </div>
            )}
          </div>

          {/* Name bar */}
          <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 -mt-4 relative z-10">
            {flagUrl && (
              <img
                src={flagUrl}
                alt=""
                className="w-7 h-5 object-cover rounded border border-white/20 flex-shrink-0"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <h3 className="font-black text-white text-sm sm:text-base uppercase tracking-wide leading-tight flex-1">
              {teamName}
            </h3>
            {profile && (
              <span className="text-[10px] text-gray-400 font-mono bg-gray-800 px-1.5 py-0.5 rounded">
                {profile.formation}
              </span>
            )}
          </div>

          {/* Stats grid */}
          {stats && (
            <div className="bg-gray-950 px-4 py-3 grid grid-cols-3 divide-x divide-gray-800 text-center">
              <div className="pr-2">
                <div className="text-lg font-black text-green-400">{stats.wins}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">Vic</div>
              </div>
              <div className="px-2">
                <div className="text-lg font-black text-yellow-400">{stats.draws}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">Emp</div>
              </div>
              <div className="pl-2">
                <div className="text-lg font-black text-red-400">{stats.losses}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wide">Der</div>
              </div>
            </div>
          )}

          {/* Goals row */}
          {stats && (
            <div className="bg-gray-950 px-4 pb-3 grid grid-cols-3 divide-x divide-gray-800 text-center border-t border-gray-800">
              <div className="pr-2 pt-2">
                <div className="text-base font-bold text-white">{stats.goalsFor}</div>
                <div className="text-[9px] text-gray-500 uppercase">GF</div>
              </div>
              <div className="px-2 pt-2">
                <div className={`text-base font-bold ${goalDiff > 0 ? 'text-green-400' : goalDiff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {goalDiff > 0 ? '+' : ''}{goalDiff}
                </div>
                <div className="text-[9px] text-gray-500 uppercase">DG</div>
              </div>
              <div className="pl-2 pt-2">
                <div className="text-base font-bold text-white">{stats.goalsAgainst}</div>
                <div className="text-[9px] text-gray-500 uppercase">GC</div>
              </div>
            </div>
          )}

          {/* Form strip */}
          {stats && stats.form.length > 0 && (
            <div className="bg-gray-950 px-3 pb-3 border-t border-gray-800">
              <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1.5 pt-2">Forma reciente</div>
              <div className="flex gap-1">
                {stats.form.map((r, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-5 rounded flex items-center justify-center text-[9px] font-black ${RESULT_COLOR[r] ?? 'bg-gray-700 text-white'}`}
                  >
                    {RESULT_LABEL[r] ?? r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coach & % win footer */}
          <div className="bg-black px-4 py-2.5 flex items-center justify-between">
            {profile ? (
              <div className="text-[10px] text-gray-400">
                <span className="text-gray-600">DT: </span>
                <span className="text-gray-300">{profile.coach}</span>
              </div>
            ) : (
              <div className="text-[10px] text-gray-700">DT: —</div>
            )}
            <div className="text-[10px] font-bold text-gray-300">
              <span className="text-gray-600">%vic: </span>
              {winPct}%
            </div>
          </div>

          {/* Panini sticker number */}
          <div className="absolute bottom-2.5 right-3 text-[8px] font-mono text-gray-700">
            WC26-{stats?.group}{String(Object.keys(TEAMS).indexOf(teamName) + 1).padStart(3, '0')}
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-700 mt-2">
          Álbum Panini · FIFA World Cup 2026™
        </p>
      </div>
    </div>
  )
}

export default function TeamProfileModal({ teamName, onClose }: Props) {
  const profile = TEAM_PROFILES[teamName]
  const stats = TEAMS[teamName]
  const hasPlantilla = !!(profile?.players?.length)
  const [tab, setTab] = useState<Tab>('panini')
  const [visible, setVisible] = useState(false)

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 200)
  }, [onClose])

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() },
    [handleClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => setVisible(true))
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  // Don't render if we have no data at all
  if (!stats && !profile) return null

  const flagUrl = profile?.flagImageUrl ?? wikimediaFlag(teamName)
  const crestUrl = profile?.crestImageUrl ?? wikimediaCrest(teamName)

  const sorted = profile?.players
    ? [...profile.players].sort(
        (a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position] || a.number - b.number,
      )
    : []

  const totalMatches = stats ? stats.wins + stats.draws + stats.losses : 0
  const winPct = totalMatches > 0 ? Math.round((stats!.wins / totalMatches) * 100) : 0
  const goalDiff = stats ? stats.goalsFor - stats.goalsAgainst : 0

  const tabs: { key: Tab; label: string }[] = [
    { key: 'panini', label: '🃏 Panini' },
    ...(hasPlantilla ? [{ key: 'plantilla' as Tab, label: 'Plantilla' }] : []),
    { key: 'estadisticas', label: 'Estadísticas' },
  ]

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-gray-900 text-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col transition-transform duration-200 ${visible ? 'translate-y-0 scale-100' : 'translate-y-8 sm:translate-y-0 sm:scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 bg-gray-900 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 rounded-t-2xl">
          <div className="flex items-center gap-3">
            {crestUrl ? (
              <img
                src={crestUrl}
                alt={`${teamName} crest`}
                className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <span className="text-3xl sm:text-4xl">{stats?.flag ?? '🏳️'}</span>
            )}
            <div>
              <div className="flex items-center gap-2">
                {flagUrl ? (
                  <img
                    src={flagUrl}
                    alt={`${teamName} flag`}
                    className="h-4 w-6 sm:h-5 sm:w-8 object-cover rounded-sm border border-gray-600"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <span className="text-lg">{stats?.flag ?? '🏳️'}</span>
                )}
                <h2 className="text-base sm:text-xl font-bold leading-tight">{teamName}</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {profile?.coach && (
                  <>
                    DT: <span className="text-gray-200">{profile.coach}</span>
                    <span className="mx-2 text-gray-600">·</span>
                    <span className="font-mono text-green-400">{profile.formation}</span>
                  </>
                )}
                {stats && (
                  <>
                    {profile?.coach && <span className="mx-2 text-gray-600">·</span>}
                    <span className="text-gray-400">Grupo {stats.group}</span>
                    <span className="mx-2 text-gray-600">·</span>
                    <span className="text-gray-400">FIFA #{stats.ranking}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none ml-2 flex-shrink-0"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex border-b border-gray-700 px-4 sm:px-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-2.5 px-3 sm:px-4 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.key
                  ? 'border-green-400 text-green-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">

          {tab === 'panini' && <PaniniCard teamName={teamName} />}

          {tab === 'plantilla' && hasPlantilla && (
            <div className="px-4 sm:px-6 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-700">
                    <th className="text-right pr-3 pb-2 w-8">#</th>
                    <th className="text-left pb-2">Jugador</th>
                    <th className="text-left pb-2">Pos.</th>
                    <th className="text-left pb-2 hidden sm:table-cell">Club</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, i) => {
                    const isNewGroup = i === 0 || sorted[i - 1].position !== p.position
                    return (
                      <>
                        {isNewGroup && (
                          <tr key={`hdr-${p.position}`}>
                            <td colSpan={4} className="pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                              {POSITION_LABEL[p.position]}
                            </td>
                          </tr>
                        )}
                        <tr
                          key={p.number}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="text-right pr-3 py-2 font-mono text-gray-400">{p.number}</td>
                          <td className="py-2 font-medium">
                            <span>{p.name}</span>
                            <span className="sm:hidden text-xs text-gray-400 ml-1.5">{p.club}</span>
                          </td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                              p.position === 'GK' ? 'bg-yellow-500/20 text-yellow-300' :
                              p.position === 'DF' ? 'bg-blue-500/20 text-blue-300' :
                              p.position === 'MF' ? 'bg-green-500/20 text-green-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {p.position}
                            </span>
                          </td>
                          <td className="py-2 text-gray-300 hidden sm:table-cell">{p.club}</td>
                        </tr>
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'estadisticas' && (
            <div className="px-4 sm:px-6 py-4 space-y-6">
              {!stats ? (
                <p className="text-gray-400 text-sm text-center py-8">No hay datos estadísticos disponibles.</p>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Victorias', value: stats.wins, color: 'text-green-400' },
                      { label: 'Empates', value: stats.draws, color: 'text-yellow-400' },
                      { label: 'Derrotas', value: stats.losses, color: 'text-red-400' },
                      { label: '% victorias', value: `${winPct}%`, color: 'text-blue-400' },
                    ].map(card => (
                      <div key={card.label} className="bg-gray-800 rounded-xl p-3 text-center">
                        <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Goals */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      Goles (últimos {totalMatches} partidos)
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-bold text-white">{stats.goalsFor}</div>
                        <div className="text-xs text-gray-400 mt-0.5">A favor</div>
                      </div>
                      <div className="text-gray-600 text-2xl">—</div>
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-bold text-white">{stats.goalsAgainst}</div>
                        <div className="text-xs text-gray-400 mt-0.5">En contra</div>
                      </div>
                      <div className="text-gray-600 text-2xl">—</div>
                      <div className="flex-1 text-center">
                        <div className={`text-3xl font-bold ${goalDiff > 0 ? 'text-green-400' : goalDiff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {goalDiff > 0 ? '+' : ''}{goalDiff}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">Diferencia</div>
                      </div>
                    </div>
                  </div>

                  {/* Form strip */}
                  {stats.form.length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Forma reciente (más antiguo → más reciente)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {stats.form.map((r, i) => (
                          <span
                            key={i}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${RESULT_COLOR[r] ?? 'bg-gray-600 text-white'}`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Per-game averages */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      Promedios por partido
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goles anotados</span>
                        <span className="font-semibold">
                          {totalMatches > 0 ? (stats.goalsFor / totalMatches).toFixed(2) : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goles recibidos</span>
                        <span className="font-semibold">
                          {totalMatches > 0 ? (stats.goalsAgainst / totalMatches).toFixed(2) : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
