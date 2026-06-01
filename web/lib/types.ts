export interface Match {
  event_id: number
  home_team: string
  away_team: string
  home_team_id: number
  away_team_id: number
  event_date: string
  status: string
  stage: string
  group: string
  venue: string
  odds_home: number
  odds_draw: number
  odds_away: number
  implied_prob_home: number
  implied_prob_draw: number
  implied_prob_away: number
  margin: number
}

export interface Prediction {
  event_id: number
  prob_home: number
  prob_draw: number
  prob_away: number
  predicted_winner: string
  confidence: number
  poisson_lambda_home: number
  poisson_lambda_away: number
  poisson_most_likely_score: string
  elo_home: number
  elo_away: number
  elo_diff: number
  elo_prob_home: number
  elo_prob_draw: number
  elo_prob_away: number
  bsd_prob_home: number | null
  bsd_prob_draw: number | null
  bsd_prob_away: number | null
  bsd_xg_home: number | null
  bsd_xg_away: number | null
  matches: Match
}

export interface ValueBet {
  id: number
  event_id: number
  match_label: string
  event_date: string
  best_bet: string
  best_ev: number
  best_kelly: number
  odd_best: number
  prob_modelo_best: number
  implied_prob_best: number
  edge_best: number
  predicted_winner: string
  confidence: number
}

export interface TeamStats {
  team_id: number
  team_name: string
  games_played: number
  goals_scored: number
  goals_conceded: number
  goals_scored_avg: number
  goals_conceded_avg: number
  wins: number
  draws: number
  losses: number
  win_rate: number
  clean_sheets: number
  last_5_form: string
  elo_rating: number
}

export interface FullAnalysis {
  id: number
  event_id: number
  match_label: string
  event_date: string
  market: string
  prob_modelo: number
  implied_prob: number
  edge: number
  ev: number
  kelly_pct: number
  is_value: boolean
  odd_bookmaker: number
}
