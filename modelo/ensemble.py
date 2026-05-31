"""Ensemble predictor: combina Poisson bivariado + ELO + BSD predictions."""

import sys
from pathlib import Path
from typing import Optional

import pandas as pd

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from features.elo import ELOSystem
from modelo.poisson import BivariatePoisson

_PROC = _PROJECT_ROOT / "data" / "processed"

# Todos los equipos WC 2026 para seed ELO completo
_ALL_WC_TEAMS = [
    "USA", "Panama", "Ecuador", "Morocco",
    "Mexico", "Honduras", "Bolivia", "South Korea",
    "Argentina", "Canada", "Jamaica", "Ivory Coast",
    "Spain", "Croatia", "Serbia", "Japan",
    "Germany", "Colombia", "Nigeria", "Saudi Arabia",
    "Brazil", "Chile", "New Zealand", "Peru",
    "France", "Belgium", "Italy", "Algeria",
    "Portugal", "Poland", "Denmark", "Turkey",
    "Netherlands", "Uruguay", "Iran", "Senegal",
    "England", "Czech Republic", "Hungary", "Cameroon",
    "Austria", "Romania", "Scotland", "Qatar",
    "Switzerland", "Sweden", "Ukraine", "Ghana",
]


class EnsemblePredictor:
    """Combina tres fuentes de predicción con pesos configurables."""

    def __init__(
        self,
        teams_stats_df: pd.DataFrame,
        elo_ratings_df: pd.DataFrame,
        bsd_predictions_df: pd.DataFrame,
        weights: Optional[dict] = None,
    ) -> None:
        if weights is None:
            weights = {"poisson": 0.45, "elo": 0.30, "bsd": 0.25}

        total = sum(weights.values())
        if abs(total - 1.0) > 1e-6:
            raise ValueError(f"Los pesos deben sumar 1.0, suma actual: {total:.6f}")

        self.weights = weights
        self.bsd_df = bsd_predictions_df.copy() if bsd_predictions_df is not None else None

        # Modelo Poisson
        self.poisson = BivariatePoisson(teams_stats_df)

        # Sistema ELO: seed con todos los 48 equipos, luego sobreescribir con CSV
        self.elo = ELOSystem(k=40, base_elo=1500)
        self.elo.seed_from_fifa_ranking(_ALL_WC_TEAMS)
        if elo_ratings_df is not None and len(elo_ratings_df) > 0:
            csv_ratings = dict(zip(elo_ratings_df["team"], elo_ratings_df["elo_rating"]))
            self.elo.ratings.update(csv_ratings)

    # ── BSD ──────────────────────────────────────────────────────────────────

    def get_bsd_prediction(
        self,
        event_id: Optional[int] = None,
        home_team: Optional[str] = None,
        away_team: Optional[str] = None,
    ) -> Optional[dict]:
        if self.bsd_df is None or len(self.bsd_df) == 0:
            return None

        row = None

        if event_id is not None and "event_id" in self.bsd_df.columns:
            matches = self.bsd_df[self.bsd_df["event_id"] == event_id]
            if len(matches) > 0:
                row = matches.iloc[0]

        if row is None and home_team is not None and away_team is not None:
            h_low = home_team.strip().lower()
            a_low = away_team.strip().lower()
            for col in ("home_team", "home"):
                if col in self.bsd_df.columns:
                    mask = (
                        self.bsd_df[col].str.strip().str.lower() == h_low
                    )
                    away_col = "away_team" if "away_team" in self.bsd_df.columns else "away"
                    if away_col in self.bsd_df.columns:
                        mask &= self.bsd_df[away_col].str.strip().str.lower() == a_low
                    matches = self.bsd_df[mask]
                    if len(matches) > 0:
                        row = matches.iloc[0]
                        break

        if row is None:
            return None

        p_home = float(row["bsd_prob_home"]) / 100.0
        p_draw = float(row["bsd_prob_draw"]) / 100.0
        p_away = float(row["bsd_prob_away"]) / 100.0

        return {
            "prob_home": round(p_home, 4),
            "prob_draw": round(p_draw, 4),
            "prob_away": round(p_away, 4),
            "xg_home": float(row.get("bsd_xg_home", 1.5)),
            "xg_away": float(row.get("bsd_xg_away", 1.5)),
        }

    # ── ELO ──────────────────────────────────────────────────────────────────

    def get_elo_prediction(self, home_team: str, away_team: str) -> dict:
        res = self.elo.win_probability(home_team, away_team)
        return {
            "prob_home": res["prob_a"],
            "prob_draw": res["prob_draw"],
            "prob_away": res["prob_b"],
            "elo_home": res["elo_a"],
            "elo_away": res["elo_b"],
            "elo_diff": res["elo_diff"],
        }

    # ── Predicción ensemble ───────────────────────────────────────────────────

    def predict(
        self,
        home_team: str,
        away_team: str,
        event_id: Optional[int] = None,
    ) -> dict:
        poisson_res = self.poisson.predict_match(home_team, away_team)
        elo_res = self.get_elo_prediction(home_team, away_team)
        bsd_res = self.get_bsd_prediction(
            event_id=event_id, home_team=home_team, away_team=away_team
        )

        sources_available = ["poisson", "elo"]

        if bsd_res is not None:
            sources_available.append("bsd")
            w_p = self.weights["poisson"]
            w_e = self.weights["elo"]
            w_b = self.weights["bsd"]
        else:
            w_b_orig = self.weights["bsd"]
            w_p = self.weights["poisson"] + w_b_orig * 0.6
            w_e = self.weights["elo"] + w_b_orig * 0.4
            w_b = 0.0

        weights_used = {
            "poisson": round(w_p, 4),
            "elo": round(w_e, 4),
            "bsd": round(w_b, 4),
        }

        if bsd_res is not None:
            ph = poisson_res["prob_home_win"] * w_p + elo_res["prob_home"] * w_e + bsd_res["prob_home"] * w_b
            pd_ = poisson_res["prob_draw"] * w_p + elo_res["prob_draw"] * w_e + bsd_res["prob_draw"] * w_b
            pa = poisson_res["prob_away_win"] * w_p + elo_res["prob_away"] * w_e + bsd_res["prob_away"] * w_b
        else:
            ph = poisson_res["prob_home_win"] * w_p + elo_res["prob_home"] * w_e
            pd_ = poisson_res["prob_draw"] * w_p + elo_res["prob_draw"] * w_e
            pa = poisson_res["prob_away_win"] * w_p + elo_res["prob_away"] * w_e

        total = ph + pd_ + pa
        if total > 0:
            ph /= total
            pd_ /= total
            pa /= total

        probs = {"home": ph, "draw": pd_, "away": pa}
        predicted_winner = max(probs, key=probs.get)
        confidence = max(ph, pd_, pa)

        return {
            "home_team": home_team,
            "away_team": away_team,
            "prob_home": round(ph, 4),
            "prob_draw": round(pd_, 4),
            "prob_away": round(pa, 4),
            "predicted_winner": predicted_winner,
            "confidence": round(confidence, 4),
            "poisson": {
                "prob_home": poisson_res["prob_home_win"],
                "prob_draw": poisson_res["prob_draw"],
                "prob_away": poisson_res["prob_away_win"],
                "lambda_home": poisson_res["lambda_home"],
                "lambda_away": poisson_res["lambda_away"],
                "most_likely_score": poisson_res["most_likely_score"],
                "most_likely_score_prob": poisson_res["most_likely_score_prob"],
                "top_5_scores": poisson_res["top_5_scores"],
            },
            "elo": {
                "prob_home": elo_res["prob_home"],
                "prob_draw": elo_res["prob_draw"],
                "prob_away": elo_res["prob_away"],
                "elo_home": elo_res["elo_home"],
                "elo_away": elo_res["elo_away"],
                "elo_diff": elo_res["elo_diff"],
            },
            "bsd": bsd_res,
            "weights_used": weights_used,
            "sources_available": sources_available,
        }

    # ── Todos los fixtures ────────────────────────────────────────────────────

    def predict_all_fixtures(self, features_master_df: pd.DataFrame) -> pd.DataFrame:
        rows = []
        for _, fix in features_master_df.iterrows():
            event_id = int(fix["event_id"])
            home = str(fix["home_team"])
            away = str(fix["away_team"])
            date = str(fix.get("event_date", ""))

            res = self.predict(home, away, event_id=event_id)
            elo = res["elo"]
            po = res["poisson"]
            bsd = res["bsd"] or {}

            rows.append({
                "event_id": event_id,
                "home_team": home,
                "away_team": away,
                "event_date": date,
                "prob_home": round(res["prob_home"], 4),
                "prob_draw": round(res["prob_draw"], 4),
                "prob_away": round(res["prob_away"], 4),
                "predicted_winner": res["predicted_winner"],
                "confidence": round(res["confidence"], 4),
                "poisson_lambda_home": round(po["lambda_home"], 4),
                "poisson_lambda_away": round(po["lambda_away"], 4),
                "poisson_most_likely_score": po["most_likely_score"],
                "elo_home": elo["elo_home"],
                "elo_away": elo["elo_away"],
                "elo_diff": elo["elo_diff"],
                "bsd_prob_home": round(bsd["prob_home"], 4) if bsd else None,
                "bsd_prob_draw": round(bsd["prob_draw"], 4) if bsd else None,
                "bsd_prob_away": round(bsd["prob_away"], 4) if bsd else None,
            })

        df = pd.DataFrame(rows)
        out = _PROC / "predictions_all.csv"
        df.to_csv(out, index=False)
        print(f"✓ predictions_all.csv → {len(df)} partidos  ({out})")
        return df
