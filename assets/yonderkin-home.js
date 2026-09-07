(() => {
  document.documentElement.classList.add("js");

  const header = document.querySelector("[data-site-header]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-site-nav]");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    const label = menuButton.querySelector(".menu-toggle__label");
    if (label) label.textContent = "Menu";
    navigation.removeAttribute("data-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      const label = menuButton.querySelector(".menu-toggle__label");
      if (label) label.textContent = open ? "Menu" : "Close";
      if (open) navigation.removeAttribute("data-open");
      else navigation.setAttribute("data-open", "");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  document.querySelectorAll("[data-coming-soon]").forEach((button) => {
    button.addEventListener("click", () => {
      closeMenu();
      window.alert("Yonderkin is coming soon to the App Store for iPhone.");
    });
  });

  const updateHeader = () => {
    if (header) header.toggleAttribute("data-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.setAttribute("data-visible", ""));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-visible", "");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -5%", threshold: 0.04 }
    );

    reveals.forEach((element) => revealObserver.observe(element));
  }

  // Anchor targets remain visible even before their reveal observer fires.
  const revealTarget = (hash) => {
    if (!hash || hash === "#") return;
    let target;
    try {
      target = document.querySelector(hash);
    } catch (_) {
      return;
    }
    if (!target) return;
    if (target.classList.contains("reveal")) target.setAttribute("data-visible", "");
    target.querySelectorAll(".reveal").forEach((item) => item.setAttribute("data-visible", ""));
  };

  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"], a[href*="/apps/yonderkin/#"]') : null;
    if (!(link instanceof HTMLAnchorElement)) return;
    const url = new URL(link.href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    revealTarget(url.hash);
  });

  if (window.location.hash) revealTarget(window.location.hash);
  window.addEventListener("hashchange", () => revealTarget(window.location.hash));

  const productTour = document.querySelector("[data-product-tour]");
  if (productTour) {
    const tabs = Array.from(productTour.querySelectorAll("[data-tour-tab]"));
    const panels = Array.from(productTour.querySelectorAll("[data-tour-panel]"));

    const activateTab = (tab, focus = false) => {
      const id = tab.dataset.tourTab;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.tourPanel !== id;
      });
      if (focus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        activateTab(tabs[nextIndex], true);
      });
    });
  }

  const characterBrowser = document.querySelector("[data-character-browser]");
  if (characterBrowser) {
    const filters = characterBrowser.querySelectorAll("[data-character-filter]");
    const people = characterBrowser.querySelectorAll("[data-character-kind]");

    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const kind = filter.dataset.characterFilter || "all";
        filters.forEach((item) => item.setAttribute("aria-pressed", String(item === filter)));
        people.forEach((person) => {
          person.hidden = kind !== "all" && person.dataset.characterKind !== kind;
        });
      });
    });
  }

  const firstMeeting = document.querySelector("[data-first-meeting]");
  if (firstMeeting) {
    const matchOptions = firstMeeting.querySelectorAll("[data-match-option]");
    const matchResult = firstMeeting.querySelector("[data-match-result]");
    const resultImage = firstMeeting.querySelector("[data-match-result] [data-match-image]");
    const resultKind = firstMeeting.querySelector("[data-match-result] [data-match-kind]");
    const resultName = firstMeeting.querySelector("[data-match-result] [data-match-name]");
    const resultBody = firstMeeting.querySelector("[data-match-result] [data-match-body]");
    const resultLink = firstMeeting.querySelector("[data-match-result] [data-match-link]");

    if (matchResult && resultImage instanceof HTMLImageElement) {
      matchOptions.forEach((option) => {
        option.addEventListener("click", () => {
          matchOptions.forEach((item) => item.setAttribute("aria-pressed", String(item === option)));
          matchResult.dataset.matchId = option.dataset.matchId || "";
          resultImage.src = option.dataset.matchImage || resultImage.src;
          resultImage.alt = option.dataset.matchAlt || "";
          if (resultKind) resultKind.textContent = option.dataset.matchKind || "";
          if (resultName) resultName.textContent = option.dataset.matchName || "";
          if (resultBody) resultBody.textContent = option.dataset.matchBody || "";
          if (resultLink instanceof HTMLAnchorElement) resultLink.href = `#kin-${option.dataset.matchId || ""}`;
        });
      });
    }
  }

  const mobileLaunch = document.querySelector("[data-mobile-launch]");
  const hero = document.querySelector(".hero");
  const closing = document.querySelector(".closing");

  if (mobileLaunch && "IntersectionObserver" in window && hero && closing) {
    const visibility = { hero: true, closing: false };
    const updateMobileLaunch = () => {
      mobileLaunch.toggleAttribute("data-hidden", visibility.hero || visibility.closing);
    };
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) visibility.hero = entry.isIntersecting;
        if (entry.target === closing) visibility.closing = entry.isIntersecting;
      });
      updateMobileLaunch();
    }, { threshold: 0.08 });
    mobileObserver.observe(hero);
    mobileObserver.observe(closing);
    updateMobileLaunch();
  }
})();
