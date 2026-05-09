# oneclickart frontend design

Drop-in design packages for the oneclickart.com frontend — apply file-by-file in the production repo (`EPM347/best-art-gen-ai-main`).

## Rounds

### [`01-marketing-cream/`](./01-marketing-cream/)

Marketing-only cream + neo-brutalist theme. Wraps `/`, `/pricing`, `/faq`, `/privacy`, `/terms` in a `.theme-cream` scope. Logged-in app and dashboard stay untouched.

- 5 files changed (2 patches + 3 full files + 1 new file)
- ~half-day of work
- Zero per-component edits — semantic tokens auto-flip via CSS variable overrides

See [`01-marketing-cream/README.md`](./01-marketing-cream/README.md).

### [`02-dashboard-cream/`](./02-dashboard-cream/)

Brings cream + neo into the **logged-in dashboard**. Wraps `/dashboard/*` in `.theme-cream`, replaces the chrome (sidebar, topbar, quota chips), adds a display-style page header, and reshapes the dashboard home (greeting + hero card + recent creations masonry + try-something-new + usage strip).

- 12 files: 2 patches + 8 component replacements/additions + 1 page composition + 1 README
- ~half-day of work
- Removes `section-cards.tsx` from the import graph (3-up stat cards replaced by quiet bottom usage strip)

See [`02-dashboard-cream/README.md`](./02-dashboard-cream/README.md).

## Coming next

- **Round 03 — Creations page** — peek-drawer detail, 4-up gallery grid, chunky filter pills.
- **Round 04 — Settings page** — chip tabs, hero plan card, billing + usage meters + 3-up plan compare.
