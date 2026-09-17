/*
 * Hartwick Atelier — product media rail (Wireframe 04, revised).
 *
 * The centre column is a vertical scroll of frames with position markers drawn
 * over the image edge. This file does two things and nothing else:
 *
 *   1. clicking a marker scrolls its frame into view;
 *   2. the marker for the frame currently centred in the viewport reads as
 *      current.
 *
 * Everything else — the layout, the sticky rails either side — is CSS. If this
 * script never runs the rail still scrolls and every image is still reachable;
 * the markers simply stop tracking. So it is additive, never load-bearing, and
 * it is a custom element so multiple products on one page each get their own.
 *
 * Which frame is "current" is derived from geometry — the frame whose centre is
 * nearest the viewport centre — rather than from an IntersectionObserver, for
 * the same reason as the gallery counter: observer callbacks are tied to
 * painting and go quiet on a backgrounded tab, which strands the markers. This
 * measures on scroll and stays correct at any frame height.
 *
 * 16 September 2026 (Aloha's product-page brief, and the V2 design):
 *   3. the readout at the foot of the frame — "01 / 03" — follows the current
 *      frame, and the "Scroll" hint beside it retires after the first scroll;
 *   4. below 990px the frames are one swipeable row (CSS), so "current" is
 *      measured against the rail's own horizontal centre and the scroll
 *      events come from the row, not the window. One measurement serves both:
 *      the distance from each frame's centre to the reference centre, on
 *      whichever axis the layout is using;
 *   5. a jump honours prefers-reduced-motion.
 */
(function () {
  'use strict';

  if (!('customElements' in window)) return;

  var Rail = function () {};
  Rail.prototype = Object.create(HTMLElement.prototype);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.matchMedia ? window.matchMedia('(max-width: 989px)') : { matches: false };

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function upgrade(el) {
    var frames = Array.prototype.slice.call(el.querySelectorAll('.ha-pdp__frame'));
    var dots = Array.prototype.slice.call(el.querySelectorAll('.ha-pdp__dot'));
    var row = el.querySelector('.ha-pdp__frames');
    var count = el.querySelector('.ha-pdp__count');
    var live = el.querySelector('[data-count-live]');
    var hint = el.querySelector('.ha-pdp__scroll-hint');
    if (frames.length < 2) return;
    var total = frames.length;

    var current = -1;

    function mark(i) {
      if (i === current) return;
      current = i;
      for (var d = 0; d < dots.length; d++) {
        dots[d].setAttribute('aria-current', d === i ? 'true' : 'false');
      }
      if (count) count.textContent = pad(i + 1) + ' / ' + pad(total);
      if (live) live.textContent = 'Image ' + (i + 1) + ' of ' + total;
    }

    function retireHint() {
      if (!hint) return;
      hint.classList.add('ha-pdp__scroll-hint--done');
      hint = null;
    }

    function jump(i) {
      var behavior = reduce ? 'auto' : 'smooth';
      if (narrow.matches && row) {
        row.scrollTo({ left: frames[i].offsetLeft - row.offsetLeft, behavior: behavior });
      } else {
        frames[i].scrollIntoView({ behavior: behavior, block: 'center' });
      }
      mark(i);
      retireHint();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { jump(i); });
    });

    function nearest() {
      var horizontal = narrow.matches && row;
      var ref = horizontal ? (function () { var r = row.getBoundingClientRect(); return r.left + r.width / 2; })() : window.innerHeight / 2;
      var best = 0;
      var bestGap = Infinity;
      for (var i = 0; i < frames.length; i++) {
        var r = frames[i].getBoundingClientRect();
        var centre = horizontal ? r.left + r.width / 2 : r.top + r.height / 2;
        var gap = Math.abs(centre - ref);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      }
      mark(best);
    }

    var queued = null;
    function schedule() {
      if (queued) return;
      queued = setTimeout(function () {
        queued = null;
        nearest();
      }, 80);
    }

    function onScroll() {
      retireHint();
      schedule();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    if (row) row.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', nearest);
    nearest();
  }

  function define() {
    if (window.customElements.get('ha-media-rail')) return;
    var Ctor = function () {
      return Reflect.construct(HTMLElement, [], Ctor);
    };
    Ctor.prototype = Object.create(HTMLElement.prototype);
    Ctor.prototype.connectedCallback = function () { upgrade(this); };
    try {
      window.customElements.define('ha-media-rail', Ctor);
    } catch (e) {
      // Older engines without Reflect.construct on custom elements: upgrade by hand.
      Array.prototype.forEach.call(document.querySelectorAll('ha-media-rail'), upgrade);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', define);
  } else {
    define();
  }
})();
