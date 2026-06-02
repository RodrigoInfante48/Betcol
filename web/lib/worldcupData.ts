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
  // Grupo A
  'México': { name: 'México', flag: '🇲🇽', wins: 5, draws: 3, losses: 2, goalsFor: 15, goalsAgainst: 12, form: ['W','D','W','L','W'], ranking: 15, group: 'A' },
  'Sudáfrica': { name: 'Sudáfrica', flag: '🇿🇦', wins: 4, draws: 2, losses: 4, goalsFor: 11, goalsAgainst: 14, form: ['L','W','D','W','L'], ranking: 65, group: 'A' },
  'Corea del Sur': { name: 'Corea del Sur', flag: '🇰🇷', wins: 5, draws: 2, losses: 3, goalsFor: 14, goalsAgainst: 13, form: ['W','W','D','L','W'], ranking: 22, group: 'A' },
  'Chequia': { name: 'Chequia', flag: '🇨🇿', wins: 4, draws: 3, losses: 3, goalsFor: 12, goalsAgainst: 12, form: ['D','W','L','W','D'], ranking: 35, group: 'A' },

  // Grupo B
  'Canadá': { name: 'Canadá', flag: '🇨🇦', wins: 5, draws: 2, losses: 3, goalsFor: 13, goalsAgainst: 13, form: ['W','D','W','L','W'], ranking: 40, group: 'B' },
  'Bosnia y Herzegovina': { name: 'Bosnia y Herzegovina', flag: '🇧🇦', wins: 4, draws: 2, losses: 4, goalsFor: 13, goalsAgainst: 15, form: ['L','W','D','L','W'], ranking: 60, group: 'B' },
  'Catar': { name: 'Catar', flag: '🇶🇦', wins: 3, draws: 2, losses: 5, goalsFor: 9, goalsAgainst: 16, form: ['L','L','D','W','L'], ranking: 58, group: 'B' },
  'Suiza': { name: 'Suiza', flag: '🇨🇭', wins: 5, draws: 3, losses: 2, goalsFor: 14, goalsAgainst: 10, form: ['W','D','W','W','D'], ranking: 20, group: 'B' },

  // Grupo C
  'Brasil': { name: 'Brasil', flag: '🇧🇷', wins: 7, draws: 1, losses: 2, goalsFor: 21, goalsAgainst: 9, form: ['W','W','D','W','W'], ranking: 6, group: 'C' },
  'Marruecos': { name: 'Marruecos', flag: '🇲🇦', wins: 6, draws: 2, losses: 2, goalsFor: 14, goalsAgainst: 9, form: ['W','W','D','W','L'], ranking: 14, group: 'C' },
  'Escocia': { name: 'Escocia', flag: '🏴', wins: 4, draws: 2, losses: 4, goalsFor: 12, goalsAgainst: 14, form: ['L','W','W','D','L'], ranking: 38, group: 'C' },
  'Haití': { name: 'Haití', flag: '🇭🇹', wins: 3, draws: 1, losses: 6, goalsFor: 9, goalsAgainst: 18, form: ['L','L','W','D','L'], ranking: 95, group: 'C' },

  // Grupo D
  'Estados Unidos': { name: 'Estados Unidos', flag: '🇺🇸', wins: 5, draws: 2, losses: 3, goalsFor: 15, goalsAgainst: 13, form: ['W','W','D','L','W'], ranking: 13, group: 'D' },
  'Paraguay': { name: 'Paraguay', flag: '🇵🇾', wins: 4, draws: 2, losses: 4, goalsFor: 11, goalsAgainst: 14, form: ['L','W','D','W','L'], ranking: 50, group: 'D' },
  'Australia': { name: 'Australia', flag: '🇦🇺', wins: 4, draws: 2, losses: 4, goalsFor: 12, goalsAgainst: 13, form: ['W','D','L','W','L'], ranking: 25, group: 'D' },
  'Turquía': { name: 'Turquía', flag: '🇹🇷', wins: 5, draws: 2, losses: 3, goalsFor: 14, goalsAgainst: 13, form: ['W','L','W','D','W'], ranking: 45, group: 'D' },

  // Grupo E
  'Alemania': { name: 'Alemania', flag: '🇩🇪', wins: 6, draws: 2, losses: 2, goalsFor: 19, goalsAgainst: 12, form: ['W','W','D','W','L'], ranking: 12, group: 'E' },
  'Curazao': { name: 'Curazao', flag: '🇨🇼', wins: 3, draws: 1, losses: 6, goalsFor: 8, goalsAgainst: 17, form: ['L','D','L','W','L'], ranking: 75, group: 'E' },
  'Costa de Marfil': { name: 'Costa de Marfil', flag: '🇨🇮', wins: 5, draws: 2, losses: 3, goalsFor: 14, goalsAgainst: 12, form: ['W','D','W','L','W'], ranking: 50, group: 'E' },
  'Ecuador': { name: 'Ecuador', flag: '🇪🇨', wins: 5, draws: 2, losses: 3, goalsFor: 14, goalsAgainst: 13, form: ['W','W','D','L','W'], ranking: 45, group: 'E' },

  // Grupo F
  'Países Bajos': { name: 'Países Bajos', flag: '🇳🇱', wins: 6, draws: 3, losses: 1, goalsFor: 18, goalsAgainst: 10, form: ['W','W','D','W','D'], ranking: 10, group: 'F' },
  'Japón': { name: 'Japón', flag: '🇯🇵', wins: 6, draws: 2, losses: 2, goalsFor: 17, goalsAgainst: 10, form: ['W','W','D','W','L'], ranking: 16, group: 'F' },
  'Suecia': { name: 'Suecia', flag: '🇸🇪', wins: 5, draws: 2, losses: 3, goalsFor: 16, goalsAgainst: 14, form: ['W','D','W','L','W'], ranking: 25, group: 'F' },
  'Túnez': { name: 'Túnez', flag: '🇹🇳', wins: 4, draws: 3, losses: 3, goalsFor: 11, goalsAgainst: 12, form: ['D','W','L','D','W'], ranking: 30, group: 'F' },

  // Grupo G
  'Bélgica': { name: 'Bélgica', flag: '🇧🇪', wins: 6, draws: 2, losses: 2, goalsFor: 17, goalsAgainst: 11, form: ['W','W','D','L','W'], ranking: 9, group: 'G' },
  'Irán': { name: 'Irán', flag: '🇮🇷', wins: 5, draws: 1, losses: 4, goalsFor: 13, goalsAgainst: 15, form: ['W','L','W','D','L'], ranking: 20, group: 'G' },
  'Nueva Zelanda': { name: 'Nueva Zelanda', flag: '🇳🇿', wins: 3, draws: 3, losses: 4, goalsFor: 9, goalsAgainst: 15, form: ['D','L','W','D','L'], ranking: 100, group: 'G' },
  'Egipto': { name: 'Egipto', flag: '🇪🇬', wins: 5, draws: 2, losses: 3, goalsFor: 13, goalsAgainst: 11, form: ['W','W','D','L','W'], ranking: 50, group: 'G' },

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
