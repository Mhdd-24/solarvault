/**
 * SolarVault — API Request Builder (Postman-style snippets + optional HTTPS send)
 */
(function () {
  'use strict';
  var root = document.getElementById('tool-root');
  if (!root) return;

  var IC = {
    zap:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    copy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    plus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>',
    send:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
  };

  function $(id) { return document.getElementById(id); }

  var METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  root.innerHTML =
    '<div class="tool-single-col">'
    + '<div class="tool-card-ui">'
    +   '<div class="tc-head">'
    +     '<div class="tc-title"><div class="tc-icon tc-icon-blue">' + IC.zap + '</div><h2 id="t-heading">API Request Builder</h2></div>'
    +     '<span class="tc-badge tc-badge-amber">Client</span>'
    +   '</div>'
    +   '<div class="tc-body" role="region" aria-labelledby="t-heading">'
    +     '<div class="ctrl-row" style="flex-wrap:wrap;gap:12px;align-items:flex-end">'
    +       '<div class="sel-group" style="min-width:120px"><label for="t-method">Method</label><select id="t-method">' + METHODS.map(function (m) { return '<option value="' + m + '">' + m + '</option>'; }).join('') + '</select></div>'
    +       '<div class="field" style="flex:1;min-width:200px;margin:0"><label for="t-url">URL</label><input type="url" id="t-url" class="mono" placeholder="https://api.example.com/v1/items" autocomplete="off"></div>'
    +     '</div>'
    +     '<div class="field"><div class="field-hdr"><label>Headers</label><div class="field-btns"><button type="button" class="pill-btn" id="btn-h-add" aria-label="Add header">' + IC.plus + ' <span>Row</span></button></div></div><div id="hdr-rows" class="kv-rows"></div></div>'
    +     '<div class="field" id="body-wrap"><label for="t-body">Body</label><textarea id="t-body" class="mono" rows="6" placeholder="{&quot;name&quot;: &quot;example&quot;}" spellcheck="false"></textarea><div class="input-meta">JSON, form text, or raw payload</div></div>'
    +     '<div class="mode-tabs" id="snippet-tabs" role="tablist" aria-label="Snippet format">'
    +       '<button type="button" class="mt active" data-val="curl" aria-pressed="true">cURL</button>'
    +       '<button type="button" class="mt" data-val="fetch" aria-pressed="false">fetch()</button>'
    +       '<button type="button" class="mt" data-val="axios" aria-pressed="false">axios</button>'
    +     '</div>'
    +     '<button type="button" class="act-btn act-blue" id="btn-gen">' + IC.zap + ' <span>Update snippet</span></button>'
    +     '<p class="input-meta" id="send-hint" style="margin-top:8px">Send runs in the browser for <strong>https</strong> URLs only (CORS may block some hosts). Otherwise copy cURL.</p>'
    +     '<button type="button" class="act-btn act-amber" id="btn-send">' + IC.send + ' <span>Send request</span></button>'
    +     '<div class="inline-error" id="t-err" role="alert"></div>'
    +     '<div class="out-box"><div class="out-head"><div class="out-label">' + IC.zap + ' <span>Snippet</span></div><div class="out-btns"><button type="button" class="copy-btn" id="btn-cp" aria-label="Copy snippet">' + IC.copy + ' <span>Copy</span></button></div></div><pre class="out-body mono b" id="t-snippet" style="white-space:pre-wrap;word-break:break-word;max-height:320px;overflow:auto"></pre></div>'
    +     '<div class="out-box" id="resp-box" style="display:none;margin-top:12px"><div class="out-head"><div class="out-label">Response</div></div><pre class="out-body mono b" id="t-resp" style="white-space:pre-wrap;word-break:break-word;max-height:280px;overflow:auto"></pre></div>'
    +   '</div>'
    + '</div>'
    + '</div>';

  var hdrContainer = $('hdr-rows');
  var snippetMode = 'curl';

  function addHeaderRow(name, value) {
    var row = document.createElement('div');
    row.className = 'ctrl-row';
    row.style.cssText = 'gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap';
    row.innerHTML =
      '<input type="text" class="mono hdr-name" placeholder="Header-Name" value="' + (name || '').replace(/"/g, '&quot;') + '" style="flex:1;min-width:120px">'
      + '<input type="text" class="mono hdr-val" placeholder="value" value="' + (value || '').replace(/"/g, '&quot;') + '" style="flex:2;min-width:160px">'
      + '<button type="button" class="icon-btn hdr-rm" aria-label="Remove header" title="Remove">' + IC.trash + '</button>';
    row.querySelector('.hdr-rm').addEventListener('click', function () { row.remove(); });
    hdrContainer.appendChild(row);
  }

  addHeaderRow('Content-Type', 'application/json');
  addHeaderRow('Accept', 'application/json');

  function getHeaders() {
    var out = [];
    hdrContainer.querySelectorAll('.ctrl-row').forEach(function (row) {
      var n = row.querySelector('.hdr-name');
      var v = row.querySelector('.hdr-val');
      if (!n || !v) return;
      var name = n.value.trim();
      if (!name) return;
      out.push({ name: name, value: v.value });
    });
    return out;
  }

  function escShell(s) {
    return String(s).replace(/'/g, "'\\''");
  }

  function buildCurl(method, url, headers, body) {
    if (!url) return '';
    var parts = ['curl -sS -X ' + method];
    parts.push("'" + escShell(url) + "'");
    headers.forEach(function (h) {
      parts.push("-H '" + escShell(h.name + ': ' + h.value) + "'");
    });
    if (body && method !== 'GET' && method !== 'HEAD') {
      parts.push("--data-binary '" + escShell(body) + "'");
    }
    return parts.join(' \\\n  ');
  }

  function buildFetch(method, url, headers, body) {
    if (!url) return '';
    var hObj = {};
    headers.forEach(function (h) { hObj[h.name] = h.value; });
    var opt = { method: method, headers: hObj };
    if (body && method !== 'GET' && method !== 'HEAD') opt.body = body;
    return 'const url = ' + JSON.stringify(url) + ';\n\nconst options = ' + JSON.stringify(opt, null, 2) + ';\n\nconst res = await fetch(url, options);\nconst text = await res.text();\nconsole.log(res.status, text);';
  }

  function buildAxios(method, url, headers, body) {
    if (!url) return '';
    var hObj = {};
    headers.forEach(function (h) { hObj[h.name] = h.value; });
    var cfg = { method: method.toLowerCase(), url: url, headers: hObj };
    if (body && method !== 'GET' && method !== 'HEAD') cfg.data = body;
    return "import axios from 'axios';\n\nconst res = await axios(" + JSON.stringify(cfg, null, 2) + ');\nconsole.log(res.status, res.data);';
  }

  function updateSnippet() {
    var method = $('t-method').value;
    var url = $('t-url').value.trim();
    var body = $('t-body').value;
    var headers = getHeaders();
    var text = '';
    if (snippetMode === 'curl') text = buildCurl(method, url, headers, body);
    else if (snippetMode === 'fetch') text = buildFetch(method, url, headers, body);
    else text = buildAxios(method, url, headers, body);
    $('t-snippet').textContent = text || 'Enter a URL to generate a snippet.';
  }

  function syncBodyVisibility() {
    var m = $('t-method').value;
    var wrap = $('body-wrap');
    var show = m !== 'GET' && m !== 'HEAD';
    wrap.style.display = show ? 'block' : 'none';
  }

  $('t-method').addEventListener('change', syncBodyVisibility);
  syncBodyVisibility();

  $('btn-h-add').addEventListener('click', function () { addHeaderRow('', ''); });

  document.getElementById('snippet-tabs').querySelectorAll('.mt').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.getElementById('snippet-tabs').querySelectorAll('.mt').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');
      snippetMode = tab.getAttribute('data-val') || 'curl';
      updateSnippet();
    });
  });

  $('btn-gen').addEventListener('click', function () {
    $('t-err').textContent = '';
    $('t-err').style.display = 'none';
    updateSnippet();
    CK.toast('Snippet updated');
  });

  CK.wireCopy($('btn-cp'), function () { return $('t-snippet').textContent; });

  var deb;
  function schedule() {
    clearTimeout(deb);
    deb = setTimeout(updateSnippet, 200);
  }
  ['t-url', 't-body'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('input', schedule);
  });
  $('t-method').addEventListener('change', updateSnippet);
  hdrContainer.addEventListener('input', schedule);

  $('btn-send').addEventListener('click', function () {
    $('t-err').textContent = '';
    $('t-err').style.display = 'none';
    var url = $('t-url').value.trim();
    if (!url) {
      $('t-err').textContent = 'Enter a URL.';
      $('t-err').style.display = 'block';
      return;
    }
    if (url.indexOf('https://') !== 0) {
      $('t-err').textContent = 'Send only supports https:// URLs. Use the cURL snippet for http or self-signed local servers.';
      $('t-err').style.display = 'block';
      return;
    }
    var method = $('t-method').value;
    var headers = getHeaders();
    var body = $('t-body').value;
    var hObj = new Headers();
    headers.forEach(function (h) { hObj.append(h.name, h.value); });
    var init = { method: method, headers: hObj };
    if (body && method !== 'GET' && method !== 'HEAD') init.body = body;
    $('resp-box').style.display = 'block';
    $('t-resp').textContent = 'Loading\u2026';
    fetch(url, init)
      .then(function (res) {
        return res.text().then(function (txt) {
          var head = 'HTTP ' + res.status + ' ' + res.statusText + '\n';
          res.headers.forEach(function (v, k) { head += k + ': ' + v + '\n'; });
          var max = 120000;
          if (txt.length > max) txt = txt.slice(0, max) + '\n\n\u2026 (truncated)';
          $('t-resp').textContent = head + '\n' + txt;
          CK.toast('Response received');
        });
      })
      .catch(function (e) {
        $('t-resp').textContent = 'Error: ' + e.message;
        $('t-err').textContent = e.message;
        $('t-err').style.display = 'block';
        CK.toast('Request failed', 'err');
      });
  });

  updateSnippet();

  CK.setUsageContent('<ol><li>Pick <strong>method</strong>, paste the <strong>URL</strong>, and edit <strong>headers</strong> / <strong>body</strong>.</li><li>Use the tabs to switch between <strong>cURL</strong>, <strong>fetch()</strong>, and <strong>axios</strong> snippets, then <strong>Copy</strong>.</li><li>Optional <strong>Send request</strong> runs in your browser for HTTPS only; many APIs block cross-origin calls (use cURL in a terminal when that happens).</li></ol><p>Nothing is logged by SolarVault; requests go directly from your browser to the target host.</p>');
})();
