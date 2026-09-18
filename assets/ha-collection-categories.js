/*
 * Hartwick Atelier — colour reveal on touch screens.
 *
 * On a screen with no hover, photographs that rest in black and white take
 * colour as they scroll into view and give it back as they leave — the
 * Collection Index tiles (15 Sept), and from 18 Sept the refined Index's
 * cards and editorial photograph and the All Clothing cards and feature.
 * Ivan, 16 & 18 Sept: the transition must exist on phones too.
 *
 * Which element is "in view" is measured two ways. An IntersectionObserver
 * at 55% visibility is the cheap path; but observer callbacks are tied to
 * painting and go quiet on a backgrounded tab, so a geometry pass on scroll
 * and resize does the same job by hand — the same reason the product gallery
 * counter measures rather than observes.
 */
(() => {
  // Touch, or phone width: the theme editor's phone view and a desktop
  // browser at phone width must behave like the phone itself.
  const touch = window.matchMedia('(hover: none)');
  const narrow = window.matchMedia('(max-width: 749px)');
  if (!touch.matches && !narrow.matches) return;
  const tiles = Array.from(document.querySelectorAll(
    '.ha-cats--reveal-scroll .ha-cats__tile, .ha-clothing__card, .ha-clothing__feature-media, .ha-idx__card, .ha-idx__editorial'
  ));
  if (!tiles.length) return;

  const THRESHOLD = 0.55;

  function measure() {
    const vh = window.innerHeight;
    tiles.forEach((t) => {
      const r = t.getBoundingClientRect();
      if (!r.height) return;
      const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      // a photograph taller than the screen counts as in view when it fills most of it
      const ratio = Math.max(visible, 0) / Math.min(r.height, vh);
      t.classList.toggle('is-revealed', ratio >= THRESHOLD);
    });
  }

  let queued = null;
  function schedule() {
    if (queued) return;
    queued = setTimeout(() => { queued = null; measure(); }, 60);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-revealed', e.isIntersecting)),
      { threshold: THRESHOLD }
    );
    tiles.forEach((t) => io.observe(t));
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', measure);
  window.addEventListener('load', measure);
  measure();
})();
