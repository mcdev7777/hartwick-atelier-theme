"""Pencil marks for links and buttons (Aloha, 23 September 2026).

Cuts four marks out of Aloha's reference sheet (`_overview.png`, 1920 x 1280,
from "Temp Files", 23 Sep) and writes them as alpha masks the theme colours
with CSS (`mask-image` + `background: currentColor`), so the grain of her
pencil line survives and a mark takes the colour of the text it sits beside:

    assets/ha-mark-arrow.svg   the straight pencil arrow she circled (sheet 1),
                               shortened: her note says it must keep the old
                               arrow's size "and isn't too long", so the shaft
                               is cut and the head kept whole
    assets/ha-mark-oval.svg    the double oval that replaces the small corner
                               mark (sheet 2)
    assets/ha-mark-ring-1.svg  the flat ring with the loose inner stroke,
                               "option no.1" (sheet 3)
    assets/ha-mark-ring-2.svg  the tilted ring, the second of her two (sheet 3)

Nothing is redrawn: every pixel is hers. Ink becomes opacity; the paper
becomes transparent.

    uv run --with pillow --with numpy python scripts/make-pencil-marks.py "<path to _overview.png>"
"""
import base64
import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image

PAPER = 248.0   # the sheet's ground, (250, 248, 244)
INK = 55.0      # the darkest pencil
FLOOR = 0.07    # alpha below this is paper grain, not line
PAD = 3

# Ink bounding boxes on the 1920 x 1280 sheet (measured).
BOXES = {
    "oval": (23, 733, 297, 867),
    "ring-1": (980, 762, 1257, 838),
    "ring-2": (1303, 743, 1577, 857),
}
ARROW = (344, 466, 617, 492)
ARROW_SHAFT = 84          # px of shaft kept from the tail
ARROW_HEAD_FROM = 584     # x where the head's barbs begin


def alpha_of(rgb):
    lum = rgb.astype(float).mean(axis=2)
    a = np.clip((PAPER - lum) / (PAPER - INK), 0, 1)
    a[a < FLOOR] = 0
    return a


def save(a, name, out):
    """Written as SVG around the PNG, not as a PNG: Shopify's CDN re-encodes
    a PNG asset to lossy AVIF for browsers that accept it, and the noise in
    its alpha shows as a faint box round every mark. SVG is served as is."""
    h, w = a.shape
    W, H = w + 2 * PAD, h + 2 * PAD
    img = np.zeros((H, W, 4), dtype=np.uint8)
    img[PAD:PAD + h, PAD:PAD + w, 3] = (a * 255).round().astype(np.uint8)
    buf = io.BytesIO()
    Image.fromarray(img, "RGBA").save(buf, "PNG", optimize=True)
    data = base64.b64encode(buf.getvalue()).decode()
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" preserveAspectRatio="none">'
           f'<image width="{W}" height="{H}" preserveAspectRatio="none" href="data:image/png;base64,{data}"/></svg>\n')
    (out / f"ha-mark-{name}.svg").write_text(svg)
    print(f"ha-mark-{name}.svg  {W} x {H}")


def main(sheet):
    rgb = np.asarray(Image.open(sheet).convert("RGB"))
    out = Path(__file__).resolve().parent.parent / "assets"
    for name, (x0, y0, x1, y1) in BOXES.items():
        save(alpha_of(rgb[y0:y1, x0:x1]), name, out)

    # Arrow: tail of the shaft + the whole head, joined where the pencil line
    # sits at the same height, so the cut does not show.
    x0, y0, x1, y1 = ARROW
    a = alpha_of(rgb[y0:y1, x0:x1])
    tail = a[:, :ARROW_SHAFT]
    head = a[:, ARROW_HEAD_FROM - x0:]
    save(np.concatenate([tail, head], axis=1), "arrow", out)


if __name__ == "__main__":
    main(sys.argv[1])
