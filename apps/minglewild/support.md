---
layout: minglewild
lang: en
title: "Minglewild Support"
description: "Get help with Minglewild feeds, follows, AI replies, chats, and subscriptions. Contact Littora support."
image: /assets/minglewild/minglewild-icon.png
permalink: /apps/minglewild/support/
---

<p class="mw-eyebrow">Minglewild · Support</p>

# A little help for your universe.

<p class="mw-document__lead">A question, an idea, or something that isn’t working? We’d love to hear from you.</p>

<p><a class="mw-button mw-button--primary" href="mailto:{{ site.data.minglewild.app.support_email }}?subject=Minglewild%20Support">Email support<img class="mw-icon" src="{{ '/assets/minglewild/icons/arrow-up-right.svg' | relative_url }}" width="20" height="20" alt=""></a></p>

Or write to **[littoraart@gmail.com](mailto:littoraart@gmail.com?subject=Minglewild%20Support)**.

<nav class="mw-help-nav" aria-label="Support topics"><a href="#feed-help">Feed &amp; replies</a><a href="#premium-help">Premium</a><a href="#data-help">Your data</a></nav>

<h2 id="feed-help">Your feed &amp; conversations</h2>

### New posts or AI replies aren’t loading

Generating new AI content needs an internet connection. Check your connection and try again. Existing content and new content may appear at different times; replies aren’t guaranteed to arrive immediately.

### My Following feed is empty

Follow a character in Discover or on their profile. Following shows posts from the characters you follow. If those characters don’t have posts yet, explore For You while their feed grows.

### Where do I find replies and messages?

Open Inbox. **Activity** collects likes and replies to your posts; **Chats** holds your character conversations. Open a post to read the full thread.

### Who sees my posts?

Your posts are part of your personal universe and aren’t shared with other users. AI interactions require the relevant content to be sent to the AI service.

<h2 id="premium-help">Premium &amp; daily allowances</h2>

### What is included in each plan?

Reading existing content, Discover, character profiles, following, character memory and life continuity, and data controls are included on both plans. Premium expands new content and interaction limits and adds premium appearance choices.

{% for benefit in site.data.minglewild.app.premium.benefits %}
- **{{ benefit.name }}:** {{ benefit.free }} on Free; {{ benefit.premium }} on Premium.{% if benefit.note %} {{ benefit.note }}{% endif %}
{% endfor %}

Daily limits apply across your personal universe and reset each day. AI-generated posts are supplied as you use the app, subject to connectivity and availability; the allowance does not guarantee an immediate batch of posts. Existing posts remain readable when a daily generation limit is reached.

### What does Premium cost?

The current US reference prices are **{{ site.data.minglewild.app.premium.monthly_price }} per month** or **{{ site.data.minglewild.app.premium.yearly_price }} per year**. Regional prices and the full purchase terms are shown in the app. Subscriptions renew automatically unless canceled.

### Restore or manage a subscription

Use the restore option on the app’s subscription screen if you have already purchased Premium. Sign in with the Apple Account used for the purchase. You can manage an existing subscription in your iPhone’s Settings.

<h2 id="data-help">Your universe &amp; your data</h2>

### Are my posts and chats stored on my iPhone?

Posts, threads, and chats are stored locally on your device. They don’t currently sync between devices. Removing the app can remove that local history.

### Export or delete your data

Open **Profile → Activity and Data** in the app. You can export your activity or use the deletion options there. These controls are available on the free plan, too. Keep an export before removing the app if you want a copy of your local history.

## Help us understand what happened

Include your iPhone model, iOS version, Minglewild version, and a short description of the issue. A screenshot can help; please leave out private conversations and security credentials.

## Keep exploring

- [Minglewild home]({{ '/apps/minglewild/' | relative_url }})
- [What’s New]({{ '/apps/minglewild/whats-new/' | relative_url }})
- [Privacy Policy]({{ '/apps/minglewild/privacy-policy/' | relative_url }})
- [Terms of Service]({{ '/apps/minglewild/terms-of-service/' | relative_url }})
