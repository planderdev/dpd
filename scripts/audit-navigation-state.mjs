import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const htmlRoots = ["index.html", "kr", "en"];

function isEnglish(rel) {
  return rel === "en/index.html" || rel.startsWith("en/");
}

function navItems(rel) {
  if (isEnglish(rel)) {
    return [
      ["Company", ["CEO Message", "Overview", "Management Philosophy", "History", "Certificates & IP", "Location"]],
      ["Development Items", []],
      ["Handled Items", []],
      ["Resources", ["Drawings", "Catalogs & Technical Resources"]],
      ["Notice", []],
    ];
  }
  return [
    ["회사소개", ["인사말", "회사개요", "경영이념", "회사연혁", "인증 및 지적재산권", "오시는길"]],
    ["개발품목", []],
    ["취급품목", []],
    ["자료실", ["도면자료", "카탈로그 & 기술자료"]],
    ["공지사항", []],
  ];
}

function stateFor(rel) {
  if (rel === "index.html" || rel === "en/index.html") return null;
  if (!/^(kr|en)\//.test(rel)) return null;
  const page = rel.replace(/^(kr|en)\//, "");
  const direct = [
    [/^company\/greeting\.html$/, 0, 0],
    [/^company\/outline\.html$/, 0, 1],
    [/^company\/vision\.html$/, 0, 2],
    [/^company\/history\.html$/, 0, 3],
    [/^company\/certificate\.html$/, 0, 4],
    [/^company\/location\.html$/, 0, 5],
    [/^business\/intro\.html$/, 2, 0],
    [/^business\/uav\.html$/, 2, 1],
    [/^business\/uam\.html$/, 2, 2],
    [/^business\/lsa\.html$/, 2, 3],
    [/^business\/si\.html$/, 2, 4],
    [/^business\/robot\.html$/, 2, 5],
  ];
  const found = direct.find(([pattern]) => pattern.test(page));
  if (found) return { sectionIndex: found[1], subIndex: found[2] };
  if (/^company\//.test(page)) return { sectionIndex: 0, subIndex: 0 };
  if (/^product\/nv_/.test(page)) return { sectionIndex: 1, subIndex: 0 };
  if (/^product\/nl_/.test(page)) return { sectionIndex: 1, subIndex: 1 };
  if (/^product\/nm_/.test(page)) return { sectionIndex: 1, subIndex: 2 };
  if (/^product\/kla_/.test(page)) return { sectionIndex: 1, subIndex: 3 };
  if (/^business\//.test(page)) return { sectionIndex: 2, subIndex: 0 };
  if (/^ir\//.test(page)) return { sectionIndex: 3, subIndex: 0 };
  if (/^pr\/library/.test(page)) return { sectionIndex: 3, subIndex: 1 };
  if (/^pr\//.test(page)) return { sectionIndex: 4, subIndex: 0 };
  return null;
}

function cleanRel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

async function collectHtml(entry) {
  const abs = path.join(root, entry);
  const info = await stat(abs);
  if (info.isFile()) return [abs];
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

function dep(html, name) {
  const match = html.match(new RegExp(`^\\s*${name}\\s*=\\s*([^,;\\r\\n]+)`, "m"));
  if (!match) return null;
  const value = match[1].replace(/["']/g, "").trim();
  if (value === "") return 0;
  return Number(value);
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

function subMenuState(html) {
  const pc = html.match(/<aside id="topMenu03"[\s\S]*?<\/aside>/)?.[0] ?? "";
  const pcList = pc.match(/<ul class="snb[^"]*">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  const mobile = html.match(/<aside id="topMenuM"[\s\S]*?<\/aside>/)?.[0] ?? "";
  const mobileList = mobile.match(/<ul class="location-menu-con[^"]*">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  return {
    hasPc: Boolean(pc),
    hasMobile: Boolean(mobile),
    pcLabels: [...pcList.matchAll(/<span>([\s\S]*?)<\/span>/g)].map((m) => strip(m[1])),
    mobileCurrent: strip(mobile.match(/<button class="cur-location[\s\S]*?<span>([\s\S]*?)<\/span>/)?.[1] ?? ""),
    mobileLabels: [...mobileList.matchAll(/<span>([\s\S]*?)<\/span>/g)].map((m) => strip(m[1])),
  };
}

const files = (await Promise.all(htmlRoots.map(collectHtml))).flat();
const issues = [];
const sectionsWithoutLocalSubMenu = new Set([0, 1, 2, 3, 4]);

for (const file of files) {
  const rel = cleanRel(file);
  const html = await readFile(file, "utf8");
  const expectedNav = navItems(rel);
  const gnb = gnbState(html);
  const state = stateFor(rel);

  if (!gnb) continue;

  if (gnb) {
    const topLabels = gnb.map((item) => item.label);
    if (!sameList(topLabels, expectedNav.map((item) => item[0]))) {
      issues.push(`${rel}: header top labels mismatch: ${topLabels.join(" | ")}`);
    }
    gnb.forEach((item, index) => {
      const expected = expectedNav[index]?.[1] ?? [];
      if (!sameList(item.subLabels, expected)) {
        issues.push(`${rel}: header submenu ${index + 1} mismatch: ${item.subLabels.join(" | ")}`);
      }
    });
  }

  const actualDep1 = dep(html, "dep1");
  const actualDep2 = dep(html, "dep2");
  const expectedDep1 = state ? state.sectionIndex + 1 : 0;
  const expectedDep2 = state ? state.subIndex + 1 : 0;
  if (actualDep1 !== null && actualDep1 !== expectedDep1) {
    issues.push(`${rel}: dep1 ${actualDep1} != ${expectedDep1}`);
  }
  if (actualDep2 !== null && actualDep2 !== expectedDep2) {
    issues.push(`${rel}: dep2 ${actualDep2} != ${expectedDep2}`);
  }

  const sub = subMenuState(html);
  if (state) {
    if (sectionsWithoutLocalSubMenu.has(state.sectionIndex)) {
      if (sub.hasPc || sub.hasMobile) {
        issues.push(`${rel}: unexpected local sub navigation`);
      }
      continue;
    }

    const expectedSubs = expectedNav[state.sectionIndex][1];
    const expectedCurrent = expectedSubs[state.subIndex];
    if (!sub.hasPc || !sub.hasMobile) {
      issues.push(`${rel}: missing local sub navigation`);
    } else {
      if (!sameList(sub.pcLabels, expectedSubs)) {
        issues.push(`${rel}: PC submenu mismatch: ${sub.pcLabels.join(" | ")}`);
      }
      if (sub.mobileCurrent !== expectedCurrent) {
        issues.push(`${rel}: mobile current "${sub.mobileCurrent}" != "${expectedCurrent}"`);
      }
      if (!sameList(sub.mobileLabels, expectedSubs)) {
        issues.push(`${rel}: mobile submenu mismatch: ${sub.mobileLabels.join(" | ")}`);
      }
    }
  } else if (rel.endsWith(".html") && !rel.includes("/etc/") && !/^(?:kr|en)\/(?:careers|contact)\//.test(rel) && rel !== "index.html" && rel !== "en/index.html") {
    issues.push(`${rel}: no expected navigation state`);
  }
}

if (issues.length) {
  console.error(`Navigation audit failed: ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Navigation audit passed for ${files.length} HTML file(s).`);
