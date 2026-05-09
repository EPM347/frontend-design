# 05 — Generator (Try-then-Pay Funnel)

Round 05 redesigns the conversion path. Visitors land on `/best-ai-art-generator` (or `/app/upload` if signed in) and see the **same `<Generator />` component** — upload a photo, pick a style, hit Generate. For guests, the Generate button reveals an inline signup panel that keeps their photo + style visible while they create a free account. After signup completes the generation auto-fires with no further click. For signed-in users, Generate works directly and the result is saved straight to their gallery.

> **Prerequisite**: Round 02 (cream theme + dashboard chrome). The `theme-cream` wrapper and the chunky neo utility classes from `app.css` are required.

## What changes

### One component, three placements

A single `<Generator />` component handles the whole funnel. It's embedded in:

| Route | Mode | Chrome | Auth gate |
| --- | --- | --- | --- |
| `/best-ai-art-generator` | `marketing` | Marketing Navbar | Yes — inline signup panel |
| `/app/upload` | `app` | Dashboard sidebar + topbar | Already signed in |
| (homepage hero, optional Round 06) | `marketing` | Marketing Navbar | Yes — inline signup panel |

### Replaces the 1688-line monolith
The current `app/routes/ai-art-generator.tsx` is one giant 1688-line file containing the workflow state machine, upload handling, style picker, generation logic, result viewer, fullscreen modal, and upscale flow. This PR replaces it with a thin route file (~50 lines) that mounts `<Generator />` and a clean component tree underneath:

```
app/components/generator/
  Generator.tsx          # Top-level orchestrator (state + effects + composition)
  UploadZone.tsx         # Step 1: drop zone, samples, replace flow
  StylePicker.tsx        # Step 2: 10 style tiles + size/likeness pills
  GenerateOrSignup.tsx   # Step 3 left side: Generate button OR inline signup panel
  ResultPanel.tsx        # Step 3 right side: empty / generating / ready states
  types.ts               # Shared types
  index.ts               # Barrel
```

### Replaces `/app/upload`

The previous `/app/upload` was an upload-only helper (used Lorem Picsum sample images, no style picker, linked off to `/best-ai-art-generator?imageId=X`). This PR turns it into a **full-feature generator inside the dashboard chrome** — same `<Generator />` component, mode="app", no signup panel needed. Lorem Picsum is gone.

### Adds the staged-generation utility

`app/utils/staged-generation.ts` persists the user's photo + style selection across the OAuth round-trip. The flow:

1. Guest hits Generate → `<SignupPanel>` calls `stageGeneration({ file, style, size, likeness })` to save state to `sessionStorage`.
2. Clerk redirects to Google/Apple, then back to the same route with `?staged=1`.
3. On mount, `<Generator>` detects `?staged=1` + a signed-in user, calls `consumeStagedGeneration()` to read + clear the stash, then auto-fires the generation.

