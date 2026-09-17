/*
 * Hartwick Atelier — Category tiles: the colour reveal on a touch screen.
 *
 * On a desktop the photographs sit black and white and colour arrives on
 * hover — pure CSS. A phone has no hover, and leaving the pictures in colour
 * there threw the effect away (Ivan, 16 Sep). So on a touch screen colour
 * arrives as each tile scrolls into view and leaves as it scrolls out: the
 * same reveal, driven by the thumb instead of the mouse. A tap still brings
 * colour up through :focus. Nothing here runs where hover exists.
 */
(() => {
  const touch = window.matchMedia('(hover: none)');
  if (!touch.matches || !('IntersectionObserver' in window)) return;

  const tiles = document.querySelectorAll('.ha-cats--reveal-scroll .ha-cats__tile');
  if (!tiles.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-revealed', e.isIntersecting));
    },
    // The tile colours once most of it is on screen, so the change happens
    // where the eye is, not at the edge.
    { threshold: 0.55 }
  );
  tiles.forEach((t) => io.observe(t));
})();
