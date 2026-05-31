"""Genera datos sintéticos realistas del Mundial 2026 para Sprint 1/2."""

import json
import random
from pathlib import Path
from itertools import combinations
import pandas as pd
import numpy as np

random.seed(42)
np.random.seed(42)

ROOT = Path(__file__).resolve().parent.parent
DATA_RAW = ROOT / "data" / "raw"
DATA_PROC = ROOT / "data" / "processed"
DATA_RAW.mkdir(parents=True, exist_ok=True)
DATA_PROC.mkdir(parents=True, exist_ok=True)

# ── 48 equipos en 12 grupos ──────────────────────────────────────────────────
GROUPS = {
    "A": ["USA", "Panama", "Ecuador", "Morocco"],
    "B": ["Mexico", "Honduras", "Bolivia", "South Korea"],
    "C": ["Argentina", "Canada", "Jamaica", "Ivory Coast"],
    "D": ["Spain", "Croatia", "Serbia", "Japan"],
    "E": ["Germany", "Colombia", "Nigeria", "Saudi Arabia"],
    "F": ["Brazil", "Chile", "New Zealand", "Peru"],
    "G": ["France", "Belgium", "Italy", "Algeria"],
    "H": ["Portugal", "Poland", "Denmark", "Turkey"],
    "I": ["Netherlands", "Uruguay", "Iran", "Senegal"],
    "J": ["England", "Czech Republic", "Hungary", "Cameroon"],
    "K": ["Austria", "Romania", "Scotland", "Qatar"],
    "L": ["Switzerland", "Sweden", "Ukraine", "Ghana"],
}

ALL_TEAMS = [t for teams in GROUPS.values() for t in teams]  # 48 teams

# ELO seeds para stats realistas
ELO_SEED = {
    "France": 2100, "Brazil": 2080, "England": 2050, "Spain": 2040,
    "Argentina": 2150, "Portugal": 2020,
    "Germany": 1980, "Netherlands": 1970, "Belgium": 1960, "Italy": 1950,
    "Croatia": 1930, "Uruguay": 1920, "Colombia": 1900, "Mexico": 1890,
    "USA": 1880, "Denmark": 1875, "Switzerland": 1870, "Austria": 1860,
    "Morocco": 1850, "Senegal": 1845,
    "Poland": 1820, "Serbia": 1810, "Japan": 1800, "South Korea": 1790,
    "Ecuador": 1780, "Peru": 1770, "Chile": 1760, "Algeria": 1750,
    "Nigeria": 1740, "Cameroon": 1730, "Saudi Arabia": 1720, "Iran": 1710,
    "Australia": 1700, "Czech Republic": 1695, "Hungary": 1690, "Scotland": 1680,
    "Turkey": 1670, "Romania": 1660,
    "Panama": 1630, "Honduras": 1620, "Bolivia": 1610, "Canada": 1605,
    "Jamaica": 1600, "Ivory Coast": 1590, "New Zealand": 1580, "Sweden": 1650,
    "Ukraine": 1640, "Ghana": 1560, "Qatar": 1550,
}


def _goals_for_team(team: str):
    elo = ELO_SEED.get(team, 1600)
    normalized = (elo - 1550) / (2150 - 1550)  # 0-1
    mean_goals = 0.8 + normalized * 1.4          # 0.8 a 2.2
    mean_conceded = 2.2 - normalized * 1.4       # 2.2 a 0.8
    return mean_goals, mean_conceded


def _sim_match(home: str, away: str):
    """Simula un resultado de partido basado en ELO."""
    hg_mean, _ = _goals_for_team(home)
    ag_mean, _ = _goals_for_team(away)
    home_adv = 0.15
    hg = max(0, int(round(np.random.poisson(hg_mean + home_adv))))
    ag = max(0, int(round(np.random.poisson(ag_mean))))
    return hg, ag


# ── Fixtures (50 partidos) ────────────────────────────────────────────────────
fixtures = []
event_id = 1001
dates = pd.date_range("2026-06-11", "2026-06-30", freq="12h")
date_idx = 0

venues = [
    "MetLife Stadium", "Rose Bowl", "AT&T Stadium", "Hard Rock Stadium",
    "SoFi Stadium", "Estadio Azteca", "BC Place", "BMO Field",
    "Lincoln Financial Field", "Lumen Field", "Gillette Stadium",
    "Mercedes-Benz Stadium",
]

# Tomar 50 partidos: todos los de grupos A-I (9 grupos × 6 = 54), tocar solo 50
match_list = []
for grp, teams in GROUPS.items():
    for h, a in combinations(teams, 2):
        match_list.append((grp, h, a))

# Quedarse con exactamente 50
match_list = match_list[:50]

