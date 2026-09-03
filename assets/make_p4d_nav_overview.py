"""Generate the vector overview figure used by the P4D-Nav manuscript."""

from __future__ import annotations

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch, Rectangle


NAVY = "#18324A"
BLUE = "#4E79C7"
LIGHT_BLUE = "#EAF2FB"
TEAL = "#3F9C93"
LIGHT_TEAL = "#E8F6F3"
ORANGE = "#DF8C48"
LIGHT_ORANGE = "#FCF1E7"
RED = "#C95858"
LIGHT_RED = "#FBEDED"
GRAY = "#667786"
LIGHT_GRAY = "#F5F7F9"


def rounded(ax, xy, width, height, face, edge, radius=0.018, lw=1.3):
    patch = FancyBboxPatch(
        xy,
        width,
        height,
        boxstyle=f"round,pad=0.008,rounding_size={radius}",
        facecolor=face,
        edgecolor=edge,
        linewidth=lw,
    )
    ax.add_patch(patch)
    return patch


def arrow(ax, start, end, color=NAVY, lw=1.6, style="-|>"):
    ax.add_patch(
        FancyArrowPatch(
            start,
            end,
            arrowstyle=style,
            mutation_scale=11,
            linewidth=lw,
            color=color,
            shrinkA=2,
            shrinkB=2,
        )
    )


def room(ax, x, y, label, prob, color):
    rounded(ax, (x, y), 0.105, 0.105, "white", color, radius=0.012, lw=1.1)
    ax.add_patch(Rectangle((x + 0.014, y + 0.024), 0.030, 0.036,
                           facecolor=color, edgecolor=color, alpha=0.25))
    ax.add_patch(Rectangle((x + 0.053, y + 0.024), 0.038, 0.052,
                           facecolor=color, edgecolor=color, alpha=0.48))
    ax.text(x + 0.0525, y + 0.084, label, ha="center", va="center",
            fontsize=7.2, color=NAVY, weight="semibold")
    ax.text(x + 0.0525, y + 0.010, prob, ha="center", va="bottom",
            fontsize=6.8, color=GRAY)


