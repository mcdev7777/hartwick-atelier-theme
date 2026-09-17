/*
 * Hartwick Atelier — The Cloth: index <-> photograph.
 *
 * Aloha, 16 September 2026: "Selecting an item should focus its image and
 * caption; hover may add emphasis but cannot be the only way to reveal
 * information."
 *
 * Selecting an index item scrolls its photograph into view, marks it current,
 * and moves keyboard focus onto the figure so a screen-reader user lands on
 * the caption. Hovering an item lifts its photograph a touch (CSS); nothing is
 * revealed by hover alone — every caption is printed under its photograph.
 *
 * Additive: without this script the list is still a numbered list and the
 * photographs are still captioned.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function upgrade(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-cloth-target]'));
    if (!items.length) return;

    function figureFor(item) {
      return document.getElementById(item.getAttribute('data-cloth-target'));
    }

    function mark(active) {
      items.forEach(function (it) {
        var on = it === active;
        it.setAttribute('aria-current', on ? 'true' : 'false');
        var fig = figureFor(it);
        if (fig) fig.classList.toggle('ha-cloth__figure--current', on);
      });
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var fig = figureFor(item);
        if (!fig) return;
        mark(item);
        fig.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        // focus after the scroll settles so the browser does not fight it
        window.setTimeout(function () { fig.focus({ preventScroll: true }); }, reduce ? 0 : 350);
      });
      item.addEventListener('mouseenter', function () {
        var fig = figureFor(item);
        if (fig) fig.classList.add('ha-cloth__figure--hover');
      });
      item.addEventListener('mouseleave', function () {
        var fig = figureFor(item);
        if (fig) fig.classList.remove('ha-cloth__figure--hover');
      });
    });

    mark(items[0]);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('ha-cloth-index'), upgrade);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
