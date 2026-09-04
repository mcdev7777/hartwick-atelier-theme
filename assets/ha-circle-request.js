/*
 * Hartwick Atelier — The Circle, request access.
 *
 * One job: fold the ticked interests into the single tags field Shopify's
 * storefront customer form accepts.
 *
 * Shopify's customer form takes email, first name, last name and
 * `contact[tags]`. It silently drops any other field name, so the interest
 * checkboxes cannot be form fields in their own right — they are read from
 * `data-circle-interest` and appended to the tag list as the form is submitted.
 *
 * PROGRESSIVE ENHANCEMENT IS THE POINT. The hidden field already holds
 * "Circle: Requested Access" in the HTML. If this script never loads, never
 * runs, or throws, the form still submits and the customer record still
 * carries the tag Aloha asked for. The interests are the enhancement; the
 * access request itself never depends on JavaScript.
 *
 * The vocabulary is controlled — every tag comes from a section block an editor
 * configured, never from anything a visitor typed — so no submission can invent
 * a tag and litter the customer list.
 */
(function () {
  'use strict';

  var SEP = ', ';

  function wire(form) {
    var tagField = form.querySelector('input[name="contact[tags]"]');
    if (!tagField) return;

    var base = tagField.getAttribute('data-circle-base-tag') || tagField.value;

    form.addEventListener('submit', function () {
      var tags = [];
      if (base) tags.push(base);

      form.querySelectorAll('input[data-circle-interest]').forEach(function (box) {
        if (!box.checked) return;
        var tag = (box.getAttribute('data-circle-interest') || '').trim();
        // Commas would split one interest into two tags on Shopify's side.
        tag = tag.replace(/,/g, ' ');
        if (tag && tags.indexOf(tag) === -1) tags.push(tag);
      });

      tagField.value = tags.join(SEP);
    });
  }

  function init() {
    document.querySelectorAll('.ha-crequest__form').forEach(wire);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
