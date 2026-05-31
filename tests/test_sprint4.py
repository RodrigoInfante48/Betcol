"""Tests unitarios Sprint 4 — Value Bets."""

import sys
from pathlib import Path

import pandas as pd
import pytest

_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from modelo.value_bets import ValueBetDetector

_PROC = _ROOT / "data" / "processed"


# ── Fixtures de datos ─────────────────────────────────────────────────────────

def _make_predictions(**overrides) -> pd.DataFrame:
    base = {
        "event_id": 1,
        "home_team": "TeamA", "away_team": "TeamB",
        "event_date": "2026-06-15",
        "prob_home": 0.55, "prob_draw": 0.25, "prob_away": 0.20,
        "predicted_winner": "home", "confidence": 0.55,
        "poisson_lambda_home": 1.5, "poisson_lambda_away": 1.0,
        "poisson_most_likely_score": "1-0",
        "elo_home": 1800, "elo_away": 1600, "elo_diff": 200,
        "bsd_prob_home": 0.55, "bsd_prob_draw": 0.25, "bsd_prob_away": 0.20,
    }
    base.update(overrides)
    return pd.DataFrame([base])


def _make_features(**overrides) -> pd.DataFrame:
    base = {
        "event_id": 1,
        "odds_home": 2.00, "odds_draw": 3.50, "odds_away": 5.00,
        "implied_prob_home": 0.45, "implied_prob_draw": 0.25, "implied_prob_away": 0.18,
        "match_label": "TeamA vs TeamB",
    }
    base.update(overrides)
    return pd.DataFrame([base])


def _detector(**pred_kw) -> ValueBetDetector:
    return ValueBetDetector(_make_predictions(**pred_kw), _make_features())


@pytest.fixture(scope="module")
def value_bets_csv():
    path = _PROC / "value_bets.csv"
    if not path.exists():
        pytest.skip("value_bets.csv no encontrado — ejecuta python modelo/value_bets.py")
    return pd.read_csv(path)


@pytest.fixture(scope="module")
def full_analysis_csv():
    path = _PROC / "full_analysis.csv"
    if not path.exists():
        pytest.skip("full_analysis.csv no encontrado — ejecuta python modelo/value_bets.py")
    return pd.read_csv(path)


# ── Tests de calculate_ev ──────────────────────────────────────────────────────

def test_ev_positive_when_model_better():
    det = _detector()
    ev = det.calculate_ev(0.60, 2.0)
    assert abs(ev - 0.20) < 1e-9, f"Esperado 0.20, obtenido {ev}"


def test_ev_negative_when_model_worse():
    det = _detector()
    ev = det.calculate_ev(0.40, 2.0)
    assert abs(ev - (-0.20)) < 1e-9, f"Esperado -0.20, obtenido {ev}"


def test_ev_none_when_odd_is_none():
    det = _detector()
    assert det.calculate_ev(0.50, None) is None


def test_ev_none_when_odd_is_zero():
    det = _detector()
    assert det.calculate_ev(0.50, 0) is None


# ── Tests de calculate_kelly ──────────────────────────────────────────────────

def test_kelly_zero_when_ev_negative():
    det = _detector()
    # EV = 0.30 * 2.0 - 1 = -0.40 < 0 → Kelly debe ser 0
    kelly = det.calculate_kelly(0.30, 2.0)
    assert kelly == 0.0, f"Kelly debe ser 0 cuando EV < 0, obtenido {kelly}"


def test_kelly_capped_at_20_pct():
    det = _detector()
    # Kelly full = (0.95*3 - 1)/(3-1) = 0.925, fraccionado = 0.925*0.25 = 0.23125 > 0.20
    kelly = det.calculate_kelly(0.95, 3.0)
    assert kelly <= 0.20, f"Kelly debe estar capado en 0.20, obtenido {kelly}"
    assert kelly == pytest.approx(0.20, abs=1e-9)


def test_kelly_positive_for_positive_ev():
    det = _detector()
    kelly = det.calculate_kelly(0.60, 2.0)
    assert kelly > 0.0


def test_kelly_zero_when_odd_none():
    det = _detector()
    assert det.calculate_kelly(0.60, None) == 0.0


