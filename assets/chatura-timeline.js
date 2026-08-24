(function () {
  "use strict";

  const timeline = document.querySelector("[data-relationship-timeline]");
  if (!timeline) return;

  const steps = Array.from(timeline.querySelectorAll("[data-timeline-step]"));
  const jumpLinks = Array.from(timeline.querySelectorAll("[data-timeline-jump]"));
  const closing = timeline.querySelector(".relationship-timeline__closing");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const setCurrentStep = (index) => {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("is-current", stepIndex === index);
    });

    jumpLinks.forEach((link, linkIndex) => {
      if (linkIndex === index) {
        link.setAttribute("aria-current", "step");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const progress = steps.length > 1 ? index / (steps.length - 1) : 1;
    timeline.style.setProperty("--timeline-progress", progress.toFixed(3));
  };

  timeline.classList.add("is-enhanced");
  setCurrentStep(0);

  jumpLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const index = Number(link.dataset.timelineJump);
      const step = steps[index];
      if (!step) return;

      event.preventDefault();
      step.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  if (!("IntersectionObserver" in window)) return;

  const visibleSteps = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleSteps.set(entry.target, entry.intersectionRatio);
      } else {
        visibleSteps.delete(entry.target);
      }
    });

    if (!visibleSteps.size) return;

    const current = Array.from(visibleSteps.entries()).sort((a, b) => b[1] - a[1])[0][0];
    setCurrentStep(steps.indexOf(current));
  }, {
    rootMargin: "-24% 0px -42%",
    threshold: [0.08, 0.2, 0.4, 0.65]
  });

  steps.forEach((step) => observer.observe(step));

  if (closing) {
    const closingObserver = new IntersectionObserver((entries) => {
      timeline.classList.toggle("is-closing", entries.some((entry) => entry.isIntersecting));
    }, {
      rootMargin: "-8% 0px -62%",
      threshold: 0.01
    });

    closingObserver.observe(closing);
  }
})();
