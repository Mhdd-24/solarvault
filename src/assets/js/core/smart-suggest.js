/**
 * SolarVault — Smart Auto-Detection Engine (paste → detect → open tool with payload)
 */
(function () {
  'use strict';

  var HANDOFF_KEY = 'sv_smart_handoff';

  function tryJson(s) {
    try {
      JSON.parse(s);
      return true;
    } catch (_) {
      return false;
    }
  }

  function stripBom(t) {
    return t.replace(/^\uFEFF/, '');
  }

  function isJwtShape(s) {
    var parts = s.split('.');
    if (parts.length !== 3) return false;
    return parts.every(function (p) {
      return /^[A-Za-z0-9_-]+$/.test(p) && p.length >= 4;
    });
  }

  function looksLikeHttpUrl(s) {
    return /^https?:\/\//i.test(s.trim());
  }

  function hasPercentEncoding(s) {
    return /%[0-9A-Fa-f]{2}/.test(s);
  }

  function tryBase64Payload(s) {
    if (isJwtShape(s)) return false;
    var t = s.replace(/\s+/g, '');
    if (t.length < 16) return false;
    if (!/^[A-Za-z0-9+/=_-]+$/.test(t)) return false;
    if (t.indexOf('.') !== -1 && t.split('.').length === 3) return false;
    var norm = t.replace(/-/g, '+').replace(/_/g, '/');
    while (norm.length % 4) norm += '=';
    try {
      atob(norm);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * @param {string} text raw input
   * @returns {{ slug: string, reason: string, primary?: boolean }[]}
   */
  function analyze(text) {
    var s = stripBom((text || '').trim());
    if (!s) return [];
    var out = [];
    var seen = {};
    function add(slug, reason, primary) {
      if (seen[slug]) return;
      seen[slug] = 1;
      out.push({ slug: slug, reason: reason, primary: !!primary });
    }

    var oneLine = s.indexOf('\n') === -1;

    /* ── JWT (before JSON — three Base64URL segments) ── */
    if (isJwtShape(s)) {
      add('jwt-decoder', 'Detected JWT — open JWT Decoder to inspect header, payload, and signature.', true);
    }

    /* ── PEM / certs ── */
    if (/^-----BEGIN (CERTIFICATE|PRIVATE KEY|RSA PRIVATE KEY)/m.test(s)) {
      add('ssl-cert-decoder', 'PEM-encoded certificate or key block.', !out.length);
    }

    /* ── JSON ── */
    if (/^\s*[\[{]/.test(s) && tryJson(s)) {
      add('json-formatter', 'Detected valid JSON — open JSON Formatter to validate and pretty-print.', true);
    }

    /* ── SQL ── */
    if (/\bSELECT\b/i.test(s) && /\bFROM\b/i.test(s)) {
      add('sql-formatter', 'Looks like a SQL query.', !out.length);
    }

    /* ── YAML ── */
    if (/^\s*[^#\s][^:]+:\s*\S/m.test(s) && !/^\s*[\[{]/.test(s) && s.indexOf(':') !== -1 && s.split('\n').length > 1) {
      add('yaml-formatter', 'YAML-style key: value lines.', !out.length);
    }

    /* ── XML ── */
    if (/^\s*</.test(s) && />/.test(s)) {
      add('xml-formatter', 'Looks like XML markup.', !out.length);
    }

    /* ── HTTP(S) URL — decode / encode / API helper ── */
    if (looksLikeHttpUrl(s)) {
      if (hasPercentEncoding(s)) {
        add('url-decode', 'URL with percent-encoding — decode to readable text.', true);
      } else {
        add('url-decode', 'HTTP(S) URL — open URL Decoder (useful for encoded query strings).', false);
      }
      add('url-encode', 'Encode text or URL components with percent-encoding.', !hasPercentEncoding(s));
      add('api-request-builder', 'Build or replay HTTP requests from this URL.', false);
    } else if (hasPercentEncoding(s) && /%[0-9A-Fa-f]{2}/.test(s) && s.length < 8000 && !seen['url-decode']) {
      add('url-decode', 'Percent-encoded text — open URL Decoder.', true);
    }

    /* ── Base64 (not JWT) ── */
    if (!seen['jwt-decoder'] && tryBase64Payload(s) && (s.replace(/\s/g, '').length > 24 || oneLine)) {
      add('base64-decode', 'Looks like Base64 — open Base64 Decoder.', !out.length);
      if (oneLine && s.length < 500 && /^[\x20-\x7E\t\r\n]+$/.test(s)) {
        add('base64-encode', 'Alternatively: encode plain text as Base64.', false);
      }
    }

    /* ── Hex ── */
    if (/^[0-9a-fA-F]{32,}$/.test(s.replace(/\s+/g, '')) && s.replace(/\s+/g, '').length % 2 === 0 && s.replace(/\s+/g, '').length >= 32) {
      add('hex-decode', 'Long hexadecimal string.', !out.length);
    }

    /* ── Epoch ── */
    if (/^\d{10}$/.test(s) || /^\d{13}$/.test(s)) {
      add('epoch-converter', 'Unix timestamp (seconds or milliseconds).', !out.length);
    }

    /* ── UUID ── */
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)) {
      add('uuid-generator', 'UUID-shaped string.', !out.length);
    }

    /* ── Cron ── */
    if (/^(\*|[\d,-/]+)\s+(\*|[\d,-/]+)\s+(\*|[\d,-/]+)\s+(\*|[\d,-/]+)\s+(\*|[\dA-Za-z,-/]+)$/.test(s) && s.split(/\s+/).length === 5) {
      add('cron-expression-explainer', 'Looks like a five-field cron expression.', !out.length);
    }

    /* ── IPv4 ── */
    if (/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/.test(s)) {
      add('ip-address-tools', 'IPv4 address or CIDR.', !out.length);
    }

    /* ── Hex color ── */
    if (/^#[0-9a-fA-F]{3,8}$/.test(s.trim())) {
      add('color-converter', 'Hex color code.', !out.length);
    }

    /* ── Markdown ── */
    if (/#\s|^\s*#{1,6}\s+\w/m.test(s) || (/^\s*[-*]\s/m.test(s) && s.indexOf('\n') !== -1)) {
      add('markdown-preview', 'Looks like Markdown.', !out.length);
    }

    /* ── Long opaque line → try JWT as fallback hint ── */
    if (s.length > 400 && oneLine && /^[A-Za-z0-9+/=]+$/.test(s.trim()) && !seen['jwt-decoder']) {
      add('jwt-decoder', 'Long token-like string — try JWT decode.', false);
    }

    /* Mark first suggestion as primary if none set */
    var hasPrimary = out.some(function (h) { return h.primary; });
    if (out.length && !hasPrimary) out[0].primary = true;

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
    var t = s == null ? '' : String(s);
    return t
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toolHref(slug) {
    var base = typeof window.SV_BASE_PATH === 'string' ? window.SV_BASE_PATH : '';
    return base + '/tools/' + slug + '/';
  }

  function initPanel() {
    var ta = document.getElementById('sv-smart-input');
    var out = document.getElementById('sv-smart-out');
    if (!ta || !out) return;

    function render() {
      var hits = analyze(ta.value);
      if (!hits.length) {
        out.innerHTML = '<p class="sv-smart-empty">Paste JSON, a JWT, Base64, a URL, SQL, YAML, hex, cron, or almost anything — SolarVault detects the type and suggests the right tool. Click a suggestion to <strong>open the tool with your text</strong> already loaded.</p>';
        return;
      }
      var list = (window.SV_TOOLS_LIST || []).reduce(function (m, t) {
        m[t.slug] = t;
        return m;
      }, {});
      var first = hits[0];
      var shortKind = {
        'json-formatter': 'JSON',
        'jwt-decoder': 'JWT',
        'base64-decode': 'Base64',
        'base64-encode': 'Base64 (encode)',
        'url-decode': 'URL / percent-encoding',
        'url-encode': 'URL encoding',
        'api-request-builder': 'HTTP / API',
        'hex-decode': 'Hex',
        'sql-formatter': 'SQL',
        'yaml-formatter': 'YAML',
        'xml-formatter': 'XML'
      };
      var detectLabel = first
        ? (shortKind[first.slug] || (list[first.slug] ? list[first.slug].title : first.slug))
        : '';
      var banner = '<p class="sv-smart-detect" role="status"><span class="sv-smart-detect-label">Detected</span> <span class="sv-smart-detect-value">' + esc(detectLabel) + '</span></p>';
      out.innerHTML = banner + '<ul class="sv-smart-list">' + hits.map(function (h) {
        var t = list[h.slug];
        var title = esc(t ? t.title : h.slug);
        var tag = esc(t ? t.tagline : '');
        var cls = 'sv-smart-link' + (h.primary ? ' sv-smart-link--primary' : '');
        return '<li><a href="' + toolHref(h.slug) + '" class="' + cls + '" data-sv-slug="' + esc(h.slug) + '">'
          + '<span class="sv-smart-link-title">' + title + '</span>'
          + '<span class="sv-smart-link-reason">' + esc(h.reason) + '</span>'
          + (tag ? '<span class="sv-smart-link-tag">' + tag + '</span>' : '')
          + '</a></li>';
      }).join('') + '</ul>';
    }

    out.addEventListener('click', function (e) {
      var a = e.target.closest('a.sv-smart-link[data-sv-slug]');
      if (!a) return;
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var slug = a.getAttribute('data-sv-slug');
      var payload = ta.value;
      try {
        sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({
          v: 1,
          slug: slug,
          text: payload,
          t: Date.now()
        }));
      } catch (err) {
        /* quota or private mode */
      }
      window.location.href = a.getAttribute('href');
    });

    ta.addEventListener('input', debounce(render, 240));
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPanel);
  else initPanel();
})();
