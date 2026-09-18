/*
 * Hartwick Atelier — The Collection Index: name <-> image <-> caption.
 *
 * Aloha's Collection Index brief, 17 September 2026: hovering or focusing an
 * index name reveals ONLY its matching photograph in colour and underlines
 * the matching name and caption; hovering or focusing the photograph or
 * caption activates the same connection. Restore the resting state when
 * pointer and focus leave the linked set. Never scroll on hover.
 *
 * The index link and the card link share a data-idx key and live in
 * different containers, so CSS alone cannot connect them; this adds
 * `is-active` to every element carrying the same key. Without the script the
 * card still colours on its own hover (CSS) and every link still works.
 */
(function () {
  'use strict';
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-idx]'));
  if (!nodes.length) return;
  var byKey = {};
  nodes.forEach(function (n) { (byKey[n.getAttribute('data-idx')] = byKey[n.getAttribute('data-idx')] || []).push(n); });
  function set(key, on) {
    (byKey[key] || []).forEach(function (n) { n.classList.toggle('is-active', on); });
  }
  nodes.forEach(function (n) {
    var key = n.getAttribute('data-idx');
    n.addEventListener('mouseenter', function () { set(key, true); });
    n.addEventListener('mouseleave', function () { set(key, false); });
    n.addEventListener('focusin', function () { set(key, true); });
    n.addEventListener('focusout', function () { set(key, false); });
  });
})();
