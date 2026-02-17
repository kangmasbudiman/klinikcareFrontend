import sharp from "sharp";
import { mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "..", "public", "logo");

// Logomark F — Stethoscope C
const logomarkSVG = `
<svg width="512" height="512" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="markF-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#0891B2" />
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="112" height="112" rx="24" fill="url(#markF-bg)" />
  <path
    d="M80 30C70 22 58 20 46 24C30 30 22 46 24 62C26 78 40 92 58 92C68 90 76 84 82 76"
    fill="none"
    stroke="white"
    stroke-width="7"
    stroke-linecap="round"
  />
  <circle cx="80" cy="30" r="6" fill="none" stroke="white" stroke-width="3" />
  <circle cx="80" cy="30" r="2" fill="#67E8F9" />
  <circle cx="82" cy="76" r="10" fill="none" stroke="white" stroke-width="3" />
  <circle cx="82" cy="76" r="5" fill="#67E8F9" />
  <path
    d="M36 58L44 58L48 48L54 68L58 52L62 58L70 58"
    fill="none"
    stroke="#67E8F9"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

// Combination logo (icon + text)
function comboSVG(width, height) {
  return `
<svg width="${width}" height="${height}" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="combo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#0891B2" />
    </linearGradient>
  </defs>
  <!-- Icon -->
  <g transform="translate(0,10) scale(0.67)">
    <rect x="4" y="4" width="112" height="112" rx="24" fill="url(#combo-bg)" />
    <path d="M80 30C70 22 58 20 46 24C30 30 22 46 24 62C26 78 40 92 58 92C68 90 76 84 82 76" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" />
    <circle cx="80" cy="30" r="6" fill="none" stroke="white" stroke-width="3" />
    <circle cx="80" cy="30" r="2" fill="#67E8F9" />
    <circle cx="82" cy="76" r="10" fill="none" stroke="white" stroke-width="3" />
    <circle cx="82" cy="76" r="5" fill="#67E8F9" />
    <path d="M36 58L44 58L48 48L54 68L58 52L62 58L70 58" fill="none" stroke="#67E8F9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <!-- Text -->
  <text x="95" y="52" font-family="Inter, system-ui, Arial, Helvetica, sans-serif" font-size="40" letter-spacing="-0.5">
    <tspan font-weight="300" fill="#334155">clin</tspan><tspan font-weight="700" fill="#2563EB">exa</tspan>
  </text>
  <text x="95" y="72" font-family="Inter, system-ui, Arial, Helvetica, sans-serif" font-size="10" font-weight="500" fill="#94A3B8" letter-spacing="3">SMART CLINIC MANAGEMENT</text>
</svg>
`;
}

// White version for dark backgrounds
function comboWhiteSVG(width, height) {
  return `
<svg width="${width}" height="${height}" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="combow-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#0891B2" />
    </linearGradient>
  </defs>
  <!-- Icon -->
  <g transform="translate(0,10) scale(0.67)">
    <rect x="4" y="4" width="112" height="112" rx="24" fill="url(#combow-bg)" />
    <path d="M80 30C70 22 58 20 46 24C30 30 22 46 24 62C26 78 40 92 58 92C68 90 76 84 82 76" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" />
    <circle cx="80" cy="30" r="6" fill="none" stroke="white" stroke-width="3" />
    <circle cx="80" cy="30" r="2" fill="#67E8F9" />
    <circle cx="82" cy="76" r="10" fill="none" stroke="white" stroke-width="3" />
    <circle cx="82" cy="76" r="5" fill="#67E8F9" />
    <path d="M36 58L44 58L48 48L54 68L58 52L62 58L70 58" fill="none" stroke="#67E8F9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <!-- Text White -->
  <text x="95" y="52" font-family="Inter, system-ui, Arial, Helvetica, sans-serif" font-size="40" letter-spacing="-0.5">
    <tspan font-weight="300" fill="white">clin</tspan><tspan font-weight="700" fill="white">exa</tspan>
  </text>
  <text x="95" y="72" font-family="Inter, system-ui, Arial, Helvetica, sans-serif" font-size="10" font-weight="500" fill="rgba(103,232,249,0.7)" letter-spacing="3">SMART CLINIC MANAGEMENT</text>
</svg>
`;
}

async function exportLogos() {
  await mkdir(outputDir, { recursive: true });

  const sizes = [16, 32, 48, 64, 128, 256, 512];

  console.log("Exporting Clinexa logos...\n");

  // Export logomark in multiple sizes
  for (const size of sizes) {
    const filename = `clinexa-icon-${size}x${size}.png`;
    await sharp(Buffer.from(logomarkSVG))
      .resize(size, size)
      .png()
      .toFile(join(outputDir, filename));
    console.log(`  ✓ ${filename}`);
  }

  // Export combination logo
  const comboSizes = [
    { w: 400, h: 100, label: "400x100" },
    { w: 800, h: 200, label: "800x200" },
    { w: 1200, h: 300, label: "1200x300" },
  ];

  for (const { w, h, label } of comboSizes) {
    const filename = `clinexa-logo-${label}.png`;
    await sharp(Buffer.from(comboSVG(w, h)))
      .resize(w, h)
      .png()
      .toFile(join(outputDir, filename));
    console.log(`  ✓ ${filename}`);
  }

  // Export white version
  for (const { w, h, label } of comboSizes) {
    const filename = `clinexa-logo-white-${label}.png`;
    await sharp(Buffer.from(comboWhiteSVG(w, h)))
      .resize(w, h)
      .png()
      .toFile(join(outputDir, filename));
    console.log(`  ✓ ${filename}`);
  }

  // Export favicon size
  await sharp(Buffer.from(logomarkSVG))
    .resize(192, 192)
    .png()
    .toFile(join(outputDir, "clinexa-icon-192x192.png"));
  console.log("  ✓ clinexa-icon-192x192.png");

  await sharp(Buffer.from(logomarkSVG))
    .resize(180, 180)
    .png()
    .toFile(join(outputDir, "apple-touch-icon.png"));
  console.log("  ✓ apple-touch-icon.png");

  // Export SVG files too
  const { writeFile } = await import("fs/promises");
  await writeFile(join(outputDir, "clinexa-icon.svg"), logomarkSVG.trim());
  console.log("  ✓ clinexa-icon.svg");
  await writeFile(join(outputDir, "clinexa-logo.svg"), comboSVG(400, 100).trim());
  console.log("  ✓ clinexa-logo.svg");
  await writeFile(join(outputDir, "clinexa-logo-white.svg"), comboWhiteSVG(400, 100).trim());
  console.log("  ✓ clinexa-logo-white.svg");

  console.log(`\n✅ All logos exported to: public/logo/`);
}

exportLogos().catch(console.error);
