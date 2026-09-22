/*
 * Hartwick Atelier — homepage index ↔ image pairing.
 *
 * Aloha's Hartwick_Homepage_Editorial artboard, 19 September 2026, §04 and
 * §06: "Hover or keyboard focus selects a category and its matching montage;
 * click follows the category destination." "Hover/focus pairs each name with
 * matching media; click opens that technique on The Masters page." And §07:
 * "Touch links must work directly without a hover step."
 *
 * So the rows are ordinary links and this script never intercepts a click.
 * It only decides which panel is showing:
 *
 *   - a mouse arriving over a row selects its panel (pointer type checked,
 *     so a finger tapping a row does not first have to "hover" it);
 *   - keyboard focus on a row selects its panel, so Tab walks the montage;
 *   - the selection stays when the pointer leaves — the last category read
 *     is the one still pictured, as the artboard shows;
 *   - a row with no panel of its own falls back to the default panel, so a
 *     category whose image set has not been supplied yet does not blank the
 *     picture.
 *
 * Two modes, set by data-pair-mode on the element:
 *   "swap" (default)  panels are shown/hidden with the hidden attribute
 *   "fade"            panels stay in the DOM and only .is-active moves, so
 *                     the CSS can cross-fade stacked backgrounds; under
 *                     prefers-reduced-motion the CSS cuts instead of fading.
 *
 * With no script the first panel is the one the server left visible and
 * every row still links where it should.
 *
 * Two sections on the page (the Index and the Masters) each load this file,
 * so the browser runs it twice; the wrapper makes the second run a no-op
 * rather than a duplicate class declaration.
 */
(function () {
  if (customElements.get('ha-pair')) return;

class HaPair extends HTMLElement {
  connectedCallback() {
    this.links = Array.from(this.querySelectorAll('[data-pair-for]'));
    this.panels = Array.from(this.querySelectorAll('[data-pair-panel]'));
    if (!this.links.length || !this.panels.length) return;

    this.mode = this.getAttribute('data-pair-mode') || 'swap';
    this.fallback = this.panels.find((p) => p.hasAttribute('data-pair-default')) || this.panels[0];

    this.links.forEach((link) => {
      link.addEventListener('pointerenter', (event) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;
        this.activate(link.dataset.pairFor);
      });
      link.addEventListener('focus', () => this.activate(link.dataset.pairFor));
    });

    const initial = this.getAttribute('data-pair-active') || this.links[0].dataset.pairFor;
    this.activate(initial);
    this.warm();
  }

  /*
   * The pictures behind the other rows are lazy — §10 lazy-loads lower
   * imagery — but a lazy image in a hidden panel is not fetched until the
   * panel shows, so the first hover would paint the placeholder field for a
   * beat. Once the section comes within a screen of the viewport the hidden
   * panels' images are switched to eager, so they arrive before a hand does.
   */
  warm() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      this.panels.forEach((panel) => {
        panel.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
      });
    }, { rootMargin: '100% 0px' });
    observer.observe(this);
  }

  activate(key) {
    const target = this.panels.find((p) => p.dataset.pairPanel === key) || this.fallback;

    this.links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.pairFor === key);
    });

    this.panels.forEach((panel) => {
      const on = panel === target;
      panel.classList.toggle('is-active', on);
      if (this.mode === 'swap') panel.hidden = !on;
    });
  }
}

  customElements.define('ha-pair', HaPair);
})();
