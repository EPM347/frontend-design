# oneclickart frontend design

Drop-in design packages for the oneclickart.com frontend — apply file-by-file in the production repo (`EPM347/best-art-gen-ai-main`).

## Brand system

Canonical brand reference (applies across all rounds):

- [`_brand/BRAND_GUIDE.md`](./_brand/BRAND_GUIDE.md) — long-form reference (color tokens, type, neo primitives, voice, patterns, imagery, donts)
- [`_brand/DESIGN_PROMPT.md`](./_brand/DESIGN_PROMPT.md) — paste-able LLM brief (one page)
- [`_brand/brand-book.html`](./_brand/brand-book.html) — the visual brand book (open in a browser)

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
The conversion funnel. One unified `<Generator />` component for upload → style → generate → result. Inline signup panel for guests.

### [`06-pricing-cream/`](./06-pricing-cream/)
Redesigns `/pricing` with chunky neo plan cards, feature comparison table, FAQ accordion.

### [`07-homepage-generator/`](./07-homepage-generator/) — superseded by Round 09
Embedded the Generator into the homepage. Round 09 drops this in favor of a marketing-focused homepage; visitors go to `/best-ai-art-generator` for the generator.

### [`08-share-cream/`](./08-share-cream/)
Redesigns `/art/$jobId` (the public share page). Style-aware copy, cream brand bar.

### [`09-homepage-v3-cream/`](./09-homepage-v3-cream/)
The full V3 homepage rewrite. 10 cream + neo section components, real copy from oneclickart.com, drops the Round 07 HomeGenerator embed. Includes the canonical brand system in `_brand/`.

## Order of application

Apply rounds in numerical order. Round 02 is required for 03/04/05. Round 05 is required for 08 (style catalog). Round 01 is required for 06. Round 06 is required for 09 (PlanCard + PricingFAQ primitives reused). Other rounds are independent.
