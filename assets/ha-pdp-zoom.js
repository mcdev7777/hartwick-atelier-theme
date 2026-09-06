/*
 * Hartwick Atelier — product media, click to zoom.
 *
 * Aloha, 5 September 2026: "in the first section, you must implement the zoom
 * effect when clicking the image."
 *
 * WHY NOT LUXE'S OWN LIGHTBOX. Luxe ships one, in product-media-gallery.liquid,
 * and reusing a native is the standing preference (CLAUDE.md). It was the first
 * thing tried. Its markup is bound to the native gallery — `#galModal`,
 * `.galSlides`, a thumbnail track — and its behaviour is driven by section
 * settings our custom rail has no equivalent of: gallery_mega_zoom,
 * zoom_enable_in_out, zoom_fg_color, zoom_bg_color, media_aspect_ratio,
 * media_scale, and two thumbnail-position settings. Adopting it would have
 * meant copying nine settings into ha-product's schema purely to satisfy a
 * modal, and inheriting a slide engine that hides every frame but one — which
 * is the opposite of a scrolling rail. The rail is already custom; this is
 * about ninety lines and behaves exactly as the rail does.
 *
 * WHAT IT DOES
 *   - Click, Enter or Space on a frame opens that image full-screen.
 *   - Arrow keys and the two on-screen arrows move between images.
 *   - Escape, the close button, or clicking the backdrop closes it.
 *   - A second click on the opened image toggles 2x magnification, panning
 *     from the point clicked.
 *
 * ACCESSIBILITY. The frames are real buttons, so they are reachable and
 * announced without help. Focus moves into the dialog on open, is trapped while
 * it is open, and returns to the frame that opened it on close — the thing most
 * hand-rolled lightboxes get wrong. Background scrolling is locked, and the
 * whole thing is inert when JavaScript does not run: without it a frame is
 * simply a picture, exactly as it is today.
 *
 * PROGRESSIVE ENHANCEMENT. The dialog is built once, on first open, rather than
 * printed into every product page whether or not anyone zooms.
 */
(function () {
  'use strict';

  function build() {
    var el = document.createElement('div');
    el.className = 'ha-zoom';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Product image');
    el.hidden = true;
    el.innerHTML =
      '<button class="ha-zoom__close" type="button" aria-label="Close">&times;</button>' +
      '<button class="ha-zoom__nav ha-zoom__nav--prev" type="button" aria-label="Previous image"></button>' +
      '<button class="ha-zoom__nav ha-zoom__nav--next" type="button" aria-label="Next image"></button>' +
      '<div class="ha-zoom__stage"><img class="ha-zoom__img" alt=""></div>' +
      '<p class="ha-zoom__count ha-record" aria-live="polite"></p>';
    document.body.appendChild(el);
    return el;
  }

  function init(rail) {
    /* ONE LIST, BUILT FROM THE BUTTONS, NOT FROM THE FRAMES.

       The first version walked the frames and read an <img> out of each, which
       broke twice on a product that has a video:

       1. A <video> carries a poster <img>, so the video's still frame was
          silently added to the carousel and you could arrow onto a picture that
          is not one of the product's photographs.
       2. Worse, it shifted the numbering. Frames and images only line up while
          every frame happens to be an image. Put a video FIRST and clicking the
          second frame's button opened the first photograph, because the button
          was passing its FRAME index into a list that had been filtered.

       Building the list from the zoom buttons removes both at once: a button
       only exists on a real image, so the list and the buttons cannot disagree,
       and index is simply position in that list. */
    var items = [];
    [].forEach.call(rail.querySelectorAll('.ha-pdp__frame'), function (frame) {
      var btn = frame.querySelector('.ha-pdp__zoom');
      var img = frame.querySelector('img');
      if (!btn || !img) return;
      items.push({
        btn: btn,
        src: img.currentSrc || img.src,
        alt: img.alt || '',
        /* The full-resolution source lives on the BUTTON — that is where the
           Liquid prints it. Reading it off the <img> found nothing, so every
           zoom was quietly showing the rail's own 1400px copy blown up. */
        full: btn.getAttribute('data-zoom-src') || ''
      });
    });

    if (!items.length) return;

    var dialog, imgEl, countEl, index = 0, opener = null, magnified = false;

    function render() {
      var s = items[index];
      imgEl.src = s.full || s.src;
      imgEl.alt = s.alt;
      countEl.textContent = index + 1 + ' / ' + items.length;
      unmagnify();
      var many = items.length > 1;
      dialog.querySelector('.ha-zoom__nav--prev').hidden = !many;
      dialog.querySelector('.ha-zoom__nav--next').hidden = !many;
      countEl.hidden = !many;
    }

    function unmagnify() {
      magnified = false;
      imgEl.classList.remove('is-magnified');
      imgEl.style.transformOrigin = '50% 50%';
    }

    function toggleMagnify(e) {
      if (magnified) return unmagnify();
      var b = imgEl.getBoundingClientRect();
      // Pan from the point clicked, so magnifying inspects what was pointed at
      // rather than always the middle of the picture.
      imgEl.style.transformOrigin =
        ((e.clientX - b.left) / b.width) * 100 + '% ' + ((e.clientY - b.top) / b.height) * 100 + '%';
      imgEl.classList.add('is-magnified');
      magnified = true;
    }

    function step(n) {
      index = (index + n + items.length) % items.length;
      render();
    }

    function onKey(e) {
      if (e.key === 'Escape') return close();
      if (e.key === 'ArrowRight') return step(1);
      if (e.key === 'ArrowLeft') return step(-1);
      if (e.key !== 'Tab') return;
      // Trap focus: a modal the keyboard can walk out of is not a modal.
      var f = [].slice.call(dialog.querySelectorAll('button')).filter(function (b) { return !b.hidden; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function open(i, from) {
      if (!dialog) {
        dialog = build();
        imgEl = dialog.querySelector('.ha-zoom__img');
        countEl = dialog.querySelector('.ha-zoom__count');
        dialog.querySelector('.ha-zoom__close').addEventListener('click', close);
        dialog.querySelector('.ha-zoom__nav--prev').addEventListener('click', function () { step(-1); });
        dialog.querySelector('.ha-zoom__nav--next').addEventListener('click', function () { step(1); });
        imgEl.addEventListener('click', toggleMagnify);
        dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
      }
      index = i;
      opener = from;
      render();
      dialog.hidden = false;
      document.documentElement.classList.add('ha-zoom-open');
      document.addEventListener('keydown', onKey);
      dialog.querySelector('.ha-zoom__close').focus();
    }

    function close() {
      if (!dialog) return;
      dialog.hidden = true;
      unmagnify();
      document.documentElement.classList.remove('ha-zoom-open');
      document.removeEventListener('keydown', onKey);
      if (opener && opener.focus) opener.focus();
      opener = null;
    }

    items.forEach(function (item, i) {
      item.btn.hidden = false;
      item.btn.addEventListener('click', function () { open(i, item.btn); });
    });
  }

  function start() {
    document.querySelectorAll('.ha-pdp__frames').forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
