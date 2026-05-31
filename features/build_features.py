"""Pipeline orquestador del Sprint 2 — produce features_master.csv."""

import sys
from pathlib import Path

# Asegurar que el directorio raíz esté en sys.path para invocación directa
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

import pandas as pd

from features.elo import ELOSystem
from features.team_stats import TeamStatsEnricher
from features.form import FormCalculator

_ROOT = Path(__file__).resolve().parent.parent
_PROC = _ROOT / "data" / "processed"


def _load(name: str) -> pd.DataFrame:
    path = _PROC / f"{name}.csv"
    if not path.exists():
        raise FileNotFoundError(f"Archivo no encontrado: {path}")
    return pd.read_csv(path)


def build() -> pd.DataFrame:
    # ── 1. Cargar datos ──────────────────────────────────────────────────────
    fixtures    = _load("fixtures")
    odds        = _load("odds")
    predictions = _load("bsd_predictions")
    teams_stats = _load("teams_stats")

    # ── 2. ELO ───────────────────────────────────────────────────────────────
    elo = ELOSystem(k=40, base_elo=1500, neutral_venue=True)
    all_teams = sorted(
        set(fixtures["home_team"].tolist() + fixtures["away_team"].tolist())
    )
    elo.seed_from_fifa_ranking(all_teams)
    elo.save_ratings(_PROC / "elo_ratings.csv")
    print(f"[ELO] Ratings calculados para {len(elo.ratings)} equipos")

    # ── 3. TeamStatsEnricher ─────────────────────────────────────────────────
    enricher = TeamStatsEnricher(teams_stats, fixtures, predictions)
    enricher.normalize_team_names()
    enricher.calculate_attack_defense_strength()
    enricher.save_enriched(_PROC / "teams_stats_enriched.csv")

    # ── 4. FormCalculator ────────────────────────────────────────────────────
    calc = FormCalculator(fixtures, enricher.df, predictions, elo, enricher)
    form_df = calc.build_form_features()

    # ── 5. Merge (todo LEFT JOIN en event_id) ────────────────────────────────
    master = fixtures.copy()
    master = master.merge(odds,        on="event_id", how="left")
    master = master.merge(predictions, on="event_id", how="left")
    master = master.merge(form_df,     on="event_id", how="left")

    # ── 6. Columnas derivadas ────────────────────────────────────────────────
    master["edge_elo_home"] = (
        master["elo_prob_home"] - master["implied_prob_home"]
    ).round(4)
    master["edge_elo_away"] = (
        master["elo_prob_away"] - master["implied_prob_away"]
    ).round(4)
    master["edge_bsd_home"] = (
        master["bsd_prob_home"] / 100.0 - master["implied_prob_home"]
    ).round(4)
    master["edge_bsd_away"] = (
        master["bsd_prob_away"] / 100.0 - master["implied_prob_away"]
    ).round(4)

    master["match_label"]    = master["home_team"] + " vs " + master["away_team"]
    master["event_date_dt"]  = pd.to_datetime(master["event_date"], errors="coerce")

    # ── 7. Redondear floats a 4 decimales ────────────────────────────────────
    float_cols = master.select_dtypes(include="float64").columns
    master[float_cols] = master[float_cols].round(4)

    # ── 8. Guardar ───────────────────────────────────────────────────────────
    out_path = _PROC / "features_master.csv"
    master.to_csv(out_path, index=False)

    # ── 9. Resumen ───────────────────────────────────────────────────────────
    unique_teams = len(
        set(master["home_team"].tolist() + master["away_team"].tolist())
    )
    xg_count = int(master["bsd_xg_home"].notna().sum())
    lambda_count = int(
        (master["lambda_home"].notna() & master["lambda_away"].notna()).sum()
    )
    nan_cols = [c for c in master.columns if master[c].isna().any()]

    print("""
╔══════════════════════════════════════════════╗
║   BETCOL — Sprint 2 completado ✓            ║
╠══════════════════════════════════════════════╣""")
    print(f"║  Partidos en features_master : {len(master):<13} ║")
    print(f"║  Features por partido        : {len(master.columns):<5} columnas  ║")
    print(f"║  Equipos únicos              : {unique_teams:<5} / 48       ║")
    print(f"║  ELO ratings calculados      : {len(elo.ratings):<13} ║")
    print(f"║  Lambdas Poisson disponibles : {lambda_count:<5} / 50      ║")
    print(f"║  Partidos con XG             : {xg_count:<5} / 50      ║")
    print( "║  Edges vs bookmaker (ELO)    : calculados    ║")
    nan_str = str(nan_cols) if nan_cols else "ninguna"
    print(f"║  Columnas con NaN            : {nan_str[:20]:<20} ║")
    print("╚══════════════════════════════════════════════╝")

    return master


if __name__ == "__main__":
    build()
