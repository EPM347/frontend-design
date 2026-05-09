# 03 — Creations Page (Cream)

Round 03 redesigns the `/dashboard/creations` page in the cream + neo system locked in Round 02. Same convex queries and mutations — new visual surface, simpler IA, and a peek-style details drawer that opens **inline** beneath the selected card instead of stealing the screen with a modal.

> **Prerequisite**: Round 02 (chrome + dashboard home) must be applied first. The components in this round depend on the cream theme tokens and `.neo-*` utility classes that Round 02 added to `app.css`.

## What changes

### Page composition
- `app/routes/dashboard/creations.tsx` — full replacement. Becomes a thin orchestrator: state (search / status / sort / view / selectedId) lives here, rendering is delegated to `~/components/dashboard/creations/*`. Keeps the `?selected=<id>` URL pattern so dashboard tile clicks land directly on a tile with the peek already open.

### Filters
- `creations/filters.tsx` — chunky 4-state pill toggle (All / Done / Cooking / Failed) with live counts, neo-bordered search input, sort `<select>` styled to match, and a 2-button view toggle (Grid / List).
- Replaces the production single-row filter that mixes a search + status select + sort dropdown.

### Grid (default view)
- `creations/grid.tsx` — 4-up square grid (2-up on mobile, 3 on tablet). Each tile is a `creations/card.tsx`.
- `creations/card.tsx` — the canonical creation tile. Square thumb on top with status pill (Ready / Cooking / Failed), 3 hover-revealed action icons (Download / Upscale / Delete), italic style label + relative date in the meta row.
- Selected state: terracotta-tinted offset shadow + slight translate, matches the mockup.

### List (alternate view)
- `creations/list.tsx` — compact list with 56px thumb + style label + meta + status pill. Single neo-bordered card containing all rows. Shares status colors with the grid.

### Peek drawer (replaces modal)
- `creations/details-peek.tsx` — opens **inline beneath the grid** instead of as a center modal. Side-by-side original / result on the left two-thirds, action panel on the right. Five actions: Download (primary), Upscale 2×, No background, Redo, Delete. Plus a one-line cross-sell tagline ("Try the same photo in [other style] — same upload, different mood.").
- Delete uses the existing shadcn AlertDialog for confirmation — same component the production code already pulls in.

### Empty state
- `creations/empty-state.tsx` — warm cream card with chunky terracotta-boxed "first" word, decorative radial glows in butter and sage, single Upload CTA. Replaces the production empty state which is plain text.

## Files in this PR

| Path | Status | Type |
| --- | --- | --- |
| `app/routes/dashboard/creations.tsx` | full replace | Page composition |
| `app/components/dashboard/creations/index.ts` | **NEW** | Barrel exports |
| `app/components/dashboard/creations/types.ts` | **NEW** | `CreationJob` type |
| `app/components/dashboard/creations/filters.tsx` | **NEW** | Search + pills + sort + view toggle |
| `app/components/dashboard/creations/grid.tsx` | **NEW** | 4-up grid |
| `app/components/dashboard/creations/list.tsx` | **NEW** | Compact list |
| `app/components/dashboard/creations/card.tsx` | **NEW** | Single creation tile |
| `app/components/dashboard/creations/details-peek.tsx` | **NEW** | Inline peek drawer |
| `app/components/dashboard/creations/empty-state.tsx` | **NEW** | Empty state with neo CTA |

## Convex query & mutation contracts (verify before apply)

This PR assumes the following convex API surface. If your project's exports differ, change the imports in `creations.tsx` only — the components themselves are pure UI.

```ts
// convex/jobs.ts
listMine({ limit, status?, search?, sort? }) → { jobs: CreationJob[], hasMore }
deleteJob({ jobId })

// convex/upscale.ts
startUpscale({ jobId, level: 2 | 4 | 8 })

// convex/bgRemoval.ts
startBgRemoval({ jobId })
```

The `CreationJob` shape is documented in `creations/types.ts`. If your convex schema names fields differently (e.g. `imageUrl` instead of `resultImageUrl`), the cleanest fix is a tiny adapter in `creations.tsx` rather than threading new field names through every component.

## Validation checklist

- [ ] `/dashboard/creations` loads with the chunky page header showing the count boxed in butter and rotated -2°
- [ ] Filter pills show live counts and toggle the visible jobs without reloading
- [ ] Search input filters by style/notes after the convex query catches up
- [ ] Sort `<select>` cycles Newest / Oldest / By style
- [ ] View toggle switches grid ⇄ list, both with neo borders + hard shadow
- [ ] Hover on a grid tile reveals 3 action icons in the top-right
- [ ] Click a tile → it visibly "selects" (terracotta shadow), peek drawer opens beneath the same row
- [ ] `?selected=<id>` URL param pre-opens the peek (test by following a link from `/dashboard`)
- [ ] Delete shows AlertDialog confirmation, closes the peek on confirm
- [ ] Empty state appears when the user has zero creations
- [ ] Mobile (< 640px): grid collapses to 2 columns, peek goes full-width with stacked panels

## Style preview thumbnails

Same note as Round 02 — the static thumbnails referenced by mockup data are dev fixtures. Once wired to live convex queries returning real R2 URLs, no further changes needed.

## What's next

- **Round 04 — Settings page** (`/dashboard/settings`) — chunky chip tabs, hero plan card with billing card, 4 usage meters, 3-up plan compare, plus the four secondary tabs (Account / Preferences / Usage / Feedback). Will be pushed alongside this round.
