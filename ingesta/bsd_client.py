"""Cliente HTTP para la BSD API (Bzzoiro Sports Data)."""

import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")


class BSDClient:
    """Cliente base para interactuar con la BSD API."""

    def __init__(self) -> None:
        """Inicializa el cliente leyendo credenciales del .env."""
        self.api_key: str = os.environ.get("BSD_API_KEY", "")
        self.base_url: str = os.environ.get("BSD_BASE_URL", "https://sports.bzzoiro.com/api").rstrip("/")

        if not self.api_key or self.api_key == "your_api_key_here":
            logger.warning("BSD_API_KEY no configurada. Copiar .env.example a .env y añadir la clave.")

        self._session = requests.Session()
        self._session.headers.update({"Authorization": f"Token {self.api_key}"})

    def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """Realiza GET contra un endpoint de la BSD API.

        Args:
            endpoint: Ruta relativa (p.ej. '/leagues/').
            params: Query params opcionales.

        Returns:
            Respuesta JSON deserializada.

        Raises:
            requests.HTTPError: Para respuestas 4xx/5xx.
        """
        url = f"{self.base_url}{endpoint}"
        logger.info("GET %s  params=%s", url, params)
        response = self._session.get(url, params=params, timeout=15)
        response.raise_for_status()
        return response.json()

    def ping(self) -> bool:
        """Verifica conectividad llamando a /api/leagues/.

        Returns:
            True si la API responde con éxito.
        """
        try:
            self._get("/leagues/")
            logger.info("ping OK")
            return True
        except requests.HTTPError as exc:
            logger.error("ping falló con HTTP %s: %s", exc.response.status_code, exc)
            return False
        except requests.RequestException as exc:
            logger.error("ping falló (error de red): %s", exc)
            return False

    def get_leagues(self) -> List[Dict[str, Any]]:
        """Obtiene la lista de ligas disponibles en la BSD API.

        Returns:
            Lista de objetos liga tal como los devuelve la API.
        """
        data = self._get("/leagues/")
        if isinstance(data, list):
            return data
        return data.get("results", data.get("data", []))

    def get_events(
        self,
        league_id: Optional[int] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        season: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Obtiene partidos/eventos de la BSD API.

        Args:
            league_id: ID de liga para filtrar.
            date_from: Fecha inicio en formato YYYY-MM-DD.
            date_to: Fecha fin en formato YYYY-MM-DD.
            season: Temporada (p.ej. '2026').

        Returns:
            Lista de eventos.
        """
        params: Dict[str, Any] = {}
        if league_id is not None:
            params["league"] = league_id
        if date_from:
            params["date_from"] = date_from
        if date_to:
            params["date_to"] = date_to
        if season:
            params["season"] = season

        data = self._get("/events/", params=params or None)
        if isinstance(data, list):
            return data
        return data.get("results", data.get("data", []))

    def get_predictions(self, event_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """Obtiene predicciones de la BSD API.

        Args:
            event_id: ID del evento para filtrar predicciones.

        Returns:
            Lista de predicciones.
        """
        params: Dict[str, Any] = {}
        if event_id is not None:
            params["event"] = event_id

        data = self._get("/predictions/", params=params or None)
        if isinstance(data, list):
            return data
        return data.get("results", data.get("data", []))
