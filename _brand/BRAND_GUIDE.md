# OneClick·Art — Brand Guide

> **Canonical reference.** When in doubt, this document is the source of truth. Last updated: 2026-05-09. Version: 1.0.

OneClick·Art turns photos into art. Tap a style. Get art. No prompts, no typing, no learning curve. Everything about the brand — from the tokens below to the voice in the copy — exists to reinforce that promise: **simple, warm, confident, never technical**.

This guide pairs with `DESIGN_PROMPT.md` (a single-page brief you paste into an LLM or hand to a designer) and the live brand book at [`brand-book.html`](./brand-book.html).

---

## Table of contents

1. [Brand soul](#brand-soul) — the one paragraph that anchors everything
2. [Color system](#color-system) — palette + tokens + usage rules
3. [Typography](#typography) — Fraunces, DM Sans, DM Mono
4. [Neo primitives](#neo-primitives) — chunky borders, hard shadows, boxed words
5. [Voice & tone](#voice--tone) — how we sound (with do/don't examples)
6. [Section patterns](#section-patterns) — composition rules that recur across pages
7. [Imagery direction](#imagery-direction) — photos vs illustrations vs AI samples
8. [Don'ts](#donts) — the things that break the brand instantly
9. [Tokens reference](#tokens-reference) — every CSS variable

---

## Brand soul

**OneClick·Art is the friendliest art tool on the internet.** It's warm cream paper, thick brown ink, a small chunky stamp on the title — you'd find it in a thoughtful stationery shop, not a tech expo. The voice is direct and unhurried. Hemingway, not Shakespeare. *"Tap a style. Get art."* — short sentences with periods that land. The product does one thing well; the design says so without raising its voice.

The neo-brutalist accents (chunky borders, hard offset shadows, slightly rotated stamps) keep the warmth from feeling sleepy. They tell visitors: *we know what we're doing, we're confident enough to be playful.* They never dominate — they punctuate.

**One rule above all others:** if a design choice would feel out of place in a small printmaker's shop run by a person who genuinely loves what they make, it doesn't belong in OneClick·Art.

---

## Color system

### Palette at a glance

| Color | Hex | CSS variable | Role |
| --- | --- | --- | --- |
| Cream 50 | `#FBF6EE` | `--cream-50` | Primary page background — most surfaces |
| Cream 100 | `#F4E8D8` | `--cream-100` | Secondary surface — cards-on-cards, sticky strips |
| Cream 200 | `#E5D8C2` | `--cream-200` | Tertiary surface — disabled states, image placeholders |
| Cocoa 900 | `#3A2E26` | `--cocoa-900` | All borders, all primary text, all hard shadows |
| Cocoa 700 | `#5C4A3D` | `--cocoa-700` | Secondary text, eyebrow caps, subtle muted copy |
| Terracotta 500 | `#D87C5A` | `--terracotta-500` | THE accent. CTAs, italic display highlights, "active" states |
| Terracotta 400 | `#E59A7E` | `--terracotta-400` | Hover/lighter terracotta variants |
| Terracotta 600 | `#C26849` | `--terracotta-600` | Active/pressed terracotta variants |
| Butter 500 | `#F4C95D` | `--butter-500` | Secondary accent. Pill backgrounds, "free" callouts |
| Butter 700 | `#C99B30` | `--butter-700` | Butter for progress bars, illustration accents |
| Sage 500 | `#88A584` | `--sage-500` | Success, confirmations, ✓ checks |
| Sage 300 | `#B5C9B0` | `--sage-300` | Sage tints for subtle confirmations |
| Basil 500 | `#6E9760` | `--basil-500` | Deeper sage for variety in 4-color quota strips |
| Tomato 500 | `#C9523A` | `--tomato-500` | Errors, warnings, danger zones |
| White | `#FFFFFF` | `--background` (in cream theme) | Pure white on top of cream — high-contrast cards |

### Usage rules

**Cream is the canvas.** Pages start on `--cream-50` or `white`. `--cream-100` is for inset surfaces (sidebars, sticky strips, "you're in a calmer zone" sections). Avoid full-page `--cream-200` — it reads as washed-out paper.

**Cocoa for everything that draws the eye.** All borders are `--cocoa-900`. All body text is `--cocoa-900`. All hard shadows are `--cocoa-900`. No exceptions for the first three. The cocoa palette gives the brand its warmth — never substitute black.

**Terracotta is rare.** It marks **the** thing on a screen the user should do (primary CTA), or the **one word** in a headline that carries the meaning. *"Tap a style. Get **art**."* — `art` is terracotta italic. Never two terracotta words in the same hierarchy. If everything is highlighted, nothing is.

**Butter is the friendly accent.** Pill eyebrows ("Free trial · no card"), boxed numbers ("47" in a count callout), reassurance callouts ("5 free a day"). Always paired with a cocoa border + small offset shadow. Never used as a CTA color.

**Sage is the tick mark.** Feature lists use `--sage-500` for the ✓. Status pills use it for "Ready". Never use sage for a CTA — it reads as "this isn't the action."

**Tomato is forbidden in marketing.** It belongs only in: error states, danger-zone account actions, failed-job indicators. Never in pricing copy, never in CTAs.

### Don't

- ❌ Don't pair cocoa with black anywhere. They look muddy together.
- ❌ Don't use straight gray for muted text. Always derive muted from `--cocoa-700` (or `oklch` derivative). Gray reads as cold and corporate; cocoa keeps the warmth.
- ❌ Don't add a fifth accent color. Cream + cocoa + terracotta + butter + sage is the system. Want a new mood? Lean on the existing ones at different weights.
- ❌ Don't tint cream slightly toward yellow or pink. The hex values are tuned. Random off-cream values feel sickly.

---

## Typography

### Three families, each with one job

| Family | Role | Where |
| --- | --- | --- |
| **Fraunces** (italic 400/500/600) | Display + decoration | Headlines, italic accents, plan names, body strong (with italic), eyebrow brand voice |
| **DM Sans** (400/500/600/700) | Body | Paragraphs, buttons, labels, anything readable at small sizes |
| **DM Mono** (400/500) | Numbers + technical | Prices, dates, file sizes, status counts, code |

### Type specimens

- **Display 1** — Fraunces italic 500, ~60px desktop / 40px mobile, line-height 0.96, tracking -0.025em. *"Tap a style. Get art."*
- **Display 2** — Fraunces italic 500, ~36-44px, line-height 1, tracking -0.02em. Section heads.
- **Display 3** — Fraunces italic 500, ~24-28px, line-height 1.1. Small section heads, plan names.
- **Body Large** — DM Sans 400, 16-18px, line-height 1.55. Lede paragraphs.
- **Body** — DM Sans 400, 14-15px, line-height 1.55. All paragraph text.
- **Body Small** — DM Sans 500, 12-13px, line-height 1.5. Captions, metadata.
- **Eyebrow** — DM Sans 700, 10-11px, letter-spacing 0.22em, UPPERCASE. Above-headline label.
- **Button** — DM Sans 700, 14-16px, letter-spacing 0.02em.
- **Mono** — DM Mono 400/500, 11-13px. Numbers always in mono if the number is the protagonist (count, file size, price digits, time).

### Pairing rules

- A headline always has a **single italic accent word** in terracotta, never the whole headline.
- Bold (`font-weight: 700`) is rare. Headlines lean on size + italic, body leans on color + size.
- Don't use Fraunces non-italic. The italic is the brand. Roman Fraunces feels like a different typeface.
- Don't use DM Sans italic. Italic is Fraunces's job.
- Numbers in pricing should be Fraunces italic *display weight* for the dollars (e.g. *$9.99*) and DM Sans for the cycle suffix (`/ mo`). The split-style emphasizes the price as the protagonist.

### Don't

- ❌ Don't add a fourth typeface. Three is enough; more is decoration without function.
- ❌ Don't use Inter, Roboto, or other generic sans. They're crisp but cold. DM Sans has personality.
- ❌ Don't size eyebrow caps below 10px or above 12px. They lose their pill rhythm.
- ❌ Don't mix italic and roman in the same Fraunces line.

---

## Neo primitives

Five small visual moves carry the entire neo-brutalist accent. Use them sparingly; they're punctuation, not paragraphs.

### 1. Chunky border + hard offset shadow (`.neo-card`)

```css
border: 2.5px solid var(--cocoa-900);
box-shadow: 4px 4px 0 0 var(--cocoa-900);
```

The default for any "card" surface. **Always 2-4px borders, never 1px.** Always a hard offset shadow, never blurred. Common shadow sizes:

- `2px 2px` — secondary buttons, small chips
- `3px 3px` — primary chips, sticky-feel cards (sidebar plan card, billing card)
- `4px 4px` — main content cards (creation tiles, plan cards)
- `6px 6px` — sticky CTAs ("Make art" topbar button, focal cards)
- `8px 8px` — hero focal points (plan hero card, featured creation tile)

### 2. Press-down active state (`.neo-press`)

```css
.neo-press:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 var(--cocoa-900);
}
```

Buttons and CTAs get a **physical press**: the shadow disappears, the element shifts by exactly the shadow's offset. Match the translate to the original shadow (`4px 4px` shadow ⇒ `translate(4px, 4px)`). Without this, the buttons feel dead.

### 3. Boxed word — terracotta with rotation (`.boxed-name`)

```css
display: inline-block;
background: var(--terracotta-500);
color: white;
border: 4px solid var(--cocoa-900);
padding: 0.04em 0.18em;
transform: rotate(-2deg);
box-shadow: 6px 6px 0 0 var(--cocoa-900);
font-style: normal;
margin: 0 0.06em;
```

The signature treatment. Wraps **one word** in a rotating, terracotta-stamped box. Used for:
- The user's name in greetings (*"Good morning, **Emon.**"* with `Emon.` boxed)
- One word of a hero headline that carries the emotion
- The "Make your **first** piece." CTA

**Rule of one.** Never two boxed words in the same composition. The treatment loses its meaning if it's used decoratively.

### 4. Boxed number — butter, smaller scale (`.boxed-num`)

```css
display: inline-block;
background: var(--butter-500);
border: 3px solid var(--cocoa-900);
box-shadow: 4px 4px 0 0 var(--cocoa-900);
padding: 0.04em 0.14em;
transform: rotate(-2deg);
font-style: normal;
margin: 0 0.06em 0 0.04em;
```

Same treatment as `.boxed-name` but butter and slightly smaller — for **numbers that are the protagonist**: counts, prices, days-in-a-row, "47 pieces." Same rule of one.

### 5. Pill eyebrow with shadow (`.neo-chip`)

```css
display: inline-flex;
font-size: 11px;
letter-spacing: 0.22em;
text-transform: uppercase;
font-weight: 700;
color: var(--terracotta-500);
background: var(--butter-500);
border: 2px solid var(--cocoa-900);
padding: 5px 11px;
box-shadow: 3px 3px 0 0 var(--cocoa-900);
```

The above-headline label. Compresses a value prop into 4-6 words: *"✦ Free trial · no signup needed"*. Always butter background, terracotta text, cocoa border + offset shadow. Place above any major headline that has a CTA below it.

### Don't

- ❌ Don't blur shadows. The hard offset is the brand. `box-shadow: 4px 4px 0 0 var(--cocoa-900)` — note the `0 0` (no blur, no spread).
- ❌ Don't rotate sections, only small accent elements. Rotating a whole card breaks the layout grid.
- ❌ Don't use rounded corners (`border-radius`) on neo-treated elements. They're stamps and labels — squared off. (Exception: image avatars and circle buttons, which are obviously round.)
- ❌ Don't apply the chunky shadow + thin border. The border weight (2.5-4px) carries the visual weight; thin borders make the shadow look unanchored.

---

## Voice & tone

### The four rules

1. **Direct, never corporate.** "Tap a style. Get art." Not "Discover the power of AI-driven artistic transformation."
2. **Short sentences with periods that land.** Hemingway. Not Shakespeare. Two short sentences > one long one.
3. **Warm, not cute.** "Real human reads every one." Not "We'd love to hear from you 🥰."
4. **Confident without flexing.** "Your monthly credits cover both — use them however you like." Not "We're proud to offer industry-leading flexibility."

### Vocabulary

- **Yes:** "Tap. Drop. Pick. Make. See. Get. Pay if you love it."
- **No:** "Click. Upload (interchangeable with 'Drop' is fine). Generate (technical). Synthesize. Discover. Unlock. Empower."
- The product **isn't AI in the headline.** It's a *photo-to-art tool*. AI is plumbing, not the pitch. (Exception: SEO copy on `/best-ai-art-generator` where the keyword does work.)

### Specific phrases that recur (use these exactly)

- "Tap a style. Get art."
- "Photos in. Art out. No typing." (footer / micro-tagline)
- "No prompts, no typing, no learning curve."
- "Three taps. One photo. Done."
- "Free to try. No card."

### Do / Don't pairs

| Don't | Do |
| --- | --- |
| "Unleash your creativity" | "Tap a style. Get art." |
| "AI-powered art generation" | "Photo-to-art tool" |
| "Sign up to unlock" | "Sign up free → Generate Watercolor" |
| "Click here" | "Try Watercolor" / "Upload a photo" |
| "Cutting-edge models" | (Don't mention the models. The user doesn't care.) |
| "Premium plan" / "Enterprise" | "Pro Pack" / "Artisan Pro" — small-shop names |
| "Quota exceeded" | "Out of free generations · upgrade" |
| "An error occurred" | "Something went sideways. Try Generate again." |
| "Subscribe now" | "Try Starter — $6.99" / "Go Pro — $9.99" |
| "Loading..." | "Hold on a sec…" / "Cooking…" / "Picking colors…" |

### Tone shifts by surface

- **Marketing pages** — warmest. Lots of *"you'd hang on a wall"* / *"Make one with your photo"* energy.
- **App / dashboard** — direct, less decorative. *"Last made: Studio Ghibli, 2 days ago."*
- **Errors** — soft, never blaming. *"Couldn't find that one."* not *"404 Not Found."*
- **Legal / Terms** — short and clear. Skip the "Terms and Conditions of Use" preamble; just say what you mean.

---

## Section patterns

### Marketing page composition (top-to-bottom)

1. **Hero** — eyebrow chip + display headline (with one boxed/italic accent word) + 1-2 line sub + 1-2 CTAs + maybe 3 trust bullets
2. **Pitch** — section reinforcing the core "no prompts" promise (could be a "tap don't type" pitch, an anti-pattern callout, etc.)
3. **Process** — 3-step "how it works" with stepped numerals (i / ii / iii in Fraunces italic)
4. **Power** — 3-column feature callouts for what subscribers get extra
5. **Use cases** — 3-column "what people do with the art" (print, wear, share)
6. **Style preview** — 4×2 or 3×3 grid of style names + 1-line descriptions
7. **Pricing strip** — 3 plan cards (lift `<PlanCard>` from Round 06)
8. **FAQ** — 6-8 questions, first opens by default (lift `<PricingFAQ>` from Round 06)
9. **Final CTA** — eyebrow + headline + sub + single primary CTA (often a repeat of the hero CTA)
10. **Footer** — logo + tagline + address + email + 4-column link grid

### Dashboard page composition (top-to-bottom)

1. **Greeting + context** — `display` page header with optional boxed name + 1-line context ("Last made: Studio Ghibli, 2 days ago.") + optional streak badge
2. **Hero card** — the "make some art" prompt (only on dashboard home)
3. **Primary content** — gallery / settings tabs / form
4. **Secondary surface** — usage strip / try-something-new / discovery
5. **Quiet utilities at bottom** — quota, plan management

### Spacing rhythm

- Section padding: 64-96px desktop, 36-48px mobile (vertical)
- Container max-width: 1200-1640px depending on density
- Grid gaps: 14-22px for masonry / card grids
- Within-card padding: 24-40px

---

## Imagery direction

### Real photos beat AI fakes

OneClick·Art is built around real human photos. The marketing site should feature **real before-after pairs** with rights-cleared subjects. AI-generated samples are fine as placeholder, but production should reach for actual user submissions (with permission) or curated stock.

### What works

- Warm, human, slightly imperfect photos. A real face. A pet on a couch. A wedding shot.
- Square crops dominate (matches the result aspect ratio).
- Subtle film grain or paper texture in backgrounds is welcome — feels like a printmaker's shop.

### What doesn't

- ❌ Glossy stock photography (the woman pointing at a laptop). Too corporate.
- ❌ Generic "AI art" tropes (glowing particles, neon orbs, abstract light rays). The product is photo→art, not abstract generation.
- ❌ Heavy filters or HDR-overprocessed photos. The brand is paper-warm; oversaturation breaks the mood.
- ❌ Tech imagery (circuit boards, hands typing on glowing keyboards, robot hands). The product hides AI; don't undo that with imagery.

### Style preview thumbnails

Each of the 10 styles needs a square thumbnail at 512×512 minimum. Same source photo across all thumbnails when possible — lets visitors see the same subject in 10 styles. Hosted on R2 at `/styles/<id>/thumb.jpg`.

---

## Don'ts (the big ones)

1. ❌ **Don't add a fifth color.** Cream + cocoa + terracotta + butter + sage. That's the system.
2. ❌ **Don't use a different display typeface.** Fraunces italic. Always.
3. ❌ **Don't blur shadows.** Hard offset, no blur, no spread.
4. ❌ **Don't say "AI" in marketing headlines** (SEO surfaces excepted).
5. ❌ **Don't use generic loading copy.** "Cooking..." beats "Loading..."
6. ❌ **Don't put two boxed-words in the same composition.** Rule of one.
7. ❌ **Don't market features the user can't see.** "Powered by SDXL 1.0 + LoRA fine-tunes" is not for the homepage.
8. ❌ **Don't centralize tone.** Every surface has its own warmth, but always direct, never corporate.
9. ❌ **Don't break the press-down active state.** It's the difference between feeling alive and feeling dead.
10. ❌ **Don't optimize for designers.** Optimize for someone who just wants their pet's portrait.

---

## Tokens reference

All tokens live in `app/app.css` under `.theme-cream`. Wrap any subtree in `<div className="theme-cream">…</div>` to flip every Tailwind semantic token to the cream palette automatically. No per-component edits needed.

```css
.theme-cream {
  /* Cream surfaces */
  --cream-50:        #FBF6EE;
  --cream-100:       #F4E8D8;
  --cream-200:       #E5D8C2;

  /* Cocoa text + borders */
  --cocoa-700:       #5C4A3D;
  --cocoa-900:       #3A2E26;

  /* Accents */
  --terracotta-400:  #E59A7E;
  --terracotta-500:  #D87C5A;
  --terracotta-600:  #C26849;
  --butter-500:      #F4C95D;
  --butter-700:      #C99B30;
  --sage-300:        #B5C9B0;
  --sage-500:        #88A584;
  --basil-500:       #6E9760;
  --tomato-500:      #C9523A;

  /* Standard shadcn token overrides */
  --background:      #FFFFFF;
  --foreground:      var(--cocoa-900);
  --card:            #FFFFFF;
  --card-foreground: var(--cocoa-900);
  --muted:           var(--cream-100);
  --muted-foreground: var(--cocoa-700);
  --border:          var(--cocoa-900);
  --primary:         var(--cocoa-900);
  --primary-foreground: var(--cream-50);
  --accent:          var(--terracotta-500);
  --accent-foreground: #FFFFFF;
  --destructive:     var(--tomato-500);

  /* Sidebar tokens (used inside the dashboard) */
  --sidebar:                   var(--cream-100);
  --sidebar-foreground:        var(--cocoa-900);
  --sidebar-border:            var(--cocoa-900);
  --sidebar-primary:           var(--terracotta-500);
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent:            var(--cream-200);

  /* Typography */
  --font-display: 'Fraunces', serif;
  --font-sans:    'DM Sans', -apple-system, system-ui, sans-serif;
  --font-mono:    'DM Mono', ui-monospace, SFMono-Regular, monospace;
}
```

### Required Google Fonts link

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

---

**End of guide.** When you make a decision that changes the system (new color, new pattern, new voice rule), update this document. The brand is what's written here.
