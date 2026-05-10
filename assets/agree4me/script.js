(function () {
  "use strict";

  const SECTION_KEYS = ["likes", "dislikes", "agrees"];
  const SECTION_LABELS = {
    likes: "I like",
    dislikes: "I don't like",
    agrees: "I agree",
  };
  const SECTION_PLACEHOLDERS = {
    likes: "Something you like",
    dislikes: "Something you don't like",
    agrees: "Something you agree to",
  };
  const SECTION_INPUT_LABELS = {
    likes: "Something you like",
    dislikes: "Something you don't like",
    agrees: "Something you agree to",
  };

  let signaturePad = null;
  let identityRevealed = false;
  let toastTimer = null;

  document.addEventListener("DOMContentLoaded", function () {
    initLists();
    initIdentityToggle();
    initSignaturePad();
    initActions();
    applyHashIfPresent();
    syncOnlyRowFlags();
  });

  function initLists() {
    SECTION_KEYS.forEach(function (key) {
      const list = document.querySelector(
        '.bullet-list[data-section="' + key + '"]'
      );
      const addButton = document.querySelector(
        '.add-row[data-section="' + key + '"]'
      );
      if (!list || !addButton) return;

      addButton.addEventListener("click", function () {
        const row = appendRow(list, key, "");
        const input = row.querySelector("input");
        if (input) input.focus();
      });

      list.addEventListener("click", function (event) {
        const target = event.target;
        if (
          target instanceof HTMLElement &&
          target.classList.contains("remove-row")
        ) {
          removeRow(list, target.closest("li"), key);
        }
      });

      list.addEventListener("keydown", function (event) {
        if (!(event.target instanceof HTMLInputElement)) return;
        if (event.key === "Enter") {
          event.preventDefault();
          const items = list.querySelectorAll("li.bullet-row");
          const lastInput = items[items.length - 1].querySelector("input");
          if (event.target === lastInput) {
            const row = appendRow(list, key, "");
            const input = row.querySelector("input");
            if (input) input.focus();
          } else {
            const next = event.target
              .closest("li.bullet-row")
              .nextElementSibling;
            if (next) {
              const nextInput = next.querySelector("input");
              if (nextInput) nextInput.focus();
            }
          }
        } else if (event.key === "Escape") {
          event.target.value = "";
        }
      });
    });
  }

  function appendRow(list, sectionKey, value) {
    const li = document.createElement("li");
    li.className = "bullet-row";

    const input = document.createElement("input");
    input.type = "text";
    input.value = value || "";
    input.setAttribute("aria-label", SECTION_INPUT_LABELS[sectionKey]);
    input.placeholder = SECTION_PLACEHOLDERS[sectionKey];

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-row no-print";
    remove.setAttribute("aria-label", "Remove this item");
    remove.innerHTML = "&times;";

    li.appendChild(input);
    li.appendChild(remove);
    list.appendChild(li);
    syncOnlyRowFlag(list);
    return li;
  }

  function removeRow(list, li, sectionKey) {
    if (!li) return;
    const rows = list.querySelectorAll("li.bullet-row");
    if (rows.length <= 1) {
      const input = li.querySelector("input");
      if (input) input.value = "";
      return;
    }
    li.remove();
    syncOnlyRowFlag(list);
  }

  function syncOnlyRowFlags() {
    document.querySelectorAll(".bullet-list").forEach(syncOnlyRowFlag);
  }

  function syncOnlyRowFlag(list) {
    const rows = list.querySelectorAll("li.bullet-row");
    if (rows.length <= 1) {
      list.setAttribute("data-only-row", "true");
    } else {
      list.removeAttribute("data-only-row");
    }
  }

  function initIdentityToggle() {
    const button = document.getElementById("toggle-identity");
    const fields = document.getElementById("identity-fields");
    const dateInput = document.getElementById("signed-date");
    if (!button || !fields || !dateInput) return;

    button.addEventListener("click", function () {
      const next = button.getAttribute("aria-pressed") !== "true";
      setIdentityRevealed(next);
    });
  }

  function setIdentityRevealed(revealed, options) {
    options = options || {};
    const button = document.getElementById("toggle-identity");
    const fields = document.getElementById("identity-fields");
    const dateInput = document.getElementById("signed-date");
    if (!button || !fields || !dateInput) return;

    identityRevealed = revealed;
    button.setAttribute("aria-pressed", revealed ? "true" : "false");
    fields.hidden = !revealed;

    if (revealed && !dateInput.value && !options.skipDateDefault) {
      dateInput.value = todayIsoDate();
    }

    const label = button.querySelector(".toggle-label");
    if (label) {
      label.textContent = revealed
        ? "Hide printed name and date"
        : "Add printed name and date";
    }
  }

  function todayIsoDate() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
  }

  function initSignaturePad() {
    const canvas = document.getElementById("signature-pad");
    const clearBtn = document.getElementById("clear-signature");
    if (!canvas || typeof window.SignaturePad === "undefined") return;

    signaturePad = new window.SignaturePad(canvas, {
      backgroundColor: "rgba(0,0,0,0)",
      penColor: getComputedStyle(document.body).color || "#1a1d24",
      minWidth: 0.6,
      maxWidth: 2.2,
    });

    resizeCanvas(canvas);
    let resizeRaf = 0;
    window.addEventListener("resize", function () {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () {
        resizeCanvas(canvas);
      });
    });

    if (window.matchMedia) {
      const dark = window.matchMedia("(prefers-color-scheme: dark)");
      const onSchemeChange = function () {
        signaturePad.penColor =
          getComputedStyle(document.body).color || "#1a1d24";
      };
      if (dark.addEventListener) dark.addEventListener("change", onSchemeChange);
      else if (dark.addListener) dark.addListener(onSchemeChange);
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (signaturePad) signaturePad.clear();
      });
    }
  }

  function resizeCanvas(canvas) {
    if (!signaturePad) return;
    const data = signaturePad.toData();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);
    signaturePad.clear();
    if (data && data.length) signaturePad.fromData(data);
  }

  function initActions() {
    const printBtn = document.getElementById("print-button");
    const pdfBtn = document.getElementById("pdf-button");
    const shareBtn = document.getElementById("share-button");
    const resetBtn = document.getElementById("reset-button");

    if (printBtn) printBtn.addEventListener("click", handlePrint);
    if (pdfBtn) pdfBtn.addEventListener("click", handleDownloadPdf);
    if (shareBtn) shareBtn.addEventListener("click", handleShareLink);
    if (resetBtn) resetBtn.addEventListener("click", handleReset);

    window.addEventListener("afterprint", function () {
      clearPrintView();
    });
  }

  function collectData() {
    const data = { likes: [], dislikes: [], agrees: [] };
    SECTION_KEYS.forEach(function (key) {
      const list = document.querySelector(
        '.bullet-list[data-section="' + key + '"]'
      );
      if (!list) return;
      list.querySelectorAll("li.bullet-row input").forEach(function (input) {
        const value = (input.value || "").trim();
        if (value) data[key].push(value);
      });
    });

    if (identityRevealed) {
      const name = (document.getElementById("printed-name").value || "").trim();
      const date = (document.getElementById("signed-date").value || "").trim();
      if (name) data.name = name;
      if (date) data.date = date;
    }

    return data;
  }

  function buildPrintView(data, signaturePngOrNull) {
    const view = document.getElementById("print-view");
    if (!view) return null;
    view.innerHTML = "";
    fillPrintContainer(view, data, signaturePngOrNull);
    return view;
  }

  function fillPrintContainer(container, data, signaturePngOrNull) {
    container.innerHTML = "";

    const heading = document.createElement("h1");
    heading.textContent = "Belief Agreement";
    container.appendChild(heading);

    const meta = document.createElement("p");
    meta.className = "meta";
    const today = formatDateLong(todayIsoDate());
    meta.textContent = "Generated " + today;
    container.appendChild(meta);

    SECTION_KEYS.forEach(function (key) {
      const items = data[key];
      if (!items || !items.length) return;
      const section = document.createElement("section");
      const h2 = document.createElement("h2");
      h2.textContent = SECTION_LABELS[key];
      section.appendChild(h2);
      const ul = document.createElement("ul");
      items.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      section.appendChild(ul);
      container.appendChild(section);
    });

    const hasSignature = !!signaturePngOrNull;
    const hasName = !!data.name;
    const hasDate = !!data.date;

    if (hasSignature || hasName || hasDate) {
      const block = document.createElement("div");
      block.className = "signature-block";

      if (hasSignature) {
        const img = document.createElement("img");
        img.src = signaturePngOrNull;
        img.alt = "Signature";
        img.className = "signature";
        block.appendChild(img);
      }

      if (hasName || hasDate) {
        const line = document.createElement("p");
        line.className = "name-line";
        const parts = [];
        if (hasName) parts.push(data.name);
        if (hasDate) parts.push(formatDateLong(data.date));
        line.textContent = parts.join("  \u00b7  ");
        block.appendChild(line);
      }

      container.appendChild(block);
    }

    return container;
  }

  function clearPrintView() {
    const view = document.getElementById("print-view");
    if (view) view.innerHTML = "";
  }

  function formatDateLong(iso) {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) return iso;
    try {
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (_e) {
      return iso;
    }
  }

  function getSignaturePng() {
    if (!signaturePad || signaturePad.isEmpty()) return null;
    try {
      return signaturePad.toDataURL("image/png");
    } catch (_e) {
      return null;
    }
  }

  function handlePrint() {
    const data = collectData();
    const signature = getSignaturePng();
    if (!hasAnyContent(data, signature)) {
      showToast("Add at least one item or a signature before printing.");
      return;
    }
    buildPrintView(data, signature);
    setTimeout(function () {
      window.print();
    }, 0);
  }

  function handleDownloadPdf() {
    const data = collectData();
    const signature = getSignaturePng();
    if (!hasAnyContent(data, signature)) {
      showToast("Add at least one item or a signature before downloading.");
      return;
    }

    const html2canvas = window.html2canvas;
    const jsPDFCtor =
      (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null;
    if (!html2canvas || !jsPDFCtor) {
      showToast("PDF library failed to load. Please try again.");
      return;
    }

    const STAGE_WIDTH_PX = 720;
    const stage = document.createElement("div");
    stage.className = "pdf-stage";
    stage.style.width = STAGE_WIDTH_PX + "px";
    stage.style.padding = "0";
    stage.style.boxSizing = "border-box";
    stage.style.background = "#ffffff";
    stage.style.color = "#000000";
    stage.style.fontFamily =
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    stage.style.fontSize = "12pt";
    stage.style.lineHeight = "1.45";
    stage.style.position = "fixed";
    stage.style.left = "0";
    stage.style.top = "0";
    stage.style.zIndex = "-1";
    stage.style.opacity = "0";
    stage.style.pointerEvents = "none";
    stage.setAttribute("aria-hidden", "true");

    fillPrintContainer(stage, data, signature);
    styleStageContents(stage);
    document.body.appendChild(stage);

    const cleanup = function () {
      if (stage.parentNode) stage.parentNode.removeChild(stage);
    };

    const measuredWidth = stage.offsetWidth || STAGE_WIDTH_PX;
    const measuredHeight = stage.scrollHeight || stage.offsetHeight || 1;

    html2canvas(stage, {
      scale: 2,
      backgroundColor: "#ffffff",
      width: measuredWidth,
      height: measuredHeight,
      windowWidth: measuredWidth,
      windowHeight: measuredHeight,
      useCORS: true,
      logging: false,
    })
      .then(function (canvas) {
        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        const pdf = new jsPDFCtor({
          unit: "in",
          format: "letter",
          orientation: "portrait",
        });
        const pageWidthIn = pdf.internal.pageSize.getWidth();
        const pageHeightIn = pdf.internal.pageSize.getHeight();
        const marginIn = 0.5;
        const printableWidthIn = pageWidthIn - marginIn * 2;
        const printableHeightIn = pageHeightIn - marginIn * 2;

        const imgWidthIn = printableWidthIn;
        const pxPerIn = canvas.width / imgWidthIn;
        const imgHeightIn = canvas.height / pxPerIn;

        if (imgHeightIn <= printableHeightIn) {
          pdf.addImage(
            imgData,
            "JPEG",
            marginIn,
            marginIn,
            imgWidthIn,
            imgHeightIn
          );
        } else {
          let remainingHeightIn = imgHeightIn;
          let yOffsetIn = 0;
          while (remainingHeightIn > 0) {
            pdf.addImage(
              imgData,
              "JPEG",
              marginIn,
              marginIn - yOffsetIn,
              imgWidthIn,
              imgHeightIn
            );
            remainingHeightIn -= printableHeightIn;
            yOffsetIn += printableHeightIn;
            if (remainingHeightIn > 0) {
              pdf.addPage();
            }
          }
        }

        pdf.save("belief-agreement-" + todayIsoDate() + ".pdf");
        cleanup();
      })
      .catch(function () {
        cleanup();
        showToast("Could not generate PDF.");
      });
  }

  function styleStageContents(stage) {
    const h1 = stage.querySelector("h1");
    if (h1) {
      h1.style.fontSize = "20pt";
      h1.style.margin = "0 0 4pt";
    }
    const meta = stage.querySelector("p.meta");
    if (meta) {
      meta.style.color = "#444";
      meta.style.fontSize = "10pt";
      meta.style.margin = "0 0 14pt";
    }
    stage.querySelectorAll("section").forEach(function (s) {
      s.style.margin = "0 0 14pt";
      s.style.pageBreakInside = "avoid";
      s.style.breakInside = "avoid";
    });
    stage.querySelectorAll("section h2").forEach(function (h) {
      h.style.fontSize = "13pt";
      h.style.margin = "0 0 6pt";
    });
    stage.querySelectorAll("section ul").forEach(function (ul) {
      ul.style.margin = "0 0 10pt 18pt";
      ul.style.padding = "0";
      ul.style.listStyle = "disc";
    });
    stage.querySelectorAll("section ul li").forEach(function (li) {
      li.style.margin = "2pt 0";
    });
    const block = stage.querySelector(".signature-block");
    if (block) {
      block.style.marginTop = "20pt";
      block.style.pageBreakInside = "avoid";
      block.style.breakInside = "avoid";
    }
    const img = stage.querySelector(".signature-block img.signature");
    if (img) {
      img.style.display = "block";
      img.style.maxWidth = "320px";
      img.style.maxHeight = "120px";
      img.style.borderBottom = "1px solid #333";
      img.style.paddingBottom = "4px";
    }
    const nameLine = stage.querySelector(".signature-block .name-line");
    if (nameLine) {
      nameLine.style.marginTop = "6pt";
      nameLine.style.color = "#333";
    }
  }

  function hasAnyContent(data, signature) {
    if (signature) return true;
    if (data.name || data.date) return true;
    return SECTION_KEYS.some(function (key) {
      return data[key] && data[key].length > 0;
    });
  }

  function handleShareLink() {
    const data = collectData();
    const payload = {
      v: 1,
      likes: data.likes,
      dislikes: data.dislikes,
      agrees: data.agrees,
    };
    if (data.name) payload.name = data.name;
    if (data.date) payload.date = data.date;

    let encoded;
    try {
      encoded = utf8ToBase64(JSON.stringify(payload));
    } catch (_e) {
      showToast("Could not build share link.");
      return;
    }

    const url =
      window.location.origin +
      window.location.pathname +
      window.location.search +
      "#d=" +
      encoded;

    history.replaceState(null, "", "#d=" + encoded);

    copyToClipboard(url).then(
      function () {
        showToast("Share link copied to clipboard.");
      },
      function () {
        window.prompt("Copy this link:", url);
      }
    );
  }

  function copyToClipboard(text) {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error("execCommand failed"));
      } catch (e) {
        reject(e);
      }
    });
  }

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function base64ToUtf8(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  function applyHashIfPresent() {
    const hash = window.location.hash || "";
    if (!hash.startsWith("#d=")) return;
    const encoded = hash.slice(3);
    let payload;
    try {
      payload = JSON.parse(base64ToUtf8(encoded));
    } catch (_e) {
      return;
    }
    if (!payload || typeof payload !== "object") return;

    SECTION_KEYS.forEach(function (key) {
      const items = Array.isArray(payload[key]) ? payload[key] : [];
      const list = document.querySelector(
        '.bullet-list[data-section="' + key + '"]'
      );
      if (!list) return;

      list.querySelectorAll("li.bullet-row").forEach(function (li, idx) {
        if (idx > 0) li.remove();
      });
      const firstInput = list.querySelector("li.bullet-row input");
      if (firstInput) firstInput.value = "";

      if (items.length === 0) {
        syncOnlyRowFlag(list);
        return;
      }

      items.forEach(function (value, idx) {
        const safe = typeof value === "string" ? value : String(value || "");
        if (idx === 0) {
          if (firstInput) firstInput.value = safe;
        } else {
          appendRow(list, key, safe);
        }
      });
      syncOnlyRowFlag(list);
    });

    if (payload.name || payload.date) {
      setIdentityRevealed(true, { skipDateDefault: !!payload.date });
      if (payload.name) {
        const nameEl = document.getElementById("printed-name");
        if (nameEl) nameEl.value = String(payload.name);
      }
      if (payload.date) {
        const dateEl = document.getElementById("signed-date");
        if (dateEl) dateEl.value = String(payload.date);
      }
    }
  }

  function handleReset() {
    SECTION_KEYS.forEach(function (key) {
      const list = document.querySelector(
        '.bullet-list[data-section="' + key + '"]'
      );
      if (!list) return;
      list.querySelectorAll("li.bullet-row").forEach(function (li, idx) {
        if (idx > 0) li.remove();
      });
      const input = list.querySelector("li.bullet-row input");
      if (input) input.value = "";
      syncOnlyRowFlag(list);
    });

    const nameEl = document.getElementById("printed-name");
    const dateEl = document.getElementById("signed-date");
    if (nameEl) nameEl.value = "";
    if (dateEl) dateEl.value = "";
    setIdentityRevealed(false);

    if (signaturePad) signaturePad.clear();

    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    showToast("Form cleared.");
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.setAttribute("data-visible", "true");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.removeAttribute("data-visible");
      setTimeout(function () {
        toast.hidden = true;
      }, 250);
    }, 1800);
  }
})();
