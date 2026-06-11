export interface PerplexityPrediction {
  pHome: number
  pDraw: number
  pAway: number
  expectedGoalsHome: number
  expectedGoalsAway: number
  pOver25: number
  reasoning: string
  source: string
  fetchedAt: string
}

type PredictionsMap = Record<string, PerplexityPrediction>

let cache: PredictionsMap | null = null

export function getPredictions(): PredictionsMap {
  if (cache) return cache
  try {
    // Next.js bundlea el JSON en build time desde la ruta relativa al proyecto
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cache = require('../../data/wc2026/predictions/predictions.json') as PredictionsMap
  } catch {
    cache = {}
  }
  return cache
}

export function getPrediction(matchId: string): PerplexityPrediction | null {
  const predictions = getPredictions()
  return predictions[matchId] ?? null
}
