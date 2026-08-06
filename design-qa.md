# Design QA — Sticky filter stacking and circular Hero navigation

## Comparison target

- Source visual truth: `/workspace/scratch/a41de38878e4/upload/01-Screenshot-2569-08-06-at-16.59.27.png`, 2048 × 631 px.
- Browser-rendered implementation screenshot: `/workspace/scratch/hero-sticky-fixed-1786010962146.jpg`, 1363 × 936 px.
- Combined comparison input: `/workspace/scratch/qa-sticky-comparison-1786010962146.jpg`.
- Implementation URL: `http://terminal.local:4173/`.
- Browser viewport: 1363 × 936 CSS px, device pixel ratio 1.
- State: desktop, All filter, `Noong Doi` selected, page scrolled to 294 px so the sticky filter overlaps the Hero stage region.
- Density normalization: both captures were compared at 1363 px width. The source's very wide viewport was proportionally scaled and centered on a white 1363 × 936 canvas; layout and stacking were judged in the shared top-bar/Hero region rather than by unrelated vertical content.

## Full-view comparison evidence

- The source shows the active Hero card painting over the sticky category bar. In the revised browser capture, the bar remains fully opaque and readable while the Hero begins beneath it.
- The active card remains centered and retains the existing image ratio, radius, shadow, title, metadata, and navigation controls.
- Circular navigation adds a subdued previous-card preview to the left of the first work and keeps the existing next-card preview on the right, making the loop discoverable without changing the visual language.

## Focused comparison evidence

- At scrollY 294, the sticky navigation measured top 0 px, bottom 64 px, computed z-index 60.
- The Hero stage measured top 33.19 px, bottom 513.19 px, so both regions intentionally overlap between y=33.19–64 px. `document.elementFromPoint(innerWidth / 2, 32)` resolved to a category button inside the navigation, confirming the bar owns the top layer.
- The Hero stage computed `isolation: isolate`, preventing card-level z-index values from escaping above the sticky navigation.
- A separate close-up was unnecessary because the full browser capture clearly shows the bar boundary, active card, both adjacent previews, and navigation controls.

## Required fidelity surfaces

- Fonts and typography: passed. Quicksand/Mitr families, weights, wrapping, hierarchy, and metadata sizing are unchanged.
- Spacing and layout rhythm: passed. Hero height, card footprint, radii, shadows, title spacing, control spacing, and grid transition remain consistent; only the stacking context changed.
- Colors and visual tokens: passed. Existing `#f4f4f4`, green accent, white pill controls, and neutral preview fade remain unchanged.
- Image quality and asset fidelity: passed. Existing source assets, proportions, responsive previews, and containment behavior are preserved.
- Copy and content: passed. No gallery copy or data changed.
- Accessibility and interaction: passed. The category navigation remains keyboard-accessible; Hero buttons, touch swipe, horizontal touchpad movement, and arrow navigation now share circular position logic.

## Primary interactions tested

- Hero previous from first: `Noong Doi` → final filtered work.
- Hero next from final: final filtered work → `Noong Doi`.
- Album media Lightbox previous from first: `1 / 7` → `7 / 7`.
- Album media Lightbox next from last: `7 / 7` → `1 / 7`.
- Sticky navigation at the overlap point remained the top hit target and fully readable.
- Console checked. No errors were introduced by the stacking or loop changes. Existing YouTube Data API referrer warnings on `terminal.local` fall back through the player-based playlist loader; browser-extension metadata errors are outside the site.

## Comparison history

1. P1 source finding: Hero cards shared z-index 30 with the sticky navigation and could paint over the filter bar.
2. Fix: raised the sticky navigation to z-index 60 and isolated the Hero stacking context.
3. Post-fix evidence: at an intentional 31 px overlap, the top hit target remained inside the navigation and the browser capture showed no image over the bar.
4. P1 interaction finding: Hero arrows and gestures clamped positions to the first and last items.
5. Fix: added normalized circular positions and shortest circular offsets for arrow, touch, and touchpad navigation.
6. Post-fix evidence: first/last navigation looped in both directions; the album media Lightbox also looped 1/7 ↔ 7/7.

## Validation

- `node Test/gallery.test.js`: 59 passed, 0 failed.
- `git diff --check`: passed.

## Follow-up polish

- P3: the far-side Hero preview for an item without a usable cover continues to use the existing neutral video fallback tile; this is intentional and not part of the stacking/loop fix.

final result: passed
