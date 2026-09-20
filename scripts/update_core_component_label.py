"""Rename the first-inspection metric in the vector ablation figure."""

from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
FIGURE = ROOT / "figures" / "core_component_ablation.pdf"
TEMP = FIGURE.with_suffix(".tmp.pdf")


def main() -> None:
    document = fitz.open(FIGURE)
    page = document[0]
    matches = page.search_for("First-Go") or page.search_for("First-Inspection")
    if len(matches) != 1:
        raise RuntimeError(f"Expected one first-inspection label, found {len(matches)}")

    old_label = matches[0]
    page.add_redact_annot(old_label + (-1, -1, 1, 0), fill=(1, 1, 1))
    for match in page.search_for("SR"):
        if match.x0 < 150 and match.y0 > 165:
            page.add_redact_annot(match + (-1, -1, 1, 1), fill=(1, 1, 1))
    page.apply_redactions()

    replacement = "First-Inspection"
    font_file = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
    font_name = "MetricBold"
    page.insert_font(fontname=font_name, fontfile=font_file)
    font = fitz.Font(fontfile=font_file)
    text_width = font.text_length(replacement, fontsize=9.0)
    center_x = 92
    page.insert_text(
        (center_x - text_width / 2, 173),
        replacement,
        fontname=font_name,
        fontfile=font_file,
        fontsize=9.0,
        color=(0.12, 0.16, 0.18),
    )
    metric = "SR ↑"
    metric_width = font.text_length(metric, fontsize=9.0)
    page.insert_text(
        (center_x - metric_width / 2, 182),
        metric,
        fontname=font_name,
        fontfile=font_file,
        fontsize=9.0,
        color=(0.12, 0.16, 0.18),
    )

    document.save(TEMP, garbage=4, deflate=True)
    document.close()
    TEMP.replace(FIGURE)


if __name__ == "__main__":
    main()
