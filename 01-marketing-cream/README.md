# PR: Marketing-only cream theme

Apply the cream/terracotta brand to `oneclickart.com`'s marketing surface
(`/`, `/pricing`, `/faq`, `/terms`, `/privacy`) without touching the
production app (`/app/upload`, `/dashboard/*`, `/best-ai-art-generator`).

## What changes

| File | Action | Lines | Risk |
|---|---|---|---|
| `app/app.css` | Replace | +200 | Low — additive `.theme-cream` block; existing `:root` and `.dark` untouched |
| `app/routes/marketing-layout.tsx` | **NEW** | 22 | Trivial |
| `app/routes.ts` | Replace | reorganized | Low — same routes, grouped under `layout()` |
| `app/root.tsx` | 1-line patch | 1 | Trivial — adds 2 fonts to the existing async loader |
| `app/components/homepage/integrations.tsx` | 2 small patches | ~6 | Low — additive `boxed-word` class + CSS-var glow |

**Zero changes** to: `navbar.tsx`, `content.tsx`, `pricing.tsx`, `footer.tsx`,
`home-trust-strip.tsx`, `pro-tools-strip.tsx`, `merch-teaser.tsx`,
`showcase-section.tsx`, `subscription-faq.tsx`, `home.tsx`, `pricing.tsx` (route),
`button.tsx`, `homepage-cta.ts`, `logo.tsx`, every shadcn primitive.

The only reason this works with so few changes: every component already uses
semantic Tailwind tokens (`bg-primary`, `text-accent`, `bg-card`, etc.). When
the `.theme-cream` wrapper overrides those CSS variables, every component
inherits the new palette automatically.

## How to apply

1. **Replace `app/app.css`** with `pr-cream/app/app.css`. The `:root` and
   `.dark` blocks are byte-identical to your current file (I preserved them);
   the only new content is one `--font-display` line in `@theme`, three
   `--hero-glow-*` lines in `:root`, and the entire `.theme-cream { … }` /
   `.theme-cream .boxed-word { … }` / `.theme-cream .neo-press { … }` block
   appended after `.dark`.

2. **Add `app/routes/marketing-layout.tsx`** as a new file (full content in
   `pr-cream/app/routes/marketing-layout.tsx`).

3. **Replace `app/routes.ts`** with `pr-cream/app/routes.ts`. The only
   structural change: marketing routes (`/`, `/pricing`, `/faq`, `/privacy`,
   `/terms`) are now grouped inside `layout('routes/marketing-layout.tsx', […])`.

4. **Apply patch 01** to `app/root.tsx` (one-line font URL swap, see
   `pr-cream/diffs/01-root.tsx.patch`).

5. **Apply patch 02** to `app/components/homepage/integrations.tsx` (replace
   inline gradient with CSS-var refs + add `boxed-word` class to the hero
   span, see `pr-cream/diffs/02-integrations.tsx.patch`).

6. `npm run dev` and visit `/` — should be cream + Fraunces. Click "Open the
   art tool" to navigate to `/best-ai-art-generator` — should snap back to
   navy + Inter. That's the intended transition.

## Why the boxed word?

The hero currently emphasizes "without writing prompts" with orange `text-accent`.
In cream context, that span gets the additional `boxed-word` class which
renders it as a chunky terracotta box with a -2° rotation and 6px hard shadow.
Same DOM, same SEO, same screen-reader behavior — just a more confident
visual treatment that matches the cream brand's neo-brutalist accent layer.

If you want to remove the rotation/shadow and keep it purely flat-color in
cream too: edit `.theme-cream .boxed-word { … }` in `app.css`.

## Things I deliberately did NOT do

- **Did not touch the footer's `bg-black`.** That intentional black footer
  gives a clean visual punctuation. If you want a cocoa footer in cream
  context, replace `bg-black` with `bg-footer-bg` in `footer.tsx` and the
  `--footer-bg` cream override (already in app.css) takes effect.

- **Did not edit `homepage-cta.ts`.** The `!bg-accent` / `!border-primary`
  utilities reference CSS variables, so they auto-cream. I added a
  cream-scoped neo-style override (chunky shadow + press-down) at the
  bottom of `app.css` that targets these classes via attribute selector
  — but it's purely additive and you can delete that block if you want
  flat cream buttons instead of neo.

- **Did not touch `team.tsx`** — confirmed deleted from this commit.

- **Did not retheme `/sign-in`, `/sign-up`, `/success`,
  `/subscription-required`.** These are auth/transactional pages that
  should stay neutral so users feel the product is consistent. If you
  want them cream too, move them inside the `layout('routes/marketing-layout.tsx', […])`
  block in `routes.ts`.

## Validation checklist

- [ ] `/` renders cream/cocoa with Fraunces italic headline; "without writing
      prompts" is a rotated terracotta box
- [ ] All trust-strip checks, step icons, pricing cards, faq accordion render
      with cream tokens (cocoa borders, terracotta accents, sage check icons)
- [ ] CTA buttons render with chunky cocoa shadow + press-down on click
- [ ] Footer stays black (intentional — visual punctuation)
- [ ] Click any CTA → `/best-ai-art-generator` → navy palette + Inter
- [ ] `/app/upload` and `/dashboard` still navy (untouched)
- [ ] Dark mode (`.dark` class on `<html>`) still works on app routes
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No console errors in dev

## What to expect on first paint

Because the font loader is deferred (post-paint), there's a ~100–300ms window
where headlines render in the system fallback before Fraunces swaps in. This
matches the current Inter behavior. If FOUT is unacceptable, switch to
`<link rel="preload">` for Fraunces in the `links()` function in `root.tsx`,
but it costs ~30KB of blocking download.

## Estimated time to ship

- Apply diffs: 30 minutes
- Visual QA on `/`, `/pricing`, `/faq`: 30 minutes
- Fix any small style collisions: 30–60 minutes
- Total: half a day, including QA. Not the 3–5 day estimate I gave before
  reading the code — the codebase is cleaner than I assumed.
