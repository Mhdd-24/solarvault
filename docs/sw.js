'use strict';
var CACHE = "sv-1776561726760";
var PRECACHE = ["/","/tools.json","/site.webmanifest","/404.html","/sitemap.xml","/robots.txt","/assets/css/base.css","/assets/css/layout.css","/assets/css/tool.css","/assets/css/feedback.css","/assets/js/core/ui.js","/assets/js/core/sv-state.js","/assets/js/core/smart-suggest.js","/assets/js/core/pwa.js","/assets/js/feedback.js","/assets/js/tools/aes-decryption.js","/assets/js/tools/aes-encryption.js","/assets/js/tools/api-request-builder.js","/assets/js/tools/ascii-table.js","/assets/js/tools/base64-decode.js","/assets/js/tools/base64-encode.js","/assets/js/tools/bcrypt-generator.js","/assets/js/tools/binary-decode.js","/assets/js/tools/binary-encode.js","/assets/js/tools/bit-calculator.js","/assets/js/tools/checksum-generator.js","/assets/js/tools/color-converter.js","/assets/js/tools/color-palette.js","/assets/js/tools/cron-expression-explainer.js","/assets/js/tools/cron-expression-generator.js","/assets/js/tools/css-formatter.js","/assets/js/tools/csv-json-converter.js","/assets/js/tools/csv-to-excel.js","/assets/js/tools/diff-checker.js","/assets/js/tools/dns-lookup.js","/assets/js/tools/docker-command-generator.js","/assets/js/tools/docx-to-html.js","/assets/js/tools/encrypt-before-sharing.js","/assets/js/tools/env-file-generator.js","/assets/js/tools/epoch-converter.js","/assets/js/tools/git-command-helper.js","/assets/js/tools/gzip-tool.js","/assets/js/tools/hash-comparator.js","/assets/js/tools/hex-decode.js","/assets/js/tools/hex-encode.js","/assets/js/tools/hmac-generator.js","/assets/js/tools/html-decode.js","/assets/js/tools/html-encode.js","/assets/js/tools/html-formatter.js","/assets/js/tools/http-header-parser.js","/assets/js/tools/image-converter.js","/assets/js/tools/image-enhancer.js","/assets/js/tools/image-resizer.js","/assets/js/tools/ip-address-tools.js","/assets/js/tools/js-minifier.js","/assets/js/tools/json-formatter.js","/assets/js/tools/json-minifier.js","/assets/js/tools/json-schema-validator.js","/assets/js/tools/json-to-csv.js","/assets/js/tools/json-xml-converter.js","/assets/js/tools/jwt-builder.js","/assets/js/tools/jwt-decoder.js","/assets/js/tools/jwt-encoder.js","/assets/js/tools/lorem-ipsum-generator.js","/assets/js/tools/markdown-preview.js","/assets/js/tools/markdown-to-pdf.js","/assets/js/tools/md5-generator.js","/assets/js/tools/number-base-converter.js","/assets/js/tools/password-strength.js","/assets/js/tools/qr-generator.js","/assets/js/tools/random-password-generator.js","/assets/js/tools/random-string-generator.js","/assets/js/tools/regex-tester.js","/assets/js/tools/ripemd160-generator.js","/assets/js/tools/rsa-encrypt-decrypt.js","/assets/js/tools/rsa-key-generator.js","/assets/js/tools/sha1-generator.js","/assets/js/tools/sha256-generator.js","/assets/js/tools/sha3-generator.js","/assets/js/tools/sha512-generator.js","/assets/js/tools/sql-formatter.js","/assets/js/tools/ssl-cert-decoder.js","/assets/js/tools/svg-to-png.js","/assets/js/tools/totp-generator.js","/assets/js/tools/unix-timestamp-converter.js","/assets/js/tools/url-decode.js","/assets/js/tools/url-encode.js","/assets/js/tools/uuid-generator.js","/assets/js/tools/word-counter.js","/assets/js/tools/xml-formatter.js","/assets/js/tools/xml-json-converter.js","/assets/js/tools/yaml-formatter.js","/assets/js/tools/yaml-json-converter.js","/tools/aes-encryption/","/tools/aes-decryption/","/tools/encrypt-before-sharing/","/tools/sha256-generator/","/tools/sha512-generator/","/tools/sha1-generator/","/tools/sha3-generator/","/tools/md5-generator/","/tools/ripemd160-generator/","/tools/hmac-generator/","/tools/rsa-key-generator/","/tools/hash-comparator/","/tools/checksum-generator/","/tools/base64-encode/","/tools/base64-decode/","/tools/url-encode/","/tools/url-decode/","/tools/html-encode/","/tools/html-decode/","/tools/hex-encode/","/tools/hex-decode/","/tools/binary-encode/","/tools/binary-decode/","/tools/json-formatter/","/tools/json-minifier/","/tools/xml-json-converter/","/tools/json-xml-converter/","/tools/csv-json-converter/","/tools/yaml-json-converter/","/tools/jwt-decoder/","/tools/jwt-encoder/","/tools/uuid-generator/","/tools/random-password-generator/","/tools/random-string-generator/","/tools/unix-timestamp-converter/","/tools/cron-expression-generator/","/tools/cron-expression-explainer/","/tools/http-header-parser/","/tools/bcrypt-generator/","/tools/regex-tester/","/tools/color-converter/","/tools/number-base-converter/","/tools/lorem-ipsum-generator/","/tools/sql-formatter/","/tools/markdown-preview/","/tools/diff-checker/","/tools/word-counter/","/tools/ip-address-tools/","/tools/rsa-encrypt-decrypt/","/tools/password-strength/","/tools/totp-generator/","/tools/ssl-cert-decoder/","/tools/json-schema-validator/","/tools/json-to-csv/","/tools/qr-generator/","/tools/svg-to-png/","/tools/image-converter/","/tools/image-resizer/","/tools/markdown-to-pdf/","/tools/csv-to-excel/","/tools/docx-to-html/","/tools/gzip-tool/","/tools/ascii-table/","/tools/bit-calculator/","/tools/dns-lookup/","/tools/epoch-converter/","/tools/jwt-builder/","/tools/color-palette/","/tools/image-enhancer/","/tools/png-to-jpg/","/tools/jpg-to-png/","/tools/png-to-webp/","/tools/jpg-to-webp/","/tools/webp-to-png/","/tools/webp-to-jpg/","/tools/json-to-yaml/","/tools/decimal-to-hex/","/tools/hex-to-decimal/","/tools/heic-to-jpg/","/tools/heic-to-png/","/tools/heic-to-webp/","/tools/xml-formatter/","/tools/yaml-formatter/","/tools/html-formatter/","/tools/css-formatter/","/tools/js-minifier/","/tools/api-request-builder/","/tools/env-file-generator/","/tools/docker-command-generator/","/tools/git-command-helper/","/tools/crypto/","/tools/encoding/","/tools/dev/","/tools/converter/","/tools/image/","/tools/privacy-policy/"];
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.allSettled(
        PRECACHE.map(function (url) {
          return fetch(url, { cache: 'reload', credentials: 'same-origin' }).then(function (res) {
            if (res && res.ok) return cache.put(url, res.clone());
          }).catch(function () {});
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(event.request, copy); });
        }
        return res;
      })
      .catch(function () { return caches.match(event.request); })
  );
});
