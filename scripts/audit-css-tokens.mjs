import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const cssRoots = ["assets/css"];
// 토큰 정의 파일과 아이콘 폰트, 외부 플러그인 원본, 리팩터링 전 보관본은 검사 대상이 아니다.
const skipFiles = new Set([
  "assets/css/tokens.css",
  "assets/css/admin-system.css",
  "assets/css/icons.css",
  "assets/css/admin-icons.css",
  "assets/css/swiper.css",
  "assets/css/vendors.css"
]);
const skipDirs = new Set(["archive"]);

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
    if (entry.isDirectory() && !skipDirs.has(entry.name)) out.push(...await listCssFiles(rel));
    if (entry.isFile() && entry.name.endsWith(".css") && !skipFiles.has(rel)) out.push(rel);
  }
  return out;
}

function lineAt(css, index) {
  return css.slice(0, index).split(/\r?\n/).length;
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function stripFontFace(css) {
  return css.replace(/@font-face\s*\{[\s\S]*?\}/gi, "");
}

function hasRawColor(value) {
  return /(#[0-9a-fA-F]{3,8}\b|\brgba?\((?!\s*var\())/i.test(value);
}

function hasRawLength(value) {
  return /(^|[\s(,])-?\d*\.?\d+(px|rem|em)\b/i.test(value.replace(/var\([^)]*\)/g, ""));
}

// 토큰 이름은 계속 늘어나므로 특정 이름이 아니라 var() 사용 여부를 본다.
// 아이콘 폰트는 폰트 패밀리 이름 자체가 식별자라 예외로 둔다.
function isFontFamilyTokenized(value) {
  return /(var\(--|xeicon|remixicon|swiper-icons|material[-\s]?icons)/i.test(value);
}

function isFontSizeTokenized(value) {
  return /^(0|inherit|initial|unset|var\(--)/i.test(value.trim());
}

function isFontWeightTokenized(value) {
  return /^(inherit|initial|unset|var\(--)/i.test(value.trim());
}

function isLetterSpacingTokenized(value) {
  return /^(normal|inherit|initial|unset|var\(--)/i.test(value.trim());
}

function isLineHeightTokenized(value) {
  return /^(normal|inherit|initial|unset|var\(--)/i.test(value.trim());
}

function isRadiusTokenized(value) {
  const clean = value.replace(/!important/gi, "").trim();
  if (hasRawLength(clean) || /%/.test(clean)) return false;
  return clean.split(/\s+/).every((part) => /^(0|inherit|initial|unset|var\(--|calc\(var\(--)/i.test(part));
}

const spacingProps = /^(margin|padding|gap|row-gap|column-gap|grid-gap|grid-row-gap|grid-column-gap)(-(top|right|bottom|left))?$/i;
const radiusProps = /^(-webkit-|-moz-|-o-)?border(-(top-left|top-right|bottom-left|bottom-right))?-radius$/i;
const declarationPattern = /([_a-zA-Z-][_a-zA-Z0-9-]*)\s*:\s*([^;{}]+)(?:;|(?=\}))/g;

const issues = {
  rawColors: [],
  fontFamilies: [],
  fontSizes: [],
  fontWeights: [],
  letterSpacings: [],
  lineHeights: [],
  spacingLengths: [],
  radii: []
};

const files = (await Promise.all(cssRoots.map(listCssFiles))).flat();
for (const file of files) {
  const css = stripFontFace(stripComments(await readFile(path.join(root, file), "utf8")));
  let match;
  while ((match = declarationPattern.exec(css))) {
    const prop = match[1].trim();
    const lowerProp = prop.toLowerCase();
    const value = match[2].trim();
    const location = `${file}:${lineAt(css, match.index)}: ${prop}: ${value}`;

    if (hasRawColor(value)) issues.rawColors.push(location);
    if (lowerProp === "font-family" && !isFontFamilyTokenized(value)) issues.fontFamilies.push(location);
    if (lowerProp === "font-size" && !isFontSizeTokenized(value)) issues.fontSizes.push(location);
    if (lowerProp === "font-weight" && !isFontWeightTokenized(value)) issues.fontWeights.push(location);
    if (lowerProp === "letter-spacing" && !isLetterSpacingTokenized(value)) issues.letterSpacings.push(location);
    if (lowerProp === "line-height" && !isLineHeightTokenized(value)) issues.lineHeights.push(location);
    if (spacingProps.test(lowerProp) && hasRawLength(value)) issues.spacingLengths.push(location);
    if (radiusProps.test(lowerProp) && !isRadiusTokenized(value)) issues.radii.push(location);
  }
}

let total = 0;
for (const [name, found] of Object.entries(issues)) {
  total += found.length;
  console.log(`${name}: ${found.length}`);
  if (found.length) console.log(found.slice(0, 40).join("\n"));
}

if (total) {
  console.error(`CSS token audit failed with ${total} issue(s).`);
  process.exit(1);
}

console.log(`CSS token audit passed for ${files.length} CSS file(s).`);
