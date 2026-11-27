(() => {
  "use strict";
  const site = document.querySelector(".fm-site");
  if (!site) return;
  site.classList.add("fm-js");

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
