# 02 — Dashboard Cream

Round 02 brings the cream + neo system **into the logged-in dashboard**. Round 01 only wrapped the marketing routes; this PR wraps `/dashboard/*` so the entire app inherits cream tokens, then redesigns the dashboard chrome (sidebar, topbar, page header) and the dashboard home page composition (greeting, hero card, recent creations masonry, "try something new", and the quiet usage strip at the bottom).

> **Scope**: Chrome + dashboard home only. The Creations page (`/dashboard/creations`) and Settings page (`/dashboard/settings`) are mocked but **not in this PR** — they'll land in Rounds 03 and 04 after you sign off on the chrome decisions here.

## What changes

### Wraps the dashboard in `.theme-cream`
- `app/routes/dashboard/layout.tsx` — single change: wrap the `SidebarProvider` in a `<div className="theme-cream">`.
- `app/app.css` — extends the existing `.theme-cream` block from Round 01 with **sidebar tokens** (so shadcn's Sidebar inherits the cream palette) plus a handful of utility classes (`.neo-card`, `.neo-btn-primary`, `.neo-btn-ghost`, `.boxed-name`, `.boxed-num`, `.neo-chip`).

### Replaces the chrome
- `app-sidebar.tsx` — 3 nav items (Dashboard / My creations / Settings), no group label, butter plan card with live tier + remaining credits, "Manage plan →" CTA, compact user pill.
- `site-header.tsx` — cream-50 topbar, sidebar trigger, page-aware title, chunky neo quota chips, terracotta "Make art" CTA with hard offset shadow.
- `header-quota-badges.tsx` — chunky neo-chip styling (white card, 2px cocoa border, 2px hard shadow, colored dot, tabular num) replaces the old shadcn Badge.

### Adds an extensible page header
- `dashboard-page-header.tsx` — gains optional `display`, `eyebrow`, `boxedNamePart`, and `boxedNumPart` props. The dashboard greeting uses `display + boxedNamePart` to render `"Good morning, Emon."` with `Emon.` boxed in terracotta and rotated -2°. The future creations page uses `boxedNumPart` to box the count in butter.

### Reshapes the dashboard home
- `routes/dashboard/index.tsx` — new composition: greeting + streak badge → hero card → recent creations masonry → try something new → usage strip.
- **NEW** `hero-make-art-card.tsx` — the prospective "make some art" hero with a 3×2 recently-used styles preview and chunky CTAs.
- **REPLACED** `recent-creations.tsx` — now a 4-column masonry grid (1 feature tile spanning 2 rows + 6 squares). Tiles link directly to `/dashboard/creations?selected={id}` for full actions; no inline upscale dialog.
- **NEW** `try-something-new.tsx` — 4-card grid suggesting unused styles. Filters out styles already in the user's last 8 jobs (client-side); replace with a server-side query when one exists.
- **NEW** `usage-strip.tsx` — quiet 4-cell strip at the bottom (images / upscales / no-bg / rollover) with thin progress bars + a "Manage plan →" link. Replaces the old `section-cards.tsx` 3-up grid.

### What's removed (or stops being imported)
- `section-cards.tsx` — no longer referenced from `index.tsx`. You can delete the file or leave it; nothing imports it.

## Files in this PR

| Path | Status | Type |
| --- | --- | --- |
| `app/app.css` | patch | Extends `.theme-cream` block |
| `app/routes/dashboard/layout.tsx` | patch | Single wrapper change |
| `app/routes/dashboard/index.tsx` | full replace | Page composition |
| `app/components/dashboard/app-sidebar.tsx` | full replace | 3-item sidebar with plan card |
| `app/components/dashboard/site-header.tsx` | full replace | Cream topbar |
| `app/components/dashboard/header-quota-badges.tsx` | full replace | Neo chips |
| `app/components/dashboard/dashboard-page-header.tsx` | full replace | Display title + boxed-name support |
| `app/components/dashboard/hero-make-art-card.tsx` | **NEW** | Hero card |
| `app/components/dashboard/recent-creations.tsx` | full replace | Masonry grid (no inline upscale) |
| `app/components/dashboard/try-something-new.tsx` | **NEW** | 4-card style suggestions |
| `app/components/dashboard/usage-strip.tsx` | **NEW** | Quiet bottom strip |

## Notes for `nav-main.tsx` and `nav-user.tsx`

We chose **not** to replace these files. The cream theme block adds rules targeting `[data-slot="sidebar-menu-button"][data-active="true"]` so the active nav item gets the terracotta + cocoa-border + offset-shadow treatment automatically. The user dropdown stays exactly as-is — only its visual tokens change because the cream theme cascades through.

## Validation checklist

After applying:

- [ ] `/dashboard` renders with cream-50 background, cocoa-900 typography, butter plan card in the sidebar
- [ ] Active nav item has terracotta-500 background + 2px cocoa border + 3px offset shadow
- [ ] Greeting shows `"Good morning, [FirstName]."` with the name boxed in terracotta and rotated
- [ ] Hero card has chunky 8px shadow, terracotta "Upload a photo" CTA, and 3×2 style preview tiles
- [ ] Recent creations grid shows 1 large feature tile + up to 6 squares
- [ ] Usage strip at the bottom shows 4 cells with progress bars
- [ ] Topbar Make-art CTA pushes down on `:active` (translate + shadow → 0)
- [ ] No layout shift when the quota query loads — skeletons match final dimensions
- [ ] Mobile (< 768px): sidebar collapses to offcanvas, hero card stacks, masonry collapses to 2-up

## Style preview thumbnails

`hero-make-art-card.tsx` and `try-something-new.tsx` reference R2-hosted thumbnails for the style tiles. The current URLs in this PR point at sample assets generated during the design process (hyperagent.com hosts). **Before merge**, swap them for the production R2 URLs from `app/data/styles.ts` (or wherever the style catalog lives).

## What's next

- **Round 03 — Creations page** — peek-drawer detail, 4-up gallery grid, chunky filter pills.
- **Round 04 — Settings page** — chip tabs, hero plan card, billing + usage meters + 3-up plan compare, plus the four secondary tabs.

Estimated review time: half a day per round.
