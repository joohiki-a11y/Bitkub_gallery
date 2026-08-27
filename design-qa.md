# Design QA — Fade-only Bitkub Brand Background

## Evidence

- Source visual truth: the previously approved subtle-line implementation at `/workspace/scratch/bitkub-bg-vector-subtle-desktop.jpg`, plus the user's explicit direction to remove every line and retain only the color fades.
- Editable vector masters: `assets/brand-construction-bg.svg` and `assets/brand-construction-bg-mobile.svg`.
- Browser-rendered implementation: `/workspace/scratch/bitkub-bg-fade-only-hero.jpg`.
- Full-view comparison: `/workspace/scratch/a41de38878e4/repo-bg/design-qa-fade-only-comparison.jpg`.
- Desktop viewport: 1363 × 936 CSS px, device pixel ratio 1; both comparison screenshots are 1348 × 926 px.
- Mobile check: 390 × 844 CSS px in a responsive iframe, device pixel ratio 1.
- State: gallery loaded, first Hero album active, sticky category navigation visible.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: unchanged; the clean fade-only background improves title, tab, and metadata legibility.
- Spacing and layout rhythm: unchanged; removing decorative geometry does not alter Hero, navigation, gallery grid, radii, or spacing.
- Colors and visual tokens: the neutral `#F4F4F4` base and approved soft Bitkub-green radial fades are retained on desktop and mobile.
- Image quality and asset fidelity: the background remains resolution-independent SVG with no raster images, AI artifacts, construction lines, circles, or compression noise.
- Copy and content: unchanged.

## Responsive and Interaction Checks

- Desktop and mobile computed styles resolve to their intended embedded SVG data URLs.
- Both rendered SVGs contain radial gradients and no `<path>` or `<circle>` geometry.
- Hero next navigation, category filtering, album modal, Lightbox, and Lightbox next navigation remained operable.
- 70 automated checks passed, including explicit safeguards against construction lines and circles.
- Console errors checked. Only the known YouTube playlist referrer rejection and browser-extension metadata error appeared; neither is caused by this background change.

## Comparison History

- Earlier implementation: subtle gray/green construction lines framed the page without affecting layout.
- User-requested refinement: all straight lines, diagonals, and circles were removed from both SVG masters.
- Post-fix evidence: the same-size side-by-side comparison confirms that only the soft color fades remain, while the existing Hero hierarchy and content placement are unchanged.

## Focused Region Comparison

No additional crop was required: the requested change affects only the broad background treatment, and the equal-size full-view comparison clearly shows the removal of every decorative line at both corners.

## Follow-up Polish

- P3: the fade intensity can be reduced further after checking on a physical OLED/Retina display, but it is already visually subordinate to the Hero imagery.

final result: passed
