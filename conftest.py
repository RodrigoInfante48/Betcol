"""Configura el PYTHONPATH para que pytest encuentre los módulos del proyecto."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
