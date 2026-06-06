(function () {
  "use strict";

  // TODO(GA): set GA_MEASUREMENT_ID to your "G-XXXXXXX" id when you have one.
  // While null, no Google Analytics scripts are loaded on any page.
  var GA_MEASUREMENT_ID = null;

  var NAV_PARTIAL = "partials/navbar.html";
  var FOOTER_PARTIAL = "partials/footer.html";

  function initAnalytics() {
    if (!GA_MEASUREMENT_ID) {
      return;
    }
    var loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(loader);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  function resolvePartialPath(path) {
    var pathname = window.location.pathname || "/";
    var dir = pathname.replace(/\/[^/]*$/, "");
    var segments = dir.split("/").filter(Boolean);
    var prefix = segments.length <= 1 ? "" : new Array(segments.length).join("../");
    return prefix + path;
  }

  function setYear() {
    var nodes = document.querySelectorAll("[data-current-year]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  function injectPartial(containerId, url) {
    var el = document.getElementById(containerId);
    if (!el) {
      return Promise.resolve();
    }
    el.classList.add("is-loading");
    el.setAttribute("aria-busy", "true");
    return fetch(url, { credentials: "same-origin", cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        el.removeAttribute("aria-busy");
        el.classList.remove("is-loading");
        setYear();
        initMobileNav();
      })
      .catch(function () {
        el.removeAttribute("aria-busy");
        el.classList.remove("is-loading");
        el.innerHTML =
          '<p class="bg-cream px-4 py-6 text-center text-sm text-ink/80" role="alert">We could not load this section. Refresh the page, or preview using a local web server (opening HTML as file URLs often blocks includes).</p>';
      });
  }

  function mediaDesktop() {
    return window.matchMedia("(min-width: 768px)");
  }

  function isDesktop() {
    return mediaDesktop().matches;
  }

  function setToggleIcons(toggle, menuOpen) {
    var openIcon = toggle.querySelector("[data-icon-open]");
    var closeIcon = toggle.querySelector("[data-icon-close]");
    if (!openIcon || !closeIcon) {
      return;
    }
    if (menuOpen) {
      openIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
    } else {
      openIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
    }
  }

  function syncMenu() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) {
      return;
    }

    if (isDesktop()) {
      menu.classList.remove("hidden");
      menu.classList.remove("grid");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      setToggleIcons(toggle, false);
      return;
    }

    var expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      menu.classList.remove("hidden");
      menu.classList.add("grid");
    } else {
      menu.classList.add("hidden");
      menu.classList.remove("grid");
    }
    toggle.setAttribute("aria-label", expanded ? "Close menu" : "Open menu");
    setToggleIcons(toggle, expanded);
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu || toggle.dataset.bound === "1") {
      syncMenu();
      return;
    }

    toggle.dataset.bound = "1";

    toggle.addEventListener("click", function () {
      if (isDesktop()) {
        return;
      }
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      syncMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !isDesktop()) {
        toggle.setAttribute("aria-expanded", "false");
        syncMenu();
        toggle.focus();
      }
    });

    menu.addEventListener("click", function (e) {
      if (isDesktop()) {
        return;
      }
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        syncMenu();
      }
    });

    window.addEventListener("resize", syncMenu, { passive: true });
    var mql = mediaDesktop();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", syncMenu);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(syncMenu);
    }

    syncMenu();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var navUrl = resolvePartialPath(NAV_PARTIAL);
    var footerUrl = resolvePartialPath(FOOTER_PARTIAL);
    injectPartial("site-nav", navUrl);
    injectPartial("site-footer", footerUrl);
    setYear();
    initAnalytics();
  });
})();
