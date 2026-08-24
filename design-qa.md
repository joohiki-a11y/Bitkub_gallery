# Design QA — Subtle Vector Bitkub Brand Background

## Evidence

- Source visual truth: the previously approved SVG implementation at `/workspace/scratch/bitkub-bg-vector-desktop-final.jpg`
- Editable vector masters: `assets/brand-construction-bg.svg` and `assets/brand-construction-bg-mobile.svg`
- Browser-rendered implementation: `/workspace/scratch/bitkub-bg-vector-subtle-desktop.jpg`
- Side-by-side comparison: `/workspace/scratch/a41de38878e4/repo-bg/design-qa-vector-subtle-comparison.jpg`
- Desktop viewport: 1363 × 936 CSS px, device pixel ratio 1; screenshot 1348 × 926 px after scrollbar/chrome exclusion.
- Mobile check: 390 × 844 CSS px in a responsive iframe, device pixel ratio 1.
- Production backgrounds use resolution-independent 1920 × 1080 and 1080 × 1920 SVG viewBoxes, embedded as self-contained SVG data URLs. No raster density normalization is required at runtime.
- Comparison normalization: the approved and refined browser screenshots are both 1348 × 926 px and were placed side by side without resizing.
- State: gallery loaded, first Hero album active, sticky category navigation visible.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: unchanged from the accepted gallery implementation; the background keeps sufficient contrast behind the logo, title, tabs, and metadata.
- Spacing and layout rhythm: the clean center field preserves the existing Hero hierarchy and does not add visual weight behind cards or controls.
- Colors and visual tokens: the neutral `#f4f4f4` base and Bitkub green remain unchanged. Desktop gray strokes are now `0.17` opacity and green strokes `0.13`; mobile gray strokes are `0.17` and green strokes `0.12`.
- Image quality and asset fidelity: every construction line, circle, and gradient is vector geometry. There are no embedded raster images, doubled lines, grain, compression blocks, texture seams, or AI-style halos. Strokes use `geometricPrecision` and `non-scaling-stroke`.
- Decorative density: dashed guides were removed, desktop structural marks were reduced by roughly half, mobile duplicate vertical guides were removed, and both corner glow gradients were softened.
- Copy and content: no copy changed.

## Responsive and Interaction Checks

- Desktop computed style resolves to an SVG data URL with `cover`, centered at the top.
- Mobile computed style resolves to the portrait SVG data URL at 390 px width.
- Hero next navigation, category filtering, album modal, Lightbox, and Lightbox next navigation remained operable.
- 69 automated checks passed, including embedded SVG selection, geometric precision, stable strokes, and verification that no AI raster is embedded in the vector masters.
- Console errors checked. Only the known YouTube playlist referrer rejection and the browser extension metadata error appeared; the existing playlist fallback remains active and neither error is caused by this background change.

## Comparison History

- Initial source issue: the previous 1672 × 941 background was compressed to about 8 KB, then enlarged on high-density screens. Visible symptoms included softened edges, doubled construction lines, grain, and uneven AI-generated intersections.
- Earlier raster fix: regenerated the artwork and exported 1x/2x WebP files. This removed visible artifacts but still depended on pixel resampling.
- Vector fix: reconstructed the approved composition as editable desktop/mobile SVG masters and embedded those vectors directly in the active background.
- Subtle refinement: retained the approved SVG geometry while removing secondary guides and lowering opacity, as requested. The side-by-side comparison confirms that the CI treatment remains visible without competing with the Hero, navigation, or gallery cards.

## Focused Region Comparison

The top-left glow/diagonal intersection and the right-side vertical/circle construction marks were inspected at full asset resolution. No additional crop was needed because these are the only high-detail decorative regions; the center is intentionally blank.

## Follow-up Polish

- P3: after reviewing on a physical Retina phone, line opacity can be adjusted by a few percent if local display calibration makes the marks feel too quiet.

final result: passed
