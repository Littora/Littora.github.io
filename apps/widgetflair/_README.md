# WidgetFlair website

This website follows Littora's existing Jekyll structure. WidgetFlair owns its data, layout, includes, styles, JavaScript and assets. Shared layouts, site configuration, dependencies and other apps are unchanged. The only existing source edit is the new WidgetFlair app entry in `index.md`.

## Content and assets

- `_data/widgetflair/app.yml`: app identity, routes, support email, App Store URL, six palettes and the twelve-template catalog. Free and Premium counts are derived from this catalog.
- `_data/widgetflair/en.yml`: marketing text, setup steps, FAQs and the download dialog.
- `_includes/widgetflair-home.html`: homepage sections.
- `_includes/widgetflair-widget-preview.html`: shared, illustrative widget renderer for hero and collection previews.
- `assets/widgetflair.scss` and `assets/widgetflair-home.js`: isolated presentation and progressive interactions.
- `apps/widgetflair/`: the five official pages. Privacy and terms are explicit placeholders, marked `noindex` and excluded from the sitemap until real documents are supplied. What's New describes the first collection without claiming an already-published release.

The original 1024px icon is copied unchanged from `Project_WidgetFlair/Code/Sources/App/XCode/WidgetFlair/WidgetFlair/Assets.xcassets/AppIcon.appiconset/WidgetFlairAppIcon.png`. Smaller PNG derivatives are provided for page imagery, the favicon and the touch icon. Widget illustrations are authored in HTML/SVG/CSS from the app's actual templates. The social image uses the same artwork. They are labeled as illustrative previews, rather than app screenshots.

WidgetFlair currently targets iPhone only. The website calls the paid tier Premium. Product claims are based on the implemented iOS app: eight free templates, four Premium templates, six palettes, three Home Screen sizes, compatible Lock Screen formats and seven app languages. Core use is offline; Apple purchases/restores and iCloud-only photo downloads require a connection. Existing saved Premium designs remain usable and editable after Premium ends. Production prices are not invented.

The header places Littora before the app brand and keeps only Widgets, Support and Download. Decorative section overlines, the device/version callout and the footer attribution/contact row have been removed. Support contact details remain on the support page and in the download dialog.

## Downloads

Buttons present a normal download action. An empty `app_store_url` opens one accessible native dialog explaining App Store review status. After approval, set the actual HTTPS App Store URL in `_data/widgetflair/app.yml`; the shared button then renders real download links on every page. No other button or JavaScript changes are needed. Do not invent an App Store ID.

The website makes no API calls, stores no visitor data and includes no tracking. The palette picker, category filters and water counter run locally. The water example stops at eight glasses and is not a health recommendation. Static previews, all template content, FAQs and support information remain usable without JavaScript; a noscript message explains download availability.

## Official routes

- `https://littora.art/apps/widgetflair/`
- `https://littora.art/apps/widgetflair/privacy-policy/`
- `https://littora.art/apps/widgetflair/terms-of-service/`
- `https://littora.art/apps/widgetflair/whats-new/`
- `https://littora.art/apps/widgetflair/support/`

Support: `littoraart@gmail.com`.

## Local preview

Use the repository's Ruby and locked Bundler environment:

```sh
BUNDLE_FROZEN=true bundle exec jekyll build --destination /tmp/widgetflair-site-preview
python3 -m http.server 4174 --directory /tmp/widgetflair-site-preview --bind 127.0.0.1
```

Check all five routes, local assets, mobile/desktop widths, all palettes and categories, the water-counter limit, keyboard focus, native dialog close/Escape/backdrop, mobile navigation and reduced motion. Compare original source hashes and existing rendered pages against a baseline. Deployment and Git commits are outside this task.

## Verified implementation

Validated on 2026-10-05 with the repository's Ruby 3.3.4, locked Bundler 2.6.9 and Jekyll 3.10.0 environment:

- Jekyll build passed without dependency or configuration changes.
- 55 browser integration checks passed in local Chrome, including all five routes at 320, 375, 393, 520, 768, 900, 901, 1024, 1190, 1440 and 1920 pixels. No horizontal overflow occurred.
- iPhone-only metadata and copy, Premium terminology, free/paid catalog counts, Littora appearing before the app brand at every tested width, simplified navigation and footer removal passed.
- All six palettes, category counts, keyboard controls, the eight-glass example limit, mobile navigation, reduced motion and download-dialog focus/close/Escape/backdrop behavior passed.
- A simple alert fallback and the no-JavaScript presentation were checked. Browser page and asset requests produced no errors.
- Canonical URLs, local assets, unique page IDs, structured app metadata, sitemap entries and legal-placeholder exclusions passed.
- Desktop and mobile screenshots, the download dialog and the 1200×630 social image were visually inspected.
- Original source checksums confirmed `index.md` is the sole modified existing file, with exactly seven inserted lines. After removing that entry, the homepage source matches the baseline byte for byte. All 56 other existing HTML outputs are identical to the baseline.
- The original 1024px web icon matches the current Xcode icon byte for byte.
