# 08 — Art Share Page (Cream)

Round 08 restyles `/art/$jobId` — the public read-only share view — in the cream + neo system. Replaces the old teal/green palette and the "AI Line Art" copy that's been hanging around since the product was line-art-only. Also adds an optional side-by-side original/result layout when the original photo is available, and a stronger conversion footer.

> **Prerequisite**: Round 05 (Generator). The page imports `STYLE_CATALOG` and `STYLE_BY_ID` from `~/config/style-catalog` so the result is labeled with the actual style name (e.g. *"Studio Ghibli from a real photo"*) instead of generic copy. If the convex query doesn't yet return `style` on public jobs, the page falls back to *"AI art from a real photo"*.

## What changes

### Full route replacement
- **Drops the homepage Navbar** in favor of a minimal cream-aware brand bar (logo + "Make yours" CTA on the right). Keeps the page lightweight and focused on the artwork.
- **Removes "AI Line Art"** copy throughout. Headline becomes `"<Style> from a real photo."` with the style name in italic terracotta. Body copy reads the style description from `STYLE_CATALOG` (e.g. *"Soft palette, hand-painted edges, warm storybook mood."* for Ghibli).
- **Cream + neo treatment everywhere** — chunky borders, hard offset shadows, butter pill eyebrows, rotated boxed-words. Same primitives the rest of the site uses.
- **Side-by-side original/result** when `signedOriginalUrl` is available on the public job. Falls back to a single centered showcase image if the original isn't exposed publicly.
- **2-button action row**: Download HD (terracotta primary) + Share (cocoa secondary). Share uses Web Share API where available, falls back to clipboard.
- **Style cross-sell line** below the image: *"Like this style? Try Studio Ghibli on your photo →"* points to `/best-ai-art-generator?style=<id>`. (Generator already accepts `?imageId=` — extending it to read `?style=` is a one-line addition; see "Backend follow-up" below.)
- **Friendlier loading + not-found states** in the same cream chrome — no more centered shadcn alert.
- **Conversion footer** with chunky terracotta-shadow CTA card pointing back to the generator + footer links to homepage and pricing.

### What's still optional / forward-looking

The page reads two fields from `api.jobs.getPublicById` that may need backend additions:

- `style` — canonical style id (matches keys in `STYLE_CATALOG`). Without it the page shows generic "AI art from a real photo" copy.
- `signedOriginalUrl` — the user's original photo. Without it the page shows just the result, no side-by-side. (Many users won't want their original photo public — make this opt-in via a "show original on share" toggle in Settings if you add it.)

Both are graceful fallbacks. Ship without them and the page still works.

## Files in this PR

| Path | Status |
| --- | --- |
| `app/routes/art.$jobId.tsx` | full replace |

That's it. One file. No new components — everything is composed inline because the share page is the only place that uses these specific layouts, and the only re-used pieces (`STYLE_CATALOG`, `STYLE_BY_ID`) come from Round 05.

## Convex contract

Same query as production. The page uses these fields, all optional except the result url:

```ts
api.jobs.getPublicById({ id }) → {
  _id: string;
  signedResultUrl?: string;
  resultUrl?: string;
  signedOriginalUrl?: string; // forward-looking — see above
  originalUrl?: string;       // forward-looking
  style?: 'ghibli' | 'watercolor' | ... // see ~/components/generator/types
  styleLabel?: string;        // optional pre-formatted label
  createdAt: number;
}
```

If your job doc names differ (`jobId` vs `_id`, `imageUrl` vs `resultUrl`), adjust the field references in the `Showcase` component — that's the only place fields are read.

## Backend follow-up — `?style=<id>` support in Generator

The cross-sell line links to `/best-ai-art-generator?style=ghibli`. To make this preselect the style in the Generator, extend `app/components/generator/Generator.tsx`:

```tsx
// Inside Generator(), near the top:
const [searchParams] = useSearchParams();
const styleParam = searchParams.get('style') as StylePreset | null;

// Adjust the initial style:
const [style, setStyle] = useState<StylePreset>(
  (styleParam && STYLE_BY_ID[styleParam] ? styleParam : initialStyle) ?? DEFAULT_STYLE,
);
```

This is a small extension — feel free to skip it; the page works either way (the user just gets the default Ghibli style preselected and has to click their preferred style themselves).

## Brand voice rewrites

| Before | After |
| --- | --- |
| `"Shared AI Art"` (page heading) | `"<Style> from a real photo."` with italic terracotta accent |
| `"AI-generated line art created with our custom model"` | Style description from catalog (e.g. *"Soft palette, hand-painted edges, warm storybook mood."*) |
| `"AI Generated"` badge | Style label as the protagonist, no badge needed |
| `"Created on <date>"` with calendar icon | Date in monospace, one line, with style description |
| `"Download Image"` | `"Download HD"` |
| `"Create Your Own"` button (twice) | `"Make your own"` (not-found state) + `"Open the generator"` (footer CTA) |
| `"Love This Style? Create your own stunning AI art..."` | `"Make one with **your photo.**"` — shorter, more direct |
| `"Free users get 5 generations per day • No credit card required"` | `"Five free generations a day. No card. About thirty seconds."` — same info, brand voice |
| `"Artwork Not Found"` | `"Couldn't find that one."` — softer, more human |

## Validation checklist

- [ ] `/art/<valid-id>` renders with cream chrome, italic terracotta style name in the headline
- [ ] If the convex query returns `style: 'ghibli'`, the headline reads *"Studio Ghibli from a real photo."* with style description below
- [ ] If style isn't returned, the page reads *"AI art from a real photo."* — no broken UI
- [ ] If `signedOriginalUrl` is present, two images side-by-side; if not, a single centered result
- [ ] Download button downloads with a sensible filename (e.g. `oneclickart-ghibli-abc123.png`)
- [ ] Share button uses Web Share on mobile, copies to clipboard on desktop
- [ ] `/art/<missing-id>` renders the "Couldn't find that one" cream card with a Make-your-own CTA
- [ ] Loading state shows the chunky butter-pill spinner, not a generic centered loader
- [ ] Footer CTA card points to `/best-ai-art-generator` with terracotta shadow
- [ ] Mobile: cards stack, brand bar stays compact, footer CTA reflows cleanly
- [ ] OG title says *"Made with oneclick·art"* in social previews

## Future polish (later rounds)

- **Per-share dynamic OG images** — generate a 1200×630 banner that shows the result image + style name + brand mark. Either render server-side via a `loader` that returns `meta` based on the job, or use Vercel's OG image API. Massive lift in social CTR.
- **Show-original toggle** in Settings — let users opt in to making the original photo visible on shared pages, otherwise hidden by default for privacy.
- **"More like this"** strip — show 3-4 other public pieces in the same style as a discovery hook. Requires a `listPublicByStyle` convex query.
