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
Embeds the `<Generator />` from Round 05 directly into the homepage as a `id="try"` section between Hero and Content. Visitors can convert without ever leaving `/`.

## Order of application

Apply rounds in numerical order. Round 02 is required for 03/04/05. Round 05 is required for 07. Round 01 is required for 06. Other rounds are independent.
