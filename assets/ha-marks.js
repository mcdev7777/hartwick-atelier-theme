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
    '.ha-bag__action', '.ha-suggest__go', '.ha-suggest__stay',
    '.ha-reg-form__submit--outline', '.ha-circle__signin', '.ha-bag-empty__cta',
    'a.ha-jnl-cats__link'
  ].join(',');
  // Aloha, 24 September 2026 (header, final direction): "NO pencil circles or
  // circle animations in the header! I want to reserve the hand drawn
  // circles/lines for links and referral moments within the actual pages."
  // The header bar, the phone menu and the footer navigation are never marked,
  // whatever selector above might match inside them.
  var NEVER = '#SiteHeader, .header-drawer, menu-drawer, .nav-ul--primary, .ha-util-rows, .ha-footer';
  var LABEL_ONLY = '.ha-util-row';
  var CORNER = '.ha-home__corner-mark, .ha-mst__corner, .ha-clothing__corner';
  // Links that take the oval without ever having had a corner mark: the
  // Journal's (Aloha, 23 Sept: "replace '>' to the circle icons").
  var OVAL = '[data-ha-oval]';
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
    fit(el);
  }

  // A ring goes round the WORDS, not round the element. Links and buttons
  // are often wider than what they say — a ruled button with its label at
  // the left, a padded menu item, a full-width row, a boxed button — and a
  // ring sized to the box sat off-centre or ran far past the words (Ivan,
  // 23 Sept: "the drawn circles don't fit the button width"). So the words'
  // own box is measured and handed to the CSS as --ha-tx / --ha-ty (centre,
  // from the link's padding edge) and --ha-tw / --ha-th (size); the CSS
  // draws the ring in proportion to them. Measured again just before a ring
  // is drawn, so it is right after a resize or a late web font.
  function fit(el) {
    var m = el.querySelector('.ha-mark--ring');
    if (!m) return;
    var host = m.parentNode;
    var l = 1e9, r = -1e9, t = 1e9, b = -1e9;
    var walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return /\S/.test(n.nodeValue) && !n.parentNode.closest('.ha-mark, .visually-hidden') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    // A row with a label at one end and a value at the other (REGION …
    // US / USD in the phone menu) is ringed on its label alone.
    var firstOnly = el.matches(LABEL_ONLY);
    var range = document.createRange(), n;
    while ((n = walker.nextNode())) {
      range.selectNodeContents(n);
      var rects = range.getClientRects();
      for (var i = 0; i < rects.length; i++) {
        var q = rects[i];
        if (!q.width) continue;
        if (q.left < l) l = q.left;
        if (q.right > r) r = q.right;
        if (q.top < t) t = q.top;
        if (q.bottom > b) b = q.bottom;
      }
      if (firstOnly && r > l) break;
    }
    if (r <= l) return;          // hidden, or no words: keep the CSS fallback
    var box = host.getBoundingClientRect();
    m.style.setProperty('--ha-tx', ((l + r) / 2 - box.left - host.clientLeft).toFixed(1) + 'px');
    m.style.setProperty('--ha-ty', ((t + b) / 2 - box.top - host.clientTop).toFixed(1) + 'px');
    m.style.setProperty('--ha-tw', (r - l).toFixed(1) + 'px');
    m.style.setProperty('--ha-th', (b - t).toFixed(1) + 'px');
  }

  function fitAll() {
    document.querySelectorAll('[data-ha-mark="ring"]').forEach(fit);
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
    document.querySelectorAll(OVAL).forEach(function (el) {
      if (!el.hasAttribute('data-ha-mark')) oval(el);
    });
    document.querySelectorAll(RING).forEach(function (el) {
      if (el.hasAttribute('data-ha-mark') || !el.textContent.trim() || el.closest(NEVER)) return;
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

  // Measure the words the moment a ring is about to be drawn.
  function fitFrom(e) {
    var el = e.target.closest && e.target.closest('[data-ha-mark="ring"]');
    if (el) fit(el);
  }
  document.addEventListener('pointerover', fitFrom, { passive: true });
  document.addEventListener('focusin', fitFrom);

  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    var el = e.target.closest && e.target.closest('[data-ha-mark]');
    if (!el) return;
    touched = el; touchedAt = Date.now();
    if (el.getAttribute('data-ha-mark') === 'ring') fit(el);
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
  // Rings that stay drawn (the Journal's current section) are re-measured
  // once the web fonts have loaded and whenever the page is resized.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  var resizing = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizing);
    resizing = setTimeout(fitAll, 150);
  });
  var pending = 0;
  new MutationObserver(function () {
    if (pending) return;
    pending = requestAnimationFrame(function () { pending = 0; scan(); });
  }).observe(document.body, { childList: true, subtree: true });
})();
