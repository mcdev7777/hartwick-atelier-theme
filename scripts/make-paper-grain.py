"""Seamless paper-grain tile for Hartwick Atelier (Aloha, 22 September 2026).

Writes assets/ha-paper-grain.avif and assets/ha-paper-grain.webp.

Generated, not photographed: no third-party texture, nothing to license. It is
matched to the two references Aloha sent (the Nicci K. site and the plain paper
sheet), but none of their pixels are used.

What makes those references read as PAPER rather than as noise is relief: a
dense felt of short fibres lit from one side, each with a highlight and a
shadow. Plain noise at the same contrast reads as speckle or TV static (the
first two versions of this tile did exactly that). So the tile is a height
field of short fibres at every angle, plus a fine tooth and soft clumps, and
what is drawn is how it catches a raking light from the upper left, with a
little of the fibres' own lightness mixed in.

Strength is calibrated: at opacity CALIBRATED_AT the grain on the page
ground has the same contrast as the references (about 5% luminance, standard
deviation of the detail finer than 24 px, measured on both, light and dark
areas alike). The theme's default strengths are set from that number. Run with
--measure to print it per ground.

Every component is white noise filtered in the frequency domain, so the tile is
periodic by construction: its right edge continues its left, its bottom its top.

Output is opaque greyscale centred on 50% grey. The theme lays it over the page
with mix-blend-mode: hard-light, where 50% grey is neutral, darker pixels
multiply (the grain on light grounds) and lighter pixels screen (the fibres that
keep the grain visible on the wine and peat fields). CSS opacity scales it.

    python3 -m venv /tmp/v && /tmp/v/bin/pip install numpy pillow
    /tmp/v/bin/python scripts/make-paper-grain.py [--measure]
"""
import os, sys
import numpy as np
from PIL import Image

N = 512
CALIBRATED_AT = 0.40     # opacity at which the page ground matches the references
REFERENCE_STD = 0.050    # measured on both references, light and dark areas alike
rng = np.random.default_rng(20260922)
fy = np.fft.fftfreq(N)[:, None]; fx = np.fft.fftfreq(N)[None, :]


def blur(a, s):
    H = np.exp(-2 * np.pi ** 2 * ((fx * s) ** 2 + (fy * s) ** 2))
    return np.real(np.fft.ifft2(np.fft.fft2(a) * H))


def field(sx, sy=None, theta=0.0):
    """white noise through a (possibly elongated, rotated) gaussian, periodic"""
    sy = sx if sy is None else sy
    c, s = np.cos(theta), np.sin(theta)
    u = fx * c + fy * s; v = -fx * s + fy * c
    H = np.exp(-2 * (np.pi ** 2) * ((u * sx) ** 2 + (v * sy) ** 2))
    f = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((N, N))) * H))
    return (f - f.mean()) / f.std()


# Felted fibres: short elongated ridges at twelve angles, only their crests kept.
h = np.zeros((N, N))
for th in np.linspace(0, np.pi, 12, endpoint=False):
    h += np.clip(field(0.65, 0.32, th + rng.uniform(-0.15, 0.15)) - 0.5, 0, None)
h = (h - h.mean()) / h.std()
h = h + 0.7 * field(0.4) + 0.3 * field(1.8)        # fine tooth, soft clumps

# Raking light from the upper left: the height field's slope, taken periodically.
F = np.fft.fft2(h)
dx = np.real(np.fft.ifft2(F * (2j * np.pi * fx)))
dy = np.real(np.fft.ifft2(F * (2j * np.pi * fy)))
shade = -(dx + dy)
sig = 0.85 * shade / shade.std() - 0.4 * h / h.std()   # relief, fibres a shade lighter
sig += 0.25 * rng.standard_normal((N, N))
sig = (sig - sig.mean()) / sig.std() * 0.05

# sparse dark inclusions, wrapped so they cross the seam cleanly
yy, xx = np.mgrid[0:N, 0:N]
for _ in range(18):
    cy, cx = rng.uniform(0, N, 2); r = rng.uniform(0.45, 0.9); depth = rng.uniform(0.08, 0.14)
    dy = (yy - cy + N / 2) % N - N / 2; dx = (xx - cx + N / 2) % N - N / 2
    sig -= depth * np.exp(-(dx * dx + dy * dy) / (2 * r * r))
sig -= sig.mean()


def composite(grey, ground, opacity):
    hl = np.where(grey < 0.5, ground * 2 * grey, 1 - (1 - ground) * (1 - (2 * grey - 1)))
    return ground * (1 - opacity) + hl * opacity


def detail_std(c):
    return (c - blur(c, 24)).std()


# Scale the tile so the page ground (#F2EFE9) matches the references at CALIBRATED_AT.
ground = 239 / 255
lo, hi = 0.2, 20.0
for _ in range(40):
    k = (lo + hi) / 2
    grey = np.clip(0.5 + sig * k, 0, 1)
    if detail_std(composite(grey, ground, CALIBRATED_AT)) < REFERENCE_STD: lo = k
    else: hi = k
grey = np.clip(0.5 + sig * k, 0, 1)
tile = Image.fromarray(np.round(grey * 255).astype(np.uint8)).convert('RGB')

if '--measure' in sys.argv:
    for name, g in [('page ground', 239), ('wine', 61), ('peat', 41), ('mid photo', 128)]:
        row = ' '.join(f'{o:.2f}:{detail_std(composite(grey, g / 255, o)):.3f}' for o in (0.25, 0.4, 0.55, 0.7, 1.0))
        print(f'{name:12s} {row}   (reference {REFERENCE_STD})')

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
tile.save(os.path.join(out, 'ha-paper-grain.webp'), quality=60, method=6)
tile.save(os.path.join(out, 'ha-paper-grain.avif'), quality=40, speed=2)
for f in ('ha-paper-grain.avif', 'ha-paper-grain.webp'):
    print(f, os.path.getsize(os.path.join(out, f)), 'bytes')