for grp, home, away in match_list:
    fixtures.append({
        "event_id": event_id,
        "home_team": home,
        "away_team": away,
        "home_team_id": ALL_TEAMS.index(home) + 1,
        "away_team_id": ALL_TEAMS.index(away) + 1,
        "event_date": dates[date_idx % len(dates)].strftime("%Y-%m-%dT%H:%M:00"),
        "status": "scheduled",
        "stage": "group",
        "group": grp,
        "venue": venues[event_id % len(venues)],
    })
    event_id += 1
    date_idx += 1

fixtures_df = pd.DataFrame(fixtures)
fixtures_df.to_csv(DATA_PROC / "fixtures.csv", index=False)
with open(DATA_RAW / "fixtures_raw.json", "w") as f:
    json.dump(fixtures, f, indent=2)
print(f"✓ fixtures.csv → {len(fixtures_df)} filas")

# ── Teams stats (88 equipos) ──────────────────────────────────────────────────
teams_stats = []
for team_id, team in enumerate(ALL_TEAMS, 1):
    hg, hc = _goals_for_team(team)
    gp = random.randint(8, 15)
    total_gs = int(round(hg * gp * (0.85 + random.random() * 0.3)))
    total_gc = int(round(hc * gp * (0.85 + random.random() * 0.3)))
    wr_approx = (hg - hc + 1.5) / 3.0
    wins = max(1, int(round(wr_approx * gp)))
    losses = max(0, int(round((1 - wr_approx) * gp * 0.6)))
    draws = max(0, gp - wins - losses)
    clean = max(0, int(round((2.0 - hc) / 2.0 * gp * 0.4)))

    # last_5_form
    form_chars = []
    for _ in range(5):
        r = random.random()
        if r < wr_approx:
            form_chars.append("W")
        elif r < wr_approx + 0.25:
            form_chars.append("D")
        else:
            form_chars.append("L")

    teams_stats.append({
        "team_id": team_id,
        "team_name": team,
        "games_played": gp,
        "goals_scored": total_gs,
        "goals_conceded": total_gc,
        "goals_scored_avg": round(total_gs / gp, 3),
        "goals_conceded_avg": round(total_gc / gp, 3),
        "wins": wins,
        "draws": draws,
        "losses": losses,
        "win_rate": round(wins / gp, 3),
        "clean_sheets": clean,
        "last_5_form": "".join(form_chars),
    })

# Agregar 40 equipos extra para llegar a 88 (equipos que no clasificaron)
extra_teams = [
    "Venezuela", "Paraguay", "Costa Rica", "El Salvador", "Haiti",
    "Trinidad and Tobago", "Cuba", "Suriname", "Guyana", "Belize",
    "Egypt", "Tunisia", "Burkina Faso", "Mali", "Cape Verde",
    "Congo", "Zambia", "Angola", "Tanzania", "Mozambique",
    "Iraq", "Syria", "Jordan", "Lebanon", "Kuwait",
    "Bahrain", "Oman", "Kyrgyzstan", "Tajikistan", "Kazakhstan",
    "Turkmenistan", "India", "China", "Vietnam", "Thailand",
    "Myanmar", "Malaysia", "Philippines", "Indonesia", "Singapore",
][:40]

for i, team in enumerate(extra_teams, len(ALL_TEAMS) + 1):
    elo = 1500 + random.randint(-100, 100)
    hg = 1.0 + (elo - 1400) / 1000
    hc = 1.8 - (elo - 1400) / 1000
    gp = random.randint(6, 12)
    total_gs = max(0, int(round(hg * gp * (0.8 + random.random() * 0.4))))
    total_gc = max(0, int(round(hc * gp * (0.8 + random.random() * 0.4))))
    wins = max(0, int(round(0.35 * gp)))
    losses = max(0, int(round(0.45 * gp)))
    draws = max(0, gp - wins - losses)
    clean = max(0, int(round(0.15 * gp)))
    form_chars = [random.choice(["W", "W", "D", "L", "L"]) for _ in range(5)]
    teams_stats.append({
        "team_id": i,
        "team_name": team,
        "games_played": gp,
        "goals_scored": total_gs,
        "goals_conceded": total_gc,
        "goals_scored_avg": round(total_gs / gp, 3) if gp else 0.0,
        "goals_conceded_avg": round(total_gc / gp, 3) if gp else 0.0,
        "wins": wins,
        "draws": draws,
        "losses": losses,
        "win_rate": round(wins / gp, 3) if gp else 0.0,
        "clean_sheets": clean,
        "last_5_form": "".join(form_chars),
    })

teams_df = pd.DataFrame(teams_stats)
teams_df.to_csv(DATA_PROC / "teams_stats.csv", index=False)
print(f"✓ teams_stats.csv → {len(teams_df)} filas")

