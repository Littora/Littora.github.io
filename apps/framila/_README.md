# Framila website

Framila uses Littora's existing Jekyll architecture: app data, layout, includes, SCSS, JavaScript, assets, and five Markdown pages. All styling and interaction hooks are scoped to `fm-`. The sole edit to an existing source file is a seven-line app entry in the root `index.md`. Shared layouts, styles, scripts, configuration, dependencies, and other apps stay unchanged.

## Content and design

- `_data/framila/app.yml`: identity, official route, support email, download destination, iPhone requirements, languages, six frame styles, and the shared example-photo catalog.
- `_data/framila/en.yml`: marketing copy, example story, FAQs, and the download message.
- `_includes/framila-artwork.html`: one shared renderer for the hero, frame-style preview, and story-front preview.
- `_includes/framila-home.html`: the photo-framing, story, Then & now, export, offline, first-keepsake, free/Premium, and FAQ sections.
- `assets/framila.scss` and `assets/framila-home.js`: independent responsive styles and accessible local interactions.
- `apps/framila`: home, support, What's New, privacy-policy, and terms-of-service pages.

The site uses English, matching Littora's other app websites, and lists the iOS app's seven supported languages. The visual direction uses warm ivory, forest green, quiet mat colors, soft frame shadows, and editorial serif typography. It reuses Littora's locally hosted DM Sans font. There are no remote font requests, analytics, visitor storage, forms, or service integrations.

Framila is presented as an iPhone app requiring iOS 17 or later. Content reflects the implemented iOS app. Gallery, Keepsake, and Portrait are free, including back stories and PencilKit handwriting. Premium adds Heirloom, Noir, Linen, paired-photo compositions, and 3,200-pixel PNG export. Standard PNG is 1,600 pixels wide. Both plans support watermark-free exports and a two-page A4 PDF. No prices, ratings, download counts, testimonials, or App Store IDs are invented. Offline creation is distinguished from Apple purchases/restores and iCloud photo downloads.

## Official routes

- https://littora.art/apps/framila/
- https://littora.art/apps/framila/privacy-policy/
- https://littora.art/apps/framila/terms-of-service/
- https://littora.art/apps/framila/whats-new/
- https://littora.art/apps/framila/support/

Support: littoraart@gmail.com.

## Downloads

All download actions use `_includes/framila-download-button.html`. While `app_store_url` in `_data/framila/app.yml` is empty, buttons open the shared native review-status dialog. Close, backdrop click, Escape, focus confinement, and focus return are supported. Older browsers receive a simple alert. A noscript explanation remains available.

After approval, put the real HTTPS App Store URL into `app_store_url`. Every download button then renders as an App Store link without modifying JavaScript or the pages. Buttons retain a normal Download label throughout.

Privacy and terms are explicitly marked placeholders, with `noindex: true` and `sitemap: false`. Publish finalized documents and remove those flags before App Store release. What's New is clearly a first-release preview.

## Asset provenance

`assets/framila/framila-icon.png` is an unchanged copy of the refined 2026-10-08 Xcode app icon. Web (256 px), favicon (64 px), and touch-icon (180 px) derivatives are included. `framila-logo.svg` is the app's current editable vector logo. The logo was not redesigned for this website.

The autumn photograph is the app's existing generated sample image, optimized to a local 900 × 1,125 WebP. The summer photograph is an Image Gen variation of that same location, optimized to 720 × 900 WebP. The brief was: the same Italian alpine lake and rowing boat, early summer instead of autumn, fresh green trees, calm turquoise water, a soft morning sky, subdued editorial photography, no people, text, logos, or borders. The original generated images remain outside the website source. Sample stories, signatures, dates, and frame compositions are illustrative, labeled accordingly, and are not actual app screenshots or personal testimonials.

`framila-social.png` is a code-composed 1,200 × 630 Open Graph card using the family photograph, existing logo, headline, and iPhone-only device line. All public page metadata points to it. Main content uses locally optimized WebP photos and lazy loading except for the hero photo.

