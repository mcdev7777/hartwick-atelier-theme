"""Aloha's paper sheet as a seamless tile (her homepage artboard, 23 September 2026).

Writes assets/ha-paper-sheet.avif and assets/ha-paper-sheet.webp.

Aloha's remade homepage (Downloads/Asset 1.pdf) lays a photograph of paper over
the whole page as "an example of the paper texture that can go across our
website": the 1024 x 1536 image stretched to 1444 x 5042 (1.41x across, 3.28x
down), Normal blend, 22% opacity. This script takes that same image out of her
PDF and turns it into the site's texture tile:

  1. the top 1024 x 768 of the sheet;
  2. its periodic component (Moisan's periodic-plus-smooth decomposition),
     so the right edge continues the left and the bottom the top — no seam;
  3. the slow variations (lighting, vignette, anything over ~180 px) removed,
     so the tile is even and the repeat does not show;
  4. greyscale centred on 50% grey for the theme's hard-light blend, the
     page colours underneath untouched (her 22% Normal layer also tinted
     everything toward the photo's grey-beige; she asked for #f3f0e7 to
     show, so the tint is left out);
  5. scaled so that at 22% opacity the grain has the same contrast as her
     22% layer (measured on her rendered PDF: 0.0089 luminance std of the
     detail finer than 24 px).

The theme then shows it at her placement: 1444 x 2519 CSS px per tile.

    python3 -m venv /tmp/v && /tmp/v/bin/pip install numpy pillow pymupdf
    /tmp/v/bin/python scripts/make-paper-sheet.py ~/Downloads/"Asset 1.pdf"
"""
import io, os, sys
import numpy as np
import fitz
from PIL import Image

pdf = fitz.open(sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/Downloads/Asset 1.pdf'))
page = pdf[0]
# the texture is the only image that covers the full width of the page
xref = next(x[0] for x in page.get_images(full=True)
            if any(r.width > 1400 and r.height > 4000 for r in page.get_image_rects(x[0])))
src = Image.open(io.BytesIO(pdf.extract_image(xref)['image'])).convert('L')
u = np.asarray(src, float)[:768, :] / 255
M, N = u.shape

# periodic + smooth decomposition
v = np.zeros_like(u)
v[0, :] += u[-1, :] - u[0, :]; v[-1, :] += u[0, :] - u[-1, :]
v[:, 0] += u[:, -1] - u[:, 0]; v[:, -1] += u[:, 0] - u[:, -1]
q = np.arange(M)[:, None]; r = np.arange(N)[None, :]
den = 2 * np.cos(2 * np.pi * q / M) + 2 * np.cos(2 * np.pi * r / N) - 4; den[0, 0] = 1
S = np.fft.fft2(v) / den; S[0, 0] = 0
p = u - np.real(np.fft.ifft2(S))

# remove the slow variations
fy = np.fft.fftfreq(M)[:, None]; fx = np.fft.fftfreq(N)[None, :]
low = np.real(np.fft.ifft2(np.fft.fft2(p) * np.exp(-2 * np.pi ** 2 * ((fx * 180) ** 2 + (fy * 180) ** 2))))
d = p - low

# 0.94 = the page ground's lightness; 1.8 = hard-light's light side is weak on a light
# ground, so the tile carries more contrast to land on her 22% at the slider's 22%.
grey = np.clip(0.5 + d / (2 * 0.94) * 1.8, 0, 1)
tile = Image.fromarray(np.round(grey * 255).astype(np.uint8)).convert('RGB')

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
tile.save(os.path.join(out, 'ha-paper-sheet.webp'), quality=60, method=6)
tile.save(os.path.join(out, 'ha-paper-sheet.avif'), quality=50, speed=2)
for f in ('ha-paper-sheet.avif', 'ha-paper-sheet.webp'):
    print(f, os.path.getsize(os.path.join(out, f)), 'bytes')
