# Pickkin website

This app uses the existing Jekyll structure: product data in `_data/pickkin`, app pages in `apps/pickkin`, private includes/layout, and isolated CSS/JavaScript. The existing site templates, configuration, dependencies, and other app pages are unchanged. `index.md` only gains the Pickkin app entry.

## Update content

- `_data/pickkin/app.yml`: product identity, support email, App Store URL, free weekly and Premium monthly allowances, icon, languages.
- `_data/pickkin/en.yml`: marketing copy, FAQs, download dialog, and three illustrative decision examples.
- `_includes/pickkin-home.html`: homepage sections.
- `assets/pickkin.scss`: responsive styling, motion preferences, and document/dialog styles.
- `assets/pickkin-home.js`: examples, mobile navigation, native download dialog.

The example uses prewritten copy and sends no requests to the AI API. It accepts no free-form input and stores no visitor decisions. Saved decisions on the homepage are illustrative. The app screenshot and icon come from the current Xcode project; web-sized derivatives are included alongside the unchanged 1024px icon.

## Download link

All CTAs show a normal download action. With `app_store_url` empty, they open one accessible native dialog explaining review status. After approval, set the actual HTTPS App Store URL in `_data/pickkin/app.yml`; the same shared include renders real links on every page. Do not invent an App Store ID.

## Pages

- `/apps/pickkin/`
- `/apps/pickkin/privacy-policy/`
- `/apps/pickkin/terms-of-service/`
- `/apps/pickkin/whats-new/`
- `/apps/pickkin/support/`

Privacy Policy and Terms of Service are intentionally placeholders, excluded from the sitemap and marked `noindex`. Replace their contents, then remove `noindex` and `sitemap: false` when the final documents are ready.

## Local build

```sh
BUNDLE_FROZEN=true bundle exec jekyll build --destination /tmp/pickkin-site-preview
python3 -m http.server 4173 --directory /tmp/pickkin-site-preview --bind 127.0.0.1
```

Check desktop/mobile layouts, the three example branches, acceptance/restart, pushback, keyboard navigation, dialog focus/escape/backdrop, all five routes, local assets, and reduced motion. Compare existing page output with a build made before these additions. No deployment or Git commit is part of this change.

## Validation of this implementation

- Jekyll 3.10.0 build with frozen dependencies passed.
- Isolated Chrome browser checks passed for all five routes and widths of 320, 375, 393, 768, 1024, and 1440 pixels, without horizontal overflow.
- All three sample flows, pushback, completion/restart, keyboard operation, mobile menu, dialog focus in both Tab directions, Escape/backdrop/close, and reduced motion passed.
- No JavaScript errors or failed page/asset requests occurred. Content remains readable with JavaScript disabled.
- Desktop and mobile screenshots were visually reviewed.
- Original source hashes and rendered outputs were compared against the baseline. The homepage app entry is the only edit to an existing source file; existing app pages and shared assets remain unchanged.

## Presentation updates

The header includes a Littora home link alongside Pickkin and keeps only See how it feels and Download. Decorative section labels and the tagline are removed. The two-line App Store button uses explicit type sizes and line heights. Hero columns align to the top so longer examples cannot move the introduction. Website allowances are configured as 3 free nudges per week and 100 Premium nudges per month; the plans, FAQ, and release notes use the same data. These changes apply to the website presentation only.
