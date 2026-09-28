(() => {
  "use strict";
  if (!document.body.classList.contains("pickkin-site")) return;
  document.documentElement.classList.add("pickkin-js");

  const menu = document.querySelector("[data-pickkin-menu]");
  const navigation = document.querySelector("[data-pickkin-navigation]");
  const closeMenu = (restoreFocus = false) => {
    if (!menu || !navigation) return;
    const wasOpen = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", "false");
    navigation.removeAttribute("data-open");
    if (wasOpen && restoreFocus) menu.focus();
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
  window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });

  const dialog = document.querySelector("[data-pickkin-dialog]");
  let dialogOpener = null;
  document.querySelectorAll("[data-pickkin-download]").forEach((button) => {
    button.addEventListener("click", () => {
      dialogOpener = button;
      closeMenu();
      if (dialog instanceof HTMLDialogElement && typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
        document.body.classList.add("pickkin-modal-open");
      } else {
        window.alert(document.querySelector("#pickkin-dialog-body")?.textContent || "Pickkin is being prepared for App Store review. Please check back after approval.");
      }
    });
  });
  document.querySelectorAll("[data-pickkin-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      if (dialog instanceof HTMLDialogElement && dialog.open) dialog.close();
    });
  });
  if (dialog instanceof HTMLDialogElement) {
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
      document.body.classList.remove("pickkin-modal-open");
      const target = dialogOpener?.isConnected && dialogOpener.getClientRects().length ? dialogOpener : menu;
      target?.focus({ preventScroll: true });
      dialogOpener = null;
    });
  }

  const demo = document.querySelector("[data-pickkin-demo]");
  const data = document.querySelector("#pickkin-examples");
  if (demo && data) {
    const examples = JSON.parse(data.textContent);
    let example = examples[0];
    let lastPick = "";
    const card = demo.querySelector("[data-pickkin-card]");
    const title = demo.querySelector("[data-pickkin-demo-title]");
    const body = demo.querySelector("[data-pickkin-demo-body]");
    const eyebrow = demo.querySelector("[data-pickkin-eyebrow]");
    const voices = demo.querySelector("[data-pickkin-voices]");
    const actions = demo.querySelector("[data-pickkin-actions]");
    const announcement = demo.querySelector("[data-pickkin-announcement]");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const showNode = (id, moveFocus = true) => {
      const done = id === "done";
      const node = done ? {
        eyebrow: "That’s your pick.", title: lastPick,
        body: "A little lighter already. In the app, your choice is saved in My decisions.",
        actions: [{ label: "Try another dilemma", next: "another" }]
      } : example.nodes[id];
      if (!node) return;
      if (node.pick) lastPick = node.pick;
      card.dataset.state = done ? "done" : node.voices ? "tension" : node.pick ? "pick" : "question";
      title.textContent = node.title;
      body.textContent = node.body || "";
      body.hidden = !node.body;
      eyebrow.textContent = node.eyebrow;
      voices.replaceChildren();
      voices.hidden = !node.voices;
      (node.voices || []).forEach((voice) => {
        const block = document.createElement("div");
        const label = document.createElement("strong");
        const line = document.createElement("p");
        label.textContent = voice.label;
        line.textContent = voice.text;
        block.append(label, line);
        voices.append(block);
      });
      actions.replaceChildren();
      node.actions.forEach((action, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "pickkin-reaction";
        if ((node.pick && index === 0) || done) button.classList.add("pickkin-reaction--primary");
        button.textContent = action.label;
        button.dataset.pickkinNext = action.next;
        actions.append(button);
      });
      announcement.textContent = `${node.eyebrow} ${node.title}${done ? " This example is complete." : ""}`;
      if (moveFocus) card.focus({ preventScroll: true });
      if (!motion.matches && typeof card.animate === "function") card.animate([{ opacity: 0.35, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 180, easing: "ease-out" });
    };
    const selectExample = (id, moveFocus = false) => {
      const next = examples.find((item) => item.id === id);
      if (!next) return;
      example = next;
      lastPick = "";
      demo.querySelector("[data-pickkin-dilemma]").textContent = `“${example.dilemma}”`;
      demo.querySelectorAll("[data-pickkin-example]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.pickkinExample === id)));
      showNode("start", moveFocus);
    };
    demo.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const sample = event.target.closest("[data-pickkin-example]");
      if (sample) { selectExample(sample.dataset.pickkinExample); return; }
      const reaction = event.target.closest("[data-pickkin-next]");
      if (!reaction) return;
      if (reaction.dataset.pickkinNext === "another") {
        const index = examples.findIndex((item) => item.id === example.id);
        selectExample(examples[(index + 1) % examples.length].id, true);
      } else showNode(reaction.dataset.pickkinNext);
    });
  }

  document.querySelectorAll(".pickkin-faq details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".pickkin-faq details[open]").forEach((other) => { if (other !== item) other.open = false; });
    });
  });
})();
