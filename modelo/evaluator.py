"""Métricas del modelo y herramientas de backtesting."""

import sys
from pathlib import Path
from typing import List

import numpy as np
import pandas as pd
from sklearn.metrics import log_loss

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))


class ModelEvaluator:
    """Evalúa predicciones del ensemble contra resultados reales y cuotas."""

    def __init__(
        self,
        predictions_df: pd.DataFrame,
        odds_df: pd.DataFrame,
    ) -> None:
        self.predictions = predictions_df.copy()
        self.odds = odds_df.copy()

    # ── Brier Score ───────────────────────────────────────────────────────────

    def calculate_brier_score(
        self, y_true: List[List[float]], y_pred: List[List[float]]
    ) -> float:
        """Brier Score multiclase. < 0.25 es bueno para fútbol."""
        y_true_arr = np.array(y_true, dtype=float)
        y_pred_arr = np.array(y_pred, dtype=float)
        return float(np.mean((y_pred_arr - y_true_arr) ** 2))

    # ── Log Loss ─────────────────────────────────────────────────────────────

    def calculate_log_loss(
        self, y_true: List[List[float]], y_pred: List[List[float]]
    ) -> float:
        """Log loss multiclase estándar."""
        return float(log_loss(y_true, y_pred))

    # ── Comparación vs bookmaker ──────────────────────────────────────────────

    def compare_vs_bookmaker(
        self,
        predictions_df: pd.DataFrame,
        odds_df: pd.DataFrame,
    ) -> pd.DataFrame:
        merged = predictions_df.merge(odds_df, on="event_id", how="inner")
        if len(merged) == 0:
            return pd.DataFrame()

        rows = []
        for _, row in merged.iterrows():
            ph_ens = float(row["prob_home"])
            pd_ens = float(row["prob_draw"])
            pa_ens = float(row["prob_away"])

            ph_imp = float(row.get("implied_prob_home", 0))
            pd_imp = float(row.get("implied_prob_draw", 0))
            pa_imp = float(row.get("implied_prob_away", 0))

            edge_h = round(ph_ens - ph_imp, 4)
            edge_d = round(pd_ens - pd_imp, 4)
            edge_a = round(pa_ens - pa_imp, 4)

            abs_edges = {"home": abs(edge_h), "draw": abs(edge_d), "away": abs(edge_a)}
            max_edge_market = max(abs_edges, key=abs_edges.get)

            rows.append({
                "event_id": row["event_id"],
                "match_label": str(row.get("home_team", "")) + " vs " + str(row.get("away_team", "")),
                "ensemble_prob_home": ph_ens,
                "implied_prob_home": ph_imp,
                "edge_home": edge_h,
                "ensemble_prob_draw": pd_ens,
                "implied_prob_draw": pd_imp,
                "edge_draw": edge_d,
                "ensemble_prob_away": pa_ens,
                "implied_prob_away": pa_imp,
                "edge_away": edge_a,
                "max_edge": round(max(abs_edges.values()), 4),
                "max_edge_market": max_edge_market,
            })

        return pd.DataFrame(rows)

    # ── Calibración ───────────────────────────────────────────────────────────

    def calibration_summary(self) -> dict:
        """Agrupa por rangos de confianza y reporta estadísticas."""
        if "confidence" not in self.predictions.columns:
            return {}

        bins = [(0.0, 0.4), (0.4, 0.6), (0.6, 0.8), (0.8, 1.0)]
        summary = {}

        for lo, hi in bins:
            label = f"{lo:.1f}-{hi:.1f}"
            mask = (self.predictions["confidence"] >= lo) & (
                self.predictions["confidence"] < hi
            )
            subset = self.predictions[mask]
            summary[label] = {
                "count": int(len(subset)),
                "avg_confidence": (
                    round(float(subset["confidence"].mean()), 4)
                    if len(subset) > 0
                    else None
                ),
            }

        return summary
