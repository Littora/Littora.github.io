(() => {
  "use strict";
  const site = document.querySelector(".fm-site");
  if (!site) return;
  site.classList.add("fm-js");
  const dialog = document.querySelector("[data-fm-dialog]");
  const nativeDialog = typeof HTMLDialogElement !== "undefined" && dialog instanceof HTMLDialogElement;
  let opener = null;
  document.querySelectorAll("[data-fm-download]").forEach((button) => {
    button.addEventListener("click", () => {
      opener = button;
      if (nativeDialog && typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
        site.classList.add("fm-modal-open");
      } else {
        window.alert(document.querySelector("#fm-dialog-body")?.textContent || "Framila is being submitted for App Store review. Please check back soon.");
      }
    });
  });
  document.querySelectorAll("[data-fm-dialog-close]").forEach((button) => {
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
      site.classList.remove("fm-modal-open");
      const target = opener?.isConnected && opener.getClientRects().length ? opener : document.querySelector("[data-fm-download]");
      target?.focus({preventScroll: true});
      opener = null;
    });
  }

  const picker = document.querySelector("[data-fm-frame-picker]");
  const frame = document.querySelector("[data-fm-live-frame]");
  const styles = new Set(["gallery", "keepsake", "portrait"]);
  picker?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-fm-frame]");
    const style = button?.dataset.fmFrame;
    if (!styles.has(style) || !frame) return;
    frame.dataset.frame = style;
    picker.querySelectorAll("button").forEach((control) => control.setAttribute("aria-pressed", String(control === button)));
    document.querySelectorAll("[data-fm-style-description]").forEach((description) => {
      description.hidden = description.dataset.fmStyleDescription !== style;
    });
  });

  const memoryPicker = document.querySelector("[data-fm-memory-picker]");
  const image = frame?.querySelector("[data-fm-memory-image]");
  const caption = frame?.querySelector("[data-fm-memory-caption]");
  const date = frame?.querySelector("[data-fm-memory-date]");
  const memoryStatus = document.querySelector("[data-fm-memory-status]");
  memoryPicker?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-fm-memory]");
    if (!button || !memoryPicker.contains(button) || !image || !caption || !date) return;
    image.src = button.dataset.fmImage;
    image.alt = button.dataset.fmAlt;
    caption.textContent = button.dataset.fmCaption;
    date.textContent = button.dataset.fmDate;
    memoryPicker.querySelectorAll("button").forEach((control) => control.setAttribute("aria-pressed", String(control === button)));
    if (memoryStatus) memoryStatus.textContent = `${button.dataset.fmCaption} · ${button.dataset.fmDate}`;
  });

  const flip = document.querySelector("[data-fm-flip]");
  const front = document.querySelector("[data-fm-story-front]");
  const back = document.querySelector("[data-fm-story-back]");
  const status = document.querySelector("#fm-story-status");
  flip?.addEventListener("click", () => {
    if (!front || !back || !status) return;
    const showFront = !back.hidden;
    front.hidden = !showFront;
    back.hidden = showFront;
    flip.setAttribute("aria-pressed", String(!showFront));
    status.textContent = showFront ? "The front · illustrative keepsake" : "The back · illustrative story & handwriting";
  });
})();
