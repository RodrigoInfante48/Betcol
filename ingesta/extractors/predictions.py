"""Extractor de predicciones CatBoost de la BSD API."""

import logging
import time
from typing import Any, Dict, List, Optional

import pandas as pd

from ingesta.bsd_client import BSDClient
from ingesta.storage import save_csv, save_json

logger = logging.getLogger(__name__)


def _predicted_winner(prob_home: Optional[float], prob_draw: Optional[float], prob_away: Optional[float]) -> Optional[str]:
    """Retorna 'H', 'D' o 'A' según la probabilidad más alta."""
    if None in (prob_home, prob_draw, prob_away):
        return None
    probs = {"H": prob_home, "D": prob_draw, "A": prob_away}
    return max(probs, key=lambda k: probs[k])


def _normalize_prediction(event_id: int, raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normaliza una predicción raw al schema del sprint."""
    def _f(key: str) -> Optional[float]:
        val = raw.get(key)
        try:
            return float(val) if val is not None else None
        except (TypeError, ValueError):
            return None

    prob_home = _f("prob_home")
    prob_draw = _f("prob_draw")
    prob_away = _f("prob_away")

    return {
        "event_id": event_id,
        "bsd_prob_home": prob_home,
        "bsd_prob_draw": prob_draw,
        "bsd_prob_away": prob_away,
        "bsd_xg_home": _f("expected_goals_home"),
        "bsd_xg_away": _f("expected_goals_away"),
        "bsd_most_likely_score": raw.get("most_likely_score"),
        "bsd_confidence": _f("confidence"),
        "bsd_predicted_winner": _predicted_winner(prob_home, prob_draw, prob_away),
    }


def _empty_prediction(event_id: int) -> Dict[str, Any]:
    return {
        "event_id": event_id,
        "bsd_prob_home": None,
        "bsd_prob_draw": None,
        "bsd_prob_away": None,
        "bsd_xg_home": None,
        "bsd_xg_away": None,
        "bsd_most_likely_score": None,
        "bsd_confidence": None,
        "bsd_predicted_winner": None,
    }


class PredictionsExtractor:
    """Extrae predicciones CatBoost de la BSD API por evento."""

    def __init__(self, client: BSDClient) -> None:
        self.client = client

    def get_bsd_predictions(self, fixtures: List[Dict[str, Any]]) -> pd.DataFrame:
        """Obtiene predicciones para todos los fixtures y las persiste."""
        results: List[Dict[str, Any]] = []
        raw_records: List[Dict[str, Any]] = []

        for fixture in fixtures:
            event_id = fixture.get("event_id")
            if event_id is None:
                continue
            try:
                preds = self.client.get_predictions(event_id=event_id)
                if preds:
                    raw = preds[0] if isinstance(preds, list) else preds
                    raw_records.append({"event_id": event_id, "prediction": raw})
                    results.append(_normalize_prediction(event_id, raw))
                else:
                    logger.warning("Sin predicción para event_id=%s", event_id)
                    results.append(_empty_prediction(event_id))
                    raw_records.append({"event_id": event_id, "prediction": None})
            except Exception as exc:
                logger.warning("Error al obtener predicción event_id=%s: %s", event_id, exc)
                results.append(_empty_prediction(event_id))
            time.sleep(0.2)

        save_json(raw_records, "predictions_raw")
        df = pd.DataFrame(results) if results else pd.DataFrame()
        if not df.empty:
            save_csv(df, "bsd_predictions")
        return df
