---
layout: default
title: Chatura
permalink: /
---

<section class="content-section content-section--hero">
<div class="hero-layout">
  <div class="hero-copy">
    <h1>Chatura</h1>
    <p class="hero-tagline"><strong>Chatura: Where Cura Meets Chat</strong></p>
    <p>Chatura is a character-led AI companion built for everyday warmth, gentle support, and the kind of conversation you can come back to.</p>
    <p>When life feels heavy, quiet, lonely, or in-between, Chatura offers a steady place to land. Open the app and start talking—no setup, no pressure, no need to explain everything perfectly. The experience is designed to feel calm and continuous: conversations don’t have to feel disposable, and the relationship can grow more personal over time.</p>
    <a class="hero-download-link" href="https://apps.apple.com/app/chatura/id6758027835/" target="_blank" rel="noopener">Download on the App Store</a>
    <div class="download-panel__meta hero-meta" aria-label="Chatura highlights">
      <span>No ads</span>
      <span>No account required</span>
      <span>Private by design</span>
    </div>
  </div>

  <div class="hero-visual">
    <div class="product-preview" data-carousel>
      <button class="product-preview__control product-preview__control--prev" type="button" aria-label="Show previous screenshot" aria-controls="hero-screenshot-track" disabled>
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M12.75 4.75 7.5 10l5.25 5.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>
        </svg>
      </button>
      <div class="product-preview__shot">
        <div class="product-preview__shot-track" id="hero-screenshot-track" aria-label="Chatura app screenshots" tabindex="0">
          <img src="/assets/AppStoreScreenshot/Screenshot1.png" alt="Chatura app screenshot">
          <img src="/assets/AppStoreScreenshot/Screenshot2.png" alt="Chatura app screenshot">
          <img src="/assets/AppStoreScreenshot/Screenshot3.png" alt="Chatura app screenshot">
          <img src="/assets/AppStoreScreenshot/Screenshot4.png" alt="Chatura app screenshot">
          <img src="/assets/AppStoreScreenshot/Screenshot5.png" alt="Chatura app screenshot">
          <img src="/assets/AppStoreScreenshot/Screenshot6.png" alt="Chatura app screenshot">
          <img src="/assets/AppStoreScreenshot/Screenshot7.png" alt="Chatura app screenshot">
        </div>
      </div>
      <button class="product-preview__control product-preview__control--next" type="button" aria-label="Show next screenshot" aria-controls="hero-screenshot-track">
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M7.25 4.75 12.5 10l-5.25 5.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/>
        </svg>
      </button>
    </div>
  </div>
</div>
</section>

