(() => {
  const W = document.documentElement.clientWidth;
  const out = { docScroll: document.documentElement.scrollWidth, W, overflow: [], clippedText: [], scrollers: [] };
  const desc = el => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.'); const sec = el.closest('.shopify-section'); return (sec ? sec.id.replace('shopify-section-', '') + ' > ' : '') + s; };
  const clipped = el => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(cs.overflowX)) return true; if (cs.position === 'fixed') return false; } return false; };
  const vis = el => { const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('.visually-hidden, [aria-hidden="true"] .ha-mark, .ha-mark, svg, script, style, #shopify-pc__banner, [hidden], .drawer:not([open]), details:not([open]) > :not(summary)')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width) continue;
    if ((r.right > W + 1 || r.left < -1) && !clipped(el) && vis(el)) out.overflow.push(desc(el) + ` [${Math.round(r.left)}..${Math.round(r.right)}]`);
    const cs = getComputedStyle(el);
    if (/(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2 && vis(el)) {
      out.scrollers.push({ el: desc(el), cw: el.clientWidth, sw: el.scrollWidth, kids: el.children.length, snap: cs.scrollSnapType, touch: cs.touchAction });
    }
    if (el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 2 && /(hidden|clip)/.test(cs.overflowX) && vis(el)) out.clippedText.push(desc(el) + ' "' + el.textContent.trim().slice(0, 40) + '"');
    // text past its own box (nowrap) in non-clipping parent
    if (el.children.length === 0 && el.textContent.trim() && cs.whiteSpace.includes('nowrap') && el.scrollWidth > el.clientWidth + 2 && vis(el) && cs.display !== 'inline') out.clippedText.push('NOWRAP ' + desc(el) + ' "' + el.textContent.trim().slice(0, 40) + '"');
  }
  out.overflow = [...new Set(out.overflow)].slice(0, 40);
  return out;
})()
