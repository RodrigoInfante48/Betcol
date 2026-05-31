"""Dashboard Streamlit principal de Betcol — Mundial 2026."""

import sys
from datetime import date
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st

from dashboard.components.head_to_head import render_head_to_head
from dashboard.components.match_card import render_match_card
from dashboard.components.scoreline import render_scoreline_chart
from dashboard.components.value_table import render_value_table
from modelo.value_bets import ValueBetDetector

_PROC = _ROOT / "data" / "processed"

st.set_page_config(
    page_title="Betcol — Mundial 2026",
    page_icon="⚽",
    layout="wide",
)

# ── Carga de datos ─────────────────────────────────────────────────────────────


@st.cache_data
def load_predictions() -> pd.DataFrame:
    return pd.read_csv(_PROC / "predictions_all.csv")


@st.cache_data
def load_features() -> pd.DataFrame:
    return pd.read_csv(_PROC / "features_master.csv")


@st.cache_data
def load_value_bets() -> pd.DataFrame:
    path = _PROC / "value_bets.csv"
    if path.exists():
        return pd.read_csv(path)
    pred = load_predictions()
    feat = load_features()
    det = ValueBetDetector(pred, feat)
    return det.find_all_value_bets()


@st.cache_data
def load_full_analysis() -> pd.DataFrame:
    path = _PROC / "full_analysis.csv"
    if path.exists():
        return pd.read_csv(path)
    pred = load_predictions()
    feat = load_features()
    det = ValueBetDetector(pred, feat)
    return det.get_full_analysis()


@st.cache_data
def load_teams_stats() -> pd.DataFrame:
    return pd.read_csv(_PROC / "teams_stats.csv")


@st.cache_resource
def get_poisson_model():
    from modelo.poisson import BivariatePoisson
    teams = pd.read_csv(_PROC / "teams_stats.csv")
    return BivariatePoisson(teams)


# ── Sidebar ────────────────────────────────────────────────────────────────────

with st.sidebar:
    st.title("BETCOL ⚽")
    st.caption("Modelo predictivo Mundial 2026")
    st.divider()

    page = st.radio(
        "Navegar:",
        ["🏆 Predicciones", "💰 Value Bets", "🔍 Análisis por partido", "⚔️ Head-to-Head"],
    )

    st.divider()
    st.markdown("**Modelo ensemble**")
    st.markdown("Poisson 45% | ELO 30% | BSD 25%")
    st.markdown("**Partidos analizados:** 50")
    st.markdown(f"**Actualizado:** {date.today().strftime('%d/%m/%Y')}")


# ── Página 1: Predicciones ────────────────────────────────────────────────────

def page_predictions() -> None:
    st.title("🏆 Predicciones — Fase de Grupos")

    predictions = load_predictions()

    all_teams = sorted(
        set(predictions["home_team"].tolist() + predictions["away_team"].tolist())
    )
    cf1, cf2, cf3 = st.columns([2, 2, 2])
    with cf1:
        team_filter = st.multiselect("Filtrar por equipo:", all_teams)
    with cf2:
        sort_by = st.selectbox(
            "Ordenar por:",
            ["Fecha", "Confianza del modelo", "Favorito más claro"],
        )
    with cf3:
        min_conf = st.slider("Confianza mínima:", 0, 100, 0, step=5) / 100

    df = predictions.copy()

    if team_filter:
        df = df[
            df["home_team"].isin(team_filter) | df["away_team"].isin(team_filter)
        ]

    df = df[df["confidence"] >= min_conf]

    if sort_by == "Confianza del modelo":
        df = df.sort_values("confidence", ascending=False)
    elif sort_by == "Favorito más claro":
        df["_max_prob"] = df[["prob_home", "prob_draw", "prob_away"]].max(axis=1)
        df = df.sort_values("_max_prob", ascending=False)
        df = df.drop(columns=["_max_prob"])
    else:
        df = df.sort_values("event_date")

    df["Partido"] = df["home_team"] + " vs " + df["away_team"]
    df["Fecha"] = pd.to_datetime(df["event_date"], errors="coerce").dt.strftime("%d/%m/%Y")
    df["Favorito"] = df.apply(
        lambda r: r["home_team"] if r["predicted_winner"] == "home"
        else (r["away_team"] if r["predicted_winner"] == "away" else "Empate"),
        axis=1,
    )
    df["P(local) %"] = (df["prob_home"] * 100).round(1)
    df["P(empate) %"] = (df["prob_draw"] * 100).round(1)
    df["P(visitante) %"] = (df["prob_away"] * 100).round(1)
    df["Confianza %"] = (df["confidence"] * 100).round(1)
    df["λ local"] = df["poisson_lambda_home"].round(2)
    df["λ visit."] = df["poisson_lambda_away"].round(2)
    df["Marcador prob."] = df["poisson_most_likely_score"]

    display_cols = [
        "Partido", "Fecha", "Favorito",
        "P(local) %", "P(empate) %", "P(visitante) %",
        "Marcador prob.", "Confianza %", "λ local", "λ visit.",
    ]

    def _conf_color(val):
        if val >= 60:
            return "background-color:#bbf7d0;color:#14532d"
        if val >= 40:
            return "background-color:#fef9c3;color:#713f12"
        return "background-color:#fecaca;color:#7f1d1d"

    def _prob_color(val):
        if val >= 50:
            return "background-color:#bbf7d0;color:#14532d"
        if val >= 35:
            return "background-color:#fef9c3;color:#713f12"
        return "color:#6b7280"

    styled = (
        df[display_cols]
        .style
        .applymap(_conf_color, subset=["Confianza %"])
        .applymap(_prob_color, subset=["P(local) %", "P(visitante) %"])
    )

    st.dataframe(styled, use_container_width=True, hide_index=True)
    st.caption(f"Mostrando {len(df)} de 50 partidos")


