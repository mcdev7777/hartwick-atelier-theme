#!/usr/bin/env python3
"""Assembles the four review mockups from shared fragments. Run: python3 build.py"""
import pathlib
HERE = pathlib.Path(__file__).parent

def header(active):
    items = [("Collection","collection"),("The Masters","masters"),("Journal","journal"),("The Register","register")]
    nav = "".join(f'<a class="{ "on" if k==active else "" }">{t}</a>' for t,k in items)
    return f'''<header class="header">
  <a class="header__mark"><img src="../../../../assets/ha-wordmark.svg" alt="Hartwick Atelier"></a>
  <nav class="header__nav">{nav}<a>Bag (0)</a></nav>
  <span class="header__burger">Menu</span>
</header>'''

def register(heading, body, cta="Join The Register"):
    return f'''<section class="section section--peat"><div class="wrap register">
  <div>
    <p class="eyebrow">The Register</p>
    <h2 class="display">{heading}</h2>
    <p class="body" style="margin-top:20px">{body}</p>
  </div>
  <div class="form">
    <div class="row">
      <label class="field"><span class="field__label meta">Email address</span><div class="field__input">you@example.com</div></label>
      <span class="btn">{cta}</span>
    </div>
    <label class="check"><i></i><span>[Consent line — wording from Christina] Yes, add me to The Register. I can leave at any time.</span></label>
  </div>
</div></section>'''

FOOTER = '''<footer class="footer">
  <div>
    <ul class="footer__links"><li>Instagram</li><li>Contact</li><li>The Register</li></ul>
    <ul class="footer__pol"><li>Privacy</li><li>Terms</li><li>Shipping</li><li>Refunds</li><li>Accessibility</li><li>Cookie preferences</li></ul>
  </div>
  <div class="footer__right">
    <img src="../../../../assets/ha-house-symbol-black.png" alt="">
    <span class="footer__copy">© 2026 Hartwick Atelier · Made by Masters</span>
  </div>
</footer>'''

def page(title, active, body, register_block):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="mock.css"></head>
<body>{header(active)}
<main>{body}
{register_block}</main>
{FOOTER}
</body></html>'''

pages = {}
exec((HERE/'pages.py').read_text(), {'pages': pages, 'register': register})
for name, (title, active, body, reg) in pages.items():
    (HERE/f'{name}.html').write_text(page(title, active, body, reg))
    print('wrote', name)
