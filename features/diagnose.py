"""Diagnóstico previo al pipeline de features del Sprint 2."""

from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
PROC = ROOT / "data" / "processed"


def _load(name):
    p = PROC / f"{name}.csv"
    if not p.exists():
        raise FileNotFoundError(f"No encontrado: {p}")
    return pd.read_csv(p)


def main():
    fixtures   = _load("fixtures")
    teams      = _load("teams_stats")
    preds      = _load("bsd_predictions")
    odds       = _load("odds")

    # ── 1. Fixtures ─────────────────────────────────────────────────────────
    print("\n=== FIXTURES ===")
    print(fixtures.head(3).to_string())
    print(f"\nColumnas ({len(fixtures.columns)}): {list(fixtures.columns)}")
    print(f"Tipos:\n{fixtures.dtypes.to_string()}")
    print(f"\nHome teams únicos: {sorted(fixtures['home_team'].unique().tolist())}")
    print(f"Away teams únicos: {sorted(fixtures['away_team'].unique().tolist())}")

    # ── 2. Teams Stats ───────────────────────────────────────────────────────
    print("\n=== TEAMS STATS ===")
    print(teams.head(5).to_string())
    print(f"\nColumnas ({len(teams.columns)}): {list(teams.columns)}")
    num_cols = teams.select_dtypes(include="number").columns.tolist()
    non_nan = {c: int(teams[c].notna().sum()) for c in num_cols}
    print(f"\nColumnas numéricas con valores (no NaN):")
    for col, cnt in non_nan.items():
        print(f"  {col}: {cnt}/{len(teams)}")
    for key in ["goals_scored_avg", "goals_conceded_avg", "win_rate", "last_5_form", "clean_sheets"]:
        exists = key in teams.columns
        print(f"  {'✓' if exists else '✗'} {key}")

    # ── 3. BSD Predictions ───────────────────────────────────────────────────
    print("\n=== BSD PREDICTIONS ===")
    print(preds.head(3).to_string())
    print(f"\nColumnas ({len(preds.columns)}): {list(preds.columns)}")
    xg_h_count = int(preds["bsd_xg_home"].notna().sum())
    xg_a_count = int(preds["bsd_xg_away"].notna().sum())
    print(f"bsd_xg_home con valores reales: {xg_h_count}/{len(preds)}")
    print(f"bsd_xg_away con valores reales: {xg_a_count}/{len(preds)}")

    # ── 4. Odds ───────────────────────────────────────────────────────────────
    print("\n=== ODDS ===")
    print(odds.head(3).to_string())
    print(f"\nColumnas ({len(odds.columns)}): {list(odds.columns)}")
    for col in ["implied_prob_home", "implied_prob_draw", "implied_prob_away"]:
        has = col in odds.columns and odds[col].notna().any()
        print(f"  {'✓' if has else '✗'} {col}")
    if "margin" in odds.columns:
        m = odds["margin"].dropna()
        print(f"  margin rango: [{m.min():.4f}, {m.max():.4f}]")

    # ── Reporte final ─────────────────────────────────────────────────────────
    all_teams_in_fixtures = set(fixtures["home_team"]) | set(fixtures["away_team"])
    teams_with_goals = int((teams["goals_scored_avg"] > 0).sum()) if "goals_scored_avg" in teams.columns else 0
    xg_total = int(preds["bsd_xg_home"].notna().sum())

    print("\n=== DIAGNÓSTICO BETCOL ===")
    print(f"Fixtures        : {len(fixtures)} filas, {len(fixtures.columns)} columnas → {list(fixtures.columns)}")
    print(f"Teams stats     : {len(teams)} filas, {len(teams.columns)} columnas → {list(teams.columns)}")
    print(f"Predictions BSD : {len(preds)} filas, {len(preds.columns)} columnas → {list(preds.columns)}")
    print(f"Odds            : {len(odds)} filas, {len(odds.columns)} columnas → {list(odds.columns)}")
    print(f"XG disponible   : {xg_total} / {len(preds)} partidos")
    print(f"Team stats con goals_avg : {teams_with_goals} / {len(teams)}")

    # Chequeo de nombres matcheando
    teams_in_stats = set(teams["team_name"])
    matched = all_teams_in_fixtures & teams_in_stats
    not_matched = all_teams_in_fixtures - teams_in_stats
    print(f"\nEquipos en fixtures: {len(all_teams_in_fixtures)}")
    print(f"Matcheados en teams_stats: {len(matched)}")
    if not_matched:
        print(f"NO matcheados (requieren rename): {sorted(not_matched)}")
    else:
        print("✓ Todos los equipos del fixture matchean en teams_stats")


if __name__ == "__main__":
    main()
