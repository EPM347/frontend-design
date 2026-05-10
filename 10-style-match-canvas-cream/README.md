# 10 — Style Match · Canvas redesign (v2)

Round 10 redesigns the **Style Match** surface (`/style-match`) into a full-bleed canvas with proof + smart defaults. Same product spec as the 09 pack (two photos in → one style-matched output back). Same API, same Convex table, same 2-credit cost. Only the UI presentation and one new client-side feature ("Try a sample match") are different.

> **Prerequisite**: 09-style-match-cream must already be installed (it sets up the route, the sidebar entry, the dashboard CTA, and the API contract). Round 10 swaps the component rendered at that route. If 09 is not installed, install it first OR apply its diff patches as part of the same merge.

## What's different from 09

| | 09-cream | 10-canvas-cream |
| --- | --- | --- |
| Layout | 4-step numbered wizard panel + side ResultPanel | Full-bleed canvas, taped photo cards, floating dock, in-place reveal |
| Hero | Marketing-tier headline + 3 floating shapes | Same headline scale, no floating shapes (the photos ARE the shapes) |
| Mode toggle | Always-visible 2-up cards | Collapsed under "Advanced ↗" link in the dock |
| Aspect ratio | Step 2 of the wizard, 3 radio tiles | Auto-detected from user photo, single chip with "Auto" tag |
| Result | Side ResultPanel with state machine | In-place: result replaces the connector, sources flank it |
| Sample-run | Not available | "Try a sample match" pre-loads samples and renders a pre-computed result (zero credits) |
| Decisions before Match | 4 (user, ref, mode, aspect) | 2 (user, ref) — mode + aspect default-then-optional |
| Words on screen (idle state) | ~70 | ~38 |

## What it solves

The v1 (09) layout treated this like a tool with steps. The v2 (10) layout treats it like a piece of paper you drop two photos on. The proof strip and sample-run button answer the question users ALWAYS have for AI tools — *"will this actually work for me?"* — before they spend credits or sign in.

## Files in this pack