<script>
  (function () {
    var carousel = document.querySelector("[data-carousel]");
    if (!carousel) return;

    var track = carousel.querySelector(".product-preview__shot-track");
    var previous = carousel.querySelector(".product-preview__control--prev");
    var next = carousel.querySelector(".product-preview__control--next");
    if (!track || !previous || !next) return;

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
    };

    previous.addEventListener("click", function () {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    next.addEventListener("click", function () {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    track.addEventListener("scroll", syncControls, { passive: true });
    window.addEventListener("resize", syncControls);
    syncControls();
  })();
</script>

<section id="features" class="content-section content-section--features" markdown="1">
## Features

<div class="feature-grid" markdown="1">
<article class="feature-card" markdown="1">
<div class="feature-card__intro" markdown="1">
## 1) A warm companion you can come back to
### Gentle support for everyday moments.
For quick check-ins, quiet breaks, and late-night thoughts, Chatura offers a calm, familiar place to talk.
</div>
<div class="feature-card__body" markdown="1">
**Why it feels easy to return to:**
- Text-first chat for everyday support
- One core character designed for daily warmth
- No setup, no pressure—just open and talk
</div>
</article>

<article class="feature-card" markdown="1">
<div class="feature-card__intro" markdown="1">
## 2) Chats that become keepsakes
### Hold onto what matters.
Meaningful conversations can turn into simple keepsakes you can revisit later.
</div>
<div class="feature-card__body" markdown="1">
**What you can keep:**
- **Our Memory** — moments worth keeping
- **Our Plan** — a next step to come back to
- **Time Capsule** — a message for your future self
- **Wish Voice** — a hope put into words
- **Secret Haven** — a more private place for what is hard to say elsewhere

*Keepsakes are created and managed through chat—no separate tools to learn.*
</div>
</article>

<article class="feature-card" markdown="1">
<div class="feature-card__intro" markdown="1">
## 3) Distinct characters, not one generic assistant
### Six voices. More than one kind of support.
Each character has their own tone, perspective, and presence. Over time, they become more informed by what you share while staying true to who they are.
</div>
<div class="feature-card__body" markdown="1">
**What gives them continuity:**
- **6 characters total** *(1 included, 5 unlocked with subscription)*
- Each character is anchored by **Info / Status / Interests**
- They can remember details you’ve shared over time
- Continuity comes from identity + shared history, not “perfect memory” claims
</div>
</article>

<article class="feature-card" markdown="1">
<div class="feature-card__intro" markdown="1">
## 4) Moments between chats
### A relationship that stays present.
Characters share **Moments**—small posts about daily life and thoughts—so Chatura still feels alive even when you are not actively chatting.
</div>
<div class="feature-card__body" markdown="1">
**How Moments work:**
- Like, comment, and jump straight into chat
- Posts are generated from each character’s profile
- Built to keep a gentle sense of presence between conversations
</div>
</article>

<article class="feature-card" markdown="1">
<div class="feature-card__intro" markdown="1">
## 5) Private, calm, and in your control
### Respectful by design.
No ads. No third-party sharing for advertising or analytics. You can delete conversations anytime and export your chat data when you want.
</div>
<div class="feature-card__body" markdown="1">
**Privacy & control:**
- **No ads**
- **No account required**
- **Delete conversations** anytime
- **Export chat data** across characters
- **Secret Haven** supports optional **App Lock** and **local encrypted storage**
</div>
</article>
</div>
</section>

<section id="faq" class="content-section content-section--faq" markdown="1">
## FAQ
<div class="faq-grid" markdown="1">
  <div class="faq-item" markdown="1">
  **How is Chatura different from a typical AI chat app?**
  Chatura is built around distinct characters, ongoing continuity, and shared keepsakes. Instead of feeling like disposable chat, conversations can grow more personal over time and turn into memories, plans, wishes, and more.
  </div>

  <div class="faq-item" markdown="1">
  **What can I keep from my conversations?**
  Meaningful moments can become revisitable keepsakes like Our Memory, Our Plan, Time Capsule, Wish Voice, and Secret Haven—all created and managed naturally through chat.
  </div>

  <div class="faq-item" markdown="1">
  **How do the characters feel more personal over time?**
  Each character has their own tone, identity, and perspective. As you keep chatting, they can remember details you’ve shared and carry that continuity into later conversations.
  </div>

  <div class="faq-item" markdown="1">
  **Can I start using Chatura for free?**
  Yes. You can start with Chatura’s core character for free. Optional subscription features are available in the app.
  </div>

  <div class="faq-item" markdown="1">
  **Is Chatura private and easy to start using?**
  Yes. You can start without creating an account. Chatura has no ads, does not share your data for advertising or analytics, and lets you delete conversations or export your chat data whenever you want.
  </div>
</div>
</section>

<section class="content-section content-section--links" markdown="1">
<div class="links-grid" markdown="1">
<div class="links-group" markdown="1">
## What’s New
- [What’s New](/whats-new/)
</div>

<div class="links-group" markdown="1">
## Legal
- [Privacy Policy](/privacy-policy/)
- [Terms of Service](/terms-of-service/)
</div>

<div class="links-group" markdown="1">
## Support
- [Support](/support/)
</div>

<div class="links-group" markdown="1">
## X
- [@ChaturaApp](https://x.com/ChaturaApp)
</div>
</div>
</section>
