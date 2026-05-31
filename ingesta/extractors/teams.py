"""Extractor de estadísticas históricas y jugadores no disponibles."""

import logging
import time
from typing import Any, Dict, List, Optional

import pandas as pd

from ingesta.bsd_client import BSDClient
from ingesta.storage import save_csv, save_json

logger = logging.getLogger(__name__)

_RECENT_N = 10


def _calc_form(events: List[Dict[str, Any]], team_id: int, n: int = 5) -> str:
    """Calcula el string de forma de los últimos N partidos de un equipo."""
    recent = events[-n:] if len(events) >= n else events
    form_chars = []
    for ev in recent:
        home = ev.get("home_team", {})
        away = ev.get("away_team", {})
        home_id = home.get("id") if isinstance(home, dict) else ev.get("home_team_id")
        away_id = away.get("id") if isinstance(away, dict) else ev.get("away_team_id")

        home_score = ev.get("home_score", ev.get("score_home"))
        away_score = ev.get("away_score", ev.get("score_away"))

        try:
            hs, as_ = int(home_score), int(away_score)
        except (TypeError, ValueError):
            form_chars.append("?")
            continue

        if home_id == team_id:
            form_chars.append("W" if hs > as_ else ("D" if hs == as_ else "L"))
        else:
            form_chars.append("W" if as_ > hs else ("D" if hs == as_ else "L"))

    return "".join(form_chars)


def _aggregate_stats(events: List[Dict[str, Any]], team_id: int) -> Dict[str, Any]:
    """Agrega estadísticas de partidos para un equipo."""
    goals_scored = goals_conceded = wins = draws = losses = clean_sheets = 0
    played = 0

    for ev in events:
        home = ev.get("home_team", {})
        away = ev.get("away_team", {})
        home_id = home.get("id") if isinstance(home, dict) else ev.get("home_team_id")
        away_id = away.get("id") if isinstance(away, dict) else ev.get("away_team_id")

        if home_id != team_id and away_id != team_id:
            continue

        home_score = ev.get("home_score", ev.get("score_home"))
        away_score = ev.get("away_score", ev.get("score_away"))

        try:
            hs, as_ = int(home_score), int(away_score)
        except (TypeError, ValueError):
            continue

        played += 1
        if home_id == team_id:
            gf, ga = hs, as_
        else:
            gf, ga = as_, hs

        goals_scored += gf
        goals_conceded += ga
        if gf > ga:
            wins += 1
        elif gf == ga:
            draws += 1
        else:
            losses += 1
        if ga == 0:
            clean_sheets += 1

    return {
        "games_played": played,
        "goals_scored": goals_scored,
        "goals_conceded": goals_conceded,
        "goals_scored_avg": round(goals_scored / played, 3) if played else 0.0,
        "goals_conceded_avg": round(goals_conceded / played, 3) if played else 0.0,
        "wins": wins,
        "draws": draws,
        "losses": losses,
        "win_rate": round(wins / played, 3) if played else 0.0,
        "clean_sheets": clean_sheets,
    }


class TeamsExtractor:
    """Extrae estadísticas de equipos y jugadores no disponibles."""

    def __init__(self, client: BSDClient) -> None:
        self.client = client

    def get_team_stats(self, team_id: int, n: int = _RECENT_N) -> Dict[str, Any]:
        """Retorna stats del equipo a partir de su historial reciente."""
        team_data: Dict[str, Any] = {}
        events: List[Dict[str, Any]] = []

        try:
            team_data = self.client.get_team(team_id)
        except Exception as exc:
            logger.warning("No se pudo obtener /teams/%s/: %s", team_id, exc)

        try:
            all_events = self.client.get_team_events(team_id)
            events = all_events[-n:] if len(all_events) >= n else all_events
        except Exception as exc:
            logger.warning("No se pudo obtener eventos del equipo %s: %s", team_id, exc)

        team_name = team_data.get("name", team_data.get("team_name", str(team_id)))
        stats = _aggregate_stats(events, team_id)
        last_5_form = _calc_form(events, team_id, n=5)

        return {
            "team_id": team_id,
            "team_name": team_name,
            **stats,
            "last_5_form": last_5_form,
        }

    def get_unavailable_players(self, event_id: int) -> Dict[str, Any]:
        """Extrae jugadores no disponibles (lesionados/suspendidos) de un evento."""
        try:
            event = self.client.get_event_detail(event_id)
        except Exception as exc:
            logger.warning("No se pudo obtener detalle de event_id=%s: %s", event_id, exc)
            return {"event_id": event_id, "home_injured": [], "away_injured": [], "home_count": 0, "away_count": 0}

        unavailable = event.get("unavailable_players", {})
        home_injured: List[str] = []
        away_injured: List[str] = []

        if isinstance(unavailable, dict):
            home_injured = unavailable.get("home", [])
            away_injured = unavailable.get("away", [])
        elif isinstance(unavailable, list):
            for p in unavailable:
                team = p.get("team", "")
                name = p.get("name", p.get("player", ""))
                if "home" in str(team).lower():
                    home_injured.append(name)
                else:
                    away_injured.append(name)

        return {
            "event_id": event_id,
            "home_injured": home_injured,
            "away_injured": away_injured,
            "home_count": len(home_injured),
            "away_count": len(away_injured),
        }

    def get_all_teams_stats(self, teams: List[Dict[str, Any]]) -> pd.DataFrame:
        """Itera todos los equipos, obtiene stats y persiste resultados."""
        all_stats: List[Dict[str, Any]] = []

        for team in teams:
            team_id = team.get("team_id")
            if team_id is None:
                continue
            try:
                stats = self.get_team_stats(team_id)
                all_stats.append(stats)
            except Exception as exc:
                logger.warning("Error stats team_id=%s: %s", team_id, exc)
            time.sleep(0.2)

        save_json(all_stats, "teams_stats_raw")
        df = pd.DataFrame(all_stats) if all_stats else pd.DataFrame()
        if not df.empty:
            save_csv(df, "teams_stats")
        return df
