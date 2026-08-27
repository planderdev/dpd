import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const cssRoots = ["css"];
const skipFiles = new Set(["css/design-system.css"]);
const textSizes = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 30,
  32, 34, 36, 38, 40, 42, 44, 48, 50, 52, 55, 58, 60, 62, 64, 66, 70, 76, 80,
  100, 110, 120, 158, 160, 180
];
const fontWeightTokens = new Map([
  ["100", "var(--font-weight-thin)"],
  ["200", "var(--font-weight-extra-light)"],
  ["300", "var(--font-weight-light)"],
  ["400", "var(--font-weight-regular)"],
  ["500", "var(--font-weight-medium)"],
  ["600", "var(--font-weight-semibold)"],
  ["700", "var(--font-weight-bold)"],
  ["800", "var(--font-weight-extrabold)"],
  ["900", "var(--font-weight-black)"],
  ["normal", "var(--font-weight-regular)"],
  ["bold", "var(--font-weight-bold)"]
]);
const trackingTokens = new Map([
  ["normal", "var(--tracking-normal)"],
  ["0", "var(--tracking-none)"],
  ["-0.004em", "var(--tracking-neg-0004)"],
  ["-0.0083em", "var(--tracking-neg-00083)"],
  ["-0.009em", "var(--tracking-neg-0009)"],
  ["-0.01em", "var(--tracking-neg-001)"],
  ["-0.02em", "var(--tracking-neg-002)"],
  ["-0.0208em", "var(--tracking-neg-00208)"],
  ["-0.025em", "var(--tracking-neg-0025)"],
  ["-0.03em", "var(--tracking-neg-003)"],
  ["-0.03125em", "var(--tracking-neg-003125)"],
  ["-0.033em", "var(--tracking-neg-0033)"],
  ["-0.0333em", "var(--tracking-neg-00333)"],
  ["-0.05em", "var(--tracking-neg-005)"],
  ["-0.065em", "var(--tracking-neg-0065)"],
  ["0.2em", "var(--tracking-pos-02)"],
  ["0.3em", "var(--tracking-pos-03)"],
  ["1em", "var(--tracking-pos-10)"],
  ["-0.25px", "var(--tracking-neg-px-025)"],
  ["-0.3px", "var(--tracking-neg-px-03)"],
  ["-0.4px", "var(--tracking-neg-px-04)"],
  ["-0.45px", "var(--tracking-neg-px-045)"],
  ["-0.5px", "var(--tracking-neg-px-05)"],
  ["-0.6px", "var(--tracking-neg-px-06)"],
  ["-0.65px", "var(--tracking-neg-px-065)"],
  ["-0.75px", "var(--tracking-neg-px-075)"],
  ["-1px", "var(--tracking-neg-px-1)"],
  ["-2px", "var(--tracking-neg-px-2)"],
  ["0.25px", "var(--tracking-pos-px-025)"],
  ["5px", "var(--tracking-pos-px-5)"]
]);
const leadingTokens = new Map([
  ["normal", "var(--leading-browser)"],
  ["0", "var(--leading-reset)"],
  ["1", "var(--leading-100)"],
  ["1.1", "var(--leading-110)"],
  ["1.125", "var(--leading-112)"],
  ["1.17", "var(--leading-117)"],
  ["1.2", "var(--leading-120)"],
  ["1.24", "var(--leading-124)"],
  ["1.25", "var(--leading-125)"],
  ["1.3", "var(--leading-130)"],
  ["1.32", "var(--leading-132)"],
  ["1.37", "var(--leading-137)"],
  ["1.39", "var(--leading-139)"],
  ["1.4", "var(--leading-140)"],
  ["1.41", "var(--leading-141)"],
  ["1.43", "var(--leading-143)"],
  ["1.45", "var(--leading-145)"],
  ["1.5", "var(--leading-150)"],
  ["1.54", "var(--leading-154)"],
  ["1.55", "var(--leading-155)"],
  ["1.58", "var(--leading-158)"],
  ["1.59", "var(--leading-159)"],
  ["1.6", "var(--leading-160)"],
  ["1.625", "var(--leading-1625)"],
  ["1.66", "var(--leading-166)"],
  ["1.7", "var(--leading-170)"],
  ["1.73", "var(--leading-173)"],
  ["1.75", "var(--leading-175)"],
  ["1.77", "var(--leading-177)"],
  ["1.8", "var(--leading-180)"],
  ["2", "var(--leading-200)"],
  ["12px", "var(--leading-px-12)"],
  ["14px", "var(--leading-px-14)"],
  ["15px", "var(--leading-px-15)"],
  ["16px", "var(--leading-px-16)"],
  ["18px", "var(--leading-px-18)"],
  ["20px", "var(--leading-px-20)"],
  ["22px", "var(--leading-px-22)"],
  ["23px", "var(--leading-px-23)"],
  ["24px", "var(--leading-px-24)"],
  ["25px", "var(--leading-px-25)"],
  ["26px", "var(--leading-px-26)"],
  ["27px", "var(--leading-px-27)"],
  ["28px", "var(--leading-px-28)"],
  ["30px", "var(--leading-px-30)"],
  ["32px", "var(--leading-px-32)"],
  ["34px", "var(--leading-px-34)"],
  ["35px", "var(--leading-px-35)"],
  ["36px", "var(--leading-px-36)"],
  ["38px", "var(--leading-px-38)"],
  ["40px", "var(--leading-px-40)"],
  ["42px", "var(--leading-px-42)"],
  ["44px", "var(--leading-px-44)"],
  ["45px", "var(--leading-px-45)"],
  ["46px", "var(--leading-px-46)"],
  ["47px", "var(--leading-px-47)"],
  ["48px", "var(--leading-px-48)"],
  ["50px", "var(--leading-px-50)"],
  ["52px", "var(--leading-px-52)"],
  ["56px", "var(--leading-px-56)"],
  ["62px", "var(--leading-px-62)"],
  ["96px", "var(--leading-px-96)"],
  ["2rem", "var(--leading-rem-20)"],
  ["2.4rem", "var(--leading-rem-24)"],
  ["2.6rem", "var(--leading-rem-26)"],
  ["3.6rem", "var(--leading-rem-36)"],
  ["4rem", "var(--leading-rem-40)"],
  ["4.8rem", "var(--leading-rem-48)"],
  ["5rem", "var(--leading-rem-50)"],
  ["5.4rem", "var(--leading-rem-54)"],
  ["6.9rem", "var(--leading-rem-69)"],
  ["10rem", "var(--leading-rem-100)"],
  ["0.75em", "var(--leading-em-075)"],
  ["1.17em", "var(--leading-em-117)"],
  ["1.2em", "var(--leading-em-120)"],
  ["1.25em", "var(--leading-em-125)"],
  ["1.3em", "var(--leading-em-130)"],
  ["1.4em", "var(--leading-em-140)"],
  ["1.5em", "var(--leading-em-150)"],
  ["1.6em", "var(--leading-em-160)"],
  ["1.625em", "var(--leading-em-1625)"],
  ["1.8em", "var(--leading-em-180)"],
  ["var(--header-height)", "var(--leading-header)"],
  ["var(--sub-menu-height)", "var(--leading-sub-menu)"],
  ["5..4rem", "var(--leading-rem-54)"]
]);

