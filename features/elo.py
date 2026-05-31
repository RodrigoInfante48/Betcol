"""Sistema ELO adaptado a selecciones nacionales para el Mundial 2026."""

from pathlib import Path
from typing import Dict, List

import pandas as pd

_K = 40
_BASE_ELO = 1500

# Tiers FIFA aproximados – nombres deben coincidir con fixtures.csv
_TIER_S  = ["France", "Brazil", "England", "Spain", "Argentina", "Portugal"]
_TIER_A  = [
    "Germany", "Netherlands", "Belgium", "Italy", "Croatia", "Uruguay",
    "Colombia", "Mexico", "USA", "Denmark", "Switzerland", "Austria",
    "Morocco", "Senegal",
]
_TIER_B  = [
    "Poland", "Serbia", "Japan", "South Korea", "Ecuador", "Peru",
    "Chile", "Algeria", "Nigeria", "Cameroon", "Saudi Arabia", "Iran",
    "Australia", "Czech Republic", "Hungary", "Scotland", "Turkey", "Romania",
]
# Todos los demás equipos del torneo caen en Tier C (1550–1699)


def _seed_tier(teams: List[str], lo: float, hi: float) -> Dict[str, float]:
    """Distribuye ELO uniformemente en el rango [lo, hi] para la lista de equipos."""
    n = len(teams)
    if n == 0:
        return {}
    if n == 1:
        return {teams[0]: (lo + hi) / 2}
    step = (hi - lo) / (n - 1)
    return {t: round(hi - i * step, 1) for i, t in enumerate(teams)}


class ELOSystem:
    """Sistema ELO para selecciones nacionales."""

    def __init__(self, k: float = _K, base_elo: float = _BASE_ELO,
                 neutral_venue: bool = True) -> None:
        self.k = k
        self.base_elo = base_elo
        self.neutral_venue = neutral_venue
        self.ratings: Dict[str, float] = {}

    # ── Inicialización ───────────────────────────────────────────────────────

    def seed_from_fifa_ranking(self, teams: List[str]) -> None:
        """Asigna ELO inicial basado en tier FIFA aproximado."""
        seeds: Dict[str, float] = {}
        seeds.update(_seed_tier(_TIER_S, 2050, 2150))
        seeds.update(_seed_tier(_TIER_A, 1850, 1999))
        seeds.update(_seed_tier(_TIER_B, 1700, 1849))

        for team in teams:
            if team in seeds:
                self.ratings[team] = seeds[team]
            elif team not in seeds:
                # Tier C: distribuir entre 1550-1699
                self.ratings[team] = self.ratings.get(team, self.base_elo)

        # Segundo paso: equipos Tier C que están en la lista de teams
        tier_c_candidates = [t for t in teams if t not in seeds]
        tier_c_seeds = _seed_tier(tier_c_candidates, 1550, 1699)
        for team, elo in tier_c_seeds.items():
            self.ratings[team] = elo

    # ── Cálculo ──────────────────────────────────────────────────────────────

    def get_rating(self, team: str) -> float:
        return self.ratings.get(team, self.base_elo)

    def expected_score(self, rating_a: float, rating_b: float) -> float:
        return 1.0 / (1.0 + 10 ** ((rating_b - rating_a) / 400.0))

    def win_probability(self, team_a: str, team_b: str) -> dict:
        elo_a = self.get_rating(team_a)
        elo_b = self.get_rating(team_b)
        prob_a_raw = self.expected_score(elo_a, elo_b)

        draw_prob = 0.25 - 0.18 * abs(prob_a_raw - 0.5)
        draw_prob = max(0.05, draw_prob)

        prob_win_a = prob_a_raw * (1 - draw_prob)
        prob_win_b = (1 - prob_a_raw) * (1 - draw_prob)

        total = prob_win_a + draw_prob + prob_win_b
        prob_a    = prob_win_a / total
        prob_draw = draw_prob  / total
        prob_b    = prob_win_b / total

        return {
            "prob_a":    round(prob_a,    4),
            "prob_draw": round(prob_draw, 4),
            "prob_b":    round(prob_b,    4),
            "elo_a":     elo_a,
            "elo_b":     elo_b,
            "elo_diff":  round(elo_a - elo_b, 1),
        }

    # ── Actualización ────────────────────────────────────────────────────────

    def update_rating(self, winner: str, loser: str, is_draw: bool = False) -> None:
        ra = self.get_rating(winner)
        rb = self.get_rating(loser)
        expected_a = self.expected_score(ra, rb)
        score_actual = 0.5 if is_draw else 1.0
        delta = self.k * (score_actual - expected_a)

        self.ratings[winner] = ra + delta
        self.ratings[loser]  = rb - delta

    # ── Exportar ─────────────────────────────────────────────────────────────

    def get_all_ratings(self) -> pd.DataFrame:
        df = pd.DataFrame(
            [{"team": t, "elo_rating": r} for t, r in self.ratings.items()]
        ).sort_values("elo_rating", ascending=False).reset_index(drop=True)
        return df

    def save_ratings(self, filepath) -> None:
        self.get_all_ratings().to_csv(filepath, index=False)

    def load_ratings(self, filepath) -> None:
        df = pd.read_csv(filepath)
        self.ratings = dict(zip(df["team"], df["elo_rating"]))