# ── Tests de is_value ─────────────────────────────────────────────────────────

def test_value_bet_requires_positive_edge():
    """edge < min_edge → is_value=False aunque EV sea positivo."""
    # edge = 0.03 < min_edge=0.05 → False
    det_low = ValueBetDetector(
        _make_predictions(prob_home=0.48),
        _make_features(implied_prob_home=0.45, odds_home=2.10),
        min_edge=0.05,
    )
    analysis_low = det_low.analyze_match(1)
    assert analysis_low["home"]["edge"] == pytest.approx(0.03, abs=0.001)
    assert analysis_low["home"]["is_value"] is False

    # edge = 0.06 >= min_edge=0.05 → True (si EV también > 0)
    det_high = ValueBetDetector(
        _make_predictions(prob_home=0.51),
        _make_features(implied_prob_home=0.45, odds_home=2.10),
        min_edge=0.05,
    )
    analysis_high = det_high.analyze_match(1)
    assert analysis_high["home"]["edge"] == pytest.approx(0.06, abs=0.001)
    ev = analysis_high["home"]["ev"]
    # EV = 0.51 * 2.10 - 1 = 0.071 > 0
    assert ev > 0
    assert analysis_high["home"]["is_value"] is True


def test_value_bet_requires_positive_ev():
    """EV <= min_ev → is_value=False aunque edge sea suficiente."""
    det = ValueBetDetector(
        _make_predictions(prob_home=0.55),
        _make_features(implied_prob_home=0.45, odds_home=1.10),
        min_edge=0.05,
        min_ev=0.0,
    )
    analysis = det.analyze_match(1)
    ev = analysis["home"]["ev"]
    # EV = 0.55 * 1.10 - 1 = -0.395 < 0 → is_value=False
    assert ev < 0
    assert analysis["home"]["is_value"] is False


# ── Tests de archivos CSV ──────────────────────────────────────────────────────

def test_full_analysis_has_all_markets(full_analysis_csv):
    """full_analysis.csv debe tener exactamente 3 filas por event_id (home/draw/away)."""
    counts = full_analysis_csv.groupby("event_id")["market"].count()
    assert (counts == 3).all(), f"Algunos eventos no tienen 3 mercados:\n{counts[counts != 3]}"


def test_full_analysis_markets_are_home_draw_away(full_analysis_csv):
    markets = set(full_analysis_csv["market"].unique())
    assert markets == {"home", "draw", "away"}


def test_no_negative_kelly_in_output(value_bets_csv):
    """value_bets.csv nunca debe tener best_kelly < 0."""
    if len(value_bets_csv) == 0:
        pytest.skip("No hay value bets en el CSV")
    assert (value_bets_csv["best_kelly"] >= 0).all(), (
        "Se encontraron valores negativos de Kelly en value_bets.csv"
    )


def test_value_bets_kelly_capped(value_bets_csv):
    """best_kelly nunca supera 0.20 en el CSV."""
    if len(value_bets_csv) == 0:
        pytest.skip("No hay value bets en el CSV")
    assert (value_bets_csv["best_kelly"] <= 0.20).all()


def test_value_bets_ev_positive(value_bets_csv):
    """Todos los value bets en el CSV tienen best_ev > 0."""
    if len(value_bets_csv) == 0:
        pytest.skip("No hay value bets en el CSV")
    assert (value_bets_csv["best_ev"] > 0).all()


def test_analyze_match_returns_all_keys():
    det = _detector()
    result = det.analyze_match(1)
    assert result is not None
    required = {"event_id", "match_label", "event_date",
                "home", "draw", "away", "best_bet", "best_ev", "best_kelly", "any_value"}
    assert required.issubset(result.keys())
    for mkt in ("home", "draw", "away"):
        mkt_keys = {"edge", "ev", "kelly_pct", "is_value", "odd", "prob_modelo", "implied_prob"}
        assert mkt_keys.issubset(result[mkt].keys())


def test_full_analysis_total_rows(full_analysis_csv):
    """Total de filas = partidos con odds * 3."""
    n_events = full_analysis_csv["event_id"].nunique()
    assert len(full_analysis_csv) == n_events * 3
