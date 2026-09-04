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
 */
(function () {
  'use strict';

  if (!('customElements' in window)) return;

  var Rail = function () {};
  Rail.prototype = Object.create(HTMLElement.prototype);

  function upgrade(el) {
    var frames = Array.prototype.slice.call(el.querySelectorAll('.ha-pdp__frame'));
    var dots = Array.prototype.slice.call(el.querySelectorAll('.ha-pdp__dot'));
    if (frames.length < 2 || dots.length !== frames.length) return;

    var current = 0;

    function mark(i) {
      if (i === current) return;
      current = i;
      for (var d = 0; d < dots.length; d++) {
        dots[d].setAttribute('aria-current', d === i ? 'true' : 'false');
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        frames[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        mark(i);
      });
    });

    function nearest() {
      var mid = window.innerHeight / 2;
      var best = 0;
      var bestGap = Infinity;
      for (var i = 0; i < frames.length; i++) {
        var r = frames[i].getBoundingClientRect();
        var gap = Math.abs(r.top + r.height / 2 - mid);
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

    window.addEventListener('scroll', schedule, { passive: true });
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
