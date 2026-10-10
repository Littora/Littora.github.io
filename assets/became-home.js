(() => {
  "use strict";
  const site = document.querySelector(".bc-site");
  if (!site) return;
  site.classList.add("bc-js");
  const menu = document.querySelector("[data-bc-menu]");
  const navigation = document.querySelector("[data-bc-navigation]");
  const closeMenu = () => {
    menu?.setAttribute("aria-expanded", "false");
    if (navigation) navigation.dataset.open = "false";
  };
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    navigation.dataset.open = String(open);
  });
  navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (menu?.getAttribute("aria-expanded") === "true" && event.target instanceof Node && !event.target.closest?.(".bc-header")) closeMenu();
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const dialog = document.querySelector("[data-bc-dialog]");
  const nativeDialog = typeof HTMLDialogElement !== "undefined" && dialog instanceof HTMLDialogElement;
  let opener = null;
  document.querySelectorAll("[data-bc-download]").forEach((button) => {
    button.addEventListener("click", () => {
      opener = button;
      closeMenu();
      if (nativeDialog && typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
        site.classList.add("bc-modal-open");
      } else {
        window.alert(document.querySelector("#bc-dialog-body")?.textContent || "Became is being submitted for App Store review. Please check back soon.");
      }
    });
  });
  document.querySelectorAll("[data-bc-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      if (nativeDialog && dialog.open) dialog.close();
    });
  });
  if (nativeDialog) {
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(dialog.querySelectorAll("button:not([disabled]), a[href]"))
        .filter((control) => control.getClientRects().length > 0);
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
      site.classList.remove("bc-modal-open");
      const target = opener?.isConnected && opener.getClientRects().length ? opener : menu;
      target?.focus({preventScroll: true});
      opener = null;
    });
  }

  const picker = document.querySelector(".bc-style-picker");
  const record = document.querySelector("[data-bc-live-record]");
  const allowedStyles = new Set(["gallery", "editorial", "postcard"]);
  picker?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-bc-presentation]");
    const style = button?.dataset.bcPresentation;
    if (!allowedStyles.has(style) || !record) return;
    picker.querySelectorAll("button").forEach((control) => control.setAttribute("aria-pressed", String(control === button)));
    record.dataset.presentation = style;
    document.querySelectorAll("[data-bc-style-description]").forEach((description) => {
      description.hidden = description.dataset.bcStyleDescription !== style;
    });
  });
})();
