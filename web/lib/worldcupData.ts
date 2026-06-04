export interface TeamData {
  name: string
  flag: string
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  form: string[]
  ranking: number
  group: string
}

export interface WCMatch {
  id: string
  group: string
  phase: 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'tpp' | 'final'
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  matchday: 1 | 2 | 3
}

export const TEAMS: Record<string, TeamData> = {
  // ── GRUPO A ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-A.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'México': {
    name: 'México', flag: '🇲🇽',
    // CNL 2023-24 (QF+SF+Final) · Copa América 2024 · CNL 2024-25 (QF+SF+Final)
    wins: 6, draws: 1, losses: 3, goalsFor: 14, goalsAgainst: 6,
    form: ['W','W','L','W','L','D','L','W','W','W'],
    ranking: 15, group: 'A',
  },
  'Sudáfrica': {
    name: 'Sudáfrica', flag: '🇿🇦',
    // CAF WCQ 2026 Grupo C (últimos 6) · AFCON 2025 (grupo+R16) — 2 partidos estimados
    wins: 5, draws: 2, losses: 3, goalsFor: 15, goalsAgainst: 12,
    form: ['D','W','L','D','W','W','W','W','L','L'],
    ranking: 60, group: 'A',
  },
  'Corea del Sur': {
    name: 'Corea del Sur', flag: '🇰🇷',
    // AFC WCQ 2026 Tercera Ronda Grupo B — 10 partidos, invictos (único equipo de Asia)
    wins: 6, draws: 4, losses: 0, goalsFor: 20, goalsAgainst: 7,
    form: ['W','W','W','D','W','D','D','D','W','W'],
    ranking: 25, group: 'A',
  },
  'Chequia': {
    name: 'Chequia', flag: '🇨🇿',
    // UEFA WCQ 2026 Grupo C (8 partidos) · Playoffs vs Irlanda + Dinamarca (penales)
    wins: 7, draws: 1, losses: 2, goalsFor: 22, goalsAgainst: 12,
    form: ['W','W','W','L','W','D','L','W','W','W'],
    ranking: 41, group: 'A',
  },

  // ── GRUPO B ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-B.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Canadá': {
    name: 'Canadá', flag: '🇨🇦',
    // Copa América 2024 (SF+3er puesto) · CNL 2024-25 (QF+Final Four) · Gold Cup 2025 (GS+QF)
    wins: 5, draws: 1, losses: 4, goalsFor: 18, goalsAgainst: 9,
    form: ['L','L','W','W','L','W','W','D','W','L'],
    ranking: 30, group: 'B',
  },
  'Bosnia y Herzegovina': {
    name: 'Bosnia y Herzegovina', flag: '🇧🇦',
    // WC 2026 Qual UEFA (8 partidos de grupo) · Playoffs vs Gales (4-2 pens) y vs Italia (4-1 pens)
    wins: 6, draws: 2, losses: 2, goalsFor: 21, goalsAgainst: 11,
    form: ['W','L','W','L','D','W','W','D','W','W'],
    ranking: 65, group: 'B',
  },
  'Catar': {
    name: 'Catar', flag: '🇶🇦',
    // AFC WC Qual 3rd Round (últimos 5) · 4th Round (clasificación vs EAU) · FIFA Arab Cup 2025 (GS)
    wins: 4, draws: 2, losses: 4, goalsFor: 13, goalsAgainst: 15,
    form: ['W','W','L','W','L','D','W','L','D','L'],
    ranking: 55, group: 'B',
  },
  'Suiza': {
    name: 'Suiza', flag: '🇨🇭',
    // UEFA Nations League A4 2024-25 (últimos 4 partidos) · WC 2026 Qual UEFA (6 partidos, clasificados directos)
    wins: 4, draws: 4, losses: 2, goalsFor: 19, goalsAgainst: 10,
    form: ['L','D','D','L','W','W','W','D','W','D'],
    ranking: 19, group: 'B',
  },

  // ── GRUPO C ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-C.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Brasil': {
    name: 'Brasil', flag: '🇧🇷',
    // CONMEBOL WCQ 2026 MD9-18 (Oct 2024 – Sep 2025)
    wins: 5, draws: 3, losses: 2, goalsFor: 15, goalsAgainst: 9,
    form: ['W','W','D','D','W','L','D','W','W','L'],
    ranking: 6, group: 'C',
  },
  'Marruecos': {
    name: 'Marruecos', flag: '🇲🇦',
    // CAF WCQ 2026 Grupo E (últimos 3, ganó 6/6) · AFCON 2025 (7 partidos, campeón)
    wins: 9, draws: 1, losses: 0, goalsFor: 25, goalsAgainst: 1,
    form: ['W','W','W','W','D','W','W','W','W','W'],
    ranking: 8, group: 'C',
  },
  'Escocia': {
    name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    // UEFA NL 2024-25 Liga A Grupo 1 (4 partidos) · UEFA WCQ 2026 Grupo C (6 partidos)
    wins: 6, draws: 2, losses: 2, goalsFor: 17, goalsAgainst: 10,
    form: ['L','D','W','W','D','W','W','W','L','W'],
    ranking: 43, group: 'C',
  },
  'Haití': {
    name: 'Haití', flag: '🇭🇹',
    // CNL 2024-25 Liga B (4 partidos) · CONCACAF WCQ 2026 3ra Ronda Grupo C (6 partidos)
    wins: 7, draws: 2, losses: 1, goalsFor: 28, goalsAgainst: 10,
    form: ['W','W','W','W','W','D','D','L','W','W'],
    ranking: 83, group: 'C',
  },

  // ── GRUPO D ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-D.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Estados Unidos': {
    name: 'Estados Unidos', flag: '🇺🇸',
    // Gold Cup 2025 Final · Amistosos Sep-Nov 2025 · Amistosos Mar-May 2026 · Co-anfitrión sin clasificatoria
    wins: 5, draws: 1, losses: 4, goalsFor: 17, goalsAgainst: 15,
    form: ['L','L','W','D','W','W','W','L','L','W'],
    ranking: 16, group: 'D',
  },
  'Paraguay': {
    name: 'Paraguay', flag: '🇵🇾',
    // CONMEBOL WCQ 2026 F12-F18 (Nov 2024 – Sep 2025) · Amistosos Nov 2025 – Mar 2026
    wins: 4, draws: 3, losses: 3, goalsFor: 11, goalsAgainst: 9,
    form: ['D','W','D','W','L','D','W','L','L','W'],
    ranking: 40, group: 'D',
  },
  'Australia': {
    name: 'Australia', flag: '🇦🇺',
    // AFC WCQ 3ª Ronda Grupo C (Nov 2024 – Jun 2025) · Amistosos Sep-Oct 2025 · FIFA Series 2026 (Mar 2026)
    wins: 8, draws: 1, losses: 1, goalsFor: 20, goalsAgainst: 5,
    form: ['D','W','W','W','W','W','W','L','W','W'],
    ranking: 27, group: 'D',
  },
  'Turquía': {
    name: 'Turquía', flag: '🇹🇷',
    // UEFA WCQ 2026 Grupo (Sep-Nov 2025) · Playoffs Path C: Rumanía + Kosovo (Mar 2026) · Amistoso Jun 2026
    wins: 8, draws: 1, losses: 1, goalsFor: 25, goalsAgainst: 13,
    form: ['W','W','L','W','W','W','D','W','W','W'],
    ranking: 22, group: 'D',
  },

  // ── GRUPO E ── datos verificados 2026-06-03 · ver /data/wc2026/groups/grupo-E.json
  // Ranking FIFA: última actualización pública 01/04/2026
  'Alemania': {
    name: 'Alemania', flag: '🇩🇪',
    // UEFA Nations League 2024-25 (QF 2 legs + SF + 3P) · UEFA WCQ 2026 Grupo A (6 partidos sep-nov 2025)
    // Partido más reciente: Alemania 6-0 Eslovaquia (17 nov 2025, WCQ)
    wins: 6, draws: 1, losses: 3, goalsFor: 22, goalsAgainst: 11,
    form: ['W','D','L','L','L','W','W','W','W','W'],
    ranking: 10, group: 'E',
  },
  'Curazao': {
    name: 'Curazao', flag: '🇨🇼',
    // CONCACAF WCQ 2026 2a Ronda Grupo C (4 partidos, jun 2025) · Final Round Grupo B (6 partidos, sep-nov 2025)
    // Invicto en clasificatoria · Partido más reciente: Jamaica 0-0 Curaçao (nov 2025)
    wins: 7, draws: 3, losses: 0, goalsFor: 28, goalsAgainst: 5,
    form: ['W','W','W','W','D','W','W','D','W','D'],
    ranking: 82, group: 'E',
  },
  'Costa de Marfil': {
    name: 'Costa de Marfil', flag: '🇨🇮',
    // CAF WCQ 2026 Grupo F MD6-MD10 (jun 2024 – oct 2025, 0 goles en contra) · AFCON 2025 (dic 2025 – ene 2026, eliminada QF)
    // Partido más reciente: Egipto 3-2 Costa de Marfil (10 ene 2026, AFCON QF)
    wins: 8, draws: 1, losses: 1, goalsFor: 20, goalsAgainst: 6,
    form: ['W','W','W','W','W','W','D','W','W','L'],
    ranking: 34, group: 'E',
  },
  'Ecuador': {
    name: 'Ecuador', flag: '🇪🇨',
    // CONMEBOL WCQ 2026 MD9-MD18 (oct 2024 – sep 2025) · Clasificó 2do con 29 pts
    // Partido más reciente: Ecuador 1-0 Argentina (14 sep 2025, WCQ MD18)
    wins: 4, draws: 6, losses: 0, goalsFor: 8, goalsAgainst: 1,
    form: ['D','D','W','W','W','D','D','D','D','W'],
    ranking: 23, group: 'E',
  },

  // Grupo F
  // Países Bajos: Clasificó 1º Grupo G UEFA (6V 2E 0D, 27GF 4GC). Friendly reciente: 0-1 vs Argelia (Jun 3)
  // Partido más reciente: 0-1 vs Argelia (Jun 3, 2026). Fuentes: ESPN, UEFA.com, FIFA.com
  'Países Bajos': { name: 'Países Bajos', flag: '🇳🇱', wins: 6, draws: 3, losses: 1, goalsFor: 28, goalsAgainst: 7, form: ['W','D','W','W','W','D','W','W','D','L'], ranking: 7, group: 'F' },
  // Japón: Clasificó 1º Grupo C AFC (30GF en 10 partidos). Amistosos: venció a Brasil, Escocia, Inglaterra, Islandia
  // Partido más reciente: 1-0 vs Islandia (May 31, 2026). Fuentes: ESPN, Al Jazeera, Japan Times
  'Japón': { name: 'Japón', flag: '🇯🇵', wins: 7, draws: 1, losses: 2, goalsFor: 19, goalsAgainst: 7, form: ['L','W','L','D','W','W','W','W','W','W'], ranking: 18, group: 'F' },
  // Suecia: Calificó vía Playoff Senda B UEFA (3-1 vs Ucrania, 3-2 vs Polonia). Grupo malo: 2E 4D en fase regular
  // Partido más reciente: 3-2 vs Polonia (Mar 31, 2026). Fuentes: ESPN, UEFA.com, Sofascore
  'Suecia': { name: 'Suecia', flag: '🇸🇪', wins: 4, draws: 2, losses: 4, goalsFor: 16, goalsAgainst: 18, form: ['W','W','D','L','L','L','L','D','W','W'], ranking: 38, group: 'F' },
  // Túnez: Copa Árabe 2025 + AFCON 2025 (eliminado en octavos por Malí en penales). Ranking FIFA 44
  // Partido más reciente: 0-1 vs Austria (Jun 1, 2026). Fuentes: ESPN, CAFonline, Al Jazeera
  'Túnez': { name: 'Túnez', flag: '🇹🇳', wins: 3, draws: 3, losses: 4, goalsFor: 13, goalsAgainst: 10, form: ['L','D','W','W','L','D','L','W','D','L'], ranking: 44, group: 'F' },

  // Grupo G
  // Bélgica: NL 2024/25 (QF vs Ucrania) + Clasificación WC UEFA Grupo J (ganador). Ranking FIFA abr-2026.
  // Partidos Jun/Sep 2025 estimados; 5 confirmados (Oct-Nov 2025 + NL playoff). Fuente: UEFA.com, ESPN
  'Bélgica': { name: 'Bélgica', flag: '🇧🇪', wins: 7, draws: 2, losses: 1, goalsFor: 29, goalsAgainst: 9, form: ['L','W','W','W','W','W','D','W','D','W'], ranking: 9, group: 'G' },
  // Irán: AFC 3ª ronda Grupo A (7V-2E-1D, ganador, 23 pts). Taremi 10 goles en clasificatoria. Ranking FIFA abr-2026.
  // 3 partidos confirmados (mar/jun 2025); 7 estimados basados en récord oficial 7V-2E-1D. Fuente: ESPN, FIFA.com
  'Irán': { name: 'Irán', flag: '🇮🇷', wins: 7, draws: 2, losses: 1, goalsFor: 22, goalsAgainst: 4, form: ['W','W','W','W','W','D','W','D','L','W'], ranking: 21, group: 'G' },
  // Nueva Zelanda: OFC clasificación invicta (19 GF / 1 GC en 6 partidos oficiales). Amistosos Mar 2026 confirmados.
  // Rondas 1-2 OFC scores estimados; Ronda 3 SF+Final confirmados. Fuente: FIFA.com, NZFootball.co.nz
  'Nueva Zelanda': { name: 'Nueva Zelanda', flag: '🇳🇿', wins: 7, draws: 0, losses: 3, goalsFor: 25, goalsAgainst: 9, form: ['W','W','W','W','W','W','L','L','L','W'], ranking: 85, group: 'G' },
  // Egipto: 4º AFCON 2025 + Copa Árabe 2025 + Clasif. AFCON 2027 (jun-2026). Ranking FIFA abr-2026.
  // 8 partidos confirmados (AFCON + Copa Árabe); 2 jun-2026 con scores estimados. Fuente: olympics.com, ESPN
  'Egipto': { name: 'Egipto', flag: '🇪🇬', wins: 5, draws: 2, losses: 3, goalsFor: 12, goalsAgainst: 9, form: ['L','W','W','D','W','W','L','L','W','D'], ranking: 37, group: 'G' },

  // Grupo H
  'España': { name: 'España', flag: '🇪🇸', wins: 8, draws: 1, losses: 1, goalsFor: 25, goalsAgainst: 6, form: ['W','W','W','D','W'], ranking: 4, group: 'H' },
  'Cabo Verde': { name: 'Cabo Verde', flag: '🇨🇻', wins: 4, draws: 2, losses: 4, goalsFor: 11, goalsAgainst: 13, form: ['W','D','L','W','L'], ranking: 70, group: 'H' },
  'Arabia Saudita': { name: 'Arabia Saudita', flag: '🇸🇦', wins: 4, draws: 2, losses: 4, goalsFor: 11, goalsAgainst: 14, form: ['L','W','D','W','L'], ranking: 57, group: 'H' },
  'Uruguay': { name: 'Uruguay', flag: '🇺🇾', wins: 6, draws: 1, losses: 3, goalsFor: 16, goalsAgainst: 13, form: ['W','W','L','D','W'], ranking: 15, group: 'H' },

  // Grupo I
  'Francia': { name: 'Francia', flag: '🇫🇷', wins: 7, draws: 2, losses: 1, goalsFor: 23, goalsAgainst: 8, form: ['W','W','W','D','W'], ranking: 2, group: 'I' },
  'Senegal': { name: 'Senegal', flag: '🇸🇳', wins: 5, draws: 3, losses: 2, goalsFor: 13, goalsAgainst: 10, form: ['W','D','W','D','W'], ranking: 18, group: 'I' },
  'Irak': { name: 'Irak', flag: '🇮🇶', wins: 4, draws: 2, losses: 4, goalsFor: 11, goalsAgainst: 14, form: ['W','D','L','W','L'], ranking: 65, group: 'I' },
  'Noruega': { name: 'Noruega', flag: '🇳🇴', wins: 5, draws: 2, losses: 3, goalsFor: 18, goalsAgainst: 14, form: ['W','W','D','L','W'], ranking: 30, group: 'I' },

  // Grupo J
  'Argentina': { name: 'Argentina', flag: '🇦🇷', wins: 7, draws: 2, losses: 1, goalsFor: 24, goalsAgainst: 7, form: ['W','W','W','D','W'], ranking: 1, group: 'J' },
  'Argelia': { name: 'Argelia', flag: '🇩🇿', wins: 5, draws: 2, losses: 3, goalsFor: 13, goalsAgainst: 12, form: ['W','D','W','L','W'], ranking: 42, group: 'J' },
  'Austria': { name: 'Austria', flag: '🇦🇹', wins: 5, draws: 3, losses: 2, goalsFor: 15, goalsAgainst: 12, form: ['D','W','W','D','W'], ranking: 24, group: 'J' },
  'Jordania': { name: 'Jordania', flag: '🇯🇴', wins: 3, draws: 2, losses: 5, goalsFor: 10, goalsAgainst: 16, form: ['L','D','W','L','L'], ranking: 90, group: 'J' },

  // Grupo K
  'Portugal': { name: 'Portugal', flag: '🇵🇹', wins: 7, draws: 1, losses: 2, goalsFor: 24, goalsAgainst: 10, form: ['W','W','W','D','L'], ranking: 7, group: 'K' },
  'Uzbekistán': { name: 'Uzbekistán', flag: '🇺🇿', wins: 5, draws: 1, losses: 4, goalsFor: 13, goalsAgainst: 13, form: ['W','L','W','D','L'], ranking: 75, group: 'K' },
  'Colombia': { name: 'Colombia', flag: '🇨🇴', wins: 6, draws: 3, losses: 1, goalsFor: 16, goalsAgainst: 9, form: ['W','W','D','W','W'], ranking: 22, group: 'K' },
  'RD Congo': { name: 'RD Congo', flag: '🇨🇩', wins: 4, draws: 2, losses: 4, goalsFor: 11, goalsAgainst: 13, form: ['W','D','L','W','L'], ranking: 58, group: 'K' },

  // Grupo L
  'Inglaterra': { name: 'Inglaterra', flag: '🏴', wins: 7, draws: 2, losses: 1, goalsFor: 22, goalsAgainst: 8, form: ['W','W','D','W','W'], ranking: 5, group: 'L' },
  'Croacia': { name: 'Croacia', flag: '🇭🇷', wins: 5, draws: 2, losses: 3, goalsFor: 13, goalsAgainst: 12, form: ['W','D','W','L','D'], ranking: 15, group: 'L' },
  'Panamá': { name: 'Panamá', flag: '🇵🇦', wins: 4, draws: 1, losses: 5, goalsFor: 10, goalsAgainst: 15, form: ['L','W','D','L','W'], ranking: 65, group: 'L' },
  'Ghana': { name: 'Ghana', flag: '🇬🇭', wins: 4, draws: 3, losses: 3, goalsFor: 12, goalsAgainst: 14, form: ['D','W','L','D','W'], ranking: 55, group: 'L' },
}

