"""Tarjeta individual de partido para el dashboard Betcol."""

import streamlit as st


def render_match_card(match_data: dict) -> None:
    """Renderiza una tarjeta compacta de partido con probabilidades y marcador."""
    winner = match_data.get("predicted_winner", "draw")
    bg = {"home": "#dbeafe", "draw": "#f3f4f6", "away": "#ffedd5"}.get(winner, "#f3f4f6")

    home = match_data.get("home_team", "")
    away = match_data.get("away_team", "")
    ph = match_data.get("prob_home", 0)
    pd_ = match_data.get("prob_draw", 0)
    pa = match_data.get("prob_away", 0)
    score = match_data.get("poisson_most_likely_score", "?-?")
    conf = match_data.get("confidence", 0)

    with st.container():
        st.markdown(
            f"""<div style="background:{bg};border-radius:8px;padding:10px 14px;
            margin-bottom:8px;border:1px solid #e5e7eb;">
            <b>{home}</b> vs <b>{away}</b> &nbsp;|&nbsp;
            Marcador prob.: <b>{score}</b> &nbsp;|&nbsp;
            Confianza: <b>{conf*100:.1f}%</b>
            </div>""",
            unsafe_allow_html=True,
        )
        c1, c2, c3 = st.columns(3)
        c1.metric(f"🏠 {home}", f"{ph*100:.1f}%")
        c2.metric("🤝 Empate", f"{pd_*100:.1f}%")
        c3.metric(f"✈️ {away}", f"{pa*100:.1f}%")
