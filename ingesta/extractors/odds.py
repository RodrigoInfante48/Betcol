"""Extractor de odds por partido desde la BSD API."""

import logging
import time
from typing import Any, Dict, List, Optional

import pandas as pd

from ingesta.bsd_client import BSDClient
from ingesta.storage import save_csv, save_json

logger = logging.getLogger(__name__)


def _implied_probs(
    odds_home: Optional[float],
    odds_draw: Optional[float],
    odds_away: Optional[float],
) -> Dict[str, Optional[float]]:
    """Calcula probabilidades implícitas normalizadas y margin del bookmaker."""
    if not all([odds_home, odds_draw, odds_away]):
        return {
            "implied_prob_home": None,
            "implied_prob_draw": None,
            "implied_prob_away": None,
            "margin": None,
        }

    inv_home = 1.0 / odds_home
    inv_draw = 1.0 / odds_draw
    inv_away = 1.0 / odds_away
    total_inv = inv_home + inv_draw + inv_away

    return {
        "implied_prob_home": inv_home / total_inv,
        "implied_prob_draw": inv_draw / total_inv,
        "implied_prob_away": inv_away / total_inv,
        "margin": total_inv - 1.0,
    }


class OddsExtractor:
    """Extrae y normaliza odds de eventos desde la BSD API."""

    def __init__(self, client: BSDClient) -> None:
        self.client = client

    def get_odds_for_event(self, event_id: int) -> Dict[str, Any]:
        """Extrae y normaliza odds de un evento individual."""
        event = self.client.get_event_detail(event_id)

        def _safe_float(val: Any) -> Optional[float]:
            try:
                f = float(val)
                return f if f > 0 else None
            except (TypeError, ValueError):
                return None

        odds_home = _safe_float(event.get("odds_home"))
        odds_draw = _safe_float(event.get("odds_draw"))
        odds_away = _safe_float(event.get("odds_away"))

        probs = _implied_probs(odds_home, odds_draw, odds_away)

        return {
            "event_id": event_id,
            "odds_home": odds_home,
            "odds_draw": odds_draw,
            "odds_away": odds_away,
            **probs,
        }

    def get_odds_all_fixtures(self, fixtures: List[Dict[str, Any]]) -> pd.DataFrame:
        """Obtiene odds para todos los fixtures y los persiste."""
        all_odds: List[Dict[str, Any]] = []
        raw_records: List[Dict[str, Any]] = []

        for fixture in fixtures:
            event_id = fixture.get("event_id")
            if event_id is None:
                continue
            try:
                odds = self.get_odds_for_event(event_id)
                all_odds.append(odds)
                raw_records.append({"event_id": event_id, "odds": odds})
            except Exception as exc:
                logger.warning("Odds no disponibles para event_id=%s: %s", event_id, exc)
            time.sleep(0.2)

        save_json(raw_records, "odds_raw")
        df = pd.DataFrame(all_odds) if all_odds else pd.DataFrame()
        if not df.empty:
            save_csv(df, "odds")
        return df
