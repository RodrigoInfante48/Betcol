#!/usr/bin/env python3
"""Valida la conexión con la BSD API y confirma que el entorno está operativo."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ingesta.bsd_client import BSDClient


def main() -> None:
    client = BSDClient()

    # 1. Ping
    print("Verificando conexión con BSD API...")
    if not client.ping():
        print(
            "\n[ERROR] No se pudo conectar a la BSD API.\n"
            "  • Asegúrate de haber copiado .env.example a .env\n"
            "  • Añade tu BSD_API_KEY en el archivo .env\n"
            "  • Comprueba tu conexión a internet"
        )
        sys.exit(1)

    print("  Conexión establecida correctamente.\n")

    # 2. Ligas disponibles
    leagues = client.get_leagues()
    print(f"Ligas disponibles en BSD API: {len(leagues)}")

    # 3. Buscar World Cup
    wc_league = None
    for league in leagues:
        name = league.get("name", "") or league.get("league", {}).get("name", "")
        if "world cup" in name.lower() or "mundial" in name.lower():
            wc_league = league
            break

    if wc_league:
        league_id = wc_league.get("id") or wc_league.get("league", {}).get("id")
        name = wc_league.get("name") or wc_league.get("league", {}).get("name")
        print(f"  Liga 'World Cup' encontrada → ID: {league_id}  ({name})")
    else:
        print("  Liga 'World Cup' no encontrada aún (puede no estar activa todavía).")

    print("\n✓ Sprint 0 completado. Conexión BSD API operativa.")


if __name__ == "__main__":
    main()
