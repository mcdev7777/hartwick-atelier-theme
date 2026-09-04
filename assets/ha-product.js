/*
 * Hartwick Atelier — product gallery position counter.
 *
 * Mobile brief §2: "A small image count, such as 01 / 06, should communicate
 * position without using heavy carousel controls."
 *
 * This is the one gallery requirement Luxe has no setting for. Its mobile
 * navigation offers bullets, a scroll track, thumbnails or nothing — there is
 * no numeric readout. Rather than fork snippets/product-media-gallery.liquid
 * and lose the theme's upgradeability, the counter is attached from outside:
 * it reads the native gallery's own DOM and writes one element into it.
 *
 * If this script fails to load, the gallery is untouched and still works — the
 * counter is additive, never load-bearing.
 *
 * Accessibility: the count is decorative. The native thumbnail buttons already
 * carry "Load image N" labels and remain the accessible control, so the counter
 * is hidden from assistive technology rather than duplicating that as noise.
 *
 * 3 September 2026 — Aloha asked whether a Studio Standard style gallery is
 * possible: "one main image with manual navigation, an image counter and swipe
 * functionality on mobile". It is, and it is a Luxe setting rather than code
 * (gallery_layout: "slider"). The one part Luxe has never had is the counter,
 * which is this file — so it now reports on desktop too, but only in that
 * arrangement. In the vertical stack every image is on screen at once and there
 * is no single position to report, so the readout stays a mobile affordance.
 */
(function () {
  'use strict';

  var PAD = function (n) {
    return n < 10 ? '0' + n : String(n);
  };

  function build(container) {
    var slides = Array.prototype.filter.call(
      container.children,
      function (el) {
        return el.classList && el.classList.contains('product-media-image');
      }
    );

    // One image is not a sequence — nothing to count.
    if (slides.length < 2) return;

    var readout = document.createElement('p');
    readout.className = 'ha-gallery-count ha-record';
    readout.setAttribute('aria-hidden', 'true');

    // One image at a time on desktop — the Studio Standard arrangement — is the
    // only desktop layout where a position means anything.
    if (container.classList.contains('product-media--mobile-slider--desktop-slider')) {
      readout.classList.add('ha-gallery-count--desktop');
    }

    var total = PAD(slides.length);
    var current = 1;

    function render() {
      readout.textContent = PAD(current) + ' · ' + total;
    }

    // The counter belongs above the scroll track, matching the wireframe.
    var track = container.parentNode.querySelector('.gallery-slider-thumbnails');
    if (track) {
      track.parentNode.insertBefore(readout, track);
    } else {
      container.parentNode.insertBefore(readout, container.nextSibling);
    }

    render();

    // Which slide is showing is the one whose centre sits closest to the
    // scroller's centre. Measured from geometry rather than from an
    // IntersectionObserver: observer callbacks are tied to rendering and go
    // quiet whenever the page is not being painted, which leaves the readout
    // stale. This stays correct whatever the slide widths, gaps or padding
    // are, and it re-measures on resize for free.
    function sync() {
      // Viewport coordinates for both sides of the comparison, so the result
      // does not depend on which ancestor happens to be the offset parent.
      var frame = container.getBoundingClientRect();
      var mid = frame.left + frame.width / 2;
      var best = 0;
      var bestGap = Infinity;

      for (var i = 0; i < slides.length; i++) {
        var rect = slides[i].getBoundingClientRect();
        var gap = Math.abs(rect.left + rect.width / 2 - mid);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      }

      if (best + 1 !== current) {
        current = best + 1;
        render();
      }
    }

    // Throttled on a timer rather than requestAnimationFrame: rAF is suspended
    // whenever the page is not being painted, which would leave the readout
    // stale on a backgrounded tab and makes the behaviour untestable.
    var queued = null;
    function schedule() {
      if (queued) return;
      queued = setTimeout(function () {
        queued = null;
        sync();
      }, 60);
    }

    container.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // Coming back to a tab that was scrolled while hidden.
    document.addEventListener('visibilitychange', sync);

    sync();

    // Luxe's own thumbnail buttons drive the gallery directly, so mirror them.
    var thumbs = container.parentNode.querySelectorAll('.gallery-slider--thumbnail');
    Array.prototype.forEach.call(thumbs, function (button) {
      button.addEventListener('click', function () {
        var index = parseInt(button.getAttribute('data-slide-index'), 10);
        if (!isNaN(index) && index >= 1 && index <= slides.length) {
          current = index;
          render();
        }
      });
    });
  }

  function init() {
    var containers = document.querySelectorAll('#SlidesCon');
    Array.prototype.forEach.call(containers, build);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
