"""Calcula features de forma reciente y fuerzas relativas por partido."""

from typing import Optional

import pandas as pd

from features.elo import ELOSystem
from features.team_stats import TeamStatsEnricher


class FormCalculator:
    """Genera features de forma, ELO y lambdas para cada partido."""

    def __init__(
        self,
        fixtures_df: pd.DataFrame,
        teams_stats_df: pd.DataFrame,
        predictions_df: pd.DataFrame,
        elo_system: ELOSystem,
        enricher: Optional[TeamStatsEnricher] = None,
    ) -> None:
        self.fixtures   = fixtures_df
        self.teams      = teams_stats_df
        self.preds      = predictions_df
        self.elo        = elo_system
        self.enricher   = enricher

    # ── Form string ─────────────────────────────────────────────────────────

    def parse_form_string(self, form_str) -> dict:
        """Parsea 'WWDLW' → stats de forma reciente."""
        if not isinstance(form_str, str) or not form_str.strip():
            return {
                "recent_wins":   0,
                "recent_draws":  0,
                "recent_losses": 0,
                "recent_points": 0,
                "form_score":    0.5,
            }
        clean = form_str.upper().strip()
        wins   = clean.count("W")
        draws  = clean.count("D")
        losses = clean.count("L")
        points = wins * 3 + draws * 1
        max_points = len(clean) * 3
        form_score = round(points / max_points, 4) if max_points > 0 else 0.5
        return {
            "recent_wins":   wins,
            "recent_draws":  draws,
            "recent_losses": losses,
            "recent_points": points,
            "form_score":    form_score,
        }

    # ── Features por equipo ─────────────────────────────────────────────────

    def get_team_form_features(self, team: str) -> dict:
        """Retorna features de forma para un equipo desde teams_stats."""
        row = self.teams[self.teams["team_name"] == team]
        if row.empty:
            return {
                "win_rate":           0.33,
                "goals_scored_avg":   1.0,
                "goals_conceded_avg": 1.3,
                "clean_sheets_ratio": 0.0,
                "form_score":         0.5,
                "recent_points":      0,
            }
        r = row.iloc[0]
        form_parsed = self.parse_form_string(r.get("last_5_form", ""))

        gp = r.get("games_played", 1)
        cs = r.get("clean_sheets", 0)
        cs_ratio = round(cs / gp, 4) if gp > 0 else 0.0

        return {
            "win_rate":           float(r.get("win_rate", 0.33)),
            "goals_scored_avg":   float(r.get("goals_scored_avg", 1.0)),
            "goals_conceded_avg": float(r.get("goals_conceded_avg", 1.3)),
            "clean_sheets_ratio": cs_ratio,
            "form_score":         form_parsed["form_score"],
            "recent_points":      form_parsed["recent_points"],
        }

    # ── Build features ───────────────────────────────────────────────────────

    def build_form_features(self) -> pd.DataFrame:
        """Genera el DataFrame de features por partido."""
        rows = []

        for _, fix in self.fixtures.iterrows():
            event_id  = fix["event_id"]
            home_team = fix["home_team"]
            away_team = fix["away_team"]

            # ELO
            elo_info = self.elo.win_probability(home_team, away_team)

            # Forma
            home_f = self.get_team_form_features(home_team)
            away_f = self.get_team_form_features(away_team)

            # Lambdas
            if self.enricher is not None:
                lambdas = self.enricher.get_lambda_estimates(home_team, away_team)
            else:
                lambdas = {"lambda_home": 1.3, "lambda_away": 1.1}

            row = {
                "event_id":       event_id,
                # ELO
                "home_elo":       elo_info["elo_a"],
                "away_elo":       elo_info["elo_b"],
                "elo_diff":       elo_info["elo_diff"],
                "elo_prob_home":  elo_info["prob_a"],
                "elo_prob_draw":  elo_info["prob_draw"],
                "elo_prob_away":  elo_info["prob_b"],
                # Forma local
                "home_win_rate":        home_f["win_rate"],
                "home_goals_avg":       home_f["goals_scored_avg"],
                "home_conceded_avg":    home_f["goals_conceded_avg"],
                "home_clean_sheet_ratio": home_f["clean_sheets_ratio"],
                "home_form_score":      home_f["form_score"],
                # Forma visitante
                "away_win_rate":        away_f["win_rate"],
                "away_goals_avg":       away_f["goals_scored_avg"],
                "away_conceded_avg":    away_f["goals_conceded_avg"],
                "away_clean_sheet_ratio": away_f["clean_sheets_ratio"],
                "away_form_score":      away_f["form_score"],
                # Comparativas
                "goals_avg_diff": round(home_f["goals_scored_avg"] - away_f["goals_scored_avg"], 4),
                "form_diff":      round(home_f["form_score"]       - away_f["form_score"],       4),
                "win_rate_diff":  round(home_f["win_rate"]         - away_f["win_rate"],         4),
                # Poisson lambdas
                "lambda_home": lambdas["lambda_home"],
                "lambda_away": lambdas["lambda_away"],
            }
            rows.append(row)

        return pd.DataFrame(rows)
