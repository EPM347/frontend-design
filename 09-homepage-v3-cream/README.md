# 09 — Homepage V3 + Brand System Codification

Round 09 ships the V3 cream + neo homepage as production React, replacing every existing homepage component (Hero, Content, Pricing-strip, Footer) with cream + neo versions. Real copy comes from auditing the live oneclickart.com site — not from placeholders, not from V4 corrections. Round 07's `<HomeGenerator />` embed is dropped; visitors go to `/best-ai-art-generator` for the actual generator.

Alongside the code, this round delivers the **canonical brand system** as three sister documents in `_brand/` that apply across every round and every future design session:

- `_brand/BRAND_GUIDE.md` — long-form reference (10 sections covering tokens, type, neo primitives, voice, patterns, imagery, don'ts)
- `_brand/DESIGN_PROMPT.md` — one-page paste-able brief for any LLM or designer
- `_brand/brand-book.html` — the rich visual brand book (color swatches, type specimens, neo primitive demos, do/don't tables)

> **Prerequisite**: Rounds 01 (cream theme) and 06 (PlanCard + PricingFAQ primitives reused on the homepage). Round 02 is a soft prerequisite if you want the dashboard surfaces to keep working — but the homepage itself only depends on 01 + 06.

## What changes

### New homepage components (10 files)

The previous homepage rendered four big sections from existing component files. Round 09 replaces the lot with **ten focused section components**, each living in `app/components/homepage/`. Each follows the brand system: pill eyebrow + display headline with one italic accent + body lede + body content + CTA.

| File | What |
| --- | --- |
| `Hero.tsx` | "Tap a style. Get art." — boxed-word `art.` stamp, two CTAs, three trust bullets |
| `TapDontType.tsx` | "Tap, don't type." — anti-pattern callout showing the prompt-writing trap struck through |
| `ThreeTaps.tsx` | "Three taps. One photo. Done." — process section with stepped numerals (i/ii/iii) |
| `MorePower.tsx` | "More power, when you want it." — three feature callouts (HD / Upscale / No-bg) |
| `UseCases.tsx` | "Hang it. Wear it. Send it." — three use case cards (merch / print / share) |
| `StylePreview.tsx` | "One photo, eight looks." — 4×2 grid of styles with one-line descriptions |
| `PricingStrip.tsx` | "Pick a plan. Start creating." — 3 PlanCards from Round 06 + see-all link |
| `HomeFAQ.tsx` | "Quick answers." — 6-question FAQ (real live-site questions) using `<PricingFAQ />` from Round 06 |
| `FinalCTA.tsx` | "One photo away." — final conversion card with terracotta-shadow callout |
| `Footer.tsx` | Cream-themed footer, real address, real email, 4-column link grid |

### Route file (full replacement)

- `app/routes/home.tsx` — drops the `<HomeGenerator />` import + render, swaps to the new components in order: Hero → TapDontType → ThreeTaps → MorePower → UseCases → StylePreview → PricingStrip → HomeFAQ → FinalCTA → Footer.

### Round 07 becomes obsolete

If Round 07 was previously applied, the `<HomeGenerator />` import and render are no longer in `home.tsx` (Round 09 is a full replacement). The component file at `app/components/homepage/HomeGenerator.tsx` can stay (no harm) or be deleted (`rm` it). See `diffs/01-remove-home-generator.patch` for context.

### Brand system codification (3 files)

Three documents that apply across every round, not specific to Round 09:

- `_brand/BRAND_GUIDE.md` — the canonical long-form reference. Color palette + tokens + usage rules, three-family typography with specimens, five neo primitives with code, voice & tone with do/don't pairs, section patterns, imagery direction, the big don'ts, and full tokens reference.
- `_brand/DESIGN_PROMPT.md` — single-page paste-able brief. Drop into any LLM or hand to a designer; they're caught up to the brand without reading the full guide.
- `_brand/brand-book.html` — the visual brand book. Same content as the guide rendered live with color swatches, type specimens, neo primitive demos, do/don't tables. Open in a browser; it's the visual companion to the markdown.

## Files in this PR

| Path | Status |
| --- | --- |
| `app/routes/home.tsx` | full replace |
| `app/components/homepage/Hero.tsx` | **NEW** (replaces `integrations.tsx` as the hero) |
| `app/components/homepage/TapDontType.tsx` | **NEW** |
| `app/components/homepage/ThreeTaps.tsx` | **NEW** |
| `app/components/homepage/MorePower.tsx` | **NEW** |
| `app/components/homepage/UseCases.tsx` | **NEW** |
| `app/components/homepage/StylePreview.tsx` | **NEW** |
| `app/components/homepage/PricingStrip.tsx` | **NEW** (replaces existing `pricing.tsx` strip) |
| `app/components/homepage/HomeFAQ.tsx` | **NEW** |
| `app/components/homepage/FinalCTA.tsx` | **NEW** |
| `app/components/homepage/Footer.tsx` | full replace |
| `diffs/01-remove-home-generator.patch` | advisory note about Round 07 obsolescence |
| `_brand/BRAND_GUIDE.md` | **NEW** — canonical long-form reference |
| `_brand/DESIGN_PROMPT.md` | **NEW** — paste-able LLM brief |
| `_brand/brand-book.html` | **NEW** — visual brand book |

## What's removed (or stops being imported)

The previous homepage components are **no longer imported** by `home.tsx`:

- `~/components/homepage/integrations.tsx` (was the Hero) — no longer imported
- `~/components/homepage/content.tsx` — no longer imported
- `~/components/homepage/pricing.tsx` (homepage pricing strip variant) — no longer imported
- `~/components/homepage/footer.tsx` — replaced by the new `Footer.tsx`

You can leave these files in the codebase; they just become dead code. Or delete them to keep things clean.

## Convex contracts

**No new mutations or queries.** Same Polar API surface as before — the `loader` fetches `subscriptions.checkUserAccessStatusByClerkId` and `subscriptions.getAvailablePlans` exactly as the previous homepage did, and passes them as `loaderData` to `PricingStrip`.

## Validation checklist

- [ ] Visit `/` while signed-out → all 10 sections render in cream + neo, smooth scroll between section anchors works
- [ ] Hero headline reads "Tap a style. Get **art**." with `art.` boxed in terracotta and rotated -2°
- [ ] "Tap, don't type." section shows the strikethrough prompt example in red
- [ ] "Three taps. One photo. Done." section has stepped numerals (i / ii / iii) in Fraunces italic terracotta
- [ ] Pricing strip shows 3 plans with the middle tier flagged "Best for you" via `<PlanCard />` from Round 06
- [ ] Homepage FAQ accordion uses `<PricingFAQ />` with the live-site's 6 questions (How do credits work?, etc.)
- [ ] Final CTA card has terracotta-colored shadow (`12px 12px 0 0 var(--terracotta-500)`)
- [ ] Footer shows real address (Sheridan, WY), real email (`hello@oneclickart.com`), 4 link columns
- [ ] Visit `/` while signed-in (via existing Clerk session) → loader returns `hasAccess` and `plans` correctly, pricing strip reflects current subscription
- [ ] Mobile (<768px): all sections stack to 1-column, hero shrinks gracefully, pricing strip becomes a vertical 3-card stack

## Style preview thumbnails

`StylePreview.tsx` references R2 thumbnails at `/styles/<id>/thumb.jpg` (placeholder convention from Round 05). Wire to real R2 URLs at apply time, or copy the image set used by `/best-ai-art-generator` so style thumbnails are consistent across surfaces.

## Brand system — how it applies going forward

The three `_brand/` documents are the canonical reference. Practically:

- **Day-to-day reference** — when writing a new component or surface, open `BRAND_GUIDE.md`. Color tokens, type sizes, neo shadow scale, voice rules — all in one file.
- **LLM sessions** — when starting a new design session in Cursor / Claude / any LLM, paste `DESIGN_PROMPT.md` first. It anchors the model to the brand without bloating context.
- **Stakeholder review** — share the rendered `brand-book.html` (or the published artifact) when you need to walk a contractor or new hire through the brand without making them read prose.

Update these three documents whenever a brand decision changes. The brand is what's written there — not in component files, not in scattered comments.

## What's next

After applying:

- **Optional polish** — once homepage performance metrics are visible, lazy-load the `PricingStrip` (it's the heaviest component because it queries Polar). Wrap with `React.lazy` and a skeleton.
- **A/B test the Hero CTA** — current is "Upload a photo". Try "Try it free" or "Tap a style → see your art" and measure conversion.
- **Add real before/after pairs** to `StylePreview` once you have rights-cleared user submissions. Square crops, same source photo across multiple styles for visual comparison.
