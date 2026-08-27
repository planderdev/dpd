(() => {
  "use strict";

  const doc = document;
  const data = window.DPD_CONTENT_DATA || {};
  const supported = new Set(data.languages || ["ko", "en"]);
  const normalizePath = (value) => (value || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const params = new URLSearchParams(window.location.search);

  const withLangParam = (url, lang) => {
    const next = new URL(url, window.location.href);
    if (lang === "en") next.searchParams.set("lang", "en");
    else next.searchParams.delete("lang");
    return `${next.pathname}${next.search}${next.hash}`;
  };

  const legacyEnglishTarget = () => {
    const path = normalizePath(window.location.pathname);
    if (!path.startsWith("en/") && !path.includes("/en/")) return "";
    const enIndex = path.indexOf("en/");
    const prefix = enIndex > 0 ? `/${path.slice(0, enIndex)}` : "/";
    const rel = path.slice(enIndex + 3);
    const targetPath = rel === "index.html" || rel === "" ? `${prefix}index.html` : `${prefix}kr/${rel}`;
    return withLangParam(targetPath, "en");
  };

  const redirectTarget = legacyEnglishTarget();
  if (redirectTarget && redirectTarget !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.location.replace(redirectTarget);
    return;
  }

  const queryLang = params.get("lang");
  const currentLang = supported.has(queryLang) ? queryLang : "ko";
  const isEnglish = currentLang === "en";

  const pageKey = () => {
    const path = normalizePath(window.location.pathname);
    if (!path || path === "index.html" || (path.endsWith("/index.html") && !path.includes("/kr/"))) return "index.html";
    const krIndex = path.indexOf("kr/");
    if (krIndex >= 0) return path.slice(krIndex);
    const enIndex = path.indexOf("en/");
    if (enIndex >= 0) return data.pathMap?.[path.slice(enIndex)] || "";
    return path;
  };

  const clean = (value) => (value || "").replace(/\s+/g, " ").trim();
  const nonEmptyTextNodes = (element) => Array.from(element?.childNodes || []).filter((node) => node.nodeType === Node.TEXT_NODE && clean(node.nodeValue));
  const setTrimmedNodeValue = (node, value) => {
    if (!node) return;
    const source = node.nodeValue || "";
    const leading = source.match(/^\s*/)?.[0] || "";
    const trailing = source.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${value}${trailing}`;
  };
  const skipElement = (node) => {
    const tag = node.parentElement?.tagName;
    return !tag || ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG", "PATH", "VIDEO", "SOURCE"].includes(tag);
  };

  const applyPageData = () => {
    const page = data.pages?.[pageKey()];
    const manualTitle = data.manual?.titles?.[doc.title];
    if (manualTitle) doc.title = manualTitle;
    if (page?.meta?.title) doc.title = page.meta.title;
    Object.entries(page?.meta || {}).forEach(([selector, content]) => {
      if (selector === "title") return;
      const node = doc.querySelector(selector);
      if (node) node.setAttribute("content", content);
    });
    (page?.text || []).forEach((entry) => {
      const parent = doc.querySelector(entry.selector);
      const node = nonEmptyTextNodes(parent)[entry.index];
      setTrimmedNodeValue(node, entry.en);
    });
    (page?.attrs || []).forEach((entry) => {
      const node = doc.querySelector(entry.selector);
      if (node) node.setAttribute(entry.attr, entry.en);
    });
  };

  const applyManualDictionary = () => {
    const textMap = data.manual?.text || {};
    const attrMap = { ...textMap, ...(data.manual?.attrs || {}) };
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (skipElement(node)) return NodeFilter.FILTER_REJECT;
        return textMap[clean(node.nodeValue)] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => setTrimmedNodeValue(node, textMap[clean(node.nodeValue)]));

    doc.querySelectorAll("[title], [aria-label], [alt], [placeholder], [value]").forEach((node) => {
      ["title", "aria-label", "alt", "placeholder", "value"].forEach((attr) => {
        const value = clean(node.getAttribute(attr));
        if (attrMap[value]) node.setAttribute(attr, attrMap[value]);
      });
    });
  };

  const updateLanguageSwitch = () => {
    const current = new URL(window.location.href);
    doc.querySelectorAll(".header-lang-list a, .lang-select a").forEach((link) => {
      const label = clean(link.textContent).toUpperCase();
      if (label === "EN") link.setAttribute("href", withLangParam(current.href, "en"));
      if (label === "KR" || label === "KO") link.setAttribute("href", withLangParam(current.href, "ko"));
      link.parentElement?.classList.toggle("cur", label === (isEnglish ? "EN" : "KR"));
    });
  };

  const convertLegacyEnglishHref = (url) => {
    const path = normalizePath(url.pathname);
    const enIndex = path.indexOf("en/");
    if (enIndex < 0) return url;
    const prefix = enIndex > 0 ? `/${path.slice(0, enIndex)}` : "/";
    const rel = path.slice(enIndex + 3);
    url.pathname = rel === "index.html" || rel === "" ? `${prefix}index.html` : `${prefix}kr/${rel}`;
    return url;
  };

  const updateInternalLinks = () => {
    doc.querySelectorAll("a[href]").forEach((link) => {
      if (link.closest(".header-lang-list, .lang-select")) return;
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(raw)) return;
      const url = convertLegacyEnglishHref(new URL(raw, window.location.href));
      if (url.origin !== window.location.origin) return;
      if (!/\.html$|\/$/.test(url.pathname)) return;
      if (isEnglish) url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");
      link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    });
  };

  const apply = () => {
    doc.documentElement.lang = isEnglish ? "en" : "ko";
    doc.documentElement.classList.toggle("is-lang-en", isEnglish);
    doc.documentElement.classList.toggle("is-lang-ko", !isEnglish);
    if (isEnglish) {
      applyPageData();
      applyManualDictionary();
    }
    updateLanguageSwitch();
    updateInternalLinks();
  };

  const refreshDynamicContent = () => {
    if (isEnglish) applyManualDictionary();
    updateLanguageSwitch();
    updateInternalLinks();
  };

  let applied = false;
  const applyOnce = () => {
    if (applied) return;
    applied = true;
    apply();
  };

  if (doc.body) applyOnce();
  else doc.addEventListener("DOMContentLoaded", applyOnce, { once: true });

  doc.addEventListener("DOMContentLoaded", refreshDynamicContent, { once: true });
  window.addEventListener("load", () => {
    refreshDynamicContent();
    window.setTimeout(refreshDynamicContent, 200);
  }, { once: true });

  window.DPD_I18N = {
    lang: currentLang,
    isEnglish,
    refresh: refreshDynamicContent
  };

  if (isEnglish && doc.body && "MutationObserver" in window) {
    let refreshTimer = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(refreshDynamicContent, 50);
    });
    observer.observe(doc.body, { childList: true, subtree: true });
  }
})();
