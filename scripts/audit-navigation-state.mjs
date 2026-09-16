import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
// en/ 하위는 i18n.js 가 kr/<경로>?lang=en 으로 리다이렉트시키는 구버전 잔재라
// 헤더 마크업을 유지하지 않는다. 감사 대상은 실제로 서비스되는 국문 화면이다.
const htmlRoots = ["index.html", "kr"];

// 헤더 GNB 기준값. gnb1~gnb7 순서와 2차 메뉴까지 1:1로 맞춘다.
const NAV = [
  ["회사소개", ["인사말", "회사개요", "경영이념", "회사연혁", "인증 및 지적재산권", "오시는길"]],
  ["개발품목", []],
  ["공급품목", []],
  ["기술지원", ["솔루션", "해외 네트워크"]],
  ["고객사", []],
  ["자료실", ["도면자료", "카탈로그 & 기술자료"]],
  ["공지사항", []]
];

// 페이지 경로 -> [dep1, dep2]. dep1 은 대메뉴 순번(1부터), dep2 는 2차 메뉴 순번.
// 대메뉴에 2차 메뉴가 없으면 dep2 는 1을 쓴다. 헤더 하이라이트가 없는 화면은 0,0.
const PAGE_STATE = [
  [/^kr\/company\/greeting\.html$/, 1, 1],
  [/^kr\/company\/outline\.html$/, 1, 2],
  [/^kr\/company\/vision\.html$/, 1, 3],
  [/^kr\/company\/history\.html$/, 1, 4],
  [/^kr\/company\/certificate\.html$/, 1, 5],
  [/^kr\/company\/location\.html$/, 1, 6],
  [/^kr\/company\//, 1, 1],
  [/^kr\/product\//, 2, 1],
  [/^kr\/business\//, 3, 1],
  [/^kr\/support\/solution\.html$/, 4, 1],
  [/^kr\/support\/network\.html$/, 4, 2],
  [/^kr\/customer\//, 5, 1],
  [/^kr\/ir\//, 6, 1],
  [/^kr\/pr\/library/, 6, 2],
  [/^kr\/pr\//, 7, 1],
  // 견적문의, 채용, 약관/개인정보는 대메뉴에 대응하는 항목이 없다.
  [/^kr\/(?:contact|careers|etc)\//, 0, 0],
  [/^index\.html$/, 0, 0]
];

function expectedState(rel) {
  const found = PAGE_STATE.find(([pattern]) => pattern.test(rel));
  return found ? { dep1: found[1], dep2: found[2] } : null;
}

function cleanRel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

async function collectHtml(entry) {
  const abs = path.join(root, entry);
  if ((await stat(abs)).isFile()) return [abs];
  const files = [];
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const child = path.join(dir, item.name);
      if (item.isDirectory()) await walk(child);
      else if (item.isFile() && item.name.endsWith(".html")) files.push(child);
    }
  }
  await walk(abs);
  return files;
}

function strip(html) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function sameList(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

// 주석 처리된 선언(// dep1 = 06)을 집지 않도록 줄 시작에서만 찾는다.
function dep(html, name) {
  const match = html.match(new RegExp(`^\\s*${name}\\s*=\\s*([^,;\\r\\n]+)`, "m"));
  if (!match) return null;
  const value = match[1].replace(/["']/g, "").trim();
  return value === "" ? 0 : Number(value);
}

function gnbState(html) {
  const nav = html.match(/<nav id="gnb" class="each-menu">([\s\S]*?)<\/nav>/)?.[1];
  if (!nav) return null;
  const starts = [...nav.matchAll(/<li class="gnb(\d)[^"]*">/g)];
  return starts.map((match, index) => {
    const block = nav.slice(match.index, starts[index + 1]?.index ?? nav.length);
    const label = strip(block.match(/<li class="gnb\d[^"]*">\s*<a[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "");
    const sub = block.match(/<div class="gnb-2dep">([\s\S]*?)<\/div>/)?.[1] ?? "";
    const subLabels = [...sub.matchAll(/<span>([\s\S]*?)<\/span>/g)].map((m) => strip(m[1]));
    return { label, subLabels };
  });
}

const files = (await Promise.all(htmlRoots.map(collectHtml))).flat();
const issues = [];
let checked = 0;

for (const file of files) {
  const rel = cleanRel(file);
  const html = await readFile(file, "utf8");
  const gnb = gnbState(html);
  if (!gnb) continue;
  checked++;

  const topLabels = gnb.map((item) => item.label);
  if (!sameList(topLabels, NAV.map((item) => item[0]))) {
    issues.push(`${rel}: header top labels mismatch: ${topLabels.join(" | ")}`);
  }
  gnb.forEach((item, index) => {
    const expected = NAV[index]?.[1] ?? [];
    if (!sameList(item.subLabels, expected)) {
      issues.push(`${rel}: header submenu ${index + 1} mismatch: ${item.subLabels.join(" | ")}`);
    }
  });

  const state = expectedState(rel);
  if (!state) {
    issues.push(`${rel}: no expected navigation state`);
  } else {
    const actual1 = dep(html, "dep1");
    const actual2 = dep(html, "dep2");
    if (actual1 !== null && actual1 !== state.dep1) issues.push(`${rel}: dep1 ${actual1} != ${state.dep1}`);
    if (actual2 !== null && actual2 !== state.dep2) issues.push(`${rel}: dep2 ${actual2} != ${state.dep2}`);
  }

  // 현재 디자인에는 페이지 내 서브 네비게이션이 없다. 되살아나면 기준값을 함께 갱신해야 한다.
  if (/<aside id="topMenu03"|<aside id="topMenuM"/.test(html)) {
    issues.push(`${rel}: unexpected local sub navigation`);
  }
}

if (issues.length) {
  console.error(`Navigation audit failed: ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Navigation audit passed for ${checked} HTML file(s) with a header.`);
