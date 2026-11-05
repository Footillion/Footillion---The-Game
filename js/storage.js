/* Footillion storage: thin wrapper over localStorage (falls back to memory if blocked). */
(function (root) {
  'use strict';
  var PREFIX = 'footillion.v1.';
  var mem = {};

  function get(key, fallback) {
    try {
      var raw = root.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return mem.hasOwnProperty(key) ? mem[key] : fallback;
    }
  }
  function set(key, value) {
    try { root.localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { mem[key] = value; }
  }
  function remove(key) {
    try { root.localStorage.removeItem(PREFIX + key); } catch (e) { delete mem[key]; }
  }

  root.Store = { get: get, set: set, remove: remove, PREFIX: PREFIX };
})(window);