# ── Página 2: Value Bets ──────────────────────────────────────────────────────

def page_value_bets() -> None:
    st.title("💰 Value Bets Detectadas")

    vb = load_value_bets()

    m1, m2, m3, m4 = st.columns(4)
    if len(vb) > 0:
        top_row = vb.iloc[0]
        avg_edge = vb["edge_best"].mean()
        max_kelly_row = vb.loc[vb["best_kelly"].idxmax()]
        m1.metric("Value bets encontradas", len(vb))
        m2.metric(
            "Mayor EV",
            f"+{top_row['best_ev']*100:.1f}%",
            delta=top_row["match_label"],
        )
        m3.metric(
            "Mayor Kelly",
            f"{max_kelly_row['best_kelly']*100:.1f}%",
            delta=max_kelly_row["match_label"],
        )
        m4.metric("Edge promedio", f"{avg_edge*100:.1f}%")
    else:
        m1.metric("Value bets encontradas", 0)
        m2.metric("Mayor EV", "N/A")
        m3.metric("Mayor Kelly", "N/A")
        m4.metric("Edge promedio", "N/A")

    st.divider()

    fc1, fc2, fc3 = st.columns(3)
    with fc1:
        min_edge_pct = st.slider("Edge mínimo (%):", 0, 20, 5)
    with fc2:
        min_ev_pct = st.slider("EV mínimo (%):", 0, 30, 0)
    with fc3:
        mkt_filter = st.selectbox(
            "Mercado:", ["Todos", "Local", "Empate", "Visitante"]
        )

    filtered = vb.copy()
    if len(filtered) > 0:
        filtered = filtered[filtered["edge_best"] >= min_edge_pct / 100]
        filtered = filtered[filtered["best_ev"] >= min_ev_pct / 100]
        if mkt_filter != "Todos":
            mkt_map = {"Local": "home", "Empate": "draw", "Visitante": "away"}
            filtered = filtered[filtered["best_bet"] == mkt_map[mkt_filter]]

    render_value_table(filtered)

    st.divider()
    st.info(
        "**¿Qué es un value bet?** Una apuesta tiene valor cuando tu estimación de "
        "probabilidad es mayor a la del bookmaker. El Kelly % indica qué fracción del "
        "bankroll apostar según el criterio matemático de Kelly."
    )


# ── Página 3: Análisis por partido ────────────────────────────────────────────

