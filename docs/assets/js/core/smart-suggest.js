/**
 * SolarVault — smart tool suggestions from pasted or typed input
 */
(function () {
  'use strict';

  function tryJson(s) {
    try {
      JSON.parse(s);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * @param {string} text raw input
   * @returns {{ slug: string, reason: string }[]}
   */
  function analyze(text) {
    var s = (text || '').trim();
    if (!s) return [];
    var out = [];
    var seen = {};
    function add(slug, reason) {
      if (seen[slug]) return;
      seen[slug] = 1;
      out.push({ slug: slug, reason: reason });
    }

    var oneLine = s.indexOf('\n') === -1;
    var parts = s.split('.');
    if (parts.length === 3 && parts.every(function (p) { return /^[A-Za-z0-9_-]+$/.test(p) && p.length > 1; }))
      add('jwt-decoder', 'Looks like a JWT (three Base64URL segments).');

    if (/^\s*[\[{]/.test(s) && tryJson(s)) add('json-formatter', 'Valid JSON object or array.');

    if (/^-----BEGIN (CERTIFICATE|PRIVATE KEY|RSA PRIVATE KEY)/m.test(s)) add('ssl-cert-decoder', 'PEM-encoded certificate or key block.');

    if (/\bSELECT\b/i.test(s) && /\bFROM\b/i.test(s)) add('sql-formatter', 'Looks like a SQL query.');

    if (/^\s*[^#\s][^:]+:\s*\S/m.test(s) && !/^\s*[\[{]/.test(s) && s.indexOf(':') !== -1 && s.split('\n').length > 1)
      add('yaml-formatter', 'YAML-style key: value lines.');

    if (/^\s*</.test(s) && />/.test(s)) add('xml-formatter', 'Looks like XML markup.');

    if (/%[0-9A-Fa-f]{2}/.test(s) && /\s|%2[0-9A-Fa-f]/i.test(s) && s.length < 8000) add('url-decode', 'Percent-encoded text or URL.');

    if (/^https?:\/\//i.test(s)) add('api-request-builder', 'Starts with an HTTP(S) URL.');

    if (/^[0-9a-fA-F]{32,}$/.test(s.replace(/\s+/g, '')) && s.replace(/\s+/g, '').length % 2 === 0 && s.replace(/\s+/g, '').length >= 32)
      add('hex-decode', 'Long hexadecimal string.');

    if (/^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, '').length > 40 && oneLine)
      add('base64-decode', 'Could be Base64-encoded data.');

    if (/^\d{10}$/.test(s) || /^\d{13}$/.test(s)) add('epoch-converter', 'Unix timestamp (seconds or milliseconds).');

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s))
      add('uuid-generator', 'UUID-shaped string.');

    if (/^(\*|[\d,-/]+)\s+(\*|[\d,-/]+)\s+(\*|[\d,-/]+)\s+(\*|[\d,-/]+)\s+(\*|[\dA-Za-z,-/]+)$/.test(s) && s.split(/\s+/).length === 5)
      add('cron-expression-explainer', 'Looks like a five-field cron expression.');

    if (/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/.test(s)) add('ip-address-tools', 'IPv4 address or CIDR.');

    if (/^#[0-9a-fA-F]{3,8}$/.test(s.trim())) add('color-converter', 'Hex color code.');

    if (/#\s|^\s*#{1,6}\s+\w/m.test(s) || (/^\s*[-*]\s/m.test(s) && s.indexOf('\n') !== -1))
      add('markdown-preview', 'Looks like Markdown.');

    if (s.length > 400 && oneLine && /^[A-Za-z0-9+/=]+$/.test(s.trim())) add('jwt-decoder', 'Long token-like string (try JWT decode).');

    return out.slice(0, 8);
  }

  window.SVAnalyzeInput = analyze;

  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initPanel() {
    var ta = document.getElementById('sv-smart-input');
    var out = document.getElementById('sv-smart-out');
    if (!ta || !out) return;

    function render() {
      var hits = analyze(ta.value);
      if (!hits.length) {
        out.innerHTML = '<p class="sv-smart-empty">Paste a JWT, JSON, SQL, YAML snippet, URL, hex, Base64, cron expression, or similar — we will suggest matching tools.</p>';
        return;
      }
      var base = typeof window.SV_BASE_PATH === 'string' ? window.SV_BASE_PATH : '';
      var list = (window.SV_TOOLS_LIST || []).reduce(function (m, t) {
        m[t.slug] = t;
        return m;
      }, {});
      out.innerHTML = '<ul class="sv-smart-list">' + hits.map(function (h) {
        var t = list[h.slug];
        var title = esc(t ? t.title : h.slug);
        var tag = esc(t ? t.tagline : '');
        return '<li><a href="' + base + '/tools/' + h.slug + '/" class="sv-smart-link">'
          + '<span class="sv-smart-link-title">' + title + '</span>'
          + '<span class="sv-smart-link-reason">' + esc(h.reason) + '</span>'
          + (tag ? '<span class="sv-smart-link-tag">' + tag + '</span>' : '')
          + '</a></li>';
      }).join('') + '</ul>';
    }

    ta.addEventListener('input', debounce(render, 280));
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPanel);
  else initPanel();
})();
