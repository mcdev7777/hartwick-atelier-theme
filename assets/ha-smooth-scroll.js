/*
  Hartwick Atelier — smooth scrolling and the slim scrollbar.
  Ivan, 23 September 2026: "the scrolling effect and the scroller must be
  customized and more smooth", pointing at niccolomiranda.com/work/avroko.

  That site runs Locomotive Scroll 4, which moves the whole page with a CSS
  transform. On this theme that would break everything that relies on the
  real scroll position: the fixed header, the sticky product rails and
  category bar, the mobile buy bar, the drawers, lazy images and anchors. So
  this does what Locomotive 5 / Lenis do instead: the page keeps its native
  scroll, and the wheel is eased — every wheel step moves a target, and each
  frame the page travels a fraction of the way there (its default, 0.1).

  · Desktop only (a fine pointer and a wheel). Touch screens keep their own
    momentum, as on the reference site.
  · Off for prefers-reduced-motion, and inside the theme editor.
  · Hands the wheel back to the browser when the pointer is over something
    that scrolls itself (a drawer, the product rail, the size guide), when a
    drawer or the zoom has locked the page, for pinch-zoom (ctrl) and for
    sideways scrolling. Keyboard, anchors, find-in-page and the scrollbar
    stay native; the easing re-syncs to wherever they leave the page.

  The scrollbar: the native one is hidden and a slim thumb is drawn in its
  place (the reference's 5px, 3px from the edge), shown while the page moves
  and while the pointer is on it, draggable, click-to-jump on the track.
  Settings: Theme settings > Hartwick — Material Archive > Scrolling.
*/
(function () {
  if (window.haSmoothScroll) return;
  var html = document.documentElement;
  var cfg = window.haScrollSettings || {};
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced || cfg.designMode) return;

  var ease = Math.min(Math.max(Number(cfg.ease) || 0.1, 0.03), 0.3);
  var target = window.scrollY, current = window.scrollY, running = false, ours = false;

  function maxScroll() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  function locked() {
    var b = document.body;
    return b.classList.contains('overflow-hidden') || html.classList.contains('ha-zoom-open') ||
      getComputedStyle(b).overflowY === 'hidden' || getComputedStyle(html).overflowY === 'hidden';
  }
  // Does something between the pointer and the page scroll by itself in this direction?
  function innerScroller(el, dy) {
    for (; el && el !== document.body && el !== html; el = el.parentElement) {
      if (el.hasAttribute && el.hasAttribute('data-smooth-prevent')) return true;
      var s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) {
        if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
      }
    }
    return false;
  }

  function frame() {
    var d = target - current;
    current = Math.abs(d) < 0.4 ? target : current + d * ease;
    ours = true;
    window.scrollTo(0, current);
    if (current !== target) { requestAnimationFrame(frame); } else { running = false; }
    bar.update(true);
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.defaultPrevented || locked()) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    var dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
    if (innerScroller(e.target, dy)) return;
    e.preventDefault();
    if (!running) { current = target = window.scrollY; }
    target = Math.min(Math.max(target + dy, 0), maxScroll());
    if (!running) { running = true; requestAnimationFrame(frame); }
  }, { passive: false });

  // Keyboard, anchors, the scrollbar, find-in-page: follow wherever they go.
  window.addEventListener('scroll', function () {
    if (ours) { ours = false; } else if (!running) { current = target = window.scrollY; }
    bar.update(true);
  }, { passive: true });

  // ---- the scrollbar -----------------------------------------------------
  var bar = (function () {
    if (cfg.scrollbar === false) return { update: function () {} };
    html.classList.add('ha-scrollbar');
    var track = document.createElement('div');
    track.className = 'ha-scrollbar__track';
    track.setAttribute('aria-hidden', 'true');
    var thumb = document.createElement('div');
    thumb.className = 'ha-scrollbar__thumb';
    track.appendChild(thumb);
    document.body.appendChild(track);
    var hideTimer, dragging = false, grabY = 0, thumbH = 0;

    function update(show) {
      var vh = window.innerHeight, full = document.documentElement.scrollHeight, max = full - vh;
      track.hidden = vh <= 0 || max <= 0 || locked();
      if (track.hidden) return;
      thumbH = Math.max(40, vh * vh / full);
      thumb.style.height = thumbH + 'px';
      thumb.style.transform = 'translateY(' + ((vh - thumbH) * (window.scrollY / max)) + 'px)';
      if (show) {
        track.classList.add('is-active');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () { if (!dragging) track.classList.remove('is-active'); }, 900);
      }
    }
    function toScroll(clientY) {
      var vh = window.innerHeight, max = document.documentElement.scrollHeight - vh;
      return Math.min(Math.max((clientY - grabY) / (vh - thumbH), 0), 1) * max;
    }
    thumb.addEventListener('pointerdown', function (e) {
      dragging = true; grabY = e.clientY - thumb.getBoundingClientRect().top;
      thumb.setPointerCapture(e.pointerId); html.classList.add('ha-scrollbar-dragging'); e.preventDefault();
    });
    thumb.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      target = toScroll(e.clientY);
      if (!running) { running = true; current = window.scrollY; requestAnimationFrame(frame); }
    });
    function release() { dragging = false; html.classList.remove('ha-scrollbar-dragging'); update(true); }
    thumb.addEventListener('pointerup', release);
    thumb.addEventListener('pointercancel', release);
    track.addEventListener('pointerdown', function (e) {
      if (e.target !== track) return;
      grabY = thumbH / 2; target = toScroll(e.clientY);
      if (!running) { running = true; current = window.scrollY; requestAnimationFrame(frame); }
    });
    window.addEventListener('resize', function () { target = Math.min(target, maxScroll()); update(false); });
    new ResizeObserver(function () { update(false); }).observe(document.body);
    update(false);
    return { update: update };
  })();

  window.haSmoothScroll = {
    // for scripts that want an eased jump: haSmoothScroll.to(y)
    to: function (y) {
      target = Math.min(Math.max(y, 0), maxScroll());
      if (!running) { running = true; current = window.scrollY; requestAnimationFrame(frame); }
    }
  };
})();
