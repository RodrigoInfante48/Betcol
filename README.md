# Betcol 🏆 — Modelo predictivo Mundial 2026

![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)
![License](https://img.shields.io/badge/licencia-MIT-green)
![Status](https://img.shields.io/badge/estado-en%20desarrollo-yellow)

---

## ¿Qué es?

**Betcol** es un sistema de predicción de partidos de fútbol orientado al Mundial 2026.
Combina un modelo de Poisson bivariado con ratings ELO adaptados a selecciones nacionales
para estimar probabilidades de resultado y detectar **value bets** — apuestas donde la
probabilidad real supera a la implícita en las cuotas del mercado.

El proyecto consume datos de la **BSD API** (Bzzoiro Sports Data, gratuita y sin límites
de tasa) y expone los resultados mediante un dashboard interactivo en Streamlit.

---

## Stack

| Capa | Tecnología |
|---|---|
| Datos | BSD API (Bzzoiro Sports Data) — gratuita |
| Almacenamiento | CSV / JSON (raw) → CSV (processed) |
| Modelado | Python · scipy · pandas · scikit-learn |
| Visualización | Streamlit · matplotlib · seaborn |
| Calidad | pytest · black |

---

## Modelo

El núcleo del sistema combina dos enfoques complementarios:

- **Poisson bivariado**: modela los goles de cada equipo como variables de Poisson
  independientes con parámetros λ ajustados por fuerza atacante, fuerza defensiva y
  ventaja de local. Permite calcular la distribución exacta de resultados posibles.

- **ELO adaptado a selecciones**: rating dinámico que actualiza la fuerza relativa de cada
  selección tras cada partido usando un factor K calibrado para torneos internacionales
  (K=40 por defecto). Se usa para ajustar los parámetros Poisson en partidos sin historial
  reciente.

La combinación produce probabilidades para victoria local, empate y victoria visitante,
que se comparan con las cuotas del mercado para detectar value bets con un edge mínimo
configurable (por defecto 5 %).

---

## Setup rápido

```bash
git clone https://github.com/RodrigoInfante48/Betcol.git
cd Betcol
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Editar .env y poner tu BSD_API_KEY (obtener en https://sports.bzzoiro.com)
python ingesta/test_connection.py
```

Si la última línea imprime `✓ Sprint 0 completado. Conexión BSD API operativa.` el entorno
está listo.

---

## Roadmap

| Sprint | Objetivo | Estado |
|--------|----------|--------|
| **Sprint 0** | Setup del entorno, estructura del proyecto, validación de conexión BSD API | ✅ Completado |
| **Sprint 1** | Ingesta histórica: descargar partidos de selecciones y guardar en `data/raw/` | ✅ Completado |
| **Sprint 2** | Feature engineering: calcular ratings ELO y parámetros Poisson por selección | ✅ Completado |
| **Sprint 3** | Modelo predictivo: generar distribución de resultados y probabilidades | ✅ Completado |
| **Sprint 4** | Detección de value bets y dashboard Streamlit con predicciones Mundial 2026 | ✅ Completado |

---

## Uso

### Generar datos base

```bash
python scripts/generate_wc2026_data.py   # fixtures, odds, stats sintéticas
python features/build_features.py        # features_master.csv + elo_ratings.csv
```

### Predicción de partido individual

```bash
python modelo/predict.py "Colombia" "Argentina"
```

### Detectar value bets

```bash
python modelo/value_bets.py
# Genera: data/processed/value_bets.csv
#         data/processed/full_analysis.csv
```

### Dashboard interactivo

```bash
streamlit run dashboard/app.py
```

### Ejecutar todos los tests

```bash
pytest tests/ -v
```

---

## Disclaimer

> Este proyecto es de uso **exclusivamente educativo y de investigación**.  
> No constituye asesoramiento financiero ni de apuestas.  
> El uso de cualquier predicción generada por este sistema es responsabilidad exclusiva del usuario.  
> Las apuestas deportivas pueden estar reguladas o prohibidas en tu jurisdicción.
