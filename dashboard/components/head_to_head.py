"""Head-to-Head comparador de equipos."""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st

_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from modelo.poisson import BivariatePoisson

FLAGS = {
    "Argentina": "🇦🇷", "France": "🇫🇷", "Brazil": "🇧🇷",
    "Spain": "🇪🇸", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Portugal": "🇵🇹",
    "Germany": "🇩🇪", "Netherlands": "🇳🇱", "Belgium": "🇧🇪",
    "Italy": "🇮🇹", "Croatia": "🇭🇷", "Uruguay": "🇺🇾",
    "Colombia": "🇨🇴", "Mexico": "🇲🇽", "USA": "🇺🇸",
    "Denmark": "🇩🇰", "Switzerland": "🇨🇭", "Austria": "🇦🇹",
    "Morocco": "🇲🇦", "Senegal": "🇸🇳", "Ecuador": "🇪🇨",
    "Chile": "🇨🇱", "Peru": "🇵🇪", "Japan": "🇯🇵",
    "South Korea": "🇰🇷", "Serbia": "🇷🇸", "Poland": "🇵🇱",
    "Turkey": "🇹🇷", "Nigeria": "🇳🇬", "Cameroon": "🇨🇲",
    "Saudi Arabia": "🇸🇦", "Iran": "🇮🇷", "Canada": "🇨🇦",
    "Panama": "🇵🇦", "Honduras": "🇭🇳", "Bolivia": "🇧🇴",
    "Jamaica": "🇯🇲", "Algeria": "🇩🇿", "Romania": "🇷🇴",
    "Hungary": "🇭🇺", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Qatar": "🇶🇦",
    "Sweden": "🇸🇪", "Ukraine": "🇺🇦", "Ghana": "🇬🇭",
    "Ivory Coast": "🇨🇮", "New Zealand": "🇳🇿", "Paraguay": "🇵🇾",
    "Costa Rica": "🇨🇷", "Czech Republic": "🇨🇿",
}


def _get_flag(team_name: str) -> str:
    return FLAGS.get(team_name, "🏳️")


def _parse_form(form_str: str) -> list:
    if not isinstance(form_str, str):
        return []
    return [x.strip() for x in str(form_str).split() if x.strip() in ("W", "D", "L")]


def _form_score(form_str) -> float:
    results = _parse_form(str(form_str) if form_str is not None else "")
    if not results:
        return 0.5
    score_map = {"W": 1.0, "D": 0.5, "L": 0.0}
    return sum(score_map.get(r, 0.5) for r in results) / len(results)


def _normalize_series(series: pd.Series) -> pd.Series:
    mn, mx = series.min(), series.max()
    if mx == mn:
        return pd.Series([0.5] * len(series), index=series.index)
    return (series - mn) / (mx - mn)


def _get_team_row(teams_df: pd.DataFrame, team_name: str):
    matches = teams_df[teams_df["team_name"] == team_name]
    return matches.iloc[0] if len(matches) > 0 else None


def _get_prediction(predictions_df: pd.DataFrame, team_a: str, team_b: str):
    mask_ab = (predictions_df["home_team"] == team_a) & (predictions_df["away_team"] == team_b)
    if mask_ab.any():
        row = predictions_df[mask_ab].iloc[0]
        return {
            "prob_home": float(row["prob_home"]),
            "prob_draw": float(row["prob_draw"]),
            "prob_away": float(row["prob_away"]),
            "most_likely_score": str(row.get("poisson_most_likely_score", "?-?")),
        }
    mask_ba = (predictions_df["home_team"] == team_b) & (predictions_df["away_team"] == team_a)
    if mask_ba.any():
        row = predictions_df[mask_ba].iloc[0]
        # Swap home/away so A is always "local" perspective
        return {
            "prob_home": float(row["prob_away"]),
            "prob_draw": float(row["prob_draw"]),
            "prob_away": float(row["prob_home"]),
            "most_likely_score": str(row.get("poisson_most_likely_score", "?-?")),
        }
    return None


