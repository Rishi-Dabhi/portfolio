import { mkdir, writeFile } from "node:fs/promises";

// Generate the artwork ahead of time: visitors never need a live Canvas context.
// All coordinates are seeded, so regeneration is deterministic.
function randomSequence(seed) {
  return () => {
    seed |= 0;
    seed = seed + 0x6d2b79f5 | 0;
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

const random = randomSequence(23071969);
const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(random(), 0.0001))) * Math.cos(2 * Math.PI * random());
const radius = 403.2;
const tilt = -0.23;
const round = value => Number(value.toFixed(2));
const buckets = new Map();

function project(x, y, z = 0) {
  const py = y * 0.46 + z;
  return [600 + (x * Math.cos(tilt) - py * Math.sin(tilt)) * radius,
          210 + (x * Math.sin(tilt) + py * Math.cos(tilt)) * radius];
}

function star(x, y, size, color, opacity) {
  const alpha = Math.max(0.04, Math.round(opacity * 12) / 12);
  const key = `${color}|${alpha}`;
  const mark = `M${round(x)} ${round(y)}h${round(size)}v${round(size)}h-${round(size)}z`;
  buckets.set(key, (buckets.get(key) || "") + mark);
}

for (let index = 0; index < 14500; index++) {
  const r = Math.pow(random(), 0.72);
  const angle = index % 2 * Math.PI + r * 6.8 + gaussian() * (0.1 + r * 0.12);
  const spread = gaussian() * (0.012 + r * 0.026);
  const [x, y] = project(Math.cos(angle) * r + spread, Math.sin(angle) * r + spread * 0.6, gaussian() * 0.012 * (1 - r * 0.6));
  const alpha = (0.12 + random() * 0.34) * (1 - r * 0.56);
  const size = (0.35 + random() * 0.8) * radius / 380;
  star(x, y, size, r < 0.28 ? "#e1cba4" : "#9fb7c9", alpha);
}

for (let index = 0; index < 8700; index++) {
  const r = 0.012 + Math.pow(random(), 2.1) * 0.988;
  const angle = random() * Math.PI * 2;
  const [x, y] = project(Math.cos(angle) * r, Math.sin(angle) * r, gaussian() * 0.018 * (1 - r));
  const alpha = (0.12 + random() * 0.26) * (1 - r * 0.8);
  star(x, y, (0.3 + random() * 0.65) * radius / 380, "#dec69b", alpha);
}

const points = [...buckets].map(([key, path]) => {
  const [color, opacity] = key.split("|");
  return `<path fill="${color}" opacity="${opacity}" d="${path}"/>`;
}).join("\n");

const lanes = [0, 1].map(arm => {
  let path = "";
  for (let step = 0; step <= 100; step++) {
    const r = 0.12 + step / 100 * 0.76;
    const angle = arm * Math.PI + r * 6.8 - 0.13;
    const [x, y] = project(Math.cos(angle) * r, Math.sin(angle) * r);
    path += `${step ? "L" : "M"}${round(x)} ${round(y)}`;
  }
  return `<path d="${path}" fill="none" stroke="#0c0e0c" stroke-opacity=".34" stroke-width="3.6"/>`;
}).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="420" viewBox="0 0 1200 420" fill="none">
<title>Illustrative spiral galaxy</title>
<defs>
  <radialGradient id="halo">
    <stop stop-color="#d6bb89" stop-opacity=".19"/>
    <stop offset=".14" stop-color="#c4ae8b" stop-opacity=".12"/>
    <stop offset=".45" stop-color="#8f9fa4" stop-opacity=".035"/>
    <stop offset="1" stop-color="#6a899c" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="nucleus">
    <stop stop-color="#ffefcc" stop-opacity=".76"/>
    <stop offset=".08" stop-color="#f9e2b2" stop-opacity=".55"/>
    <stop offset=".3" stop-color="#ddbc87" stop-opacity=".24"/>
    <stop offset="1" stop-color="#be9a6c" stop-opacity="0"/>
  </radialGradient>
</defs>
<ellipse cx="600" cy="210" rx="403.2" ry="185.47" transform="rotate(-13.18 600 210)" fill="url(#halo)"/>
${points}
${lanes}
<ellipse cx="600" cy="210" rx="72.58" ry="47.9" transform="rotate(-13.18 600 210)" fill="url(#nucleus)"/>
</svg>\n`;

const directory = new URL("../public/galaxy/", import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(new URL("spiral.svg", directory), svg);
console.log(`Generated public/galaxy/spiral.svg (${Buffer.byteLength(svg)} bytes)`);
