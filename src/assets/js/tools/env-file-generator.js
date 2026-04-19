/**
 * SolarVault — .env file generator
 */
(function () {
  'use strict';
  var root = document.getElementById('tool-root');
  if (!root) return;

  var IC = {
    file:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    copy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    plus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>',
    dl:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
  };

  function $(id) { return document.getElementById(id); }

  root.innerHTML =
    '<div class="tool-single-col">'
    + '<div class="tool-card-ui">'
    +   '<div class="tc-head">'
    +     '<div class="tc-title"><div class="tc-icon tc-icon-green">' + IC.file + '</div><h2 id="t-heading">ENV File Generator</h2></div>'
    +     '<span class="tc-badge tc-badge-green">.env</span>'
    +   '</div>'
    +   '<div class="tc-body" role="region" aria-labelledby="t-heading">'
    +     '<div class="field"><label for="t-preamble">Leading comments (optional)</label><textarea id="t-preamble" class="mono" rows="2" placeholder="# My app — generated in SolarVault"></textarea></div>'
    +     '<div class="ctrl-row" style="flex-wrap:wrap;gap:16px">'
    +       '<label class="chk" style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--muted)"><input type="checkbox" id="t-export"> Prefix active keys with <code class="mono">export</code> (shell-style)</label>'
    +       '<label class="chk" style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--muted)"><input type="checkbox" id="t-quote" checked> Quote values that contain spaces or <code>#</code></label>'
    +     '</div>'
    +     '<div class="field"><div class="field-hdr"><label>Variables</label><div class="field-btns"><button type="button" class="pill-btn" id="btn-preset">Starter keys</button><button type="button" class="pill-btn" id="btn-add">' + IC.plus + ' <span>Row</span></button></div></div><div id="env-rows"></div></div>'
    +     '<button type="button" class="act-btn act-green" id="btn-gen">' + IC.file + ' <span>Generate .env</span></button>'
    +     '<div class="inline-error" id="t-err" role="alert"></div>'
    +     '<div class="out-box"><div class="out-head"><div class="out-label">' + IC.file + ' <span>Output</span></div><div class="out-btns"><button type="button" class="copy-btn" id="btn-cp" aria-label="Copy">' + IC.copy + ' <span>Copy</span></button><button type="button" class="dl-btn" id="btn-dl" aria-label="Download">' + IC.dl + ' <span>Download</span></button></div></div><pre class="out-body mono b" id="t-out" style="white-space:pre-wrap;word-break:break-word;max-height:360px;overflow:auto">Click Generate to preview\u2026</pre></div>'
    +   '</div>'
    + '</div>'
    + '</div>';

  var rowsEl = $('env-rows');

  function validKey(k) {
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(k);
  }

  function formatValue(val, doQuote) {
    if (!doQuote) return val;
    if (/[\s#"'\\]/.test(val) || val === '') return '"' + String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    return val;
  }

  function addRow(key, val, on) {
    var row = document.createElement('div');
    row.className = 'ctrl-row';
    row.style.cssText = 'gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap';
    row.innerHTML =
      '<label style="display:flex;align-items:center;gap:6px" title="Include in file"><input type="checkbox" class="env-on"' + (on !== false ? ' checked' : '') + '></label>'
      + '<input type="text" class="mono env-key" placeholder="VAR_NAME" value="' + String(key || '').replace(/"/g, '&quot;') + '" style="flex:1;min-width:140px">'
      + '<input type="text" class="mono env-val" placeholder="value" value="' + String(val || '').replace(/"/g, '&quot;') + '" style="flex:2;min-width:180px">'
      + '<button type="button" class="icon-btn env-rm" aria-label="Remove row">' + IC.trash + '</button>';
    row.querySelector('.env-rm').addEventListener('click', function () { row.remove(); });
    rowsEl.appendChild(row);
  }

  addRow('NODE_ENV', 'development');
  addRow('PORT', '3000');
  addRow('DATABASE_URL', '', true);

  $('btn-add').addEventListener('click', function () { addRow('', '', true); });

  $('btn-preset').addEventListener('click', function () {
    [['APP_NAME', 'my-app'], ['API_BASE_URL', 'https://api.example.com'], ['REDIS_URL', 'redis://127.0.0.1:6379'], ['JWT_SECRET', 'change-me-in-production'], ['LOG_LEVEL', 'debug']].forEach(function (p) {
      addRow(p[0], p[1], true);
    });
    CK.toast('Rows added');
  });

  function buildEnv() {
    var preamble = $('t-preamble').value.trim();
    var useExport = $('t-export').checked;
    var smartQuote = $('t-quote').checked;
    var lines = [];
    if (preamble) lines.push(preamble);
    var err = '';
    rowsEl.querySelectorAll('.ctrl-row').forEach(function (row) {
      if (!row.querySelector('.env-on').checked) return;
      var k = row.querySelector('.env-key').value.trim();
      var v = row.querySelector('.env-val').value;
      if (!k) return;
      if (!validKey(k)) { err = 'Invalid key: ' + k + ' (use A–Z, 0–9, underscore; must not start with a digit).'; return; }
      var prefix = useExport ? 'export ' : '';
      lines.push(prefix + k + '=' + formatValue(v, smartQuote));
    });
    return { text: lines.filter(Boolean).join('\n') + (lines.length ? '\n' : ''), err: err };
  }

  $('btn-gen').addEventListener('click', function () {
    $('t-err').textContent = '';
    $('t-err').style.display = 'none';
    var r = buildEnv();
    if (r.err) {
      $('t-err').textContent = r.err;
      $('t-err').style.display = 'block';
      return;
    }
    $('t-out').textContent = r.text || '# Add variables above';
    CK.toast('Generated');
  });

  CK.wireCopy($('btn-cp'), function () {
    var t = $('t-out').textContent;
    return t.indexOf('Click Generate') === -1 ? t : '';
  });
  CK.wireDownload($('btn-dl'), function () {
    var t = $('t-out').textContent;
    return t.indexOf('Click Generate') === -1 ? t : '';
  }, '.env');

  CK.setUsageContent('<ol><li>Add <strong>KEY</strong> / <strong>value</strong> rows; uncheck the box on the left to skip a row.</li><li>Use <strong>Quote values</strong> when values include spaces or hash characters.</li><li><strong>export</strong> prefixes variables for POSIX shells (optional).</li><li>Click <strong>Generate</strong>, then <strong>Copy</strong> or <strong>Download</strong> as <code>.env</code>.</li></ol><p>Review secrets before committing; never commit real <code>.env</code> files to git.</p>');
})();
