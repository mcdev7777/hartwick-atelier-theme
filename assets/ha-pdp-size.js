/*
 * Hartwick Atelier — "Before selection, the button asks for a size."
 * Aloha's product-page brief, 16 September 2026.
 *
 * Shopify always resolves a variant — the first available one — so a fresh
 * product page arrives with a size already ticked and the form ready to
 * submit. This script, loaded only when sections/ha-product.liquid has decided
 * the page qualifies (a multi-size garment, on sale, opened without a
 * ?variant= link), takes that assumption back:
 *
 *   - no size is ticked;
 *   - the submit button is disabled and reads the prompt ("Select a size");
 *   - the first real choice hands everything to Luxe's own product-info.js,
 *     which fetches the chosen variant's state and re-enables the button with
 *     the right label, exactly as it does on any other change.
 *
 * Nothing about the form, its inputs or the cart is touched. Without this
 * script the page behaves as Shopify does by default.
 */
(function () {
  'use strict';

  function init() {
    var info = document.querySelector('product-info[data-ha-size-unset="true"]');
    if (!info) return;
    var prompt = info.getAttribute('data-ha-size-prompt') || 'Select a size';
    var selects = info.querySelector('variant-selects');
    var sectionId = info.dataset.section;
    var button = document.getElementById('ProductSubmitButton-' + sectionId);
    if (!selects || !button) return;

    var radios = Array.prototype.slice.call(selects.querySelectorAll('input[type="radio"]'));
    var dropdown = selects.querySelector('select');
    if (!radios.length && !dropdown) return; // nothing to un-choose

    var label = button.querySelector('span');
    var original = label ? label.textContent : '';

    radios.forEach(function (r) { r.checked = false; });
    if (dropdown && !radios.length) {
      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = prompt;
      placeholder.selected = true;
      placeholder.disabled = true;
      dropdown.insertBefore(placeholder, dropdown.firstChild);
    }
    button.setAttribute('disabled', '');
    button.setAttribute('aria-disabled', 'true');
    if (label) label.textContent = prompt;

    function release() {
      info.classList.remove('ha-pdp--size-unset');
      info.removeAttribute('data-ha-size-unset');
      button.removeAttribute('aria-disabled');
      if (label && label.textContent === prompt) label.textContent = original;
      selects.removeEventListener('change', release, true);
      // Luxe's product-info.js is listening to the same change and will
      // fetch the variant and set the button's real state from the response.
    }
    selects.addEventListener('change', release, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
