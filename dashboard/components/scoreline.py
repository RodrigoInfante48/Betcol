"""Visualización de probabilidad de marcadores para el dashboard Betcol."""

import matplotlib.pyplot as plt
import streamlit as st


def render_scoreline_chart(top_scores: list[dict]) -> None:
    """Gráfico de barras con los marcadores más probables del modelo Poisson.

    Args:
        top_scores: lista de {"score": "2-1", "prob": 0.15}
    """
    if not top_scores:
        st.info("Sin datos de marcadores.")
        return

    labels = [s["score"] for s in top_scores]
    probs = [s["prob"] * 100 for s in top_scores]
    max_idx = probs.index(max(probs))
    colors = ["#f97316" if i == max_idx else "#94a3b8" for i in range(len(labels))]

    fig, ax = plt.subplots(figsize=(5, 3))
    bars = ax.bar(labels, probs, color=colors, edgecolor="white", linewidth=0.5)

    for bar, prob in zip(bars, probs):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + 0.3,
            f"{prob:.1f}%",
            ha="center", va="bottom", fontsize=8,
        )

    ax.set_xlabel("Marcador", fontsize=9)
    ax.set_ylabel("Probabilidad (%)", fontsize=9)
    ax.set_title("Top marcadores (Poisson)", fontsize=10)
    ax.set_ylim(0, max(probs) * 1.3)
    ax.tick_params(labelsize=8)
    fig.tight_layout()

    st.pyplot(fig)
    plt.close(fig)
