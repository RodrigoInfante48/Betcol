"""Helpers para persistir y leer datos en data/raw/ y data/processed/."""

import json
import logging
from pathlib import Path
from typing import Any, Optional

import pandas as pd

logger = logging.getLogger(__name__)

_PROJECT_ROOT = Path(__file__).resolve().parent.parent


def get_data_path(subfolder: str) -> Path:
    """Retorna Path a data/<subfolder>, creando el directorio si no existe."""
    path = _PROJECT_ROOT / "data" / subfolder
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_json(data: Any, filename: str) -> Path:
    """Guarda data en data/raw/<filename>.json (sobreescribe si existe)."""
    dest = get_data_path("raw") / f"{filename}.json"
    if dest.exists():
        logger.info("Updated: %s", filename)
    dest.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    logger.info("Saved JSON → %s", dest)
    return dest


def load_json(filename: str) -> Optional[Any]:
    """Lee data/raw/<filename>.json; retorna None si no existe."""
    src = get_data_path("raw") / f"{filename}.json"
    if not src.exists():
        logger.warning("JSON no encontrado: %s", src)
        return None
    return json.loads(src.read_text(encoding="utf-8"))


def save_csv(df: pd.DataFrame, filename: str) -> Path:
    """Guarda DataFrame en data/processed/<filename>.csv."""
    dest = get_data_path("processed") / f"{filename}.csv"
    df.to_csv(dest, index=False, encoding="utf-8")
    logger.info("Saved CSV → %s", dest)
    return dest


def load_csv(filename: str) -> Optional[pd.DataFrame]:
    """Lee data/processed/<filename>.csv; retorna None si no existe."""
    src = get_data_path("processed") / f"{filename}.csv"
    if not src.exists():
        logger.warning("CSV no encontrado: %s", src)
        return None
    return pd.read_csv(src, encoding="utf-8")
