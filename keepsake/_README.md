# A Moment Ashore

An independent, English-only Littora module at /keepsake/. The homepage's **More** disclosure contains its entry. The module has its own page, styles, interaction code, artwork generator and tests; it does not import anything from Games.

The centred interface presents an illustrated coastal keepsake, three equally sized palette choices, an optional name field and one primary save button. A name updates the artwork as the visitor types. Only a brief introduction and local-processing notice are shown. The Littora wordmark is the only link in the keepsake header.

## Artwork and identity

**art.mjs** builds original vector scenery with a lighthouse, cottage, winding path, sailboats, distant islands, clouds, birds and wildflowers. A 128-bit cryptographic edition seed determines the scene details and title. Editing a name or choosing a palette preserves that geometry, edition and arrival timestamp.

The timestamp records navigation to the keepsake page, using the visitor's device clock and local UTC offset. The SVG also includes the exact UTC timestamp, timezone, seed and optional dedication as metadata. It is not a verified server timestamp or a calculation of real tides or astronomy.

Names are optional, with up to 48 English letters, spaces, apostrophes, periods or hyphens. Long signatures wrap into two lines. Invalid input blocks download until corrected.

## Privacy and export

The module uses no account, cookie, local/session storage, analytics, visitor fingerprint, API request or name upload. Its Content Security Policy blocks connections and form submission. The name exists only in the current document and any file the visitor chooses to save.

PNG export rasterises the original on-device at 2400 × 3200. SVG preserves the full vector artwork. A direct Blob download link remains available if the automatic download does not start. Blob URLs are released when superseded or when the document is discarded.

A fresh page load produces a new edition. Browser history preserves the current edition only when the browser restores the cached document.

## Homepage navigation

**navigation.css** is loaded only on the homepage. Apps, Games and More have identical 90 × 44 px desktop bounds and a uniform 12 px gap. Mobile navigation uses three full-width rows with equal 44 px heights and 8 px gaps. More is a native disclosure button; its panel contains the independent Keepsake link.

**navigation.mjs** handles click, outside-click, keyboard Escape, Arrow Down, focus leaving the disclosure, the mobile menu and breakpoint changes. Product-page navigation continues to use its existing controller.

## Validation

~~~sh
node --test keepsake/_tests/*.test.mjs
bundle exec jekyll build --destination /tmp/littora-games-preview
python3 -m http.server 4173 --bind 127.0.0.1 --directory /tmp/littora-games-preview
~~~

Underscore-prefixed documentation and test files are not published by Jekyll.
