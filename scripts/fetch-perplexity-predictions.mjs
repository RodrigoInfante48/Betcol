/**
 * Consulta la API de Perplexity para obtener probabilidades de los 48 partidos
 * del Mundial 2026 y guarda los resultados en data/wc2026/predictions/predictions.json
 *
 * Uso:
 *   PERPLEXITY_API_KEY=pplx-xxx node scripts/fetch-perplexity-predictions.mjs
 *
 * Opciones:
 *   --match=C4          Solo regenerar un partido específico
 *   --group=C           Solo regenerar los partidos de un grupo
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT_FILE = path.join(ROOT, 'data', 'wc2026', 'predictions', 'predictions.json')

const API_KEY = process.env.PERPLEXITY_API_KEY
if (!API_KEY) {
  console.error('❌  Falta la variable de entorno PERPLEXITY_API_KEY')
  console.error('   Ejemplo: PERPLEXITY_API_KEY=pplx-xxx node scripts/fetch-perplexity-predictions.mjs')
  process.exit(1)
}

// ─── Todos los partidos del grupo stage ───────────────────────────────────────
const MATCHES = [
  // GRUPO A
  { id: 'A1', home: 'México',           away: 'Sudáfrica',             group: 'A', date: '2026-06-11' },
  { id: 'A2', home: 'Corea del Sur',    away: 'Chequia',               group: 'A', date: '2026-06-11' },
  { id: 'A3', home: 'Chequia',          away: 'Sudáfrica',             group: 'A', date: '2026-06-18' },
  { id: 'A4', home: 'México',           away: 'Corea del Sur',         group: 'A', date: '2026-06-18' },
  { id: 'A5', home: 'Sudáfrica',        away: 'Corea del Sur',         group: 'A', date: '2026-06-24' },
  { id: 'A6', home: 'Chequia',          away: 'México',                group: 'A', date: '2026-06-24' },
  // GRUPO B
  { id: 'B1', home: 'Canadá',           away: 'Bosnia y Herzegovina',  group: 'B', date: '2026-06-12' },
  { id: 'B2', home: 'Catar',            away: 'Suiza',                 group: 'B', date: '2026-06-13' },
  { id: 'B3', home: 'Suiza',            away: 'Bosnia y Herzegovina',  group: 'B', date: '2026-06-18' },
  { id: 'B4', home: 'Canadá',           away: 'Catar',                 group: 'B', date: '2026-06-18' },
  { id: 'B5', home: 'Suiza',            away: 'Canadá',                group: 'B', date: '2026-06-24' },
  { id: 'B6', home: 'Bosnia y Herzegovina', away: 'Catar',             group: 'B', date: '2026-06-24' },
  // GRUPO C
  { id: 'C1', home: 'Brasil',           away: 'Marruecos',             group: 'C', date: '2026-06-13' },
  { id: 'C2', home: 'Haití',            away: 'Escocia',               group: 'C', date: '2026-06-13' },
  { id: 'C3', home: 'Escocia',          away: 'Marruecos',             group: 'C', date: '2026-06-19' },
  { id: 'C4', home: 'Brasil',           away: 'Haití',                 group: 'C', date: '2026-06-19' },
  { id: 'C5', home: 'Marruecos',        away: 'Haití',                 group: 'C', date: '2026-06-24' },
  { id: 'C6', home: 'Escocia',          away: 'Brasil',                group: 'C', date: '2026-06-24' },
  // GRUPO D
  { id: 'D1', home: 'Estados Unidos',   away: 'Paraguay',              group: 'D', date: '2026-06-12' },
  { id: 'D2', home: 'Australia',        away: 'Turquía',               group: 'D', date: '2026-06-13' },
  { id: 'D3', home: 'Estados Unidos',   away: 'Australia',             group: 'D', date: '2026-06-19' },
  { id: 'D4', home: 'Turquía',          away: 'Paraguay',              group: 'D', date: '2026-06-19' },
  { id: 'D5', home: 'Turquía',          away: 'Estados Unidos',        group: 'D', date: '2026-06-25' },
  { id: 'D6', home: 'Paraguay',         away: 'Australia',             group: 'D', date: '2026-06-25' },
  // GRUPO E
  { id: 'E1', home: 'Alemania',         away: 'Curazao',               group: 'E', date: '2026-06-14' },
  { id: 'E2', home: 'Costa de Marfil',  away: 'Ecuador',               group: 'E', date: '2026-06-14' },
  { id: 'E3', home: 'Alemania',         away: 'Costa de Marfil',       group: 'E', date: '2026-06-20' },
  { id: 'E4', home: 'Ecuador',          away: 'Curazao',               group: 'E', date: '2026-06-20' },
  { id: 'E5', home: 'Curazao',          away: 'Costa de Marfil',       group: 'E', date: '2026-06-25' },
  { id: 'E6', home: 'Ecuador',          away: 'Alemania',              group: 'E', date: '2026-06-25' },
  // GRUPO F
  { id: 'F1', home: 'Países Bajos',     away: 'Japón',                 group: 'F', date: '2026-06-14' },
  { id: 'F2', home: 'Suecia',           away: 'Túnez',                 group: 'F', date: '2026-06-14' },
  { id: 'F3', home: 'Países Bajos',     away: 'Suecia',                group: 'F', date: '2026-06-20' },
  { id: 'F4', home: 'Túnez',            away: 'Japón',                 group: 'F', date: '2026-06-20' },
  { id: 'F5', home: 'Túnez',            away: 'Países Bajos',          group: 'F', date: '2026-06-25' },
  { id: 'F6', home: 'Japón',            away: 'Suecia',                group: 'F', date: '2026-06-25' },
  // GRUPO G
  { id: 'G1', home: 'Bélgica',          away: 'Egipto',                group: 'G', date: '2026-06-15' },
  { id: 'G2', home: 'Irán',             away: 'Nueva Zelanda',         group: 'G', date: '2026-06-15' },
  { id: 'G3', home: 'Bélgica',          away: 'Irán',                  group: 'G', date: '2026-06-21' },
  { id: 'G4', home: 'Nueva Zelanda',    away: 'Egipto',                group: 'G', date: '2026-06-21' },
  { id: 'G5', home: 'Nueva Zelanda',    away: 'Bélgica',               group: 'G', date: '2026-06-26' },
  { id: 'G6', home: 'Egipto',           away: 'Irán',                  group: 'G', date: '2026-06-26' },
  // GRUPO H
  { id: 'H1', home: 'España',           away: 'Cabo Verde',            group: 'H', date: '2026-06-15' },
  { id: 'H2', home: 'Arabia Saudita',   away: 'Uruguay',               group: 'H', date: '2026-06-15' },
  { id: 'H3', home: 'España',           away: 'Arabia Saudita',        group: 'H', date: '2026-06-21' },
  { id: 'H4', home: 'Uruguay',          away: 'Cabo Verde',            group: 'H', date: '2026-06-21' },
  { id: 'H5', home: 'Cabo Verde',       away: 'Arabia Saudita',        group: 'H', date: '2026-06-26' },
  { id: 'H6', home: 'Uruguay',          away: 'España',                group: 'H', date: '2026-06-26' },
  // GRUPO I
  { id: 'I1', home: 'Francia',          away: 'Senegal',               group: 'I', date: '2026-06-16' },
  { id: 'I2', home: 'Irak',             away: 'Noruega',               group: 'I', date: '2026-06-16' },
  { id: 'I3', home: 'Francia',          away: 'Irak',                  group: 'I', date: '2026-06-22' },
  { id: 'I4', home: 'Noruega',          away: 'Senegal',               group: 'I', date: '2026-06-22' },
  { id: 'I5', home: 'Noruega',          away: 'Francia',               group: 'I', date: '2026-06-26' },
  { id: 'I6', home: 'Senegal',          away: 'Irak',                  group: 'I', date: '2026-06-26' },
  // GRUPO J
  { id: 'J1', home: 'Argentina',        away: 'Argelia',               group: 'J', date: '2026-06-16' },
  { id: 'J2', home: 'Austria',          away: 'Jordania',              group: 'J', date: '2026-06-16' },
  { id: 'J3', home: 'Argentina',        away: 'Austria',               group: 'J', date: '2026-06-22' },
  { id: 'J4', home: 'Jordania',         away: 'Argelia',               group: 'J', date: '2026-06-22' },
  { id: 'J5', home: 'Argelia',          away: 'Austria',               group: 'J', date: '2026-06-27' },
  { id: 'J6', home: 'Jordania',         away: 'Argentina',             group: 'J', date: '2026-06-27' },
  // GRUPO K
  { id: 'K1', home: 'Portugal',         away: 'RD Congo',              group: 'K', date: '2026-06-17' },
  { id: 'K2', home: 'Uzbekistán',       away: 'Colombia',              group: 'K', date: '2026-06-17' },
  { id: 'K3', home: 'Portugal',         away: 'Uzbekistán',            group: 'K', date: '2026-06-23' },
  { id: 'K4', home: 'Colombia',         away: 'RD Congo',              group: 'K', date: '2026-06-23' },
  { id: 'K5', home: 'Colombia',         away: 'Portugal',              group: 'K', date: '2026-06-27' },
  { id: 'K6', home: 'RD Congo',         away: 'Uzbekistán',            group: 'K', date: '2026-06-27' },
  // GRUPO L
  { id: 'L1', home: 'Inglaterra',       away: 'Croacia',               group: 'L', date: '2026-06-17' },
  { id: 'L2', home: 'Ghana',            away: 'Panamá',                group: 'L', date: '2026-06-17' },
  { id: 'L3', home: 'Inglaterra',       away: 'Ghana',                 group: 'L', date: '2026-06-23' },
  { id: 'L4', home: 'Panamá',           away: 'Croacia',               group: 'L', date: '2026-06-23' },
  { id: 'L5', home: 'Panamá',           away: 'Inglaterra',            group: 'L', date: '2026-06-27' },
  { id: 'L6', home: 'Croacia',          away: 'Ghana',                 group: 'L', date: '2026-06-27' },
]

// ─── Nombre en inglés para que Perplexity lo entienda mejor ──────────────────
const NAME_EN = {
  'México': 'Mexico', 'Sudáfrica': 'South Africa', 'Corea del Sur': 'South Korea',
  'Chequia': 'Czech Republic', 'Canadá': 'Canada', 'Bosnia y Herzegovina': 'Bosnia and Herzegovina',
  'Catar': 'Qatar', 'Suiza': 'Switzerland', 'Brasil': 'Brazil', 'Marruecos': 'Morocco',
  'Escocia': 'Scotland', 'Haití': 'Haiti', 'Estados Unidos': 'USA', 'Turquía': 'Turkey',
  'Alemania': 'Germany', 'Curazao': 'Curaçao', 'Costa de Marfil': "Ivory Coast",
  'Ecuador': 'Ecuador', 'Países Bajos': 'Netherlands', 'Japón': 'Japan',
  'Suecia': 'Sweden', 'Túnez': 'Tunisia', 'Bélgica': 'Belgium', 'Egipto': 'Egypt',
  'Irán': 'Iran', 'Nueva Zelanda': 'New Zealand', 'España': 'Spain',
  'Cabo Verde': 'Cape Verde', 'Arabia Saudita': 'Saudi Arabia', 'Uruguay': 'Uruguay',
  'Francia': 'France', 'Senegal': 'Senegal', 'Irak': 'Iraq', 'Noruega': 'Norway',
  'Argentina': 'Argentina', 'Argelia': 'Algeria', 'Austria': 'Austria',
  'Jordania': 'Jordan', 'Portugal': 'Portugal', 'RD Congo': 'DR Congo',
  'Uzbekistán': 'Uzbekistan', 'Colombia': 'Colombia', 'Inglaterra': 'England',
  'Croacia': 'Croatia', 'Ghana': 'Ghana', 'Panamá': 'Panama',
  'Paraguay': 'Paraguay', 'Australia': 'Australia',
}

function en(name) { return NAME_EN[name] ?? name }

function buildPrompt(match) {
  const home = en(match.home)
  const away = en(match.away)
  return `FIFA World Cup 2026 Group ${match.group} match: ${home} vs ${away} on ${match.date}.

Provide win/draw/loss probabilities as three numbers that add up to 100. Consider: current FIFA rankings, recent form (last 10 official matches), head-to-head history, squad quality, and this is a neutral venue.

Respond ONLY with a JSON object, no markdown, no explanation:
{"pHome": <number 0-100>, "pDraw": <number 0-100>, "pAway": <number 0-100>, "expectedGoalsHome": <number>, "expectedGoalsAway": <number>, "pOver25": <number 0-100>, "reasoning": "<one sentence>"}`
}

async function queryPerplexity(prompt) {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.1,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Perplexity API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content.trim()
}

function parseResponse(raw, matchId) {
  // Extraer JSON aunque venga con markdown o texto extra
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No se encontró JSON en respuesta para ${matchId}: ${raw}`)

  const parsed = JSON.parse(jsonMatch[0])
  const { pHome, pDraw, pAway, expectedGoalsHome, expectedGoalsAway, pOver25, reasoning } = parsed

  // Normalizar a decimales (0-1) y asegurar que suman 1
  const total = pHome + pDraw + pAway
  return {
    pHome: +(pHome / total).toFixed(4),
    pDraw: +(pDraw / total).toFixed(4),
    pAway: +((total - pHome - pDraw) / total).toFixed(4),
    expectedGoalsHome: +(expectedGoalsHome ?? 1.5).toFixed(2),
    expectedGoalsAway: +(expectedGoalsAway ?? 1.2).toFixed(2),
    pOver25: +((pOver25 ?? 50) / 100).toFixed(4),
    reasoning: reasoning ?? '',
    source: 'perplexity-sonar',
    fetchedAt: new Date().toISOString(),
  }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Main ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const filterMatch = args.find(a => a.startsWith('--match='))?.split('=')[1]
const filterGroup = args.find(a => a.startsWith('--group='))?.split('=')[1]

let existing = {}
if (fs.existsSync(OUTPUT_FILE)) {
  existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'))
}

const toProcess = MATCHES.filter(m => {
  if (filterMatch) return m.id === filterMatch.toUpperCase()
  if (filterGroup) return m.group === filterGroup.toUpperCase()
  return true
})

console.log(`\n🔍  Consultando Perplexity para ${toProcess.length} partidos...\n`)

let ok = 0, fail = 0
for (const match of toProcess) {
  const label = `${match.id}: ${match.home} vs ${match.away}`
  process.stdout.write(`  ${label}... `)

  try {
    const raw = await queryPerplexity(buildPrompt(match))
    const result = parseResponse(raw, match.id)
    existing[match.id] = result
    console.log(`✅  ${Math.round(result.pHome*100)}% / ${Math.round(result.pDraw*100)}% / ${Math.round(result.pAway*100)}%`)
    ok++

    // Guardar después de cada éxito para no perder progreso
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existing, null, 2))
  } catch (e) {
    console.log(`❌  ${e.message}`)
    fail++
  }

  // Respetar rate limit: ~1 req/s
  if (toProcess.indexOf(match) < toProcess.length - 1) await sleep(1200)
}

console.log(`\n✅  ${ok} OK  |  ❌  ${fail} fallidos`)
console.log(`📁  Guardado en: ${OUTPUT_FILE}\n`)
