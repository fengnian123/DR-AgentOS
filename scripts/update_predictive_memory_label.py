"""Rename the first-inspection axis without rasterizing the source figure."""

from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ByteStringObject, ContentStream, NameObject


ROOT = Path(__file__).resolve().parents[1]
FIGURE = ROOT / "figures" / "predictive-memory.pdf"
TEMP = FIGURE.with_suffix(".tmp.pdf")


def main() -> None:
    reader = PdfReader(FIGURE)
    page = reader.pages[0]
    content = ContentStream(page["/Contents"], reader)
    replacements = 0
    for operands, operator in content.operations:
        if operator != b"TJ" or not operands or not operands[0]:
            continue
        text = str(operands[0][0])
        if text in {"First-Go SR (%)", "First-Inspection SR (%)"}:
            # The embedded Type-0 font expects two-byte character codes.
            operands[0][0] = ByteStringObject(
                "First-Inspection SR (%)".encode("utf-16-be")
            )
            replacements += 1
    if replacements != 1:
        raise RuntimeError(f"Expected one first-inspection axis, found {replacements}")

    page[NameObject("/Contents")] = content
    writer = PdfWriter()
    writer.add_page(page)
    with TEMP.open("wb") as stream:
        writer.write(stream)
    TEMP.replace(FIGURE)


if __name__ == "__main__":
    main()