def main():
    plt.rcParams.update({
        "font.family": "DejaVu Sans",
        "font.size": 8,
        "axes.linewidth": 0,
    })
    fig, ax = plt.subplots(figsize=(14.0, 3.45))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    xs = [0.015, 0.263, 0.511, 0.759]
    ws = [0.218] * 4
    colors = [(LIGHT_BLUE, BLUE), (LIGHT_ORANGE, ORANGE),
              (LIGHT_TEAL, TEAL), (LIGHT_RED, RED)]
    titles = [
        "1  Causal 4D Memory",
        "2  Predictive Belief",
        "3  Belief-Guided Route",
        "4  Observe, Update, Replan",
    ]
    subtitles = [
        "What was observed, when, and with what evidence",
        "Is the last state still valid? If not, where next?",
        "Choose the best success--cost trade-off",
        "Turn positive and negative views into new belief",
    ]

    for x, w, (face, edge), title, subtitle in zip(xs, ws, colors, titles, subtitles):
        rounded(ax, (x, 0.12), w, 0.80, face, edge, radius=0.020, lw=1.45)
        ax.text(x + 0.014, 0.865, title, ha="left", va="center",
                fontsize=10.2, color=NAVY, weight="bold")
        ax.text(x + 0.014, 0.805, subtitle, ha="left", va="center",
                fontsize=6.7, color=GRAY)

    # Panel 1: observed history and hidden transition.
    ax.plot([0.050, 0.197], [0.535, 0.535], color=GRAY, lw=1.2)
    events = [(0.057, 0.535, BLUE, "Mon\n08:10", "Kitchen"),
              (0.111, 0.535, BLUE, "Mon\n21:40", "Desk"),
              (0.165, 0.535, ORANGE, "Tue\n07:55", "?")]
    for x, y, c, t, loc in events:
        ax.add_patch(Circle((x, y), 0.014, facecolor="white", edgecolor=c, lw=1.5))
        ax.text(x, y + 0.072, t, ha="center", va="center", fontsize=6.4, color=GRAY)
        ax.text(x, y - 0.071, loc, ha="center", va="center", fontsize=6.8,
                color=NAVY, weight="semibold")
    ax.text(0.111, 0.702, "last positive view", ha="center", fontsize=7.2,
            color=BLUE, weight="semibold")
    ax.text(0.165, 0.405, "hidden change", ha="center", fontsize=7.1,
            color=ORANGE, style="italic")
    rounded(ax, (0.050, 0.225), 0.147, 0.085, "white", BLUE, radius=0.012, lw=1.0)
    ax.text(0.1235, 0.268, "entity ID + state versions + provenance",
            ha="center", va="center", fontsize=6.7, color=NAVY)

    # Panel 2: persistence/relocation decomposition.
    rounded(ax, (0.292, 0.640), 0.162, 0.078, "white", ORANGE, radius=0.012, lw=1.1)
    ax.text(0.373, 0.679, r"$\rho=P(\mathrm{stay}\mid H_o,t_q)$",
            ha="center", va="center", fontsize=8.5, color=NAVY)
    arrow(ax, (0.373, 0.635), (0.373, 0.578), color=ORANGE, lw=1.2)
    room(ax, 0.283, 0.405, "Last seen", r"$b=0.18$", ORANGE)
    room(ax, 0.397, 0.405, "Relocate", r"$b=0.82$", ORANGE)
    bars = [(0.299, 0.257, 0.028, 0.055), (0.339, 0.257, 0.028, 0.120),
            (0.379, 0.257, 0.028, 0.080), (0.419, 0.257, 0.028, 0.035)]
    for i, (x, y, w, h) in enumerate(bars):
        ax.add_patch(Rectangle((x, y), w, h, facecolor=ORANGE,
                               edgecolor=ORANGE, alpha=0.45 + 0.12 * i))
    ax.text(0.373, 0.215, "candidate-state distribution", ha="center",
            fontsize=6.9, color=GRAY)

    # Panel 3: route over candidate viewpoints.
    nodes = [(0.552, 0.340, "A", "0.18"), (0.606, 0.610, "B", "0.51"),
             (0.683, 0.430, "C", "0.24"), (0.704, 0.686, "D", "0.07")]
    start = (0.548, 0.690)
    ax.add_patch(Circle(start, 0.018, facecolor=NAVY, edgecolor="white", lw=1.0))
    ax.text(start[0], start[1] - 0.050, "agent", ha="center", fontsize=6.8, color=NAVY)
    for x, y, label, prob in nodes:
        ax.add_patch(Circle((x, y), 0.026, facecolor="white", edgecolor=TEAL, lw=1.4))
        ax.text(x, y + 0.002, label, ha="center", va="center", fontsize=7.8,
                color=NAVY, weight="bold")
        ax.text(x, y - 0.047, prob, ha="center", fontsize=6.6, color=GRAY)
    arrow(ax, start, (0.596, 0.617), color=TEAL, lw=2.4)
    arrow(ax, (0.620, 0.602), (0.677, 0.448), color=TEAL, lw=1.7)
    ax.plot([0.552, 0.683], [0.340, 0.430], ls="--", color="#A7B5BE", lw=1.0)
    ax.plot([0.606, 0.704], [0.610, 0.686], ls="--", color="#A7B5BE", lw=1.0)
    rounded(ax, (0.546, 0.205), 0.148, 0.075, "white", TEAL, radius=0.012, lw=1.0)
    ax.text(0.620, 0.243, r"utility $=$ hit prob. $-$ travel cost",
            ha="center", va="center", fontsize=6.8, color=NAVY)

    # Panel 4: failed inspection and posterior rerouting.
    rounded(ax, (0.793, 0.605), 0.150, 0.102, "white", RED, radius=0.012, lw=1.1)
    ax.text(0.868, 0.673, "Inspect B", ha="center", fontsize=8.0,
            color=NAVY, weight="bold")
    ax.text(0.868, 0.633, "target not seen; coverage = 0.91",
            ha="center", fontsize=6.6, color=GRAY)
    arrow(ax, (0.868, 0.598), (0.868, 0.535), color=RED, lw=1.4)
    rounded(ax, (0.793, 0.425), 0.150, 0.090, "white", RED, radius=0.012, lw=1.1)
    ax.text(0.868, 0.480, r"$b^{+}(s)\propto b^{-}(s)P(z\mid s)$",
            ha="center", fontsize=8.1, color=NAVY)
    ax.text(0.868, 0.447, "visibility-aware negative evidence",
            ha="center", fontsize=6.6, color=GRAY)
    arrow(ax, (0.868, 0.415), (0.868, 0.348), color=RED, lw=1.4)
    rounded(ax, (0.793, 0.226), 0.150, 0.101, "white", RED, radius=0.012, lw=1.1)
    ax.text(0.868, 0.287, "Posterior: C becomes first", ha="center",
            fontsize=7.7, color=NAVY, weight="semibold")
    ax.text(0.868, 0.251, r"write evidence $\rightarrow$ replan", ha="center",
            fontsize=6.8, color=GRAY)

    # Inter-panel arrows and behavior labels.
    for x in [0.238, 0.486, 0.734]:
        arrow(ax, (x, 0.515), (x + 0.020, 0.515), color=NAVY, lw=1.7)
    ax.text(0.124, 0.065, "RECALL", ha="center", color=BLUE, fontsize=8.0, weight="bold")
    ax.text(0.372, 0.065, "PREDICT", ha="center", color=ORANGE, fontsize=8.0, weight="bold")
    ax.text(0.620, 0.065, "ACT", ha="center", color=TEAL, fontsize=8.0, weight="bold")
    ax.text(0.868, 0.065, "VERIFY", ha="center", color=RED, fontsize=8.0, weight="bold")

    fig.savefig("figures/p4d_nav_overview.pdf", bbox_inches="tight", pad_inches=0.02)
    fig.savefig("figures/p4d_nav_overview.png", dpi=220, bbox_inches="tight", pad_inches=0.02)
    plt.close(fig)


if __name__ == "__main__":
    main()