def _get_value_bet(value_bets_df: pd.DataFrame, team_a: str, team_b: str):
    if value_bets_df is None or len(value_bets_df) == 0:
        return None
    label_col = "match_label" if "match_label" in value_bets_df.columns else None
    if label_col is None:
        return None
    for home, away in [(team_a, team_b), (team_b, team_a)]:
        mask = (
            value_bets_df[label_col].str.contains(home, na=False, regex=False)
            & value_bets_df[label_col].str.contains(away, na=False, regex=False)
        )
        if mask.any():
            return value_bets_df[mask].iloc[0]
    return None


def _render_form_badges(form_str: str) -> str:
    results = _parse_form(form_str)
    if not results:
        return "—"
    colors = {"W": "#16a34a", "D": "#ca8a04", "L": "#dc2626"}
    badges = [
        f'<span style="background-color:{colors.get(r,"#6b7280")};color:white;'
        f'padding:2px 8px;border-radius:5px;font-weight:bold;margin:2px;'
        f'font-size:13px;display:inline-block">{r}</span>'
        for r in results
    ]
    return " ".join(badges)


def _val_cell(value: str, winner: bool) -> str:
    if winner:
        return (
            f'<span style="background-color:#bbf7d0;color:#14532d;font-weight:bold;'
            f'padding:3px 10px;border-radius:6px;display:inline-block">{value}</span>'
        )
    return f'<span style="padding:3px 10px;display:inline-block">{value}</span>'


