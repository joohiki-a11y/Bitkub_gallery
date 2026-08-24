# Design QA — Bitkub Brand Background

## Evidence

- Source visual truth: `/workspace/scratch/a41de38878e4/generated_images/exec-6a3bee79-6f25-49ca-bbf4-ce7f863d5371.png`
- Desktop implementation: `/workspace/scratch/a41de38878e4/repo-bg/design-qa-desktop.png`
- Mobile implementation: `/workspace/scratch/a41de38878e4/repo-bg/design-qa-mobile.png`
- Desktop comparison: `/workspace/scratch/a41de38878e4/repo-bg/design-qa-comparison.png`
- Mobile background comparison: `/workspace/scratch/a41de38878e4/repo-bg/design-qa-mobile-comparison.png`

## Viewports and normalization

- Source mockup: 1487 × 1058 px; normalized with a centered crop to 1348 × 926 px for the desktop comparison.
- Desktop browser viewport: 1363 × 936 CSS px at device scale 1; browser-rendered screenshot: 1348 × 926 px.
- Mobile browser state: the live page was rendered inside a 390 × 844 CSS px iframe in the same Cloud Browser; screenshot: 390 × 844 px. The page client width was 375 px because the iframe reserved its vertical scrollbar.
- Mobile background source asset: 1024 × 1536 px; cropped to 390 × 844 px for the responsive background comparison.
- State: light theme, `All` filter selected, gallery data loaded, Hero visible. The source mockup uses illustrative content while the implementation deliberately preserves the live gallery content and existing layout; the comparison judges only the approved background treatment.

## Full-view comparison evidence

- Desktop: the implementation reproduces the approved #F4F4F4 surface, soft green upper-left glow, sparse gray/green construction lines at the outer edges, and a clean central content zone. Photography remains visually dominant.
- Mobile: the portrait asset is materially calmer than desktop, keeps the center column clean, loads at the 720 px breakpoint, and introduces no horizontal overflow (`scrollWidth === clientWidth`).
- Sticky navigation remains readable over the background with its existing translucent #F4F4F4 surface and blur.

## Focused region comparison

No additional crop was required. The only changed visual surface is the full-page background, and its line density, glow distribution, content contrast, and edge behavior are all legible in the full desktop and mobile comparisons.

## Required fidelity surfaces

- Fonts and typography: unchanged from the live site. Quicksand/Mitr hierarchy, weights, wrapping, and antialiasing remain intact and readable over the new background.
- Spacing and layout rhythm: unchanged. Header, sticky filter, Hero, gallery grid, cards, and footer preserve their current measurements and alignment.
- Colors and visual tokens: approved Bitkub green glow and low-opacity green/gray construction language are present without reducing text contrast. The white/translucent component surfaces remain consistent.
- Image quality and asset fidelity: the decorative background is a generated raster asset, not CSS-drawn geometry. Desktop and mobile WebP files are sharp, seamless at cover scale, and total under 20 KB combined.
- Copy and content: unchanged. No subtitle, invented navigation item, or replacement gallery data was introduced.

## Findings

- No actionable P0, P1, or P2 issues.
- [P3] The responsive mobile treatment intentionally removes most construction detail compared with desktop. This is acceptable because it protects readability and keeps the Hero photography dominant on narrow screens.

## Primary interactions tested

- Hero next navigation changes the active project.
- Category filter updates `aria-pressed` and filters the gallery.
- Album card opens its modal.
- Media thumbnail opens the Lightbox.
- Lightbox next navigation advances from `1 / 21` to `2 / 21`.
- Sticky filter remains at viewport top with z-index 60 after scrolling.
- Desktop and mobile layouts have no horizontal page overflow.

## Console review

- No new runtime error attributable to the background change.
- The known YouTube Data API referrer rejection still appears on the local preview; the existing playlist fallback continues to keep those works visible.
- One browser-extension metadata error is external to the page.

## Comparison history

- Pass 1: no P0/P1/P2 mismatch found, so no design-QA correction loop was required.

## Implementation checklist

- [x] Add approved desktop background asset.
- [x] Add calmer portrait mobile asset.
- [x] Keep application surface transparent so the fixed raster background remains visible.
- [x] Preserve existing sticky navigation, Hero, gallery, modal, and Lightbox behavior.
- [x] Verify desktop and mobile rendering in Cloud Browser.
- [x] Run automated tests.

final result: passed
