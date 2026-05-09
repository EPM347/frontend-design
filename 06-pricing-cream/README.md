# 06 — Pricing Polish (Cream)

Round 06 redesigns `/pricing` in the cream + neo system. Same Polar data flow, same checkout, same customer portal — just a much stronger conversion surface. Adds a feature comparison table and an FAQ accordion (both new).

> **Prerequisite**: Round 01 (`.theme-cream` block in app.css). The route file applies `.theme-cream` directly so it works regardless of marketing-layout wrapping.

## What changes

### Page layout (full replacement)
The current pricing page is competent but generic — title + 2 grids of shadcn cards, default colors, no feature comparison, no FAQ. The new layout flows like this:

1. **Hero** — `"Simple plans. Honest pricing."` with butter-pill eyebrow, decorative radial glow, "Back home" link, and an alert card for already-subscribed users that points to `Settings → Subscription`.
2. **3-up subscription plans** — Polar plans rendered through the new `<PlanCard />` component. Lowest-priced first. Middle tier flagged "Best for you" (terracotta shadow + rotated pill) when the user isn't already subscribed; user's current plan flagged "Current" (cocoa shadow, dimmed CTA).
3. **Feature comparison table** — NEW. Full table side-by-side comparing every column of the subscription plans. Striped rows, recommended column tinted, ✓/— glyphs for boolean features, monospace tabular nums for numeric values.
4. **Credit packs** — Polar non-recurring plans rendered through `<CreditPackCard />`. Coin icon, "X credits · $Y per generation" math, "Best value" pill on the middle pack.
5. **FAQ accordion** — NEW. 8 questions written in brand voice: cancellation, running out of credits, free trial, plan changes, credit expiration, commercial use, payment methods, redo flow. First question opens by default.
6. **Final conversion CTA** — `"Drop a photo first, pay if you love it."` with terracotta-shadow card pointing at `/best-ai-art-generator`.

### New reusable components

| Component | Role |
| --- | --- |
| `pricing/PlanCard.tsx` | Chunky neo subscription card — works with Polar's `metadata` for feature lists, supports current/recommended pills, terracotta-shadow on recommended |
| `pricing/CreditPackCard.tsx` | Credit pack card with coin icon, per-credit math, "Best value" pill on butter-shadow |
| `pricing/FeatureComparison.tsx` | Side-by-side comparison table — accepts `plans` (columns) and `rows` (features). Default rows describe the 4-tier oneclick·art ladder; pages can override |
| `pricing/PricingFAQ.tsx` | Chunky neo accordion. Default has 8 brand-voice answers; first opens automatically. Pages can pass a custom `items` array |

All four components are exported from `app/components/pricing/index.ts` so other surfaces (e.g. `Settings → Subscription`) can pull them in.

### Brand voice rewrites

Every piece of copy on the page got a polish pass:

| Before | After |
| --- | --- |
| "Simple, transparent pricing" | "Simple plans. *Honest pricing.*" |
| "Choose a subscription or credit pack to get started" | "Free forever for casual use. Subscribe when you're hooked. Buy a credit pack if you'd rather pay once." |
| "Subscription Plans" | "Subscribe to a plan." |
| "Credit Packs" | "Or buy credits, no commitment." |
| "Most Popular" | "Best for you" (rotated terracotta pill) |
| "Get Started" CTA | "Get started →" with arrow |
| "Buy Now" | "Buy credits" |
| Footer (none) | "Drop a photo first, *pay if you love it.*" + Generator CTA |

## Files in this PR

| Path | Status |
| --- | --- |
| `app/routes/pricing.tsx` | full replace |
| `app/components/pricing/PlanCard.tsx` | **NEW** |
| `app/components/pricing/CreditPackCard.tsx` | **NEW** |
| `app/components/pricing/FeatureComparison.tsx` | **NEW** |
| `app/components/pricing/PricingFAQ.tsx` | **NEW** |
| `app/components/pricing/index.ts` | **NEW** |

## Convex contracts

**No new mutations or queries.** Same Polar API surface as before:

- `api.subscriptions.getAvailablePlans` (action) → list of plans
- `api.subscriptions.fetchUserSubscription` (query) → current sub
- `api.subscriptions.checkUserAccessStatus` (query) — used elsewhere; not required here
- `api.subscriptions.createCheckoutSession` (action) → returns Stripe/Polar checkout URL
- `api.subscriptions.createCustomerPortalUrl` (action) → returns customer portal URL for active subs
- `api.users.upsertUser` (mutation)

The page reads `plan.metadata.credits` for the per-credit math on credit packs. If your Polar dashboard doesn't store that field, the card just hides the "X credits" line — graceful fallback.

## Validation checklist

- [ ] `/pricing` renders cream-50 background, Fraunces italic display headlines, neo-shadowed plan cards
- [ ] Hero shows "Simple plans. *Honest pricing.*" with butter-pill eyebrow
- [ ] Already-subscribed user sees the green-shadowed "You're already subscribed" notice
- [ ] Subscription cards: lowest tier first, middle tier has terracotta shadow + "Best for you" pill (when user isn't subscribed)
- [ ] Current plan: cream-100 background + "Current" pill + dimmed CTA reading "Current plan"
- [ ] Click a plan CTA when signed-out → redirects to `/sign-in?redirect=/pricing`
- [ ] Click a plan CTA when signed-in but not subscribed → triggers `createCheckoutSession`
- [ ] Click a plan CTA when already subscribed → opens Polar customer portal in new tab
- [ ] Feature comparison table renders below the cards, recommended column tinted, ✓/— for boolean rows
- [ ] Credit packs render with coin icons, per-credit math (`$0.20 per generation`), middle pack flagged "Best value"
- [ ] FAQ accordion: 8 questions, first opens by default, click toggles, terracotta shadow on open
- [ ] Final CTA points to `/best-ai-art-generator`
- [ ] Mobile: 1-column layout, comparison table scrolls horizontally with x-overflow

## What's next

- **Round 07 — Homepage Generator embed** — drops the `<Generator />` from Round 05 into a section of `/` so visitors can convert without navigating to `/best-ai-art-generator` first.
- **Round 08 — `/art/$jobId` share page** — restyle in cream + neo (currently old teal palette + single-style copy).
