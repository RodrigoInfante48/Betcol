"""Extractor de fixtures y metadata del Mundial 2026."""

import logging
from typing import Any, Dict, List, Optional

import pandas as pd

from ingesta.bsd_client import BSDClient
from ingesta.storage import save_csv, save_json

logger = logging.getLogger(__name__)

_WC_DATE_FROM = "2026-06-11"
_WC_DATE_TO = "2026-07-19"


def _infer_stage(event: Dict[str, Any]) -> str:
    """Infiere la fase del torneo a partir de campos del evento."""
    raw_stage = str(event.get("stage", event.get("round", event.get("group_stage", "")))).lower()
    if "final" in raw_stage and "semi" not in raw_stage and "quarter" not in raw_stage:
        return "final"
    if "semi" in raw_stage:
        return "sf"
    if "quarter" in raw_stage or "qf" in raw_stage:
        return "qf"
    if "round of 16" in raw_stage or "r16" in raw_stage or "last 16" in raw_stage:
        return "r16"
    return "group"


def _infer_group(event: Dict[str, Any]) -> Optional[str]:
    """Extrae la letra de grupo si el evento es de fase de grupos."""
    group = event.get("group", event.get("group_name", None))
    if group:
        letter = str(group).strip().upper().replace("GROUP", "").strip()
        return letter if letter else None
    return None


def _normalize_fixture(event: Dict[str, Any]) -> Dict[str, Any]:
    """Normaliza un evento raw al schema de fixture del Mundial."""
    home = event.get("home_team", {})
    away = event.get("away_team", {})

    home_name = home.get("name", home) if isinstance(home, dict) else str(home)
    away_name = away.get("name", away) if isinstance(away, dict) else str(away)
    home_id = home.get("id", event.get("home_team_id")) if isinstance(home, dict) else event.get("home_team_id")
    away_id = away.get("id", event.get("away_team_id")) if isinstance(away, dict) else event.get("away_team_id")

    venue = event.get("venue", event.get("stadium", None))
    if isinstance(venue, dict):
        venue = venue.get("name", None)

    return {
        "event_id": event.get("id", event.get("event_id")),
        "home_team": home_name,
        "away_team": away_name,
        "home_team_id": home_id,
        "away_team_id": away_id,
        "event_date": event.get("event_date", event.get("date", event.get("datetime", ""))),
        "status": event.get("status", "scheduled"),
        "stage": _infer_stage(event),
        "group": _infer_group(event),
        "venue": venue,
    }


class WorldCupExtractor:
    """Extrae fixtures y metadata del Mundial 2026 desde la BSD API."""

    def __init__(self, client: BSDClient) -> None:
        self.client = client
        self._league_id: Optional[int] = None

    def get_league_id(self) -> Optional[int]:
        """Busca la liga del Mundial 2026 en /leagues/ y retorna su ID."""
        try:
            leagues = self.client.get_leagues()
            save_json(leagues, "leagues")
            for league in leagues:
                name = str(league.get("name", "")).lower()
                year = str(league.get("year", league.get("season", "")))
                if "world cup" in name and "2026" in year:
                    self._league_id = league.get("id")
                    logger.info("Mundial 2026 encontrado: league_id=%s", self._league_id)
                    return self._league_id
            logger.warning("Mundial 2026 no encontrado en /leagues/. Se usará filtro por fecha.")
        except Exception as exc:
            logger.error("Error al obtener ligas: %s", exc)
        return None

    def get_fixtures(self) -> List[Dict[str, Any]]:
        """Obtiene todos los partidos del Mundial 2026 y los normaliza."""
        try:
            raw_events = self.client.get_events(
                league_id=self._league_id,
                date_from=_WC_DATE_FROM,
                date_to=_WC_DATE_TO,
            )
            save_json(raw_events, "fixtures_raw")

            fixtures = [_normalize_fixture(e) for e in raw_events]
            if fixtures:
                df = pd.DataFrame(fixtures)
                save_csv(df, "fixtures")
            logger.info("Fixtures normalizados: %d", len(fixtures))
            return fixtures
        except Exception as exc:
            logger.error("Error al obtener fixtures: %s", exc)
            return []

    def get_teams(self, fixtures: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extrae equipos únicos de los fixtures."""
        seen: Dict[int, str] = {}
        for f in fixtures:
            h_id = f.get("home_team_id")
            a_id = f.get("away_team_id")
            if h_id is not None:
                seen[h_id] = f["home_team"]
            if a_id is not None:
                seen[a_id] = f["away_team"]

        teams = [{"team_id": tid, "team_name": name} for tid, name in seen.items()]
        save_json(teams, "teams")
        logger.info("Equipos únicos: %d", len(teams))
        return teams
