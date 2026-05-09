# 09 — Style Match (Reference-Image Style Transfer)

Round 09 adds the **Style Match** feature — a standalone surface where users drop their photo + a style reference image and get an AI-generated match. Two modes (one toggle), one route, one new API endpoint, one new Convex table.

> **Prerequisite**: Round 02 (cream theme + dashboard chrome). The `theme-cream` wrapper, the chunky neo utility classes from `app.css`, and the cream/butter/cocoa color tokens are required. Round 05 (Generator) is recommended but not required — Style Match reuses the same visual language but is implemented independently.

## What it does

The user provides:

1. **Their photo** — the subject we keep.
2. **A reference image** — any photo whose look they want.

Then picks a **mode**:

- **Just the style** — keep the user's pose, composition, wardrobe, and background. Transfer ONLY color, lighting, mood, and rendering technique from the reference.
- **Style + scene** — place the user's identity (face, hair, ethnicity, age) into the reference's pose, scene, and full visual style. Like cosplaying the photo.

And an **output aspect ratio** — `1:1` (feed), `4:5` (portrait), `9:16` (story / reel / TikTok).

The server hands the two images + a mode-specific prompt to **Gemini 3.1 Flash Image Preview** (gemini-3.1-flash-image-preview, aka Nano Banana 2), uploads the result to R2, writes a row to a new `styleMatchResults` Convex table, and returns the result URL.

**Cost: 2 credits per generation.** Credits are deducted before the Gemini call and refunded automatically on error. Free tier counts each Style Match against the same daily 3-generation quota.

## Files in this PR

| Path | Status | Type |
| --- | --- | --- |
| `app/components/style-match/StyleMatchPanel.tsx` | **NEW** | Top-level orchestrator (state + handlers + composition) |
| `app/components/style-match/UploadSlots.tsx` | **NEW** | Two-up drop zones (your photo + reference) |
| `app/components/style-match/ModeToggle.tsx` | **NEW** | Just-the-style vs Style+scene segmented toggle |
| `app/components/style-match/AspectRatioPicker.tsx` | **NEW** | 1:1 / 4:5 / 9:16 picker |
| `app/components/style-match/CreditCostBadge.tsx` | **NEW** | "2 credits per generation" badge |
| `app/components/style-match/ResultPanel.tsx` | **NEW** | Empty / generating / complete / error state machine |
| `app/components/style-match/types.ts` | **NEW** | Shared types |
| `app/components/style-match/index.ts` | **NEW** | Barrel |
| `app/utils/style-match-client.ts` | **NEW** | `fetch`-based wrapper for `/api/style-match` |
| `app/routes/style-match.tsx` | **NEW** | Thin route wrapper, marketing chrome |
| `diffs/01-routes.ts.patch` | **NEW** | Adds `/style-match` and `/api/style-match` to `app/routes.ts` |
| `diffs/02-app-sidebar.tsx.patch` | **NEW** | Adds Style Match nav entry (with "New" badge) to dashboard sidebar |
| `diffs/03-dashboard-hero-card.tsx.patch` | **NEW** | Adds "Match a style" CTA to the dashboard hero card |

## Apply order

1. Copy the `app/` tree from this pack into your main repo.
2. Apply the three diffs in `diffs/` (route registration, sidebar nav, dashboard hero CTA).
3. Implement the **server-side pieces** described in the saved Implementation Brief (NOT in this design pack):
   - `app/routes/api.style-match.tsx` — multipart handler, Clerk auth, credit deduct/refund, Gemini call, R2 upload, Convex insert
   - `convex/schema.ts` — add `styleMatchResults` table with `by_user` index
   - `convex/styleMatchResults.ts` — basic CRUD (insert + listMine)
   - `convex/quota.ts` — confirm cost-per-generation logic supports 2-credit cost
4. Add `GEMINI_API_KEY` to the Vercel env vars.
5. Verify Clerk redirects allow `/style-match` (no special config — same as other authed routes).

## Convex contracts (verify before apply)

The frontend uses these read queries to surface plan + quota info on the panel:

| Used as | What it expects | Status |
| --- | --- | --- |
| `api.subscriptions.checkUserAccessStatus` | `() → { hasAccess: boolean }` | Already exists |
| `api.usage.getQuota` | `() → { freeDailyLimit, freeDailyUsed, creditsBalance, ... }` | Already exists |

