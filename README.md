# oneclickart frontend design

Drop-in design packages for the oneclickart.com frontend — apply file-by-file in the production repo (`EPM347/best-art-gen-ai-main`).

## Rounds

### [`01-marketing-cream/`](./01-marketing-cream/)
Marketing-only cream + neo-brutalist theme. Wraps `/`, `/pricing`, `/faq`, `/privacy`, `/terms` in a `.theme-cream` scope.

### [`02-dashboard-cream/`](./02-dashboard-cream/)
Extends the cream theme into `/dashboard/*` and redesigns the chrome (sidebar, topbar, page header) plus the dashboard home composition.

### [`03-creations-cream/`](./03-creations-cream/)
Redesigns `/dashboard/creations`. Inline peek drawer, 4-up gallery grid, chunky filter pills, neo empty state.

### [`04-settings-cream/`](./04-settings-cream/)
Redesigns `/dashboard/settings`. Chunky chip tabs, hero plan card, billing card, 4 usage meters, 3-up plan compare, plus the four secondary tabs.

### [`05-generator-cream/`](./05-generator-cream/)
The conversion funnel. One unified `<Generator />` component handles upload → style → generate → result. Replaces the 1688-line `/best-ai-art-generator` monolith and consolidates `/app/upload` into the same flow. Inline signup panel for guests (Google / Apple / Email + magic link), photo+style persist through OAuth, auto-generation on return.

## Order of application

Apply in order. Round 02 must come before 03 / 04 / 05 (they all depend on its app.css extensions and chrome components). Rounds 03 and 04 are independent. Round 05 stands alone but reads cleanest if Round 02 is already in.

Each round folder contains:
- `README.md` — file-by-file change summary, validation checklist, notes on what to wire post-apply
- `app/...` — drop-in files (full replacements or new files)
- `diffs/...` — small surgical patches against existing files (where applicable)
