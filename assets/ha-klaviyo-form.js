/*
 * Hartwick Atelier — The Register and the Circle request, submitted to Klaviyo.
 *
 * WHY THIS EXISTS. Klaviyo's embedded form cannot be made to match the design
 * without either restyling it inside Klaviyo (colours and type in two places,
 * against the rule that brand styling lives in the theme) or overriding its
 * markup with CSS Klaviyo says it may change without notice. So the theme keeps
 * its own form — the one that already matches the wireframe — and this script
 * sends it where the Klaviyo form would have sent it: the public client
 * subscription endpoint. Same list, same double opt-in, same consent record,
 * same `register_source` property. Only the markup is ours.
 *
 * PROGRESSIVE ENHANCEMENT. The form in the HTML is still Shopify's customer
 * form. If this script never loads, the visitor still lands as a Shopify
 * customer with the section's tag and the Shopify → Klaviyo sync picks them up.
 * With the script running, Shopify is NOT also posted to — one submission, one
 * consent event, one source of truth.
 *
 * WHAT IS SENT. Email, optional names, the placement's `register_source`, any
 * `data-klaviyo-prop` field, and the ticked Circle interests as a list. Consent
 * is only ever "SUBSCRIBED" and only when the box is ticked — the box is never
 * pre-ticked, which is a CASL requirement (the entity is in British Columbia).
 *
 * STATES, from the mobile brief §4: default · focused (CSS) · invalid email ·
 * consent error · submitting · success · network or service error. "Already
 * subscribed" is not distinguishable — Klaviyo answers 202 either way and, with
 * double opt-in, simply re-sends the confirmation — so the success copy reads
 * as "check your inbox" rather than "you're in".
 *
 * AFTER SUCCESS the browser is tied to the profile with klaviyo.identify(), so
 * the product views that follow attach to the person. The embedded form did
 * this silently; here it has to be explicit.
 *
 * EVENT MODE (28 September 2026, The Circle). A form carrying
 * `data-klaviyo-event="…"` is not a subscription: it records that event on the
 * profile through the client events endpoint — no list, no double opt-in, no
 * marketing consent — and Klaviyo flows triggered on that metric send the
 * replies and alert the Atelier. This is what keeps The Circle separate from
 * The Register: a Circle request or reply never subscribes anyone. Everything
 * the form collects travels as event properties, so nothing on the profile
 * (register_source included) is overwritten. A consent box, if the section
 * draws one, still has to be ticked, but it records no marketing consent.
 */
(function () {
  'use strict';

  if (window.__haKlaviyoForm) return;
  window.__haKlaviyoForm = true;

  var ENDPOINT = 'https://a.klaviyo.com/client/subscriptions/';
  var EVENT_ENDPOINT = 'https://a.klaviyo.com/client/events/';
  var REVISION = '2025-04-15';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setState(form, state, message, isError) {
    form.setAttribute('data-state', state);
    var status = form.querySelector('[data-ha-form-status]');
    if (!status) return;
    status.textContent = message || '';
    status.hidden = !message;
    status.classList.toggle('is-error', !!isError);
    if (message) status.focus({ preventScroll: true });
  }

  function text(form, key) {
    return form.getAttribute('data-msg-' + key) || '';
  }

  function identify(email) {
    try {
      if (window.klaviyo && typeof window.klaviyo.identify === 'function') {
        window.klaviyo.identify({ email: email });
        return;
      }
      window._learnq = window._learnq || [];
      window._learnq.push(['identify', { $email: email }]);
    } catch (e) { /* tracking is never allowed to break the form */ }
  }

  function collect(form) {
    var email = (form.querySelector('input[name="contact[email]"]') || {}).value || '';
    var first = (form.querySelector('input[name="contact[first_name]"]') || {}).value || '';
    var last = (form.querySelector('input[name="contact[last_name]"]') || {}).value || '';
    var source = form.getAttribute('data-source') || '';

    var props = {};
    if (source) props.register_source = source;

    form.querySelectorAll('[data-klaviyo-prop]').forEach(function (el) {
      var key = el.getAttribute('data-klaviyo-prop');
      var val = (el.value || '').trim();
      if (key && val) props[key] = val;
    });

    var interests = [];
    form.querySelectorAll('input[data-circle-interest]:checked').forEach(function (box) {
      var v = (box.getAttribute('data-circle-interest') || '').trim();
      if (v) interests.push(v);
    });
    if (interests.length) props.circle_interests = interests;

    var eventName = form.getAttribute('data-klaviyo-event');
    if (eventName) {
      var person = { email: email.trim() };
      var given = first.trim();
      var family = last.trim();
      // A single "Full name" field arrives in first_name; split it so the
      // welcome can say "Dear Jane" rather than "Dear Jane Smith".
      if (given && !family && props.full_name) {
        var parts = given.split(/\s+/);
        given = parts.shift();
        family = parts.join(' ');
      }
      if (given) { person.first_name = given; props.first_name = given; }
      if (family) { person.last_name = family; props.last_name = family; }
      return {
        data: {
          type: 'event',
          attributes: {
            properties: props,
            metric: { data: { type: 'metric', attributes: { name: eventName } } },
            profile: { data: { type: 'profile', attributes: person } }
          }
        }
      };
    }

    var attrs = {
      email: email.trim(),
      properties: props,
      subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } }
    };
    if (first.trim()) attrs.first_name = first.trim();
    if (last.trim()) attrs.last_name = last.trim();

    return {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: source || 'theme_form',
          profile: { data: { type: 'profile', attributes: attrs } }
        },
        relationships: {
          list: { data: { type: 'list', id: form.getAttribute('data-list-id') } }
        }
      }
    };
  }

  function wire(form) {
    var company = form.getAttribute('data-company-id');
    var listId = form.getAttribute('data-list-id');
    var isEvent = !!form.getAttribute('data-klaviyo-event');
    // Without somewhere to send it, let Shopify's form do its job.
    if (!company || (!listId && !isEvent) || !window.fetch) return;
    var endpoint = isEvent ? EVENT_ENDPOINT : ENDPOINT;

    var button = form.querySelector('button[type="submit"]');
    var emailField = form.querySelector('input[name="contact[email]"]');
    var consent = form.querySelector('input[data-ha-consent]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = (emailField && emailField.value || '').trim();
      if (!EMAIL_RE.test(email)) {
        setState(form, 'invalid', text(form, 'invalid'), true);
        if (emailField) { emailField.setAttribute('aria-invalid', 'true'); emailField.focus(); }
        return;
      }
      if (emailField) emailField.removeAttribute('aria-invalid');

      if (consent && !consent.checked) {
        setState(form, 'invalid', text(form, 'consent'), true);
        consent.focus();
        return;
      }

      setState(form, 'submitting', text(form, 'submitting'), false);
      if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }

      fetch(endpoint + '?company_id=' + encodeURIComponent(company), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'revision': REVISION
        },
        body: JSON.stringify(collect(form))
      }).then(function (res) {
        if (res.status >= 200 && res.status < 300) {
          setState(form, 'success', text(form, 'success'), false);
          identify(email);
          form.reset();
          return;
        }
        throw new Error('Klaviyo responded ' + res.status);
      }).catch(function () {
        setState(form, 'error', text(form, 'error'), true);
      }).then(function () {
        if (button && form.getAttribute('data-state') !== 'success') {
          button.disabled = false;
          button.removeAttribute('aria-busy');
        }
      });
    });
  }

  function init() {
    document.querySelectorAll('form[data-ha-klaviyo]').forEach(wire);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
