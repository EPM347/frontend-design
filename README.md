# oneclickart frontend design

Drop-in design packages for the oneclickart.com frontend — apply file-by-file in the production repo (`EPM347/best-art-gen-ai-main`).

## Rounds

### [`01-marketing-cream/`](./01-marketing-cream/)
Marketing-only cream + neo-brutalist theme.

### [`02-dashboard-cream/`](./02-dashboard-cream/)
Cream theme into `/dashboard/*` plus chrome and dashboard home redesign.

### [`03-creations-cream/`](./03-creations-cream/)
Redesigns `/dashboard/creations` with inline peek drawer + 4-up gallery grid.

### [`04-settings-cream/`](./04-settings-cream/)
Redesigns `/dashboard/settings`. Chip tabs, hero plan card, billing, meters, plan compare.

### [`05-generator-cream/`](./05-generator-cream/)
The conversion funnel. One unified `<Generator />` component handles upload → style → generate → result. Inline signup panel for guests.

### [`06-pricing-cream/`](./06-pricing-cream/)
Redesigns `/pricing` with chunky neo plan cards, feature comparison table, and FAQ accordion.

### [`07-homepage-generator/`](./07-homepage-generator/)
Embeds the `<Generator />` from Round 05 directly into the homepage as a `id="try"` section between Hero and Content.

### [`08-share-cream/`](./08-share-cream/)
Redesigns `/art/$jobId` (the public share page). Drops the homepage Navbar for a minimal cream brand bar. Replaces "AI Line Art" copy with style-aware copy. Adds optional side-by-side original/result + a stronger conversion footer.

### [`09-style-match-cream/`](./09-style-match-cream/)
Adds the **Style Match** feature — standalone `/style-match` route where users drop their photo + a style reference image and pick an intent (just the style / style + scene). 2 credits per generation. Backend uses Gemini 3.1 Flash Image Preview server-side; this pack is frontend-only and ships diffs to wire it into the dashboard sidebar + hero.

## Order of application

Apply rounds in numerical order. Round 02 is required for 03/04/05/09. Round 05 is required for 07 and 08 (style catalog import). Round 01 is required for 06 and 09. Round 09 is independent of 03/04/05/06/07/08 — it only consumes design tokens from 01/02.
