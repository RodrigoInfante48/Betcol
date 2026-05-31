"""Tests unitarios Sprint 2 — ELO, TeamStats, Form y features_master."""

from pathlib import Path

import pandas as pd
import pytest

from features.elo import ELOSystem
from features.team_stats import TeamStatsEnricher
from features.form import FormCalculator

_ROOT = Path(__file__).resolve().parent.parent
_PROC = _ROOT / "data" / "processed"


# ══════════════════════════════════════════════
# ELO
# ══════════════════════════════════════════════

def test_elo_expected_score_equal():
    elo = ELOSystem()
    score = elo.expected_score(1500, 1500)
    assert abs(score - 0.5) < 1e-9


def test_elo_win_probability_sums_to_one():
    elo = ELOSystem()
    elo.seed_from_fifa_ranking(["France", "Brazil", "Germany"])
    result = elo.win_probability("France", "Germany")
    total = result["prob_a"] + result["prob_draw"] + result["prob_b"]
    assert abs(total - 1.0) < 0.001


def test_elo_higher_rated_favored():
    elo = ELOSystem()
    elo.ratings["TeamA"] = 2000
    elo.ratings["TeamB"] = 1500
    result = elo.win_probability("TeamA", "TeamB")
    assert result["prob_a"] > 0.70


def test_elo_update_winner_increases():
    elo = ELOSystem()
    elo.ratings["TeamA"] = 1600
    elo.ratings["TeamB"] = 1400
    old_a = elo.get_rating("TeamA")
    old_b = elo.get_rating("TeamB")
    elo.update_rating("TeamA", "TeamB", is_draw=False)
    assert elo.get_rating("TeamA") > old_a
    assert elo.get_rating("TeamB") < old_b


# ══════════════════════════════════════════════
# TeamStatsEnricher
# ══════════════════════════════════════════════

def _make_teams_df():
    return pd.DataFrame({
        "team_id":            [1, 2, 3, 4],
        "team_name":          ["Alpha", "Beta", "Gamma", "Delta"],
        "games_played":       [10, 10, 10, 10],
        "goals_scored_avg":   [2.0, 1.5, 1.0, 0.5],
        "goals_conceded_avg": [0.5, 1.0, 1.5, 2.0],
        "wins":               [7, 5, 3, 1],
        "draws":              [1, 2, 3, 2],
        "losses":             [2, 3, 4, 7],
        "win_rate":           [0.7, 0.5, 0.3, 0.1],
        "clean_sheets":       [4, 2, 1, 0],
        "last_5_form":        ["WWWWL", "WWDLL", "WDLLL", "LLLLL"],
    })


def _make_fixtures_df():
    return pd.DataFrame({
        "event_id":  [1, 2],
        "home_team": ["Alpha", "Beta"],
        "away_team": ["Gamma", "Delta"],
    })


def test_attack_defense_strength_mean_is_one():
    teams = _make_teams_df()
    fixtures = _make_fixtures_df()
    enricher = TeamStatsEnricher(teams, fixtures)
    enricher.calculate_attack_defense_strength()
    mean_att = enricher.df["attack_strength"].mean()
    assert abs(mean_att - 1.0) < 0.01


def test_lambda_positive():
    teams = _make_teams_df()
    fixtures = _make_fixtures_df()
    enricher = TeamStatsEnricher(teams, fixtures)
    enricher.calculate_attack_defense_strength()
    result = enricher.get_lambda_estimates("Alpha", "Gamma")
    assert result["lambda_home"] > 0
    assert result["lambda_away"] > 0


# ══════════════════════════════════════════════
# FormCalculator
# ══════════════════════════════════════════════

def test_form_score_range():
    elo = ELOSystem()
    teams = _make_teams_df()
    fixtures = _make_fixtures_df()
    preds = pd.DataFrame({"event_id": [1, 2]})

    enricher = TeamStatsEnricher(teams, fixtures)
    enricher.calculate_attack_defense_strength()

    calc = FormCalculator(fixtures, enricher.df, preds, elo, enricher)
    for form_str in ["WWWWW", "LLLLL", "WDLDW", "", None]:
        result = calc.parse_form_string(form_str)
        assert 0.0 <= result["form_score"] <= 1.0


# ══════════════════════════════════════════════
# features_master.csv
# ══════════════════════════════════════════════

@pytest.fixture(scope="module")
def master():
    path = _PROC / "features_master.csv"
    if not path.exists():
        pytest.skip("features_master.csv no encontrado — ejecutar build_features.py primero")
    return pd.read_csv(path)


def test_features_master_no_duplicate_events(master):
    assert master["event_id"].duplicated().sum() == 0


def test_edge_columns_range(master):
    for col in ["edge_elo_home", "edge_elo_away"]:
        assert col in master.columns
        assert (master[col] >= -1.0).all(), f"{col} tiene valores < -1.0"
        assert (master[col] <= 1.0).all(),  f"{col} tiene valores > 1.0"