def render_head_to_head(
    teams_stats_df: pd.DataFrame,
    predictions_df: pd.DataFrame,
    value_bets_df: pd.DataFrame,
    features_df: pd.DataFrame,
) -> None:
    st.title("⚔️ Head-to-Head — Comparador de equipos")

    all_teams = sorted(teams_stats_df["team_name"].tolist())
    default_a = all_teams.index("Colombia") if "Colombia" in all_teams else 0
    default_b = all_teams.index("Argentina") if "Argentina" in all_teams else min(1, len(all_teams) - 1)

    col_sel_a, col_vs, col_sel_b = st.columns([5, 1, 5])
    with col_sel_a:
        team_a = st.selectbox("Equipo A (local):", all_teams, index=default_a, key="h2h_team_a")
    with col_vs:
        st.markdown(
            "<div style='text-align:center;margin-top:28px;font-size:22px;font-weight:bold'>vs</div>",
            unsafe_allow_html=True,
        )
    with col_sel_b:
        team_b = st.selectbox("Equipo B (visitante):", all_teams, index=default_b, key="h2h_team_b")

    if team_a == team_b:
        st.warning("Selecciona dos equipos distintos.")
        return

    row_a = _get_team_row(teams_stats_df, team_a)
    row_b = _get_team_row(teams_stats_df, team_b)
    if row_a is None or row_b is None:
        st.error("No se encontraron datos para uno de los equipos.")
        return

    # Build Poisson model for on-the-fly predictions
    poisson_model = BivariatePoisson(teams_stats_df)
    poisson_result = poisson_model.predict_match(team_a, team_b)

    ensemble_pred = _get_prediction(predictions_df, team_a, team_b)
    if ensemble_pred:
        prob_a = ensemble_pred["prob_home"]
        prob_d = ensemble_pred["prob_draw"]
        prob_b_val = ensemble_pred["prob_away"]
        score_probable = ensemble_pred["most_likely_score"]
        pred_source = "Ensemble"
        in_fixtures = True
    else:
        prob_a = poisson_result["prob_home_win"]
        prob_d = poisson_result["prob_draw"]
        prob_b_val = poisson_result["prob_away_win"]
        score_probable = poisson_result["most_likely_score"]
        pred_source = "Poisson (on-the-fly)"
        in_fixtures = False

    flag_a = _get_flag(team_a)
    flag_b = _get_flag(team_b)

    # ── SECCIÓN 1: Header del partido ────────────────────────────────────────
    st.divider()
    st.markdown(
        f"""
        <div style="text-align:center;padding:20px 0 8px 0">
            <span style="font-size:3rem">{flag_a}</span>
            <span style="font-size:2rem;font-weight:900;margin:0 18px">{team_a}</span>
            <span style="font-size:1.8rem;color:#6b7280">⚔️</span>
            <span style="font-size:2rem;font-weight:900;margin:0 18px">{team_b}</span>
            <span style="font-size:3rem">{flag_b}</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    badge_label = "📊 Partido en fixtures" if in_fixtures else "🧮 Calculado on-the-fly"
    st.markdown(
        f"""
        <div style="text-align:center;margin-bottom:10px">
            <span style="background:#dbeafe;color:#1e40af;padding:4px 14px;
                         border-radius:20px;font-size:13px">{badge_label} — {pred_source}</span>
        </div>
        <div style="text-align:center;font-size:1.1em;margin-bottom:4px">
            <b>Modelo:</b> {team_a} gana <b>{prob_a*100:.1f}%</b> &nbsp;|&nbsp;
            Empate <b>{prob_d*100:.1f}%</b> &nbsp;|&nbsp;
            {team_b} gana <b>{prob_b_val*100:.1f}%</b>
        </div>
        <div style="text-align:center;font-size:1em;color:#4b5563;margin-bottom:8px">
            Marcador más probable: <b>{score_probable}</b>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # ── SECCIÓN 2: Comparativa de stats ──────────────────────────────────────
    st.divider()
    st.markdown("### 📊 Comparativa de estadísticas")

    gp_a = int(row_a["games_played"])
    gp_b = int(row_b["games_played"])
    wins_a = int(row_a["wins"])
    wins_b = int(row_b["wins"])
    draws_a = int(row_a["draws"])
    draws_b = int(row_b["draws"])
    losses_a = int(row_a["losses"])
    losses_b = int(row_b["losses"])
    gs_a = int(row_a["goals_scored"])
    gs_b = int(row_b["goals_scored"])
    gs_avg_a = float(row_a["goals_scored_avg"])
    gs_avg_b = float(row_b["goals_scored_avg"])
    gc_a = int(row_a["goals_conceded"])
    gc_b = int(row_b["goals_conceded"])
    gc_avg_a = float(row_a["goals_conceded_avg"])
    gc_avg_b = float(row_b["goals_conceded_avg"])
    cs_a = int(row_a["clean_sheets"])
    cs_b = int(row_b["clean_sheets"])
    wr_a = float(row_a["win_rate"])
    wr_b = float(row_b["win_rate"])
    form_a = str(row_a.get("last_5_form", "")) if pd.notna(row_a.get("last_5_form")) else ""
    form_b = str(row_b.get("last_5_form", "")) if pd.notna(row_b.get("last_5_form")) else ""

    win_pct_a = f"{wins_a / gp_a * 100:.0f}%" if gp_a else "—"
    win_pct_b = f"{wins_b / gp_b * 100:.0f}%" if gp_b else "—"

    def _better(val_a, val_b, higher_is_better=True):
        if higher_is_better:
            return "A" if val_a > val_b else ("B" if val_b > val_a else "tie")
        return "A" if val_a < val_b else ("B" if val_b < val_a else "tie")

    stat_rows = [
        ("Partidos jugados", f"{gp_a}", f"{gp_b}", _better(gp_a, gp_b)),
        ("Victorias", f"{wins_a} ({win_pct_a})", f"{wins_b} ({win_pct_b})", _better(wins_a, wins_b)),
        ("Empates", f"{draws_a}", f"{draws_b}", _better(draws_a, draws_b)),
        ("Derrotas", f"{losses_a}", f"{losses_b}", _better(losses_a, losses_b, higher_is_better=False)),
        ("Goles anotados", f"{gs_a} ({gs_avg_a:.2f}/p)", f"{gs_b} ({gs_avg_b:.2f}/p)", _better(gs_avg_a, gs_avg_b)),
        ("Goles recibidos", f"{gc_a} ({gc_avg_a:.2f}/p)", f"{gc_b} ({gc_avg_b:.2f}/p)", _better(gc_avg_a, gc_avg_b, higher_is_better=False)),
        ("Porterías a cero", f"{cs_a}", f"{cs_b}", _better(cs_a, cs_b)),
        ("Win rate", f"{wr_a*100:.1f}%", f"{wr_b*100:.1f}%", _better(wr_a, wr_b)),
    ]

    hc1, hc2, hc3 = st.columns([3, 2, 2])
    hc1.markdown("**Métrica**")
    hc2.markdown(f"**{flag_a} {team_a}**")
    hc3.markdown(f"**{flag_b} {team_b}**")

    for metric, val_a, val_b, winner in stat_rows:
        c1, c2, c3 = st.columns([3, 2, 2])
        c1.markdown(metric)
        c2.markdown(_val_cell(val_a, winner == "A"), unsafe_allow_html=True)
        c3.markdown(_val_cell(val_b, winner == "B"), unsafe_allow_html=True)

    # Form row
    fc1, fc2, fc3 = st.columns([3, 2, 2])
    fc1.markdown("Forma reciente (últimos 5)")
    fc2.markdown(_render_form_badges(form_a), unsafe_allow_html=True)
    fc3.markdown(_render_form_badges(form_b), unsafe_allow_html=True)

    # ── SECCIÓN 3: Gráfico radar ──────────────────────────────────────────────
    st.divider()
    st.markdown("### 🕸️ Radar de rendimiento")

    # Normalize all 6 axes across the full 88-team dataset
    att_norm = _normalize_series(teams_stats_df["goals_scored_avg"])
    # Invert conceded so higher = better defense
    def_raw = teams_stats_df["goals_conceded_avg"].apply(lambda x: -float(x))
    def_norm = _normalize_series(def_raw)
    wr_norm = _normalize_series(teams_stats_df["win_rate"])
    gp_norm = _normalize_series(teams_stats_df["games_played"].astype(float))
    solidity_raw = teams_stats_df["clean_sheets"] / teams_stats_df["games_played"].clip(lower=1)
    sol_norm = _normalize_series(solidity_raw)
    form_scores = teams_stats_df["last_5_form"].apply(_form_score)
    form_norm = _normalize_series(form_scores)

    def _val_for(norm_series: pd.Series, team: str) -> float:
        idx = teams_stats_df[teams_stats_df["team_name"] == team].index
        return float(norm_series.loc[idx[0]]) if len(idx) > 0 else 0.5

    categories = ["Ataque", "Defensa", "Consistencia", "Forma", "Experiencia", "Solidez"]
    radar_a = [
        _val_for(att_norm, team_a),
        _val_for(def_norm, team_a),
        _val_for(wr_norm, team_a),
        _val_for(form_norm, team_a),
        _val_for(gp_norm, team_a),
        _val_for(sol_norm, team_a),
    ]
    radar_b = [
        _val_for(att_norm, team_b),
        _val_for(def_norm, team_b),
        _val_for(wr_norm, team_b),
        _val_for(form_norm, team_b),
        _val_for(gp_norm, team_b),
        _val_for(sol_norm, team_b),
    ]

    fig_radar = go.Figure()
    fig_radar.add_trace(go.Scatterpolar(
        r=radar_a + [radar_a[0]],
        theta=categories + [categories[0]],
        fill="toself",
        fillcolor="rgba(59,130,246,0.3)",
        line=dict(color="#3b82f6", width=2),
        name=f"{flag_a} {team_a}",
    ))
    fig_radar.add_trace(go.Scatterpolar(
        r=radar_b + [radar_b[0]],
        theta=categories + [categories[0]],
        fill="toself",
        fillcolor="rgba(249,115,22,0.3)",
        line=dict(color="#f97316", width=2),
        name=f"{flag_b} {team_b}",
    ))
    fig_radar.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 1])),
        showlegend=True,
        height=450,
        margin=dict(l=60, r=60, t=40, b=40),
    )
    st.plotly_chart(fig_radar, use_container_width=True)

    # ── SECCIÓN 4: Probabilidades visuales ───────────────────────────────────
    st.divider()
    st.markdown("### 🎯 Probabilidades del partido")

    odd_a = round(1 / prob_a, 2) if prob_a > 0 else 0.0
    odd_d = round(1 / prob_d, 2) if prob_d > 0 else 0.0
    odd_b = round(1 / prob_b_val, 2) if prob_b_val > 0 else 0.0

    p1, p2, p3 = st.columns(3)
    with p1:
        st.markdown(
            f"""
            <div style="text-align:center;background:#dbeafe;border-radius:12px;padding:20px 10px">
                <div style="font-size:0.9em;color:#1e40af;font-weight:700">🏠 LOCAL GANA</div>
                <div style="font-size:2.6em;font-weight:900;color:#1d4ed8">{prob_a*100:.1f}%</div>
                <div style="font-size:0.85em;color:#3b82f6">Odd justa: {odd_a:.2f}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with p2:
        st.markdown(
            f"""
            <div style="text-align:center;background:#fef9c3;border-radius:12px;padding:20px 10px">
                <div style="font-size:0.9em;color:#92400e;font-weight:700">🤝 EMPATE</div>
                <div style="font-size:2.6em;font-weight:900;color:#92400e">{prob_d*100:.1f}%</div>
                <div style="font-size:0.85em;color:#ca8a04">Odd justa: {odd_d:.2f}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with p3:
        st.markdown(
            f"""
            <div style="text-align:center;background:#fce7f3;border-radius:12px;padding:20px 10px">
                <div style="font-size:0.9em;color:#9d174d;font-weight:700">✈️ VISITANTE GANA</div>
                <div style="font-size:2.6em;font-weight:900;color:#be185d">{prob_b_val*100:.1f}%</div>
                <div style="font-size:0.85em;color:#db2777">Odd justa: {odd_b:.2f}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # Value bet banner
    vb = _get_value_bet(value_bets_df, team_a, team_b)
    if vb is not None:
        mkt_labels = {"home": "Local", "draw": "Empate", "away": "Visitante"}
        mkt = str(vb.get("best_bet", ""))
        mkt_label = mkt_labels.get(mkt, mkt)
        ev = float(vb.get("best_ev", 0))
        odd_vb = float(vb.get("odd_best", vb.get("best_odd", 0)))
        st.markdown(
            f"""
            <div style="background:#d1fae5;border:2px solid #10b981;border-radius:10px;
                        padding:12px 20px;margin-top:16px;text-align:center">
                ✅ <b>VALUE BET detectada:</b> apostar <b>{mkt_label}</b>
                @ odd <b>{odd_vb:.2f}</b> — EV: <b>+{ev*100:.1f}%</b>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # ── SECCIÓN 5: Marcadores probables ──────────────────────────────────────
    st.divider()
    st.markdown("### ⚽ Marcadores más probables")

    score_df = poisson_model.get_score_matrix_df(team_a, team_b, max_goals=5)
    all_scores = []
    for i in score_df.index:
        for j in score_df.columns:
            all_scores.append((f"{i}-{j}", float(score_df.loc[i, j])))
    all_scores.sort(key=lambda x: x[1], reverse=True)
    top_8 = all_scores[:8]

    top_score = top_8[0][0] if top_8 else None
    # Reverse so highest prob is at top of horizontal bar chart
    labels = [s[0] for s in reversed(top_8)]
    probs_pct = [s[1] * 100 for s in reversed(top_8)]
    bar_colors = ["#f97316" if s == top_score else "#3b82f6" for s in reversed([s[0] for s in top_8])]

    fig_bar = go.Figure(go.Bar(
        x=probs_pct,
        y=labels,
        orientation="h",
        marker_color=bar_colors,
        text=[f"{p:.1f}%" for p in probs_pct],
        textposition="outside",
    ))
    fig_bar.update_layout(
        xaxis_title="Probabilidad (%)",
        height=360,
        margin=dict(l=60, r=80, t=20, b=40),
        showlegend=False,
        xaxis=dict(range=[0, max(probs_pct) * 1.3 if probs_pct else 20]),
    )
    st.plotly_chart(fig_bar, use_container_width=True)
