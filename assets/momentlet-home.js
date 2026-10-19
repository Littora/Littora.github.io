(() => {
  document.documentElement.classList.add("js");

  const header = document.querySelector("[data-momentlet-header]");
  const menu = document.querySelector("[data-momentlet-menu]");
  const navigation = document.querySelector("[data-momentlet-nav]");

  const closeMenu = () => {
    if (!menu || !navigation) return;
    menu.setAttribute("aria-expanded", "false");
    const label = menu.querySelector("span");
    if (label) label.textContent = "Menu";
    navigation.removeAttribute("data-open");
  };

  if (menu && navigation) {
    menu.addEventListener("click", () => {
      const isOpen = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!isOpen));
      const label = menu.querySelector("span");
      if (label) label.textContent = isOpen ? "Menu" : "Close";
      navigation.toggleAttribute("data-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!navigation.hasAttribute("data-open")) return;
      if (navigation.contains(event.target) || menu.contains(event.target)) return;
      closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const updateHeader = () => {
    if (header) header.toggleAttribute("data-scrolled", window.scrollY > 10);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.setAttribute("data-visible", ""));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-visible", "");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6%", threshold: 0.05 });

    reveals.forEach((element) => observer.observe(element));
  }

  document.querySelectorAll(".momentlet-faq details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".momentlet-faq details[open]").forEach((openItem) => {
        if (openItem !== item) openItem.removeAttribute("open");
      });
    });
  });
})();
