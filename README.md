# oneclickart frontend design

Drop-in design packages for the oneclickart.com frontend — apply file-by-file in the production repo (`EPM347/best-art-gen-ai-main`).

## Rounds

### [`01-marketing-cream/`](./01-marketing-cream/)
Marketing-only cream + neo-brutalist theme. Wraps `/`, `/pricing`, `/faq`, `/privacy`, `/terms` in a `.theme-cream` scope.

### [`02-dashboard-cream/`](./02-dashboard-cream/)
Extends the cream theme into `/dashboard/*` and redesigns the chrome plus the dashboard home.

### [`03-creations-cream/`](./03-creations-cream/)
Redesigns `/dashboard/creations`. Inline peek drawer, 4-up gallery grid, chunky filter pills.

### [`04-settings-cream/`](./04-settings-cream/)
Redesigns `/dashboard/settings`. Chip tabs, hero plan card, billing, 4 usage meters, 3-up plan compare.

### [`05-generator-cream/`](./05-generator-cream/)
The conversion funnel. One unified `<Generator />` component handles upload → style → generate → result. Inline signup panel for guests, OAuth state persistence, auto-generate on return.

### [`06-pricing-cream/`](./06-pricing-cream/)
Redesigns `/pricing`. Lifts the chunky neo plan card from Round 04, adds a feature comparison table and an FAQ accordion (both new). Same Polar API.

## Order of application

Apply in numerical order. Round 02 must come before 03 / 04 / 05 (they all depend on its app.css extensions and chrome components). Round 06 only depends on Round 01's `.theme-cream` block. Round 03 / 04 / 05 / 06 are independent of each other.
