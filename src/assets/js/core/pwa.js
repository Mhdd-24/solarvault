/**
 * SolarVault — offline PWA: service worker + offline indicator
 */
(function () {
  'use strict';

  var base = typeof window.SV_BASE_PATH === 'string' ? window.SV_BASE_PATH : '';

  function bannerHtml() {
    return '<span class="sv-offline-banner__ic" aria-hidden="true"></span>'
      + '<span class="sv-offline-banner__txt">You are offline. Opened pages stay available from cache. Reconnect to refresh content.</span>';
  }

  function showOffline() {
    if (document.getElementById('sv-offline-banner')) return;
    var el = document.createElement('div');
    el.id = 'sv-offline-banner';
    el.className = 'sv-offline-banner';
    el.setAttribute('role', 'status');
    el.innerHTML = bannerHtml();
    if (document.body) document.body.insertBefore(el, document.body.firstChild);
  }

  function hideOffline() {
    var el = document.getElementById('sv-offline-banner');
    if (el) el.remove();
  }

  window.addEventListener('online', hideOffline);
  window.addEventListener('offline', showOffline);
  if (typeof navigator !== 'undefined' && navigator.onLine === false) showOffline();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      var regUrl = (base.replace(/\/$/, '') || '') + '/sw.js';
      var scope = base ? base.replace(/\/$/, '') + '/' : '/';
      navigator.serviceWorker.register(regUrl, { scope: scope }).catch(function () {});
    });
  }
})();
