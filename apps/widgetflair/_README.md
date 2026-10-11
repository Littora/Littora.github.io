# WidgetFlair website

WidgetFlair follows Littora’s existing Jekyll structure and owns its data, layout, includes, styles, JavaScript, and assets. This update changes only WidgetFlair files; shared configuration, dependencies, and other app pages remain unchanged.

## Content and assets

- `_data/widgetflair/app.yml`: identity, routes, supported devices/languages, palettes, and **featured** designs. This is a selection, not the full app catalog. Never derive or advertise the total/free/Premium catalog size from this list.
- `_data/widgetflair/en.yml`: marketing text, current categories, setup steps, FAQs, and the download dialog.
- `_includes/widgetflair-home.html`: the homepage. Headlines describe a growing collection without numeric design claims.
- `_includes/widgetflair-widget-preview.html`: existing interactive illustrative hero examples.
- `assets/widgetflair/previews/`: PNG examples exported from the app’s actual shared renderer at 510×510, in English with sample activity and content. Photo frame uses the app’s bundled original illustration as example content. These are example designs, not app screenshots or the user’s activity.
- `assets/widgetflair.scss` and `assets/widgetflair-home.js`: isolated presentation, palette selection, and category filters. Filter status describes selected previews without suggesting a product total.
- `apps/widgetflair/`: the official pages. Privacy and terms remain explicit placeholders, marked `noindex` and excluded from the sitemap until final documents are supplied. What’s New describes the unreleased collection and plans for further designs without inventing release dates.

The icon remains sourced from the current Xcode app icon. WidgetFlair supports iPhone on iOS 17 or later. The app has free designs across every category; the website’s featured designs use the actual current free/Premium access flags. All designs can be previewed for free. Premium unlocks creation of the full collection and new Premium designs added while a subscription is active. Saved designs remain usable and editable offline after expiry. All palettes and Home Screen sizes are available to free users. Compatible designs also support Lock Screen formats. Settings provides seven in-app language choices and Follow system. Core use is offline; Apple purchases/restores and iCloud-only photo downloads require a connection. Production prices are displayed by StoreKit in the app.

## Updating the collection

When the app changes, update selected examples and their access flags from `WidgetTemplate`, categories from `WidgetCategory`, and colors from `WidgetPalette`/`WidgetCanvasView`. Re-export examples using `WidgetRecord.preview` and `WidgetImageExporter`, with sample content clearly identified. Keep the complete catalog in the app; a website selection does not need every template. Keep promotional copy, metadata, and structured data free of fixed design counts. Describe continuing updates without promising a cadence or unreleased features.

## Downloads

An empty `app_store_url` opens an accessible dialog explaining that the first release is being prepared. Once available, set the actual HTTPS App Store URL in `_data/widgetflair/app.yml`; shared buttons then render real download links on every page. Do not invent an App Store ID. An App Store Connect record alone does not mean the app is downloadable.

The website makes no API calls, stores no visitor data, and includes no tracking. Existing hero palette selection and water logging run locally. The water example is sample activity and stops at its example goal. Static previews, FAQs, and support remain usable without JavaScript.

## Official routes

- `https://littora.art/apps/widgetflair/`
- `https://littora.art/apps/widgetflair/privacy-policy/`
- `https://littora.art/apps/widgetflair/terms-of-service/`
- `https://littora.art/apps/widgetflair/whats-new/`
- `https://littora.art/apps/widgetflair/support/`

Support: `littoraart@gmail.com`.

## Local preview

Use the repository’s locked Ruby/Bundler environment:

```sh
BUNDLE_FROZEN=true bundle exec jekyll build --destination /tmp/widgetflair-site-preview
python3 -m http.server 4174 --directory /tmp/widgetflair-site-preview --bind 127.0.0.1
```

Check all five routes, canonical URLs, images, current free/Premium labels, palette selection, category filtering, responsive layout, the download dialog, and support instructions. Compare source hashes and rendered pages to a baseline to confirm unrelated pages remain unchanged. No deployment or Git commit is part of this update.
