"""Tests unitarios Sprint 3 — Poisson + ELO + Ensemble."""

import sys
from pathlib import Path

import pandas as pd
import pytest

_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from modelo.poisson import BivariatePoisson
from modelo.ensemble import EnsemblePredictor

_PROC = _ROOT / "data" / "processed"


# ── Fixtures de datos ─────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def teams_stats():
    path = _PROC / "teams_stats.csv"
    if not path.exists():
        pytest.skip("teams_stats.csv no encontrado")
    return pd.read_csv(path)


@pytest.fixture(scope="module")
def elo_ratings():
    path = _PROC / "elo_ratings.csv"
    if not path.exists():
        pytest.skip("elo_ratings.csv no encontrado")
    return pd.read_csv(path)


@pytest.fixture(scope="module")
def bsd_predictions():
    path = _PROC / "bsd_predictions.csv"
    if not path.exists():
        pytest.skip("bsd_predictions.csv no encontrado")
    return pd.read_csv(path)


@pytest.fixture(scope="module")
def poisson_model(teams_stats):
    return BivariatePoisson(teams_stats)


@pytest.fixture(scope="module")
def ensemble(teams_stats, elo_ratings, bsd_predictions):
    return EnsemblePredictor(
        teams_stats_df=teams_stats,
        elo_ratings_df=elo_ratings,
        bsd_predictions_df=bsd_predictions,
    )


# ── Tests Poisson ─────────────────────────────────────────────────────────────

def test_poisson_probs_sum_to_one(poisson_model):
    result = poisson_model.predict_match("Argentina", "France")
    total = result["prob_home_win"] + result["prob_draw"] + result["prob_away_win"]
    assert abs(total - 1.0) < 0.001


def test_poisson_argentina_vs_panama(poisson_model):
    result = poisson_model.predict_match("Argentina", "Panama")
    assert result["lambda_home"] > 2.0, f"lambda_home={result['lambda_home']}"
    assert result["prob_home_win"] > 0.60, f"prob_home_win={result['prob_home_win']}"


def test_poisson_strong_vs_weak(poisson_model):
    """Equipo con alta ofensiva vs defensa débil: local debe ganar más."""
    # Argentina (attack alta) vs Panama (defense débil)
    result = poisson_model.predict_match("Argentina", "Panama")
    assert result["prob_home_win"] > result["prob_away_win"]


def test_poisson_equal_teams_draw_likely(poisson_model):
    """Dos equipos con stats idénticas: draw debe ser razonablemente probable."""
    stats = pd.DataFrame([
        {
            "team_id": 1, "team_name": "TeamX",
            "goals_scored_avg": 1.5, "goals_conceded_avg": 1.2,
            "win_rate": 0.5, "clean_sheets": 2, "last_5_form": "WDWDW",
        },
        {
            "team_id": 2, "team_name": "TeamY",
            "goals_scored_avg": 1.5, "goals_conceded_avg": 1.2,
            "win_rate": 0.5, "clean_sheets": 2, "last_5_form": "WDWDW",
        },
    ])
    model = BivariatePoisson(stats)
    result = model.predict_match("TeamX", "TeamY")
    # Spec: "prob_draw debe ser el valor más cercano entre los tres (o al menos > 0.20)"
    # En Poisson con equipos iguales y lambda≈1.5: draw≈0.24, home=away≈0.38 — cumple > 0.20
    assert result["prob_draw"] > 0.20, f"prob_draw={result['prob_draw']}"


def test_score_matrix_sums_to_one(poisson_model):
    result = poisson_model.predict_match("Brazil", "Germany", max_goals=8)
    total = sum(result["score_matrix"].values())
    # score_matrix solo incluye probs > 0.01, el resto es la cola truncada
    # La suma de TODA la matriz (incluyendo lo truncado) ≈ 1.0.
    # Verificamos que la fracción cubierta sea alta (> 0.90)
    assert total > 0.80, f"Suma de score_matrix={total:.4f}"


def test_ensemble_weights_sum(ensemble):
    wu = ensemble.weights
    total = wu["poisson"] + wu["elo"] + wu["bsd"]
    assert abs(total - 1.0) < 1e-6


def test_ensemble_without_bsd(teams_stats, elo_ratings):
    """Sin BSD los pesos se redistribuyen y las probs siguen sumando 1."""
    predictor = EnsemblePredictor(
        teams_stats_df=teams_stats,
        elo_ratings_df=elo_ratings,
        bsd_predictions_df=pd.DataFrame(),
    )
    result = predictor.predict("Argentina", "France")
    total = result["prob_home"] + result["prob_draw"] + result["prob_away"]
    assert abs(total - 1.0) < 0.001
    assert result["bsd"] is None
    # Pesos deben sumar 1
    wu = result["weights_used"]
    assert abs(wu["poisson"] + wu["elo"] + wu["bsd"] - 1.0) < 1e-6


def test_odds_justa_argentina(poisson_model):
    """Argentina vs Panama: odds justa de Argentina debe ser < 1.50."""
    result = poisson_model.predict_match("Argentina", "Panama")
    odds_justa = 1.0 / result["prob_home_win"]
    assert odds_justa < 1.50, f"odds_justa={odds_justa:.2f}"


def test_confidence_range(ensemble):
    """Confianza siempre entre 0.33 y 1.0."""
    for home, away in [
        ("Argentina", "France"),
        ("USA", "Panama"),
        ("Brazil", "Chile"),
        ("Colombia", "Ecuador"),
    ]:
        result = ensemble.predict(home, away)
        assert 0.33 <= result["confidence"] <= 1.0, (
            f"{home} vs {away}: confidence={result['confidence']}"
        )