The two additional 900 × 1,125 WebP photographs were generated with the built-in ImageGen tool, then resized and compressed with Pillow. Their original generated PNGs are preserved outside the website source. Final project assets and generation briefs:

- `assets/framila/memory-family.webp` — photorealistic-natural; a fictional mother in cream linen and daughter in a sage dress sharing an affectionate, ordinary afternoon on a garden bench; medium three-quarter portrait, faces and hands comfortably within the central composition; soft late-afternoon light, warm ivory and muted olive, subtle editorial film texture; portrait 4:5; no text, logos, watermark, frame, or device.
- `assets/framila/memory-companion.webp` — photorealistic-natural; a fictional golden retriever resting with its chin on a wooden kitchen threshold, front paws together; cream plaster, linen curtain and soft morning light; quiet domestic mood, muted warm neutrals, natural editorial photography; portrait 4:5; no text, logos, watermark, frame, or device.

Family is used in the hero and story demo; Companion is the default framing preview. Users can independently switch Family, Companion and A place while keeping their chosen frame. The illustrated local iPhone collection is authored in HTML/CSS using the same photo catalog; it is explicitly labeled as an illustration, with no claim that it is an app screenshot.

## Local preview

Use the repository's existing Ruby 3.3.4 and Bundler 2.6.9 environment with the unchanged `Gemfile.lock`:

```sh
bundle exec jekyll build --destination /tmp/framila-site
python3 -m http.server 8917 --bind 127.0.0.1 --directory /tmp/framila-site
```

Open http://127.0.0.1:8917/apps/framila/ and the four information routes. No deployment or Git commit is part of this implementation.

## Verified on 2026-10-08

- Jekyll 3.10.0 build and JavaScript syntax validation passed using the unchanged frozen dependency lockfile.
- All five official routes have correct canonical URLs, one main heading, unique IDs, valid JSON-LD, working local assets, and valid internal links. Public routes remain in the sitemap; legal placeholders remain excluded and noindex.
- All device descriptions, download labels, FAQs, Support, What's New, structured data, and the share card consistently describe iPhone with iOS 17 or later.
- Browser checks covered 11 widths from 320 to 1,920 CSS pixels with no horizontal overflow or failed loaded images. The local-phone illustration, offline badge and example caption have separate space. All four information pages passed at 375 pixels.
- Gallery, Keepsake and Portrait; three independent sample-photo choices; story front/back; navigation and hero downloads; dialog close, Escape, keyboard focus confinement and focus return were verified. No console errors or warnings were observed.
- Source hashes for all 320 files in the pre-refinement site were compared. This refinement changes only Framila-specific files and adds two Framila photo assets. All 67 other HTML outputs, including Littora's homepage, are byte-identical to the pre-refinement baseline.
- The canonical website icon remains byte-identical to the latest Xcode icon. No deployment, dependency change, or Git commit was performed.

## Brand refinement — 2026-10-08

The existing F, frame, sun and landscape identity is preserved. The new vector artwork enlarges the optical footprint, unifies F strokes and concave radii, aligns the letter and photo edges, softens landscape contours, and adds a restrained warm-ivory background gradient. App and website primary brand colors use #385448. No logo plugins or raster-generation services were used for this logo revision.

The canonical PNG, editable SVG, 256 px web icon, 64 px favicon, 180 px touch icon, and logo inside the existing share card are synchronized. Photos, marketing copy, page structure, routes, other app pages and Littora homepage source remain unchanged in this refinement.

## Website refinement — 2026-10-08

The existing warm ivory and #385448 forest-green palette is preserved. The header now offers Frames and Download, with a direct Download button at phone widths. The numbered value strip is replaced by three illustrated links to framing, the story on the back, and sharing/printing. The redundant Premium frame teaser and bottom maker/email line are removed. Support remains available in the footer and FAQ. The offline section demonstrates a personal local collection, end-to-end offline creation, and no account, ads or app analytics, while retaining the necessary iCloud and Apple-purchase details.
