/*
 * Hartwick Atelier — Collection Index.
 *
 * Pairs the numbered index with its image panel. Implemented as a tablist:
 * click and touch both select, arrow keys move between rows, and nothing
 * depends on hover — the wireframe's hover pairing is unreachable on touch
 * and by keyboard, so selection is explicit instead.
 */
class HaCollectionIndex extends HTMLElement {
  connectedCallback() {
    this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));
    if (!this.tabs.length) return;

    this.tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => this.select(i));
      tab.addEventListener('keydown', (e) => this.onKeydown(e, i));
    });

    this.select(this.tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true') || 0);
  }

  select(index) {
    const i = Math.max(0, Math.min(index, this.tabs.length - 1));
    this.tabs.forEach((tab, n) => {
      const selected = n === i;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    });
    this.panels.forEach((panel, n) => {
      panel.hidden = n !== i;
    });
  }

  onKeydown(event, index) {
    const last = this.tabs.length - 1;
    let next = null;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.select(next);
    this.tabs[next].focus();
  }
}

if (!customElements.get('ha-collection-index')) {
  customElements.define('ha-collection-index', HaCollectionIndex);
}
