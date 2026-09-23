/* Hartwick Atelier — header utilities: REGION / LANGUAGE / THE CIRCLE drawers.
   The BAG is Luxe's cart drawer; these three open and close the same way —
   one drawer at a time, Escape and the overlay close it, focus is held inside
   while it is open and returned to the button that opened it.

   Choosing a region or a language needs no script: each choice is a submit
   button on Shopify's native /localization form. This file only opens the
   drawers, filters the country list and offers the region suggestion. */
(function () {
  if (window.haUtilities) return;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var active = null;
  var trigger = null;

  function drawer(name) {
    return document.querySelector('[data-ha-drawer="' + name + '"]');
  }

  function closeLuxeDrawers() {
    var cart = document.querySelector('cart-drawer.active');
    if (cart && typeof cart.close === 'function') cart.close();
  }

  function open(name, opener) {
    var el = drawer(name);
    if (!el) return;
    if (active && active !== el) close(true);
    closeLuxeDrawers();
    trigger = opener || document.activeElement;
    active = el;
    el.hidden = false;
    // one frame so the transition runs from the closed state
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('is-open'); });
    });
    document.documentElement.classList.add('ha-drawer-open');
    document.querySelectorAll('[aria-controls="HaDrawer-' + name + '"]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'true');
    });
    // Focus the dialog itself: announced by its title, and no phone keyboard
    // jumps up for the country search. Tab moves on to the close control.
    var inner = el.querySelector('.ha-drawer__inner');
    setTimeout(function () { inner.focus({ preventScroll: true }); }, 60);
  }

  function close(keepFocus) {
    if (!active) return;
    var el = active;
    var name = el.getAttribute('data-ha-drawer');
    active = null;
    el.classList.remove('is-open');
    document.documentElement.classList.remove('ha-drawer-open');
    document.querySelectorAll('[aria-controls="HaDrawer-' + name + '"]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
    var done = function () { if (!el.classList.contains('is-open')) el.hidden = true; };
    el.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 450);
    if (!keepFocus && trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-ha-open]');
    if (opener) {
      e.preventDefault();
      open(opener.getAttribute('data-ha-open'), opener);
      return;
    }
    if (active && e.target.closest('[data-ha-close]')) {
      e.preventDefault();
      close();
    }
  });

  // Opening the BAG closes any of these first, so two drawers never stack.
  document.addEventListener('click', function (e) {
    if (active && e.target.closest('#cart-link')) close(true);
  }, true);

  document.addEventListener('keydown', function (e) {
    if (!active) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(active.querySelectorAll(FOCUSABLE), function (n) {
      return n.offsetParent !== null || n === document.activeElement;
    });
    if (!items.length) return;
    var firstItem = items[0];
    var lastItem = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === firstItem || !active.contains(document.activeElement))) {
      e.preventDefault();
      lastItem.focus();
    } else if (!e.shiftKey && document.activeElement === lastItem) {
      e.preventDefault();
      firstItem.focus();
    }
  });

  /* --- country filter ---------------------------------------------------- */
  document.addEventListener('input', function (e) {
    var input = e.target.closest('[data-ha-filter]');
    if (!input) return;
    var list = document.getElementById(input.getAttribute('data-ha-filter'));
    if (!list) return;
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    list.querySelectorAll('[data-ha-filter-text]').forEach(function (li) {
      var hit = !q || li.getAttribute('data-ha-filter-text').indexOf(q) !== -1;
      li.hidden = !hit;
      if (hit) shown++;
    });
    var empty = list.parentElement.querySelector('[data-ha-filter-empty]');
    if (empty) empty.hidden = shown !== 0;
  });

  /* --- region suggestion --------------------------------------------------
     Shopify's browsing-context endpoint reports the country it detects for
     this visitor. If that country is one Hartwick sells to and is not the
     one being shown, a quiet note offers the switch. It never switches by
     itself, and "Stay" is remembered in this browser for that country. */
  function storage(fn) {
    try { return fn(window.localStorage); } catch (err) { return null; }
  }

  function suggest() {
    var box = document.getElementById('HaRegionSuggest');
    if (!box || window.Shopify && window.Shopify.designMode) return;
    var current = box.getAttribute('data-current-country');
    var currentLang = box.getAttribute('data-current-language');
    var countries = {};
    try {
      countries = JSON.parse(box.querySelector('[data-ha-countries]').textContent);
    } catch (err) { return; }

    var url = '/browsing_context_suggestions.json' +
      '?country[enabled]=true&country[exclude]=' + encodeURIComponent(current) +
      '&language[enabled]=true&language[exclude]=' + encodeURIComponent(currentLang);

    fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.suggestions || !data.suggestions.length) return;
        var parts = data.suggestions[0].parts || {};
        var country = parts.country && parts.country.handle;
        if (!country || country === current || !countries[country]) return;
        if (storage(function (s) { return s.getItem('ha-region-stay'); }) === country) return;

        var language = parts.language && parts.language.handle;
        var name = countries[country].name;
        box.querySelector('[data-ha-suggest-country]').value = country;
        if (language) box.querySelector('[data-ha-suggest-language]').value = language;
        box.querySelector('[data-ha-suggest-line]').textContent =
          box.getAttribute('data-line').replace('[country]', name);
        box.querySelector('[data-ha-suggest-go]').textContent = box.getAttribute('data-go')
          .replace('[country]', name).replace('[currency]', countries[country].currency);
        box.querySelector('[data-ha-suggest-stay]').textContent = box.getAttribute('data-stay')
          .replace('[country]', box.getAttribute('data-current-name'));
        box.hidden = false;
        requestAnimationFrame(function () { box.classList.add('is-open'); });

        box.querySelector('[data-ha-suggest-stay]').addEventListener('click', function () {
          storage(function (s) { s.setItem('ha-region-stay', country); });
          box.classList.remove('is-open');
          setTimeout(function () { box.hidden = true; }, 300);
        });
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', suggest);
  } else {
    suggest();
  }

  window.haUtilities = { open: open, close: close };
})();
