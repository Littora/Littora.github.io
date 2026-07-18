(function () {
  "use strict";

  var languageSelector = document.querySelector("[data-language-selector]");
  if (languageSelector) {
    languageSelector.addEventListener("change", function () {
      var option = languageSelector.options[languageSelector.selectedIndex];
      if (!option || !option.value) return;

      try {
        window.localStorage.setItem("chatura-language", option.dataset.locale || "en");
      } catch (error) {
        // Language switching still works when browser storage is unavailable.
      }

      window.location.assign(option.value);
    });
  }

  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var track = carousel.querySelector(".product-preview__shot-track");
    var previous = carousel.querySelector(".product-preview__control--prev");
    var next = carousel.querySelector(".product-preview__control--next");
    var dots = carousel.querySelector(".product-preview__dots");

    if (track && previous && next) {
      var images = track.querySelectorAll("img");
      var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      var getBehavior = function () {
        return reducedMotion.matches ? "auto" : "smooth";
      };

      var getStep = function () {
        var firstImage = track.querySelector("img");
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || "0");
        if (!firstImage) return track.clientWidth * 0.82;
        return firstImage.getBoundingClientRect().width + gap;
      };

      var syncControl = function (control, isDisabled) {
        if (!isDisabled) {
          control.dataset.hasAppeared = "true";
        }

        var shouldHide = isDisabled && control.dataset.hasAppeared !== "true";
        control.disabled = isDisabled;
        control.classList.toggle("is-hidden", shouldHide);
        return shouldHide;
      };

      var syncControls = function () {
        var maxScroll = Math.max(track.scrollWidth - track.clientWidth - 2, 0);
        var previousHidden = syncControl(previous, track.scrollLeft <= 2);
        var nextHidden = syncControl(next, track.scrollLeft >= maxScroll);
        carousel.classList.toggle("is-at-start", previousHidden);
        carousel.classList.toggle("is-at-end", nextHidden);

        var step = getStep();
        var current = Math.min(Math.max(Math.round(track.scrollLeft / step), 0), images.length - 1);
        if (dots) {
          dots.querySelectorAll("button").forEach(function (dot, index) {
            var isCurrent = index === current;
            dot.classList.toggle("is-current", isCurrent);
            if (isCurrent) {
              dot.setAttribute("aria-current", "true");
            } else {
              dot.removeAttribute("aria-current");
            }
          });
        }
      };

      var requestSyncControls = function () {
        window.requestAnimationFrame(syncControls);
      };

      previous.addEventListener("click", function () {
        track.scrollBy({ left: -getStep(), behavior: getBehavior() });
      });

      next.addEventListener("click", function () {
        track.scrollBy({ left: getStep(), behavior: getBehavior() });
      });

      if (dots) {
        var dotLabel = carousel.dataset.dotLabel || "Show screenshot {current} of {total}";
        images.forEach(function (_, index) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute(
            "aria-label",
            dotLabel.replace("{current}", index + 1).replace("{total}", images.length)
          );
          dot.addEventListener("click", function () {
            track.scrollTo({ left: getStep() * index, behavior: getBehavior() });
          });
          dots.appendChild(dot);
        });
      }

      track.addEventListener("scroll", syncControls, { passive: true });
      window.addEventListener("resize", requestSyncControls);
      window.addEventListener("load", requestSyncControls);

      images.forEach(function (image) {
        if (image.complete) {
          requestSyncControls();
          return;
        }

        image.addEventListener("load", requestSyncControls, { once: true });
        image.addEventListener("error", requestSyncControls, { once: true });
      });

      requestSyncControls();
    }
  }

  var version = document.querySelector("[data-app-version]");
  var release = document.querySelector("[data-app-release]");
  var script = document.currentScript;
  if (!version || !release || !script || !window.fetch) return;

  fetch("https://itunes.apple.com/lookup?id=6758027835&country=us")
    .then(function (response) {
      if (!response.ok) throw new Error("App Store lookup failed");
      return response.json();
    })
    .then(function (data) {
      var app = data && data.results && data.results[0];
      if (!app || !app.version) return;

      var versionTemplate = script.dataset.versionTemplate || "Version {version}";
      version.textContent = versionTemplate.replace("{version}", app.version);

      if (app.currentVersionReleaseDate) {
        var date = new Date(app.currentVersionReleaseDate);
        if (!Number.isNaN(date.getTime())) {
          var formatted = new Intl.DateTimeFormat(document.documentElement.lang || "en", {
            year: "numeric",
            month: "short",
            day: "numeric"
          }).format(date);
          var releaseTemplate = script.dataset.releaseTemplate || "Latest update {date}.";
          release.textContent = releaseTemplate.replace("{date}", formatted);
        }
      }
    })
    .catch(function () {
      // Evergreen fallback copy remains visible if the App Store is unavailable.
    });
})();
