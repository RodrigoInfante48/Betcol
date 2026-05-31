"""Detector de value bets para Betcol — Sprint 4."""

import sys
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

import pandas as pd

_PROC = _PROJECT_ROOT / "data" / "processed"

_FEATURES_COLS = [
    "event_id",
    "odds_home", "odds_draw", "odds_away",
    "implied_prob_home", "implied_prob_draw", "implied_prob_away",
    "match_label",
]

_MARKETS = [
    ("home", "prob_home",  "odds_home",  "implied_prob_home"),
    ("draw", "prob_draw",  "odds_draw",  "implied_prob_draw"),
    ("away", "prob_away",  "odds_away",  "implied_prob_away"),
]


class ValueBetDetector:
    """Detecta oportunidades de value bet comparando modelo vs bookmaker."""

    def __init__(
        self,
        predictions_df: pd.DataFrame,
        features_master_df: pd.DataFrame,
        min_edge: float = 0.05,
        min_ev: float = 0.0,
    ) -> None:
        self.min_edge = min_edge
        self.min_ev = min_ev

        available = [c for c in _FEATURES_COLS if c in features_master_df.columns]
        self.df = predictions_df.merge(
            features_master_df[available], on="event_id", how="left"
        )

        if "match_label" not in self.df.columns:
            self.df["match_label"] = (
                self.df["home_team"] + " vs " + self.df["away_team"]
            )

    # ── Cálculos base ──────────────────────────────────────────────────────────

    def calculate_ev(self, prob_modelo: float, odd_bookmaker) -> float | None:
        """EV = (prob_modelo × odd) − 1. Retorna None si odd no disponible."""
        if odd_bookmaker is None or odd_bookmaker == 0:
            return None
        try:
            odd = float(odd_bookmaker)
        except (TypeError, ValueError):
            return None
        return prob_modelo * odd - 1.0

    def calculate_kelly(
        self,
        prob_modelo: float,
        odd_bookmaker,
        bankroll_fraction: float = 0.25,
    ) -> float:
        """Criterio de Kelly fraccionado, capado al 20 % del bankroll."""
        if odd_bookmaker is None:
            return 0.0
        try:
            odd = float(odd_bookmaker)
        except (TypeError, ValueError):
            return 0.0
        if odd <= 1.0:
            return 0.0
        kelly_full = (prob_modelo * odd - 1.0) / (odd - 1.0)
        if kelly_full < 0:
            return 0.0
        return min(kelly_full * bankroll_fraction, 0.20)

    # ── Análisis por partido ───────────────────────────────────────────────────

    def analyze_match(self, event_id: int) -> dict | None:
        rows = self.df[self.df["event_id"] == event_id]
        if len(rows) == 0:
            return None
        row = rows.iloc[0]

        markets = {}
        for mkt, prob_col, odd_col, implied_col in _MARKETS:
            prob = float(row[prob_col])
            odd = row.get(odd_col)
            if pd.isna(odd) if odd is not None else False:
                odd = None
            implied = float(row[implied_col]) if implied_col in row.index else 0.0
            edge = prob - implied
            ev = self.calculate_ev(prob, odd)
            kelly = self.calculate_kelly(prob, odd)
            is_value = edge >= self.min_edge and ev is not None and ev > self.min_ev
            markets[mkt] = {
                "edge": round(edge, 4),
                "ev": round(ev, 4) if ev is not None else None,
                "kelly_pct": round(kelly, 4),
                "is_value": is_value,
                "odd": float(odd) if odd is not None else None,
                "prob_modelo": round(prob, 4),
                "implied_prob": round(implied, 4),
            }

        best_bet = None
        best_ev = None
        best_kelly = None
        for mkt, data in markets.items():
            if data["ev"] is not None and data["ev"] > 0:
                if best_ev is None or data["ev"] > best_ev:
                    best_bet = mkt
                    best_ev = data["ev"]
                    best_kelly = data["kelly_pct"]

        return {
            "event_id": int(event_id),
            "match_label": str(row.get("match_label", "")),
            "event_date": str(row.get("event_date", "")),
            "home": markets["home"],
            "draw": markets["draw"],
            "away": markets["away"],
            "best_bet": best_bet,
            "best_ev": round(best_ev, 4) if best_ev is not None else None,
            "best_kelly": round(best_kelly, 4) if best_kelly is not None else None,
            "any_value": any(m["is_value"] for m in markets.values()),
        }

    # ── Value bets (partidos con edge) ────────────────────────────────────────

    def find_all_value_bets(self) -> pd.DataFrame:
        rows = []
        for _, r in self.df.iterrows():
            analysis = self.analyze_match(int(r["event_id"]))
            if analysis is None or not analysis["any_value"]:
                continue
            best = analysis["best_bet"]
            if best is None:
                continue
            best_data = analysis[best]
            rows.append({
                "event_id": analysis["event_id"],
                "match_label": analysis["match_label"],
                "event_date": analysis["event_date"],
                "best_bet": analysis["best_bet"],
                "best_ev": analysis["best_ev"],
                "best_kelly": analysis["best_kelly"],
                "odd_best": best_data["odd"],
                "prob_modelo_best": best_data["prob_modelo"],
                "implied_prob_best": best_data["implied_prob"],
                "edge_best": best_data["edge"],
                "predicted_winner": r["predicted_winner"],
                "confidence": r["confidence"],
            })

        df = pd.DataFrame(rows) if rows else pd.DataFrame(columns=[
            "event_id", "match_label", "event_date", "best_bet",
            "best_ev", "best_kelly", "odd_best", "prob_modelo_best",
            "implied_prob_best", "edge_best", "predicted_winner", "confidence",
        ])
        if len(df) > 0:
            df = df.sort_values("best_ev", ascending=False).reset_index(drop=True)

        out = _PROC / "value_bets.csv"
        df.to_csv(out, index=False)
        return df

    # ── Análisis completo (todos los mercados) ────────────────────────────────

    def get_full_analysis(self) -> pd.DataFrame:
        rows = []
        for _, r in self.df.iterrows():
            analysis = self.analyze_match(int(r["event_id"]))
            if analysis is None:
                continue
            for mkt in ("home", "draw", "away"):
                m = analysis[mkt]
                rows.append({
                    "event_id": analysis["event_id"],
                    "match_label": analysis["match_label"],
                    "event_date": analysis["event_date"],
                    "market": mkt,
                    "prob_modelo": m["prob_modelo"],
                    "implied_prob": m["implied_prob"],
                    "edge": m["edge"],
                    "ev": m["ev"],
                    "kelly_pct": m["kelly_pct"],
                    "is_value": m["is_value"],
                    "odd_bookmaker": m["odd"],
                })

        df = pd.DataFrame(rows)
        out = _PROC / "full_analysis.csv"
        df.to_csv(out, index=False)
        return df

    # ── Reporte en consola ────────────────────────────────────────────────────

    def print_report(self) -> None:
        vb_df = self.find_all_value_bets()
        full_df = self.get_full_analysis()

        total = len(self.df)
        with_odds = int(self.df["odds_home"].notna().sum())
        n_value = len(vb_df)
        n_markets = with_odds * 3

        width = 54
        border = "═" * width
        print(f"\n╔{border}╗")
        print(f"║{'BETCOL — Análisis Value Bets Mundial 2026':^{width}}║")
        print(f"╠{border}╣")
        print(f"║  {'Partidos analizados':<30}: {total:<3} / 50{'':<9}║")
        print(f"║  {'Partidos con odds disponibles':<30}: {with_odds:<15}║")
        print(f"║  {'Value bets encontradas':<30}: {n_value:<15}║")
        print(f"║  {'Mercados analizados':<30}: {n_markets} (home+draw+away)  ║")
        print(f"╠{border}╣")
        print(f"║  {'TOP 5 VALUE BETS:':<{width - 2}}║")

        if len(vb_df) == 0:
            print(f"║  {'  (ninguna encontrada con los parámetros actuales)':<{width - 2}}║")
        else:
            for i, row in vb_df.head(5).iterrows():
                mkt_es = {"home": "Local", "draw": "Empate", "away": "Visit."}.get(
                    row["best_bet"], row["best_bet"]
                )
                odd = f"{row['odd_best']:.2f}" if row["odd_best"] else "N/A"
                ev_pct = f"+{row['best_ev']*100:.1f}%" if row["best_ev"] else "N/A"
                line = f"  {i+1}. {row['match_label'][:22]:<22} {mkt_es:<7} odd={odd:<5} EV={ev_pct}"
                print(f"║  {line:<{width - 2}}║")

        print(f"╠{border}╣")
        print(f"║  {'Archivos guardados:':<{width - 2}}║")
        print(f"║    {'data/processed/value_bets.csv':<{width - 4}}║")
        print(f"║    {'data/processed/full_analysis.csv':<{width - 4}}║")
        print(f"╚{border}╝\n")


# ── Punto de entrada ──────────────────────────────────────────────────────────

def main() -> None:
    predictions = pd.read_csv(_PROC / "predictions_all.csv")
    features = pd.read_csv(_PROC / "features_master.csv")
    detector = ValueBetDetector(predictions, features, min_edge=0.05, min_ev=0.0)
    detector.print_report()


if __name__ == "__main__":
    main()
