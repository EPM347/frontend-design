# Sample Matches · one-time setup

The "Try a sample match" button and the proof strip both render pre-generated style-match outputs. These need to be created ONCE manually, then their URLs pasted into `app/components/style-match-canvas/sample-matches.ts`.

Total time: 10-15 minutes.

## What you need

Three triplets, each spanning a distinct aesthetic so the proof strip feels representative:

| ID | Aesthetic | Mode | Aspect | Suggested inspo style |
| --- | --- | --- | --- | --- |
| `sample-cinematic-blue` | Cinematic, moody, blue tones | style | 4:5 | A movie still or moody photo with strong blue/teal grading |
| `sample-golden-hour` | Warm, golden, sunset glow | style | 1:1 | A backlit portrait or sunset landscape with amber tones |
| `sample-soft-pastel` | Soft, painterly, pastel | style+scene | 9:16 | A painted-look portrait or anime-still with soft pinks/greens |

For each triplet you need three image URLs:
1. **userPhotoUrl** — a stand-in "user" photo (selfie, portrait, person)
2. **refPhotoUrl** — the inspo screenshot (the reference look)
3. **resultUrl** — the actual style-matched output

## Where to source the user photos

Three free + commercially-safe options:

1. **Unsplash portraits** — `https://unsplash.com/s/photos/portrait` (free, attribution optional)
2. **This-Person-Does-Not-Exist** — `https://thispersondoesnotexist.com` (no copyright issue, AI-generated)
3. **Your own / a friend with permission** — most authentic

Pick three different-looking subjects (vary age, gender, ethnicity, hair) so the proof strip feels diverse.

## Where to source the inspo refs

1. **Pinterest screenshots** — pick 3 vibrant, distinct looks (cinematic, warm, pastel)
2. **Movie stills via TMDB** — `https://www.themoviedb.org` (CC-licensed posters)
3. **Magazine covers via Vogue archives** — public-domain editorial spreads

## How to generate the 3 results

Option A — manual API calls (recommended):

```bash
# For each triplet, with you signed in:
curl -X POST https://oneclickart.com/api/style-match \
  -F "userPhoto=@user-photo-1.jpg" \
  -F "referencePhoto=@ref-photo-1.png" \
  -F "mode=style" \
  -F "aspectRatio=4:5" \
  -H "Cookie: __session=YOUR_CLERK_SESSION_COOKIE"
```

This will consume 2 credits per triplet (6 total). Use your own account — these are one-time costs.

Option B — local script with auth bypass:

```ts
// scripts/generate-samples.ts
// Bypass auth check (only run with NODE_ENV=development or via a temp admin route)
import { generateStyleMatch } from '~/server/style-match';

const samples = [
  { userPhoto: 'user-1.jpg', refPhoto: 'ref-1.png', mode: 'style', aspect: '4:5' },
  { userPhoto: 'user-2.jpg', refPhoto: 'ref-2.png', mode: 'style', aspect: '1:1' },
  { userPhoto: 'user-3.jpg', refPhoto: 'ref-3.png', mode: 'style+scene', aspect: '9:16' },
];

for (const s of samples) {
  const result = await generateStyleMatch(s);
  console.log(`Generated: ${result.resultUrl}`);
}
```

## How to upload to R2 (if not already)

The `/api/style-match` route auto-uploads to R2 at `style-match/{userId}/{nanoid}.png`. After generation, copy the URLs from the API response (or from the Convex `styleMatchResults` table) and use them directly.

If you want a separate path for samples (clean URL convention):

```
R2 key pattern: samples/style-match/{name}/{user|ref|result}.png

Example:
  samples/style-match/cinematic-blue/user.png
  samples/style-match/cinematic-blue/ref.png
  samples/style-match/cinematic-blue/result.png
```

Then expose via your R2 public bucket as:
`https://media.oneclickart.com/samples/style-match/cinematic-blue/result.png`

## How to update sample-matches.ts

Open `app/components/style-match-canvas/sample-matches.ts` and replace the 9 `__REPLACE_*` placeholders:

```ts
export const SAMPLE_MATCHES: SampleMatch[] = [
  {
    id: 'sample-cinematic-blue',
    name: 'Cinematic blue',
    userPhotoUrl: 'https://media.oneclickart.com/samples/style-match/cinematic-blue/user.png',
    refPhotoUrl:  'https://media.oneclickart.com/samples/style-match/cinematic-blue/ref.png',
    resultUrl:    'https://media.oneclickart.com/samples/style-match/cinematic-blue/result.png',
    mode: 'style',
    aspectRatio: '4:5',
    fallbackGradients: { /* keep as-is */ },
  },
  // ... and so on for the other two
];
```

The `fallbackGradients` field stays — it's the visual fallback that renders if a URL ever 404s in production.

## Verification

After updating `sample-matches.ts`:

1. Visit `/style-match` (signed out or signed in, doesn't matter)
2. The proof strip should show 3 cards with real images (not gradients)
3. Click any card → upload slots fill with sample photos → result reveal animates
4. Confirm no `/api/style-match` request fires (Network tab)
5. Confirm quota counter doesn't decrement

If any image fails to load, you'll see the gradient fallback — that's a soft failure, not a crash.

## Rotation / refresh

The 3 samples are static. If you want to refresh them quarterly (e.g., seasonal looks), just regenerate and update the URLs in `sample-matches.ts`. No code changes needed.

If you want true rotation (different sample shown each visit), you can extend `getDefaultSample()` to randomize:

```ts
export function getDefaultSample(): SampleMatch {
  return SAMPLE_MATCHES[Math.floor(Math.random() * SAMPLE_MATCHES.length)];
}
```

## What if I skip this setup?

Until real URLs are populated, the proof strip renders gradient placeholders (still functional, still on-brand) and the "Try a sample match" button is disabled with the copy "Samples coming soon." The empty state and real generation flow work normally.

You can ship v2 without samples and add them later — no degradation of the core feature.
