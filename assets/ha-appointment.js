/*
 * Hartwick Atelier — Request Private Appointment modal.
 *
 * Aloha, 3 September 2026: "Please make this a modal enquiry form rather than
 * taking the customer away from the product page. It should automatically
 * record the product or Style being viewed."
 *
 * The markup, the fields and everything knowable at render time are in
 * snippets/ha-appointment.liquid. This file does the three things that can only
 * be done in the browser:
 *
 *   1. open and close the dialog;
 *   2. read the size the visitor has actually selected out of the live product
 *      form, so the enquiry records the size on screen rather than the one that
 *      happened to be first when the page was built;
 *   3. re-open the dialog after the form posts, so the visitor sees the outcome
 *      of their own submission instead of being dropped back at the top of the
 *      product page with no acknowledgement.
 *
 * Native <dialog> deliberately: showModal() gives the focus trap, the Escape
 * key, the inert background and the backdrop from the browser, correctly, and
 * a hand-rolled focus trap is one of the easiest things in a theme to get
 * subtly wrong. Where <dialog> is missing the button falls back to the store's
 * contact page, so the visitor is never left with a control that does nothing.
 */
(function () {
  'use strict';

  var SUPPORTED =
    typeof HTMLDialogElement === 'function' &&
    typeof HTMLDialogElement.prototype.showModal === 'function';

  /* The size the visitor is looking at right now.
   *
   * Read from the rendered form rather than from a variant lookup: Luxe renders
   * the picker as radios (`button` picker) or as a <select> (`dropdown`), the
   * theme editor can switch between them at any time, and the label text IS the
   * size. Anything checked in the product form is reported, so a second option —
   * length, say — is captured too rather than silently dropped. */
  function selectedOptions(root) {
    var form = root.closest('.product__info-container') || document;
    var parts = [];

    form.querySelectorAll('.product-form__input').forEach(function (field) {
      var name = field.querySelector('.form__label');
      var value = null;

      var checked = field.querySelector('input[type="radio"]:checked');
      if (checked) {
        var label = field.querySelector('label[for="' + CSS.escape(checked.id) + '"]');
        value = (label || checked).textContent;
      } else {
        var select = field.querySelector('select');
        if (select && select.selectedIndex >= 0) {
          value = select.options[select.selectedIndex].textContent;
        }
      }

      if (!value) return;
      value = value.trim();
      if (!value) return;

      var key = name ? name.textContent.trim().replace(/[:\s]+$/, '') : '';
      parts.push(key ? key + ': ' + value : value);
    });

    return parts.join(' · ');
  }

  function init() {
    var dialog = document.getElementById('HaAppointmentDialog');
    if (!dialog) return;

    var openers = document.querySelectorAll('[data-ha-appointment-open]');
    var sizeField = dialog.querySelector('[data-ha-appointment-size]');
    var lastFocused = null;

    // No <dialog>: send the visitor somewhere real rather than nowhere.
    if (!SUPPORTED) {
      dialog.remove();
      openers.forEach(function (button) {
        var link = document.createElement('a');
        link.className = button.className;
        link.href = '/pages/contact';
        link.textContent = button.textContent;
        button.replaceWith(link);
      });
      return;
    }

    function open(trigger) {
      lastFocused = trigger || document.activeElement;
      if (sizeField) sizeField.value = selectedOptions(dialog);
      dialog.showModal();

      // Skip past the close button to the first thing the visitor has to fill in.
      var first = dialog.querySelector('input:not([type="hidden"]), textarea');
      if (first) first.focus();
    }

    function close() {
      dialog.close();
    }

    openers.forEach(function (button) {
      button.addEventListener('click', function () {
        open(button);
      });
    });

    dialog.querySelectorAll('[data-ha-appointment-close]').forEach(function (button) {
      button.addEventListener('click', close);
    });

    // Clicking the backdrop closes. The backdrop is the dialog element itself —
    // its child .ha-appointment__inner is the visible panel — so a click whose
    // target is the dialog and not the panel landed outside the form.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) close();
    });

    // Return focus where it came from, however the dialog was dismissed
    // (button, backdrop or Escape).
    dialog.addEventListener('close', function () {
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    });

    /* After posting, Shopify reloads the product page with ?contact_posted=…
     * and the form renders its own success or error state. Without this the
     * visitor lands back at the top of the page with no sign that anything
     * happened. The status element is present only on that render, so its
     * presence is the whole test — no URL parsing, and nothing to keep in step
     * with Shopify's parameter names. */
    if (dialog.querySelector('[data-ha-appointment-status]')) {
      open(null);
      var status = dialog.querySelector('[data-ha-appointment-status]');
      if (status) status.focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
