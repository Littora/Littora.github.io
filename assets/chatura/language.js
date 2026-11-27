(function () {
  "use strict";

  function normalizeLanguage(value) {
    const language = (value || "").toLowerCase().split("-")[0];
    return language === "no" ? "nb" : language;
  }

  const current = normalizeLanguage(document.documentElement.lang);
  const routes = new Map();
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (link) {
    routes.set(link.hreflang, new URL(link.href).pathname);
  });

  const requested = normalizeLanguage(new URLSearchParams(location.search).get("lang"));
  const automatic = current === "en" && !document.currentScript.hasAttribute("data-manual-only");
  let preferred;
  try {
    if (routes.has(requested)) {
      localStorage.setItem("chatura-language", requested);
    } else if (automatic) {
      preferred = normalizeLanguage(localStorage.getItem("chatura-language"));
    }
  } catch (error) {
    // Explicit links and browser language detection also work without storage.
  }

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const target = routes.has(requested) ? requested : automatic
    ? [preferred, ...browserLanguages.map(normalizeLanguage)].find(language => routes.has(language))
    : current;

  if (target && target !== current) {
    location.replace(routes.get(target) + location.search + location.hash);
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const menu = document.querySelector("[data-language-menu]");
    if (!menu) return;

    document.addEventListener("click", function (event) {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });

    menu.addEventListener("keydown", function (event) {
      if (menu.open && event.key === "Escape") {
        menu.open = false;
        menu.querySelector("summary").focus();
      }
    });
  });
})();