| Path | Status | Type |
| --- | --- | --- |
| `app/components/style-match-canvas/StyleMatchCanvas.tsx` | **NEW** | Orchestrator (replaces StyleMatchPanel) |
| `app/components/style-match-canvas/ProofStrip.tsx` | **NEW** | 3-triplet before/after gallery |
| `app/components/style-match-canvas/SampleRunButton.tsx` | **NEW** | Butter pill for zero-credit sample |
| `app/components/style-match-canvas/UploadCards.tsx` | **NEW** | Two taped photo cards on canvas |
| `app/components/style-match-canvas/InPlaceReveal.tsx` | **NEW** | Result reveal with flanking sources |
| `app/components/style-match-canvas/sample-matches.ts` | **NEW** | Sample data config (3 triplets) |
| `app/components/style-match-canvas/types.ts` | **NEW** | Shared types (mirrors 09's but adds SampleMatch) |
| `app/components/style-match-canvas/index.ts` | **NEW** | Barrel |
| `app/routes/style-match.tsx` | **REPLACE** | Wraps StyleMatchCanvas (replaces 09's panel) |
| `app/utils/style-match-client.ts` | **REPLACE** | Same API contract, imports from new types path |
| `SAMPLE_MATCHES.md` | **NEW** | One-time setup for sample-run mode |

The 09-pack components (`app/components/style-match/`) can either be **deleted** or **kept as dead code**. Recommended: delete after this PR ships and works.

## Apply order (in best-art-gen-ai-main, via Cursor)

1. Copy `app/components/style-match-canvas/` from this pack into the main repo.
2. Overwrite `app/routes/style-match.tsx` with this pack's version.
3. Overwrite `app/utils/style-match-client.ts` with this pack's version.
4. Generate the 3 sample triplets (see `SAMPLE_MATCHES.md`) — one-time setup, ~10 minutes.
5. Paste the resulting R2 URLs into `app/components/style-match-canvas/sample-matches.ts`.
6. Optional: delete `app/components/style-match/` (old 09 components, now unused).
7. No backend changes. No new env vars. No Convex schema changes. No new diff patches.

## Backend changes

**None.** The v2 redesign uses the exact same `/api/style-match` route, the same `styleMatchResults` Convex table, the same `GEMINI_API_KEY`, the same 2-credit deduct-before / refund-on-error logic. Sample-run mode is purely client-side (pre-rendered samples loaded from R2 by URL).

## Smart defaults

- **Mode**: Pre-selected to `style` (the safer, less surprising one). User can override via the "Advanced ↗" disclosure in the dock.
- **Aspect ratio**: Auto-detected from the user photo's dimensions (landscape → 1:1, near-square → 1:1, portrait → 4:5, tall portrait → 9:16). Override by clicking the aspect chip.
- **Auto-detection feedback**: A small green "Auto" tag appears on the aspect chip when auto-detected, replaced by a manual indicator when user overrides.
- **Status line** above the dock previews what's about to happen: `✓ Just the style · Auto-detected · ~20s`.

## Sample-run mode (zero credits)

The "Try a sample match" button picks a `SampleMatch` from `sample-matches.ts`, fills the upload slots with that sample's photos, and immediately sets `workflowState='sample-complete'` — which triggers the same in-place reveal animation as a real generation.

No API call. No credits. No sign-in. Users see the magic in 400ms.

After the sample reveal, the CTA changes to **"Sign in & match your own"** — converts curious window-shoppers to authenticated users without spending a single credit on the demo.

See `SAMPLE_MATCHES.md` for one-time setup.

## In-place reveal

When generation completes, `<UploadCards />` is replaced by `<InPlaceReveal />`:

- User photo + ref photo shrink to 120×150 thumbs and rotate ±2°
- Result card sits centered at 280px with butter-glow + cocoa border
- Action toolbar floats below: Download HD (primary), Try a different look, Share
- For `sample-complete`: Download/Share are replaced by a single **"Sign in & match your own"** CTA

## Design system reuse

This pack consumes the same tokens as 09:
- `--cream-50` / `--cream-100` / `--cream-200`
- `--cocoa-900` / `--cocoa-700`
- `--terracotta-500` / `--terracotta-400` (user accent)
- `--basil-500` / `--sage-300` (reference accent)
- `--butter-500` (sample button, "Auto" tag)
- Fraunces italic 500 display, DM Sans body, DM Mono micro-text

## Validation checklist

### Empty state
- [ ] `/style-match` loads with the marketing Navbar and the cream paper canvas (dot grid visible)
- [ ] Hero copy reads "Skip the prompt. Drop the *photo*." with terracotta italic emphasis
- [ ] Proof strip shows 3 triplet cards below the subhead
- [ ] "Try a sample match" butter pill is centered below the proof strip
- [ ] Photo cards have washi tape, slight rotation, and pencil-note captions below
- [ ] Floating dock shows: aspect chip (with green "Auto" tag) · Advanced ↗ · Match button
- [ ] Status line above the dock previews mode + aspect + ETA

### Sample-run mode
- [ ] Click "Try a sample match" → upload slots fill with sample photos within 100ms
- [ ] Result reveal animates in within 400ms (sources flank, result centered)
- [ ] No `/api/style-match` request fires (verify in Network tab)
- [ ] CTA changes to "Sign in & match your own"
- [ ] Quota counter does NOT decrement

### Real generation (signed in)
- [ ] Drop two photos → Match button activates
- [ ] Aspect auto-detects from user photo (landscape→1:1, portrait→4:5/9:16)
- [ ] "Auto" tag visible on aspect chip until user manually changes
- [ ] Click "Advanced ↗" → mode toggle expands inline
- [ ] Click Match → button shows "Cooking…", in-place reveal fires on success
- [ ] Credit pill in top-right decrements by 1 (visual) / 2 (backend)
- [ ] On error → red toast at the bottom, credits refunded

### Drag-anywhere
- [ ] Drop a JPG ANYWHERE on the canvas → fills the first empty slot
- [ ] Drop again → fills the second empty slot

### Mobile
- [ ] Proof strip stacks single-column on `<sm` viewport
- [ ] Photo cards stack vertically (not side-by-side)
- [ ] Dock becomes sticky at bottom with same controls
- [ ] Bottom-corner editorial credits hide on mobile (already in CSS)

### Sign-in flow
- [ ] Unauthenticated user: Match button reads "Sign in to match"
- [ ] Click → redirects to `/sign-in?redirect_url=/style-match`

## Parked for v3 (do NOT build now)

Same as 09's parked list — no changes:
- Two-stage vision-LLM JSON pipeline (text/UI bleed-through fix)
- Face-lock second pass
- Style strength slider
- Multiple variations per generation
- Public share pages for style match results
- Watermark on free-tier downloads
- Recent matches history strip
- Polar billing for Style Match credit pack

Additionally parked for v3:
- Real `styleMatchResults` query backing the proof strip (currently hardcoded samples)
- Drag-positioning of photo cards (currently fixed)
- Animated transition from sample-run state back to empty

## Estimated effort

- **Frontend apply**: 1-2 hours in Cursor
- **Sample generation**: 10-15 minutes (3 manual /api/style-match calls + R2 upload)
- **Backend**: 0 hours (no changes)

Total: half a day for a complete rollout.
