"""Orquestador principal de ingesta de datos del Mundial 2026."""

import logging
import sys
from pathlib import Path

from ingesta.bsd_client import BSDClient
from ingesta.extractors.odds import OddsExtractor
from ingesta.extractors.predictions import PredictionsExtractor
from ingesta.extractors.teams import TeamsExtractor
from ingesta.extractors.world_cup import WorldCupExtractor
from ingesta.storage import get_data_path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


def _count_raw_files() -> int:
    raw_dir = get_data_path("raw")
    return len(list(raw_dir.glob("*.json")))


def main() -> None:
    # 1. Conectar
    client = BSDClient()
    if not client.ping():
        logger.error("No se pudo conectar a la BSD API. Abortando.")
        sys.exit(1)

    # 2. Fixtures del Mundial
    wc = WorldCupExtractor(client)
    league_id = wc.get_league_id()
    fixtures = wc.get_fixtures()
    teams = wc.get_teams(fixtures)
    logger.info("Encontrados %d fixtures del Mundial 2026", len(fixtures))

    # 3. Odds
    odds_extractor = OddsExtractor(client)
    try:
        odds_df = odds_extractor.get_odds_all_fixtures(fixtures)
        odds_count = len(odds_df)
    except Exception as exc:
        logger.error("Error en extracción de odds: %s", exc)
        odds_count = 0

    # 4. Predicciones BSD
    pred_extractor = PredictionsExtractor(client)
    try:
        pred_df = pred_extractor.get_bsd_predictions(fixtures)
        pred_count = len(pred_df)
    except Exception as exc:
        logger.error("Error en extracción de predicciones: %s", exc)
        pred_count = 0

    # 5. Stats de equipos
    teams_extractor = TeamsExtractor(client)
    try:
        teams_df = teams_extractor.get_all_teams_stats(teams)
        teams_count = len(teams_df)
    except Exception as exc:
        logger.error("Error en extracción de stats de equipos: %s", exc)
        teams_count = 0

    # 6. Jugadores no disponibles (primeros 5 fixtures)
    for fixture in fixtures[:5]:
        event_id = fixture.get("event_id")
        if event_id is None:
            continue
        try:
            unavailable = teams_extractor.get_unavailable_players(event_id)
            logger.info(
                "Bajas event %s → local: %d, visitante: %d",
                event_id, unavailable["home_count"], unavailable["away_count"],
            )
        except Exception as exc:
            logger.warning("Error jugadores no disponibles event_id=%s: %s", event_id, exc)

    raw_files = _count_raw_files()

    # 7. Resumen final
    print("\n╔══════════════════════════════════════╗")
    print("║   BETCOL — Sprint 1 completado ✓    ║")
    print("╠══════════════════════════════════════╣")
    print(f"║  Fixtures guardados   : {len(fixtures):<14}║")
    print(f"║  Equipos únicos       : {len(teams):<14}║")
    print(f"║  Partidos con odds    : {odds_count:<14}║")
    print(f"║  Predicciones BSD     : {pred_count:<14}║")
    print(f"║  Stats de equipos     : {teams_count:<14}║")
    print(f"║  Archivos en data/raw : {raw_files:<14}║")
    print("╚══════════════════════════════════════╝\n")


if __name__ == "__main__":
    main()
