/**
 * SolarVault — Docker command generator
 */
(function () {
  'use strict';
  var root = document.getElementById('tool-root');
  if (!root) return;

  var IC = {
    box:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
  };

  function $(id) { return document.getElementById(id); }

  function sh(s) {
    if (!s) return '';
    return String(s).replace(/'/g, "'\\''");
  }

  var RECIPES = [
    { id: 'run', label: 'docker run (foreground)' },
    { id: 'run-d', label: 'docker run (detached + port)' },
    { id: 'build', label: 'docker build' },
    { id: 'exec', label: 'docker exec shell' },
    { id: 'logs', label: 'docker logs (follow)' },
    { id: 'compose-up', label: 'docker compose up' },
    { id: 'compose-down', label: 'docker compose down' },
    { id: 'prune', label: 'prune unused' }
  ];

  root.innerHTML =
    '<div class="tool-single-col">'
    + '<div class="tool-card-ui">'
    +   '<div class="tc-head">'
    +     '<div class="tc-title"><div class="tc-icon tc-icon-purple">' + IC.box + '</div><h2 id="t-heading">Docker Command Generator</h2></div>'
    +     '<span class="tc-badge tc-badge-purple">CLI</span>'
    +   '</div>'
    +   '<div class="tc-body" role="region" aria-labelledby="t-heading">'
    +     '<div class="ctrl-row" style="flex-wrap:wrap;gap:12px;align-items:flex-end">'
    +       '<div class="sel-group" style="min-width:220px"><label for="t-recipe">Recipe</label><select id="t-recipe">' + RECIPES.map(function (r) { return '<option value="' + r.id + '">' + r.label + '</option>'; }).join('') + '</select></div>'
    +     '</div>'
    +     '<div id="fields" class="field-grid" style="margin-top:12px"></div>'
    +     '<button type="button" class="act-btn act-purple" id="btn-gen">' + IC.box + ' <span>Generate command</span></button>'
    +     '<div class="out-box"><div class="out-head"><div class="out-label">Command</div><div class="out-btns"><button type="button" class="copy-btn" id="btn-cp" aria-label="Copy">' + IC.copy + ' <span>Copy</span></button></div></div><pre class="out-body mono b" id="t-out" style="white-space:pre-wrap;word-break:break-word"></pre></div>'
    +   '</div>'
    + '</div>'
    + '</div>';

  var fieldsEl = $('fields');

  var FIELD_SETS = {
    run: [
      { id: 'img', label: 'Image', ph: 'nginx:alpine', def: 'alpine:latest' },
      { id: 'name', label: 'Name (--name)', ph: 'my-container', def: '' },
      { id: 'cmd', label: 'Command (optional)', ph: 'sh -c "echo hi"', def: '' }
    ],
    'run-d': [
      { id: 'img', label: 'Image', ph: 'node:20-alpine', def: 'node:20-alpine' },
      { id: 'name', label: 'Name (--name)', ph: 'api', def: 'app' },
      { id: 'ports', label: 'Ports (-p)', ph: '8080:80', def: '3000:3000' },
      { id: 'env', label: 'Env (-e) KEY=VAL', ph: 'NODE_ENV=production', def: 'NODE_ENV=development' },
      { id: 'vol', label: 'Volume (-v)', ph: './data:/data', def: '' }
    ],
    build: [
      { id: 'ctx', label: 'Context dir', ph: '.', def: '.' },
      { id: 'f', label: '-f Dockerfile', ph: 'Dockerfile', def: 'Dockerfile' },
      { id: 'tag', label: '-t image:tag', ph: 'myapp:1.0.0', def: 'myapp:latest' },
      { id: 'target', label: '--target (optional)', ph: 'production', def: '' }
    ],
    exec: [
      { id: 'name', label: 'Container name / id', ph: 'my-container', def: '' },
      { id: 'shell', label: 'Shell', ph: 'bash', def: 'sh' }
    ],
    logs: [
      { id: 'name', label: 'Container name / id', ph: 'my-container', def: '' },
      { id: 'tail', label: '--tail', ph: '100', def: '200' }
    ],
    'compose-up': [
      { id: 'file', label: '-f file', ph: 'docker-compose.yml', def: 'docker-compose.yml' },
      { id: 'profile', label: '--profile (optional)', ph: 'dev', def: '' },
      { id: 'build', label: 'Add --build', ph: '', def: '', type: 'chk' }
    ],
    'compose-down': [
      { id: 'file', label: '-f file', ph: 'docker-compose.yml', def: 'docker-compose.yml' },
      { id: 'volumes', label: 'Add --volumes', ph: '', def: '', type: 'chk' }
    ],
    prune: [
      { id: 'kind', label: 'Target', ph: '', def: '', type: 'sel', options: [
        { v: 'system', t: 'docker system prune -a' },
        { v: 'volume', t: 'docker volume prune' },
        { v: 'image', t: 'docker image prune -a' }
      ] }
    ]
  };

  function renderFields() {
    var id = $('t-recipe').value;
    var defs = FIELD_SETS[id] || [];
    fieldsEl.innerHTML = '';
    defs.forEach(function (f) {
      if (f.type === 'chk') {
        fieldsEl.innerHTML += '<label class="chk" style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer"><input type="checkbox" id="fld-' + f.id + '"> ' + f.label + '</label>';
        return;
      }
      if (f.type === 'sel') {
        var opts = f.options.map(function (o) { return '<option value="' + o.v + '">' + o.t + '</option>'; }).join('');
        fieldsEl.innerHTML += '<div class="field" style="margin-bottom:10px"><label for="fld-' + f.id + '">' + f.label + '</label><select id="fld-' + f.id + '">' + opts + '</select></div>';
        return;
      }
      fieldsEl.innerHTML += '<div class="field" style="margin-bottom:10px"><label for="fld-' + f.id + '">' + f.label + '</label><input type="text" id="fld-' + f.id + '" class="mono" placeholder="' + (f.ph || '') + '" value="' + (f.def || '').replace(/"/g, '&quot;') + '"></div>';
    });
  }

  function val(id) {
    var el = document.getElementById('fld-' + id);
    return el ? el.value.trim() : '';
  }
  function chk(id) {
    var el = document.getElementById('fld-' + id);
    return el && el.checked;
  }

  function generate() {
    var r = $('t-recipe').value;
    var cmd = '';
    if (r === 'run') {
      var img = val('img') || 'alpine:latest';
      var name = val('name');
      var c = val('cmd');
      cmd = 'docker run --rm' + (name ? " --name '" + sh(name) + "'" : '') + " -it '" + sh(img) + "'" + (c ? " " + c : '');
    } else if (r === 'run-d') {
      cmd = 'docker run -d --restart unless-stopped';
      if (val('name')) cmd += " --name '" + sh(val('name')) + "'";
      if (val('ports')) cmd += ' -p ' + val('ports').replace(/\s+/g, ' ');
      if (val('env')) cmd += " -e '" + sh(val('env')) + "'";
      if (val('vol')) cmd += " -v '" + sh(val('vol')) + "'";
      cmd += " '" + sh(val('img') || 'node:20-alpine') + "'";
    } else if (r === 'build') {
      cmd = 'docker build';
      if (val('f') && val('f') !== 'Dockerfile') cmd += " -f '" + sh(val('f')) + "'";
      if (val('tag')) cmd += " -t '" + sh(val('tag')) + "'";
      if (val('target')) cmd += " --target '" + sh(val('target')) + "'";
      cmd += " '" + sh(val('ctx') || '.') + "'";
    } else if (r === 'exec') {
      var n = val('name');
      if (!n) return { err: 'Container name required.' };
      var shell = val('shell') || 'sh';
      cmd = "docker exec -it '" + sh(n) + "' " + shell;
    } else if (r === 'logs') {
      var n2 = val('name');
      if (!n2) return { err: 'Container name required.' };
      cmd = "docker logs -f --tail " + (val('tail') || '200') + " '" + sh(n2) + "'";
    } else if (r === 'compose-up') {
      cmd = 'docker compose';
      if (val('file')) cmd += " -f '" + sh(val('file')) + "'";
      if (val('profile')) cmd += " --profile '" + sh(val('profile')) + "'";
      cmd += ' up -d';
      if (chk('build')) cmd += ' --build';
    } else if (r === 'compose-down') {
      cmd = 'docker compose';
      if (val('file')) cmd += " -f '" + sh(val('file')) + "'";
      cmd += ' down';
      if (chk('volumes')) cmd += ' --volumes';
    } else if (r === 'prune') {
      var k = val('kind') || 'system';
      if (k === 'system') cmd = 'docker system prune -a --volumes';
      else if (k === 'volume') cmd = 'docker volume prune -f';
      else cmd = 'docker image prune -a -f';
    }
    return { cmd: cmd, err: '' };
  }

  $('t-recipe').addEventListener('change', renderFields);
  renderFields();

  $('btn-gen').addEventListener('click', function () {
    var g = generate();
    if (g.err) {
      $('t-out').textContent = g.err;
      CK.toast(g.err, 'err');
      return;
    }
    $('t-out').textContent = g.cmd;
    CK.toast('Command ready');
  });

  CK.wireCopy($('btn-cp'), function () { return $('t-out').textContent; });

  $('btn-gen').click();

  CK.setUsageContent('<ol><li>Pick a <strong>recipe</strong> and fill the fields (sensible defaults are pre-filled).</li><li>Click <strong>Generate command</strong>, then <strong>Copy</strong> into your terminal.</li><li>Review destructive recipes (prune / compose down with volumes) before running.</li></ol><p>Commands use single-quoted paths and names where possible so you can paste safely on macOS and Linux shells.</p>');
})();
