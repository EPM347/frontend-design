# oneclickart frontend design

Drop-in design packages for the oneclickart.com frontend — apply file-by-file in the production repo (`EPM347/best-art-gen-ai-main`).

## Rounds

### [`01-marketing-cream/`](./01-marketing-cream/)
Marketing-only cream + neo-brutalist theme. Wraps `/`, `/pricing`, `/faq`, `/privacy`, `/terms` in a `.theme-cream` scope.

### [`02-dashboard-cream/`](./02-dashboard-cream/)
Extends the cream theme into `/dashboard/*` and redesigns the chrome (sidebar, topbar, page header) plus the dashboard home composition (greeting, hero card, recent creations masonry, try-something-new, usage strip).

### [`03-creations-cream/`](./03-creations-cream/)
Redesigns the `/dashboard/creations` page. Inline peek drawer replaces the modal, 4-up gallery grid, chunky filter pills, neo empty state.

### [`04-settings-cream/`](./04-settings-cream/)
Redesigns the `/dashboard/settings` page. Chunky chip tabs, hero plan card, billing card, 4 usage meters with bars, 3-up plan compare, plus the four secondary tabs.

## Order of application

Apply rounds in numerical order. Round 03 and Round 04 both depend on Round 02's `app.css` extensions and shared chrome components (sidebar, topbar, page header). Round 03 and Round 04 are independent of each other and can be applied in either order.

Each round folder contains:
- `README.md` — file-by-file change summary, validation checklist, and notes on what to wire post-apply
- `app/...` — drop-in files (full replacements or new files)
- `diffs/...` — small surgical patches against existing files (where a full replacement would be overkill)
