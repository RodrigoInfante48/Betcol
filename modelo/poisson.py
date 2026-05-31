"""Modelo Poisson bivariado para predicción de partidos de fútbol."""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import poisson

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))


class BivariatePoisson:
    """Modelo Poisson bivariado estándar para fútbol."""

    def __init__(self, teams_stats_df: pd.DataFrame) -> None:
        self.df = teams_stats_df.copy()
        self._lookup: dict = {}
        for _, row in self.df.iterrows():
            self._lookup[str(row["team_name"]).strip().lower()] = row

        self.avg_goals_scored = float(self.df["goals_scored_avg"].mean())
        self.avg_goals_conceded = float(self.df["goals_conceded_avg"].mean())

    # ── Helpers ──────────────────────────────────────────────────────────────

    def _find_team(self, team: str):
        return self._lookup.get(team.strip().lower())

    # ── Strengths ────────────────────────────────────────────────────────────

    def get_attack_strength(self, team: str) -> float:
        row = self._find_team(team)
        if row is None:
            return 1.0
        return float(row["goals_scored_avg"]) / self.avg_goals_scored

    def get_defense_strength(self, team: str) -> float:
        """Valor bajo = buena defensa (concede menos que la media)."""
        row = self._find_team(team)
        if row is None:
            return 1.0
        return float(row["goals_conceded_avg"]) / self.avg_goals_conceded

    # ── Lambda ───────────────────────────────────────────────────────────────

    def calculate_lambda(self, attack_team: str, defense_team: str) -> float:
        lam = (
            self.get_attack_strength(attack_team)
            * self.get_defense_strength(defense_team)
            * self.avg_goals_scored
        )
        return max(0.1, lam)

    # ── Probabilidad de marcador ──────────────────────────────────────────────

    def score_probability(
        self,
        lambda_home: float,
        lambda_away: float,
        goals_home: int,
        goals_away: int,
    ) -> float:
        return float(
            poisson.pmf(goals_home, lambda_home) * poisson.pmf(goals_away, lambda_away)
        )

    # ── Predicción completa ───────────────────────────────────────────────────

    def predict_match(
        self, home_team: str, away_team: str, max_goals: int = 8
    ) -> dict:
        lambda_home = self.calculate_lambda(home_team, away_team)
        lambda_away = self.calculate_lambda(away_team, home_team)

        # Matriz de probabilidades (max_goals+1) × (max_goals+1)
        goals = range(max_goals + 1)
        pmf_home = np.array([poisson.pmf(g, lambda_home) for g in goals])
        pmf_away = np.array([poisson.pmf(g, lambda_away) for g in goals])
        matrix = np.outer(pmf_home, pmf_away)  # matrix[i,j] = P(home=i, away=j)

        prob_home_win = float(np.tril(matrix, -1).sum())
        prob_draw = float(np.diag(matrix).sum())
        prob_away_win = float(np.triu(matrix, 1).sum())

        total = prob_home_win + prob_draw + prob_away_win
        if total > 0:
            prob_home_win /= total
            prob_draw /= total
            prob_away_win /= total

        # Marcador más probable
        flat_idx = int(np.argmax(matrix))
        row_idx, col_idx = divmod(flat_idx, max_goals + 1)
        most_likely_score = f"{row_idx}-{col_idx}"
        most_likely_score_prob = float(matrix[row_idx, col_idx])

        # Score matrix (solo probs > 0.01)
        score_matrix: dict = {}
        for i in goals:
            for j in goals:
                p = float(matrix[i, j])
                if p > 0.01:
                    score_matrix[f"{i}-{j}"] = round(p, 4)

        # Top 5 marcadores
        all_scores = [
            (f"{i}-{j}", float(matrix[i, j])) for i in goals for j in goals
        ]
        all_scores.sort(key=lambda x: x[1], reverse=True)
        top_5 = [{"score": s, "prob": round(p, 4)} for s, p in all_scores[:5]]

        return {
            "home_team": home_team,
            "away_team": away_team,
            "lambda_home": round(lambda_home, 4),
            "lambda_away": round(lambda_away, 4),
            "prob_home_win": round(prob_home_win, 4),
            "prob_draw": round(prob_draw, 4),
            "prob_away_win": round(prob_away_win, 4),
            "most_likely_score": most_likely_score,
            "most_likely_score_prob": round(most_likely_score_prob, 4),
            "score_matrix": score_matrix,
            "top_5_scores": top_5,
            "xg_home": round(lambda_home, 4),
            "xg_away": round(lambda_away, 4),
        }

    def get_score_matrix_df(
        self, home_team: str, away_team: str, max_goals: int = 6
    ) -> pd.DataFrame:
        """DataFrame con filas=goles_local, cols=goles_visitante."""
        lambda_home = self.calculate_lambda(home_team, away_team)
        lambda_away = self.calculate_lambda(away_team, home_team)

        goals = range(max_goals + 1)
        pmf_home = np.array([poisson.pmf(g, lambda_home) for g in goals])
        pmf_away = np.array([poisson.pmf(g, lambda_away) for g in goals])
        matrix = np.outer(pmf_home, pmf_away)

        df = pd.DataFrame(
            np.round(matrix, 4),
            index=list(goals),
            columns=list(goals),
        )
        df.index.name = "home_goals"
        df.columns.name = "away_goals"
        return df
