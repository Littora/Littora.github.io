(() => {
  "use strict";
  if (!document.body.classList.contains("wf-site")) return;
  document.documentElement.classList.add("wf-js");

  const menu = document.querySelector("[data-wf-menu]");
  const navigation = document.querySelector("[data-wf-navigation]");
  const closeMenu = (restoreFocus = false) => {
    const wasOpen = menu?.getAttribute("aria-expanded") === "true";
    menu?.setAttribute("aria-expanded", "false");
    navigation?.removeAttribute("data-open");
    if (wasOpen && restoreFocus) menu?.focus();
  };
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    navigation?.toggleAttribute("data-open", open);
  });
  navigation?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button")) closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node) || !navigation?.hasAttribute("data-open")) return;
    if (!navigation.contains(event.target) && !menu?.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const dialog = document.querySelector("[data-wf-dialog]");
  const hasNativeDialog = typeof HTMLDialogElement !== "undefined" && dialog instanceof HTMLDialogElement;
  let dialogOpener = null;
  document.querySelectorAll("[data-wf-download]").forEach((button) => {
    button.addEventListener("click", () => {
      dialogOpener = button;
      closeMenu();
      if (hasNativeDialog && typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
        document.body.classList.add("wf-modal-open");
      } else {
        window.alert(document.querySelector("#wf-dialog-body")?.textContent || "WidgetFlair is being prepared for App Store review. Please check back after approval.");
      }
    });
  });
  document.querySelectorAll("[data-wf-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      if (hasNativeDialog && dialog.open) dialog.close();
    });
  });
  if (hasNativeDialog) {
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(dialog.querySelectorAll("button:not([disabled]), a[href]"))
        .filter((control) => control.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("wf-modal-open");
      const target = dialogOpener?.isConnected && dialogOpener.getClientRects().length ? dialogOpener : menu;
      target?.focus({ preventScroll: true });
      dialogOpener = null;
    });
  }

  const paletteControls = document.querySelector("[data-wf-palettes]");
  const announcement = document.querySelector("[data-wf-demo-announcement]");
  paletteControls?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const selected = event.target.closest("button[data-wf-palette]");
    if (!selected) return;
    paletteControls.querySelectorAll("button[data-wf-palette]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button === selected));
    });
    document.querySelectorAll("[data-wf-live-widget]").forEach((widget) => { widget.dataset.palette = selected.dataset.wfPalette; });
    paletteControls.querySelector("[data-wf-palette-name]").textContent = selected.dataset.wfPaletteLabel;
    if (announcement) announcement.textContent = `Studio clock preview: ${selected.dataset.wfPaletteLabel} palette.`;
  });
  document.querySelector("[data-wf-water-add]")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const widget = button.closest(".wf-widget");
    const counter = widget.querySelector("[data-wf-water-count]");
    const count = Math.min(8, Number(counter.textContent) + 1);
    counter.textContent = String(count);
    widget.querySelector("[data-wf-water-fill]").style.width = `${count / 8 * 100}%`;
    button.disabled = count === 8;
    widget.querySelector("[data-wf-water-caption]").textContent = count === 8 ? "your daily goal reached" : "glasses today";
    if (announcement) announcement.textContent = `Water ritual example: ${count} of 8 glasses.${count === 8 ? " Your daily goal is reached." : ""}`;
  });
  const filters = document.querySelector("[data-wf-filters]");
  const cards = Array.from(document.querySelectorAll("[data-wf-category]"));
  filters?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const selected = event.target.closest("button[data-wf-filter]");
    if (!selected) return;
    filters.querySelectorAll("button[data-wf-filter]").forEach((button) => { button.setAttribute("aria-pressed", String(button === selected)); });
    let visible = 0;
    cards.forEach((card) => {
      card.hidden = selected.dataset.wfFilter !== "all" && selected.dataset.wfFilter !== card.dataset.wfCategory;
      if (!card.hidden) visible += 1;
    });
    document.querySelector("[data-wf-filter-status]").textContent = `${visible} ${visible === 1 ? "design" : "designs"} to make your own`;
  });
})();
