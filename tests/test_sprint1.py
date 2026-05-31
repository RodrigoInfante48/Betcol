"""Tests unitarios Sprint 1 — ingesta de datos BSD API."""

import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from ingesta.extractors.odds import OddsExtractor, _implied_probs
from ingesta.extractors.world_cup import _normalize_fixture


# ──────────────────────────────────────────────
# Odds: probabilidades implícitas
# ──────────────────────────────────────────────

def test_odds_implied_prob():
    # odds 2.0/3.5/4.0 → inv: 0.5, 0.2857, 0.25 → total_inv ≈ 1.0357
    result = _implied_probs(2.0, 3.5, 4.0)
    assert result["implied_prob_home"] == pytest.approx(0.5 / (0.5 + 1/3.5 + 0.25), abs=0.001)
    total = result["implied_prob_home"] + result["implied_prob_draw"] + result["implied_prob_away"]
    assert total == pytest.approx(1.0, abs=1e-9)


def test_odds_margin():
    # margin = total_inv - 1 = (0.5 + 1/3.5 + 0.25) - 1 ≈ 0.0357
    result = _implied_probs(2.0, 3.5, 4.0)
    expected_margin = (0.5 + 1/3.5 + 0.25) - 1.0
    assert result["margin"] == pytest.approx(expected_margin, abs=0.001)


def test_odds_implied_prob_none_when_zero():
    result = _implied_probs(0.0, 3.5, 4.0)
    assert result["implied_prob_home"] is None
    assert result["margin"] is None


def test_odds_implied_prob_none_when_missing():
    result = _implied_probs(None, 3.5, 4.0)
    assert result["implied_prob_home"] is None


# ──────────────────────────────────────────────
# Normalización de fixtures
# ──────────────────────────────────────────────

_RAW_EVENT = {
    "id": 42,
    "home_team": {"id": 10, "name": "Argentina"},
    "away_team": {"id": 20, "name": "France"},
    "event_date": "2026-06-14T18:00:00Z",
    "status": "scheduled",
    "stage": "Group Stage",
    "group": "Group C",
    "venue": {"name": "MetLife Stadium"},
}

def test_normalize_fixture_required_fields():
    result = _normalize_fixture(_RAW_EVENT)
    required = ["event_id", "home_team", "away_team", "home_team_id", "away_team_id",
                "event_date", "status", "stage", "group", "venue"]
    for field in required:
        assert field in result, f"Falta campo: {field}"


def test_normalize_fixture_types():
    result = _normalize_fixture(_RAW_EVENT)
    assert isinstance(result["event_id"], int)
    assert isinstance(result["home_team"], str)
    assert isinstance(result["away_team"], str)
    assert isinstance(result["home_team_id"], int)
    assert isinstance(result["away_team_id"], int)


def test_normalize_fixture_stage_group():
    result = _normalize_fixture(_RAW_EVENT)
    assert result["stage"] == "group"
    assert result["group"] == "C"


def test_normalize_fixture_venue_from_dict():
    result = _normalize_fixture(_RAW_EVENT)
    assert result["venue"] == "MetLife Stadium"


def test_normalize_fixture_flat_event():
    flat = {
        "id": 99,
        "home_team": "Brazil",
        "away_team": "Germany",
        "home_team_id": 55,
        "away_team_id": 66,
        "event_date": "2026-07-01T20:00:00Z",
        "status": "scheduled",
        "stage": "semi-final",
        "venue": "Rose Bowl",
    }
    result = _normalize_fixture(flat)
    assert result["event_id"] == 99
    assert result["home_team"] == "Brazil"
    assert result["stage"] == "sf"


# ──────────────────────────────────────────────
# Storage: roundtrip JSON
# ──────────────────────────────────────────────

def test_storage_roundtrip():
    sample = {"team": "Uruguay", "goals": 3, "nested": {"a": 1}}

    with tempfile.TemporaryDirectory() as tmpdir:
        raw_dir = Path(tmpdir) / "data" / "raw"
        raw_dir.mkdir(parents=True)

        with patch("ingesta.storage._PROJECT_ROOT", Path(tmpdir)):
            from ingesta import storage
            storage.save_json(sample, "test_data")
            loaded = storage.load_json("test_data")

    assert loaded == sample


def test_storage_load_missing_returns_none():
    with tempfile.TemporaryDirectory() as tmpdir:
        with patch("ingesta.storage._PROJECT_ROOT", Path(tmpdir)):
            from ingesta import storage
            result = storage.load_json("nonexistent_file")
    assert result is None


# ──────────────────────────────────────────────
# OddsExtractor: get_odds_for_event (con mock)
# ──────────────────────────────────────────────

def test_get_odds_for_event_normalizes_correctly():
    mock_client = MagicMock()
    mock_client.get_event_detail.return_value = {
        "id": 1,
        "odds_home": "2.0",
        "odds_draw": "3.5",
        "odds_away": "4.0",
    }
    extractor = OddsExtractor(mock_client)
    result = extractor.get_odds_for_event(1)

    assert result["event_id"] == 1
    assert result["odds_home"] == pytest.approx(2.0)
    expected_prob_home = 0.5 / (0.5 + 1/3.5 + 0.25)
    assert result["implied_prob_home"] == pytest.approx(expected_prob_home, abs=0.001)
    expected_margin = (0.5 + 1/3.5 + 0.25) - 1.0
    assert result["margin"] == pytest.approx(expected_margin, abs=0.001)


def test_get_odds_for_event_handles_zero_odds():
    mock_client = MagicMock()
    mock_client.get_event_detail.return_value = {"id": 2, "odds_home": 0, "odds_draw": 0, "odds_away": 0}
    extractor = OddsExtractor(mock_client)
    result = extractor.get_odds_for_event(2)

    assert result["odds_home"] is None
    assert result["implied_prob_home"] is None
    assert result["margin"] is None
