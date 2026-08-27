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

  var plain = function (value) {
    return String(value == null ? "" : value).trim();
  };

  var getRootPrefix = function () {
    var path = window.location.pathname.replace(/\\/g, "/");
    var parts = path.split("/").filter(Boolean);
    if (!parts.length) return "";
    var last = parts[parts.length - 1];
    var depth = last.indexOf(".") >= 0 ? parts.length - 1 : parts.length;
    return "../".repeat(Math.max(depth, 0));
  };

  var isAbsolute = function (path) {
    return /^(https?:)?\/\//i.test(path) || /^(mailto:|tel:|#|data:|blob:)/i.test(path);
  };

  var assetPath = function (path) {
    path = plain(path);
    if (!path || isAbsolute(path) || path.charAt(0) === "/") return path;
    return getRootPrefix() + path.replace(/^\.\//, "").replace(/^(\.\.\/)+/, "");
  };

  var hrefPath = assetPath;

  var enabled = function (items) {
    return (items || []).filter(function (item) {
      return item && item.enabled !== false;
    });
  };

  var arrayValue = function (value) {
    if (Array.isArray(value)) return value.map(plain).filter(Boolean);
    return plain(value).split(/\n|\|/).map(plain).filter(Boolean);
  };

  var linkMeta = function (item) {
    var href = hrefPath(item.href || "");
    var external = item.external || /^(https?:)?\/\//i.test(item.href || "");
    return {
      href: href || "#",
      attrs: external ? ' target="_blank" rel="noopener"' : ' target="_self"'
    };
  };

  var normalizeCountryLabel = function (value) {
    return plain(value)
      .replace(/^made\s+in\s+/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  };

  var countryValueFromLabel = function (value) {
    return normalizeCountryLabel(value)
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "") || "country";
  };

  var handledCountryLabel = function (item) {
    var label = normalizeCountryLabel(item.countryLabel || item.countryName || item.eyebrow);
    if (label) return label;
    return normalizeCountryLabel(item.country || "");
  };

  var handledCountryValue = function (item) {
    return countryValueFromLabel(item.country || handledCountryLabel(item));
  };

  var handledCountryDisplay = function (item) {
    var label = handledCountryLabel(item);
    return label ? "MADE IN " + label : "";
  };

  var handledCountryOptions = function (items) {
    var seen = {};
    return (items || []).map(function (item) {
      var value = handledCountryValue(item);
      var label = handledCountryLabel(item);
      if (!value || !label || seen[value]) return null;
      seen[value] = true;
      return { value: value, label: label };
    }).filter(Boolean);
  };

  var fileIcon = function (type) {
    var key = plain(type).toLowerCase();
    if (key === "pdf") return "ri-file-pdf-line";
    if (key === "zip") return "ri-file-zip-line";
    if (key === "doc" || key === "docx") return "ri-file-word-line";
    if (key === "xls" || key === "xlsx") return "ri-file-excel-line";
    if (key === "ppt" || key === "pptx") return "ri-file-ppt-line";
    return "ri-file-list-2-line";
  };

  var resourceCategoryLabel = function (category, title) {
    if (category === "catalog") return "카탈로그 자료";
    if (category === "drawing") return "도면자료";
    var match = plain(title).match(/^\[([^\]]+)\]/);
    return match ? match[1] : "도면자료";
  };

  var resourceTitle = function (item) {
    var title = plain(item.title);
    if (/^\[[^\]]+\]/.test(title)) return title;
    return "[" + resourceCategoryLabel(item.category, title) + "] " + title;
  };

  var dateParts = function (date) {
    var value = plain(date);
    var parts = value.split(".");
    if (parts.length >= 3) {
      return {
        year: parts[0] + ".",
        day: parts.slice(1).join(".")
      };
    }
    return {
      year: value,
      day: ""
    };
  };

  var contactTimestamp = function () {
    var now = new Date();
    var pad = function (value) {
      return String(value).padStart(2, "0");
    };
    return [
      now.getFullYear(),
      ".",
      pad(now.getMonth() + 1),
      ".",
      pad(now.getDate()),
      " ",
      pad(now.getHours()),
      ":",
      pad(now.getMinutes())
    ].join("");
  };

  var formValue = function (form, name) {
    var node = form.elements[name];
    return node ? plain(node.value) : "";
  };

  var bindContactForms = function () {
    qa(".inquiry-form-panel form").forEach(function (form) {
      if (form.dataset.dpdCmsContactBound) return;
      if (!/contact_ok\.html/i.test(form.getAttribute("action") || "")) return;
      form.dataset.dpdCmsContactBound = "true";

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var agree = form.elements.agree1;
        var required = ["name", "company", "phone", "email", "content"];
        var missing = required.find(function (name) {
          return !formValue(form, name);
        });

        if (missing) {
          window.alert("필수 입력 항목을 확인해 주세요.");
          if (form.elements[missing] && typeof form.elements[missing].focus === "function") form.elements[missing].focus();
          return;
        }

        if (agree && !agree.checked) {
          window.alert("개인정보 수집 및 이용에 동의해 주세요.");
          agree.focus();
          return;
        }

        var fileInput = form.elements.bbs_file;
        var fileName = "";
        if (fileInput && fileInput.files && fileInput.files[0]) {
          fileName = fileInput.files[0].name;
        } else {
          var fileText = q(".upload-name", form);
          fileName = fileText ? plain(fileText.value) : "";
        }

        var database = store.getData();
        var collection = database.collections.contactForms || [];
        collection.push({
          id: store.createId("contactForms", formValue(form, "company") || formValue(form, "name")),
          enabled: true,
          status: "new",
          source: window.location.pathname.indexOf("/contact/") >= 0 ? "contact" : "main",
          receivedAt: contactTimestamp(),
          name: formValue(form, "name"),
          company: formValue(form, "company"),
          phone: formValue(form, "phone"),
          email: formValue(form, "email"),
          item: formValue(form, "item"),
          content: formValue(form, "content"),
          fileName: fileName,
          filePath: "",
          agree: Boolean(agree && agree.checked),
          memo: ""
        });
        database.collections.contactForms = collection;
        store.saveData(database);
        form.reset();
        qa(".upload-name", form).forEach(function (node) { node.value = ""; });
        window.alert("문의가 접수되었습니다.");
      });
    });
  };

  var renderMainHero = function (collections) {
    var track = q("#mainVisual .main-visual-con");
    if (!track) return;

    var slides = enabled(collections.mainHero);
    if (!slides.length) return;

    track.innerHTML = slides.map(function (item) {
      var media = assetPath(item.media);
      var mediaMarkup = item.mediaType === "image"
        ? '<img src="' + esc(media) + '" alt="' + esc(item.alt || item.title) + '" loading="eager" decoding="async">'
        : '<video class="slide-video" muted playsinline preload="metadata" aria-hidden="true" tabindex="-1"><source src="' + esc(media) + '" type="video/mp4"></video>';

      return [
        '<div class="main-visual-item ' + (item.mediaType === "image" ? "image-item" : "video-item") + '">',
        '  <div class="main-visual-video-wrapper dpd-main-visual-video">',
        '    <div class="background-video">' + mediaMarkup + '</div>',
        '  </div>',
        '  <div class="main-visual-txt-con">',
        '    <div class="main-visual-txt-box area-box">',
        '      <div class="main-visual-txt-inner">',
        '        <p class="main-visual-txt1 cm-word-split-JS" data-css-property="animation" data-speed="0.04" data-speed-delay="0.2" translate="no">' + esc(item.eyebrow) + '</p>',
        '        <p class="main-visual-txt2 cm-word-split-JS" data-css-property="animation" data-speed="0.04" data-speed-delay="0.2" translate="no">' + esc(item.title) + '</p>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join("");
    }).join("");
  };

  var renderMainDevelopment = function (collections) {
    var list = q("#mainDevelopment .dpd-main-dev-list");
    if (!list) return;

    var items = enabled(collections.developmentItems);
    list.innerHTML = items.map(function (item) {
      var link = linkMeta(item);
      return [
        '<li class="dpd-main-dev-slide swiper-slide">',
        '  <a class="dpd-main-development-card" href="' + esc(link.href) + '"' + link.attrs + ' aria-label="' + esc(item.title) + ' 상세 페이지로 이동">',
        '    <figure><img src="' + esc(assetPath(item.image)) + '" alt="' + esc(item.alt || item.title) + '" loading="lazy" decoding="async"></figure>',
        '    <div class="dpd-main-development-card-txt">',
        '      <span>' + esc(item.eyebrow) + '</span>',
        '      <h5>' + esc(item.title) + '</h5>',
        '    </div>',
        '  </a>',
        '</li>'
      ].join("");
    }).join("");

    qa('[data-dpd-slider-nav="development"] [data-dpd-slider-total]').forEach(function (node) {
      node.textContent = String(Math.max(items.length, 1)).padStart(2, "0");
    });
  };

  var handledCardMarkup = function (item, isMain) {
    var gallery = arrayValue(item.gallery);
    var image = assetPath(item.image);
    var dataGallery = gallery.length ? gallery.map(assetPath).join("|") : image;
    var link = linkMeta(item);
    var liId = isMain ? "main-" + item.id : item.id;
    var liClass = isMain ? ' class="swiper-slide"' : "";
    var countryValue = handledCountryValue(item);
    var countryDisplay = handledCountryDisplay(item);

    return [
      '<li id="' + esc(liId) + '"' + liClass + ' data-country="' + esc(countryValue) + '">',
      '  <div class="dpd-item-card" data-title="' + esc(item.title) + '" data-eyebrow="' + esc(countryDisplay) + '" data-description="' + esc(item.description) + '">',
      '    <strong class="tit-en">' + esc(countryDisplay) + '</strong>',
      '    <button type="button" class="img-box dpd-item-thumb-link" data-dpd-lightbox data-image="' + esc(image) + '" data-gallery="' + esc(dataGallery) + '" data-title="' + esc(item.title) + '" data-eyebrow="' + esc(countryDisplay) + '" data-description="' + esc(item.description) + '" data-mouse-pointer="view" aria-label="' + esc(item.title) + ' 이미지 크게 보기"><span><img src="' + esc(image) + '" alt="' + esc(item.title) + '" loading="lazy" decoding="async"></span></button>',
      '    <h5 class="tit-kr">' + esc(item.title) + '</h5>',
      item.category ? '    <span class="dpd-item-category-badge">' + esc(item.category) + '</span>' : "",
      '    <div class="dpd-item-major"><span class="dpd-item-major__label">주요 품목</span><p class="dpd-item-desc">' + esc(item.description) + '</p></div>',
      '    <a href="' + esc(link.href) + '" class="dpd-item-website-btn"' + link.attrs + ' aria-label="' + esc(item.title) + ' 웹사이트로 이동"><span>웹사이트</span><i class="ri-external-link-line" aria-hidden="true"></i></a>',
      '  </div>',
      '</li>'
    ].filter(Boolean).join("");
  };

  var renderHandledCountryFilters = function (items) {
    var options = handledCountryOptions(items);
    qa(".dpd-country-filter").forEach(function (filter) {
      filter.innerHTML = [
        '<button type="button" class="dpd-country-filter__btn is-active" data-dpd-country-filter="all" aria-pressed="true">전체</button>',
        options.map(function (option) {
          return '<button type="button" class="dpd-country-filter__btn" data-dpd-country-filter="' + esc(option.value) + '" aria-pressed="false">' + esc(option.label) + '</button>';
        }).join("")
      ].join("");
    });
  };

  var renderHandledItems = function (collections) {
    var items = enabled(collections.handledItems);
    if (!items.length) return;

    renderHandledCountryFilters(items);

    qa("#mainHandled .dpd-main-handled-list").forEach(function (list) {
      list.innerHTML = items.map(function (item) {
        return handledCardMarkup(item, true);
      }).join("");
    });

    qa(".dpd-supply-items-page .dpd-sub-business-list:not(.dpd-main-handled-list)").forEach(function (list) {
      list.innerHTML = items.map(function (item) {
        return handledCardMarkup(item, false);
      }).join("");
    });

    qa('[data-dpd-slider-nav="handled"] [data-dpd-slider-total]').forEach(function (node) {
      node.textContent = String(Math.max(items.length, 1)).padStart(2, "0");
    });
  };

  var partnerItemMarkup = function (item) {
    return '<li class="dpd-partner-item"><img src="' + esc(assetPath(item.image)) + '" alt="' + esc(item.alt || item.name) + '" loading="lazy" decoding="async"></li>';
  };

  var renderCustomers = function (collections) {
    var customers = enabled(collections.customers);
    if (!customers.length) return;

    var mainMarquee = q("#mainPartner .dpd-partner-marquee");
    if (mainMarquee) {
      var top = customers.filter(function (item) { return item.row !== "bottom"; }).map(partnerItemMarkup).join("");
      var bottom = customers.filter(function (item) { return item.row === "bottom"; }).map(partnerItemMarkup).join("");
      mainMarquee.innerHTML = [
        '<div class="dpd-partner-track dpd-partner-track--right"><ul class="dpd-partner-list" aria-hidden="true">' + top + '</ul><ul class="dpd-partner-list" aria-hidden="true">' + top + '</ul></div>',
        '<div class="dpd-partner-track dpd-partner-track--left"><ul class="dpd-partner-list" aria-hidden="true">' + bottom + '</ul><ul class="dpd-partner-list" aria-hidden="true">' + bottom + '</ul></div>'
      ].join("");
    }

    qa(".dpd-customer-logo-grid").forEach(function (list) {
      list.innerHTML = customers.map(function (item) {
        return '<li><img src="' + esc(assetPath(item.image)) + '" alt="' + esc(item.alt || item.name) + '" loading="lazy" decoding="async"></li>';
      }).join("");
    });
  };

  var renderResources = function (collections) {
    var lists = qa(".data-content .dpd-resource-card-list");
    if (!lists.length) return;

    var resources = enabled(collections.resources);
    lists.forEach(function (list) {
      list.innerHTML = resources.map(function (item) {
        var fileUrl = assetPath(item.fileUrl);
        var fileType = plain(item.type || item.fileName.split(".").pop()).toUpperCase();
        return [
          '<li class="bbs-item">',
          '  <div class="bbs-list-info-con">',
          '    <span class="data-file-type-badge"><i class="' + esc(fileIcon(fileType)) + '" aria-hidden="true"></i><span>' + esc(fileType) + '</span></span>',
          '    <p class="bbs-subject-txt">' + esc(resourceTitle(item)) + '</p>',
          '    <p class="bbs-subject-txt">' + esc(item.summary) + '</p>',
          '  </div>',
          '  <div class="bbs-right-info-con"><div class="data-btn-box"><a class="data-action-btn" href="' + esc(fileUrl) + '" download="' + esc(item.fileName || "") + '" aria-label="' + esc(item.title) + ' 다운로드"><span>다운로드</span><i class="ri-download-line" aria-hidden="true"></i></a></div></div>',
          '</li>'
        ].join("");
      }).join("");
    });

    qa(".data-content .total-list-con b").forEach(function (node) {
      node.textContent = String(resources.length);
    });
  };

  var normalizePagePath = function (path) {
    return plain(path)
      .replace(window.location.origin, "")
      .replace(/\\/g, "/")
      .replace(/[?#].*$/, "")
      .replace(/^\/+/, "");
  };

  var currentProductItem = function (collections) {
    var currentPath = normalizePagePath(window.location.pathname);
    return enabled(collections.developmentItems).find(function (item) {
      var itemPath = normalizePagePath(item.href || "");
      return itemPath && currentPath.endsWith(itemPath);
    });
  };

  var renderProductDetailGallery = function (item) {
    var gallery = arrayValue(item.gallery);
    var images = gallery.length ? gallery : [item.image].filter(Boolean);
    var galleryRoot = q(".dpd-product-detail-gallery[data-dpd-product-gallery]");
    if (!galleryRoot || !images.length) return;

    var first = assetPath(images[0]);
    var title = item.detailTitle || item.title;
    galleryRoot.innerHTML = [
      '<figure class="dpd-product-detail-main-image"><img src="' + esc(first) + '" alt="' + esc(title) + ' 상세 이미지" loading="lazy"></figure>',
      '<div class="dpd-product-detail-thumbs">',
      images.map(function (image, index) {
        var src = assetPath(image);
        return '<button type="button" class="' + (index === 0 ? "is-active" : "") + '" data-gallery-src="' + esc(src) + '" aria-label="' + esc(title) + ' 이미지 ' + (index + 1) + ' 보기"><img src="' + esc(src) + '" alt="' + esc(title) + ' 썸네일 ' + (index + 1) + '" loading="lazy"></button>';
      }).join(""),
      '</div>'
    ].join("");

    qa(".dpd-product-detail-thumbs button", galleryRoot).forEach(function (button) {
      button.addEventListener("click", function () {
        qa(".dpd-product-detail-thumbs button", galleryRoot).forEach(function (thumb) {
          thumb.classList.remove("is-active");
        });
        button.classList.add("is-active");
        var mainImage = q(".dpd-product-detail-main-image img", galleryRoot);
        if (mainImage) mainImage.src = button.dataset.gallerySrc;
      });
    });
  };

  var renderProductDetail = function (collections) {
    var page = q(".dpd-product-detail-page");
    if (!page) return;

    var item = currentProductItem(collections);
    if (!item) return;

    var visualImage = q(".dpd-product-detail-visual img", page);
    if (visualImage) {
      visualImage.src = assetPath(item.visualImage || item.image);
      visualImage.alt = item.detailTitle || item.title || visualImage.alt;
    }

    var visualEyebrow = q(".dpd-product-detail-visual-copy span", page);
    var visualTitle = q(".dpd-product-detail-visual-copy h4", page);
    var lead = q(".dpd-product-detail-lead strong", page);
    var summary = q(".dpd-product-detail-copy p", page);
    if (visualEyebrow) visualEyebrow.textContent = item.detailEyebrow || item.eyebrow || "";
    if (visualTitle) visualTitle.textContent = item.detailTitle || item.title || "";
    if (lead) lead.textContent = item.lead || "";
    if (summary) summary.textContent = item.summary || "";

    renderProductDetailGallery(item);

    var overviewTitle = q(".dpd-product-detail-desc h5", page);
    var overviewDesc = q(".dpd-product-detail-desc p", page);
    var overviewList = q(".dpd-product-detail-desc ul", page);
    if (overviewTitle) overviewTitle.textContent = item.overviewTitle || item.title || "";
    if (overviewDesc) overviewDesc.textContent = item.overviewDescription || "";
    if (overviewList) {
      overviewList.innerHTML = arrayValue(item.bullets).map(function (text) {
        return '<li>' + esc(text) + '</li>';
      }).join("");
    }

    var specSection = qa(".dpd-detail-section", page)[0];
    if (specSection) {
      var specEyebrow = q(".dpd-section-heading span", specSection);
      var specTitle = q(".dpd-section-heading h4", specSection);
      var specBody = q(".dpd-detail-table tbody", specSection);
      if (specEyebrow) specEyebrow.textContent = item.specEyebrow || "";
      if (specTitle) specTitle.textContent = item.specTitle || "";
      if (specBody) {
        specBody.innerHTML = (item.specs || []).map(function (row) {
          return '<tr><th scope="row">' + esc(row.label || row.key || "") + '</th><td>' + esc(row.value || "") + '</td></tr>';
        }).join("");
      }
    }

    var featureSection = qa(".dpd-detail-section", page)[1];
    if (featureSection) {
      var featureEyebrow = q(".dpd-section-heading span", featureSection);
      var featureTitle = q(".dpd-section-heading h4", featureSection);
      var featureGrid = q(".dpd-detail-feature-grid", featureSection);
      if (featureEyebrow) featureEyebrow.textContent = item.featureEyebrow || "";
      if (featureTitle) featureTitle.textContent = item.featureTitle || "";
      if (featureGrid) {
        featureGrid.innerHTML = (item.features || []).map(function (feature) {
          return '<article class="dpd-detail-feature-card"><h5>' + esc(feature.title || "") + '</h5><p>' + esc(feature.text || "") + '</p></article>';
        }).join("");
      }
    }
  };

  var renderNotices = function (collections) {
    var notices = enabled(collections.notices);

    qa(".news-content .dpd-notice-list").forEach(function (list) {
      list.innerHTML = notices.map(function (item) {
        var href = hrefPath(item.href);
        return [
          '<li class="bbs-item">',
          '  <a class="dpd-notice-card-link" href="' + esc(href) + '" data-mouse-pointer="more" aria-label="' + esc(item.title) + ' 더보기">',
          '    <p class="bbs-list-date">' + esc(item.date) + '</p>',
          '    <div class="bbs-list-info-con">',
          '      <p class="bbs-subject-txt">' + esc(item.title) + '</p>',
          '      <p class="bbs-subject-txt">' + esc(item.summary) + '</p>',
          '    </div>',
          '  </a>',
          '</li>'
        ].join("");
      }).join("");
    });

    qa(".news-content .total-list-con b").forEach(function (node) {
      node.textContent = String(notices.length);
    });

    var mainList = q("#mainPR .main-pr-txt-list");
    if (mainList) {
      mainList.innerHTML = notices.slice(0, 4).map(function (item) {
        var parts = dateParts(item.date);
        return [
          '<li>',
          '  <a href="' + esc(hrefPath(item.href)) + '">',
          '    <p class="date"><span>' + esc(parts.year) + '</span><span>' + esc(parts.day) + '</span></p>',
          '    <p class="txt">' + esc(item.title) + '</p>',
          '  </a>',
          '</li>'
        ].join("");
      }).join("");
    }
  };

  var renderAll = function () {
    var data = store.getData();
    var collections = data.collections || {};
    renderMainHero(collections);
    renderMainDevelopment(collections);
    renderHandledItems(collections);
    renderCustomers(collections);
    renderResources(collections);
    renderNotices(collections);
    renderProductDetail(collections);
    bindContactForms();
    window.dispatchEvent(new CustomEvent("dpd:cms-rendered", { detail: { updatedAt: data.updatedAt || "" } }));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll, { once: true });
  } else {
    renderAll();
  }

  window.addEventListener("storage", function (event) {
    if (event.key === store.touchKey) {
      window.location.reload();
    }
  });
})(window, document);
