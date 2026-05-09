# 04 — Settings Page (Cream)

Round 04 redesigns the `/dashboard/settings` page in the cream + neo system. The Subscription tab is the centerpiece — hero plan card with terracotta/butter glow, billing card on the side, four usage meters with progress bars, and a 3-up plan compare with the recommended tier flagged. The four secondary tabs (Account, Preferences, Usage history, Feedback) follow the same chunky-chip system.

> **Prerequisite**: Round 02 (chrome + dashboard home) must be applied first. Round 04 reuses the page header, button primitives, and `.theme-cream` token overrides from Round 02. Round 03 (creations) is independent — both can be applied in either order.

## What changes

### Page composition
- `app/routes/dashboard/settings.tsx` — full replacement. Stays a thin orchestrator: tab state lives here, `<SettingsTabs>` renders the chip bar, and each tab component renders its own panel.
- The previous shadcn `Tabs` + `TabsList` + `TabsTrigger` markup is replaced with a custom `<SettingsTabs>` component that renders chunky neo chips with terracotta-shadow on the active tab. Same accessibility (role="tab", aria-selected, aria-controls).

### Subscription tab
The big surface. Composed of four reusable sub-pieces so other surfaces (e.g. `/pricing`) can pull them in if useful:

- `subscription/plan-hero-card.tsx` — current plan as the protagonist: butter/terracotta radial glow, italic display name with terracotta accent on the trailing word, price + cycle suffix, free-form description, three actions (Upgrade, Switch to annual, Cancel).
- `subscription/billing-card.tsx` — sticky-feel cream-100 card on the right with next-charge, payment method (with brand-colored card chip), email, invoice count, update-payment CTA.
- `subscription/usage-meters.tsx` — 4 meters in a 4-up grid (Images / Upscales / No-bg / Rollover) with colored dots and progress bars. Big italic display number, small monospace `/ limit`, meta line, then the bar.
- `subscription/compare-plans.tsx` — 3-up plan compare. Current plan dimmed in cream-100 with a "Current" pill; recommended next tier flagged with a terracotta "Best for you" pill. Static plan defs in `subscription-tab.tsx`; lift to a CMS or convex query when tier copy needs to change frequently.

`subscription-tab.tsx` itself is the orchestrator — pulls quota, derives meter values, marks the current plan in the compare grid, and wires up upgrade/cancel handlers via `useNavigate`.