export const GROUPS: Record<string, string[]> = {
  A: ['México', 'Sudáfrica', 'Corea del Sur', 'Chequia'],
  B: ['Canadá', 'Bosnia y Herzegovina', 'Catar', 'Suiza'],
  C: ['Brasil', 'Marruecos', 'Escocia', 'Haití'],
  D: ['Estados Unidos', 'Paraguay', 'Australia', 'Turquía'],
  E: ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'],
  F: ['Países Bajos', 'Japón', 'Suecia', 'Túnez'],
  G: ['Bélgica', 'Irán', 'Nueva Zelanda', 'Egipto'],
  H: ['España', 'Cabo Verde', 'Arabia Saudita', 'Uruguay'],
  I: ['Francia', 'Senegal', 'Irak', 'Noruega'],
  J: ['Argentina', 'Argelia', 'Austria', 'Jordania'],
  K: ['Portugal', 'Uzbekistán', 'Colombia', 'RD Congo'],
  L: ['Inglaterra', 'Croacia', 'Panamá', 'Ghana'],
}

export const GROUP_STAGE_MATCHES: WCMatch[] = [
  // GRUPO A
  { id: 'A1', group: 'A', phase: 'group', homeTeam: 'México', awayTeam: 'Sudáfrica', date: '2026-06-11', time: '14:00', matchday: 1 },
  { id: 'A2', group: 'A', phase: 'group', homeTeam: 'Corea del Sur', awayTeam: 'Chequia', date: '2026-06-11', time: '21:00', matchday: 1 },
  { id: 'A3', group: 'A', phase: 'group', homeTeam: 'Chequia', awayTeam: 'Sudáfrica', date: '2026-06-18', time: '11:00', matchday: 2 },
  { id: 'A4', group: 'A', phase: 'group', homeTeam: 'México', awayTeam: 'Corea del Sur', date: '2026-06-18', time: '20:00', matchday: 2 },
  { id: 'A5', group: 'A', phase: 'group', homeTeam: 'Sudáfrica', awayTeam: 'Corea del Sur', date: '2026-06-24', time: '20:00', matchday: 3 },
  { id: 'A6', group: 'A', phase: 'group', homeTeam: 'Chequia', awayTeam: 'México', date: '2026-06-24', time: '20:00', matchday: 3 },

  // GRUPO B
  { id: 'B1', group: 'B', phase: 'group', homeTeam: 'Canadá', awayTeam: 'Bosnia y Herzegovina', date: '2026-06-12', time: '14:00', matchday: 1 },
  { id: 'B2', group: 'B', phase: 'group', homeTeam: 'Catar', awayTeam: 'Suiza', date: '2026-06-13', time: '14:00', matchday: 1 },
  { id: 'B3', group: 'B', phase: 'group', homeTeam: 'Suiza', awayTeam: 'Bosnia y Herzegovina', date: '2026-06-18', time: '14:00', matchday: 2 },
  { id: 'B4', group: 'B', phase: 'group', homeTeam: 'Canadá', awayTeam: 'Catar', date: '2026-06-18', time: '17:00', matchday: 2 },
  { id: 'B5', group: 'B', phase: 'group', homeTeam: 'Suiza', awayTeam: 'Canadá', date: '2026-06-24', time: '14:00', matchday: 3 },
  { id: 'B6', group: 'B', phase: 'group', homeTeam: 'Bosnia y Herzegovina', awayTeam: 'Catar', date: '2026-06-24', time: '14:00', matchday: 3 },

  // GRUPO C
  { id: 'C1', group: 'C', phase: 'group', homeTeam: 'Brasil', awayTeam: 'Marruecos', date: '2026-06-13', time: '17:00', matchday: 1 },
  { id: 'C2', group: 'C', phase: 'group', homeTeam: 'Haití', awayTeam: 'Escocia', date: '2026-06-13', time: '20:00', matchday: 1 },
  { id: 'C3', group: 'C', phase: 'group', homeTeam: 'Escocia', awayTeam: 'Marruecos', date: '2026-06-19', time: '17:00', matchday: 2 },
  { id: 'C4', group: 'C', phase: 'group', homeTeam: 'Brasil', awayTeam: 'Haití', date: '2026-06-19', time: '19:30', matchday: 2 },
  { id: 'C5', group: 'C', phase: 'group', homeTeam: 'Marruecos', awayTeam: 'Haití', date: '2026-06-24', time: '17:00', matchday: 3 },
  { id: 'C6', group: 'C', phase: 'group', homeTeam: 'Escocia', awayTeam: 'Brasil', date: '2026-06-24', time: '17:00', matchday: 3 },

  // GRUPO D
  { id: 'D1', group: 'D', phase: 'group', homeTeam: 'Estados Unidos', awayTeam: 'Paraguay', date: '2026-06-12', time: '20:00', matchday: 1 },
  { id: 'D2', group: 'D', phase: 'group', homeTeam: 'Australia', awayTeam: 'Turquía', date: '2026-06-13', time: '23:00', matchday: 1 },
  { id: 'D3', group: 'D', phase: 'group', homeTeam: 'Estados Unidos', awayTeam: 'Australia', date: '2026-06-19', time: '14:00', matchday: 2 },
  { id: 'D4', group: 'D', phase: 'group', homeTeam: 'Turquía', awayTeam: 'Paraguay', date: '2026-06-19', time: '22:00', matchday: 2 },
  { id: 'D5', group: 'D', phase: 'group', homeTeam: 'Turquía', awayTeam: 'Estados Unidos', date: '2026-06-25', time: '21:00', matchday: 3 },
  { id: 'D6', group: 'D', phase: 'group', homeTeam: 'Paraguay', awayTeam: 'Australia', date: '2026-06-25', time: '21:00', matchday: 3 },

  // GRUPO E
  { id: 'E1', group: 'E', phase: 'group', homeTeam: 'Alemania', awayTeam: 'Curazao', date: '2026-06-14', time: '12:00', matchday: 1 },
  { id: 'E2', group: 'E', phase: 'group', homeTeam: 'Costa de Marfil', awayTeam: 'Ecuador', date: '2026-06-14', time: '18:00', matchday: 1 },
  { id: 'E3', group: 'E', phase: 'group', homeTeam: 'Alemania', awayTeam: 'Costa de Marfil', date: '2026-06-20', time: '15:00', matchday: 2 },
  { id: 'E4', group: 'E', phase: 'group', homeTeam: 'Ecuador', awayTeam: 'Curazao', date: '2026-06-20', time: '19:00', matchday: 2 },
  { id: 'E5', group: 'E', phase: 'group', homeTeam: 'Curazao', awayTeam: 'Costa de Marfil', date: '2026-06-25', time: '15:00', matchday: 3 },
  { id: 'E6', group: 'E', phase: 'group', homeTeam: 'Ecuador', awayTeam: 'Alemania', date: '2026-06-25', time: '15:00', matchday: 3 },

  // GRUPO F
  { id: 'F1', group: 'F', phase: 'group', homeTeam: 'Países Bajos', awayTeam: 'Japón', date: '2026-06-14', time: '15:00', matchday: 1 },
  { id: 'F2', group: 'F', phase: 'group', homeTeam: 'Suecia', awayTeam: 'Túnez', date: '2026-06-14', time: '21:00', matchday: 1 },
  { id: 'F3', group: 'F', phase: 'group', homeTeam: 'Países Bajos', awayTeam: 'Suecia', date: '2026-06-20', time: '12:00', matchday: 2 },
  { id: 'F4', group: 'F', phase: 'group', homeTeam: 'Túnez', awayTeam: 'Japón', date: '2026-06-20', time: '23:00', matchday: 2 },
  { id: 'F5', group: 'F', phase: 'group', homeTeam: 'Túnez', awayTeam: 'Países Bajos', date: '2026-06-25', time: '18:00', matchday: 3 },
  { id: 'F6', group: 'F', phase: 'group', homeTeam: 'Japón', awayTeam: 'Suecia', date: '2026-06-25', time: '18:00', matchday: 3 },

  // GRUPO G
  { id: 'G1', group: 'G', phase: 'group', homeTeam: 'Bélgica', awayTeam: 'Egipto', date: '2026-06-15', time: '14:00', matchday: 1 },
  { id: 'G2', group: 'G', phase: 'group', homeTeam: 'Irán', awayTeam: 'Nueva Zelanda', date: '2026-06-15', time: '20:00', matchday: 1 },
  { id: 'G3', group: 'G', phase: 'group', homeTeam: 'Bélgica', awayTeam: 'Irán', date: '2026-06-21', time: '14:00', matchday: 2 },
  { id: 'G4', group: 'G', phase: 'group', homeTeam: 'Nueva Zelanda', awayTeam: 'Egipto', date: '2026-06-21', time: '20:00', matchday: 2 },
  { id: 'G5', group: 'G', phase: 'group', homeTeam: 'Nueva Zelanda', awayTeam: 'Bélgica', date: '2026-06-26', time: '22:00', matchday: 3 },
  { id: 'G6', group: 'G', phase: 'group', homeTeam: 'Egipto', awayTeam: 'Irán', date: '2026-06-26', time: '22:00', matchday: 3 },

  // GRUPO H
  { id: 'H1', group: 'H', phase: 'group', homeTeam: 'España', awayTeam: 'Cabo Verde', date: '2026-06-15', time: '11:00', matchday: 1 },
  { id: 'H2', group: 'H', phase: 'group', homeTeam: 'Arabia Saudita', awayTeam: 'Uruguay', date: '2026-06-15', time: '17:00', matchday: 1 },
  { id: 'H3', group: 'H', phase: 'group', homeTeam: 'España', awayTeam: 'Arabia Saudita', date: '2026-06-21', time: '11:00', matchday: 2 },
  { id: 'H4', group: 'H', phase: 'group', homeTeam: 'Uruguay', awayTeam: 'Cabo Verde', date: '2026-06-21', time: '17:00', matchday: 2 },
  { id: 'H5', group: 'H', phase: 'group', homeTeam: 'Cabo Verde', awayTeam: 'Arabia Saudita', date: '2026-06-26', time: '19:00', matchday: 3 },
  { id: 'H6', group: 'H', phase: 'group', homeTeam: 'Uruguay', awayTeam: 'España', date: '2026-06-26', time: '19:00', matchday: 3 },

  // GRUPO I
  { id: 'I1', group: 'I', phase: 'group', homeTeam: 'Francia', awayTeam: 'Senegal', date: '2026-06-16', time: '14:00', matchday: 1 },
  { id: 'I2', group: 'I', phase: 'group', homeTeam: 'Irak', awayTeam: 'Noruega', date: '2026-06-16', time: '17:00', matchday: 1 },
  { id: 'I3', group: 'I', phase: 'group', homeTeam: 'Francia', awayTeam: 'Irak', date: '2026-06-22', time: '16:00', matchday: 2 },
  { id: 'I4', group: 'I', phase: 'group', homeTeam: 'Noruega', awayTeam: 'Senegal', date: '2026-06-22', time: '19:00', matchday: 2 },
  { id: 'I5', group: 'I', phase: 'group', homeTeam: 'Noruega', awayTeam: 'Francia', date: '2026-06-26', time: '14:00', matchday: 3 },
  { id: 'I6', group: 'I', phase: 'group', homeTeam: 'Senegal', awayTeam: 'Irak', date: '2026-06-26', time: '14:00', matchday: 3 },

  // GRUPO J
  { id: 'J1', group: 'J', phase: 'group', homeTeam: 'Argentina', awayTeam: 'Argelia', date: '2026-06-16', time: '20:00', matchday: 1 },
  { id: 'J2', group: 'J', phase: 'group', homeTeam: 'Austria', awayTeam: 'Jordania', date: '2026-06-16', time: '23:00', matchday: 1 },
  { id: 'J3', group: 'J', phase: 'group', homeTeam: 'Argentina', awayTeam: 'Austria', date: '2026-06-22', time: '12:00', matchday: 2 },
  { id: 'J4', group: 'J', phase: 'group', homeTeam: 'Jordania', awayTeam: 'Argelia', date: '2026-06-22', time: '22:00', matchday: 2 },
  { id: 'J5', group: 'J', phase: 'group', homeTeam: 'Argelia', awayTeam: 'Austria', date: '2026-06-27', time: '21:00', matchday: 3 },
  { id: 'J6', group: 'J', phase: 'group', homeTeam: 'Jordania', awayTeam: 'Argentina', date: '2026-06-27', time: '21:00', matchday: 3 },

  // GRUPO K
  { id: 'K1', group: 'K', phase: 'group', homeTeam: 'Portugal', awayTeam: 'RD Congo', date: '2026-06-17', time: '12:00', matchday: 1 },
  { id: 'K2', group: 'K', phase: 'group', homeTeam: 'Uzbekistán', awayTeam: 'Colombia', date: '2026-06-17', time: '21:00', matchday: 1 },
  { id: 'K3', group: 'K', phase: 'group', homeTeam: 'Portugal', awayTeam: 'Uzbekistán', date: '2026-06-23', time: '12:00', matchday: 2 },
  { id: 'K4', group: 'K', phase: 'group', homeTeam: 'Colombia', awayTeam: 'RD Congo', date: '2026-06-23', time: '21:00', matchday: 2 },
  { id: 'K5', group: 'K', phase: 'group', homeTeam: 'Colombia', awayTeam: 'Portugal', date: '2026-06-27', time: '18:30', matchday: 3 },
  { id: 'K6', group: 'K', phase: 'group', homeTeam: 'RD Congo', awayTeam: 'Uzbekistán', date: '2026-06-27', time: '18:30', matchday: 3 },

  // GRUPO L
  { id: 'L1', group: 'L', phase: 'group', homeTeam: 'Inglaterra', awayTeam: 'Croacia', date: '2026-06-17', time: '15:00', matchday: 1 },
  { id: 'L2', group: 'L', phase: 'group', homeTeam: 'Ghana', awayTeam: 'Panamá', date: '2026-06-17', time: '18:00', matchday: 1 },
  { id: 'L3', group: 'L', phase: 'group', homeTeam: 'Inglaterra', awayTeam: 'Ghana', date: '2026-06-23', time: '15:00', matchday: 2 },
  { id: 'L4', group: 'L', phase: 'group', homeTeam: 'Panamá', awayTeam: 'Croacia', date: '2026-06-23', time: '18:00', matchday: 2 },
  { id: 'L5', group: 'L', phase: 'group', homeTeam: 'Panamá', awayTeam: 'Inglaterra', date: '2026-06-27', time: '16:00', matchday: 3 },
  { id: 'L6', group: 'L', phase: 'group', homeTeam: 'Croacia', awayTeam: 'Ghana', date: '2026-06-27', time: '16:00', matchday: 3 },
]

export function getMatchById(id: string): WCMatch | undefined {
  return GROUP_STAGE_MATCHES.find(m => m.id === id)
}

export function getTeam(name: string): TeamData | undefined {
  return TEAMS[name]
}

export function formatMatchDate(dateStr: string, time: string): string {
  const date = new Date(dateStr + 'T' + time + ':00-05:00')
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function getMatchesByDate(): Map<string, WCMatch[]> {
  const map = new Map<string, WCMatch[]>()
  for (const match of GROUP_STAGE_MATCHES) {
    const existing = map.get(match.date) ?? []
    existing.push(match)
    map.set(match.date, existing)
  }
  return map
}

export function getMatchesByGroup(group: string): WCMatch[] {
  return GROUP_STAGE_MATCHES.filter(m => m.group === group)
}