# ── Odds (50 partidos) ────────────────────────────────────────────────────────
odds_rows = []
for fix in fixtures:
    home, away = fix["home_team"], fix["away_team"]
    helo = ELO_SEED.get(home, 1600)
    aelo = ELO_SEED.get(away, 1600)
    diff = (helo - aelo) / 400

    p_home_true = 1 / (1 + 10 ** (-diff))
    p_away_true = 1 / (1 + 10 ** diff)
    draw_base = 0.28 - 0.18 * abs(p_home_true - 0.5)
    p_home_true = p_home_true * (1 - draw_base)
    p_away_true = p_away_true * (1 - draw_base)

    # Agregar margen del bookmaker (5-10%)
    margin = 0.05 + random.random() * 0.05
    p_home_bk = p_home_true * (1 + margin)
    p_draw_bk = draw_base * (1 + margin)
    p_away_bk = p_away_true * (1 + margin)

    odds_home = round(1 / p_home_bk, 2) if p_home_bk > 0 else None
    odds_draw = round(1 / p_draw_bk, 2) if p_draw_bk > 0 else None
    odds_away = round(1 / p_away_bk, 2) if p_away_bk > 0 else None

    total_inv = 1 / odds_home + 1 / odds_draw + 1 / odds_away
    odds_rows.append({
        "event_id": fix["event_id"],
        "odds_home": odds_home,
        "odds_draw": odds_draw,
        "odds_away": odds_away,
        "implied_prob_home": round((1 / odds_home) / total_inv, 4),
        "implied_prob_draw": round((1 / odds_draw) / total_inv, 4),
        "implied_prob_away": round((1 / odds_away) / total_inv, 4),
        "margin": round(total_inv - 1.0, 4),
    })

odds_df = pd.DataFrame(odds_rows)
odds_df.to_csv(DATA_PROC / "odds.csv", index=False)
print(f"✓ odds.csv → {len(odds_df)} filas")

# ── BSD Predictions (50 partidos) ─────────────────────────────────────────────
pred_rows = []
for fix in fixtures:
    home, away = fix["home_team"], fix["away_team"]
    helo = ELO_SEED.get(home, 1600)
    aelo = ELO_SEED.get(away, 1600)
    diff = (helo - aelo) / 400

    p_h = 1 / (1 + 10 ** (-diff))
    draw = 0.28 - 0.18 * abs(p_h - 0.5)
    p_h = p_h * (1 - draw)
    p_a = (1 - draw) - p_h
    total = p_h + draw + p_a
    p_h, draw, p_a = p_h / total, draw / total, p_a / total

    hg, _ = _goals_for_team(home)
    ag, _ = _goals_for_team(away)
    xg_home = round(hg + (helo - aelo) / 2000, 2)
    xg_away = round(ag - (helo - aelo) / 2000, 2)
    xg_home = max(0.3, xg_home)
    xg_away = max(0.3, xg_away)

    most_likely_h = int(np.random.poisson(xg_home))
    most_likely_a = int(np.random.poisson(xg_away))

    if p_h > draw and p_h > p_a:
        winner = "H"
    elif p_a > draw:
        winner = "A"
    else:
        winner = "D"

    pred_rows.append({
        "event_id": fix["event_id"],
        "bsd_prob_home": round(p_h * 100, 2),
        "bsd_prob_draw": round(draw * 100, 2),
        "bsd_prob_away": round(p_a * 100, 2),
        "bsd_xg_home": xg_home,
        "bsd_xg_away": xg_away,
        "bsd_most_likely_score": f"{most_likely_h}-{most_likely_a}",
        "bsd_confidence": round(max(p_h, draw, p_a) * 100, 1),
        "bsd_predicted_winner": winner,
    })

pred_df = pd.DataFrame(pred_rows)
pred_df.to_csv(DATA_PROC / "bsd_predictions.csv", index=False)
print(f"✓ bsd_predictions.csv → {len(pred_df)} filas")

# ── Raw JSON stubs ─────────────────────────────────────────────────────────────
for name, data in [
    ("leagues", [{"id": 1, "name": "FIFA World Cup 2026", "year": "2026", "season": "2026"}]),
    ("teams", [{"team_id": ALL_TEAMS.index(t) + 1, "team_name": t} for t in ALL_TEAMS]),
    ("teams_stats_raw", teams_stats),
    ("odds_raw", [{"event_id": r["event_id"], "odds": r} for r in odds_rows]),
    ("predictions_raw", [{"event_id": r["event_id"], "prediction": r} for r in pred_rows]),
]:
    with open(DATA_RAW / f"{name}.json", "w") as f:
        json.dump(data, f, indent=2)

print("✓ Raw JSONs generados")
print(f"\n=== Resumen ===")
print(f"Fixtures:    {len(fixtures_df)} partidos")
print(f"Teams stats: {len(teams_df)} equipos")
print(f"Odds:        {len(odds_df)} partidos")
print(f"Predictions: {len(pred_df)} partidos")
print(f"Equipos WC48: {len(ALL_TEAMS)}")
