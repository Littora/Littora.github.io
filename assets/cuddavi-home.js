(() => {
  document.documentElement.classList.add("cuddavi-js");

  const header = document.querySelector("[data-cuddavi-header]");
  const menu = document.querySelector("[data-cuddavi-menu]");
  const navigation = document.querySelector("[data-cuddavi-nav]");

  const closeMenu = () => {
    if (!menu || !navigation) return;
    menu.setAttribute("aria-expanded", "false");
    const label = menu.querySelector("span");
    if (label) label.textContent = "Menu";
    navigation.removeAttribute("data-open");
  };

  if (menu && navigation) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      const label = menu.querySelector("span");
      if (label) label.textContent = open ? "Menu" : "Close";
      navigation.toggleAttribute("data-open", !open);
    });
    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.closest("a, button")) closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!navigation.hasAttribute("data-open")) return;
      if (navigation.contains(event.target) || menu.contains(event.target)) return;
      closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const updateHeader = () => header?.toggleAttribute("data-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const dialog = document.querySelector("[data-cuddavi-dialog]");
  const downloadButtons = document.querySelectorAll("[data-cuddavi-download]");
  const closeButtons = document.querySelectorAll("[data-cuddavi-dialog-close]");
  let returnFocus = null;

  const closeDialog = () => {
    if (dialog instanceof HTMLDialogElement && dialog.open) dialog.close();
  };

  downloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeMenu();
      returnFocus = button;
      if (dialog instanceof HTMLDialogElement && typeof dialog.showModal === "function") {
        dialog.showModal();
        const firstClose = dialog.querySelector("[data-cuddavi-dialog-close]");
        if (firstClose instanceof HTMLElement) firstClose.focus();
      }
    });
  });
  closeButtons.forEach((button) => button.addEventListener("click", closeDialog));

  if (dialog instanceof HTMLDialogElement) {
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) closeDialog();
    });
    dialog.addEventListener("close", () => {
      if (returnFocus instanceof HTMLElement) returnFocus.focus();
      returnFocus = null;
    });
  }

  const careResponses = {
    feed: "A happy little nibble.",
    play: "That was fun!",
    rest: "A peaceful pause."
  };
  const careResponse = document.querySelector("[data-care-response]");
  document.querySelectorAll("[data-care-action]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-care-action]").forEach((item) => item.removeAttribute("data-selected"));
      button.setAttribute("data-selected", "");
      if (careResponse) careResponse.textContent = careResponses[button.dataset.careAction] || "";
    });
  });

  const companionImage = document.querySelector("[data-companion-image]");
  const companionName = document.querySelector("[data-companion-name]");
  const companionOrigin = document.querySelector("[data-companion-origin]");
  const companionPersonality = document.querySelector("[data-companion-personality]");
  const companionPortrait = companionImage?.parentElement;
  let companionSheenTimer = null;
  document.querySelectorAll("[data-companion]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-companion]").forEach((item) => item.setAttribute("aria-selected", "false"));
      button.setAttribute("aria-selected", "true");
      if (companionImage instanceof HTMLImageElement) {
        clearTimeout(companionSheenTimer);
        companionPortrait?.removeAttribute("data-sheen");
        const imagePath = button.dataset.image || companionImage.getAttribute("src");
        companionImage.src = imagePath;
        companionImage.alt = button.dataset.name || "Cuddavi companion";
        companionImage.decode().then(() => {
          // A rapid second selection should not animate the previous companion.
          if (companionImage.getAttribute("src") !== imagePath
            || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          companionPortrait?.setAttribute("data-sheen", "");
          companionSheenTimer = setTimeout(() => {
            companionPortrait?.removeAttribute("data-sheen");
          }, 1400);
        }).catch(() => {
          // The next selection remains usable if an image fails to decode.
        });
      }
      if (companionName) companionName.textContent = button.dataset.name || "";
      if (companionOrigin) companionOrigin.textContent = button.dataset.origin || "";
      if (companionPersonality) companionPersonality.textContent = button.dataset.personality || "";
    });
  });

  document.querySelectorAll(".cuddavi-faq details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".cuddavi-faq details[open]").forEach((openItem) => {
        if (openItem !== item) openItem.removeAttribute("open");
      });
    });
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".cuddavi-reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((item) => item.setAttribute("data-visible", ""));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-visible", "");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -5%", threshold: 0.06 });
    reveals.forEach((item) => observer.observe(item));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