async function listCssFiles(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(path.join(root, dir), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const rel = path.posix.join(dir.replaceAll("\\", "/"), entry.name);
    if (entry.isDirectory()) out.push(...await listCssFiles(rel));
    if (entry.isFile() && entry.name.endsWith(".css") && !skipFiles.has(rel)) out.push(rel);
  }
  return out;
}

function nearest(value, step, min = step) {
  if (value === 0) return 0;
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  return sign * Math.max(min, Math.round(abs / step) * step);
}

function nearestTextSize(px) {
  return textSizes.reduce((best, current) => {
    return Math.abs(current - px) < Math.abs(best - px) ? current : best;
  }, textSizes[0]);
}

function lengthToPx(rawValue, unit) {
  const n = Number(rawValue);
  if (unit === "px") return n;
  if (unit === "rem") return n * 10;
  if (unit === "em") return n * 16;
  return n;
}

function spacingToken(px) {
  const rounded = nearest(px, 8);
  if (rounded === 0) return "0";
  const sign = rounded < 0 ? -1 : 1;
  const abs = Math.abs(rounded);
  if (abs <= 400) {
    return sign < 0 ? `calc(var(--space-${abs}) * -1)` : `var(--space-${abs})`;
  }
  const multiplier = abs / 8;
  return `calc(var(--space-8) * ${sign < 0 ? "-" : ""}${multiplier})`;
}

function radiusToken(px) {
  const rounded = Math.abs(nearest(px, 8));
  if (rounded === 0) return "0";
  if (rounded <= 96 || rounded === 128 || rounded === 160) return `var(--radius-${rounded})`;
  return `calc(var(--radius-8) * ${rounded / 8})`;
}

