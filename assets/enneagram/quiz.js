/* ============================================================
   LoneStar Support — Enneagram "Map" quiz: logic
   ------------------------------------------------------------
   Consumes globals ENNEAGRAM_QUESTIONS + ENNEAGRAM_AXES from
   questions.js (loaded first). Renders the sliders, scores them,
   draws the radar chart, and persists progress in localStorage.
   Everything runs in the browser; nothing is transmitted.
   ============================================================ */
(function () {
  "use strict";

  var form = document.getElementById("map-quiz");
  if (!form || typeof ENNEAGRAM_QUESTIONS === "undefined") return;

  var STORAGE_KEY = "lonestar-support-enneagram";
  var STORAGE_VERSION = 1;
  var QS = ENNEAGRAM_QUESTIONS;
  var AXES = ENNEAGRAM_AXES;
  var TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---------- helpers ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function emptyTypeMap() {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  }

  /* ---------- scoring ---------- */
  function countBulletsByType() {
    var c = emptyTypeMap();
    QS.forEach(function (q) { c[q.lo] += 1; c[q.hi] += 1; });
    return c;
  }
  var COUNTS = countBulletsByType();

  function accumulatePoints(values) {
    var pts = emptyTypeMap();
    QS.forEach(function (q, i) {
      var v = Number(values[i]);
      if (!isFinite(v)) v = 5;
      pts[q.lo] += (10 - v); // left end favors the lower type
      pts[q.hi] += v;        // right end favors the higher type
    });
    return pts;
  }

  // Per-type normalization (0..1): each type ÷ its own max possible.
  function computeScores(values) {
    var pts = accumulatePoints(values);
    var scores = {};
    TYPES.forEach(function (t) {
      var max = 10 * COUNTS[t];
      scores[t] = max > 0 ? pts[t] / max : 0.5;
    });
    return scores;
  }

  // High→low, tiebreak by type number. pct is integer 0..100.
  function rankTypes(scores) {
    return TYPES.map(function (t) {
      return { type: t, label: AXES[t], pct: Math.round(scores[t] * 100) };
    }).sort(function (a, b) { return b.pct - a.pct || a.type - b.type; });
  }

  // Plain-text summary handed to the contact form when "talk to a coach" is clicked.
  function buildResultsText(scores) {
    var top = rankTypes(scores).slice(0, 3).map(function (t, i) {
      return (i + 1) + ". Type " + t.type + " · " + t.label + " — " + t.pct + "%";
    });
    var all = TYPES.map(function (t) {
      return "Type " + t + " (" + AXES[t] + "): " + Math.round(scores[t] * 100) + "%";
    });
    return "My Enneagram map results (LoneStar Support map quiz):\n\n" +
      "Strongest patterns:\n" + top.join("\n") +
      "\n\nAll nine:\n" + all.join("\n");
  }

  /* ---------- persistence ---------- */
  function defaultValues() { return QS.map(function () { return 5; }); }

  function loadValues() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!raw) return defaultValues();
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return defaultValues(); }
    if (!parsed || parsed.v !== STORAGE_VERSION) return defaultValues();
    if (parsed.n !== QS.length) return defaultValues();
    if (!Array.isArray(parsed.values) || parsed.values.length !== QS.length) {
      return defaultValues();
    }
    return parsed.values.map(function (x) {
      var v = Math.round(Number(x));
      if (!isFinite(v)) return 5;
      return Math.max(0, Math.min(10, v));
    });
  }

  var saveTimer = null;
  function saveValues(values) {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          v: STORAGE_VERSION, n: QS.length, values: values
        }));
      } catch (e) { /* storage disabled/full — quiz still works in memory */ }
    }, 400);
  }

  /* ---------- slider aria text ---------- */
  function valueText(v, lowLabel, highLabel) {
    v = Number(v);
    if (v === 5) return "Neutral — balanced between both";
    if (v < 5) {
      var sl = v <= 1 ? "Strongly" : v <= 3 ? "Clearly" : "Slightly";
      return sl + " leans toward: " + lowLabel;
    }
    var sh = v >= 9 ? "Strongly" : v >= 7 ? "Clearly" : "Slightly";
    return sh + " leans toward: " + highLabel;
  }

  /* ---------- build the quiz ---------- */
  function groupByPairing() {
    var groups = [], byKey = {};
    QS.forEach(function (q, index) {
      var key = q.lo + "v" + q.hi;
      if (!byKey[key]) {
        byKey[key] = { lo: q.lo, hi: q.hi, items: [] };
        groups.push(byKey[key]);
      }
      byKey[key].items.push({ q: q, index: index });
    });
    return groups;
  }

  function renderQuiz(values) {
    var sliderBase =
      "mt-2 w-full cursor-pointer accent-terracotta focus-visible:outline " +
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";
    var html = groupByPairing().map(function (g) {
      var rows = g.items.map(function (it) {
        var q = it.q, i = it.index, v = values[i];
        var lo = escapeHtml(q.loLabel), hi = escapeHtml(q.hiLabel);
        var prompt = escapeHtml(q.prompt || "Which feels more true?");
        return (
          '<div class="border-t border-navy/10 pt-5 first:border-t-0 first:pt-0">' +
            '<label for="q' + i + '" class="block text-sm font-medium leading-snug text-ink/85">' +
              prompt +
              '<span class="sr-only"> Slide from &ldquo;' + lo + '&rdquo; on the left to &ldquo;' + hi + '&rdquo; on the right.</span>' +
            '</label>' +
            '<input type="range" id="q' + i + '" data-index="' + i + '" ' +
              'data-low="' + lo + '" data-high="' + hi + '" ' +
              'min="0" max="10" step="1" value="' + v + '" ' +
              'aria-valuetext="' + escapeHtml(valueText(v, q.loLabel, q.hiLabel)) + '" ' +
              'class="' + sliderBase + '">' +
            '<div class="mt-1 flex justify-between gap-4 text-xs leading-tight text-ink/70" aria-hidden="true">' +
              '<span class="max-w-[45%] text-left">' + lo + '</span>' +
              '<span class="max-w-[45%] text-right">' + hi + '</span>' +
            '</div>' +
          '</div>'
        );
      }).join("");

      return (
        '<fieldset class="mb-8 scroll-mt-24 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm sm:p-6">' +
          '<legend class="sr-only">Type ' + g.lo + ' vs Type ' + g.hi + ': ' + escapeHtml(AXES[g.lo]) + ' versus ' + escapeHtml(AXES[g.hi]) + '</legend>' +
          '<div class="mb-4">' +
            '<span class="block text-xs font-semibold uppercase tracking-wide text-terracotta">Type ' + g.lo + ' vs Type ' + g.hi + '</span>' +
            '<span class="mt-1 block font-serif text-lg font-semibold leading-snug text-navy">' +
              escapeHtml(AXES[g.lo]) + ' &nbsp;vs&nbsp; ' + escapeHtml(AXES[g.hi]) +
            '</span>' +
          '</div>' +
          '<div class="space-y-5">' + rows + '</div>' +
        '</fieldset>'
      );
    }).join("");

    form.innerHTML = html;
  }

  function renderAxisLegend() {
    var el = document.getElementById("map-axis-legend");
    if (!el) return;
    el.innerHTML = TYPES.map(function (t) {
      return '<li class="text-ink/75"><span class="font-semibold text-navy">' + t + '</span> &middot; ' + escapeHtml(AXES[t]) + '</li>';
    }).join("");
  }

  /* ---------- radar (spider) chart ---------- */
  function radarSummary(scores) {
    var top = rankTypes(scores).slice(0, 3).map(function (t) {
      return "Type " + t.type + " " + t.label + " at " + t.pct + " percent";
    });
    return "Your strongest patterns are " + top.join(", ") +
      ". The chart plots all nine type scores; a full table follows.";
  }

  function renderRadar(scores) {
    var wrap = document.getElementById("map-radar-wrap");
    if (!wrap) return;
    var SIZE = 320, CX = 160, CY = 160, MAX_R = 120, LABEL_R = 138, RINGS = 4;
    var N = TYPES.length, step = (Math.PI * 2) / N, start = -Math.PI / 2;

    function pt(r, i) {
      var a = start + i * step;
      return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
    }
    function nn(v) { return Math.round(v * 100) / 100; }

    var svg = [];
    svg.push('<svg viewBox="0 0 ' + SIZE + ' ' + SIZE + '" class="h-auto w-full" role="img" aria-labelledby="map-radar-title map-radar-desc">');
    svg.push('<title id="map-radar-title">Radar chart of your nine Enneagram scores.</title>');
    svg.push('<desc id="map-radar-desc">' + escapeHtml(radarSummary(scores)) + '</desc>');

    // grid rings (9-gons)
    for (var ring = 1; ring <= RINGS; ring++) {
      var rr = (MAX_R * ring) / RINGS, rp = [];
      for (var i = 0; i < N; i++) { var p = pt(rr, i); rp.push(nn(p.x) + "," + nn(p.y)); }
      svg.push('<polygon points="' + rp.join(" ") + '" fill="none" stroke="#A8CABA" stroke-width="1" opacity="0.5" />');
    }
    // radial axes
    for (var j = 0; j < N; j++) {
      var e = pt(MAX_R, j);
      svg.push('<line x1="' + CX + '" y1="' + CY + '" x2="' + nn(e.x) + '" y2="' + nn(e.y) + '" stroke="#A8CABA" stroke-width="1" opacity="0.6" />');
    }
    // data polygon
    var dp = [], verts = [];
    for (var k = 0; k < N; k++) {
      var sc = Math.max(0, Math.min(1, scores[TYPES[k]]));
      var d = pt(sc * MAX_R, k);
      dp.push(nn(d.x) + "," + nn(d.y));
      verts.push(d);
    }
    svg.push('<polygon points="' + dp.join(" ") + '" fill="#C8102E" fill-opacity="0.18" stroke="#001F3F" stroke-width="2" stroke-linejoin="round" />');
    verts.forEach(function (v) {
      svg.push('<circle cx="' + nn(v.x) + '" cy="' + nn(v.y) + '" r="3.5" fill="#C8102E" stroke="#fff" stroke-width="1" />');
    });
    // numbered spoke labels (just the digit — clip-free; legend maps number→phrase)
    for (var m = 0; m < N; m++) {
      var lp = pt(LABEL_R, m);
      svg.push('<text x="' + nn(lp.x) + '" y="' + nn(lp.y) + '" dy="0.32em" text-anchor="middle" font-size="13" font-weight="700" fill="#001F3F">' + TYPES[m] + '</text>');
    }
    svg.push("</svg>");
    wrap.innerHTML = svg.join("");
  }

  function renderTopTypes(scores) {
    var ol = document.getElementById("map-top-types");
    if (!ol) return;
    ol.innerHTML = rankTypes(scores).slice(0, 3).map(function (t, i) {
      return (
        '<li class="rounded-xl border border-navy/10 bg-cream/60 p-4">' +
          '<div class="flex items-baseline justify-between gap-3">' +
            '<span class="font-serif text-base font-semibold text-navy">' + (i + 1) + '. Type ' + t.type + ' &middot; ' + escapeHtml(t.label) + '</span>' +
            '<span class="text-sm font-semibold text-terracotta">' + t.pct + '%</span>' +
          '</div>' +
          '<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy/10" aria-hidden="true">' +
            '<div class="h-full rounded-full bg-terracotta" style="width:' + t.pct + '%"></div>' +
          '</div>' +
        '</li>'
      );
    }).join("");
  }

  function renderTable(scores) {
    var tbody = document.getElementById("map-score-table");
    if (!tbody) return;
    tbody.innerHTML = TYPES.map(function (t) {
      var pct = Math.round(scores[t] * 100);
      return (
        '<tr class="border-b border-navy/10">' +
          '<th scope="row" class="py-2 pr-4 font-medium text-navy">Type ' + t + '</th>' +
          '<td class="py-2 pr-4 text-ink/80">' + escapeHtml(AXES[t]) + '</td>' +
          '<td class="py-2 font-semibold text-ink/90">' + pct + '%</td>' +
        '</tr>'
      );
    }).join("");
  }

  function recompute(values) {
    var scores = computeScores(values);
    renderRadar(scores);
    renderTopTypes(scores);
    renderTable(scores);
  }

  /* ---------- wiring ---------- */
  var values = loadValues();
  renderQuiz(values);
  renderAxisLegend();

  var sliders = Array.prototype.slice.call(form.querySelectorAll('input[type="range"]'));
  var total = sliders.length;
  var touched = {};
  var touchedCount = 0;
  var resultsShown = false;

  var resultsEl = document.getElementById("map-results");
  var resultsHeading = document.getElementById("map-results-heading");
  var progressEl = document.querySelector("#map-progress strong");
  var totalEl = document.querySelector("#map-progress [data-total]");
  if (totalEl) totalEl.textContent = String(total);

  form.addEventListener("input", function (e) {
    var input = e.target;
    if (!input || input.type !== "range") return;
    var i = Number(input.dataset.index);
    var v = Number(input.value);
    values[i] = v;
    input.setAttribute("aria-valuetext", valueText(v, input.dataset.low, input.dataset.high));
    if (!touched[i]) { touched[i] = true; touchedCount += 1; if (progressEl) progressEl.textContent = String(touchedCount); }
    saveValues(values);
    if (resultsShown) recompute(values);
  });

  function showResults() {
    recompute(values);
    if (resultsEl) {
      resultsEl.hidden = false;
      resultsShown = true;
      if (resultsHeading) resultsHeading.focus({ preventScroll: true });
      resultsEl.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    }
  }

  var submitBtn = document.getElementById("map-submit");
  if (submitBtn) submitBtn.addEventListener("click", showResults);
  form.addEventListener("submit", function (e) { e.preventDefault(); showResults(); });

  var retakeBtn = document.getElementById("map-retake");
  if (retakeBtn) {
    retakeBtn.addEventListener("click", function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      values = defaultValues();
      sliders.forEach(function (s) {
        s.value = 5;
        s.setAttribute("aria-valuetext", valueText(5, s.dataset.low, s.dataset.high));
      });
      touched = {}; touchedCount = 0;
      if (progressEl) progressEl.textContent = "0";
      resultsShown = false;
      if (resultsEl) resultsEl.hidden = true;
      if (sliders[0]) sliders[0].focus({ preventScroll: true });
      form.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  }

  // "Talk it through with a coach" → stash current results for the contact form.
  var coachLink = document.getElementById("map-coach-link");
  if (coachLink) {
    coachLink.addEventListener("click", function () {
      try {
        sessionStorage.setItem("lonestar-support-enneagram-results", buildResultsText(computeScores(values)));
      } catch (e) { /* navigation still proceeds without prefill */ }
    });
  }

  // If hydrated from storage, reflect any prior progress count.
  values.forEach(function (v, i) { if (v !== 5) { touched[i] = true; touchedCount += 1; } });
  if (progressEl) progressEl.textContent = String(touchedCount);
})();
