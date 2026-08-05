# Design QA — Hero edge preview

## Comparison target

- Source visual truth: `/workspace/scratch/a41de38878e4/upload/01-Screenshot-2569-08-05-at-23.34.11.png`, 2048 × 896 px. The first cover is centered, leaving a large unused area on the left, and only one adjacent cover is clearly discoverable.
- Implementation: `https://joohiki-a11y.github.io/Bitkub_gallery/?qa=hero-fa52f293` at commit `fa52f293d2a6b7c895c4134ca9bf063c3cf8d916`.
- Browser-rendered implementation screenshot: inline Cloud Browser capture from the implementation URL. The browser runtime did not expose a workspace path for the PNG.
- Browser viewport: 1363 × 936 CSS px, device pixel ratio 1.
- State: desktop, All filter, first Hero work (`Noong Doi`) selected.
- Density normalization: the source and implementation have different desktop widths. The comparison used normalized stage proportions, visible-card count, fade progression, image fidelity, spacing rhythm, and the same first-slide state rather than pixel-for-pixel coordinates.

## Full-view comparison evidence

- Source and implementation were opened together in one comparison input before this report was written.
- The active first cover moved from the 50% stage center to the edge-aware 34% anchor, reducing the unused left region while preserving comfortable outer padding.
- Two upcoming covers are now visible in the opening frame. The nearest preview uses a 0.50 neutral wash and the second preview uses a 0.68 wash, forming a clear progressive affordance for horizontal navigation.
- Existing typography, category navigation, title/meta hierarchy, original image proportions, radii, shadows, and brand colors remain unchanged.

## Focused comparison evidence

- At 1363 px viewport width, the first card measured x 200–716 px with center x 458 px; the stage center was x 674 px. The second card measured x 619–1052 px and the third x 1110–1317 px.
- Selecting the next work changed the title to `Awards` and returned its card center to x 674 px, exactly matching the stage center. Returning to the first work restored the edge-biased layout.
- A separate close-up was not required because the requested change concerns full-stage composition and the full-view capture makes all cards, fades, labels, and controls readable.

## Required fidelity surfaces

- Fonts and typography: passed. Quicksand/Mitr hierarchy, weights, line heights, and small metadata remain consistent with the existing design.
- Spacing and layout rhythm: passed. The opening frame is denser without crowding; the first cover retains a 200 px outer margin at the tested viewport and the preview sequence remains evenly spaced.
- Colors and visual tokens: passed. The progressive fade uses the existing neutral `#f7f7f7` overlay; no new color language was introduced.
- Image quality and asset fidelity: passed. Original gallery assets, crops, aspect ratios, responsive Cloudinary previews, radii, and shadows are preserved.
- Copy and content: passed. No visible copy changed; the selected title and metadata continue to track the active work.
- Accessibility and interaction: passed for this scope. The Hero remains a labelled carousel, adjacent cards remain keyboard-addressable, arrow navigation works, and fractional touchpad movement shares the same smoothly interpolated anchor.

## Interaction and runtime checks

- `node Test/gallery.test.js`: 43 passed, 0 failed.
- `git diff --check`: passed.
- First-slide edge anchor: 34%; single-item filter fallback: 50%; final-slide mirror anchor: 66%.
- Next arrow: `Noong Doi` → `Awards`; active card centered after transition.
- Previous arrow: `Awards` → `Noong Doi`; edge preview restored.
- Console checked: no new Hero layout or interaction errors. The existing YouTube Data API HTTP-referrer restriction still logs playlist-fetch errors; browser-extension metadata errors are unrelated to the site.

## Comparison history

1. Initial source showed the active first card centered, a large empty left area, and one subdued adjacent preview.
2. Fix: introduced an edge-aware stage anchor that shifts only the first/last positions and interpolates with fractional touchpad movement.
3. Fix: increased and progressively stepped the neutral wash on upcoming covers so the scroll affordance is visible without competing with the active work.
4. Post-fix browser evidence confirmed two upcoming covers in the first frame, exact center alignment from the second work onward, and no actionable P0/P1/P2 regression.

## Follow-up polish

- P3: verify the perceived preview fade on a physical wide-gamut display; opacity can be tuned without changing the layout behavior.
- External configuration: update the YouTube Data API key HTTP-referrer allowlist for `https://joohiki-a11y.github.io/*` to remove the existing playlist warning.

final result: passed
