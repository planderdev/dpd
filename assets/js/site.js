(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const focusableSelector = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "iframe"
  ].join(",");

  const q = (selector, base = doc) => base?.querySelector(selector) || null;
  const qa = (selector, base = doc) => Array.from(base?.querySelectorAll(selector) || []);
  const onReady = (callback) => {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  };
  const isElement = (value) => value && value.nodeType === Node.ELEMENT_NODE;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const parseToken = (token, fallback) => {
    const value = getComputedStyle(root).getPropertyValue(token).trim();
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const getLangLabels = () => {
    // 영문 화면도 /kr/ 경로를 그대로 쓰므로 경로만으로는 판별할 수 없다.
    // i18n.js 가 알려주는 값을 우선 쓰고, 없으면 html lang 으로 판단한다.
    const isKo = window.DPD_I18N ? !window.DPD_I18N.isEnglish : !root.lang?.toLowerCase().startsWith("en");
    return {
      close: isKo ? "닫기" : "Close",
      previous: isKo ? "이전" : "Previous",
      next: isKo ? "다음" : "Next",
      play: isKo ? "재생" : "Play",
      pause: isKo ? "일시정지" : "Pause",
      viewImage: isKo ? "이미지 보기" : "View image",
      gallery: isKo ? "공급품목 이미지 갤러리" : "Supply item image gallery",
      mainItems: isKo ? "주요 품목" : "Main items",
      relatedImage: isKo ? "관련 이미지" : "related image",
      fileType: isKo ? "{type} 파일" : "{type} file"
    };
  };

  let dpdLenis = null;
  let lockedScrollY = 0;

  const lockScroll = (lock) => {
    if (!body) return;

    if (lock) {
      lockedScrollY = window.scrollY;
      dpdLenis?.stop?.();
      root.classList.add("is-scroll-locked");
      body.style.position = "fixed";
      body.style.top = `-${lockedScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      return;
    }

    root.classList.remove("is-scroll-locked");
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    if (dpdLenis) {
      dpdLenis.start?.();
      dpdLenis.scrollTo(lockedScrollY, { immediate: true });
      return;
    }
    window.scrollTo(0, lockedScrollY);
  };

  const scrollToPosition = (top = 0, speed = 500) => {
    const nextTop = Number.isFinite(Number(top)) ? Number(top) : 0;
    if (dpdLenis && !prefersReducedMotion.matches && speed !== 0) {
      dpdLenis.scrollTo(nextTop, {
        duration: clamp(speed / 1000, 0.24, 1.4)
      });
      return;
    }

    window.scrollTo({
      top: nextTop,
      behavior: prefersReducedMotion.matches || speed === 0 ? "auto" : "smooth"
    });
  };

  window.getWindowWidth = () => window.innerWidth || root.clientWidth;
  window.getWindowHeight = () => window.innerHeight || root.clientHeight;
  window.getScrollTop = () => window.scrollY || root.scrollTop || body?.scrollTop || 0;
  window.isMobile = () => window.matchMedia("(max-width: 800px)").matches;
  window.moveScrollTop = scrollToPosition;
  window.addClassName = (target, className) => target?.classList?.add(className);
  window.removeClassName = (target, className) => target?.classList?.remove(className);
  window.htmlScrollControl = lockScroll;
  window.detectOS = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/android/.test(ua)) return "android";
    if (/mac/.test(ua)) return "mac";
    if (/win/.test(ua)) return "window";
    return "other";
  };
  window.detectBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("edg")) return "edge";
    if (ua.includes("chrome")) return "chrome";
    if (ua.includes("safari")) return "safari";
    if (ua.includes("firefox")) return "firefox";
    return "other";
  };
  window.toFit = (selector, ratio = 1) => {
    qa(selector).forEach((item) => {
      const parent = item.parentElement;
      if (!parent) return;
      const parentRatio = parent.offsetWidth / Math.max(parent.offsetHeight, 1);
      item.classList.toggle("to-fit-width", parentRatio > ratio);
      item.classList.toggle("to-fit-height", parentRatio <= ratio);
    });
  };
  window.checkFixedHeight = (selector) => {
    qa(selector).forEach((container) => {
      const height = Math.max(...qa(".fixed-height", container).map((item) => item.offsetHeight), 0);
      if (!height) return;
      qa(".fixed-height", container).forEach((item) => {
        item.style.height = `${height}px`;
      });
    });
  };
  window.rollingActive = (selector) => {
    qa(`${selector} li:first-child`).forEach((item) => item.classList.add("active"));
  };
  window.res = window.res || (() => {
    const select = q("select[name='email3']");
    const input = q("input[name='email2']");
    if (!select || !input) return;
    const value = select.value;
    input.value = value;
    input.readOnly = value !== "";
    if (value === "") input.focus();
  });

  if (window.jQuery?.fn && !window.jQuery.fn.fakeselect) {
    window.jQuery.fn.fakeselect = function fakeSelectFallback() {
      return this;
    };
  }

  const initLenis = () => {
    if (!window.Lenis || prefersReducedMotion.matches || dpdLenis) return;

    dpdLenis = new window.Lenis({
      duration: 1.12,
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1
    });

    window.dpdLenis = dpdLenis;
    window.lenis = dpdLenis;
    root.classList.add("is-lenis-ready");

    if (window.ScrollTrigger) {
      dpdLenis.on("scroll", () => window.ScrollTrigger.update());
    }

    if (window.gsap?.ticker) {
      window.gsap.ticker.add((time) => dpdLenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        dpdLenis.raf(time);
        window.requestAnimationFrame(raf);
      };
      window.requestAnimationFrame(raf);
    }

    window.addEventListener("resize", () => dpdLenis?.resize?.(), { passive: true });
  };

  const initReadyState = () => {
    root.classList.add("dpd-site-ready");
    if (q(".dpd-product-detail-tabbar")) q("#wrap")?.classList.add("dpd-product-detail-wrap");
    if (!location.hash) q("#wrap")?.classList.add("is-active");
  };

  const initDeviceClasses = () => {
    const sync = () => {
      root.classList.toggle("is-mobile", window.isMobile());
      root.classList.toggle("is-pc", !window.isMobile());
      root.classList.add(`${window.detectOS()}-os`, `${window.detectBrowser()}-browser`);
    };
    sync();
    window.addEventListener("resize", sync, { passive: true });
  };

  const initTextReveal = () => {
    qa(".cm-word-split-JS").forEach((item) => item.classList.add("is-split-ready"));
  };

  const initScrollReveal = () => {
    const targets = qa("[data-scroll], .animated");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("animated"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08
    });

    targets.forEach((target) => observer.observe(target));
  };

  const initHeader = () => {
    const header = q("#header");
    const gnb = q("#gnb");
    const wrap = q("#wrap");
    const logo = q(".logo img", header);
    const initialLogo = logo?.getAttribute("src") || "";
    const colorLogo = initialLogo.replace("logo-w.svg", "logo-p.svg");
    const lightLogo = initialLogo.replace("logo-p.svg", "logo-w.svg");
    const isMain = wrap?.classList.contains("main-wrap");

    const closeDepth = () => {
      qa("#gnb > ul > li").forEach((item) => item.classList.remove("on", "over"));
      qa(".gnb-2dep, .gnb-3dep", gnb).forEach((depth) => depth.classList.remove("open"));
      header?.classList.remove("gnb-open");
      setActiveMenu();
      syncHeaderState();
    };

    const setActiveMenu = () => {
      const dep1 = Number(window.dep1 || 0);
      const dep2 = Number(window.dep2 || 0);
      qa("#gnb > ul > li, #gnbM #navigation > li").forEach((item) => item.classList.remove("active"));
      qa(".snb > li, #gnbM .gnb-2dep > ul > li").forEach((item) => item.classList.remove("active"));

      if (dep1 > 0) {
        qa(`#gnb > ul > li:nth-child(${dep1}), #gnbM #navigation > li:nth-child(${dep1})`).forEach((item) => item.classList.add("active"));
      }
      if (dep2 > 0) {
        qa(`.snb > li:nth-child(${dep2}), #gnbM #navigation > li:nth-child(${dep1}) .gnb-2dep > ul > li:nth-child(${dep2})`).forEach((item) => item.classList.add("active"));
      }
    };

    const syncHeaderState = () => {
      const hasOpenDepth = Boolean(gnb?.querySelector(".gnb-2dep.open, .gnb-3dep.open"));
      const useSolidHeader = !isMain || window.scrollY > parseToken("--space-64", 64) || hasOpenDepth || root.classList.contains("sitemap-open");
      header?.classList.toggle("dpd-header-scrolled", useSolidHeader);
      header?.classList.toggle("fixed", useSolidHeader);

      if (logo && /logo-[pw]\.svg(\?.*)?$/.test(initialLogo)) {
        logo.setAttribute("src", useSolidHeader ? colorLogo : lightLogo);
      }
    };

    if (gnb) {
      qa("#gnb > ul > li").forEach((item) => {
        const depth = q(".gnb-2dep", item);
        const open = () => {
          if (window.isMobile()) return;
          qa("#gnb > ul > li").forEach((listItem) => listItem.classList.toggle("on", listItem === item));
          qa(".gnb-2dep", gnb).forEach((depthItem) => depthItem.classList.toggle("open", depthItem === depth));
          header?.classList.add("gnb-open");
          syncHeaderState();
        };
        item.addEventListener("mouseenter", open);
        item.addEventListener("focusin", open);
      });

      gnb.addEventListener("mouseleave", closeDepth);
      gnb.addEventListener("focusout", (event) => {
        if (!event.relatedTarget || !gnb.contains(event.relatedTarget)) closeDepth();
      });

      qa(".gnb-2dep > ul > li", gnb).forEach((item) => {
        const thirdDepth = q(".gnb-3dep", item);
        if (!thirdDepth) return;
        item.addEventListener("mouseenter", () => thirdDepth.classList.add("open"));
        item.addEventListener("mouseleave", () => thirdDepth.classList.remove("open"));
        item.addEventListener("focusin", () => thirdDepth.classList.add("open"));
        item.addEventListener("focusout", (event) => {
          if (!event.relatedTarget || !item.contains(event.relatedTarget)) thirdDepth.classList.remove("open");
        });
      });
    }

    setActiveMenu();
    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
    window.addEventListener("resize", syncHeaderState, { passive: true });
  };

  const initSitemap = () => {
    const sitemap = q(".cm-sitemap-wrapper");
    const gnb = q("#gnb");
    const mobileNav = q("#gnbM #navigation");
    const sitemapNav = q(".sitemap-panel");
    const openButtons = qa(".cm-sitemap-open-btn");
    const closeButtons = qa(".cm-sitemap-close-btn");
    const sitemapMobileQuery = window.matchMedia("(max-width: 1280px)");

    if (gnb && mobileNav && mobileNav.dataset.menuClone === "true" && !mobileNav.children.length) {
      mobileNav.innerHTML = q("#gnb > ul", gnb)?.innerHTML || "";
    }

    if (gnb && sitemapNav && !sitemapNav.children.length) {
      sitemapNav.innerHTML = q("#gnb > ul", gnb)?.outerHTML || "";
    }

    qa("#gnbM #navigation > li").forEach((item) => {
      if (q(".gnb-2dep", item)) item.classList.add("has-2dep");
    });

    qa("#gnbM #navigation > li > a").forEach((link) => {
      const parent = link.parentElement;
      const depth = q(".gnb-2dep", parent);
      if (!depth) return;
      link.addEventListener("click", (event) => {
        if (!window.isMobile()) return;
        event.preventDefault();
        const nextOpen = !parent.classList.contains("open");
        qa("#gnbM #navigation > li").forEach((item) => item.classList.remove("open"));
        parent.classList.toggle("open", nextOpen);
      });
    });

    const getDirectChild = (item, className) => Array.from(item.children).find((child) => child.classList?.contains(className));
    const getSitemapAccordionItems = () => qa("#siteMapCon03 .sitemap-nav-panel > ul > li");
    const setSitemapAccordionState = (item, isOpen) => {
      const depth = getDirectChild(item, "sitemap-2dep");
      const toggle = getDirectChild(item, "sitemap-accordion-toggle");
      const icon = q("i", toggle);
      item.classList.toggle("open", isOpen);
      toggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
      icon?.classList.toggle("ri-add-line", !isOpen);
      icon?.classList.toggle("ri-subtract-line", isOpen);
      depth?.setAttribute("aria-hidden", sitemapMobileQuery.matches && !isOpen ? "true" : "false");
    };
    const closeSitemapAccordions = (exceptItem = null) => {
      getSitemapAccordionItems().forEach((item) => {
        if (item !== exceptItem && item.classList.contains("has-accordion")) setSitemapAccordionState(item, false);
      });
    };
    const syncSitemapAccordion = () => {
      getSitemapAccordionItems().forEach((item, index) => {
        const depth = getDirectChild(item, "sitemap-2dep");
        const title = Array.from(item.children).find((child) => child.matches?.("h2, .sitemap-direct-link"));
        const hasDepth = Boolean(depth?.children.length);

        item.classList.toggle("has-accordion", hasDepth);
        item.classList.toggle("has-direct-link", !hasDepth);
        if (!depth || !title || !hasDepth) {
          depth?.setAttribute("aria-hidden", "true");
          return;
        }

        if (!depth.id) depth.id = `sitemap-accordion-panel-${index + 1}`;

        let toggle = getDirectChild(item, "sitemap-accordion-toggle");
        if (!toggle) {
          toggle = doc.createElement("button");
          toggle.type = "button";
          toggle.className = "sitemap-accordion-toggle";
          toggle.innerHTML = '<span class="sitemap-accordion-label"></span><i class="ri-add-line" aria-hidden="true"></i>';
          item.insertBefore(toggle, depth);
          toggle.addEventListener("click", (event) => {
            event.preventDefault();
            if (!sitemapMobileQuery.matches) return;
            const nextOpen = !item.classList.contains("open");
            closeSitemapAccordions(item);
            setSitemapAccordionState(item, nextOpen);
          });
        }

        q(".sitemap-accordion-label", toggle).textContent = title.textContent.trim();
        toggle.setAttribute("aria-controls", depth.id);
        setSitemapAccordionState(item, sitemapMobileQuery.matches ? item.classList.contains("open") : true);
      });
    };

    const open = () => {
      syncSitemapAccordion();
      if (sitemapMobileQuery.matches) closeSitemapAccordions();
      root.classList.add("sitemap-open");
      sitemap?.classList.add("open");
      openButtons.forEach((button) => button.classList.add("active"));
      lockScroll(true);
      q(".cm-sitemap-close-btn", sitemap)?.focus();
    };

    const close = () => {
      root.classList.remove("sitemap-open");
      sitemap?.classList.remove("open");
      openButtons.forEach((button) => button.classList.remove("active"));
      closeSitemapAccordions();
      lockScroll(false);
    };

    openButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        open();
      });
    });
    closeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        close();
      });
    });
    sitemap?.addEventListener("click", (event) => {
      if (event.target === sitemap || event.target.classList.contains("cm-sitemap-bg")) close();
    });
    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && root.classList.contains("sitemap-open")) close();
    });
    sitemapMobileQuery.addEventListener?.("change", syncSitemapAccordion);
    syncSitemapAccordion();

    window.dpdCloseSitemap = close;
  };

  const executeInlineScripts = (container) => {
    qa("script", container).forEach((script) => {
      const nextScript = doc.createElement("script");
      Array.from(script.attributes).forEach((attribute) => nextScript.setAttribute(attribute.name, attribute.value));
      nextScript.textContent = script.textContent;
      script.replaceWith(nextScript);
    });
  };

  const allowInnerModalScroll = (container) => {
    qa(".common-modal-body", container).forEach((scrollArea) => {
      const stopAtScrollArea = (event) => event.stopPropagation();
      scrollArea.addEventListener("wheel", stopAtScrollArea, { passive: true });
      scrollArea.addEventListener("touchmove", stopAtScrollArea, { passive: true });
    });
  };

  const closeTopModal = () => {
    const modal = qa(".modal-fixed-pop-wrapper").pop();
    if (!modal) return;
    const triggerSelector = modal.dataset.triggerSelector;
    modal.remove();
    if (!q(".modal-fixed-pop-wrapper")) lockScroll(false);
    if (triggerSelector) q(triggerSelector)?.focus();
  };

  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));

  const getCommonModalMarkup = ({ id, title, bodyHtml, closeLabel }) => `
    <section class="common-modal-content" role="document">
      <div class="common-modal-head">
        <h1 id="${id}" class="common-modal-title">${escapeHtml(title)}</h1>
        <button type="button" title="${escapeHtml(closeLabel)}" class="modal-close-btn common-modal-close" aria-label="${escapeHtml(closeLabel)}">
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>
      </div>
      <div class="common-modal-body">
        <div class="common-modal-editor editor">${bodyHtml}</div>
      </div>
    </section>
  `;

  const normalizeCommonModalContent = (parsed, id, labels, isKo) => {
    const existing = parsed.querySelector(".common-modal-content");
    if (existing) {
      const heading = q(".common-modal-title, h1, h2, h3, .modal-tit", existing);
      if (heading) heading.id = id;
      return existing.outerHTML;
    }

    const legacy = parsed.querySelector(".footer-modal-content") || parsed.body;
    const title = (q(".common-modal-title, h1, h2, h3, .modal-tit", legacy)?.textContent || (isKo ? "정책 안내" : "Policy Notice")).trim();
    const bodySource = q(".common-modal-body, .footer-inner", legacy) || legacy;
    return getCommonModalMarkup({
      id,
      title,
      bodyHtml: bodySource.innerHTML || "",
      closeLabel: labels.close
    });
  };

  const openAjaxModal = async (url, trigger) => {
    if (!url) return;
    const labels = getLangLabels();
    const isKo = root.lang?.toLowerCase().startsWith("ko") || location.pathname.includes("/kr/");
    const triggerId = trigger?.id || (trigger ? `dpd-modal-trigger-${Date.now()}` : "");
    if (trigger && !trigger.id) trigger.id = triggerId;
    const wrapper = doc.createElement("section");
    const id = `dpd-modal-${Date.now()}`;
    wrapper.className = "modal-fixed-pop-wrapper dpd-policy-common-modal open";
    Object.assign(wrapper.style, {
      display: "block",
      position: "fixed",
      inset: "0",
      zIndex: "10000"
    });
    wrapper.dataset.triggerSelector = triggerId ? `#${triggerId}` : "";
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-modal", "true");
    wrapper.setAttribute("aria-labelledby", id);
    wrapper.innerHTML = `
      <div class="modal-fixed-pop-inner">
        <div class="modal-loading" aria-hidden="true"></div>
      </div>
    `;
    body.appendChild(wrapper);
    lockScroll(true);

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      q(".modal-fixed-pop-inner", wrapper).innerHTML = normalizeCommonModalContent(parsed, id, labels, isKo);
      allowInnerModalScroll(wrapper);
      executeInlineScripts(wrapper);
      q(".modal-close-btn, .cm-modal-close-btn, button", wrapper)?.focus();
    } catch (error) {
      console.warn("DPD modal load failed:", error);
      q(".modal-fixed-pop-inner", wrapper).innerHTML = getCommonModalMarkup({
        id,
        title: isKo ? "정책 안내" : "Policy Notice",
        bodyHtml: `<p>${isKo ? "내용을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." : "Unable to load this content. Please try again later."}</p>`,
        closeLabel: labels.close
      });
      allowInnerModalScroll(wrapper);
      q(".modal-close-btn", wrapper)?.focus();
    }
  };

  window.ajaxUnLoad = closeTopModal;
  window.layerUnLoad = closeTopModal;
  window.ajaxLoad = (filename) => openAjaxModal(filename);
  window.layerLoad = window.ajaxLoad;

  const initModalLinks = () => {
    doc.addEventListener("click", (event) => {
      const trigger = event.target.closest(".cm-modal-open-btn");
      if (!trigger) return;
      const href = trigger.getAttribute("href");
      if (!href || href === "#") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openAjaxModal(new URL(href, location.href).href, trigger);
    }, true);
    doc.addEventListener("click", (event) => {
      if (event.target.closest(".modal-close-btn, .cm-modal-close-btn")) {
        event.preventDefault();
        closeTopModal();
      }
      const modal = event.target.closest(".modal-fixed-pop-wrapper");
      if (modal && !event.target.closest(".common-modal-content, .footer-modal-content")) {
        event.preventDefault();
        closeTopModal();
      }
    });
    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && q(".modal-fixed-pop-wrapper")) closeTopModal();
    });
  };

  const initFormControls = () => {
    doc.addEventListener("change", (event) => {
      const input = event.target.closest(".upload-hidden");
      if (!input) return;
      const box = input.closest(".file-custom-box") || input.parentElement;
      const visibleInput = q(".upload-name", box);
      const filename = input.files?.[0]?.name || input.value.split("\\").pop() || "";
      if (visibleInput) visibleInput.value = filename;
    });

    doc.addEventListener("click", (event) => {
      const more = event.target.closest(".bbs-inquiry-agree-con .agree-txt .more");
      if (!more) return;
      event.preventDefault();
      const agreeBox = more.closest(".bbs-inquiry-agree-con");
      const detail = q(".agree-inner", agreeBox);
      if (!detail) return;
      const willOpen = !detail.classList.contains("open");
      detail.classList.toggle("open", willOpen);
      detail.hidden = !willOpen;
      more.classList.toggle("open", willOpen);
      q("i", more)?.classList.toggle("rotate", willOpen);
    });

    qa(".agree-inner").forEach((detail) => {
      if (!detail.classList.contains("open")) detail.hidden = true;
    });
  };

  const getDownloadExtension = (link) => {
    if (!link) return "";
    const sources = [link.getAttribute("download"), link.getAttribute("href")].filter(Boolean);
    for (const source of sources) {
      const cleanSource = String(source).split(/[?#]/)[0].trim();
      const match = cleanSource.match(/\.([a-z0-9]+)$/i);
      if (match) return match[1].toLowerCase();
    }
    return "";
  };

  const initResourceFileBadges = () => {
    const iconMap = {
      pdf: "ri-file-pdf-2-line",
      zip: "ri-file-zip-line",
      xls: "ri-file-excel-2-line",
      xlsx: "ri-file-excel-2-line",
      doc: "ri-file-word-2-line",
      docx: "ri-file-word-2-line",
      ppt: "ri-file-ppt-2-line",
      pptx: "ri-file-ppt-2-line",
      hwp: "ri-file-hwp-line",
      jpg: "ri-file-image-line",
      jpeg: "ri-file-image-line",
      png: "ri-file-image-line",
      gif: "ri-file-image-line",
      webp: "ri-file-image-line",
      dwg: "ri-file-code-line",
      dxf: "ri-file-code-line"
    };
    const labels = getLangLabels();

    qa(".dpd-resource-card-list .bbs-item").forEach((card) => {
      if (q(".data-file-type-badge", card)) return;

      const action = q(".data-action-btn[href]", card);
      const extension = getDownloadExtension(action);
      if (!extension) return;

      const type = extension.toUpperCase();
      const badge = doc.createElement("span");
      const icon = doc.createElement("i");
      const text = doc.createElement("span");
      const info = q(".bbs-list-info-con", card);

      badge.className = `data-file-type-badge data-file-type-badge--${extension}`;
      badge.setAttribute("aria-label", labels.fileType.replace("{type}", type));
      icon.className = iconMap[extension] || "ri-file-unknow-line";
      icon.setAttribute("aria-hidden", "true");
      text.textContent = type;

      badge.append(icon, text);
      card.dataset.fileType = extension;
      if (info) {
        info.insertBefore(badge, info.firstChild);
      } else {
        card.insertBefore(badge, card.firstChild);
      }
    });
  };

  const initTabs = () => {
    const setupTabContainer = (container) => {
      const tabItems = qa(".tabs li, .tab-list li, .location-tab li, .cm-tab-list li", container);
      const panels = qa(".tab-con, .location-tab-con, .cm-tab-con, .con", container);
      if (!tabItems.length || !panels.length) return;

      const activate = (index) => {
        tabItems.forEach((item, itemIndex) => {
          const active = itemIndex === index;
          item.classList.toggle("selected", active);
          item.classList.toggle("active", active);
          q("a, button", item)?.setAttribute("aria-selected", active ? "true" : "false");
        });
        panels.forEach((panel, panelIndex) => {
          const active = panelIndex === index;
          panel.classList.toggle("open", active);
          panel.style.display = active ? "" : "none";
        });
      };

      tabItems.forEach((item, index) => {
        q("a, button", item)?.addEventListener("click", (event) => {
          event.preventDefault();
          activate(index);
        });
      });

      activate(Math.max(tabItems.findIndex((item) => item.classList.contains("selected") || item.classList.contains("active")), 0));
    };

    qa(".cm-tab-container-JS, .location-tab-container-JS").forEach(setupTabContainer);
  };

  const initDropMenus = () => {
    qa(".cm-drop-menu-box-JS").forEach((box) => {
      const button = q(".cm-drop-open-btn, .drop-open-btn", box);
      const list = q(".cm-drop-list, .drop-list", box);
      if (!button || !list) return;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const open = !box.classList.contains("open");
        box.classList.toggle("open", open);
        button.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    doc.addEventListener("click", (event) => {
      if (event.target.closest(".cm-drop-menu-box-JS")) return;
      qa(".cm-drop-menu-box-JS.open").forEach((box) => box.classList.remove("open"));
    });
  };

  const initFixedTabs = () => {
    const links = qa(".cm-fixed-tab-list a[href*='#'], .dpd-product-detail-tabbar a[href*='#']");
    if (!links.length) return;

    const headerOffset = () => parseToken("--component-detail-tabbar-scroll-margin", 192);
    const targets = links
      .map((link) => {
        const hash = link.hash;
        return hash ? { link, target: q(hash) } : null;
      })
      .filter((item) => item?.target);

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = q(link.hash);
        if (!target) return;
        event.preventDefault();
        scrollToPosition(target.getBoundingClientRect().top + window.scrollY - headerOffset(), 700);
        history.replaceState(null, "", link.hash);
      });
    });

    const sync = () => {
      let current = targets[0];
      targets.forEach((item) => {
        if (item.target.getBoundingClientRect().top - headerOffset() <= 8) current = item;
      });
      targets.forEach((item) => {
        item.link.classList.toggle("active", item === current);
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
  };

  const initEditorWrap = () => {
    qa(".editor table").forEach((table) => {
      if (table.parentElement?.classList.contains("editor-table-wrap")) return;
      const wrap = doc.createElement("div");
      wrap.className = "editor-table-wrap";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
    qa(".editor iframe").forEach((iframe) => {
      if (iframe.parentElement?.classList.contains("editor-video-wrap")) return;
      const wrap = doc.createElement("div");
      wrap.className = "editor-video-wrap";
      iframe.parentNode.insertBefore(wrap, iframe);
      wrap.appendChild(iframe);
    });
  };

  const initAccordion = () => {
    qa(".accordion-list").forEach((list) => {
      const items = qa(".list-item", list);
      items.forEach((item) => {
        item.addEventListener("mouseenter", () => items.forEach((other) => other.classList.toggle("active", other === item)));
        item.addEventListener("focusin", () => items.forEach((other) => other.classList.toggle("active", other === item)));
      });
      list.addEventListener("mouseleave", () => items.forEach((item) => item.classList.remove("active")));
    });
  };

  const initLegacySwipers = () => {
    if (!window.Swiper) return;

    qa(".view-img-slide-wrap .area, .cm-img-slide .img-slide-wrap, .business-overview-con .area").forEach((slider) => {
      if (slider.classList.contains("swiper-initialized")) return;
      const wrapper = q(".swiper-wrapper", slider);
      if (!wrapper) return;
      new Swiper(slider, {
        slidesPerView: "auto",
        spaceBetween: parseToken("--space-24", 24),
        grabCursor: true,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        a11y: { enabled: true }
      });
    });
  };

  const initMainHero = () => {
    const visual = q("#mainVisual");
    const track = q(".main-visual-con", visual);
    const slides = qa(".main-visual-item", track);
    if (!visual || !track || !slides.length) return;

    const labels = getLangLabels();
    const nav = q(".main-visual-nav", visual);
    const prevButton = q(".main-visual-nav-btn--prev", nav);
    const nextButton = q(".main-visual-nav-btn--next", nav);
    const toggleButton = q(".main-visual-nav-btn--toggle", nav);
    const dots = q(".main-visual-dots", visual);
    let activeIndex = 0;
    let timer = 0;
    let paused = false;
    let isChanging = false;

    const syncHeight = () => {
      const height = window.getWindowHeight();
      visual.style.height = `${height}px`;
      q("#mainIntroCover")?.style.setProperty("height", `${height}px`);
    };

    const buildDots = () => {
      if (!dots) return;
      dots.innerHTML = `<ul>${slides.map((_, index) => `
        <li>
          <button class="circle-dots" type="button" aria-label="${labels.viewImage} ${index + 1}" data-main-visual-index="${index}">
            <svg width="12" height="12" viewBox="0 0 11 11" aria-hidden="true">
              <circle class="circle" cx="5.5" cy="5.5" r="4"></circle>
            </svg>
          </button>
        </li>
      `).join("")}</ul>`;
    };

    const stopMedia = (slide) => {
      q(".background-video", slide)?.classList.remove("start");
      const video = q(".slide-video", slide);
      if (!video) return;
      try {
        video.pause();
        video.currentTime = 0;
      } catch (error) {
        console.warn("DPD hero video reset failed:", error);
      }
    };

    const playMedia = (slide) => {
      const mediaBox = q(".background-video", slide);
      const video = q(".slide-video", slide);
      if (mediaBox) mediaBox.classList.add("start");
      if (!video || paused) return;
      video.muted = true;
      video.playsInline = true;
      const play = () => video.play().catch(() => {});
      if (video.readyState >= 1) play();
      else video.addEventListener("loadedmetadata", play, { once: true });
    };

    const getDuration = (slide) => {
      const video = q(".slide-video", slide);
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        return Math.max(video.duration * 1000, parseToken("--motion-main-visual-zoom", 8000));
      }
      return parseToken("--motion-main-visual-zoom", 8000);
    };

    const syncState = () => {
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.classList.toggle("active-item", active);
        slide.classList.toggle("stop-active-item", !active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        qa(focusableSelector, slide).forEach((item) => {
          if (active) item.removeAttribute("tabindex");
          else item.setAttribute("tabindex", "-1");
        });
      });
      qa("li", dots).forEach((item, index) => item.classList.toggle("is-active", index === activeIndex));
      if (toggleButton) {
        toggleButton.classList.toggle("is-paused", paused);
        toggleButton.setAttribute("aria-pressed", paused ? "true" : "false");
        toggleButton.setAttribute("aria-label", paused ? labels.play : labels.pause);
        const icon = q("i", toggleButton);
        if (icon) icon.className = paused ? "ri-play-fill" : "ri-pause-line";
      }
    };

    const clearTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    };

    const schedule = () => {
      clearTimer();
      if (paused || slides.length < 2) return;
      timer = window.setTimeout(() => changeSlide(activeIndex + 1), getDuration(slides[activeIndex]));
    };

    const changeSlide = (nextIndex) => {
      if (isChanging) return;
      const next = (nextIndex + slides.length) % slides.length;
      if (next === activeIndex) return;

      isChanging = true;
      stopMedia(slides[activeIndex]);
      activeIndex = next;
      syncState();
      playMedia(slides[activeIndex]);
      schedule();
      window.setTimeout(() => {
        isChanging = false;
      }, parseToken("--motion-slow", 800));
    };

    buildDots();
    syncHeight();
    syncState();
    playMedia(slides[activeIndex]);
    schedule();

    window.addEventListener("resize", syncHeight, { passive: true });
    prevButton?.addEventListener("click", () => changeSlide(activeIndex - 1));
    nextButton?.addEventListener("click", () => changeSlide(activeIndex + 1));
    toggleButton?.addEventListener("click", () => {
      paused = !paused;
      if (paused) {
        clearTimer();
        q(".slide-video", slides[activeIndex])?.pause();
      } else {
        playMedia(slides[activeIndex]);
        schedule();
      }
      syncState();
    });
    dots?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-main-visual-index]");
      if (!button) return;
      changeSlide(Number(button.dataset.mainVisualIndex || 0));
    });
  };

  const initMainSliderNav = (swiper, navName) => {
    if (!swiper || !navName) return;
    const nav = q(`[data-dpd-slider-nav="${navName}"]`);
    if (!nav) return;

    const currentEl = q("[data-dpd-slider-current]", nav);
    const totalEl = q("[data-dpd-slider-total]", nav);
    const progressEl = q("[data-dpd-slider-progress]", nav);
    const prevButton = q("[data-dpd-slider-prev]", nav);
    const nextButton = q("[data-dpd-slider-next]", nav);
    const sliderEl = swiper.el || swiper.$el?.[0] || null;
    const formatNumber = (value) => String(value).padStart(2, "0");
    const getSlides = () => qa(".swiper-slide:not(.swiper-slide-duplicate)", sliderEl);
    const getTotal = () => Math.max(getSlides().length, 1);
    const getCurrent = () => {
      const total = getTotal();
      if (swiper.params?.loop) return clamp((swiper.realIndex || 0) + 1, 1, total);
      if (swiper.isEnd) return total;
      return clamp((swiper.activeIndex || 0) + 1, 1, total);
    };
    const update = () => {
      const total = getTotal();
      const current = getCurrent();
      const progress = total <= 1 ? 1 : current / total;

      if (currentEl) currentEl.textContent = formatNumber(current);
      if (totalEl) totalEl.textContent = formatNumber(total);
      if (progressEl) progressEl.style.transform = `scaleX(${clamp(progress, 0, 1)})`;
      if (prevButton) prevButton.disabled = !swiper.params?.loop && Boolean(swiper.isBeginning);
      if (nextButton) nextButton.disabled = !swiper.params?.loop && Boolean(swiper.isEnd);
    };

    prevButton?.addEventListener("click", () => swiper.slidePrev());
    nextButton?.addEventListener("click", () => swiper.slideNext());
    ["slideChange", "transitionStart", "transitionEnd", "resize", "observerUpdate", "update"].forEach((eventName) => {
      swiper.on(eventName, update);
    });
    update();
  };

  const initMainDevelopmentSwiper = () => {
    const slider = q(".dpd-main-dev-swiper");
    if (!slider || !window.Swiper) return;

    const swiper = new Swiper(slider, {
      slidesPerView: "auto",
      slidesPerGroup: 1,
      spaceBetween: 0,
      loop: true,
      speed: parseToken("--motion-main-development-swipe", 1000),
      autoplay: {
        enabled: true,
        delay: parseToken("--motion-main-development-autoplay", 3000),
        disableOnInteraction: false
      },
      grabCursor: true,
      followFinger: true,
      touchRatio: 1,
      threshold: 0,
      longSwipesRatio: 0.16,
      longSwipesMs: 160,
      resistanceRatio: 0.56,
      observer: true,
      observeParents: true,
      watchOverflow: false,
      preventClicks: true,
      preventClicksPropagation: true,
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 개발품목",
        nextSlideMessage: "다음 개발품목"
      },
      on: {
        init() {
          slider.classList.add("is-swiper-ready");
        }
      }
    });

    window.dpdMainDevelopmentSwiper = swiper;
    initMainSliderNav(swiper, "development");
  };

  const initMainHandledSwiper = () => {
    const slider = q(".dpd-main-handled-swiper");
    if (!slider || !window.Swiper) return;
    const wrapper = q(".dpd-main-handled-list", slider);

    const getGap = () => {
      if (window.matchMedia("(max-width: 800px)").matches) return parseToken("--component-main-handled-slide-gap-mobile", 16);
      if (window.matchMedia("(max-width: 1280px)").matches) return parseToken("--component-main-handled-slide-gap-tablet", 24);
      return parseToken("--component-main-handled-slide-gap", 32);
    };
    const getOffset = () => {
      if (window.matchMedia("(max-width: 800px)").matches) return parseToken("--component-main-handled-container-padding-mobile", 16);
      return parseToken("--component-main-handled-container-padding", 32);
    };
    const applyLayout = (swiper) => {
      if (!swiper || swiper.destroyed) return;
      swiper.params.spaceBetween = getGap();
      swiper.params.slidesPerView = "auto";
      swiper.params.slidesOffsetBefore = getOffset();
      swiper.params.slidesOffsetAfter = getOffset();
      swiper.update();
    };
    let dragStartX = 0;
    let dragStartY = 0;
    let isDragging = false;
    let isDragDown = false;
    let dragBlockUntil = 0;
    let dragGuardTimer = 0;
    const getEventPoint = (event) => event.touches?.[0] || event.changedTouches?.[0] || event;
    const markDragging = () => {
      isDragging = true;
      dragBlockUntil = Date.now() + parseToken("--motion-slow", 800);
      root.dataset.dpdDragGuardUntil = String(dragBlockUntil);
      slider.classList.add("is-dragging");
      wrapper?.classList.add("is-dragging");
    };
    const clearDragGuard = () => {
      isDragDown = false;
      if (isDragging) dragBlockUntil = Date.now() + parseToken("--motion-default", 400);
      window.clearTimeout(dragGuardTimer);
      dragGuardTimer = window.setTimeout(() => {
        isDragging = false;
        slider.classList.remove("is-dragging");
        wrapper?.classList.remove("is-dragging");
      }, parseToken("--motion-default", 400));
    };

    const startDragGuard = (event) => {
      const point = getEventPoint(event);
      dragStartX = point.clientX;
      dragStartY = point.clientY;
      isDragDown = true;
      isDragging = false;
      window.clearTimeout(dragGuardTimer);
      slider.classList.remove("is-dragging");
    };
    const moveDragGuard = (event) => {
      if (!isDragDown || isDragging) return;
      const point = getEventPoint(event);
      const movedX = Math.abs(point.clientX - dragStartX);
      const movedY = Math.abs(point.clientY - dragStartY);
      if (Math.max(movedX, movedY) <= parseToken("--space-8", 8)) return;
      markDragging();
    };

    slider.addEventListener("pointerdown", startDragGuard, { passive: true });
    slider.addEventListener("pointermove", moveDragGuard, { passive: true });
    slider.addEventListener("pointerup", clearDragGuard, { passive: true });
    slider.addEventListener("pointercancel", clearDragGuard, { passive: true });
    slider.addEventListener("mousedown", startDragGuard, { passive: true });
    slider.addEventListener("mousemove", moveDragGuard, { passive: true });
    slider.addEventListener("mouseup", clearDragGuard, { passive: true });
    slider.addEventListener("mouseleave", clearDragGuard, { passive: true });
    slider.addEventListener("touchstart", startDragGuard, { passive: true });
    slider.addEventListener("touchmove", moveDragGuard, { passive: true });
    slider.addEventListener("touchend", clearDragGuard, { passive: true });
    slider.addEventListener("touchcancel", clearDragGuard, { passive: true });
    slider.addEventListener("click", (event) => {
      const shouldBlockClick = isDragging || Date.now() < dragBlockUntil;
      if (!shouldBlockClick || !event.target.closest("a, button, [data-dpd-lightbox]")) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
    slider.addEventListener("dragstart", (event) => event.preventDefault());

    const swiper = new Swiper(slider, {
      slidesPerView: "auto",
      slidesPerGroup: 1,
      spaceBetween: getGap(),
      slidesOffsetBefore: getOffset(),
      slidesOffsetAfter: getOffset(),
      speed: parseToken("--motion-main-handled-swipe", 800),
      allowTouchMove: true,
      freeMode: false,
      grabCursor: true,
      followFinger: true,
      simulateTouch: true,
      touchRatio: 1,
      touchStartPreventDefault: true,
      touchMoveStopPropagation: false,
      touchReleaseOnEdges: false,
      longSwipes: true,
      shortSwipes: true,
      longSwipesRatio: 0.22,
      longSwipesMs: 220,
      resistanceRatio: 0.52,
      threshold: 0,
      roundLengths: false,
      watchOverflow: false,
      observer: false,
      observeParents: false,
      preventClicks: true,
      preventClicksPropagation: true,
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 공급품목",
        nextSlideMessage: "다음 공급품목"
      },
      on: {
        init() {
          slider.classList.add("is-swiper-ready");
        },
        resize() {
          applyLayout(this);
        },
        touchStart() {
          this.__dpdStartIndex = this.activeIndex;
        },
        touchMove() {
          markDragging();
        },
        touchEnd() {
          clearDragGuard();
          const startIndex = Number.isInteger(this.__dpdStartIndex) ? this.__dpdStartIndex : this.previousIndex;
          window.requestAnimationFrame(() => {
            if (this.destroyed || !Number.isInteger(startIndex)) return;
            const diff = this.activeIndex - startIndex;
            if (Math.abs(diff) > 1) {
              this.slideTo(startIndex + Math.sign(diff), this.params.speed);
            }
            this.updateProgress();
          });
        }
      }
    });

    window.addEventListener("resize", () => window.requestAnimationFrame(() => applyLayout(swiper)), { passive: true });
    window.dpdMainHandledSwiper = swiper;
    initMainSliderNav(swiper, "handled");
  };

  const initPinHero = () => {
    const section = q(".dpd-company-greeting .business-intro-top-con, .dpd-company-vision .business-intro-top-con, .dpd-pin-hero .business-intro-top-con");
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!section || !gsap || !ScrollTrigger || prefersReducedMotion.matches) return;

    const visual = q(".dpd-greeting-pin-visual", section);
    const visualMedia = q("img, video", visual);
    const copy = q(".txt-box", section);
    const textTargets = qa(".business-cm-top-en-txt, .business-cm-top-txt, .business-cm-top-txt02", section);
    if (!visual || !copy) return;

    gsap.registerPlugin(ScrollTrigger);

    const createPinTimeline = () => {
      section.classList.add("is-gsap-ready");
      gsap.set(visual, {
        width: () => Math.min(window.innerWidth * 0.48, 560),
        height: () => Math.min(window.innerHeight * 0.56, 480),
        borderRadius: 32
      });
      gsap.set(copy, { autoAlpha: 0, y: 48 });
      gsap.set(textTargets, { autoAlpha: 0, y: 32 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.45)}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(visual, {
          width: () => window.innerWidth,
          height: () => window.innerHeight,
          borderRadius: 0,
          ease: "none",
          duration: 0.72
        }, 0)
        .to(copy, {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.24
        }, 0.38)
        .to(textTargets, {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.4,
          stagger: 0.04
        }, 0.42);

      const refresh = () => ScrollTrigger.refresh();
      if (visualMedia?.tagName === "IMG" && !visualMedia.complete) visualMedia.addEventListener("load", refresh, { once: true });
      if (visualMedia?.tagName === "VIDEO" && visualMedia.readyState < 1) visualMedia.addEventListener("loadedmetadata", refresh, { once: true });

      return () => {
        timeline.kill();
        section.classList.remove("is-gsap-ready");
        gsap.set([visual, copy, ...textTargets], { clearProps: "all" });
      };
    };

    if (typeof gsap.matchMedia === "function") {
      gsap.matchMedia().add("(min-width: 801px)", createPinTimeline);
      return;
    }

    if (typeof ScrollTrigger.matchMedia === "function") {
      ScrollTrigger.matchMedia({
        "(min-width: 801px)": createPinTimeline
      });
      return;
    }

    if (!window.isMobile()) createPinTimeline();
  };

  const initMainBusinessCards = () => {
    const list = q(".dpd-main-business-card-list");
    if (!list) return;
    const items = qa(".dpd-main-business-card-item", list);
    const activate = (item) => items.forEach((listItem) => listItem.classList.toggle("is-active", listItem === item));
    const clear = () => items.forEach((listItem) => listItem.classList.remove("is-active"));
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => activate(item));
      item.addEventListener("focusin", () => activate(item));
    });
    list.addEventListener("mouseleave", clear);
    list.addEventListener("focusout", (event) => {
      if (!event.relatedTarget || !list.contains(event.relatedTarget)) clear();
    });
  };

  const initHandledCountryFilter = () => {
    qa(".dpd-country-filter").forEach((filter) => {
      const section = filter.closest(".dpd-handled-items-page");
      const buttons = qa("[data-dpd-country-filter]", filter);
      const items = qa(".dpd-sub-business-list > li", section || doc);
      if (!section || !buttons.length || !items.length) return;

      const setFilter = (country) => {
        section.dataset.activeCountry = country;
        buttons.forEach((button) => {
          const active = button.dataset.dpdCountryFilter === country;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", active ? "true" : "false");
        });
        items.forEach((item) => {
          const show = country === "all" || item.dataset.country === country;
          item.hidden = !show;
          item.classList.toggle("is-filter-hidden", !show);
        });
      };

      buttons.forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.dpdCountryFilter || "all")));
      setFilter(q(".is-active", filter)?.dataset.dpdCountryFilter || "all");
    });
  };

  const initProductDetailGallery = () => {
    qa("[data-dpd-product-gallery]").forEach((gallery) => {
      const mainImage = q(".dpd-product-detail-main-image img", gallery);
      const buttons = qa("[data-gallery-src]", gallery);
      if (!mainImage || !buttons.length) return;

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const src = button.dataset.gallerySrc;
          if (!src) return;
          mainImage.setAttribute("src", src);
          buttons.forEach((item) => item.classList.toggle("is-active", item === button));
        });
      });
    });
  };

  const initDpdMousePointer = () => {
    const targets = qa("[data-mouse-pointer]");
    if (!targets.length || window.isMobile()) return;

    let pointer = q(".mouse-pointer");
    if (!pointer) {
      pointer = doc.createElement("div");
      pointer.className = "mouse-pointer";
      pointer.innerHTML = `
        <div class="pointer-circle"></div>
        <div class="pointer-txt pointer-view-txt"><i class="ri-add-line" aria-hidden="true"></i><span>View more</span></div>
        <div class="pointer-txt pointer-more-txt"><i class="ri-add-line" aria-hidden="true"></i><span>View more</span></div>
        <div class="pointer-txt pointer-drag-txt"><i class="ri-add-line" aria-hidden="true"></i><span>Drag</span></div>
      `;
      body.appendChild(pointer);
    }
    if (!q(".pointer-drag-txt", pointer)) {
      pointer.insertAdjacentHTML("beforeend", `<div class="pointer-txt pointer-drag-txt"><i class="ri-add-line" aria-hidden="true"></i><span>Drag</span></div>`);
    }
    qa(".pointer-txt i", pointer).forEach((icon) => {
      icon.className = "ri-add-line";
      icon.setAttribute("aria-hidden", "true");
    });

    body.addEventListener("mousemove", (event) => {
      pointer.classList.add("is-moving");
      pointer.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    }, { passive: true });

    const pointerTypes = ["view", "more", "drag"];
    const activatePointer = (type) => {
      pointerTypes.forEach((item) => pointer.classList.toggle(item, item === type));
      pointer.classList.add("active");
    };
    const deactivatePointer = () => {
      pointer.classList.remove("active", ...pointerTypes);
    };

    targets.forEach((target) => {
      const type = target.dataset.mousePointer;
      if (!type) return;
      target.addEventListener("mouseenter", () => activatePointer(type));
      target.addEventListener("mouseleave", deactivatePointer);
      target.addEventListener("focus", () => activatePointer(type));
      target.addEventListener("blur", deactivatePointer);
    });
    doc.addEventListener("mouseleave", deactivatePointer);
  };

  const initSubBusinessInteractions = () => {
    qa(".dpd-sub-business-con").forEach((container) => container.classList.add("animated"));
    qa(".dpd-sub-business-list").forEach((list) => {
      if (list.classList.contains("swiper-wrapper") || list.closest(".swiper-container")) return;
      const items = qa("li", list);
      let startX = 0;
      let isDown = false;
      let isDragging = false;

      list.addEventListener("mouseenter", (event) => {
        const item = event.target.closest("li");
        if (!item || !list.contains(item)) return;
        items.forEach((listItem) => {
          listItem.classList.toggle("off", listItem !== item);
          listItem.classList.toggle("on", listItem === item);
        });
      }, true);
      list.addEventListener("mouseleave", () => {
        items.forEach((item) => item.classList.remove("off", "on"));
      });
      list.addEventListener("pointerdown", (event) => {
        isDown = true;
        startX = event.clientX;
        isDragging = false;
        list.classList.remove("is-dragging");
      });
      doc.addEventListener("pointermove", (event) => {
        if (!isDown) return;
        if (Math.abs(event.clientX - startX) > parseToken("--space-8", 8)) {
          isDragging = true;
          list.classList.add("is-dragging");
        }
      });
      doc.addEventListener("pointerup", () => {
        isDown = false;
        window.setTimeout(() => {
          isDragging = false;
          list.classList.remove("is-dragging");
        }, 0);
      });
      list.addEventListener("click", (event) => {
        if (!isDragging || !event.target.closest("a, button")) return;
        event.preventDefault();
        event.stopPropagation();
      }, true);
    });
  };

  const initItemsLightbox = () => {
    let cards = qa("[data-dpd-lightbox]");
    if (!cards.length) return;

    const labels = getLangLabels();
    let activeCardIndex = 0;
    let activeSlideIndex = 0;
    let activeGallery = [];

    const lightbox = doc.createElement("div");
    lightbox.className = "dpd-items-lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", labels.gallery);
    lightbox.innerHTML = `
      <div class="dpd-items-lightbox__panel" role="document">
        <button class="dpd-items-lightbox__close" type="button" aria-label="${labels.close}"><i class="ri-close-line" aria-hidden="true"></i></button>
        <button class="dpd-items-lightbox__nav dpd-items-lightbox__nav--prev" type="button" aria-label="${labels.previous}"><i class="ri-arrow-left-s-line" aria-hidden="true"></i></button>
        <div class="dpd-items-lightbox__viewport" aria-live="polite">
          <div class="dpd-items-lightbox__track"></div>
        </div>
        <button class="dpd-items-lightbox__nav dpd-items-lightbox__nav--next" type="button" aria-label="${labels.next}"><i class="ri-arrow-right-s-line" aria-hidden="true"></i></button>
        <div class="dpd-items-lightbox__caption">
          <div class="dpd-items-lightbox__content">
            <p class="dpd-items-lightbox__eyebrow"></p>
            <h4 class="dpd-items-lightbox__title"></h4>
            <p class="dpd-items-lightbox__major"><span>${labels.mainItems}</span><strong></strong></p>
          </div>
          <div class="dpd-items-lightbox__meta">
            <p class="dpd-items-lightbox__counter"></p>
            <div class="dpd-items-lightbox__dots" aria-label="${labels.gallery}"></div>
          </div>
        </div>
      </div>
    `;
    body.appendChild(lightbox);

    const closeButton = q(".dpd-items-lightbox__close", lightbox);
    const prevButton = q(".dpd-items-lightbox__nav--prev", lightbox);
    const nextButton = q(".dpd-items-lightbox__nav--next", lightbox);
    const viewport = q(".dpd-items-lightbox__viewport", lightbox);
    const track = q(".dpd-items-lightbox__track", lightbox);
    const eyebrow = q(".dpd-items-lightbox__eyebrow", lightbox);
    const title = q(".dpd-items-lightbox__title", lightbox);
    const major = q(".dpd-items-lightbox__major", lightbox);
    const majorText = q(".dpd-items-lightbox__major strong", lightbox);
    const counter = q(".dpd-items-lightbox__counter", lightbox);
    const dots = q(".dpd-items-lightbox__dots", lightbox);

    const escapeHtml = (value) => String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const getCardData = (trigger) => {
      const card = trigger.closest(".dpd-item-card") || trigger;
      const gallery = (trigger.dataset.gallery || "")
        .split("|")
        .map((src) => src.trim())
        .filter(Boolean);
      const image = trigger.dataset.image || trigger.getAttribute("href") || "";
      return {
        gallery: gallery.length ? gallery : [image].filter(Boolean),
        title: trigger.dataset.title || card.dataset.title || q(".tit-kr", card)?.textContent.trim() || "",
        eyebrow: trigger.dataset.eyebrow || card.dataset.eyebrow || q(".tit-en", card)?.textContent.trim() || "",
        description: trigger.dataset.description || card.dataset.description || q(".dpd-item-desc", card)?.textContent.trim() || "",
        alt: q("img", trigger)?.getAttribute("alt") || q("img", card)?.getAttribute("alt") || ""
      };
    };

    const setSlide = (index) => {
      if (!activeGallery.length) return;
      activeSlideIndex = (index + activeGallery.length) % activeGallery.length;
      track.style.setProperty("--dpd-lightbox-slide-index", activeSlideIndex);
      counter.textContent = `${activeSlideIndex + 1} / ${activeGallery.length}`;
      qa("button", dots).forEach((button, dotIndex) => {
        const active = dotIndex === activeSlideIndex;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    const render = () => {
      const data = getCardData(cards[activeCardIndex]);
      activeGallery = data.gallery;
      eyebrow.textContent = data.eyebrow;
      title.textContent = data.title;
      majorText.textContent = data.description;
      major.hidden = !data.description;
      prevButton.hidden = activeGallery.length < 2;
      nextButton.hidden = activeGallery.length < 2;
      dots.hidden = activeGallery.length < 2;
      track.innerHTML = activeGallery.map((src, index) => `
        <figure class="dpd-items-lightbox__slide">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(`${data.title} ${labels.relatedImage} ${index + 1}`)}" loading="${index === 0 ? "eager" : "lazy"}" draggable="false">
        </figure>
      `).join("");
      dots.innerHTML = activeGallery.map((_, index) => `
        <button type="button" data-slide-index="${index}" aria-label="${labels.viewImage} ${index + 1}"></button>
      `).join("");
      setSlide(0);
    };

    const open = (index) => {
      activeCardIndex = index;
      lightbox.hidden = false;
      root.classList.add("dpd-items-lightbox-open");
      lockScroll(true);
      render();
      closeButton.focus();
    };

    const close = () => {
      lightbox.hidden = true;
      root.classList.remove("dpd-items-lightbox-open");
      lockScroll(false);
      cards[activeCardIndex]?.focus();
    };

    doc.addEventListener("click", (event) => {
      const target = isElement(event.target) ? event.target.closest("[data-dpd-lightbox]") : null;
      const dragGuardActive = Number(root.dataset.dpdDragGuardUntil || 0) > Date.now();
      if (!target || !doc.contains(target) || dragGuardActive || target.closest(".is-dragging")) return;
      event.preventDefault();
      event.stopPropagation();
      const visibleCards = qa("[data-dpd-lightbox]").filter((trigger) => {
        const item = trigger.closest("li");
        return !item || (!item.hidden && !item.classList.contains("is-filter-hidden"));
      });
      const index = visibleCards.indexOf(target);
      if (index < 0) return;
      cards = visibleCards;
      open(index);
    }, true);

    closeButton.addEventListener("click", close);
    prevButton.addEventListener("click", () => setSlide(activeSlideIndex - 1));
    nextButton.addEventListener("click", () => setSlide(activeSlideIndex + 1));
    dots.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-slide-index]");
      if (button) setSlide(Number(button.dataset.slideIndex));
    });

    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerMoveX = 0;
    let pointerId = null;

    const resetDrag = () => {
      pointerId = null;
      pointerMoveX = 0;
      viewport.classList.remove("is-dragging");
      track.style.transform = "";
    };

    viewport.addEventListener("dragstart", (event) => event.preventDefault());
    viewport.addEventListener("pointerdown", (event) => {
      if (event.button && event.button !== 0) return;
      event.preventDefault();
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerMoveX = 0;
      pointerId = event.pointerId;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture?.(event.pointerId);
    });
    viewport.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) return;
      const moveX = event.clientX - pointerStartX;
      const moveY = event.clientY - pointerStartY;
      if (Math.abs(moveX) <= Math.abs(moveY)) return;
      pointerMoveX = moveX;
      track.style.transform = `translate3d(calc(var(--dpd-lightbox-slide-index) * -100% + ${moveX}px), 0, 0)`;
    });
    viewport.addEventListener("pointerup", (event) => {
      if (pointerId !== event.pointerId) return;
      const moveX = pointerMoveX || event.clientX - pointerStartX;
      const moveY = event.clientY - pointerStartY;
      const shouldMove = Math.abs(moveX) >= parseToken("--space-48", 48) && Math.abs(moveX) > Math.abs(moveY);
      resetDrag();
      viewport.releasePointerCapture?.(event.pointerId);
      if (shouldMove) setSlide(activeSlideIndex + (moveX < 0 ? 1 : -1));
    });
    viewport.addEventListener("pointercancel", resetDrag);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.classList.contains("dpd-items-lightbox__panel")) close();
    });
    doc.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") setSlide(activeSlideIndex - 1);
      if (event.key === "ArrowRight") setSlide(activeSlideIndex + 1);
    });
  };

  const initHistoryProgress = () => {
    const bar = q(".history-percent-bar");
    const fill = q(".percent-bar-child", bar);
    const groups = qa(".history-year-group-box");
    if (!bar || !fill || !groups.length) return;

    const sync = () => {
      const first = groups[0].getBoundingClientRect().top + window.scrollY;
      const last = groups[groups.length - 1].getBoundingClientRect().bottom + window.scrollY;
      const progress = clamp((window.scrollY + window.innerHeight * 0.5 - first) / Math.max(last - first, 1), 0, 1);
      fill.style.height = `${progress * 100}%`;
      groups.forEach((group) => {
        group.classList.toggle("active", group.getBoundingClientRect().top < window.innerHeight * 0.55);
      });
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
  };

  const initTopButton = () => {
    qa(".to-top-btn, .top-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        window.moveScrollTop(0);
      });
    });
  };

  onReady(() => {
    initLenis();
    initReadyState();
    initDeviceClasses();
    initTextReveal();
    initHeader();
    initSitemap();
    initModalLinks();
    initFormControls();
    initResourceFileBadges();
    initTabs();
    initDropMenus();
    initFixedTabs();
    initEditorWrap();
    initAccordion();
    initLegacySwipers();
    initMainHero();
    initMainDevelopmentSwiper();
    initMainHandledSwiper();
    initPinHero();
    initMainBusinessCards();
    initHandledCountryFilter();
    initProductDetailGallery();
    initDpdMousePointer();
    initSubBusinessInteractions();
    initItemsLightbox();
    initHistoryProgress();
    initTopButton();
    window.toFit(".img-to-fit");
    window.rollingActive(".si-process-list");
  });
})();