### Account tab
- Identity card (80px chunky avatar, name, email, "Edit profile" → opens Clerk's UserProfile)
- Password row (Manage → Clerk)
- Two-factor row (Manage → Clerk)
- Right column: Sign out card + Danger Zone card with the delete-account flow (uses shadcn AlertDialog, then opens Clerk's UserProfile to complete deletion until a self-serve mutation lands)

### Preferences tab
- Three chunky chip groups: Default size · Likeness level · Default style preset (10 styles)
- Auto-upscale neo toggle switch
- Each section uses a 280px-label / flex-rest layout for clean two-column reading on desktop, stacks on mobile.
- Currently UI-only — preference state lives in `settings.tsx`. Wire to a convex mutation (e.g. `api.preferences.set`) when persistence is added.

### Usage history tab
- Style filter `<select>` styled like the Round 03 Sort control + "Export CSV" button
- Single neo-bordered list with header row + striped detail rows
- Status pill matches the Creations grid (Ready / Cooking / Failed)
- "No history yet" empty state
- CSV export is built client-side from the visible rows — no extra endpoint needed.

### Feedback tab
- Topic chips (Bug / Feature / Style / Other)
- Cream-50 textarea with neo border, character counter, optional screenshot attach button (UI only)
- Terracotta send button with press-down active state
- POSTs to `/api/feedback` if available, else logs to console. **Add a convex mutation or a tiny route handler before going live** — see `feedback-tab.tsx` top comment.
- Right column: "Looking for help?" FAQ link card + "Email us" card with `hello@oneclickart.com`

## Files in this PR

| Path | Status | Type |
| --- | --- | --- |
| `app/routes/dashboard/settings.tsx` | full replace | Page composition |
| `app/components/dashboard/settings/index.ts` | full replace | Barrel exports |
| `app/components/dashboard/settings/tabs.tsx` | **NEW** | Chunky chip tab bar |
| `app/components/dashboard/settings/subscription-tab.tsx` | full replace | Composes the 4 sub-pieces |
| `app/components/dashboard/settings/plan-hero-card.tsx` | **NEW** | Subscription · plan hero |
| `app/components/dashboard/settings/billing-card.tsx` | **NEW** | Subscription · billing |
| `app/components/dashboard/settings/usage-meters.tsx` | **NEW** | Subscription · 4 meters |
| `app/components/dashboard/settings/compare-plans.tsx` | **NEW** | Subscription · 3-up compare |
| `app/components/dashboard/settings/account-tab.tsx` | full replace | Profile + danger zone |
| `app/components/dashboard/settings/preferences-tab.tsx` | full replace | 3 chip groups + toggle |
| `app/components/dashboard/settings/usage-tab.tsx` | full replace | History list + CSV export |
| `app/components/dashboard/settings/feedback-tab.tsx` | full replace | Form + helper cards |

## Convex query & mutation contracts (verify before apply)

**Quota query — `api.usage.getQuota`** — already used in production. The subscription tab assumes an extended shape with these forward-looking fields (all optional — meters degrade gracefully):

```ts
{
  // Already returned today
  tier, planMonthlyLimit, planMonthlyUsed,
  freeMonthlyLimit, freeMonthlyUsed,
  creditsBalance, upscaleBalance,
  planUpscaleMonthlyLimit, planUpscaleMonthlyUsed,

  // Forward-looking — optional
  planBgRemovalMonthlyLimit, planBgRemovalMonthlyUsed,
  rolloverCredits, rolloverDaysLeft,
  nextRenewalDate,        // ISO
  cycleDays,
  nextChargeAmount,       // formatted "$9.99"
  cardBrand, cardLast4, cardExpiry,
  billingEmail, invoiceCount,
}
```

If any field is missing, the corresponding meter / billing row falls back to a sensible default ("—" or hidden).

**Feedback mutation** — not wired. Either add `api.feedback.submit({ topic, message })` and swap the inline `submitFeedback` helper in `feedback-tab.tsx`, or add a `/api/feedback` route handler that accepts `{ topic, message }`.

## Validation checklist

- [ ] `/dashboard/settings` renders with the cream page header `"Your account."` and the period boxed in terracotta
- [ ] 5 chunky chip tabs visible; active tab has terracotta-colored offset shadow
- [ ] Subscription tab: hero card has 8px shadow, butter/terracotta radial glow, italic plan name with terracotta-highlighted accent
- [ ] Billing card on the right column shows next charge, brand-colored card chip, invoice count link
- [ ] Four usage meters with progress bars (terracotta / sage / butter / basil)
- [ ] 3-up plan compare: Pro Pack flagged "Current" if user is Pro, Studio flagged "Best for you" if not already on Studio
- [ ] Account tab: 80px chunky avatar, identity card with edit-profile button, danger zone has tomato-colored shadow
- [ ] Preferences tab: chip groups select properly, toggle slides on click
- [ ] Usage tab: list renders with status pills, filter works, CSV export downloads
- [ ] Feedback tab: topic chips toggle, character counter updates, send button disables until ≥10 chars
- [ ] `?tab=<name>` URL param syncs correctly with the active tab
- [ ] Mobile (< 640px): tabs wrap, hero/billing stack, compare grid stacks, meters stay 2-up

## What's next (after this round)

- **Round 05 — App upload flow** (`/app/upload`) — the actual money-making path. Single-photo upload, style picker, generation, result + download. The cream chrome already wraps it (Round 02), but the upload surface itself still needs the redesign treatment to match the brand.
- **Round 06 — Pricing page polish** — current `/pricing` already inherits the cream theme from Round 01, but the visual treatment of the plan cards and feature comparison can lift the same primitives we built in `compare-plans.tsx`.

Estimated review time: half a day.
