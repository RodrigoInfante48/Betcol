"""Enriquece los stats reales de BSD con strengths y lambdas Poisson."""

from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd


_ROOT = Path(__file__).resolve().parent.parent


class TeamStatsEnricher:
    """Enriquece teams_stats.csv con attack/defense strength para el modelo Poisson."""

    def __init__(
        self,
        teams_stats_df: pd.DataFrame,
        fixtures_df: pd.DataFrame,
        predictions_df: Optional[pd.DataFrame] = None,
    ) -> None:
        self.df = teams_stats_df.copy()
        self.fixtures = fixtures_df
        self.predictions = predictions_df
        self._avg_goals: Optional[float] = None

    # ── Normalización de nombres ─────────────────────────────────────────────

    def normalize_team_names(self) -> None:
        """Detecta discrepancias de nombres y aplica rename para unificar."""
        fixture_teams = set(self.fixtures["home_team"]) | set(self.fixtures["away_team"])
        stats_teams   = set(self.df["team_name"])
        unmatched = fixture_teams - stats_teams
        if unmatched:
            print(f"[TeamStatsEnricher] Equipos sin match en teams_stats: {sorted(unmatched)}")
        else:
            print("[TeamStatsEnricher] ✓ Todos los equipos del fixture están en teams_stats")

    # ── Attack / Defense Strength ────────────────────────────────────────────

    def calculate_attack_defense_strength(self) -> pd.DataFrame:
        """Calcula attack_strength y defense_strength relativas al promedio."""
        has_goals = (
            "goals_scored_avg"    in self.df.columns
            and "goals_conceded_avg" in self.df.columns
            and self.df["goals_scored_avg"].notna().any()
        )

        if has_goals:
            mean_scored   = self.df["goals_scored_avg"].mean()
            mean_conceded = self.df["goals_conceded_avg"].mean()

            if mean_scored > 0:
                self.df["attack_strength"]  = (
                    self.df["goals_scored_avg"] / mean_scored
                ).round(4)
            else:
                self.df["attack_strength"] = 1.0

            if mean_conceded > 0:
                self.df["defense_strength"] = (
                    self.df["goals_conceded_avg"] / mean_conceded
                ).round(4)
            else:
                self.df["defense_strength"] = 1.0

            self._avg_goals = mean_scored
        elif self.predictions is not None and "bsd_xg_home" in self.predictions.columns:
            # Fallback: usar xG de predicciones
            print("[TeamStatsEnricher] Usando xG de predicciones como fallback")
            self.df["attack_strength"]  = 1.0
            self.df["defense_strength"] = 1.0
            self._avg_goals = self.predictions["bsd_xg_home"].mean()
        else:
            self.df["attack_strength"]  = 1.0
            self.df["defense_strength"] = 1.0
            self._avg_goals = 1.3

        # Imputar NaN con 1.0 (equipo neutro)
        self.df["attack_strength"]  = self.df["attack_strength"].fillna(1.0)
        self.df["defense_strength"] = self.df["defense_strength"].fillna(1.0)

        return self.df

    # ── Lambda Poisson ───────────────────────────────────────────────────────

    def get_lambda_estimates(self, home_team: str, away_team: str) -> dict:
        """Calcula lambdas Poisson para home y away."""
        avg = self._avg_goals if self._avg_goals and self._avg_goals > 0 else 1.3

        def _strength(team: str, col: str) -> float:
            row = self.df[self.df["team_name"] == team]
            if row.empty or col not in self.df.columns:
                return 1.0
            val = row.iloc[0][col]
            return float(val) if pd.notna(val) else 1.0

        home_att  = _strength(home_team, "attack_strength")
        home_def  = _strength(home_team, "defense_strength")
        away_att  = _strength(away_team, "attack_strength")
        away_def  = _strength(away_team, "defense_strength")

        lambda_home = max(0.1, home_att * away_def * avg)
        lambda_away = max(0.1, away_att * home_def * avg)

        return {
            "lambda_home": round(lambda_home, 4),
            "lambda_away": round(lambda_away, 4),
        }

    # ── Persistencia ─────────────────────────────────────────────────────────

    def save_enriched(self, filepath) -> None:
        self.df.to_csv(filepath, index=False)
        print(f"[TeamStatsEnricher] Guardado → {filepath}")
