import type { TeamData } from './worldcupData'
import { getPrediction } from './perplexityPredictions'

export interface MatchProbabilities {
  pHome: number
  pDraw: number
  pAway: number
  lambdaHome: number
  lambdaAway: number
  expectedTotal: number
  pOver25: number
  pUnder25: number
  pBothScore: number
  pNoBothScore: number
  favorito: 'home' | 'draw' | 'away'
  favoritoName: string
  favoritoPct: number
}

function poissonProb(k: number, lambda: number): number {
  let result = Math.exp(-lambda)
  for (let i = 0; i < k; i++) result *= lambda / (i + 1)
  return result
}

function pAtLeastOne(lambda: number): number {
  return 1 - Math.exp(-lambda)
}

function pOverGoals(lambda: number, threshold: number): number {
  let cdf = 0
  for (let k = 0; k <= Math.floor(threshold); k++) {
    cdf += poissonProb(k, lambda)
  }
  return 1 - cdf
}

export function calculateProbabilities(home: TeamData, away: TeamData): MatchProbabilities {
  const homeGoalsAvg = home.goalsFor / 10
  const homeConcedeAvg = home.goalsAgainst / 10
  const awayGoalsAvg = away.goalsFor / 10
  const awayConcedeAvg = away.goalsAgainst / 10

  // Neutral venue — small scheduling advantage for "home" team
  const homeAdv = 1.04

  // Expected goals: blend of each team's attack vs opponent defense
  const lambdaHome = ((homeGoalsAvg + awayConcedeAvg) / 2) * homeAdv
  const lambdaAway = (awayGoalsAvg + homeConcedeAvg) / 2

  // Strength score: wins + goal diff contribution
  const homeStr = (home.wins / 10) * 0.6 + ((home.goalsFor - home.goalsAgainst) / 20) * 0.4
  const awayStr = (away.wins / 10) * 0.6 + ((away.goalsFor - away.goalsAgainst) / 20) * 0.4

  const totalStr = (homeStr * homeAdv) + awayStr
  const pHomeRaw = totalStr > 0 ? (homeStr * homeAdv) / totalStr : 0.5

  // Draw probability: higher when matchup is close
  const closeness = 1 - Math.abs(pHomeRaw - 0.5) * 2
  const pDraw = Math.min(0.30, Math.max(0.18, 0.20 + closeness * 0.10))

  const pHome = pHomeRaw * (1 - pDraw)
  const pAway = (1 - pHomeRaw) * (1 - pDraw)

  const expectedTotal = lambdaHome + lambdaAway
  const pOver25 = pOverGoals(expectedTotal, 2)
  const pUnder25 = 1 - pOver25

  const pHomeScoress = pAtLeastOne(lambdaHome)
  const pAwayScoress = pAtLeastOne(lambdaAway)
  const pBothScore = pHomeScoress * pAwayScoress
  const pNoBothScore = 1 - pBothScore

  let favorito: 'home' | 'draw' | 'away'
  let favoritoName: string
  let favoritoPct: number

  if (pHome >= pDraw && pHome >= pAway) {
    favorito = 'home'
    favoritoName = home.name
    favoritoPct = pHome
  } else if (pAway >= pDraw && pAway >= pHome) {
    favorito = 'away'
    favoritoName = away.name
    favoritoPct = pAway
  } else {
    favorito = 'draw'
    favoritoName = 'Empate'
    favoritoPct = pDraw
  }

  return {
    pHome,
    pDraw,
    pAway,
    lambdaHome,
    lambdaAway,
    expectedTotal,
    pOver25,
    pUnder25,
    pBothScore,
    pNoBothScore,
    favorito,
    favoritoName,
    favoritoPct,
  }
}

/**
 * Devuelve probabilidades usando Perplexity si existe la predicción para ese matchId,
 * y cae al cálculo matemático si no.
 */
export function calculateProbabilitiesForMatch(
  matchId: string,
  home: TeamData,
  away: TeamData,
): MatchProbabilities {
  const perplexity = getPrediction(matchId)

  if (perplexity) {
    const { pHome, pDraw, pAway, expectedGoalsHome, expectedGoalsAway, pOver25 } = perplexity
    const lambdaHome = expectedGoalsHome
    const lambdaAway = expectedGoalsAway
    const expectedTotal = lambdaHome + lambdaAway
    const pHomeScoress = pAtLeastOne(lambdaHome)
    const pAwayScoress = pAtLeastOne(lambdaAway)
    const pBothScore = pHomeScoress * pAwayScoress

    let favorito: 'home' | 'draw' | 'away'
    let favoritoName: string
    let favoritoPct: number

    if (pHome >= pDraw && pHome >= pAway) {
      favorito = 'home'; favoritoName = home.name; favoritoPct = pHome
    } else if (pAway >= pDraw && pAway >= pHome) {
      favorito = 'away'; favoritoName = away.name; favoritoPct = pAway
    } else {
      favorito = 'draw'; favoritoName = 'Empate'; favoritoPct = pDraw
    }

    return {
      pHome, pDraw, pAway,
      lambdaHome, lambdaAway, expectedTotal,
      pOver25, pUnder25: 1 - pOver25,
      pBothScore, pNoBothScore: 1 - pBothScore,
      favorito, favoritoName, favoritoPct,
    }
  }

  return calculateProbabilities(home, away)
}

export function pct(val: number): string {
  return (val * 100).toFixed(0) + '%'
}

export function pctNum(val: number): number {
  return Math.round(val * 100)
}
