/**
 * SolarVault — Git command helper
 */
(function () {
  'use strict';
  var root = document.getElementById('tool-root');
  if (!root) return;

  var IC = {
    branch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
    copy:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
  };

  function $(id) { return document.getElementById(id); }

  var SCENARIOS = [
    { id: 'new-branch', label: 'Create & switch to new branch' },
    { id: 'commit', label: 'Stage all & commit' },
    { id: 'amend', label: 'Amend last commit (keep message)' },
    { id: 'undo-soft', label: 'Undo last commit (keep changes staged)' },
    { id: 'stash', label: 'Stash with message' },
    { id: 'stash-pop', label: 'Pop latest stash' },
    { id: 'pull-rebase', label: 'Pull with rebase' },
    { id: 'push-set-upstream', label: 'Push new branch (set upstream)' },
    { id: 'tag', label: 'Create annotated tag' },
    { id: 'log-oneline', label: 'Pretty one-line log' },
    { id: 'discard-file', label: 'Discard changes in one file' },
    { id: 'rename-branch', label: 'Rename current branch' }
  ];

  root.innerHTML =
    '<div class="tool-single-col">'
    + '<div class="tool-card-ui">'
    +   '<div class="tc-head">'
    +     '<div class="tc-title"><div class="tc-icon tc-icon-amber">' + IC.branch + '</div><h2 id="t-heading">Git Command Helper</h2></div>'
    +     '<span class="tc-badge tc-badge-amber">Git</span>'
    +   '</div>'
    +   '<div class="tc-body" role="region" aria-labelledby="t-heading">'
    +     '<div class="ctrl-row" style="flex-wrap:wrap;gap:12px;align-items:flex-end">'
    +       '<div class="sel-group" style="min-width:260px"><label for="t-scen">Scenario</label><select id="t-scen">' + SCENARIOS.map(function (s) { return '<option value="' + s.id + '">' + s.label + '</option>'; }).join('') + '</select></div>'
    +     '</div>'
    +     '<div id="g-fields" style="margin-top:12px"></div>'
    +     '<p class="input-meta" id="g-hint" style="margin-top:8px"></p>'
    +     '<button type="button" class="act-btn act-amber" id="btn-gen">' + IC.branch + ' <span>Show command</span></button>'
    +     '<div class="inline-error" id="t-err" role="alert"></div>'
    +     '<div class="out-box"><div class="out-head"><div class="out-label">Shell</div><div class="out-btns"><button type="button" class="copy-btn" id="btn-cp" aria-label="Copy">' + IC.copy + ' <span>Copy</span></button></div></div><pre class="out-body mono b" id="t-out" style="white-space:pre-wrap;word-break:break-word"></pre></div>'
    +   '</div>'
    + '</div>'
    + '</div>';

  var GF = {
    'new-branch': [
      { id: 'b', label: 'Branch name', def: 'feature/my-change' }
    ],
    'commit': [
      { id: 'm', label: 'Commit message', def: 'Describe your change' }
    ],
    'amend': [],
    'undo-soft': [],
    'stash': [
      { id: 'm', label: 'Stash message', def: 'wip: before pull' }
    ],
    'stash-pop': [],
    'pull-rebase': [],
    'push-set-upstream': [
      { id: 'r', label: 'Remote', def: 'origin' },
      { id: 'b', label: 'Branch', def: 'feature/my-change' }
    ],
    'tag': [
      { id: 't', label: 'Tag name', def: 'v1.2.0' },
      { id: 'm', label: 'Message', def: 'Release 1.2.0' }
    ],
    'log-oneline': [],
    'discard-file': [
      { id: 'p', label: 'File path', def: 'src/app.ts' }
    ],
    'rename-branch': [
      { id: 'b', label: 'New branch name', def: 'main' }
    ]
  };

  var HINTS = {
    'new-branch': 'Creates and checks out a new branch from your current HEAD.',
    'commit': 'Stages every tracked change and commits. Untracked files are not added unless you use git add -A separately.',
    'amend': 'Rewrites the last commit with your current index. Do not amend commits you have already pushed unless you know the consequences.',
    'undo-soft': 'Moves HEAD back one commit but keeps your worktree and index as-is.',
    'stash': 'Saves dirty state including untracked files with -u.',
    'stash-pop': 'Applies and removes the top stash entry.',
    'pull-rebase': 'Fetches and rebases your branch onto the remote default branch tracking ref.',
    'push-set-upstream': 'First push of a local branch to the remote.',
    'tag': 'Creates an annotated tag at the current commit.',
    'log-oneline': 'Compact graph-style history for quick inspection.',
    'discard-file': 'Permanently discards unstaged changes to that path.',
    'rename-branch': 'Renames the branch you are currently on.'
  };

  function renderFields() {
    var sid = $('t-scen').value;
    var defs = GF[sid] || [];
    $('g-fields').innerHTML = '';
    defs.forEach(function (f) {
      $('g-fields').innerHTML += '<div class="field" style="margin-bottom:10px"><label for="gf-' + f.id + '">' + f.label + '</label><input type="text" id="gf-' + f.id + '" class="mono" value="' + String(f.def || '').replace(/"/g, '&quot;') + '"></div>';
    });
    $('g-hint').textContent = HINTS[sid] || '';
  }

  function v(id) {
    var el = document.getElementById('gf-' + id);
    return el ? el.value.trim() : '';
  }

  function gen() {
    var sid = $('t-scen').value;
    var err = '';
    var cmd = '';
    if (sid === 'new-branch') {
      var b = v('b');
      if (!b) err = 'Branch name required.';
      else cmd = "git checkout -b '" + b.replace(/'/g, "'\\''") + "'";
    } else if (sid === 'commit') {
      var m = v('m');
      if (!m) err = 'Message required.';
      else cmd = "git add -A && git commit -m '" + m.replace(/'/g, "'\\''") + "'";
    } else if (sid === 'amend') {
      cmd = 'git commit --amend --no-edit';
    } else if (sid === 'undo-soft') {
      cmd = 'git reset --soft HEAD~1';
    } else if (sid === 'stash') {
      var sm = v('m') || 'wip';
      cmd = "git stash push -u -m '" + sm.replace(/'/g, "'\\''") + "'";
    } else if (sid === 'stash-pop') {
      cmd = 'git stash pop';
    } else if (sid === 'pull-rebase') {
      cmd = 'git pull --rebase --autostash';
    } else if (sid === 'push-set-upstream') {
      var r = v('r') || 'origin';
      var br = v('b');
      if (!br) err = 'Branch name required.';
      else cmd = "git push -u '" + r.replace(/'/g, "'\\''") + "' '" + br.replace(/'/g, "'\\''") + "'";
    } else if (sid === 'tag') {
      var t = v('t');
      var tm = v('m');
      if (!t) err = 'Tag name required.';
      else cmd = "git tag -a '" + t.replace(/'/g, "'\\''") + "' -m '" + (tm || t).replace(/'/g, "'\\''") + "'";
    } else if (sid === 'log-oneline') {
      cmd = 'git log --oneline --decorate --graph -n 30';
    } else if (sid === 'discard-file') {
      var p = v('p');
      if (!p) err = 'File path required.';
      else cmd = "git checkout -- '" + p.replace(/'/g, "'\\''") + "'";
    } else if (sid === 'rename-branch') {
      var nb = v('b');
      if (!nb) err = 'New name required.';
      else cmd = "git branch -m '" + nb.replace(/'/g, "'\\''") + "'";
    }
    return { cmd: cmd, err: err };
  }

  $('t-scen').addEventListener('change', renderFields);
  renderFields();

  $('btn-gen').addEventListener('click', function () {
    $('t-err').textContent = '';
    $('t-err').style.display = 'none';
    var g = gen();
    if (g.err) {
      $('t-err').textContent = g.err;
      $('t-err').style.display = 'block';
      $('t-out').textContent = '';
      return;
    }
    $('t-out').textContent = g.cmd;
    CK.toast('Ready to copy');
  });

  CK.wireCopy($('btn-cp'), function () { return $('t-out').textContent; });

  $('btn-gen').click();

  CK.setUsageContent('<ol><li>Choose a <strong>scenario</strong> and fill any fields shown.</li><li>Click <strong>Show command</strong>, then <strong>Copy</strong> into your terminal.</li><li>Destructive flows (discard file, amend, reset) are real Git operations — double-check paths and remotes.</li></ol><p>This tool only builds commands; it does not run Git for you.</p>');
})();