Files are stored as base64 data URLs (sessionStorage doesn't accept blobs). Stashes expire after 30 minutes.

### Adds the style catalog

`app/config/style-catalog.ts` defines the 10 canonical styles + 4 sample subjects in one place. **Replaces** the scattered references to `SMART_PRESETS` and `imageId`-based samples in the old code. Each entry has `id`, `label`, `description`, `thumbnailUrl`, and optional `needsFace` / `isPro` flags. The `thumbnailUrl` paths are placeholders (`/styles/<id>/thumb.jpg`) — wire to your real R2 URLs before merge.

## Files in this PR

| Path | Status | Type |
| --- | --- | --- |
| `app/components/generator/Generator.tsx` | **NEW** | Orchestrator |
| `app/components/generator/UploadZone.tsx` | **NEW** | Step 1 |
| `app/components/generator/StylePicker.tsx` | **NEW** | Step 2 |
| `app/components/generator/GenerateOrSignup.tsx` | **NEW** | Step 3 left (button + signup panel) |
| `app/components/generator/ResultPanel.tsx` | **NEW** | Step 3 right (empty/generating/ready) |
| `app/components/generator/types.ts` | **NEW** | Shared types |
| `app/components/generator/index.ts` | **NEW** | Barrel |
| `app/utils/staged-generation.ts` | **NEW** | sessionStorage helper for OAuth round-trip |
| `app/config/style-catalog.ts` | **NEW** | 10-style catalog + 4 sample subjects |
| `app/routes/ai-art-generator.tsx` | full replace | Thin wrapper, mode="marketing" |
| `app/routes/app.upload.tsx` | full replace | Thin wrapper, mode="app" |

## Convex contracts (verify before apply)

The Generator uses these mutations / queries. Most match what's already in production. Two are new and need a small backend addition:

| Used as | What it expects | Status |
| --- | --- | --- |
| `api.images.requestUpload` | `({ filename, contentType }) → { key, publicUrl }` | Already exists |
| `api.r2.uploadToR2` | `({ key, contentType, buffer }) → { publicUrl }` | Already exists |
| `api.images.saveImage` | `({ filename, fileSize, contentType, r2Key, publicUrl }) → { _id }` | Already exists |
| `api.subscriptions.checkUserAccessStatus` | `() → { hasAccess: boolean }` | Already exists |
| `api.usage.getQuota` | `() → { freeDailyLimit, freeDailyUsed, ... }` | Already exists |
| `api.jobs.getById` | `({ id }) → Job` | Already exists |
| **`api.jobs.startGeneration`** | `({ imageId, style, size, likeness }) → { jobId }` | **NEW — add or rename** |

The current production code calls the generation through a giant local handler that orchestrates the model directly. This PR assumes a clean `api.jobs.startGeneration` mutation. Either:

1. **Rename** the existing function to match (cleanest), or
2. **Edit one line** in `Generator.tsx` to point at the existing function name.

## OAuth state persistence — verify the redirect URLs

Clerk needs both `redirectUrl` and `redirectUrlComplete` set to the same callback URL (`/best-ai-art-generator?staged=1` or `/app/upload?staged=1`). The Generator handles this automatically via `signUp.authenticateWithRedirect()`. Make sure your Clerk dashboard's allowed redirect URLs include those paths.

## Validation checklist

### Marketing path (`/best-ai-art-generator`)
- [ ] Visitor lands → drop zone + style picker render correctly in cream + neo
- [ ] Sample images (Portrait / Couple / Pet / Landscape) load real photos, not Lorem Picsum
- [ ] Drop a photo → uploaded thumb appears in the cream-100 strip with `Replace` link
- [ ] Click a style tile → terracotta-shadowed selection state + rotation
- [ ] Generate button copy reads `"Sign up free → Generate Studio Ghibli"` (style name varies)
- [ ] Click Generate → Generate row transforms into the inline signup panel; photo + style stay visible above
- [ ] Staged context bar shows the file thumbnail + filename + style name
- [ ] Continue with Google → redirects through Clerk
- [ ] After signup completes → land back on `/best-ai-art-generator?staged=1`, page detects staged state, generation auto-fires (no click)
- [ ] Result reveals at full HD with 4 actions (Download HD primary + Upscale / No-bg / Share icons)
- [ ] "X left today" butter pill renders rotated on the result image
- [ ] Cross-sell line at bottom links to `/dashboard/creations?selected=<id>`
- [ ] "← Back · keep playing" link in signup panel dismisses without losing photo/style

### App path (`/app/upload`)
- [ ] Renders inside the dashboard chrome from Round 02 (sidebar visible)
- [ ] Page header reads "Make some art." with `art.` boxed in terracotta
- [ ] Click Generate → no signup panel, mutation fires immediately
- [ ] Result lands and is saved to gallery
- [ ] Hitting daily free cap → button copy changes to `"Out of free generations · upgrade"` with butter background; click opens `/pricing` in a new tab

### Error states
- [ ] File > 10MB → inline error card under the drop zone
- [ ] Unsupported format → "Use JPG, PNG, or WebP."
- [ ] Generation server error → red-bordered error notice below the workspace, Generate re-enables for retry

## What's next (after this round)

- **Round 06 — Pricing polish** — Lift the `compare-plans` primitive from Round 04 and apply it to `/pricing`. Add a feature comparison table.
- **Round 07 — Homepage embed** — Drop `<Generator mode="marketing" />` into a section of the homepage so visitors can try without leaving `/`.
- **Round 08 — Result share page polish** — `/art/$jobId` still uses old teal palette + says "AI Line Art" (single-style copy). Restyle in cream + neo.

Estimated review + apply time: half a day.
