"""Web fonts for the Journal page (Aloha's artboard, 23 September 2026).

Her Journal artboard uses cuts the site did not carry yet:
    Junicode Cond / SemiCond SemiBold   the headline tickers and the section nav
    Noto Sans Mono Condensed Bold       the ticker kickers ("01 / NOW OPEN")
    Noto Sans Mono Medium / SemiBold    the strapline and kickers (normal width)

Built from the Brand Assets originals (BRANDING/Typography/FONT), subset to
exactly the characters the site's existing Junicode / Noto files carry, so
every voice covers the same text. The Junicode cuts are instanced from the
variable original (ENLA pinned at 0, as in assets/ha-junicode.woff2). All
SIL OFL.

    uv run --with fonttools --with brotli python scripts/make-journal-fonts.py
"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path.home() / "Documents/Shopify - Ivan/Website Development/BRANDING/Typography/FONT"
ASSETS = ROOT / "assets"


def codepoints(woff2):
    return sorted(TTFont(ASSETS / woff2).getBestCmap().keys())


def build(src, out, unicodes, axes=None):
    font = TTFont(src, lazy=False)
    opts = subset.Options()
    opts.flavor = "woff2"
    # default layout features only: "*" keeps Junicode's medieval alternates and
    # makes the file seven times larger
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=unicodes)
    sub.subset(font)
    if axes:  # after subsetting: the instancer then only walks the kept glyphs
        font = instancer.instantiateVariableFont(font, axes)
    font.flavor = "woff2"
    font.save(ASSETS / out)
    print(f"{out}  {(ASSETS / out).stat().st_size // 1024} KB")


junicode = codepoints("ha-junicode.woff2")
noto = codepoints("ha-noto-mono-cond.woff2")
# Two static cuts, not the variable width axis: the axis triples the file
# (149 KB) for two uses. Cond 400 (wdth 75) and SemiCond 600 (wdth 87.5).
vf = FONTS / "Junicode/VAR/JunicodeVF-Roman.ttf"
build(vf, "ha-junicode-cond.woff2", junicode, axes={"wght": 400, "wdth": 75, "ENLA": 0})
build(vf, "ha-junicode-semicond-semibold.woff2", junicode, axes={"wght": 600, "wdth": 87.5, "ENLA": 0})
# The Register page (Aloha, 24 September, "Hartwick_The_Register [Recovered]"):
# the words on her envelope photograph — "Read." / "By invitation." in
# Junicode Italic Condensed, THE REGISTER in Junicode Cond Medium.
build(vf, "ha-junicode-cond-medium.woff2", junicode, axes={"wght": 500, "wdth": 75, "ENLA": 0})
vfi = FONTS / "Junicode/VAR/JunicodeVF-Italic.ttf"
build(vfi, "ha-junicode-cond-italic.woff2", codepoints("ha-junicode-italic.woff2"), axes={"wght": 400, "wdth": 75, "ENLA": 0})
mono = FONTS / "NOTO SANS MONO/Untitled folder"
build(mono / "NotoSansMono_Condensed-Bold.ttf", "ha-noto-mono-cond-bold.woff2", noto)
build(mono / "NotoSansMono-Medium.ttf", "ha-noto-mono-medium.woff2", noto)
build(mono / "NotoSansMono-SemiBold.ttf", "ha-noto-mono-semibold.woff2", noto)