def page_analysis() -> None:
    st.title("🔍 Análisis detallado")

    predictions = load_predictions()
    features = load_features()
    full = load_full_analysis()

    match_labels = (predictions["home_team"] + " vs " + predictions["away_team"]).tolist()
    selected = st.selectbox("Seleccionar partido:", match_labels)

    pred_row = predictions[
        (predictions["home_team"] + " vs " + predictions["away_team"]) == selected
    ].iloc[0]
    feat_row = features[
        features["event_id"] == pred_row["event_id"]
    ].iloc[0]

    home_team = pred_row["home_team"]
    away_team = pred_row["away_team"]

    st.markdown(
        f"### {home_team} vs {away_team}  "
        f"— {pd.to_datetime(pred_row['event_date'], errors='coerce').strftime('%d/%m/%Y')}"
    )

    col1, col2, col3 = st.columns(3)

    # ── COL 1: Gráfico de probabilidades por fuente ──────────────────────────
    with col1:
        st.markdown("**Probabilidades por fuente**")

        sources = {
            "Ensemble": [pred_row["prob_home"], pred_row["prob_draw"], pred_row["prob_away"]],
            "ELO": [feat_row["elo_prob_home"], feat_row["elo_prob_draw"], feat_row["elo_prob_away"]],
            "BSD": [
                feat_row["bsd_prob_home"] / 100,
                feat_row["bsd_prob_draw"] / 100,
                feat_row["bsd_prob_away"] / 100,
            ],
        }

        try:
            poisson_model = get_poisson_model()
            p_res = poisson_model.predict_match(home_team, away_team)
            sources["Poisson"] = [
                p_res["prob_home_win"], p_res["prob_draw"], p_res["prob_away_win"]
            ]
        except Exception:
            pass

        outcomes = ["Local", "Empate", "Visitante"]
        source_names = list(sources.keys())
        n_sources = len(source_names)
        x = range(len(outcomes))
        width = 0.8 / n_sources

        fig, ax = plt.subplots(figsize=(5, 3.5))
        colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
        for i, (src, probs) in enumerate(sources.items()):
            offset = (i - n_sources / 2 + 0.5) * width
            bars = ax.bar(
                [xi + offset for xi in x],
                [p * 100 for p in probs],
                width=width * 0.9,
                label=src,
                color=colors[i % len(colors)],
                alpha=0.85,
            )
        ax.set_xticks(list(x))
        ax.set_xticklabels(outcomes, fontsize=9)
        ax.set_ylabel("Probabilidad (%)", fontsize=8)
        ax.legend(fontsize=7)
        ax.set_ylim(0, 100)
        ax.tick_params(labelsize=8)
        fig.tight_layout()
        st.pyplot(fig)
        plt.close(fig)

    # ── COL 2: Top marcadores ─────────────────────────────────────────────────
    with col2:
        st.markdown("**Top marcadores (Poisson)**")
        try:
            poisson_model = get_poisson_model()
            p_res = poisson_model.predict_match(home_team, away_team)
            top5 = p_res["top_5_scores"]
            render_scoreline_chart(top5)
            st.markdown("| Marcador | Prob | Odds justa |")
            st.markdown("|---|---|---|")
            for i, s in enumerate(top5):
                bold_open = "**" if i == 0 else ""
                bold_close = "**" if i == 0 else ""
                oj = f"{1/s['prob']:.2f}" if s["prob"] > 0 else "∞"
                st.markdown(
                    f"| {bold_open}{s['score']}{bold_close} "
                    f"| {bold_open}{s['prob']*100:.1f}%{bold_close} "
                    f"| {bold_open}{oj}{bold_close} |"
                )
        except Exception as e:
            st.warning(f"No se pudo calcular marcadores: {e}")

    # ── COL 3: Value analysis por mercado ─────────────────────────────────────
    with col3:
        st.markdown("**Análisis de value por mercado**")

        match_analysis = full[full["event_id"] == pred_row["event_id"]]
        best_ev_idx = None
        best_ev_val = None

        if len(match_analysis) > 0:
            ev_vals = match_analysis[match_analysis["ev"].notna()]["ev"]
            if len(ev_vals) > 0 and ev_vals.max() > 0:
                best_ev_idx = ev_vals.idxmax()
                best_ev_val = ev_vals.max()

        mkt_labels = {"home": "🏠 Local", "draw": "🤝 Empate", "away": "✈️ Visitante"}

        for mkt in ["home", "draw", "away"]:
            row_m = match_analysis[match_analysis["market"] == mkt]
            if len(row_m) == 0:
                continue
            row_m = row_m.iloc[0]

            is_best = best_ev_idx is not None and row_m.name == best_ev_idx
            badge = " 🟢" if is_best else ""
            ev = row_m["ev"]
            edge = row_m["edge"]
            ev_str = f"{ev*100:+.1f}%" if pd.notna(ev) else "N/A"
            edge_str = f"{edge*100:+.1f}%" if pd.notna(edge) else "N/A"
            odd_str = f"{row_m['odd_bookmaker']:.2f}" if pd.notna(row_m["odd_bookmaker"]) else "N/A"
            kelly_str = f"{row_m['kelly_pct']*100:.1f}% del bankroll" if pd.notna(row_m["kelly_pct"]) else "N/A"
            edge_color = "green" if edge > 0 else "red"

            st.markdown(f"**{mkt_labels[mkt]}{badge}**")
            st.markdown(
                f"Odd: `{odd_str}`  "
                f"Prob modelo: `{row_m['prob_modelo']*100:.1f}%`  "
                f"Prob implícita: `{row_m['implied_prob']*100:.1f}%`"
            )
            st.markdown(
                f"Edge: <span style='color:{edge_color}'>`{edge_str}`</span>  "
                f"EV: `{ev_str}`  Kelly: `{kelly_str}`",
                unsafe_allow_html=True,
            )
            st.divider()


# ── Enrutador ──────────────────────────────────────────────────────────────────

if page == "🏆 Predicciones":
    page_predictions()
elif page == "💰 Value Bets":
    page_value_bets()
elif page == "🔍 Análisis por partido":
    page_analysis()
else:
    render_head_to_head(
        teams_stats_df=load_teams_stats(),
        predictions_df=load_predictions(),
        value_bets_df=load_value_bets(),
        features_df=load_features(),
    )
