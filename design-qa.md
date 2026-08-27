# Design QA — Greener Fade-only Bitkub Brand Background

## Evidence

- Source visual truth: the approved fade-only implementation at `/workspace/scratch/bitkub-bg-fade-only-hero.jpg`, plus the user's explicit direction to increase the visible green treatment.
- Editable vector masters: `assets/brand-construction-bg.svg` and `assets/brand-construction-bg-mobile.svg`.
- Browser-rendered implementation: `/workspace/scratch/bitkub-bg-greener-fade-hero.jpg`.
- Full-view comparison: `/workspace/scratch/a41de38878e4/repo-bg/design-qa-greener-fade-comparison.jpg`.
- Desktop viewport: 1363 × 936 CSS px, device pixel ratio 1; both comparison screenshots are 1348 × 926 px.
- Mobile check: 390 × 844 CSS px in a responsive iframe, device pixel ratio 1.
- State: gallery loaded, first Hero album active, sticky category navigation visible.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: unchanged; the clean fade-only background improves title, tab, and metadata legibility.
- Spacing and layout rhythm: unchanged; removing decorative geometry does not alter Hero, navigation, gallery grid, radii, or spacing.
- Colors and visual tokens: the neutral `#F4F4F4` base remains unchanged. Desktop glow radii increased by about 19–24% with primary opacities raised to `0.48` and `0.37`; mobile glow radii increased by about 16–19% with primary opacities raised to `0.42` and `0.34`.
- Image quality and asset fidelity: the background remains resolution-independent SVG with no raster images, AI artifacts, construction lines, circles, or compression noise.
- Copy and content: unchanged.

## Responsive and Interaction Checks

- Desktop and mobile computed styles resolve to their intended embedded SVG data URLs.
- Both rendered SVGs contain radial gradients and no `<path>` or `<circle>` geometry.
- Hero next navigation, category filtering, album modal, Lightbox, and Lightbox next navigation remained operable.
- 70 automated checks passed, including explicit safeguards against construction lines and circles.
- Console errors checked. Only the known YouTube playlist referrer rejection and browser-extension metadata error appeared; neither is caused by this background change.

## Comparison History

- Earlier implementation: the fade-only background used restrained green areas at the top-left and bottom-right edges.
- User-requested refinement: both gradient footprints and their opacity were increased without changing the central neutral field.
- Post-fix evidence: the same-size side-by-side comparison shows a visibly greener frame while the title, filters, Hero imagery, and metadata retain clear contrast.

## Focused Region Comparison

No additional crop was required: the requested change affects the broad background treatment, and the equal-size full-view comparison clearly shows the increased green coverage at both edges.

## Follow-up Polish

- P3: physical OLED/Retina displays may make the corner glow appear slightly stronger, but it remains visually subordinate to the Hero imagery in the verified desktop and mobile previews.

final result: passed
