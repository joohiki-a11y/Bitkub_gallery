# Design QA — UX round one

## Comparison target

- Source visual truth:
  - `/workspace/scratch/a41de38878e4/upload/Screenshot 2569-08-05 at 18.25.18.png` — gallery grid before this round, 2047 × 1061 px.
  - `/workspace/scratch/a41de38878e4/upload/Screenshot 2569-08-05 at 18.25.09.png` — Hero before this round, 2048 × 1180 px.
  - Live pre-change capture from `https://joohiki-a11y.github.io/Bitkub_gallery/` showing the full-width technical playlist warning and duplicated filters.
- Implementation: `https://joohiki-a11y.github.io/Bitkub_gallery/?qa=1fcd663` at commit `1fcd663da1a5ed18c4c43e3066df88d2fbd2106d`.
- Browser-rendered implementation evidence: inline Cloud Browser captures of the deployed Hero, sticky gallery grid, Staygold album modal, and photo lightbox. The browser runtime did not expose workspace file paths for these screenshots.
- Browser viewport: 1363 × 936 CSS px, device pixel ratio 1.
- State: desktop, All filter, grid scrolled with the filter pinned at the top, Staygold album open, and first Staygold photo open in the lightbox.
- Density normalization: source and implementation were captured at different responsive desktop widths, so comparison used component proportions, spacing rhythm, content visibility, image fidelity, and interaction state rather than pixel-for-pixel coordinates.

## Full-view comparison evidence

- The two separate category-filter systems were replaced by one pill-based navigation placed before the Hero and kept sticky while the gallery is browsed.
- The previous full-width technical playlist error no longer changes page height or dominates the first impression. It is now a concise floating notice that dismisses itself after seven seconds.
- The existing masonry rhythm, card radii, brand green, typography, natural image proportions, and lightbox presentation remain consistent with the source.
- At the scrolled gallery state, the filter measured `top: 0` and `height: 64px`; all 42 cards remained available.

## Focused comparison evidence

- Staygold modal: three media cards measured equal width and the media row had matching 152 px left/right gaps. Empty `BU Owner`, subtitle, description, and year fields were not rendered.
- Modal previews used responsive Cloudinary variants. Each Staygold preview rendered at 260 × 390 px instead of downloading the 6336 × 9504 px original.
- Lightbox kept the original full-resolution source (6336 × 9504 px), retained the 1 / 3 counter, navigation buttons, thumbnail strip, and original aspect ratio.
- The filter selected state was exposed through `aria-pressed`; Merchandise produced 2 cards and All restored 42 cards.

## Required fidelity surfaces

- Fonts and typography: passed. Quicksand/Mitr families, display hierarchy, card titles, and small labels remain aligned with the existing design. Green metadata moved to the darker existing `#007339` token for better readability.
- Spacing and layout rhythm: passed. The single 64 px sticky filter is stable, masonry remains packed, and one-to-three-item albums are centered instead of leaving a large empty right side.
- Colors and visual tokens: passed. Existing neutral surfaces, borders, shadows, radii, and Bitkub green remain intact; no new visual language was introduced.
- Image quality and asset fidelity: passed. Original Cloudinary assets are retained. Hero, grid, and modal previews use responsive transformations; the lightbox still loads the source original.
- Copy and content: passed. The technical API response was replaced with concise user-facing copy, while the full diagnostic remains available in the console.
- Icons: unchanged from the existing implementation.
- Accessibility and interaction: filter state, keyboard controls, focus behavior, dialog controls, touchpad behavior, reduced motion, and natural image alternatives remain in place. No claim of full WCAG compliance is made.

## Interaction and runtime checks

- `node Test/gallery.test.js`: 36 passed, 0 failed.
- `git diff --check`: passed.
- Vite production build: passed.
- Merchandise filter: 2 cards; All filter: 42 cards.
- Sticky navigation: remained at the top while the grid was scrolled.
- Non-fatal notice: disappeared automatically after seven seconds.
- Staygold modal: opened with three centered previews and no empty BU Owner row.
- Lightbox: opened the original full-resolution image with correct counter and controls.
- Console checked: no new gallery layout or interaction errors. The known YouTube Data API HTTP-referrer restriction still logs playlist-fetch errors; the round-one UI now handles those errors without breaking or shifting the gallery. Browser-extension metadata errors are unrelated to the site.

## Comparison history

1. Initial implementation delivered the single filter, compact warning, responsive images, and centered small albums.
2. First deployed inspection found the filter did not stay pinned because the app root used `overflow-x: hidden` (P1).
3. Fix: changed the root to `overflow-x: clip`, preserving horizontal containment without creating a sticky-positioning ancestor. Post-fix measurement confirmed the filter at `top: 0` while scrolling.
4. The temporary notice could overlap the filter during rapid scrolling (P2).
5. Fix: the notice now auto-dismisses after seven seconds while preserving a manual close action and console diagnostics.
6. Final deployed inspection found no remaining actionable P0/P1/P2 issue in the requested desktop round-one scope.

## Follow-up polish

- P3: recheck the consolidated filter on a physical narrow mobile device; the implementation uses horizontal overflow and 38 px-high pills, but this pass could not resize the connected browser viewport.
- External configuration: update the YouTube Data API key HTTP-referrer allowlist for `https://joohiki-a11y.github.io/*` so playlist content can load instead of using the graceful fallback notice.

final result: passed
