# 07 — Homepage Generator Embed

Round 07 drops the `<Generator />` component from Round 05 directly onto the homepage. Visitors landing on `/` can now drop a photo and pick a style without ever clicking "Try it now" or navigating to `/best-ai-art-generator`. The generator becomes the second screen of the homepage scroll, sandwiched between the existing Hero and Content sections.

> **Prerequisite**: Round 05 (Generator). The new `<HomeGenerator />` wrapper imports `<Generator />` from `~/components/generator`. Round 02's cream theme is also required for the surrounding visual treatment.

## What changes

### One new component
`app/components/homepage/HomeGenerator.tsx` — a section wrapper that:

- Carries an `id="try"` anchor so any homepage CTA can scroll here with a `<a href="#try">…</a>`.
- Wraps `<Generator mode="marketing" />` from Round 05 with a homepage-style intro: butter-pill eyebrow + chunky display headline + 1-line tagline.
- Uses the cream + neo grid background and decorative radial glows (butter/terracotta on top-left, sage/basil on bottom-right) for visual rhythm.
- Top + bottom border separates it cleanly from the Hero above and Content below — feels like a discrete "try it" zone, not a continuation of the marketing copy.

### Two patches

1. **`diffs/01-home.tsx.patch`** — single-line addition: import `HomeGenerator` and render it between `<HeroSection />` and `<ContentSection />`. This is the only required change to wire it up.

2. **`diffs/02-hero-cta-anchor.patch`** — *advisory.* Walks through how to repoint any "Try it free" / "Get started" CTAs in the existing Hero from `/best-ai-art-generator` to `#try`. The exact JSX in `integrations.tsx` will vary; treat this as a guide, not a literal patch.

### CSS one-liner

Add `html { scroll-behavior: smooth; }` to `app/app.css` if it's not already there. Without it, anchor scrolls jump abruptly. Fully optional.

## Files in this PR

| Path | Status |
| --- | --- |
| `app/components/homepage/HomeGenerator.tsx` | **NEW** |
| `diffs/01-home.tsx.patch` | required patch |
| `diffs/02-hero-cta-anchor.patch` | advisory patch |

## Why slot it between Hero and Content?

| Position | Trade-off |
| --- | --- |
| **Above Hero** | Visitors don't get the "what is this product" framing first. Generator with no context = confused visitors. |
| **Between Hero and Content** ✅ | Hero sells the promise → Generator lets them feel it → Content reinforces with examples → Pricing converts. Natural funnel. |
| **Below Pricing** | Visitors who already saw pricing without trying are more likely to bounce; defeats the point. |

This positioning means the Hero needs to lean toward "what" (the product promise) and stop trying to be a CTA — visitors will naturally scroll to try it. Update Hero CTAs to scroll-to-`#try` rather than navigate-to-`/best-ai-art-generator` (see advisory patch 02).

## Validation checklist

- [ ] Visit `/` while signed-out → Hero renders, scroll down → HomeGenerator appears with full upload zone + style picker
- [ ] Click any style tile → terracotta selection animation works (proves Generator imports cleanly into the homepage)
- [ ] Click Generate → inline signup panel slides up over the Generate row (same flow as Round 05)
- [ ] After signup → redirect back to `/?staged=1` → generation auto-fires
- [ ] Visit `/` while signed-in with credits → click Generate → mutation fires immediately, result reveals
- [ ] Anchor link `<a href="#try">` from anywhere on the homepage scrolls to the section
- [ ] Hero's "Try it free" CTA scrolls to `#try` instead of navigating (after applying advisory patch)
- [ ] Mobile (<640px): the section keeps its border treatment + radial glows, Generator stacks naturally

## Performance note

Embedding the Generator on the homepage adds ~30KB gzipped to the initial bundle (the Generator + StylePicker + UploadZone + ResultPanel + GenerateOrSignup tree, plus the staged-generation utility). For a marketing landing page that's noticeable but not catastrophic. Two ways to mitigate if it becomes a problem:

1. **Lazy load the Generator** behind an intersection observer so it only loads when the user scrolls near it. Wrap with `React.lazy(() => import('~/components/generator').then(m => ({ default: m.Generator })))` and a `<Suspense>` fallback.
2. **Skeleton placeholder** in the section while the Generator loads — keeps the page weight light for visitors who never scroll past Hero.

Both are post-launch optimizations; ship the simple version first and measure.

## What's next

- **Round 08 — `/art/$jobId` share page** — restyle in cream + neo (currently old teal palette + single-style copy).
- **Round 09 (optional) — Lazy-load generator** — code-splitting + skeleton if the homepage payload becomes a problem.
