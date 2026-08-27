(function (window, document) {
  "use strict";

  var store = window.DpdCmsStore;
  if (!store) return;

  var q = function (selector, parent) {
    return (parent || document).querySelector(selector);
  };

  var qa = function (selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  };

  var esc = function (value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  var toLines = function (value) {
    if (Array.isArray(value)) return value.join("\n");
    return String(value || "");
  };

  var fromLines = function (value) {
    return String(value || "")
      .split(/\n|\|/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  };

  var normalizeList = function (value) {
    if (Array.isArray(value)) return value.map(function (item) { return String(item || "").trim(); }).filter(Boolean);
    return fromLines(value);
  };

  var normalizePairs = function (value) {
    if (Array.isArray(value)) {
      return value.map(function (item) {
        if (typeof item === "string") {
          var parts = item.split("|");
          return { label: (parts[0] || "").trim(), value: (parts[1] || "").trim() };
        }
        return {
          label: String(item && (item.label || item.key || item.title) || "").trim(),
          value: String(item && (item.value || item.text || item.description) || "").trim()
        };
      }).filter(function (item) { return item.label || item.value; });
    }

    if (value && typeof value === "object") {
      return Object.keys(value).map(function (key) {
        return { label: key, value: String(value[key] || "") };
      });
    }

    return String(value || "").split(/\n/).map(function (line) {
      var parts = line.split("|");
      return { label: (parts[0] || "").trim(), value: (parts[1] || "").trim() };
    }).filter(function (item) { return item.label || item.value; });
  };

  var normalizeCards = function (value) {
    if (Array.isArray(value)) {
      return value.map(function (item) {
        if (typeof item === "string") {
          var parts = item.split("|");
          return { title: (parts[0] || "").trim(), text: (parts[1] || "").trim() };
        }
        return {
          title: String(item && (item.title || item.label) || "").trim(),
          text: String(item && (item.text || item.description || item.value) || "").trim()
        };
      }).filter(function (item) { return item.title || item.text; });
    }
    return [];
  };

  var adminAssetPath = function (path) {
    path = String(path || "").trim();
    if (!path || /^(https?:)?\/\//i.test(path) || /^(data:|blob:|#)/i.test(path) || path.charAt(0) === "/") return path;
    return "../" + path.replace(/^\.\//, "").replace(/^(\.\.\/)+/, "");
  };

  var isVideoPath = function (path) {
    return /^data:video\//i.test(String(path || "")) || /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(path || ""));
  };

  var assetPreviewMarkup = function (path, alt) {
    path = String(path || "").trim();
    if (!path) return '<span class="cms-asset-empty">이미지 또는 비디오 경로를 입력하세요.</span>';
    var src = adminAssetPath(path);
    if (isVideoPath(path)) {
      return '<video src="' + esc(src) + '" muted playsinline preload="metadata" aria-label="' + esc(alt || "미디어 미리보기") + '"></video>';
    }
    return '<img src="' + esc(src) + '" alt="' + esc(alt || "이미지 미리보기") + '" loading="lazy">';
  };

  var sections = {
    dashboard: {
      title: "대시보드",
      icon: "ri-dashboard-3-line",
      dashboard: true,
      meta: function () { return "관리자 요약"; },
      groups: []
    },
    mainHero: {
      title: "메인 히어로",
      icon: "ri-slideshow-3-line",
      meta: function (item) { return [item.eyebrow, item.mediaType].filter(Boolean).join(" / "); },
      groups: [
        {
          title: "슬라이드 문구",
          desc: "프론트 히어로 슬라이드에 그대로 노출되는 문구입니다.",
          fields: [
            { name: "enabled", label: "노출", type: "checkbox" },
            { name: "eyebrow", label: "영문 라벨", type: "text" },
            { name: "title", label: "메인 문구", type: "text", wide: true },
            { name: "alt", label: "대체 텍스트", type: "text", wide: true }
          ]
        },
        {
          title: "히어로 미디어",
          desc: "비디오 또는 이미지를 선택하고 경로를 관리합니다.",
          fields: [
            { name: "mediaType", label: "미디어 타입", type: "select", options: [["video", "Video"], ["image", "Image"]] },
            { name: "media", label: "미디어 경로", type: "asset", wide: true }
          ]
        }
      ]
    },
    developmentItems: {
      title: "개발품목",
      icon: "ri-tools-line",
      meta: function (item) { return item.eyebrow || item.href || ""; },
      groups: [
        {
          title: "목록 카드",
          desc: "메인 개발품목 슬라이드와 개발품목 목록에 노출되는 카드 정보입니다.",
          fields: [
            { name: "enabled", label: "노출", type: "checkbox" },
            { name: "eyebrow", label: "카드 라벨", type: "text" },
            { name: "title", label: "카드 타이틀", type: "text" },
            { name: "image", label: "카드 이미지", type: "asset", wide: true },
            { name: "alt", label: "대체 텍스트", type: "text", wide: true },
            { name: "href", label: "상세 링크", type: "text", wide: true },
            { name: "external", label: "새 창 링크", type: "checkbox" }
          ]
        },
        {
          title: "상세페이지 상단",
          desc: "상세페이지 대표 이미지, 리드 문장, 요약 본문을 관리합니다.",
          fields: [
            { name: "visualImage", label: "상세 대표 이미지", type: "asset", wide: true },
            { name: "detailEyebrow", label: "상세 영문 라벨", type: "text" },
            { name: "detailTitle", label: "상세 제목", type: "text" },
            { name: "lead", label: "리드 문장", type: "text", wide: true },
            { name: "summary", label: "요약 본문", type: "textarea", wide: true }
          ]
        },
        {
          title: "제품 개요와 갤러리",
          desc: "상세페이지 제품 개요 카드와 썸네일 갤러리에 반영됩니다.",
          fields: [
            { name: "gallery", label: "상세 갤러리 이미지", type: "gallery", wide: true },
            { name: "overviewTitle", label: "개요 제목", type: "text" },
            { name: "overviewDescription", label: "개요 설명", type: "textarea", wide: true },
            { name: "bullets", label: "핵심 bullet", type: "list", wide: true }
          ]
        },
        {
          title: "사양표",
          desc: "상세페이지 구성/사양 영역의 표 데이터입니다.",
          fields: [
            { name: "specEyebrow", label: "사양 라벨", type: "text" },
            { name: "specTitle", label: "사양 제목", type: "text" },
            { name: "specs", label: "사양 항목", type: "pairs", wide: true }
          ]
        },
        {
          title: "적용 포인트",
          desc: "상세페이지 하단 카드형 포인트를 추가하거나 삭제할 수 있습니다.",
          fields: [
            { name: "featureEyebrow", label: "포인트 라벨", type: "text" },
            { name: "featureTitle", label: "포인트 제목", type: "text" },
            { name: "features", label: "포인트 카드", type: "cards", wide: true }
          ]
        }
      ]
    },
    handledItems: {
      title: "공급품목",
      icon: "ri-box-3-line",
      meta: function (item) { return [handledCountryDisplay(item), item.category].filter(Boolean).join(" / "); },
      groups: [
        {
          title: "브랜드 카드",
          desc: "공급품목 페이지와 메인 공급품목 슬라이드에 동일하게 반영됩니다.",
          fields: [
            { name: "enabled", label: "노출", type: "checkbox" },
            { name: "title", label: "브랜드명", type: "text" },
            { name: "country", label: "제조 국가 라벨", type: "countrySelect" },
            { name: "category", label: "카테고리 뱃지", type: "text" },
            { name: "description", label: "주요 품목", type: "textarea", wide: true },
            { name: "image", label: "썸네일 이미지", type: "asset", wide: true }
          ]
        },
        {
          title: "라이트박스 갤러리",
          desc: "썸네일 클릭 시 한 장씩 슬라이드 되는 이미지입니다.",
          fields: [
            { name: "gallery", label: "갤러리 이미지", type: "gallery", wide: true }
          ]
        },
        {
          title: "웹사이트 링크",
          desc: "카드 하단 웹사이트 버튼에 연결됩니다.",
          fields: [
            { name: "href", label: "웹사이트 링크", type: "text", wide: true },
            { name: "external", label: "새 창 링크", type: "checkbox" }
          ]
        }
      ]
    },
    customers: {
      title: "고객사",
      icon: "ri-building-4-line",
      meta: function (item) { return item.row === "bottom" ? "하단 마퀴" : "상단 마퀴"; },
      groups: [
        {
          title: "고객사 로고",
          desc: "메인 고객사 마퀴와 고객사 페이지의 로고 목록에 반영됩니다.",
          fields: [
            { name: "enabled", label: "노출", type: "checkbox" },
            { name: "name", label: "고객사명", type: "text" },
            { name: "row", label: "메인 마퀴 줄", type: "select", options: [["top", "상단"], ["bottom", "하단"]] },
            { name: "image", label: "로고 이미지", type: "asset", wide: true },
            { name: "alt", label: "대체 텍스트", type: "text", wide: true }
          ]
        }
      ]
    },
    resources: {
      title: "자료실",
      icon: "ri-file-list-3-line",
      meta: function (item) { return [item.category === "catalog" ? "카탈로그 자료" : "도면자료", item.type, item.fileName].filter(Boolean).join(" / "); },
      groups: [
        {
          title: "자료 카드",
          desc: "자료실 카드의 제목, 내용, 파일 확장자 배지에 반영됩니다.",
          fields: [
            { name: "enabled", label: "노출", type: "checkbox" },
            { name: "category", label: "자료 카테고리", type: "select", options: [["drawing", "도면자료"], ["catalog", "카탈로그 자료"]] },
            { name: "title", label: "제목", type: "text", wide: true },
            { name: "summary", label: "내용", type: "textarea", wide: true }
          ]
        },
        {
          title: "첨부 파일",
          desc: "첨부한 파일명과 확장자는 자동으로 저장됩니다.",
          fields: [
            { name: "fileUrl", label: "첨부 파일", type: "downloadFile", wide: true }
          ]
        }
      ]
    },
    notices: {
      title: "공지사항",
      icon: "ri-notification-3-line",
      meta: function (item) { return item.title || "공지사항"; },
      groups: [
        {
          title: "공지 기본 정보",
          desc: "공지사항 목록과 상세 본문에 반영되는 핵심 정보입니다.",
          fields: [
            { name: "enabled", label: "노출", type: "checkbox" },
            { name: "title", label: "제목", type: "text", wide: true }
          ]
        },
        {
          title: "공지 내용",
          desc: "에디터 라이브러리로 본문 서식과 리스트를 작성합니다. 백엔드 연결 전까지 현재 브라우저 DB에 저장됩니다.",
          fields: [
            { name: "content", label: "내용 입력", type: "richtext", wide: true }
          ]
        }
      ]
    },
    contactForms: {
      title: "컨택폼",
      icon: "ri-mail-send-line",
      canCreate: false,
      meta: function (item) { return [statusLabel(item.status), item.company, item.receivedAt].filter(Boolean).join(" / "); },
      groups: [
        {
          title: "접수 정보",
          desc: "프론트 문의 폼에서 접수된 기본 정보입니다.",
          fields: [
            { name: "enabled", label: "보관", type: "checkbox" },
            { name: "status", label: "처리 상태", type: "select", options: [["new", "신규"], ["checking", "검토중"], ["done", "완료"], ["hold", "보류"]] },
            { name: "source", label: "유입 화면", type: "select", options: [["main", "메인페이지"], ["contact", "견적문의 페이지"], ["manual", "관리자 직접 입력"]] },
            { name: "receivedAt", label: "접수 일시", type: "text", wide: true }
          ]
        },
        {
          title: "문의자 정보",
          desc: "연락 및 회신에 필요한 입력값입니다.",
          fields: [
            { name: "name", label: "담당자 이름", type: "text" },
            { name: "company", label: "회사명", type: "text" },
            { name: "phone", label: "연락처", type: "text" },
            { name: "email", label: "이메일", type: "text" }
          ]
        },
        {
          title: "문의 내용",
          desc: "문의 품목, 상세 내용, 첨부파일명을 관리합니다.",
          fields: [
            { name: "item", label: "문의 품목", type: "text", wide: true },
            { name: "content", label: "문의 내용", type: "textarea", wide: true },
            { name: "fileName", label: "첨부파일명", type: "text" },
            { name: "filePath", label: "첨부파일 경로", type: "text" },
            { name: "agree", label: "개인정보 수집 및 이용 동의", type: "checkbox" },
            { name: "memo", label: "관리자 메모", type: "textarea", wide: true }
          ]
        }
      ]
    }
  };

  var templates = {
    mainHero: {
      enabled: true,
      eyebrow: "NEW HERO",
      title: "새 메인 히어로 문구",
      mediaType: "video",
      media: "assets/images/dpd/main-hero-01.mp4",
      alt: "새 메인 히어로"
    },
    developmentItems: {
      enabled: true,
      eyebrow: "NEW DEVELOPMENT",
      title: "신규 개발품목",
      image: "assets/images/dpd/202608/index-table-system.jpg",
      alt: "신규 개발품목",
      href: "kr/product/index-table.html#content",
      external: false,
      visualImage: "assets/images/dpd/202608/index-table-system.jpg",
      detailEyebrow: "NEW DEVELOPMENT",
      detailTitle: "신규 개발품목",
      lead: "개발품목 상세 리드 문장을 입력하세요.",
      summary: "개발품목 상세 설명을 입력하세요.",
      gallery: ["assets/images/dpd/202608/index-table-system.jpg"],
      overviewTitle: "제품 개요",
      overviewDescription: "제품 개요 설명을 입력하세요.",
      bullets: ["핵심 특징을 입력하세요."],
      specEyebrow: "SYSTEM CONFIGURATION",
      specTitle: "주요 사양",
      specs: [{ label: "항목", value: "내용" }],
      featureEyebrow: "KEY POINTS",
      featureTitle: "적용 포인트",
      features: [{ title: "포인트", text: "설명을 입력하세요." }]
    },
    handledItems: {
      enabled: true,
      title: "NEW ITEM",
      country: "korea",
      countryLabel: "KOREA",
      category: "구동·제어",
      description: "주요 품목을 입력하세요.",
      image: "assets/images/dpd/live-items/handled-han-drive.jpg",
      gallery: ["assets/images/dpd/live-items/handled-han-drive.jpg"],
      href: "#",
      external: false
    },
    customers: {
      enabled: true,
      row: "top",
      name: "New Customer",
      image: "assets/images/partner/sansung-display.svg",
      alt: "New Customer"
    },
    resources: {
      enabled: true,
      category: "drawing",
      type: "PDF",
      title: "신규 자료",
      summary: "자료 설명을 입력하세요.",
      fileUrl: "assets/downloads/catalog/dongwoo-robot-catalog.pdf",
      fileName: "download.pdf"
    },
    notices: {
      enabled: true,
      date: "2026.08.27",
      title: "신규 공지사항",
      summary: "공지 요약을 입력하세요.",
      href: "kr/pr/notice.html#content",
      content: "<p>공지 내용을 입력하세요.</p>"
    }
  };

  var notify = function (message, type) {
    var toast = q("#cmsToast");
    if (!toast) return;
    type = type || "success";
    toast.textContent = message;
    toast.classList.remove("is-info", "is-success", "is-danger", "is-error");
    toast.classList.add("is-active", "is-" + type);
    toast.setAttribute("role", type === "error" || type === "danger" ? "alert" : "status");
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(function () {
      toast.classList.remove("is-active", "is-info", "is-success", "is-danger", "is-error");
    }, type === "error" || type === "danger" ? 2600 : 1800);
  };

  var loginForm = q("#cmsLoginForm");
  if (loginForm) {
    if (store.isLoggedIn()) window.location.href = "index.html";
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var id = q("#cmsLoginId").value.trim();
      var password = q("#cmsLoginPassword").value;
      if (store.login(id, password)) {
        window.location.href = "index.html";
        return;
      }
      var error = q("#cmsLoginError");
      if (error) error.textContent = "";
      notify("아이디 또는 비밀번호가 올바르지 않습니다.", "error");
    });
    return;
  }

  var appRoot = q(".cms-shell");
  if (!appRoot) return;

  if (!store.isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  var database = store.getData();
  var params = new URLSearchParams(window.location.search);
  var sectionKeys = Object.keys(sections);
  var isEditPage = Boolean(q("#cmsEditorForm"));
  var isNewMode = params.get("mode") === "new";
  var requestedSection = params.get("section");
  var activeSection = sectionKeys.indexOf(requestedSection) >= 0 ? requestedSection : "dashboard";
  var activeIndex = Math.max(Number(params.get("index") || 0), 0);
  var uploadSeed = 0;
  var galleryDragItem = null;

  var sectionButtons = qa("[data-cms-section]");
  var itemList = q("#cmsItemList");
  var pagination = q("#cmsPagination");
  var editorFields = q("#cmsEditorFields");
  var editorForm = q("#cmsEditorForm");
  var pageTitle = q("#cmsPageTitle");
  var listTitle = q("#cmsListTitle");
  var editorTitle = q("#cmsEditorTitle");
  var jsonPanel = q("#cmsJsonPanel");
  var jsonData = q("#cmsJsonData");
  var addLink = q("#cmsAddLink");
  var backLink = q("#cmsBackLink");
  var dashboardPanel = q("#cmsDashboardPanel");
  var listGrid = q("#cmsListPanel");
  var listControls = q("#cmsListControls");
  var listSearch = q("#cmsListSearch");
  var stateFilter = q("#cmsStateFilter");
  var metaFilter = q("#cmsMetaFilter");
  var metaFilterGroup = q("#cmsMetaFilterGroup");
  var bulkBar = q("#cmsBulkBar");
  var selectAll = q("#cmsSelectAll");
  var selectedCount = q("#cmsSelectedCount");
  var bulkAction = q("#cmsBulkAction");
  var bulkApplyButton = q("#cmsBulkApplyBtn");
  var countryManager = q("#cmsCountryManager");
  var countryInput = q("#cmsCountryInput");
  var countryAddButton = q("#cmsCountryAddBtn");
  var countryList = q("#cmsCountryList");
  var listFilters = { search: "", state: "all", meta: "all" };
  var selectedIndexes = [];
  var visibleIndexes = [];
  var currentPage = 1;
  var pageSize = 10;

  var listUrl = function (sectionKey) {
    return "index.html?section=" + encodeURIComponent(sectionKey || activeSection);
  };

  var editUrl = function (sectionKey, index) {
    return "edit.html?section=" + encodeURIComponent(sectionKey || activeSection) + "&index=" + encodeURIComponent(index);
  };

  var newUrl = function (sectionKey) {
    return "edit.html?section=" + encodeURIComponent(sectionKey || activeSection) + "&mode=new";
  };

  var setSectionUrl = function () {
    if (isEditPage) return;
    var url = listUrl(activeSection);
    if (window.location.search !== "?" + url.split("?")[1]) {
      window.history.replaceState(null, "", url);
    }
  };

  var statusLabel = function (status) {
    var map = {
      new: "신규",
      checking: "검토중",
      done: "완료",
      hold: "보류"
    };
    return map[status] || status || "신규";
  };

  var dateLabel = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return [year, month, day].join(".");
  };

  var noticeSummary = function (content, title) {
    var text = String(content || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return (text || title || "").slice(0, 90);
  };

  var renderDashboard = function () {
    if (!dashboardPanel) return;
    var isDashboard = activeSection === "dashboard";
    dashboardPanel.hidden = !isDashboard;
    if (listGrid) listGrid.hidden = isDashboard;
    if (!isDashboard) return;

    var cards = Object.keys(sections).filter(function (key) {
      return key !== "dashboard";
    }).map(function (key) {
      var section = sections[key];
      var items = database.collections[key] || [];
      var enabledCount = items.filter(function (item) { return item && item.enabled !== false; }).length;
      var enabledLabel = key === "contactForms" ? "보관" : "노출";
      return [
        '<a class="cms-dashboard-card" href="' + esc(listUrl(key)) + '">',
        '  <span class="cms-dashboard-card-icon"><i class="' + esc(section.icon) + '" aria-hidden="true"></i></span>',
        '  <span class="cms-dashboard-card-title">' + esc(section.title) + '</span>',
        '  <strong>' + esc(items.length) + '</strong>',
        '  <span class="cms-dashboard-card-meta">' + esc(enabledLabel) + ' ' + esc(enabledCount) + '건</span>',
        '</a>'
      ].join("");
    }).join("");

    var contacts = (database.collections.contactForms || []).slice().reverse().slice(0, 5);
    var notices = (database.collections.notices || []).slice(0, 4);

    dashboardPanel.innerHTML = [
      '<div class="cms-dashboard-grid">' + cards + '</div>',
      '<div class="cms-dashboard-columns">',
      '  <article class="cms-panel cms-dashboard-panel">',
      '    <div class="cms-dashboard-panel-head"><h2>최근 문의</h2><a href="' + esc(listUrl("contactForms")) + '">전체보기 <i class="ri-arrow-right-line" aria-hidden="true"></i></a></div>',
      '    <div class="cms-dashboard-feed">',
      contacts.length ? contacts.map(function (item, index) {
        return '<a class="cms-dashboard-feed-item" href="' + esc(editUrl("contactForms", (database.collections.contactForms || []).length - 1 - index)) + '"><span>' + esc(statusLabel(item.status)) + '</span><strong>' + esc(item.company || item.name || "문의자") + '</strong><em>' + esc(item.item || item.receivedAt || "") + '</em></a>';
      }).join("") : '<p class="cms-empty-text">아직 접수된 문의가 없습니다.</p>',
      '    </div>',
      '  </article>',
      '  <article class="cms-panel cms-dashboard-panel">',
      '    <div class="cms-dashboard-panel-head"><h2>최근 공지사항</h2><a href="' + esc(listUrl("notices")) + '">전체보기 <i class="ri-arrow-right-line" aria-hidden="true"></i></a></div>',
      '    <div class="cms-dashboard-feed">',
      notices.length ? notices.map(function (item, index) {
        return '<a class="cms-dashboard-feed-item" href="' + esc(editUrl("notices", index)) + '"><span>' + esc(item.date || "") + '</span><strong>' + esc(item.title || "공지사항") + '</strong><em>' + esc(item.summary || "") + '</em></a>';
      }).join("") : '<p class="cms-empty-text">공지사항 데이터가 없습니다.</p>',
      '    </div>',
      '  </article>',
      '</div>'
    ].join("");
  };

  var getItems = function () {
    return database.collections[activeSection] || [];
  };

  var setItems = function (items) {
    database.collections[activeSection] = items;
  };

  var getEditorItem = function () {
    if (isNewMode) return store.clone(templates[activeSection]);
    var items = getItems();
    return items[activeIndex] || items[0] || null;
  };

  var getPrimaryLabel = function (item) {
    return item.title || item.name || item.eyebrow || item.id || "Untitled";
  };

  var normalizeKeyword = function (value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  };

  var isEnabled = function (item) {
    return !item || item.enabled !== false;
  };

  var statusText = function (item) {
    if (activeSection === "contactForms") return isEnabled(item) ? "보관" : "미보관";
    return isEnabled(item) ? "노출" : "숨김";
  };

  var actionText = function () {
    if (activeSection === "contactForms") {
      return {
        all: "전체 보관 상태",
        enabled: "보관",
        disabled: "미보관",
        enable: "선택 항목 보관",
        disable: "선택 항목 미보관",
        enableDone: "선택 항목을 보관 처리했습니다.",
        disableDone: "선택 항목을 미보관 처리했습니다."
      };
    }
    return {
      all: "전체 노출 상태",
      enabled: "노출",
      disabled: "숨김",
      enable: "선택 항목 노출",
      disable: "선택 항목 숨김",
      enableDone: "선택 항목을 노출 처리했습니다.",
      disableDone: "선택 항목을 숨김 처리했습니다."
    };
  };

  var renderStateFilterOptions = function () {
    if (!stateFilter) return;
    var labels = actionText();
    stateFilter.innerHTML = [
      '<option value="all">' + esc(labels.all) + '</option>',
      '<option value="enabled">' + esc(labels.enabled) + '</option>',
      '<option value="disabled">' + esc(labels.disabled) + '</option>'
    ].join("");
    if (["all", "enabled", "disabled"].indexOf(listFilters.state) < 0) listFilters.state = "all";
    stateFilter.value = listFilters.state;
  };

  var renderBulkActionOptions = function () {
    if (!bulkAction) return;
    var labels = actionText();
    var value = bulkAction.value;
    bulkAction.innerHTML = [
      '<option value="">벌크 액션 선택</option>',
      '<option value="enable">' + esc(labels.enable) + '</option>',
      '<option value="disable">' + esc(labels.disable) + '</option>',
      '<option value="delete">선택 항목 삭제</option>'
    ].join("");
    bulkAction.value = ["enable", "disable", "delete"].indexOf(value) >= 0 ? value : "";
  };

  var setButtonVariant = function (button, variant) {
    if (!button) return;
    button.classList.remove("cms-button--ghost", "cms-button--info", "cms-button--success", "cms-button--danger", "cms-button--error");
    if (variant) button.classList.add("cms-button--" + variant);
  };

  var syncBulkActionButton = function () {
    if (!bulkApplyButton || !bulkAction) return;
    if (bulkAction.value === "delete") {
      setButtonVariant(bulkApplyButton, "danger");
      return;
    }
    if (bulkAction.value === "enable") {
      setButtonVariant(bulkApplyButton, "success");
      return;
    }
    if (bulkAction.value === "disable") {
      setButtonVariant(bulkApplyButton, "info");
      return;
    }
    setButtonVariant(bulkApplyButton, "ghost");
  };

  var normalizeCountryLabel = function (value) {
    return String(value || "")
      .replace(/^made\s+in\s+/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  };

  var countryValueFromLabel = function (label) {
    return normalizeCountryLabel(label)
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "") || "country";
  };

  var countryLabelFromItem = function (item) {
    if (!item) return "";
    return normalizeCountryLabel(item.countryLabel || item.countryName || item.eyebrow || item.country || "");
  };

  var ensureHandledCountryOptions = function () {
    database.settings = database.settings || {};
    var options = Array.isArray(database.settings.handledCountryOptions) ? database.settings.handledCountryOptions : [];
    var byValue = {};

    options.forEach(function (option) {
      var label = normalizeCountryLabel(option && option.label || option && option.value);
      if (!label) return;
      var value = countryValueFromLabel(option && option.value || label);
      byValue[value] = { value: value, label: label };
    });

    (database.collections.handledItems || []).forEach(function (item) {
      var label = countryLabelFromItem(item);
      var value = countryValueFromLabel(item && item.country || label);
      if (!label && value) label = normalizeCountryLabel(value);
      if (label && !byValue[value]) byValue[value] = { value: value, label: label };
    });

    database.settings.handledCountryOptions = Object.keys(byValue).map(function (value) {
      return byValue[value];
    }).sort(function (a, b) {
      return a.label.localeCompare(b.label, "ko");
    });
    return database.settings.handledCountryOptions;
  };

  var getHandledCountryOptions = function () {
    return ensureHandledCountryOptions();
  };

  var getHandledCountryOption = function (value) {
    value = countryValueFromLabel(value);
    return getHandledCountryOptions().find(function (option) {
      return option.value === value;
    }) || null;
  };

  var handledCountryDisplay = function (item) {
    var option = getHandledCountryOption(item && item.country);
    var label = option && option.label || countryLabelFromItem(item);
    return label ? "MADE IN " + label : "";
  };

  var handledCountryValue = function (item) {
    var option = getHandledCountryOption(item && item.country);
    return option && option.value || countryValueFromLabel(countryLabelFromItem(item));
  };

  var syncHandledCountryFields = function (item) {
    var option = getHandledCountryOption(item && item.country) || getHandledCountryOptions()[0];
    if (!item || !option) return item;
    item.country = option.value;
    item.countryLabel = option.label;
    item.eyebrow = option.label;
    return item;
  };

  var usedHandledCountryValues = function () {
    return (database.collections.handledItems || []).map(function (item) {
      return handledCountryValue(item);
    }).filter(Boolean);
  };

  var filterLabel = function (value) {
    var map = {
      video: "Video",
      image: "Image",
      china: "CHINA",
      korea: "KOREA",
      germany: "GERMANY",
      japan: "JAPAN",
      top: "상단 마퀴",
      bottom: "하단 마퀴",
      drawing: "도면자료",
      catalog: "카탈로그 자료",
      new: "신규",
      checking: "검토중",
      done: "완료",
      hold: "보류"
    };
    var countryOption = getHandledCountryOption(value);
    if (countryOption) return countryOption.label;
    return map[value] || value;
  };

  var getMetaFilterValue = function (item) {
    if (!item) return "";
    if (activeSection === "mainHero") return item.mediaType || "";
    if (activeSection === "developmentItems") return item.eyebrow || "";
    if (activeSection === "handledItems") return item.country || "";
    if (activeSection === "customers") return item.row || "";
    if (activeSection === "resources") return item.category || "";
    if (activeSection === "contactForms") return item.status || "";
    return "";
  };

  var sectionMeta = function (section, item) {
    return section && section.meta ? section.meta(item || {}) : "";
  };

  var listHaystack = function (section, item) {
    return [
      getPrimaryLabel(item || {}),
      sectionMeta(section, item),
      item && item.summary,
      item && item.description,
      item && item.countryLabel,
      item && item.company,
      item && item.email,
      item && item.phone,
      item && item.item,
      item && item.content,
      item && item.href,
      item && item.fileName
    ].filter(Boolean).join(" ");
  };

  var resetListUiState = function () {
    listFilters = { search: "", state: "all", meta: "all" };
    selectedIndexes = [];
    visibleIndexes = [];
    currentPage = 1;
    if (listSearch) listSearch.value = "";
    if (stateFilter) stateFilter.value = "all";
    if (metaFilter) metaFilter.value = "all";
    if (bulkAction) bulkAction.value = "";
  };

  var setSelectedIndex = function (index, checked) {
    index = Number(index);
    selectedIndexes = selectedIndexes.filter(function (value) { return value !== index; });
    if (checked) selectedIndexes.push(index);
    selectedIndexes.sort(function (a, b) { return a - b; });
  };

  var setMetaFilterOptions = function (items) {
    if (!metaFilter || !metaFilterGroup) return;
    var values = [];
    items.forEach(function (item) {
      var value = getMetaFilterValue(item);
      if (value && values.indexOf(value) < 0) values.push(value);
    });

    if (!values.length) {
      metaFilterGroup.hidden = true;
      metaFilter.innerHTML = '<option value="all">전체 구분</option>';
      listFilters.meta = "all";
      metaFilter.value = "all";
      return;
    }

    values.sort(function (a, b) {
      return filterLabel(a).localeCompare(filterLabel(b), "ko");
    });
    metaFilterGroup.hidden = false;
    metaFilter.innerHTML = '<option value="all">전체 구분</option>' + values.map(function (value) {
      return '<option value="' + esc(value) + '">' + esc(filterLabel(value)) + '</option>';
    }).join("");

    if (values.indexOf(listFilters.meta) < 0) listFilters.meta = "all";
    metaFilter.value = listFilters.meta;
  };

  var renderCountryManager = function () {
    if (!countryManager || !countryList) return;
    var isHandled = activeSection === "handledItems" && !isEditPage;
    countryManager.hidden = !isHandled;
    if (!isHandled) return;

    var usedValues = usedHandledCountryValues();
    countryList.innerHTML = getHandledCountryOptions().map(function (option) {
      var count = usedValues.filter(function (value) { return value === option.value; }).length;
      var inUse = count > 0;
      return [
        '<span class="cms-option-chip" data-country-value="' + esc(option.value) + '">',
        '  <span><strong>' + esc(option.label) + '</strong><em>' + esc(count) + '개 품목</em></span>',
        '  <button type="button" data-cms-remove-country="' + esc(option.value) + '"' + (inUse ? ' aria-disabled="true"' : "") + ' aria-label="' + esc(option.label) + ' 삭제">',
        '    <i class="ri-close-line" aria-hidden="true"></i>',
        '  </button>',
        '</span>'
      ].join("");
    }).join("");
  };

  var addHandledCountryOption = function () {
    if (!countryInput) return;
    var label = normalizeCountryLabel(countryInput.value);
    if (!label) {
      notify("추가할 제조 국가 라벨을 입력해주세요.", "error");
      return;
    }

    var value = countryValueFromLabel(label);
    if (getHandledCountryOption(value)) {
      notify("이미 등록된 제조 국가 라벨입니다.", "error");
      return;
    }

    database.settings = database.settings || {};
    database.settings.handledCountryOptions = getHandledCountryOptions().concat([{ value: value, label: label }]);
    countryInput.value = "";
    persist("제조 국가 라벨을 추가했습니다.");
    render();
  };

  var removeHandledCountryOption = function (value) {
    var option = getHandledCountryOption(value);
    if (!option) return;
    if (usedHandledCountryValues().indexOf(option.value) >= 0) {
      notify("해당 국가를 사용하는 공급품목이 있어 삭제할 수 없습니다. 먼저 품목의 제조 국가를 변경해주세요.", "error");
      return;
    }

    database.settings.handledCountryOptions = getHandledCountryOptions().filter(function (item) {
      return item.value !== option.value;
    });
    persist("제조 국가 라벨을 삭제했습니다.", "danger");
    render();
  };

  var getFilteredRows = function (items, section) {
    var keyword = normalizeKeyword(listFilters.search);
    return items.map(function (item, index) {
      return { item: item, index: index };
    }).filter(function (row) {
      if (listFilters.state === "enabled" && !isEnabled(row.item)) return false;
      if (listFilters.state === "disabled" && isEnabled(row.item)) return false;
      if (listFilters.meta !== "all" && getMetaFilterValue(row.item) !== listFilters.meta) return false;
      if (keyword && normalizeKeyword(listHaystack(section, row.item)).indexOf(keyword) < 0) return false;
      return true;
    });
  };

  var pageCount = function (total) {
    return Math.max(Math.ceil(total / pageSize), 1);
  };

  var clampPage = function (total) {
    currentPage = Math.min(Math.max(currentPage, 1), pageCount(total));
  };

  var getPagedRows = function (rows) {
    clampPage(rows.length);
    var start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  };

  var renderPagination = function (total) {
    if (!pagination) return;
    if (!total) {
      pagination.hidden = true;
      pagination.innerHTML = "";
      return;
    }

    var totalPages = pageCount(total);
    var from = (currentPage - 1) * pageSize + 1;
    var to = Math.min(currentPage * pageSize, total);
    var start = Math.max(1, currentPage - 2);
    var end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    var numbers = [];
    for (var page = start; page <= end; page += 1) {
      numbers.push(page);
    }

    pagination.hidden = false;
    pagination.innerHTML = [
      '<div class="cms-pagination-info">총 ' + esc(total) + '건 · ' + esc(from) + '-' + esc(to) + ' 표시</div>',
      '<div class="cms-pagination-controls">',
      '  <button class="cms-page-button" type="button" data-cms-page="first"' + (currentPage === 1 ? " disabled" : "") + ' aria-label="첫 페이지"><i class="ri-skip-left-line" aria-hidden="true"></i></button>',
      '  <button class="cms-page-button" type="button" data-cms-page="prev"' + (currentPage === 1 ? " disabled" : "") + ' aria-label="이전 페이지"><i class="ri-arrow-left-s-line" aria-hidden="true"></i></button>',
      numbers.map(function (page) {
        return '<button class="cms-page-button' + (page === currentPage ? " is-active" : "") + '" type="button" data-cms-page="' + page + '"' + (page === currentPage ? ' aria-current="page"' : "") + '>' + page + '</button>';
      }).join(""),
      '  <button class="cms-page-button" type="button" data-cms-page="next"' + (currentPage === totalPages ? " disabled" : "") + ' aria-label="다음 페이지"><i class="ri-arrow-right-s-line" aria-hidden="true"></i></button>',
      '  <button class="cms-page-button" type="button" data-cms-page="last"' + (currentPage === totalPages ? " disabled" : "") + ' aria-label="마지막 페이지"><i class="ri-skip-right-line" aria-hidden="true"></i></button>',
      '</div>'
    ].join("");
  };

  var goToPage = function (target) {
    var rows = getFilteredRows(getItems(), sections[activeSection] || {});
    var totalPages = pageCount(rows.length);
    if (target === "first") currentPage = 1;
    else if (target === "prev") currentPage -= 1;
    else if (target === "next") currentPage += 1;
    else if (target === "last") currentPage = totalPages;
    else currentPage = Number(target) || 1;
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    renderList();
  };

  var updateSelectionState = function () {
    selectedIndexes = selectedIndexes.filter(function (index) {
      return getItems()[index];
    });
    if (selectedCount) selectedCount.textContent = selectedIndexes.length + "개 선택";
    if (selectAll) {
      var selectedVisible = visibleIndexes.filter(function (index) {
        return selectedIndexes.indexOf(index) >= 0;
      }).length;
      selectAll.disabled = !visibleIndexes.length;
      selectAll.checked = Boolean(visibleIndexes.length && selectedVisible === visibleIndexes.length);
      selectAll.indeterminate = Boolean(selectedVisible && selectedVisible < visibleIndexes.length);
    }
    if (bulkApplyButton) {
      bulkApplyButton.disabled = !selectedIndexes.length || !bulkAction || !bulkAction.value;
    }
    syncBulkActionButton();
  };

  var statusBadgeMarkup = function (item) {
    return '<span class="cms-state-badge' + (isEnabled(item) ? "" : " is-off") + '">' + esc(statusText(item)) + '</span>';
  };

  var applyBulkAction = function () {
    if (!bulkAction || !bulkAction.value) {
      notify("벌크 액션을 선택해주세요.", "error");
      return;
    }
    if (!selectedIndexes.length) {
      notify("먼저 항목을 선택해주세요.", "error");
      return;
    }

    var items = getItems();
    var action = bulkAction.value;
    var labels = actionText();
    var indexes = selectedIndexes.slice().filter(function (index) {
      return items[index];
    });
    if (!indexes.length) {
      selectedIndexes = [];
      updateSelectionState();
      return;
    }

    if (action === "delete") {
      if (!window.confirm("선택한 " + indexes.length + "개 항목을 삭제할까요?")) return;
      indexes.sort(function (a, b) { return b - a; }).forEach(function (index) {
        items.splice(index, 1);
      });
      selectedIndexes = [];
      setItems(items);
      persist("선택 항목을 삭제했습니다.", "danger");
      render();
      return;
    }

    indexes.forEach(function (index) {
      items[index].enabled = action === "enable";
    });
    selectedIndexes = [];
    setItems(items);
    persist(action === "enable" ? labels.enableDone : labels.disableDone);
    render();
  };

  var persist = function (message, type) {
    database = store.saveData(database);
    if (jsonPanel && jsonData && jsonPanel.classList.contains("is-open")) {
      jsonData.value = JSON.stringify(database, null, 2);
    }
    notify(message || "저장되었습니다. 열려 있는 프론트 화면은 자동 새로고침됩니다.", type || "success");
  };

  var allFields = function (section) {
    return (section.groups || []).reduce(function (fields, group) {
      return fields.concat(group.fields || []);
    }, []);
  };

  var nextUploadId = function (name) {
    uploadSeed += 1;
    return ["cmsUpload", activeSection, activeIndex, name, uploadSeed].join("_").replace(/[^\w-]/g, "_");
  };

  var assetNameFromValue = function (value) {
    value = String(value || "").trim();
    if (!value) return "선택된 파일 없음";
    if (/^data:/i.test(value)) return "첨부된 로컬 파일";
    return value.split(/[?#]/)[0].split(/[\\/]/).pop() || "첨부된 파일";
  };

  var fileTypeFromSource = function (fileName, fileUrl, mimeType, fallback) {
    var source = String(fileName || fileUrl || "").split(/[?#]/)[0];
    var extension = (source.split(".").pop() || "").trim();

    if (!extension || extension === source) {
      var dataMatch = String(fileUrl || "").match(/^data:([^;,]+)/i);
      var mime = String(mimeType || (dataMatch && dataMatch[1]) || "").toLowerCase();
      var mimeMap = {
        "application/pdf": "pdf",
        "application/zip": "zip",
        "application/x-zip-compressed": "zip",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "application/vnd.ms-powerpoint": "ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        "text/plain": "txt",
        "text/csv": "csv"
      };
      extension = mimeMap[mime] || "";
    }

    return String(extension || fallback || "ETC").replace(/[^a-z0-9]/gi, "").toUpperCase() || "ETC";
  };

  var uploadPathFromFileName = function (fileName) {
    var safeName = String(fileName || "download")
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return "assets/downloads/uploads/" + Date.now() + "-" + (safeName || "download");
  };

  var fileUploadMarkup = function (options) {
    var inputId = nextUploadId(options.name || "asset");
    var accept = options.accept === undefined ? "image/*" : options.accept;
    var acceptAttr = accept ? ' accept="' + esc(accept) + '"' : "";
    return [
      '<div class="cms-file-upload">',
      '  <input class="cms-file-input" type="file" id="' + esc(inputId) + '"' + acceptAttr + (options.multiple ? " multiple" : "") + ' data-cms-file-upload>',
      '  <label class="cms-button cms-button--ghost cms-file-trigger" for="' + esc(inputId) + '"><i class="ri-upload-2-line" aria-hidden="true"></i><span>파일 선택</span></label>',
      '  <span class="cms-file-name" data-cms-file-name>' + esc(assetNameFromValue(options.value)) + '</span>',
      '</div>'
    ].join("");
  };

  var downloadFileMarkup = function (field, item) {
    var fileUrl = item.fileUrl || "";
    var fileName = item.fileName || assetNameFromValue(fileUrl);
    var fileType = fileTypeFromSource(fileName, fileUrl, "", item.type);

    return [
      '<div class="cms-download-file-field" data-cms-download-field data-field-name="' + esc(field.name) + '">',
      '  <input type="hidden" name="fileUrl" value="' + esc(fileUrl) + '" data-cms-download-url>',
      '  <input type="hidden" name="fileName" value="' + esc(fileUrl ? fileName : "") + '" data-cms-download-name>',
      '  <input type="hidden" name="type" value="' + esc(fileType) + '" data-cms-download-type>',
      '  <div class="cms-download-file-info">',
      '    <span class="cms-download-file-type" data-cms-download-type-label>' + esc(fileType) + '</span>',
      '    <strong data-cms-download-file-label>' + esc(fileName) + '</strong>',
      '    <p>파일을 첨부하면 확장자와 다운로드 파일명이 자동 입력됩니다.</p>',
      '  </div>',
      '  ' + fileUploadMarkup({ name: field.name, value: fileName, accept: "" }),
      '  <button class="cms-button cms-button--danger" type="button" data-cms-clear-download><i class="ri-delete-bin-line" aria-hidden="true"></i><span>파일 삭제</span></button>',
      '</div>'
    ].join("");
  };

  var galleryItemMarkup = function (fieldName, path) {
    return [
      '<div class="cms-gallery-item" data-cms-gallery-item>',
      '  <button class="cms-gallery-drag-handle" type="button" draggable="true" data-cms-gallery-drag aria-label="이미지 순서 드래그"><i class="ri-drag-move-2-line" aria-hidden="true"></i></button>',
      '  <div class="cms-gallery-thumb">' + assetPreviewMarkup(path, "갤러리 이미지") + '</div>',
      '  <input type="hidden" data-cms-gallery-input name="' + esc(fieldName) + '[]" value="' + esc(path || "") + '">',
      '  ' + fileUploadMarkup({ name: fieldName, value: path, accept: "image/*" }),
      '  <div class="cms-gallery-order-controls">',
      '    <button class="cms-gallery-order-button" type="button" data-cms-gallery-move="up" aria-label="이미지 위로 이동"><i class="ri-arrow-up-line" aria-hidden="true"></i></button>',
      '    <button class="cms-gallery-order-button" type="button" data-cms-gallery-move="down" aria-label="이미지 아래로 이동"><i class="ri-arrow-down-line" aria-hidden="true"></i></button>',
      '  </div>',
      '  <button class="cms-icon-button cms-icon-button--danger" type="button" data-cms-remove-gallery aria-label="이미지 삭제"><i class="ri-delete-bin-line" aria-hidden="true"></i></button>',
      '</div>'
    ].join("");
  };

  var richTextButtonMarkup = function (command, icon, label) {
    return [
      '<button class="cms-rich-editor-button" type="button" data-tiptap-command="' + esc(command) + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">',
      '  <i class="' + esc(icon) + '" aria-hidden="true"></i>',
      '</button>'
    ].join("");
  };

  var richTextEditorMarkup = function (id, field, value) {
    var content = value || "<p></p>";
    return [
      '<div class="cms-rich-editor" data-cms-rich-editor data-field-name="' + esc(field.name) + '" aria-busy="true">',
      '  <input type="hidden" id="' + esc(id) + '" name="' + esc(field.name) + '" value="' + esc(content) + '" data-cms-rich-editor-input>',
      '  <div class="cms-rich-editor-toolbar" data-cms-rich-editor-toolbar aria-label="공지 내용 에디터 도구">',
      richTextButtonMarkup("h2", "ri-h-2", "Heading 2"),
      richTextButtonMarkup("h3", "ri-h-3", "Heading 3"),
      richTextButtonMarkup("bold", "ri-bold", "Bold"),
      richTextButtonMarkup("italic", "ri-italic", "Italic"),
      richTextButtonMarkup("strike", "ri-strikethrough", "Strike"),
      richTextButtonMarkup("bulletList", "ri-list-unordered", "Bullet list"),
      richTextButtonMarkup("orderedList", "ri-list-ordered", "Ordered list"),
      richTextButtonMarkup("blockquote", "ri-double-quotes-l", "Blockquote"),
      richTextButtonMarkup("undo", "ri-arrow-go-back-line", "Undo"),
      richTextButtonMarkup("redo", "ri-arrow-go-forward-line", "Redo"),
      '  </div>',
      '  <div class="cms-rich-editor-surface" data-cms-rich-editor-surface></div>',
      '  <p class="cms-rich-editor-status" data-cms-rich-editor-status>에디터 라이브러리를 불러오는 중입니다.</p>',
      '</div>'
    ].join("");
  };

  var pairRowMarkup = function (pair) {
    return [
      '<div class="cms-repeat-row cms-repeat-row--pair">',
      '  <input class="cms-input" type="text" data-cms-pair-label value="' + esc(pair && pair.label || "") + '" placeholder="항목명">',
      '  <input class="cms-input" type="text" data-cms-pair-value value="' + esc(pair && pair.value || "") + '" placeholder="내용">',
      '  <button class="cms-icon-button cms-icon-button--danger" type="button" data-cms-remove-repeat aria-label="항목 삭제"><i class="ri-delete-bin-line" aria-hidden="true"></i></button>',
      '</div>'
    ].join("");
  };

  var cardRowMarkup = function (card) {
    return [
      '<div class="cms-repeat-row cms-repeat-row--card">',
      '  <input class="cms-input" type="text" data-cms-card-title value="' + esc(card && card.title || "") + '" placeholder="카드 제목">',
      '  <textarea class="cms-textarea" data-cms-card-text placeholder="카드 설명">' + esc(card && card.text || "") + '</textarea>',
      '  <button class="cms-icon-button cms-icon-button--danger" type="button" data-cms-remove-repeat aria-label="카드 삭제"><i class="ri-delete-bin-line" aria-hidden="true"></i></button>',
      '</div>'
    ].join("");
  };

  var fieldMarkup = function (field, item) {
    var value = item[field.name];
    var id = "cmsField_" + activeSection + "_" + activeIndex + "_" + field.name;
    var wide = field.wide ? " is-wide" : "";

    if (field.type === "checkbox") {
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <label class="cms-check-row" for="' + esc(id) + '">',
        '    <input type="checkbox" id="' + esc(id) + '" name="' + esc(field.name) + '"' + (value !== false ? " checked" : "") + '>',
        '    <span>' + esc(field.label) + '</span>',
        '  </label>',
        '</div>'
      ].join("");
    }

    if (field.type === "select") {
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <label class="cms-label" for="' + esc(id) + '">' + esc(field.label) + '</label>',
        '  <span class="cms-select-wrap">',
        '    <select class="cms-select" id="' + esc(id) + '" name="' + esc(field.name) + '">',
        (field.options || []).map(function (option) {
          return '<option value="' + esc(option[0]) + '"' + (String(value) === String(option[0]) ? " selected" : "") + '>' + esc(option[1]) + '</option>';
        }).join(""),
        '    </select>',
        '    <i class="ri-arrow-down-s-line" aria-hidden="true"></i>',
        '  </span>',
        '</div>'
      ].join("");
    }

    if (field.type === "countrySelect") {
      var countryOptions = getHandledCountryOptions();
      var selectedCountry = handledCountryValue(item) || (countryOptions[0] && countryOptions[0].value) || "";
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <label class="cms-label" for="' + esc(id) + '">' + esc(field.label) + '</label>',
        '  <span class="cms-select-wrap">',
        '    <select class="cms-select" id="' + esc(id) + '" name="' + esc(field.name) + '">',
        countryOptions.map(function (option) {
          return '<option value="' + esc(option.value) + '"' + (selectedCountry === option.value ? " selected" : "") + '>' + esc(option.label) + '</option>';
        }).join(""),
        '    </select>',
        '    <i class="ri-arrow-down-s-line" aria-hidden="true"></i>',
        '  </span>',
        '  <p class="cms-field-help">프론트 화면에는 MADE IN 문구가 자동으로 붙고, 국가 필터 값도 이 선택값으로 자동 설정됩니다.</p>',
        '</div>'
      ].join("");
    }

    if (field.type === "richtext") {
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <label class="cms-label" for="' + esc(id) + '">' + esc(field.label) + '</label>',
        '  ' + richTextEditorMarkup(id, field, value),
        '</div>'
      ].join("");
    }

    if (field.type === "textarea" || field.type === "list") {
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <label class="cms-label" for="' + esc(id) + '">' + esc(field.label) + '</label>',
        '  <textarea class="cms-textarea" id="' + esc(id) + '" name="' + esc(field.name) + '">' + esc(field.type === "list" ? toLines(value) : value || "") + '</textarea>',
        '</div>'
      ].join("");
    }

    if (field.type === "asset") {
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <label class="cms-label" for="' + esc(id) + '">' + esc(field.label) + '</label>',
        '  <div class="cms-asset-field" data-cms-asset-field>',
        '    <input type="hidden" id="' + esc(id) + '" name="' + esc(field.name) + '" value="' + esc(value || "") + '" data-cms-asset-input>',
        '    ' + fileUploadMarkup({ name: field.name, value: value, accept: "image/*,video/*" }),
        '    <div class="cms-asset-preview">' + assetPreviewMarkup(value, item.alt || item.title || field.label) + '</div>',
        '    <div class="cms-asset-actions"><button class="cms-button cms-button--danger" type="button" data-cms-clear-asset><i class="ri-delete-bin-line" aria-hidden="true"></i><span>파일 삭제</span></button></div>',
        '  </div>',
        '</div>'
      ].join("");
    }

    if (field.type === "downloadFile") {
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <span class="cms-label">' + esc(field.label) + '</span>',
        '  ' + downloadFileMarkup(field, item),
        '</div>'
      ].join("");
    }

    if (field.type === "gallery") {
      var images = normalizeList(value);
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <span class="cms-label">' + esc(field.label) + '</span>',
        '  <div class="cms-gallery-manager" data-field-name="' + esc(field.name) + '">',
        '    <div class="cms-gallery-list">',
        (images.length ? images : [""]).map(function (path) { return galleryItemMarkup(field.name, path); }).join(""),
        '    </div>',
        '    <button class="cms-button cms-button--ghost" type="button" data-cms-add-gallery><i class="ri-add-line" aria-hidden="true"></i><span>이미지 추가</span></button>',
        '  </div>',
        '</div>'
      ].join("");
    }

    if (field.type === "pairs") {
      var pairs = normalizePairs(value);
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <span class="cms-label">' + esc(field.label) + '</span>',
        '  <div class="cms-repeat-manager" data-field-name="' + esc(field.name) + '">',
        '    <div class="cms-repeat-list">',
        (pairs.length ? pairs : [{ label: "", value: "" }]).map(pairRowMarkup).join(""),
        '    </div>',
        '    <button class="cms-button cms-button--ghost" type="button" data-cms-add-pair><i class="ri-add-line" aria-hidden="true"></i><span>사양 항목 추가</span></button>',
        '  </div>',
        '</div>'
      ].join("");
    }

    if (field.type === "cards") {
      var cards = normalizeCards(value);
      return [
        '<div class="cms-form-group' + wide + '">',
        '  <span class="cms-label">' + esc(field.label) + '</span>',
        '  <div class="cms-repeat-manager" data-field-name="' + esc(field.name) + '">',
        '    <div class="cms-repeat-list">',
        (cards.length ? cards : [{ title: "", text: "" }]).map(cardRowMarkup).join(""),
        '    </div>',
        '    <button class="cms-button cms-button--ghost" type="button" data-cms-add-card><i class="ri-add-line" aria-hidden="true"></i><span>카드 추가</span></button>',
        '  </div>',
        '</div>'
      ].join("");
    }

    return [
      '<div class="cms-form-group' + wide + '">',
      '  <label class="cms-label" for="' + esc(id) + '">' + esc(field.label) + '</label>',
      '  <input class="cms-input" type="text" id="' + esc(id) + '" name="' + esc(field.name) + '" value="' + esc(value || "") + '">',
      '</div>'
    ].join("");
  };

  var refreshAssetPreview = function (input) {
    var field = input.closest("[data-cms-asset-field], .cms-gallery-item");
    if (!field) return;
    var preview = q(".cms-asset-preview, .cms-gallery-thumb", field);
    if (preview) preview.innerHTML = assetPreviewMarkup(input.value, "이미지 미리보기");
    var fileName = q("[data-cms-file-name]", field);
    if (fileName) fileName.textContent = assetNameFromValue(input.value);
  };

  var setAssetValue = function (input, value) {
    if (!input) return;
    input.value = value || "";
    refreshAssetPreview(input);
  };

  var refreshDownloadFile = function (field) {
    if (!field) return;
    var fileUrl = (q("[data-cms-download-url]", field) || {}).value || "";
    var fileNameInput = q("[data-cms-download-name]", field);
    var fileTypeInput = q("[data-cms-download-type]", field);
    var fileName = (fileNameInput && fileNameInput.value) || assetNameFromValue(fileUrl);
    var fileType = fileTypeFromSource(fileName, fileUrl, "", fileTypeInput && fileTypeInput.value);
    var fileLabel = q("[data-cms-download-file-label]", field);
    var fileTypeLabel = q("[data-cms-download-type-label]", field);
    var uploadName = q("[data-cms-file-name]", field);

    if (fileNameInput && fileUrl && !fileNameInput.value) fileNameInput.value = fileName;
    if (fileTypeInput) fileTypeInput.value = fileUrl ? fileType : "";
    if (fileLabel) fileLabel.textContent = fileUrl ? fileName : "선택된 파일 없음";
    if (fileTypeLabel) fileTypeLabel.textContent = fileUrl ? fileType : "AUTO";
    if (uploadName) uploadName.textContent = fileUrl ? fileName : "선택된 파일 없음";
  };

  var uploadDownloadFile = function (fileInput, field) {
    var file = fileInput.files && fileInput.files[0];
    if (!file || !field) return;

    var urlInput = q("[data-cms-download-url]", field);
    var nameInput = q("[data-cms-download-name]", field);
    var typeInput = q("[data-cms-download-type]", field);
    if (!urlInput || !nameInput || !typeInput) return;

    urlInput.value = uploadPathFromFileName(file.name);
    nameInput.value = file.name || "";
    typeInput.value = fileTypeFromSource(file.name, urlInput.value, file.type, "ETC");
    refreshDownloadFile(field);
    notify("첨부 파일을 선택했습니다.", "success");
  };

  var uploadFileToField = function (fileInput) {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;

    var downloadField = fileInput.closest("[data-cms-download-field]");
    if (downloadField) {
      uploadDownloadFile(fileInput, downloadField);
      return;
    }

    var field = fileInput.closest("[data-cms-asset-field], .cms-gallery-item");
    if (!field) return;
    var target = q("[data-cms-asset-input], [data-cms-gallery-input]", field);
    if (!target) return;

    if (!/^image\//i.test(file.type) && !/^video\//i.test(file.type)) {
      fileInput.value = "";
      notify("이미지 또는 비디오 파일만 첨부할 수 있습니다.", "error");
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      setAssetValue(target, reader.result);
      var fileName = q("[data-cms-file-name]", field);
      if (fileName) fileName.textContent = file.name;
      notify("파일 첨부가 완료되었습니다.", "success");
    };
    reader.onerror = function () {
      notify("파일을 읽지 못했습니다. 다른 파일을 선택해주세요.", "error");
    };
    reader.readAsDataURL(file);
  };

  var getGalleryItemIndex = function (item) {
    if (!item || !item.parentElement) return -1;
    return qa(".cms-gallery-item", item.parentElement).indexOf(item);
  };

  var getGalleryDragTarget = function (list, y) {
    var items = qa(".cms-gallery-item:not(.is-dragging)", list);
    return items.reduce(function (closest, item) {
      var box = item.getBoundingClientRect();
      var offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, item: item };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY, item: null }).item;
  };

  var moveGalleryItem = function (item, direction) {
    if (!item || !item.parentElement) return;
    var sibling = direction === "up" ? item.previousElementSibling : item.nextElementSibling;
    if (!sibling) {
      notify(direction === "up" ? "이미 첫 번째 이미지입니다." : "이미 마지막 이미지입니다.", "error");
      return;
    }

    if (direction === "up") {
      item.parentElement.insertBefore(item, sibling);
    } else {
      item.parentElement.insertBefore(sibling, item);
    }
    notify("갤러리 이미지 순서를 변경했습니다.", "success");
  };

  var mountRichTextEditor = function (root) {
    if (!root || root.dataset.cmsRichEditorBound) return true;
    if (!window.DpdCmsRichText || typeof window.DpdCmsRichText.mount !== "function") return false;

    var input = q("[data-cms-rich-editor-input]", root);
    var surface = q("[data-cms-rich-editor-surface]", root);
    var toolbar = q("[data-cms-rich-editor-toolbar]", root);
    var status = q("[data-cms-rich-editor-status]", root);
    if (!input || !surface) return true;

    try {
      window.DpdCmsRichText.mount({
        element: surface,
        toolbar: toolbar,
        content: input.value || "<p></p>",
        onUpdate: function (html) {
          input.value = html;
        }
      });
      root.dataset.cmsRichEditorBound = "true";
      root.setAttribute("aria-busy", "false");
      root.classList.add("is-ready");
      if (status) status.hidden = true;
      return true;
    } catch (error) {
      root.setAttribute("aria-busy", "false");
      root.classList.add("is-error");
      if (status) status.textContent = "에디터 라이브러리를 초기화하지 못했습니다.";
      notify("공지 내용 에디터를 초기화하지 못했습니다.", "error");
      return true;
    }
  };

  var bindRichTextEditors = function () {
    var pending = false;
    qa("[data-cms-rich-editor]", editorForm).forEach(function (root) {
      if (!mountRichTextEditor(root)) pending = true;
    });

    if (pending && !bindRichTextEditors.waiting) {
      bindRichTextEditors.waiting = true;
      window.addEventListener("dpd:tiptap-ready", function () {
        bindRichTextEditors.waiting = false;
        bindRichTextEditors();
      }, { once: true });

      window.setTimeout(function () {
        qa("[data-cms-rich-editor]:not([data-cms-rich-editor-bound])", editorForm).forEach(function (root) {
          var status = q("[data-cms-rich-editor-status]", root);
          root.setAttribute("aria-busy", "false");
          root.classList.add("is-error");
          if (status) status.textContent = "에디터 라이브러리 로드가 지연되고 있습니다. 네트워크 상태를 확인해주세요.";
        });
      }, 6000);
    }
  };

  var bindGallerySorting = function () {
    qa(".cms-gallery-list", editorForm).forEach(function (list) {
      if (list.dataset.cmsSortBound) return;
      list.dataset.cmsSortBound = "true";

      list.addEventListener("dragstart", function (event) {
        var handle = event.target && event.target.closest ? event.target.closest("[data-cms-gallery-drag]") : null;
        if (!handle) {
          event.preventDefault();
          return;
        }
        galleryDragItem = handle.closest(".cms-gallery-item");
        if (!galleryDragItem) return;
        galleryDragItem.dataset.cmsStartIndex = String(getGalleryItemIndex(galleryDragItem));
        galleryDragItem.classList.add("is-dragging");
        list.classList.add("is-sorting");
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", "gallery-image");
        }
      });

      list.addEventListener("dragover", function (event) {
        if (!galleryDragItem || galleryDragItem.parentElement !== list) return;
        event.preventDefault();
        var target = getGalleryDragTarget(list, event.clientY);
        if (target) {
          list.insertBefore(galleryDragItem, target);
        } else {
          list.appendChild(galleryDragItem);
        }
      });

      list.addEventListener("drop", function (event) {
        if (!galleryDragItem) return;
        event.preventDefault();
      });

      list.addEventListener("dragend", function () {
        if (!galleryDragItem) return;
        var startIndex = Number(galleryDragItem.dataset.cmsStartIndex);
        var endIndex = getGalleryItemIndex(galleryDragItem);
        galleryDragItem.classList.remove("is-dragging");
        delete galleryDragItem.dataset.cmsStartIndex;
        list.classList.remove("is-sorting");
        if (startIndex !== endIndex) notify("갤러리 이미지 순서를 변경했습니다.", "success");
        galleryDragItem = null;
      });
    });
  };

  var bindEditorControls = function () {
    bindRichTextEditors();
    bindGallerySorting();

    qa("[data-cms-file-upload]", editorForm).forEach(function (input) {
      if (input.dataset.cmsBound) return;
      input.dataset.cmsBound = "true";
      input.addEventListener("change", function () {
        uploadFileToField(input);
      });
    });

    qa("[data-cms-clear-download]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        var field = button.closest("[data-cms-download-field]");
        var fileInput = q("[data-cms-file-upload]", field);
        var urlInput = q("[data-cms-download-url]", field);
        var nameInput = q("[data-cms-download-name]", field);
        var typeInput = q("[data-cms-download-type]", field);
        if (fileInput) fileInput.value = "";
        if (urlInput) urlInput.value = "";
        if (nameInput) nameInput.value = "";
        if (typeInput) typeInput.value = "";
        refreshDownloadFile(field);
        notify("첨부 파일을 삭제했습니다.", "danger");
      });
    });

    qa("[data-cms-clear-asset]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        var field = button.closest("[data-cms-asset-field]");
        var input = q("[data-cms-asset-input]", field);
        var fileInput = q("[data-cms-file-upload]", field);
        if (fileInput) fileInput.value = "";
        setAssetValue(input, "");
        notify("파일을 삭제했습니다.", "danger");
      });
    });

    qa("[data-cms-gallery-input]", editorForm).forEach(function (input) {
      if (input.dataset.cmsBound) return;
      input.dataset.cmsBound = "true";
      input.addEventListener("input", function () {
        refreshAssetPreview(input);
      });
    });

    qa("[data-cms-add-gallery]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        var manager = button.closest("[data-field-name]");
        var list = q(".cms-gallery-list", manager);
        list.insertAdjacentHTML("beforeend", galleryItemMarkup(manager.dataset.fieldName, ""));
        bindEditorControls();
        notify("갤러리 이미지를 추가했습니다.", "success");
      });
    });

    qa("[data-cms-gallery-move]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        moveGalleryItem(button.closest(".cms-gallery-item"), button.dataset.cmsGalleryMove);
      });
    });

    qa("[data-cms-remove-gallery]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        var item = button.closest(".cms-gallery-item");
        var list = item && item.parentElement;
        if (list && qa(".cms-gallery-item", list).length > 1) {
          item.remove();
          notify("갤러리 이미지를 삭제했습니다.", "danger");
          return;
        }
        var input = q("[data-cms-gallery-input]", item);
        var fileInput = q("[data-cms-file-upload]", item);
        if (fileInput) fileInput.value = "";
        setAssetValue(input, "");
        notify("마지막 갤러리 이미지를 비웠습니다.", "info");
      });
    });

    qa("[data-cms-add-pair]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        var list = q(".cms-repeat-list", button.closest("[data-field-name]"));
        list.insertAdjacentHTML("beforeend", pairRowMarkup({ label: "", value: "" }));
        bindEditorControls();
      });
    });

    qa("[data-cms-add-card]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        var list = q(".cms-repeat-list", button.closest("[data-field-name]"));
        list.insertAdjacentHTML("beforeend", cardRowMarkup({ title: "", text: "" }));
        bindEditorControls();
      });
    });

    qa("[data-cms-remove-repeat]", editorForm).forEach(function (button) {
      if (button.dataset.cmsBound) return;
      button.dataset.cmsBound = "true";
      button.addEventListener("click", function () {
        var row = button.closest(".cms-repeat-row");
        var list = row && row.parentElement;
        if (list && qa(".cms-repeat-row", list).length > 1) {
          row.remove();
          return;
        }
        qa("input, textarea", row).forEach(function (node) {
          node.value = "";
        });
      });
    });

  };

  var renderNav = function () {
    sectionButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.cmsSection === activeSection);
    });
  };

  var renderList = function () {
    if (!itemList) return;
    var section = sections[activeSection];
    if (section.dashboard) {
      if (pageTitle) pageTitle.textContent = section.title;
      if (listTitle) listTitle.textContent = "";
      itemList.innerHTML = "";
      if (addLink) addLink.hidden = true;
      if (listControls) listControls.hidden = true;
      if (bulkBar) bulkBar.hidden = true;
      if (pagination) pagination.hidden = true;
      renderCountryManager();
      visibleIndexes = [];
      updateSelectionState();
      return;
    }
    var items = getItems();
    if (pageTitle) pageTitle.textContent = section.title;
    if (listTitle) listTitle.textContent = section.title + " 목록";
    if (listControls) listControls.hidden = false;
    if (bulkBar) bulkBar.hidden = false;
    renderStateFilterOptions();
    renderBulkActionOptions();
    renderCountryManager();
    var canCreate = section.canCreate !== false;
    if (addLink) {
      addLink.hidden = !canCreate;
      if (canCreate) {
        addLink.href = newUrl(activeSection);
      } else {
        addLink.removeAttribute("href");
      }
    }

    setMetaFilterOptions(items);
    var rows = getFilteredRows(items, section);
    var pagedRows = getPagedRows(rows);
    visibleIndexes = pagedRows.map(function (row) { return row.index; });

    if (!items.length) {
      itemList.innerHTML = '<div class="cms-table-empty">' + (canCreate ? '등록된 항목이 없습니다. 추가 버튼으로 새 항목을 생성하세요.' : '아직 접수된 문의가 없습니다. 프론트 컨택폼 접수 후 이곳에 표시됩니다.') + '</div>';
      renderPagination(0);
      updateSelectionState();
      return;
    }

    if (!rows.length) {
      itemList.innerHTML = '<div class="cms-table-empty">조건에 맞는 항목이 없습니다. 검색어 또는 필터를 조정해주세요.</div>';
      renderPagination(0);
      updateSelectionState();
      return;
    }

    itemList.innerHTML = pagedRows.map(function (row) {
      var item = row.item;
      var index = row.index;
      var isChecked = selectedIndexes.indexOf(index) >= 0;
      return [
        '<div class="cms-table-row" role="row" data-cms-index="' + index + '">',
        '  <div class="cms-table-cell cms-table-cell--check" role="cell">',
        '    <label class="cms-table-check cms-table-check--icon" aria-label="' + esc(getPrimaryLabel(item)) + ' 선택">',
        '      <input type="checkbox" data-cms-row-select value="' + index + '"' + (isChecked ? " checked" : "") + '>',
        '      <span aria-hidden="true"></span>',
        '    </label>',
        '  </div>',
        '  <div class="cms-table-cell cms-table-cell--title" role="cell">',
        '    <a class="cms-table-title" href="' + esc(editUrl(activeSection, index)) + '">' + esc(getPrimaryLabel(item)) + '</a>',
        '    <span class="cms-table-summary">' + esc(sectionMeta(section, item) || item.summary || item.description || "세부 정보를 관리합니다.") + '</span>',
        '  </div>',
        '  <div class="cms-table-cell" role="cell">' + statusBadgeMarkup(item) + '</div>',
        '  <div class="cms-table-cell" role="cell"><span class="cms-table-meta">' + esc(sectionMeta(section, item) || "-") + '</span></div>',
        '  <div class="cms-table-cell cms-table-cell--actions" role="cell">',
        '    <a class="cms-icon-button" href="' + esc(editUrl(activeSection, index)) + '"><span>수정</span><i class="ri-arrow-right-line" aria-hidden="true"></i></a>',
        '  </div>',
        '</div>'
      ].join("");
    }).join("");
    renderPagination(rows.length);
    updateSelectionState();
  };

  var renderEditor = function () {
    if (!editorFields || !editorForm) return;
    if (sections[activeSection] && sections[activeSection].dashboard) {
      window.location.href = listUrl("dashboard");
      return;
    }
    if (isNewMode && sections[activeSection] && sections[activeSection].canCreate === false) {
      window.location.href = listUrl(activeSection);
      return;
    }
    var section = sections[activeSection];
    var item = getEditorItem();

    if (!item) {
      if (editorTitle) editorTitle.textContent = "항목이 없습니다";
      editorFields.innerHTML = "";
      return;
    }

    if (pageTitle) pageTitle.textContent = section.title + (isNewMode ? " 추가" : " 수정");
    if (editorTitle) editorTitle.textContent = isNewMode ? section.title + " 새 항목 입력" : getPrimaryLabel(item);
    if (backLink) backLink.href = listUrl(activeSection);

    ["#cmsMoveUpBtn", "#cmsMoveDownBtn", "#cmsDeleteBtn"].forEach(function (selector) {
      var button = q(selector);
      if (button) button.hidden = isNewMode;
    });

    editorFields.innerHTML = (section.groups || []).map(function (group) {
      return [
        '<section class="cms-fieldset">',
        '  <div class="cms-fieldset-head">',
        '    <div>',
        '      <h3 class="cms-fieldset-title">' + esc(group.title) + '</h3>',
        group.desc ? '      <p class="cms-fieldset-desc">' + esc(group.desc) + '</p>' : "",
        '    </div>',
        '  </div>',
        '  <div class="cms-fieldset-grid">',
        (group.fields || []).map(function (field) {
          return fieldMarkup(field, item);
        }).join(""),
        '  </div>',
        '</section>'
      ].join("");
    }).join("");

    bindEditorControls();
  };

  var render = function () {
    if (!isEditPage) setSectionUrl();
    renderNav();
    renderDashboard();
    renderList();
    renderEditor();
  };

  var readFieldValue = function (field) {
    if (field.type === "downloadFile") {
      var downloadField = q('[data-cms-download-field][data-field-name="' + field.name + '"]', editorForm);
      if (!downloadField) return undefined;
      return {
        __merge: true,
        fileUrl: ((q("[data-cms-download-url]", downloadField) || {}).value || "").trim(),
        fileName: ((q("[data-cms-download-name]", downloadField) || {}).value || "").trim(),
        type: ((q("[data-cms-download-type]", downloadField) || {}).value || "").trim()
      };
    }

    if (field.type === "gallery") {
      return qa('[data-field-name="' + field.name + '"] [data-cms-gallery-input]', editorForm)
        .map(function (input) { return input.value.trim(); })
        .filter(Boolean);
    }

    if (field.type === "pairs") {
      return qa('[data-field-name="' + field.name + '"] .cms-repeat-row', editorForm).map(function (row) {
        return {
          label: (q("[data-cms-pair-label]", row) || {}).value || "",
          value: (q("[data-cms-pair-value]", row) || {}).value || ""
        };
      }).map(function (item) {
        return { label: item.label.trim(), value: item.value.trim() };
      }).filter(function (item) {
        return item.label || item.value;
      });
    }

    if (field.type === "cards") {
      return qa('[data-field-name="' + field.name + '"] .cms-repeat-row', editorForm).map(function (row) {
        return {
          title: (q("[data-cms-card-title]", row) || {}).value || "",
          text: (q("[data-cms-card-text]", row) || {}).value || ""
        };
      }).map(function (item) {
        return { title: item.title.trim(), text: item.text.trim() };
      }).filter(function (item) {
        return item.title || item.text;
      });
    }

    var node = q('[name="' + field.name + '"]', editorForm);
    if (!node) return undefined;
    if (field.type === "checkbox") return node.checked;
    if (field.type === "list") return fromLines(node.value);
    return field.type === "textarea" ? node.value.trim() : node.value.trim();
  };

  var readEditorValues = function () {
    var section = sections[activeSection];
    var current = store.clone(getEditorItem() || templates[activeSection]);

    allFields(section).forEach(function (field) {
      var value = readFieldValue(field);
      if (value && value.__merge) {
        Object.keys(value).forEach(function (key) {
          if (key !== "__merge") current[key] = value[key];
        });
        return;
      }
      if (value !== undefined) current[field.name] = value;
    });

    if (activeSection === "handledItems") {
      syncHandledCountryFields(current);
    }

    if (activeSection === "resources") delete current.images;

    if (activeSection === "notices") {
      current.date = current.date || dateLabel();
      current.summary = noticeSummary(current.content, current.title);
      current.href = current.href || "kr/pr/notice.html#content";
      delete current.images;
    }

    return current;
  };

  if (!isNewMode && getItems().length && !getItems()[activeIndex]) {
    activeIndex = 0;
  }

  sectionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (isEditPage) {
        window.location.href = listUrl(button.dataset.cmsSection);
        return;
      }
      activeSection = button.dataset.cmsSection;
      activeIndex = 0;
      resetListUiState();
      render();
    });
  });

  if (listSearch) {
    listSearch.addEventListener("input", function () {
      listFilters.search = listSearch.value.trim();
      selectedIndexes = [];
      currentPage = 1;
      renderList();
    });
  }

  if (stateFilter) {
    stateFilter.addEventListener("change", function () {
      listFilters.state = stateFilter.value || "all";
      selectedIndexes = [];
      currentPage = 1;
      renderList();
    });
  }

  if (metaFilter) {
    metaFilter.addEventListener("change", function () {
      listFilters.meta = metaFilter.value || "all";
      selectedIndexes = [];
      currentPage = 1;
      renderList();
    });
  }

  if (itemList) {
    itemList.addEventListener("change", function (event) {
      var input = event.target && event.target.closest ? event.target.closest("[data-cms-row-select]") : null;
      if (!input) return;
      setSelectedIndex(input.value, input.checked);
      updateSelectionState();
    });
  }

  if (selectAll) {
    selectAll.addEventListener("change", function () {
      visibleIndexes.forEach(function (index) {
        setSelectedIndex(index, selectAll.checked);
      });
      renderList();
    });
  }

  if (pagination) {
    pagination.addEventListener("click", function (event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-cms-page]") : null;
      if (!button || button.disabled) return;
      goToPage(button.dataset.cmsPage);
    });
  }

  if (bulkAction) {
    bulkAction.addEventListener("change", updateSelectionState);
  }

  if (bulkApplyButton) {
    bulkApplyButton.addEventListener("click", applyBulkAction);
  }

  if (countryAddButton) {
    countryAddButton.addEventListener("click", addHandledCountryOption);
  }

  if (countryInput) {
    countryInput.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      addHandledCountryOption();
    });
  }

  if (countryList) {
    countryList.addEventListener("click", function (event) {
      var button = event.target && event.target.closest ? event.target.closest("[data-cms-remove-country]") : null;
      if (!button) return;
      removeHandledCountryOption(button.dataset.cmsRemoveCountry);
    });
  }

  if (editorForm) {
    editorForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var items = getItems();
      var current = readEditorValues();
      if (isNewMode) {
        current.id = current.id || store.createId(activeSection, current.title || current.name || current.eyebrow);
        items.push(current);
        activeIndex = items.length - 1;
        isNewMode = false;
        setItems(items);
        persist("새 항목을 추가하고 저장했습니다.");
        window.history.replaceState(null, "", editUrl(activeSection, activeIndex));
        render();
        return;
      }
      if (!items[activeIndex]) return;
      items[activeIndex] = current;
      setItems(items);
      persist("프론트 DB와 관리자 입력값을 저장했습니다.");
      render();
    });
  }

  var deleteButton = q("#cmsDeleteBtn");
  if (deleteButton) {
    deleteButton.addEventListener("click", function () {
      var items = getItems();
      if (!items[activeIndex]) return;
      if (!window.confirm("선택한 항목을 삭제할까요?")) return;
      items.splice(activeIndex, 1);
      activeIndex = Math.max(activeIndex - 1, 0);
      setItems(items);
      persist("항목을 삭제했습니다.", "danger");
      window.location.href = listUrl(activeSection);
    });
  }

  var moveUpButton = q("#cmsMoveUpBtn");
  if (moveUpButton) {
    moveUpButton.addEventListener("click", function () {
      var items = getItems();
      if (activeIndex <= 0) return;
      var item = items.splice(activeIndex, 1)[0];
      items.splice(activeIndex - 1, 0, item);
      activeIndex -= 1;
      setItems(items);
      persist("노출 순서를 변경했습니다.");
      window.history.replaceState(null, "", editUrl(activeSection, activeIndex));
      render();
    });
  }

  var moveDownButton = q("#cmsMoveDownBtn");
  if (moveDownButton) {
    moveDownButton.addEventListener("click", function () {
      var items = getItems();
      if (activeIndex >= items.length - 1) return;
      var item = items.splice(activeIndex, 1)[0];
      items.splice(activeIndex + 1, 0, item);
      activeIndex += 1;
      setItems(items);
      persist("노출 순서를 변경했습니다.");
      window.history.replaceState(null, "", editUrl(activeSection, activeIndex));
      render();
    });
  }

  var resetButton = q("#cmsResetBtn");
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (!window.confirm("관리자 DB를 초기 데이터로 되돌릴까요? 현재 브라우저에 저장된 수정값이 삭제됩니다.")) return;
      database = store.resetData();
      activeIndex = 0;
      notify("초기 데이터로 복구했습니다.", "danger");
      render();
    });
  }

  var jsonToggle = q("#cmsJsonToggle");
  if (jsonToggle && jsonPanel && jsonData) {
    jsonToggle.addEventListener("click", function () {
      jsonPanel.classList.toggle("is-open");
      jsonData.value = JSON.stringify(database, null, 2);
    });
  }

  var exportButton = q("#cmsExportBtn");
  if (exportButton && jsonData) {
    exportButton.addEventListener("click", function () {
      jsonData.value = JSON.stringify(store.getData(), null, 2);
      notify("현재 DB를 JSON 영역에 불러왔습니다.", "success");
    });
  }

  var importButton = q("#cmsImportBtn");
  if (importButton && jsonData) {
    importButton.addEventListener("click", function () {
      try {
        database = JSON.parse(jsonData.value);
        database = store.saveData(database);
        activeIndex = 0;
        notify("JSON 데이터를 적용했습니다.", "success");
        render();
      } catch (error) {
        notify("JSON 형식을 확인해주세요.", "error");
      }
    });
  }

  var logoutButton = q("#cmsLogoutBtn");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      store.logout();
      window.location.href = "login.html";
    });
  }

  render();
})(window, document);
