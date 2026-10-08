/*
 * Hartwick Atelier — the "+" items (snippets/ha-info-pop.liquid).
 *
 * Aloha, 8 October 2026: secondary information opens as a small overlay
 * that never makes the page longer — hover or click on desktop, tap on a
 * phone (a panel over the page on #F8F5ED, closed by ×, Escape or a tap
 * outside). When it closes, the page is exactly as it was.
 *
 * Each panel is moved to <body> on load, so the left rail (a sticky scroll
 * container) cannot clip it and no transformed ancestor can offset it. One
 * panel is open at a time.
 *
 *   window mode   a mouse and 990px or wider: a small window beside its "+",
 *                 opened by hover (closes when the pointer leaves both) or
 *                 by click (stays until ×, Escape or a click elsewhere).
 *   sheet mode    anything else: a panel from the foot of the screen over a
 *                 veil; the page behind does not scroll while it is open.
 */
(function () {
  'use strict';
  if (window.haInfoPop) return;
  window.haInfoPop = true;

  var wide = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 990px)');
  var open = null;        // { root, trigger, panel, pinned }
  var veil = null;
  var hoverTimer = 0;
  var leaveTimer = 0;
  var GAP = 10;

  function sheetMode() { return !wide.matches; }

  function ensureVeil() {
    if (veil) return veil;
    veil = document.createElement('div');
    veil.className = 'ha-pop-veil';
    veil.hidden = true;
    veil.addEventListener('click', function () { close(true); });
    document.body.appendChild(veil);
    return veil;
  }

  function place(item) {
    var p = item.panel;
    if (sheetMode()) {
      p.style.top = p.style.left = p.style.maxHeight = '';
      return;
    }
    var r = item.trigger.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var w = p.offsetWidth;
    var h = p.offsetHeight;
    // Beside the "+" on the side with room (the left rail opens towards the
    // page, the buy rail towards the image), top-aligned with the line.
    var left = r.right + GAP;
    if (left + w > vw - GAP) left = r.left - w - GAP;
    if (left < GAP) left = Math.min(Math.max(r.left, GAP), vw - w - GAP);
    var top = r.top - 12;
    var room = vh - GAP * 2;
    if (h > room) { p.style.maxHeight = room + 'px'; h = room; } else { p.style.maxHeight = ''; }
    if (top + h > vh - GAP) top = vh - GAP - h;
    if (top < GAP) top = GAP;
    p.style.left = Math.round(left) + 'px';
    p.style.top = Math.round(top) + 'px';
  }

  function show(item, pinned) {
    clearTimeout(leaveTimer);
    if (open && open.panel === item.panel) {
      if (pinned) open.pinned = true;
      return;
    }
    if (open) close(false);
    open = { root: item.root, trigger: item.trigger, panel: item.panel, pinned: !!pinned };
    var sheet = sheetMode();
    var p = item.panel;
    p.classList.toggle('ha-pop__panel--sheet', sheet);
    p.classList.toggle('ha-pop__panel--window', !sheet);
    p.setAttribute('aria-modal', sheet ? 'true' : 'false');
    p.hidden = false;
    place(open);
    // next frame, so the transition runs from the closed state
    requestAnimationFrame(function () { p.classList.add('is-open'); });
    item.trigger.setAttribute('aria-expanded', 'true');
    item.root.classList.add('is-open');
    if (sheet) {
      ensureVeil().hidden = false;
      requestAnimationFrame(function () { veil.classList.add('is-open'); });
      document.body.classList.add('ha-pop-lock');
    }
    if (sheet || pinned) {
      var c = p.querySelector('[data-ha-pop-close]');
      if (c) c.focus({ preventScroll: true });
    }
  }

  function close(returnFocus) {
    if (!open) return;
    var item = open;
    open = null;
    clearTimeout(hoverTimer);
    clearTimeout(leaveTimer);
    item.panel.classList.remove('is-open');
    item.panel.hidden = true;
    item.trigger.setAttribute('aria-expanded', 'false');
    item.root.classList.remove('is-open');
    if (veil) { veil.classList.remove('is-open'); veil.hidden = true; }
    document.body.classList.remove('ha-pop-lock');
    if (returnFocus) item.trigger.focus({ preventScroll: true });
  }

  function init(root) {
    if (root.__haPop) return;
    var trigger = root.querySelector('.ha-pop__trigger');
    var panel = root.querySelector('.ha-pop__panel');
    if (!trigger || !panel) return;
    root.__haPop = true;
    var item = { root: root, trigger: trigger, panel: panel };

    // Out of the rail, into the page: nothing can clip or offset it there.
    // The panel keeps a copy of its section's scope class so its type and
    // colours still resolve.
    // A section re-rendered in place (variant change, theme editor) brings a
    // fresh panel; the one moved out on the last render is dropped.
    document.querySelectorAll('body > .ha-pop__panel').forEach(function (old) {
      if (old.id === panel.id && old !== panel) {
        if (open && open.panel === old) close(false);
        old.remove();
      }
    });
    panel.hidden = true;
    document.body.appendChild(panel);
    root.classList.add('is-ready');

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (open && open.panel === panel) {
        // a click on an open, hover-opened window pins it; a second click closes
        if (!sheetMode() && !open.pinned) { open.pinned = true; return; }
        close(false);
        return;
      }
      show(item, true);
    });

    function enter(e) {
      if (sheetMode() || (e.pointerType && e.pointerType !== 'mouse')) return;
      clearTimeout(leaveTimer);
      if (open && open.panel === panel) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        if (!open || !open.pinned) show(item, false);
      }, 90);
    }
    function leave(e) {
      if (sheetMode() || (e.pointerType && e.pointerType !== 'mouse')) return;
      clearTimeout(hoverTimer);
      if (!open || open.panel !== panel || open.pinned) return;
      leaveTimer = setTimeout(function () {
        if (open && open.panel === panel && !open.pinned) close(false);
      }, 220);
    }
    trigger.addEventListener('pointerenter', enter);
    trigger.addEventListener('pointerleave', leave);
    panel.addEventListener('pointerenter', function (e) { if (open && open.panel === panel) clearTimeout(leaveTimer); });
    panel.addEventListener('pointerleave', leave);

    panel.querySelector('[data-ha-pop-close]').addEventListener('click', function () { close(true); });
  }

  function initAll(scope) {
    (scope || document).querySelectorAll('[data-ha-pop]').forEach(init);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) { e.preventDefault(); close(true); }
  });

  // A click anywhere else closes a window (the sheet has its veil).
  document.addEventListener('pointerdown', function (e) {
    if (!open || sheetMode()) return;
    if (open.panel.contains(e.target) || open.trigger.contains(e.target)) return;
    close(false);
  });

  // Keep a window beside its "+" while the page or the rail scrolls; a
  // hover-opened one closes once its "+" has left the screen.
  var ticking = false;
  function follow() {
    ticking = false;
    if (!open || sheetMode()) return;
    var r = open.trigger.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) { close(false); return; }
    place(open);
  }
  window.addEventListener('scroll', function () {
    if (open && !ticking) { ticking = true; requestAnimationFrame(follow); }
  }, { capture: true, passive: true });
  window.addEventListener('resize', function () { if (open) close(false); });
  if (wide.addEventListener) wide.addEventListener('change', function () { close(false); });

  // Focus leaving a window (Tab past its last link) closes it.
  document.addEventListener('focusin', function (e) {
    if (!open || sheetMode()) return;
    if (open.panel.contains(e.target) || open.trigger.contains(e.target)) return;
    close(false);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(); });
  } else {
    initAll();
  }

  // The theme editor and Luxe's variant change re-render sections in place.
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].addedNodes.length; j++) {
        var n = list[i].addedNodes[j];
        if (n.nodeType === 1 && (n.matches('[data-ha-pop]') || n.querySelector('[data-ha-pop]'))) { initAll(n.parentNode || document); return; }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
