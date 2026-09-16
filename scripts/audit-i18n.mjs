import { access, readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const dataFile = "assets/js/content-data.js";
const hangul = /[가-힣]/;

async function exists(rel) {
  try {
    await access(path.join(root, rel));
    return true;
  } catch {
    return false;
  }
}

function clean(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

// content-data.js 는 window 에 객체 하나를 붙이는 평문 스크립트다.
const context = { window: {} };
vm.createContext(context);
vm.runInContext(await readFile(path.join(root, dataFile), "utf8"), context);
const data = context.window.DPD_CONTENT_DATA;
if (!data) {
  console.error(`${dataFile}: window.DPD_CONTENT_DATA is not defined.`);
  process.exit(1);
}

const dictionary = { ...(data.manual?.text || {}), ...(data.manual?.attrs || {}) };
const issues = {
  // 영문 화면에 한국어가 그대로 노출되는 항목. 구버전 값이 남아 있을 때 생긴다.
  koreanInEnglish: [],
  // 원문과 번역이 같아 아무 일도 하지 않는 항목.
  noOpEntry: [],
  // pages 키에 해당하는 파일이 없는 항목.
  missingPage: [],
  // ko 나 selector 가 비어 있어 대조가 불가능한 항목.
  malformedEntry: []
};
// 실패로 취급하지 않고 보고만 하는 항목.
const warnings = {
  // 페이지 번역이 공용 사전과 다른 경우. 페이지별로 문구를 다듬은 것일 수 있다.
  dictionaryOverride: [],
  // 한 페이지 안에서 서로 다른 원문이 같은 번역을 쓰는 경우. 셀렉터가 밀렸을 때의 신호다.
  duplicateTranslation: []
};

let entryCount = 0;
for (const [page, value] of Object.entries(data.pages || {})) {
  if (!(await exists(page))) issues.missingPage.push(page);

  const byEnglish = new Map();
  for (const kind of ["text", "attrs"]) {
    for (const entry of value[kind] || []) {
      entryCount++;
      const ko = clean(entry.ko);
      const en = clean(entry.en);
      const where = `${page} | ${kind} | ${ko.slice(0, 40)}`;

      if (!ko || !entry.selector) {
        issues.malformedEntry.push(where);
        continue;
      }
      if (hangul.test(en)) issues.koreanInEnglish.push(`${where} -> ${en.slice(0, 40)}`);
      if (ko === en) issues.noOpEntry.push(where);

      const fromDictionary = dictionary[ko];
      if (fromDictionary !== undefined && fromDictionary !== en) {
        warnings.dictionaryOverride.push(`${where} | page: ${en.slice(0, 40)} | dictionary: ${fromDictionary.slice(0, 40)}`);
      }

      if (en && en !== ".") {
        if (!byEnglish.has(en)) byEnglish.set(en, new Set());
        byEnglish.get(en).add(ko);
      }
    }
  }

  for (const [en, koreans] of byEnglish) {
    if (koreans.size > 1) {
      warnings.duplicateTranslation.push(`${page} | ${en.slice(0, 40)} <- ${[...koreans].map((k) => k.slice(0, 25)).join(" , ")}`);
    }
  }
}

for (const [ko, en] of Object.entries(dictionary)) {
  if (hangul.test(en)) issues.koreanInEnglish.push(`${dataFile} | manual | ${ko.slice(0, 40)} -> ${en.slice(0, 40)}`);
  if (clean(ko) === clean(en)) issues.noOpEntry.push(`${dataFile} | manual | ${ko.slice(0, 40)}`);
}

for (const [koTitle, enTitle] of Object.entries(data.manual?.titles || {})) {
  if (hangul.test(enTitle)) issues.koreanInEnglish.push(`${dataFile} | title | ${koTitle.slice(0, 40)} -> ${enTitle.slice(0, 40)}`);
}

let total = 0;
for (const [name, found] of Object.entries(issues)) {
  total += found.length;
  console.log(`${name}: ${found.length}`);
  if (found.length) console.log(found.slice(0, 40).join("\n"));
}
for (const [name, found] of Object.entries(warnings)) {
  console.log(`${name}: ${found.length} (warning)`);
}

if (total) {
  console.error(`i18n audit failed with ${total} issue(s).`);
  process.exit(1);
}

console.log(`i18n audit passed for ${Object.keys(data.pages || {}).length} page(s), ${entryCount} page entry(ies) and ${Object.keys(dictionary).length} dictionary entry(ies).`);
console.log("셀렉터가 실제 DOM과 맞는지는 브라우저에서 확인해야 한다. i18n.js 가 저장된 한국어 원문과 다른 노드는 건드리지 않으므로, 어긋난 항목은 번역이 적용되지 않는 형태로 드러난다.");