function replaceLengths(value, mode) {
  if (/calc\(|env\(/i.test(value)) return value;
  if (/^(auto|inherit|unset|initial)$/i.test(value.trim())) return value;
  return value.replace(/(-?\d*\.?\d+)(px|rem|em)\b/gi, (_, raw, unit) => {
    const px = lengthToPx(raw, unit.toLowerCase());
    return mode === "radius" ? radiusToken(px) : spacingToken(px);
  });
}

function replaceRadiusValue(value) {
  const important = /\s!important\s*$/i.test(value) ? " !important" : "";
  let v = value.replace(/\s!important\s*$/i, "").trim();
  if (/^(inherit|unset|initial)$/i.test(v)) return value;
  if (/^(50|100)%$/.test(v)) return `var(--radius-round)${important}`;
  if (/none/i.test(v)) return `var(--radius-8)${important}`;
  v = v.replace(/\b(50|100)%\b/g, "var(--radius-round)");
  v = replaceLengths(v, "radius");
  return `${v}${important}`;
}

function replaceFontSizeValue(value) {
  const important = /\s!important\s*$/i.test(value) ? " !important" : "";
  const v = value.replace(/\s!important\s*$/i, "").trim();
  if (/^(0|0px|0rem)$/i.test(v)) return `0${important}`;
  if (/^(inherit|initial|unset)$/i.test(v)) return value;
  if (/^larger$/i.test(v)) return `var(--font-size-18)${important}`;
  if (/^(smaller|small)$/i.test(v)) return `var(--font-size-13)${important}`;
  if (/^medium$/i.test(v)) return `var(--font-size-16)${important}`;
  if (/^large$/i.test(v)) return `var(--font-size-18)${important}`;
  if (/^x-large$/i.test(v)) return `var(--font-size-24)${important}`;
  if (/^xx-large$/i.test(v)) return `var(--font-size-32)${important}`;
  if (/var\(|calc\(/.test(v)) return value;
  const percent = v.match(/^(\d*\.?\d+)%$/);
  if (percent) {
    const size = nearestTextSize(16 * (Number(percent[1]) / 100));
    return `var(--font-size-${size})${important}`;
  }
  const match = v.match(/^(\d*\.?\d+)(px|rem|em)$/i);
  if (!match) return value;
  const px = lengthToPx(match[1], match[2].toLowerCase());
  const size = nearestTextSize(px);
  return `var(--font-size-${size})${important}`;
}

function normalizeTokenValue(value) {
  const v = value.trim().toLowerCase();
  if (v === "5..4rem") return v;
  const match = v.match(/^(-?(?:\d+|\d*\.\d+))(px|rem|em)?$/i);
  if (!match) return v;
  const numeric = Number(match[1]);
  const normalized = Number.isInteger(numeric) ? String(numeric) : String(numeric).replace(/0+$/, "").replace(/\.$/, "");
  return `${normalized}${match[2] ?? ""}`;
}

function replaceMappedValue(value, tokenMap) {
  const important = /\s!important\s*$/i.test(value) ? " !important" : "";
  const raw = value.replace(/\s!important\s*$/i, "").trim();
  const token = tokenMap.get(normalizeTokenValue(raw));
  if (token) return `${token}${important}`;
  if (/^(inherit|initial|unset|revert|var\(|calc\()/i.test(raw)) return value;
  return value;
}

function replaceFontWeightValue(value) {
  return replaceMappedValue(value, fontWeightTokens);
}

function replaceLetterSpacingValue(value) {
  return replaceMappedValue(value, trackingTokens);
}

function replaceLineHeightValue(value) {
  return replaceMappedValue(value, leadingTokens);
}

function normalizeHex(hex) {
  let raw = hex.slice(1).toLowerCase();
  if (raw.length === 3) raw = raw.split("").map((ch) => ch + ch).join("");
  if (raw.length === 4) raw = raw.split("").map((ch) => ch + ch).join("");
  return `#${raw.slice(0, 6)}`;
}

function hexToRgb(hex) {
  const n = Number.parseInt(normalizeHex(hex).slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function isGray([r, g, b]) {
  return Math.abs(r - g) <= 3 && Math.abs(g - b) <= 3;
}

function colorTokenForRgb(rgb, alpha = null) {
  const [r, g, b] = rgb;
  if (alpha === "0" || alpha === 0) return "var(--color-transparent)";
  if (r === 255 && g === 255 && b === 255) {
    return alpha == null ? "var(--color-white)" : `rgb(var(--color-white-rgb) / ${alpha})`;
  }
  if (isGray(rgb)) {
    if (r <= 48) return alpha == null ? "var(--color-primary)" : `rgb(var(--color-primary-rgb) / ${alpha})`;
    if (r >= 238) return alpha == null ? "var(--color-border-soft)" : `rgb(var(--color-white-rgb) / ${alpha})`;
    if (r >= 210) return alpha == null ? "var(--color-border)" : `rgb(var(--color-primary-rgb) / ${alpha})`;
    return alpha == null ? "var(--color-text-muted)" : `rgb(var(--color-primary-rgb) / ${alpha})`;
  }
  const accentish = [
    [28, 46, 88], [14, 27, 59], [93, 122, 191], [38, 55, 95],
    [82, 94, 125], [0, 133, 196], [0, 167, 207], [6, 180, 224],
    [245, 128, 32], [235, 133, 0], [240, 97, 42], [160, 203, 73],
    [207, 5, 5]
  ].some(([ar, ag, ab]) => Math.abs(r - ar) + Math.abs(g - ag) + Math.abs(b - ab) < 60);
  if (accentish) return alpha == null ? "var(--color-secondary)" : `rgb(var(--color-secondary-rgb) / ${alpha})`;
  return alpha == null ? "var(--color-secondary)" : `rgb(var(--color-secondary-rgb) / ${alpha})`;
}

function replaceColors(text) {
  text = text.replace(/#[0-9a-fA-F]{3,8}\b/g, (hex) => colorTokenForRgb(hexToRgb(hex)));
  return text.replace(/\brgba?\(([^)]*)\)/gi, (match, body) => {
    const parts = body.split(/\s*,\s*|\s+\/\s+|\s+/).filter(Boolean);
    if (parts.length < 3 || parts.some((p, i) => i < 3 && p.includes("%"))) return match;
    const rgb = parts.slice(0, 3).map((p) => Number(p));
    if (rgb.some((n) => Number.isNaN(n))) return match;
    const alpha = parts.length >= 4 ? parts[3] : null;
    return colorTokenForRgb(rgb, alpha);
  });
}

function tokenizeCss(text) {
  const fontFaceBlocks = [];
  text = text.replace(/@font-face\s*\{[\s\S]*?\}/gi, (match) => {
    const key = `__FONT_FACE_BLOCK_${fontFaceBlocks.length}__`;
    fontFaceBlocks.push(match);
    return key;
  });

  text = text.replace(/(font-family\s*:\s*)([^;{}]+)(;?)/gi, (match, prefix, value, suffix) => {
    if (/xeicon|swiper-icons|material[-\s]?icons/i.test(value)) return match;
    return `${prefix}var(--font-sans)${suffix}`;
  });

  text = text.replace(/(font-size\s*:\s*)([^;{}]+)(;?)/gi, (match, prefix, value, suffix) => {
    return `${prefix}${replaceFontSizeValue(value)}${suffix}`;
  });

  text = text.replace(/(font-weight\s*:\s*)([^;{}]+)(;?)/gi, (match, prefix, value, suffix) => {
    return `${prefix}${replaceFontWeightValue(value)}${suffix}`;
  });

  text = text.replace(/(letter-spacing\s*:\s*)([^;{}]+)(;?)/gi, (match, prefix, value, suffix) => {
    return `${prefix}${replaceLetterSpacingValue(value)}${suffix}`;
  });

  text = text.replace(/(line-height\s*:\s*)([^;{}]+)(;?)/gi, (match, prefix, value, suffix) => {
    return `${prefix}${replaceLineHeightValue(value)}${suffix}`;
  });

  text = text.replace(/((?:-webkit-|-moz-|-o-)?border(?:-(?:top-left|top-right|bottom-left|bottom-right))?-radius\s*:\s*)([^;{}]+)(;?)/gim, (_, prefix, value, suffix) => {
    return `${prefix}${replaceRadiusValue(value)}${suffix}`;
  });

  text = text.replace(/((?:margin|padding|gap|row-gap|column-gap|grid-gap|grid-row-gap|grid-column-gap)(?:-(?:top|right|bottom|left))?\s*:\s*)([^;{}]+)(;?)/gim, (_, prefix, value, suffix) => {
    return `${prefix}${replaceLengths(value, "spacing")}${suffix}`;
  });

  text = replaceColors(text);

  text = text.replace(/--main-color\s*:\s*[^;{}]+;/g, "--main-color: var(--color-primary);");
  text = text.replace(/--swiper-theme-color\s*:\s*[^;{}]+;/g, "--swiper-theme-color: var(--color-secondary);");
  text = text.replace(/--swiper-navigation-color\s*:\s*[^;{}]+;/g, "--swiper-navigation-color: var(--color-secondary);");
  text = text.replace(/--swiper-pagination-color\s*:\s*[^;{}]+;/g, "--swiper-pagination-color: var(--color-secondary);");

  text = text.replace(/__FONT_FACE_BLOCK_(\d+)__/g, (_, index) => fontFaceBlocks[Number(index)]);

  return text;
}

const files = (await Promise.all(cssRoots.map(listCssFiles))).flat();
for (const file of files) {
  const abs = path.join(root, file);
  const before = await readFile(abs, "utf8");
  const after = tokenizeCss(before);
  if (after !== before) await writeFile(abs, after);
}

console.log(`Tokenized ${files.length} CSS files`);
