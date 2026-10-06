# Became website

Became follows Littora's existing Jekyll architecture with its own data, layout, includes, SCSS, JavaScript and assets. The only existing source edit is a seven-line Became entry in the Littora homepage, index.md. Shared configuration, styles, scripts, layouts, dependencies and every other app are preserved.

The visual direction follows the current iOS app: pale mint, sea green, warm ivory and restrained apricot, with champagne gold reserved for Premium. The supplied Xcode app icon is copied unchanged as became-icon.png; web, favicon and touch-icon derivatives are provided. Vector illustrations and HTML milestone cards are code-authored, explicitly labeled as illustrative previews rather than actual app screenshots.

## Content

- _data/became/app.yml holds app identity, support email, download destination and actual free/Premium allowances.
- _data/became/en.yml holds marketing copy, milestone examples, presentation descriptions, FAQs and the download message.
- _includes/became-record.html is the shared milestone preview renderer.
- assets/became.scss and assets/became-home.js are scoped to Became.
- apps/became contains the official home, support, What's New, privacy-policy and terms-of-service pages.

The site uses English, matching the existing app websites. It accurately describes the app's seven supported languages. No ratings, testimonials, download counts, prices or App Store IDs are invented. Manual records, photos and all three card presentations are unlimited. Free offers 3 successful AI creations per calendar week; Premium offers 100 per anchored subscription month. Imported photos are never uploaded for AI processing.

## Downloads and official routes

Buttons retain a normal Download action. While app_store_url is empty, they open one accessible native dialog explaining App Store review status. After approval, set the real HTTPS App Store URL in _data/became/app.yml; all shared buttons become external download links. No button or JavaScript change is required.

- https://littora.art/apps/became/
- https://littora.art/apps/became/privacy-policy/
- https://littora.art/apps/became/terms-of-service/
- https://littora.art/apps/became/whats-new/
- https://littora.art/apps/became/support/

Support: littoraart@gmail.com.

Privacy and terms are explicit placeholders, noindex and excluded from the sitemap. Replace them with finalized documents before release and remove those flags. The website has no analytics, visitor storage, form submission or live AI calls. Presentation switching runs locally. FAQs, support and default previews work without JavaScript; a noscript download explanation is provided.

## Preview and validation

Use the repository's locked Bundler environment with Ruby 3.3.4 and Bundler 2.6.9. Run Jekyll build to a temporary destination, then serve the output locally. No dependencies or global configuration need to change.

Check all five routes; desktop and mobile layouts; interactive presentations; download dialog close, Escape, backdrop and focus return; mobile navigation; keyboard access; local assets; SEO and sitemap; legal placeholder exclusions. Compare source checksums and existing rendered pages against the pre-change baseline. No deployment or Git commit is part of this task.

### Verified on 2026-10-06

- Jekyll 3.10.0 build passed with the existing frozen dependency lockfile. JavaScript syntax validation passed.
- All five official routes have correct canonical URLs, one main heading, unique IDs, valid JSON-LD, working local assets and internal links. Home, support and What's New appear in the sitemap; legal placeholders are excluded.
- Browser review passed at 11 widths from 320 to 1920 pixels with no horizontal overflow or failed images. All four document pages also passed at 393 pixels.
- Gallery, Editorial and Postcard switching, native FAQ expansion, desktop and mobile download actions, modal keyboard focus confinement, Escape dismissal, close-button dismissal, focus return and mobile navigation were verified in the browser. No console errors or warnings were observed.
- All 267 pre-existing tracked source checksums were compared: only index.md changed, by exactly the seven-line app entry. All 61 other existing HTML outputs are byte-identical to the baseline. Feed output differs only in the normal build timestamp; the sitemap gains the new public pages.
- The canonical website icon is byte-identical to the Xcode app icon. No deployment, dependency change or Git commit was performed.
