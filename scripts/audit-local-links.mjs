import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteEntries = ["index.html", "kr", "en", "admin"];
const cssEntries = ["assets/css"];
const referenceHosts = new Set([
  "nextaerospace.co.kr",
  "www.nextaerospace.co.kr",
  "keoc.kr",
  "www.keoc.kr",
  "hd-marinesolution.com",
  "www.hd-marinesolution.com",
  "hnjcorp.co.kr",
  "www.hnjcorp.co.kr"
]);
const ignoredSchemes = /^(?:#|mailto:|tel:|javascript:|data:|blob:|sms:)/i;
// archive/ 는 리팩터링 전 원본 CSS 보관용이라 배포 대상이 아니다.
const skippedDirs = new Set([".git", "node_modules", "archive"]);
// 언어 전환 링크는 현재 경로에 ?lang= 만 붙이므로 파일이 따로 없다.
const languageQuery = /^\?lang=[a-z-]+$/i;
// DPD 이전 템플릿과 외부 플러그인에서 넘어온 이미지 경로.
// images/content, images/board : 이관하지 않은 템플릿 이미지 트리
// images/icon/spotlight : Spotlight 라이트박스용 아이콘 (현재 라이트박스는 자체 구현)
// mCSB_buttons.png : mCustomScrollbar 스크롤 버튼 스프라이트 (버튼 미사용)
// 살아있는 화면에서 쓰지 않으므로 실패가 아니라 정리 대상으로만 보고한다.
const legacyTemplateAsset = /(?:^|\/)(?:images\/(?:content|board)\/|images\/icon\/spotlight\/)|^mCSB_buttons\.png$/;
const htmlFiles = [];
const cssFiles = [];

async function exists(absPath) {
  try {
    await access(absPath);
    return true;
  } catch {
    return false;
  }
}

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skippedDirs.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectHtmlFiles(abs);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(abs);
    }
  }
}

async function collectCssFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skippedDirs.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectCssFiles(abs);
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      cssFiles.push(abs);
    }
  }
}

function displayPath(absPath) {
  return path.relative(root, absPath).split(path.sep).join("/");
}

function normalizeAttrValue(value) {
  return value
    .trim()
    .replace(/&amp;/gi, "&")
    .replace(/&#0*38;/gi, "&")
    .replace(/&#x0*26;/gi, "&");
}

function stripHashAndSearch(value) {
  return value.split("#")[0].split("?")[0];
}

function isExternalAllowed(url) {
  return url.protocol === "http:" || url.protocol === "https:";
}

async function resolveLocalRef(rawValue, fileAbsPath) {
  const value = normalizeAttrValue(rawValue);
  if (!value || ignoredSchemes.test(value)) return null;
  if (/^(?:\/\/|https?:\/\/)/i.test(value)) {
    const url = new URL(value, "https://placeholder.local");
    if (referenceHosts.has(url.hostname)) {
      return { type: "internalAbsolute", target: value };
    }
    return isExternalAllowed(url) ? null : { type: "unsupported", target: value };
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
  if (languageQuery.test(value)) return null;
  if (value.startsWith("?")) return { type: "queryOnly", target: value };

  const localTarget = stripHashAndSearch(value);
  if (!localTarget) return null;
  if (/\.php(?:$|[?#])/i.test(value)) return { type: "phpRef", target: value };

  const baseDir = path.dirname(fileAbsPath);
  const absTarget = path.resolve(value.startsWith("/") ? root : baseDir, value.startsWith("/") ? value.slice(1) : localTarget);
  if (await exists(absTarget)) return null;
  if (await exists(path.join(absTarget, "index.html"))) return null;
  if (legacyTemplateAsset.test(localTarget)) return { type: "legacyTemplate", target: value };
  return { type: "missing", target: value, resolved: absTarget };
}

for (const entry of siteEntries) {
  const abs = path.join(root, entry);
  if (entry.endsWith(".html")) {
    htmlFiles.push(abs);
  } else {
    await collectHtmlFiles(abs);
  }
}

for (const entry of cssEntries) {
  const abs = path.join(root, entry);
  await collectCssFiles(abs);
}

const issues = {
  internalAbsolute: [],
  phpRef: [],
  queryOnly: [],
  missing: [],
  unsupported: [],
  textInternalOrigins: [],
  legacyTemplate: []
};
// 실패로 취급하지 않고 보고만 하는 항목.
const warningTypes = new Set(["legacyTemplate"]);

const attrPattern = /\b(?:href|src|poster|action|formaction|data-src|data-url|data-pc-img|data-m-img|data-bg|data-image|data-gallery|data-cursor-src|data-video)=["']([^"']*)["']/gi;
const srcsetPattern = /\bsrcset=["']([^"']*)["']/gi;
const cssUrlPattern = /url\((["']?)(.*?)\1\)/gi;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const rel = displayPath(file);
  if (/https?:\/\/(?:www\.)?(?:nextaerospace\.co\.kr|keoc\.kr|hd-marinesolution\.com|hnjcorp\.co\.kr)/i.test(html)) {
    issues.textInternalOrigins.push(rel);
  }

  let match;
  while ((match = attrPattern.exec(html))) {
    for (const value of match[1].split("|")) {
      const issue = await resolveLocalRef(value, file);
      if (issue) issues[issue.type].push(`${rel}: ${issue.target}`);
    }
  }

  while ((match = srcsetPattern.exec(html))) {
    for (const part of match[1].split(",")) {
      const candidate = part.trim().split(/\s+/)[0];
      const issue = await resolveLocalRef(candidate, file);
      if (issue) issues[issue.type].push(`${rel}: ${issue.target}`);
    }
  }
}

for (const file of cssFiles) {
  const css = await readFile(file, "utf8");
  const rel = displayPath(file);
  let match;
  while ((match = cssUrlPattern.exec(css))) {
    const issue = await resolveLocalRef(match[2], file);
    if (issue) issues[issue.type].push(`${rel}: ${issue.target}`);
  }
}

let total = 0;
for (const [name, found] of Object.entries(issues)) {
  if (!warningTypes.has(name)) total += found.length;
  console.log(`${name}: ${found.length}${warningTypes.has(name) ? " (warning)" : ""}`);
  if (found.length && !warningTypes.has(name)) console.log(found.slice(0, 40).join("\n"));
}

if (total) {
  console.error(`Local link audit failed with ${total} issue(s).`);
  process.exit(1);
}

console.log(`Local link audit passed for ${htmlFiles.length} HTML file(s) and ${cssFiles.length} CSS file(s).`);
