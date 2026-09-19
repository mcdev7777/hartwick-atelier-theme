/*
 * Hartwick Atelier — The Masters: the glossary and the films.
 *
 * Aloha's build brief, 18 September 2026.
 *
 * GLOSSARY (§3). Eleven ruled rows; one entry open at a time, with an
 * explicit Close control. The rows are real buttons carrying aria-expanded
 * and each panel is a labelled region, so Enter and Space already work and
 * nothing here re-implements a keyboard. The complete text of every entry is
 * in the HTML at all times: the panels are collapsed by THIS script, not by
 * the server, so with no script the page reads as a long glossary and with
 * it the page behaves as the artboard draws. Every technique has a stable id
 * (#khadi, #handwoven …): a direct link opens that entry on arrival, and a
 * hash change during the visit opens the entry it names. History is never
 * written to, so the Back button behaves normally, and the page is only ever
 * scrolled to keep the row the visitor is reading in view — never on hover,
 * never as an animation.
 *
 * FILMS (§4). A film begins only on its visible Play button. Once playing it
 * shows the browser's own controls (pause, sound, captions, full screen).
 * One film plays at a time; a film that leaves view pauses; a film inside a
 * glossary entry pauses when that entry closes. Sound is off at the start
 * when the section says so ("sound on request"), and the mute control on
 * the player turns it on. Nothing autoplays, nothing reacts to hover or
 * scroll, and the video file is not requested before Play (preload="none").
 *
 * MEASUREMENT (§5). Glossary opens and film plays are announced as DOM
 * events (ha:glossary-open, ha:film-play, ha:journal-visit) and pushed to
 * window.dataLayer when one exists, so the site's existing analytics and
 * consent handling decide what is recorded. No new tracking is loaded here.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-mst]');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function announce(name, detail) {
    try {
      root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail }));
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: name, ha_detail: detail });
      }
    } catch (e) { /* measurement never breaks the page */ }
  }

  /* ------------------------------------------------------------------ */
  /* Films                                                                */
  /* ------------------------------------------------------------------ */

  var films = Array.prototype.slice.call(root.querySelectorAll('[data-mst-film]'));
  var startMuted = root.getAttribute('data-mst-muted') !== 'false';

  function videoOf(film) { return film.querySelector('video'); }

  function pauseFilm(film) {
    var v = videoOf(film);
    if (v && !v.paused) v.pause();
  }

  function pauseOthers(except) {
    films.forEach(function (f) { if (f !== except) pauseFilm(f); });
  }

  function startFilm(film) {
    var v = videoOf(film);
    if (!v) return;
    pauseOthers(film);
    film.classList.add('is-playing');
    v.controls = true;
    v.muted = startMuted;
    var p = v.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {
        // The browser refused (rare on a click). Leave the controls showing so
        // the visitor can press the player's own play button.
      });
    }
    // Keyboard users land on the player, where the native controls live.
    try { v.focus({ preventScroll: true }); } catch (e) { v.focus(); }
  }

  films.forEach(function (film) {
    var v = videoOf(film);
    var play = film.querySelector('[data-mst-play]');
    if (!v || !play) return;

    play.addEventListener('click', function () {
      startFilm(film);
      announce('ha:film-play', { film: v.id || v.getAttribute('aria-label') || '' });
    });

    // Another film starting (or the player's own play button) still means only
    // one at a time.
    v.addEventListener('play', function () {
      film.classList.add('is-playing');
      v.controls = true;
      pauseOthers(film);
    });

    // Out of view → paused. The observer measures the frame, not the page.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting || e.intersectionRatio < 0.2) pauseFilm(film);
        });
      }, { threshold: [0, 0.2] });
      io.observe(film);
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) films.forEach(pauseFilm);
  });

  /* ------------------------------------------------------------------ */
  /* Journal link                                                         */
  /* ------------------------------------------------------------------ */

  var journal = root.querySelector('[data-mst-journal]');
  if (journal) {
    journal.addEventListener('click', function () {
      announce('ha:journal-visit', { href: journal.getAttribute('href') });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Glossary                                                             */
  /* ------------------------------------------------------------------ */

  var rows = Array.prototype.slice.call(root.querySelectorAll('[data-mst-row]'));
  if (!rows.length) return;

  function partsOf(row) {
    return {
      row: row,
      toggle: row.querySelector('[data-mst-toggle]'),
      panel: row.querySelector('[data-mst-panel]'),
      close: row.querySelector('[data-mst-close]')
    };
  }

  var entries = rows.map(partsOf).filter(function (e) { return e.toggle && e.panel; });
  var open = null;

  function setState(entry, isOpen) {
    entry.toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    entry.panel.hidden = !isOpen;
    entry.panel.classList.toggle('is-open', isOpen);
    entry.row.classList.toggle('is-open', isOpen);
    if (!isOpen) {
      Array.prototype.forEach.call(entry.panel.querySelectorAll('[data-mst-film]'), pauseFilm);
    }
  }

  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= window.innerHeight;
  }

  function keepInView(el) {
    // Only when the row's title has left the screen: closing a long entry
    // from its Close button at the bottom must not strand the reader far
    // below the row they were on. `nearest` moves the page the least it can.
    if (inView(el)) return;
    el.scrollIntoView({ block: 'nearest', behavior: reduced.matches ? 'auto' : 'smooth' });
  }

  function openEntry(entry, opts) {
    opts = opts || {};
    if (open && open !== entry) setState(open, false);
    open = entry;
    setState(entry, true);
    if (opts.reveal) {
      // Arrival by direct link: bring the row to the top so the entry reads
      // from its title. scroll-margin-top on the row clears the site header.
      entry.row.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
    // A click opens in place: the row the visitor pressed stays where it is
    // and the entry unfolds beneath it. No scrolling on open.
    announce('ha:glossary-open', { technique: entry.row.id });
  }

  function closeEntry(entry, returnFocus) {
    setState(entry, false);
    if (open === entry) open = null;
    if (returnFocus) {
      try { entry.toggle.focus({ preventScroll: true }); } catch (e) { entry.toggle.focus(); }
    }
    keepInView(entry.toggle);
  }

  entries.forEach(function (entry) {
    setState(entry, false);
    entry.toggle.addEventListener('click', function () {
      if (open === entry) closeEntry(entry, false);
      else openEntry(entry);
    });
    if (entry.close) {
      entry.close.addEventListener('click', function () { closeEntry(entry, true); });
    }
    // Escape inside an open entry closes it and returns to its row.
    entry.panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open === entry) {
        e.preventDefault();
        closeEntry(entry, true);
      }
    });
  });

  function entryFor(hash) {
    var id = (hash || '').replace(/^#/, '');
    if (!id) return null;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].row.id === id) return entries[i];
    }
    return null;
  }

  function openFromHash(reveal) {
    var entry = entryFor(window.location.hash);
    if (entry) openEntry(entry, { reveal: reveal });
  }

  // The browser has already jumped to #id by the time this runs; opening the
  // entry then re-aligning to its title is the "reveal" the brief asks for.
  openFromHash(true);
  window.addEventListener('hashchange', function () { openFromHash(true); });

})();
