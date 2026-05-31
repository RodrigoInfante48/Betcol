"""Tabla de value bets con estilos para el dashboard Betcol."""

import pandas as pd
import streamlit as st


def _edge_color(val: float) -> str:
    if val >= 0.10:
        return "background-color: #bbf7d0; color: #14532d"
    if val >= 0.05:
        return "background-color: #fef9c3; color: #713f12"
    return ""


def _ev_color(val) -> str:
    if val is None or pd.isna(val):
        return ""
    return "background-color: #bbf7d0; color: #14532d" if val > 0 else "background-color: #fecaca; color: #7f1d1d"


def render_value_table(value_bets_df: pd.DataFrame) -> None:
    """Renderiza la tabla de value bets con colores y formatos claros."""
    if value_bets_df is None or len(value_bets_df) == 0:
        st.info("No se encontraron value bets con los filtros actuales.")
        return

    display = value_bets_df.copy()
    mkt_es = {"home": "Local", "draw": "Empate", "away": "Visitante"}
    display["Apuesta"] = display["best_bet"].map(mkt_es).fillna(display["best_bet"])
    display["EV"] = display["best_ev"].apply(
        lambda x: f"+{x*100:.1f}%" if pd.notna(x) and x >= 0 else f"{x*100:.1f}%" if pd.notna(x) else "N/A"
    )
    display["Kelly"] = display["best_kelly"].apply(
        lambda x: f"{x*100:.1f}% bankroll" if pd.notna(x) else "N/A"
    )
    display["Edge"] = display["edge_best"].apply(
        lambda x: f"{x*100:.1f}%" if pd.notna(x) else "N/A"
    )
    display["Odd"] = display["odd_best"].apply(
        lambda x: f"{x:.2f}" if pd.notna(x) else "N/A"
    )
    display["Prob modelo"] = display["prob_modelo_best"].apply(
        lambda x: f"{x*100:.1f}%" if pd.notna(x) else "N/A"
    )
    display["Prob implícita"] = display["implied_prob_best"].apply(
        lambda x: f"{x*100:.1f}%" if pd.notna(x) else "N/A"
    )
    display["Fecha"] = pd.to_datetime(
        display["event_date"], errors="coerce"
    ).dt.strftime("%d/%m/%Y")

    cols = ["match_label", "Fecha", "Apuesta", "Odd", "Prob modelo",
            "Prob implícita", "Edge", "EV", "Kelly"]
    rename = {"match_label": "Partido"}

    st.dataframe(
        display[cols].rename(columns=rename),
        use_container_width=True,
        hide_index=True,
    )
