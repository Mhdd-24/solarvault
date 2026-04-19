/**
 * SolarVault — Encrypt before sharing (AES-256-CBC package + recipient decrypt)
 */
(function () {
  'use strict';
  var root = document.getElementById('tool-root');
  if (!root) return;

  var IC = {
    lock:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    copy:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    dl:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
  };

  function $(id) { return document.getElementById(id); }

  function deriveKey(passphrase, bits) {
    var bytes = bits / 8;
    var hexLen = bytes * 2;
    var key = (passphrase || '').trim();
    if (!key) throw new Error('Passphrase required.');
    if (new RegExp('^[0-9a-fA-F]{' + hexLen + '}$').test(key)) return CryptoJS.enc.Hex.parse(key);
    var utf8WA = CryptoJS.enc.Utf8.parse(key);
    if (utf8WA.sigBytes === bytes) return utf8WA;
    return CryptoJS.enc.Hex.parse(CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex).substring(0, hexLen));
  }

  root.innerHTML =
    '<div class="tool-single-col">'
    + '<div class="tool-card-ui">'
    +   '<div class="tc-head">'
    +     '<div class="tc-title"><div class="tc-icon tc-icon-green">' + IC.lock + '</div><h2 id="t-heading">Encrypt Before Sharing</h2></div>'
    +     '<span class="tc-badge tc-badge-green">AES-256</span>'
    +   '</div>'
    +   '<div class="tc-body" role="region" aria-labelledby="t-heading">'
    +     '<p class="input-meta" style="margin-bottom:12px">Create a single JSON package you can paste into chat or email. Share the <strong>passphrase out of band</strong> (voice, password manager, signal). Recipients open this tool and use <strong>Decrypt package</strong>.</p>'
    +     '<div class="mode-tabs" id="ebs-tabs" role="tablist" aria-label="Mode">'
    +       '<button type="button" class="mt active" data-mode="enc" aria-pressed="true">Encrypt</button>'
    +       '<button type="button" class="mt" data-mode="dec" aria-pressed="false">Decrypt package</button>'
    +     '</div>'
    +     '<div id="panel-enc">'
    +       '<div class="field"><label for="e-plain">Message to protect</label><textarea id="e-plain" class="mono" rows="5" placeholder="Secrets, API keys, personal notes\u2026" spellcheck="false"></textarea></div>'
    +       '<div class="field"><div class="field-hdr"><label for="e-pass">Passphrase (shared secretly with recipient)</label></div><input type="password" id="e-pass" class="mono" placeholder="Strong passphrase" autocomplete="off"></div>'
    +       '<button type="button" class="act-btn act-green" id="btn-enc">' + IC.lock + ' <span>Create shareable package</span></button>'
    +     '</div>'
    +     '<div id="panel-dec" style="display:none">'
    +       '<div class="field"><label for="d-blob">Pasted package (JSON)</label><textarea id="d-blob" class="mono" rows="5" placeholder="{&quot;v&quot;:1,&quot;iv&quot;:&quot;\u2026&quot;,&quot;ct&quot;:&quot;\u2026&quot;}" spellcheck="false"></textarea></div>'
    +       '<div class="field"><label for="d-pass">Passphrase</label><input type="password" id="d-pass" class="mono" placeholder="Same passphrase sender used" autocomplete="off"></div>'
    +       '<button type="button" class="act-btn act-blue" id="btn-dec">' + IC.lock + ' <span>Decrypt</span></button>'
    +       '<div class="out-box" style="margin-top:12px"><div class="out-head"><div class="out-label">Decrypted message</div><div class="out-btns"><button type="button" class="copy-btn" id="btn-cp-dec" aria-label="Copy">' + IC.copy + ' <span>Copy</span></button></div></div><pre class="out-body mono b" id="d-out" style="white-space:pre-wrap;word-break:break-word;min-height:3em">—</pre></div>'
    +     '</div>'
    +     '<div class="inline-error" id="e-err" role="alert"></div>'
    +     '<div class="out-box" id="enc-out-wrap" style="margin-top:12px">'
    +       '<div class="out-head"><div class="out-label">Shareable JSON (one line)</div><div class="out-btns"><button type="button" class="copy-btn" id="btn-cp-json" aria-label="Copy JSON">' + IC.copy + ' <span>Copy</span></button><button type="button" class="dl-btn" id="btn-dl-json" aria-label="Download">' + IC.dl + ' <span>Download</span></button></div></div>'
    +       '<pre class="out-body mono b" id="e-json" style="white-space:pre-wrap;word-break:break-word;max-height:200px;overflow:auto"></pre>'
    +       '<div class="field" style="margin-top:12px"><label for="e-instruct">Message to send with the blob (copy into Slack, email, etc.)</label><textarea id="e-instruct" class="mono" rows="4" readonly spellcheck="false"></textarea></div>'
      +       '<button type="button" class="pill-btn" id="btn-cp-inst">' + IC.copy + ' <span>Copy instructions</span></button>'
    +     '</div>'
    +   '</div>'
    + '</div>'
    + '</div>';

  var tabs = document.getElementById('ebs-tabs');
  tabs.querySelectorAll('.mt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.querySelectorAll('.mt').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      var m = btn.getAttribute('data-mode');
      $('panel-enc').style.display = m === 'enc' ? 'block' : 'none';
      $('panel-dec').style.display = m === 'dec' ? 'block' : 'none';
      $('enc-out-wrap').style.display = m === 'enc' ? 'block' : 'none';
      $('e-err').textContent = '';
      $('e-err').style.display = 'none';
    });
  });

  function clearErr() {
    $('e-err').textContent = '';
    $('e-err').style.display = 'none';
  }

  $('btn-enc').addEventListener('click', function () {
    clearErr();
    var plain = $('e-plain').value;
    if (!plain.trim()) {
      $('e-err').textContent = 'Enter a message to encrypt.';
      $('e-err').style.display = 'block';
      return;
    }
    try {
      var keyWA = deriveKey($('e-pass').value, 256);
      var iv = CryptoJS.lib.WordArray.random(128 / 8);
      var enc = CryptoJS.AES.encrypt(plain, keyWA, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      var pkg = {
        v: 1,
        a: 'AES-256-CBC',
        iv: iv.toString(CryptoJS.enc.Hex),
        ct: enc.ciphertext.toString(CryptoJS.enc.Base64)
      };
      var json = JSON.stringify(pkg);
      $('e-json').textContent = json;
      var toolUrl = (typeof location !== 'undefined' ? location.href.split('?')[0].split('#')[0] : '') || '/tools/encrypt-before-sharing/';
      var inst = 'Encrypted message (SolarVault).\n\n'
        + '1) Open: ' + toolUrl + '\n'
        + '2) Tab: Decrypt package\n'
        + '3) Paste the JSON line below and enter the passphrase I sent you separately.\n\n'
        + '-----BEGIN PACKAGE-----\n' + json + '\n-----END PACKAGE-----';
      $('e-instruct').value = inst;
      CK.toast('Package ready — copy JSON or full instructions');
    } catch (e) {
      $('e-err').textContent = e.message || String(e);
      $('e-err').style.display = 'block';
    }
  });

  $('btn-dec').addEventListener('click', function () {
    clearErr();
    var raw = $('d-blob').value.trim();
    if (!raw) {
      $('e-err').textContent = 'Paste the JSON package.';
      $('e-err').style.display = 'block';
      return;
    }
    var between = raw.match(/-----BEGIN PACKAGE-----\s*([\s\S]*?)\s*-----END PACKAGE-----/);
    if (between) raw = between[1].trim();
    try {
      var pkg = JSON.parse(raw);
      if (pkg.v !== 1 || !pkg.iv || !pkg.ct) throw new Error('Unsupported package format.');
      var keyWA = deriveKey($('d-pass').value, 256);
      var ivWA = CryptoJS.enc.Hex.parse(pkg.iv);
      var cp = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(pkg.ct) });
      var dec = CryptoJS.AES.decrypt(cp, keyWA, {
        iv: ivWA,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      if (!dec) throw new Error('Wrong passphrase or corrupted package.');
      $('d-out').textContent = dec;
      CK.toast('Decrypted');
    } catch (e) {
      $('e-err').textContent = e.message || String(e);
      $('e-err').style.display = 'block';
      $('d-out').textContent = '—';
    }
  });

  CK.wireCopy($('btn-cp-json'), function () { return $('e-json').textContent.trim(); });
  CK.wireCopy($('btn-cp-inst'), function () { return $('e-instruct').value; });
  CK.wireCopy($('btn-cp-dec'), function () {
    var t = $('d-out').textContent;
    return t && t !== '—' ? t : '';
  });
  CK.wireDownload($('btn-dl-json'), function () { return $('e-json').textContent.trim(); }, 'solarvault-package.json');

  CK.setUsageContent('<ol><li><strong>Encrypt:</strong> type your secret, choose a strong passphrase, then create the package.</li><li>Copy the <strong>JSON</strong> (or the full instruction block) into your chat or email.</li><li>Tell the recipient the passphrase <strong>outside that same channel</strong> (phone, in person, password manager share).</li><li><strong>Decrypt:</strong> they open this tool, switch to Decrypt package, paste JSON, enter the passphrase.</li></ol><p>Uses AES-256-CBC with PKCS#7 padding and the same passphrase-derived key scheme as the AES Decryption tool.</p>');
})();
