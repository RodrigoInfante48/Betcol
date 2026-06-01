#!/usr/bin/env python3
"""Upload pre-computed prediction data to Supabase.

Usage:
    export SUPABASE_URL=https://nbnqfcjcesvsuwuzqwts.supabase.co
    export SUPABASE_SERVICE_KEY=<your-service-role-key>
    python scripts/upload_to_supabase.py
"""

import os
import sys
from pathlib import Path

import pandas as pd
from supabase import create_client, Client

_ROOT = Path(__file__).resolve().parent.parent
_PROC = _ROOT / "data" / "processed"

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://nbnqfcjcesvsuwuzqwts.supabase.co")
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]


def _clean(records: list[dict]) -> list[dict]:
    """Replace NaN/NaT with None for JSON serialization."""
    import math
    for r in records:
        for k, v in r.items():
            if isinstance(v, float) and math.isnan(v):
                r[k] = None
            elif hasattr(v, 'isoformat'):
                r[k] = v.isoformat()
    return records


def client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def upload_teams_stats(db: Client) -> None:
    path = _PROC / "teams_stats.csv"
    if not path.exists():
        print("  skip: teams_stats.csv not found")
        return
    df = pd.read_csv(path)
    records = _clean(df.to_dict("records"))
    db.table("teams_stats").upsert(records, on_conflict="team_id").execute()
    print(f"  uploaded {len(records)} teams")


def upload_matches(db: Client) -> None:
    fixtures = _PROC / "fixtures.csv"
    odds = _PROC / "odds.csv"
    if not fixtures.exists():
        print("  skip: fixtures.csv not found")
        return
    df = pd.read_csv(fixtures)
    if odds.exists():
        df = df.merge(pd.read_csv(odds), on="event_id", how="left")
    records = _clean(df.to_dict("records"))
    db.table("matches").upsert(records, on_conflict="event_id").execute()
    print(f"  uploaded {len(records)} matches")


def upload_predictions(db: Client) -> None:
    pred_path = _PROC / "predictions_all.csv"
    feat_path = _PROC / "features_master.csv"
    if not pred_path.exists():
        print("  skip: predictions_all.csv not found")
        return
    df = pd.read_csv(pred_path)
    if feat_path.exists():
        elo_cols = ["event_id", "elo_prob_home", "elo_prob_draw", "elo_prob_away"]
        feat = pd.read_csv(feat_path)
        available = [c for c in elo_cols if c in feat.columns]
        df = df.merge(feat[available], on="event_id", how="left")
    keep = [
        "event_id", "prob_home", "prob_draw", "prob_away", "predicted_winner",
        "confidence", "poisson_lambda_home", "poisson_lambda_away",
        "poisson_most_likely_score", "elo_home", "elo_away", "elo_diff",
        "elo_prob_home", "elo_prob_draw", "elo_prob_away",
        "bsd_prob_home", "bsd_prob_draw", "bsd_prob_away",
        "bsd_xg_home", "bsd_xg_away",
    ]
    df = df[[c for c in keep if c in df.columns]]
    records = _clean(df.to_dict("records"))
    db.table("predictions").upsert(records, on_conflict="event_id").execute()
    print(f"  uploaded {len(records)} predictions")


def upload_value_bets(db: Client) -> None:
    path = _PROC / "value_bets.csv"
    if not path.exists():
        print("  skip: value_bets.csv not found")
        return
    df = pd.read_csv(path)
    records = _clean(df.to_dict("records"))
    db.table("value_bets").delete().neq("id", 0).execute()
    db.table("value_bets").insert(records).execute()
    print(f"  uploaded {len(records)} value bets")


def upload_full_analysis(db: Client) -> None:
    path = _PROC / "full_analysis.csv"
    if not path.exists():
        print("  skip: full_analysis.csv not found")
        return
    df = pd.read_csv(path)
    records = _clean(df.to_dict("records"))
    db.table("full_analysis").delete().neq("id", 0).execute()
    db.table("full_analysis").insert(records).execute()
    print(f"  uploaded {len(records)} analysis rows")


def main() -> None:
    print(f"Connecting to {SUPABASE_URL}")
    db = client()
    print("teams_stats:")
    upload_teams_stats(db)
    print("matches:")
    upload_matches(db)
    print("predictions:")
    upload_predictions(db)
    print("value_bets:")
    upload_value_bets(db)
    print("full_analysis:")
    upload_full_analysis(db)
    print("Done!")


if __name__ == "__main__":
    main()
