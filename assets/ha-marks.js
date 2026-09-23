/*
 * Hartwick Atelier — PENCIL MARKS on links and buttons.
 * Aloha, 23 September 2026: "when someone hovers over a link on desktop, the
 * circle or arrow would animate as if it were being drawn. On mobile, the
 * animation could trigger when the link is tapped. […] with random variations
 * if that's technically feasible […] nearly on all buttons and links, but not
 * every button has a feature, such as '+'."
 *
 * Three families, decided by what the link already carries:
 *   arrow — a link with the drawn arrow (.ha-pdp__arrow). The arrow itself is
 *           restyled in CSS as her pencil arrow; hover redraws it.
 *   oval  — a link with the small corner mark (┐). The corner goes and her
 *           double oval is drawn round the link's last word ("INDEX").
 *   ring  — the other text links and ruled buttons listed in RING. One of her
 *           two loose rings is drawn round the whole label.
 * Anything not listed is left plain: +/− toggles, close buttons, size boxes,
 * photo cards, the full-width index rows, filled buttons, links in prose.
 *
 * This file only tags elements and adds the empty mark spans; the drawing is
 * CSS (ha-sections.css, "PENCIL MARKS"). Content Luxe re-renders (the bag,
 * the product form) is picked up by a MutationObserver.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('ha-marks')) return;

  var random = !(window.haMarks && window.haMarks.random === false);

  var RING = [
    '.ha-home__ruled', '.ha-link', '.ha-home-hero__cta', '.ha-home__corner',
    '.ha-idx__viewall', '.ha-idx__back',
    '.ha-clothing__back', '.ha-clothing__top', '.ha-clothing__feature-link', '.ha-clothing__nav-link',
    '.ha-record__link', '.ha-mst__continue-link', '.ha-mst__panel-link',
    '.ha-pdp__size-guide', '.ha-pdp__record-link', '.ha-appointment__open',
    '.ha-row-link', '.ha-masterfeat__link', '.ha-related__all', '.ha-continue__more', '.ha-authorship__link',
    '.hdr-nav-primary-level-ul > li > a', '.ha-util', '.hdr-st-item-cart .cart-icon--bubble',
    '.ha-footer__links a', '.ha-bag__action', '.ha-suggest__go', '.ha-suggest__stay',
    '.ha-reg-form__submit--outline', '.ha-circle__signin', '.ha-bag-empty__cta'
  ].join(',');
  // Full-width rows (the phone menu, REGION / THE CIRCLE in it): the ring
  // goes round the label's words, not round the whole row.
  var RING_LABEL = '.nav-ul--primary > li > a, .ha-util-row';
  var CORNER = '.ha-home__corner-mark, .ha-mst__corner, .ha-clothing__corner';
  var CONTROL = 'a[href], button, [role="button"]';

  function span(cls) {
    var s = document.createElement('span');
    s.className = 'ha-mark ' + cls;
    s.setAttribute('aria-hidden', 'true');
    return s;
  }

  // A slight turn and, at random, a mirror: no two rings on a page sit alike.
  function vary(s, turn) {
    if (!random) return;
    s.style.setProperty('--ha-mark-turn', ((Math.random() * 2 - 1) * turn).toFixed(1) + 'deg');
    if (Math.random() < 0.5) s.style.setProperty('--ha-mark-flip', '-1');
  }

  function ring(el) {
    var n = random && Math.random() < 0.5 ? 2 : 1;
    var s = span('ha-mark--ring ha-mark--ring-' + n);
    vary(s, 3);
    el.appendChild(s);
    // The ring is placed against its link; a link that is already placed
    // (Size guide sits absolutely in its row) keeps its own positioning.
    if (getComputedStyle(el).position === 'static') el.classList.add('ha-mark-host');
    el.setAttribute('data-ha-mark', 'ring');
  }

  function firstText(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return /\S/.test(n.nodeValue) && !n.parentNode.closest('.ha-mark, .visually-hidden') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    return walker.nextNode();
  }

  function ringLabel(el) {
    var t = firstText(el);
    if (!t) return;
    var label = t.parentNode !== el && t.parentNode.childNodes.length === 1 ? t.parentNode : null;
    if (!label) {
      label = document.createElement('span');
      t.parentNode.replaceChild(label, t);
      label.appendChild(t);
    }
    label.classList.add('ha-mark-label');
    var n = random && Math.random() < 0.5 ? 2 : 1;
    var s = span('ha-mark--ring ha-mark--ring-' + n);
    vary(s, 3);
    label.appendChild(s);
    el.setAttribute('data-ha-mark', 'ring');
  }

  // The last word of the link's own text, wrapped so the oval can sit on it.
  function oval(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return /\S/.test(n.nodeValue) && !n.parentNode.closest('.ha-mark, .visually-hidden') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var last = null, n;
    while ((n = walker.nextNode())) last = n;
    if (!last) return ring(el);
    var text = last.nodeValue.replace(/\s+$/, '');
    var cut = text.search(/\S+$/);
    var word = document.createElement('span');
    word.className = 'ha-mark-word';
    word.textContent = text.slice(cut);
    var s = span('ha-mark--oval');
    vary(s, 4);
    word.appendChild(s);
    // The phrase stays one piece: in a flex link ("READ THE JOURNAL") loose
    // text and the word would become separate flex items, and the space
    // between them would be dropped.
    var phrase = document.createElement('span');
    phrase.className = 'ha-mark-phrase';
    phrase.appendChild(document.createTextNode(text.slice(0, cut)));
    phrase.appendChild(word);
    var after = last.nodeValue.slice(text.length);
    if (after) phrase.appendChild(document.createTextNode(after));
    last.parentNode.replaceChild(phrase, last);
    el.setAttribute('data-ha-mark', 'oval');
  }

  function scan() {
    document.querySelectorAll('.ha-pdp__arrow').forEach(function (a) {
      var el = a.closest(CONTROL);
      if (el && !el.hasAttribute('data-ha-mark')) el.setAttribute('data-ha-mark', 'arrow');
    });
    document.querySelectorAll(CORNER).forEach(function (c) {
      var el = c.closest(CONTROL);
      if (el && !el.hasAttribute('data-ha-mark')) oval(el);
    });
    document.querySelectorAll(RING_LABEL).forEach(function (el) {
      if (!el.hasAttribute('data-ha-mark')) ringLabel(el);
    });
    document.querySelectorAll(RING).forEach(function (el) {
      if (el.hasAttribute('data-ha-mark') || !el.textContent.trim()) return;
      ring(el);
    });
  }

  // --- a tap draws the mark, and a link waits for it before leaving -------
  var touched = null, touchedAt = 0;
  var DRAW_MS = 420;

  function play(el) {
    el.classList.remove('is-marking');
    void el.offsetWidth; // restart the animation on a second tap
    el.classList.add('is-marking');
    clearTimeout(el._haMarkTimer);
    el._haMarkTimer = setTimeout(function () { el.classList.remove('is-marking'); }, 1400);
  }

  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    var el = e.target.closest && e.target.closest('[data-ha-mark]');
    if (!el) return;
    touched = el; touchedAt = Date.now();
    play(el);
  }, { passive: true });

  document.addEventListener('click', function (e) {
    var el = touched;
    if (!el || Date.now() - touchedAt > 900 || e.defaultPrevented) return;
    if (e.target.closest('[data-ha-mark]') !== el || el.tagName !== 'A') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || el.target === '_blank' || el.hasAttribute('download')) return;
    var href = el.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    touched = null;
    setTimeout(function () { window.location.assign(el.href); }, DRAW_MS);
  });

  // Coming back through the browser's history shows the page as it was left.
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.is-marking').forEach(function (el) { el.classList.remove('is-marking'); });
  });

  scan();
  var pending = 0;
  new MutationObserver(function () {
    if (pending) return;
    pending = requestAnimationFrame(function () { pending = 0; scan(); });
  }).observe(document.body, { childList: true, subtree: true });
})();
