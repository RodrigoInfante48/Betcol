"""Interfaz CLI para predicciones del modelo ensemble Betcol."""

import argparse
import sys
from pathlib import Path

import pandas as pd

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from modelo.ensemble import EnsemblePredictor

_PROC = _PROJECT_ROOT / "data" / "processed"


# ── Carga de datos ────────────────────────────────────────────────────────────

def _load_data():
    teams_stats = pd.read_csv(_PROC / "teams_stats.csv")
    elo_ratings = pd.read_csv(_PROC / "elo_ratings.csv")
    bsd_predictions = pd.read_csv(_PROC / "bsd_predictions.csv")
    features_master = pd.read_csv(_PROC / "features_master.csv")

    # Enriquecer bsd_predictions con home_team / away_team desde features_master
    fix_cols = features_master[["event_id", "home_team", "away_team"]]
    bsd_enriched = bsd_predictions.merge(fix_cols, on="event_id", how="left")

    return teams_stats, elo_ratings, bsd_enriched, features_master


# ── Normalización de nombres ──────────────────────────────────────────────────

def _normalize_name(name: str, known_teams: list) -> str:
    """Busca el nombre exacto (case-insensitive). Si no lo encuentra, devuelve tal cual."""
    low = name.strip().lower()
    for t in known_teams:
        if t.strip().lower() == low:
            return t
    return name.strip().title()


# ── Formateo de salida ────────────────────────────────────────────────────────

def _odds_justa(prob: float) -> str:
    if prob <= 0:
        return " ∞"
    return f"{1.0 / prob:.2f}"


def _pct(prob: float) -> str:
    return f"{prob * 100:.1f}%"


def _print_match(result: dict) -> None:
    home = result["home_team"]
    away = result["away_team"]
    ph = result["prob_home"]
    pd_ = result["prob_draw"]
    pa = result["prob_away"]
    po = result["poisson"]
    elo = result["elo"]
    bsd = result["bsd"]
    wu = result["weights_used"]
    top5 = po["top_5_scores"]

    xg_home = po["lambda_home"]
    xg_away = po["lambda_away"]
    if bsd:
        xg_home = bsd.get("xg_home", xg_home)
        xg_away = bsd.get("xg_away", xg_away)

    bsd_line = "no disponible"
    if bsd:
        bsd_line = (
            f"{_pct(bsd['prob_home'])} / {_pct(bsd['prob_draw'])} / {_pct(bsd['prob_away'])}"
        )

    w_pct = (
        f"Poisson {wu['poisson']*100:.0f}% | "
        f"ELO {wu['elo']*100:.0f}% | "
        f"BSD {wu['bsd']*100:.0f}%"
    )

    top5_lines = ""
    for i, s in enumerate(top5, 1):
        top5_lines += f"│    {i}. {s['score']} → {_pct(s['prob']):<8}\n"

    elo_diff_sign = "+" if elo["elo_diff"] >= 0 else ""

    print(f"""
┌─────────────────────────────────────────────────────┐
│            BETCOL — Predicción de partido           │
├─────────────────────────────────────────────────────┤
│  {home}  vs  {away}
├──────────────┬────────────────┬─────────────────────┤
│  RESULTADO   │  PROBABILIDAD  │  ODDS JUSTA         │
├──────────────┼────────────────┼─────────────────────┤
│  {home:<12}│  {_pct(ph):<14}│  {_odds_justa(ph):<20} │
│  Empate      │  {_pct(pd_):<14}│  {_odds_justa(pd_):<20} │
│  {away:<12}│  {_pct(pa):<14}│  {_odds_justa(pa):<20} │
├──────────────┴────────────────┴─────────────────────┤
│  Marcador más probable: {po['most_likely_score']}  ({_pct(po['most_likely_score_prob']):<6})
│  Top 5 marcadores:
{top5_lines}├─────────────────────────────────────────────────────┤
│  xG esperado: {home} {xg_home:.2f} — {away} {xg_away:.2f}
│  ELO:         {elo['elo_home']:.0f} vs {elo['elo_away']:.0f}  (diff: {elo_diff_sign}{elo['elo_diff']:.0f})
│  Confianza del modelo: {_pct(result['confidence'])}
├─────────────────────────────────────────────────────┤
│  Fuentes: {w_pct}
│  Poisson:  {_pct(po['prob_home'])} / {_pct(po['prob_draw'])} / {_pct(po['prob_away'])}
│  ELO:      {_pct(elo['prob_home'])} / {_pct(elo['prob_draw'])} / {_pct(elo['prob_away'])}
│  BSD:      {bsd_line}
└─────────────────────────────────────────────────────┘""")


def _print_all_table(df: pd.DataFrame) -> None:
    print(f"\n{'Partido':<35} {'Favorito':<12} {'Prob':>7} {'Marcador':<10} {'Confianza':>9}")
    print("─" * 80)
    for _, row in df.iterrows():
        match = f"{row['home_team']} vs {row['away_team']}"
        winner = row["predicted_winner"]
        if winner == "home":
            fav = row["home_team"]
            prob = row["prob_home"]
        elif winner == "away":
            fav = row["away_team"]
            prob = row["prob_away"]
        else:
            fav = "Empate"
            prob = row["prob_draw"]

        print(
            f"{match:<35} {fav:<12} {prob*100:>6.1f}%  "
            f"{row['poisson_most_likely_score']:<10} {row['confidence']*100:>8.1f}%"
        )
    print(f"\nTotal: {len(df)} partidos  →  predictions_all.csv guardado")


# ── Punto de entrada ──────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="BETCOL — Predictor de partidos de fútbol"
    )
    parser.add_argument("teams", nargs="*", help="Nombre de dos equipos: 'Home' 'Away'")
    parser.add_argument("--all", action="store_true", help="Predecir todos los fixtures")
    args = parser.parse_args()

    teams_stats, elo_ratings, bsd_enriched, features_master = _load_data()

    predictor = EnsemblePredictor(
        teams_stats_df=teams_stats,
        elo_ratings_df=elo_ratings,
        bsd_predictions_df=bsd_enriched,
    )

    if args.all:
        df = predictor.predict_all_fixtures(features_master)
        _print_all_table(df)
        return

    if len(args.teams) != 2:
        parser.print_help()
        sys.exit(1)

    # Normalizar nombres (case-insensitive)
    known = list(teams_stats["team_name"].unique())
    home_team = _normalize_name(args.teams[0], known)
    away_team = _normalize_name(args.teams[1], known)

    result = predictor.predict(home_team, away_team)
    _print_match(result)


if __name__ == "__main__":
    main()
