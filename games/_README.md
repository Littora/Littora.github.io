# Littora Play

An English-only, self-contained Jekyll collection at `/games/`. Each game is a real standalone page, with normal links and browser back/forward navigation. The existing website's only integration is the previously added Games link in `_includes/header.html`.

## Pages and visual identities

- `/games/`: warm ivory editorial collection, native links, no popup or game-selection JavaScript.
- `/games/lightkeeper/`: a minimal optical studio: white gallery surfaces, violet light, instrument markings, precise mirror controls.
- `/games/driftline/`: a bright pixel adventure: low-resolution ocean, handmade pixel boat and islands, mint and sand arcade controls, optional quiet chiptune effects.
- `/games/numberloom/`: classic 2048 in Bauhaus colours, bold typography and geometric tiles.
- `/games/picnic-snake/`: classic Snake in a cheerful cartoon picnic, gingham and illustrated apples.
- `/games/field-notes/`: classic Minesweeper in a vintage botanical field journal.
- `/games/tide-garden/`: a soft picture book: original generated reef illustration, pastel coral companions with faces, rounded pools, friendly names and planting previews.

## Implementation

- `games.css`: shared structure plus distinct world-scoped visual systems. No remote fonts or libraries.
- `classic-engine.mjs`: pure 2048, Snake and Minesweeper rules. `classics.mjs` owns their English interfaces, keyboard/touch inputs, sound and records; `classics.css` owns three distinct visual systems.
- `engine.mjs`: deterministic light paths, all nine authored levels, coral merging, ocean generation and sailing physics.
- `play.mjs`: English interface, inputs, opt-in Web Audio and versioned browser storage. Existing saves remain compatible. No dialog shell or language switcher.
- `pixel-art.mjs`: genuine low-resolution raster artwork, enlarged with nearest-neighbor interpolation. Boat, island scenery, currents, stars and water share a pixel grid.
- `portal.mjs`: static pixel-art preview for the Driftline card.
- `assets/tiny-voyager.woff2`: original, local 5 × 7 pixel display font. `_tools/build-pixel-font.py` can reproduce it with fontTools and Brotli.
- `assets/tide-garden.webp`: original AI-generated production illustration, lossily encoded as WebP without changing composition.
- `_art-direction.md`: visual decisions and exact production-art prompt.
- `_tests/engine.test.mjs`: rule tests; underscore-prefixed files and directories are not published by Jekyll.

Run tests with Node 18+:

```sh
node --test games/_tests/*.test.mjs
```

Preview without changing `_site`:

```sh
bundle exec jekyll build --destination /tmp/littora-games-preview
python3 -m http.server 4173 --bind 127.0.0.1 --directory /tmp/littora-games-preview
```

## Play

**Numberloom:** Arrow keys, swipe, or on-screen arrows move all tiles. Each tile merges only once per move; only a changed board spawns a new 2 (90%) or 4 (10%). Reach 2048 and keep playing. One-step undo restores the exact prior arrangement, score and move count. The current board and record are saved. Restart uses an inline confirmation.

**Picnic Snake:** Arrow keys / WASD or the direction pad steer. The snake grows by one square for each apple; walls and its own body end a game. Reversing directly into the neck is ignored. One pending turn is buffered per tick. Three speeds have separate records. Space starts, resumes or pauses; leaving the page/window pauses. A full lawn wins.

**Field Notes:** Reveal all safe squares. First reveal protects its entire eight-neighbour area. Right-click, F, long-press or Flag mode marks a square. A revealed number can open neighbours when its adjacent flag count matches. Incorrect flags can therefore cause a loss, as in classic Minesweeper. Two board sizes keep separate best times; the timer excludes hidden-tab time. Changing size starts a new survey; restarting the current size has an inline confirmation.

**Lightkeeper:** Turn mirrors to connect the beam to all receivers simultaneously. Blocks stop the beam; receivers let it pass. Hints align one mirror. The active arrangement, turns, hints, chapter and completed studies are saved.

**Driftline:** Arrow keys / WASD, hold on the water, or use the touch joystick. Currents affect momentum, islands deflect the boat, and the minimap reveals the archipelago. Free sailing has no timer; the timed challenge lasts 90 active seconds. Space pauses. Leaving the tab or window pauses. Only the timed record is saved; voyages start afresh.

**Tide Garden:** Plant in a 5 × 5 pool. Three or more matching corals connected through horizontal or vertical edges merge at the new planting. Cascades can reach Royal, the sixth tier. The next two companions are previewed; the latest planting can be undone once. The reef, queue, score and planting count are saved. A fresh reef preserves the record.

Keyboard controls are labeled. Garden cells support arrow navigation. Reduced motion disables decorative transitions, wake trails and water shimmer while preserving sailing gameplay. Sound starts muted on each game page. Invalid or unavailable browser storage safely falls back to fresh state / page-session memory. Page exit disposes animation and input listeners; a page restored from the back/forward cache reinitializes safely.
