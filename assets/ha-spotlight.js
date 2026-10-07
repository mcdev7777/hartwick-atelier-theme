/*
 * Hartwick Atelier — homepage Collection Index spotlight.
 *
 * Ivan, 6 October 2026: one montage stays put; hovering a row in the left
 * rail lights the photograph(s) for that collection and fades the others,
 * as a film-programme index does. Leaving the row brings every frame back.
 *
 * Rows and frames both carry data-spot = their link. A row lights every
 * frame inside its collection: the same page, a #section of it (Loungewear
 * is /collections/apparel#loungewear) or a page beneath it (a tag filter,
 * /collections/apparel/...). Ivan, 6 October: Loungewear and everything in
 * Apparel light up with Apparel. A mouse uses hover, a keyboard
 * uses focus; a finger never gets a hover step and just follows the link
 * (§07). No clicks are intercepted. Without the script nothing fades.
 */
(function () {
  if (customElements.get('ha-spotlight')) return;

  class HaSpotlight extends HTMLElement {
    connectedCallback() {
      this.rows = Array.from(this.querySelectorAll('.ha-home-index__link[data-spot]'));
      this.frames = Array.from(this.querySelectorAll('.ha-home-index__frame[data-spot]'));
      if (!this.rows.length || !this.frames.length) return;

      this.rows.forEach((row) => {
        row.addEventListener('pointerenter', (event) => {
          if (event.pointerType && event.pointerType !== 'mouse') return;
          this.light(row);
        });
        row.addEventListener('pointerleave', () => this.clear());
        row.addEventListener('focus', () => this.light(row));
        row.addEventListener('blur', () => this.clear());
      });
    }

    light(row) {
      const key = HaSpotlight.path(row.dataset.spot);
      const lit = this.frames.filter((f) => {
        const path = HaSpotlight.path(f.dataset.spot);
        return path === key || path.startsWith(key + '/');
      });
      this.rows.forEach((r) => r.classList.toggle('is-active', r === row));
      // A row with no matching photograph fades nothing.
      this.classList.toggle('is-spotlit', lit.length > 0);
      this.frames.forEach((f) => f.classList.toggle('is-lit', lit.includes(f)));
    }

    // The link without its #section, ?query or trailing slash.
    static path(url) {
      return (url || '').split(/[#?]/)[0].replace(/\/+$/, '').toLowerCase();
    }

    clear() {
      this.classList.remove('is-spotlit');
      this.rows.forEach((r) => r.classList.remove('is-active'));
      this.frames.forEach((f) => f.classList.remove('is-lit'));
    }
  }

  customElements.define('ha-spotlight', HaSpotlight);
})();
