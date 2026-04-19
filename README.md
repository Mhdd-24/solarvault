# SolarVault

> Free developer tools in your browser — client-side, private, no accounts.

SolarVault is a static site of utilities for encoding, conversion, formatting, lightweight crypto helpers, and images. Everything runs locally; your inputs are not sent to an app server.

There are **85 tools** in five hubs (see [All tools](#all-tools-85) below).

---

## Quick start

1. Edit the `site` object in `tools.json` (name, domain, GitHub URL, tagline, theme color).
2. Run `npm run build` to regenerate the `docs/` folder.
3. Serve `docs/` locally, for example: `npm run dev` → open **http://localhost:3000**.

---

## Features

- 100% client-side processing in the browser
- No login or accounts
- Optional Google Analytics — set `ga4MeasurementId` in `tools.json` if you want it; otherwise it is not loaded
- Responsive layout
- MIT license

---

## Tech stack

- Vanilla HTML, CSS, and JavaScript
- `build.js` reads `tools.json` and writes static pages into `docs/`
- Fits GitHub Pages when `docs/` is published from the default branch

---

## Run locally

```bash
git clone https://github.com/Mhdd-24/SolarVault.git
cd <repo-folder>
npm install
npm run dev
```

Then open **http://localhost:3000** (build + static server).

---

## Hub index

| Hub | Tools | Path |
| --- | -----: | ---- |
| Crypto | 18 | [/tools/crypto/](/tools/crypto/) |
| Encoding | 16 | [/tools/encoding/](/tools/encoding/) |
| Converter | 12 | [/tools/converter/](/tools/converter/) |
| Dev | 23 | [/tools/dev/](/tools/dev/) |
| Image | 16 | [/tools/image/](/tools/image/) |

---

## All tools (85)

Paths are relative to the site root (same as in the built site).

### Crypto hub (18 tools)

- [AES Decryption Tool](/tools/aes-decryption/)
- [AES Encryption Tool](/tools/aes-encryption/)
- [Bcrypt Hash Generator](/tools/bcrypt-generator/)
- [Checksum Generator](/tools/checksum-generator/)
- [Hash Comparator & Verifier](/tools/hash-comparator/)
- [HMAC Generator](/tools/hmac-generator/)
- [JWT Builder](/tools/jwt-builder/)
- [MD5 Hash Generator](/tools/md5-generator/)
- [Password Strength Checker](/tools/password-strength/)
- [RIPEMD-160 Hash Generator](/tools/ripemd160-generator/)
- [RSA Encrypt & Decrypt](/tools/rsa-encrypt-decrypt/)
- [RSA Key Pair Generator](/tools/rsa-key-generator/)
- [SHA-1 Hash Generator](/tools/sha1-generator/)
- [SHA-256 Hash Generator](/tools/sha256-generator/)
- [SHA-3 Hash Generator](/tools/sha3-generator/)
- [SHA-512 Hash Generator](/tools/sha512-generator/)
- [SSL Certificate Decoder](/tools/ssl-cert-decoder/)
- [TOTP Generator](/tools/totp-generator/)

### Encoding hub (16 tools)

- [Base64 Decoder](/tools/base64-decode/)
- [Base64 Encoder](/tools/base64-encode/)
- [Binary Decoder](/tools/binary-decode/)
- [Binary Encoder](/tools/binary-encode/)
- [Hex Decoder](/tools/hex-decode/)
- [Hex Encoder](/tools/hex-encode/)
- [HTML Entity Decoder](/tools/html-decode/)
- [HTML Entity Encoder](/tools/html-encode/)
- [HTML Formatter](/tools/html-formatter/)
- [JSON Formatter & Validator](/tools/json-formatter/)
- [JSON Minifier](/tools/json-minifier/)
- [JSON Schema Validator](/tools/json-schema-validator/)
- [URL Decoder](/tools/url-decode/)
- [URL Encoder](/tools/url-encode/)
- [XML Formatter](/tools/xml-formatter/)
- [YAML Formatter](/tools/yaml-formatter/)

### Converter hub (12 tools)

- [CSV to Excel Converter](/tools/csv-to-excel/)
- [CSV to JSON Converter](/tools/csv-json-converter/)
- [Decimal to Hex Converter](/tools/decimal-to-hex/)
- [DOCX to HTML Converter](/tools/docx-to-html/)
- [Hex to Decimal Converter](/tools/hex-to-decimal/)
- [JSON to CSV Converter](/tools/json-to-csv/)
- [JSON to XML Converter](/tools/json-xml-converter/)
- [JSON to YAML Converter](/tools/json-to-yaml/)
- [Markdown to PDF](/tools/markdown-to-pdf/)
- [Number Base Converter](/tools/number-base-converter/)
- [XML to JSON Converter](/tools/xml-json-converter/)
- [YAML to JSON Converter](/tools/yaml-json-converter/)

### Dev hub (23 tools)

- [ASCII Table](/tools/ascii-table/)
- [Bit / Byte Calculator](/tools/bit-calculator/)
- [Cron Expression Explainer](/tools/cron-expression-explainer/)
- [Cron Expression Generator](/tools/cron-expression-generator/)
- [CSS Formatter](/tools/css-formatter/)
- [DNS Lookup](/tools/dns-lookup/)
- [Epoch Converter](/tools/epoch-converter/)
- [Gzip Compress / Decompress](/tools/gzip-tool/)
- [HTTP Header Parser](/tools/http-header-parser/)
- [IP Address Tools](/tools/ip-address-tools/)
- [JavaScript Minifier](/tools/js-minifier/)
- [JWT Decoder & Inspector](/tools/jwt-decoder/)
- [JWT Encoder](/tools/jwt-encoder/)
- [Lorem Ipsum Generator](/tools/lorem-ipsum-generator/)
- [Markdown Previewer](/tools/markdown-preview/)
- [Random Password Generator](/tools/random-password-generator/)
- [Random String Generator](/tools/random-string-generator/)
- [Regex Tester](/tools/regex-tester/)
- [SQL Formatter](/tools/sql-formatter/)
- [Text Diff Checker](/tools/diff-checker/)
- [Unix Timestamp Converter](/tools/unix-timestamp-converter/)
- [UUID / GUID Generator](/tools/uuid-generator/)
- [Word & Character Counter](/tools/word-counter/)

### Image hub (16 tools)

- [Color Code Converter](/tools/color-converter/)
- [Color Palette Generator](/tools/color-palette/)
- [HEIC to JPG Converter](/tools/heic-to-jpg/)
- [HEIC to PNG Converter](/tools/heic-to-png/)
- [HEIC to WebP Converter](/tools/heic-to-webp/)
- [Image Filters & Effects](/tools/image-enhancer/)
- [Image Format Converter](/tools/image-converter/)
- [Image Resizer](/tools/image-resizer/)
- [JPG to PNG Converter](/tools/jpg-to-png/)
- [JPG to WebP Converter](/tools/jpg-to-webp/)
- [PNG to JPG Converter](/tools/png-to-jpg/)
- [PNG to WebP Converter](/tools/png-to-webp/)
- [QR Code Generator](/tools/qr-generator/)
- [SVG to PNG Converter](/tools/svg-to-png/)
- [WebP to JPG Converter](/tools/webp-to-jpg/)
- [WebP to PNG Converter](/tools/webp-to-png/)

---

## License

MIT.

---

## Contributing

Issues and pull requests are welcome on your GitHub repository once you publish the project.