The frontend does NOT read directly from `styleMatchResults` — that table is server-write only in v1. v2 will add a "history strip" backed by `api.styleMatchResults.listMine`.

## Design system reuse

Style Match uses the same chunky neo-brutalist treatment as the Generator pack:

- `border-[3px] border-foreground` panels with `boxShadow: '6px 6px 0 0 var(--cocoa-900)'`
- Numbered step circles (1=upload, 2=output size, 3=mode, 4=result)
- `font-display italic font-medium` headlines + `text-[10px] tracking-[0.22em] uppercase` eyebrows
- Color accents:
  - **Terracotta** (`var(--terracotta-500)`) = primary action + "your photo" slot
  - **Basil** (`var(--basil-500)`) = "reference" slot (signals secondary input)
  - **Butter** (`var(--butter-500)`) = credit-cost badges + "New" tags
  - **Cocoa** (`var(--cocoa-900)`) = borders + offset shadow
  - **Tomato** (`var(--tomato-500)`) = error states only

No new tokens, no new spacing scale, no new typography — this pack only consumes what Round 01/02 already define.

## Validation checklist

### Page render
- [ ] `/style-match` loads with the marketing Navbar from Round 01
- [ ] Hero copy reads "See any photo — in your favorite look." with the right span in terracotta
- [ ] Two upload slots render side-by-side on `sm:` and stack on mobile
- [ ] Output size shows 1:1 default, with three radio-styled tiles
- [ ] Mode toggle defaults to "Just the style", helper microcopy matches selected mode
- [ ] Credit cost badge shows "2 credits per generation"

### Upload flow
- [ ] Drag-drop a JPG into either slot → preview thumb + filename + Replace link
- [ ] Click "paste an image URL" → URL input appears → submit → preview shows the URL
- [ ] File >10MB → inline error in red under the slot
- [ ] Wrong filetype (e.g. PDF) → "Use JPG, PNG, or WebP."

### Generation flow (signed in)
- [ ] Both slots filled → state header changes from "Waiting…" to "Ready to cook"
- [ ] Click Generate → button transitions to "Cooking…", panel shows shimmer + rotating copy
- [ ] On success → result image renders with correct aspect ratio + Download HD / Regenerate / Share row
- [ ] On error → red copy + "Try again" button + reassuring "Credits were refunded" copy
- [ ] Click Download HD → triggers download with filename `oneclickart-style-match-XXXXXX.png`
- [ ] Click Regenerate → re-fires with the same inputs

### Generation flow (signed out)
- [ ] Both slots filled → Generate button copy reads "Sign in to generate"
- [ ] Button disabled (or routes to sign-in — confirm with backend wiring)

### Out-of-quota state
- [ ] Free user past daily 3-gen cap → button copy "Out of free generations · upgrade", butter background, links to `/pricing` in new tab

### Mobile
- [ ] Two upload slots stack vertically on `<sm` viewport
- [ ] Mode toggle stays 2-up (it's narrow enough)
- [ ] Aspect ratio picker stays 3-up
- [ ] Result panel comes BELOW the form on mobile (not side-by-side)

## Parked for v2 (do NOT build now)

Per saved memories, these are intentionally out of scope for v1 and should not be added without a separate scope conversation:

- Two-stage vision-LLM JSON pipeline (eliminates text/UI bleed-through entirely)
- Face-lock second pass (re-run with original + styled output to fix face drift)
- Style strength slider (interpolates identity weight between modes)
- Multiple variations per generation (parallel calls)
- Public share pages for style match results
- Watermark on free-tier downloads
- "Recent matches" history strip on the Style Match page
- Polar billing for a Style Match credit pack
- Embedding-based face similarity check + auto-retry

## What's next (after this round)

- **Round 10 — History + sharing.** Build the `styleMatchResults` table out into a "Recent matches" gallery on `/style-match`, plus a public `/match/$resultId` share page mirroring `/art/$jobId`.
- **Round 11 — Two-stage pipeline.** Replace the single Gemini call with a vision-LLM-describes-aesthetic-as-JSON → text-to-image pipeline. Eliminates text/UI bleed-through and gives us a controllable style strength slider.

Estimated review + apply time: half a day. Backend work (api route + schema + Gemini integration) is another half day.
