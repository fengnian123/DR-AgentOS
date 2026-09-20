"""Align the evidence-update figure with the calibrated detector formulation."""

from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
FIGURE = ROOT / "figures" / "Agent_Evidence_Update.pdf"
TEMP = FIGURE.with_suffix(".tmp.pdf")


def centered_text(page: fitz.Page, rect: fitz.Rect, text: str, size: float,
                  font: str = "Times-Roman") -> None:
    width = fitz.get_text_length(text, fontname=font, fontsize=size)
    origin = (
        rect.x0 + (rect.width - width) / 2,
        rect.y0 + (rect.height + 0.7 * size) / 2,
    )
    result = page.insert_text(
        origin,
        text,
        fontname=font,
        fontsize=size,
        color=(0.33, 0.35, 0.36),
    )
    if result <= 0:
        raise RuntimeError(f"Replacement text did not fit: {text}")


def main() -> None:
    doc = fitz.open(FIGURE)
    page = doc[0]
    replacements = [
        ("Condition on visibility and reliability",
         "Calibrated detection likelihood", 16.0, "Times-Italic"),
        ("Reliable (c=0.95)", "View features", 11.0, "helv"),
        ("Visible (v=0.98)", "P(detect)=0.931", 11.0, "helv"),
    ]

    if page.search_for("P(detect)=0.931"):
        return

    pending = []
    for source, replacement, size, font in replacements:
        matches = page.search_for(source)
        if len(matches) != 1:
            raise RuntimeError(f"Expected one match for {source!r}, found {len(matches)}")
        rect = matches[0]
        page.add_redact_annot(rect + (-1, -1, 1, 1), fill=(1, 1, 1))
        pending.append((rect + (0, -1, 0, 2), replacement, size, font))
    page.apply_redactions()

    for rect, replacement, size, font in pending:
        centered_text(page, rect, replacement, size, font)

    doc.save(TEMP, garbage=4, deflate=True)
    doc.close()
    TEMP.replace(FIGURE)


if __name__ == "__main__":
    main()
