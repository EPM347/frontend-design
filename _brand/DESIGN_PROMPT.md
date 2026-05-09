# OneClick·Art — Design Prompt

> **Paste this into any LLM, Cursor session, or hand to a designer.** It's the one-page brief that anchors anyone to the brand without making them read the full guide.

---

You are designing for **OneClick·Art** — a photo-to-art SaaS that turns user photos into stylized artwork. The product does *one* thing: drop a photo, tap a style, get art. No prompts, no typing, no learning curve.

## Brand soul

The friendliest art tool on the internet. Warm cream paper, thick brown ink, small chunky stamps for emphasis. Something you'd find in a thoughtful printmaker's shop, not a tech expo. The voice is direct and unhurried — Hemingway, not Shakespeare. *"Tap a style. Get art."* The neo-brutalist accents (chunky borders, hard offset shadows, slightly rotated stamps) keep the warmth from feeling sleepy, but they punctuate — they never dominate.

## Color palette (and these only)

| Color | Hex | Use |
| --- | --- | --- |
| Cream 50 | `#FBF6EE` | Page background |
| Cream 100 | `#F4E8D8` | Inset surfaces, cards-on-cards |
| Cream 200 | `#E5D8C2` | Image placeholders, disabled |
| Cocoa 900 | `#3A2E26` | All borders + body text + hard shadows |
| Cocoa 700 | `#5C4A3D` | Muted text |
| Terracotta 500 | `#D87C5A` | THE accent. Primary CTAs + headline highlight word |
| Butter 500 | `#F4C95D` | Pill eyebrows, "free" callouts, boxed numbers |
| Sage 500 | `#88A584` | Success ✓ marks, "Ready" status |
| Tomato 500 | `#C9523A` | Errors only — never marketing |

No 5th color. No black (cocoa instead). No gray (cocoa-700 instead).

## Typography

- **Fraunces** (italic 400-600) — All display + headline accent words. Always italic.
- **DM Sans** (400-700) — All body, buttons, labels.
- **DM Mono** (400-500) — Numbers when the number is the protagonist (prices, counts, dates).

Headline pattern: italic display headline with **one** word as the terracotta italic accent. *"Tap a style. Get **art**."*

## Neo primitives (use sparingly)

1. **2.5-4px cocoa border + hard offset shadow** — every "card" surface. Shadow sizes 2/3/4/6/8px depending on focal weight. **Never blur** the shadow.
2. **Press-down active state** — buttons translate by their shadow offset and the shadow goes to `0 0`. Without this, buttons feel dead.
3. **Boxed word** — terracotta + cocoa border + 6px shadow + rotate(-2deg). Wraps **one** word in a hero or callout. Rule of one — never two boxed words in the same composition.
4. **Boxed number** — same as boxed word but butter background. For counts (47), prices, days-in-a-row.
5. **Pill eyebrow** — butter background + cocoa border + 3px shadow + uppercase 11px tracking 0.22em. Above any major headline with a CTA below.

## Voice rules

1. **Direct, never corporate.** "Tap a style. Get art." Not "Discover the power of AI-driven artistic transformation."
2. **Short sentences with periods.** Two short ones beat one long one.
3. **Warm, not cute.** No emojis in body copy (✦ ascii sparkle is OK as a hero accent).
4. **Confident without flexing.** "Use them however you like." Not "industry-leading flexibility."

Vocabulary preferences:
- Yes: tap, drop, pick, make, see, get, pay if you love it
- No: click, generate, synthesize, discover, unlock, empower
- The product **isn't AI in the headline.** AI is plumbing, not the pitch. (Exception: SEO surfaces.)

## Recurring phrases (use exactly)

- "Tap a style. Get art."
- "Photos in. Art out. No typing."
- "No prompts, no typing, no learning curve."
- "Three taps. One photo. Done."
- "Free to try. No card."

## Real product facts (don't invent)

- Pricing: **Starter Pack $6.99** / **Pro Pack $9.99** ("Most chosen") / **Artisan Pro $19.99**
- Styles (10): One Line Art, Studio Ghibli, Realistic Sketch, 3D Cartoon, Pop Art, Oil Painting, Pet Portrait, Silhouette, Watercolor, Artistic Reimagining
- Free tier: 5 generations / day, no card
- Email: hello@oneclickart.com
- Address: 30 N Gould St #53707, Sheridan, WY 82801, USA
- Domain: oneclickart.com (also stylized "OneClick·Art")

## Things that break the brand instantly

- Generic AI-art clichés: glowing particles, neon orbs, circuit boards, robot hands
- Glossy corporate stock photography
- "Click here" / "Sign up to unlock" / "Generate" buttons
- Sans-serif italic anywhere (italic is Fraunces's job)
- Blurred shadows (hard offset only)
- Two boxed-words in the same composition
- Pure black or gray — substitute cocoa-900 / cocoa-700

## When in doubt

Ask: *"Would this feel out of place in a small printmaker's shop run by someone who genuinely loves what they make?"* If yes, don't ship it.

For the full design system (every token, every section pattern, every do/don't), see `BRAND_GUIDE.md`.

---

**One sentence to remember:** OneClick·Art's design says *"we know what we're doing, we're confident enough to be playful, and we want you to make something."*
