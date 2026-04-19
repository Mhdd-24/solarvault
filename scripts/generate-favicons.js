const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="7" fill="#141a2e"/>
  <circle cx="16" cy="10" r="5.5" fill="#f2c14e"/>
  <path d="M7 22.5Q16 13 25 22.5" stroke="#d4a24a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <rect x="11" y="24" width="10" height="2.5" rx="1" fill="#5a6c8a" opacity="0.9"/>
</svg>`);

const sizes = [16, 32, 48, 180, 192, 512];
const outDir = path.join(__dirname, '../static');

async function generate() {
  for (const size of sizes) {
    const filename =
      size === 180 ? 'apple-touch-icon.png' :
      size === 192 ? 'android-chrome-192x192.png' :
      size === 512 ? 'android-chrome-512x512.png' :
      `favicon-${size}x${size}.png`;
    await sharp(svgBuffer).resize(size, size).png().toFile(path.join(outDir, filename));
    console.log(`Generated ${filename}`);
  }

  // favicon.ico = 32x32 PNG renamed (browsers accept PNG as .ico)
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(outDir, 'favicon.ico'));
  console.log('Generated favicon.ico');

  // site.webmanifest
  const manifest = {
    name: 'SolarVault',
    short_name: 'SolarVault',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    theme_color: '#0e1119',
    background_color: '#0e1119',
    display: 'standalone',
    start_url: '/'
  };
  fs.writeFileSync(path.join(outDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Generated site.webmanifest');
}

generate().catch(console.error);
