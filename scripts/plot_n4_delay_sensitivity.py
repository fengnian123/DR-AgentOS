"""Render the N4 decision-delay results as a three-panel vector figure."""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt


DELAYS = (0, 1, 2, 4, 8)
METRICS = (
    (
        "Dynamic SR (%)",
        (65.2, 65.0, 64.7, 64.9, 64.1),
        (3.5, 1.8, 1.7, 1.7, 2.3),
        "#008D9A",
        (40, 50, 60, 70, 80),
        (40, 80),
    ),
    (
        "Online Recovery SR (%)",
        (58.9, 58.4, 58.1, 57.3, 57.5),
        (6.2, 4.3, 4.1, 4.0, 3.3),
        "#607D8B",
        (40, 50, 60, 70, 80),
        (40, 80),
    ),
    (
        "Completion time (s)",
        (66.2, 70.0, 77.5, 92.3, 121.6),
        (3.7, 3.7, 3.8, 3.9, 3.8),
        "#B78038",
        (60, 80, 100, 120),
        (55, 133),
    ),
)


def main():
    plt.rcParams.update(
        {
            "font.family": "serif",
            "font.serif": ["Nimbus Roman", "Liberation Serif", "DejaVu Serif"],
            "font.size": 8,
            "axes.labelcolor": "#253342",
            "xtick.color": "#253342",
            "ytick.color": "#253342",
            "pdf.fonttype": 42,
        }
    )
    figure, axes = plt.subplots(1, 3, figsize=(5.5, 1.23))
    figure.subplots_adjust(left=0.072, right=0.995, bottom=0.28, top=0.86, wspace=0.38)
    figure.supxlabel("Decision delay (s)", y=0.025, fontsize=8)
    for axis, (label, means, errors, color, ticks, limits) in zip(axes, METRICS):
        axis.set_ylabel(label, fontsize=7.2, labelpad=2)
        axis.errorbar(
            DELAYS, means, yerr=errors, color=color, marker="o",
            markersize=2.8, linewidth=1.15, elinewidth=0.75, capsize=2,
        )
        axis.set_xlim(-0.35, 8.35)
        axis.set_ylim(*limits)
        axis.set_xticks(DELAYS)
        axis.set_yticks(ticks)
        axis.tick_params(length=2, width=0.5, pad=2)
        axis.set_axisbelow(True)
        axis.grid(axis="y", color="#D7E0E5", linewidth=0.55)
        for spine in ("top", "right"):
            axis.spines[spine].set_visible(False)
        for spine in ("bottom", "left"):
            axis.spines[spine].set(color="#8D9BA5", linewidth=0.55)

    output = Path(__file__).resolve().parents[1] / "figures" / "n4_delay_sensitivity.pdf"
    figure.savefig(output, metadata={"CreationDate": None, "ModDate": None})


if __name__ == "__main__":
    main()
