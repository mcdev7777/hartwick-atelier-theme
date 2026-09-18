#!/usr/bin/env bash
# Hartwick — pull a page's full content off the old Squarespace site.
#
#   ./scripts/squarespace-pull.sh https://<built-in>.squarespace.com            # list pages, find Masters
#   ./scripts/squarespace-pull.sh https://<built-in>.squarespace.com /the-masters   # pull one page + images
#
# The built-in address is in Squarespace: Settings > Domains. Works when the site
# is Public (or Password-protected with the password switched off for the pull —
# a password-protected site needs the browser route instead). Nothing is written
# to Squarespace; this only reads.
set -euo pipefail
SITE="${1:?site URL, e.g. https://xxxx.squarespace.com}"; SITE="${SITE%/}"
PAGE="${2:-}"
OUT="docs/squarespace-export"; mkdir -p "$OUT"

if [ -z "$PAGE" ]; then
  echo "── pages on $SITE (from sitemap.xml)"
  curl -sS -L "$SITE/sitemap.xml" | grep -oE '<loc>[^<]+' | sed 's/<loc>//' | sed "s#^$SITE##" | sort | tee "$OUT/pages.txt"
  echo
  echo "── likely Masters pages:"
  grep -iE 'master|maker|artisan|craft|weav|people' "$OUT/pages.txt" || echo "   (none by name — read the list above and pick one)"
  echo
  echo "Next:  ./scripts/squarespace-pull.sh $SITE /<path>"
  exit 0
fi

SLUG=$(echo "$PAGE" | tr -c 'A-Za-z0-9\n' '-' | sed 's/^-*//; s/-*$//')
HTML="$OUT/$SLUG.html"
echo "── fetching $SITE$PAGE"
curl -sS -L "$SITE$PAGE" -o "$HTML"
python3 - "$HTML" "$OUT/$SLUG" "$SITE$PAGE" <<'PY'
# Squarespace 7.1 (Fluid Engine) renders page sections server-side, so the
# rendered HTML is the source; ?format=json only carries the page's metadata.
import re, sys, html, os, urllib.request
src, base, url = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf-8', errors='ignore').read()
title = html.unescape(re.sub(r'\s*[—|-]\s*[^—|-]*$', '', re.search(r'<title>([^<]*)', s).group(1))).strip() if re.search(r'<title>', s) else ''
main = s[s.find('<main'):s.find('</main>')] if '<main' in s else s
body = re.sub(r'<script.*?</script>|<style.*?</style>|<svg.*?</svg>|<noscript.*?</noscript>', '', main, flags=re.S)
# keep heading levels so the glossary structure survives
body = re.sub(r'<h([1-4])[^>]*>', lambda m: '\n' + '#' * (int(m.group(1)) + 1) + ' ', body)
body = re.sub(r'</h[1-4]>', '\n', body)
body = re.sub(r'<li[^>]*>', '\n- ', body)
body = re.sub(r'<(p|div|figcaption|br)[^>]*>', '\n', body)
text = html.unescape(re.sub(r'<[^>]+>', ' ', body))
lines = [re.sub(r'[ \t]+', ' ', l).strip() for l in text.split('\n')]
out, prev = [], ''
for l in lines:
    if not l or l == prev: continue
    out.append(l); prev = l
imgs = re.findall(r'(?:data-src|data-image|src)="(https://images\.squarespace-cdn\.com/[^"?]+)', main)
imgs = list(dict.fromkeys(imgs))
alts = dict(re.findall(r'<img[^>]+src="(https://images\.squarespace-cdn\.com/[^"?]+)[^>]*alt="([^"]*)"', main))
md = f"# {title}\n\nSource: {url}\n\n" + "\n\n".join(out) + "\n\n## Images\n\n" + "\n".join(f"- {os.path.basename(u)}  {('— ' + html.unescape(alts[u])) if alts.get(u) else ''}\n  {u}" for u in imgs) + "\n"
open(base + '.md', 'w').write(md)
print(f"{title!r}: {len(out)} lines, {sum(len(l.split()) for l in out)} words, {len(imgs)} images  ->  {base}.md")
os.makedirs(base + '-images', exist_ok=True)
ok = 0
for i, u in enumerate(imgs, 1):
    name = f"{i:02d}_" + os.path.basename(u)
    if not re.search(r'\.(jpe?g|png|webp|gif)$', name, re.I): name += '.jpg'
    try:
        urllib.request.urlretrieve(u + '?format=2500w', os.path.join(base + '-images', name)); ok += 1
    except Exception as e:
        print("  image failed:", u, e)
print(f"{ok} images -> {base}-images/")
PY
