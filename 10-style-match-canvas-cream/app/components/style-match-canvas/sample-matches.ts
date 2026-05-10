/**
 * Pre-generated sample matches used by:
 *   1. The proof strip (3 triplets shown below the hero)
 *   2. The "Try a sample match" button (clicks one, pre-fills slots,
 *      sets workflowState='sample-complete')
 *
 * Generation cost for users: ZERO credits. The result URLs point to
 * pre-rendered assets generated once and uploaded to R2.
 *
 * To populate (one-time setup, do this in Cursor):
 *   1. Pick 3 inspo screenshots from Pinterest/IG that span different
 *      aesthetics (cinematic, warm, pastel).
 *   2. Pick 3 user-photo stand-ins (use Polar.sh's sample-photo CDN or
 *      a free portrait set you own).
 *   3. Run /api/style-match three times manually with your account
 *      (bypass auth check or use your own credits). Save the result
 *      URLs.
 *   4. Replace the `__REPLACE_*` placeholders below with the real URLs.
 *
 * Until populated, the gradient fallbacks render in the proof strip
 * and the sample-run button shows a "samples coming soon" toast.
 */

import type { SampleMatch } from './types';

export const SAMPLE_MATCHES: SampleMatch[] = [
  {
    id: 'sample-cinematic-blue',
    name: 'Cinematic blue',
    userPhotoUrl: '__REPLACE_USER_PHOTO_1__',
    refPhotoUrl: '__REPLACE_REF_PHOTO_1__',
    resultUrl: '__REPLACE_RESULT_1__',
    mode: 'style',
    aspectRatio: '4:5',
    fallbackGradients: {
      user: 'linear-gradient(160deg, #F4E8D8 0%, #E5D8C2 100%)',
      ref: 'linear-gradient(160deg, #2A4262 0%, #0D1A2C 100%)',
      result: 'linear-gradient(160deg, #2A4262 0%, #0D1A2C 100%)',
    },
  },
  {
    id: 'sample-golden-hour',
    name: 'Golden hour',
    userPhotoUrl: '__REPLACE_USER_PHOTO_2__',
    refPhotoUrl: '__REPLACE_REF_PHOTO_2__',
    resultUrl: '__REPLACE_RESULT_2__',
    mode: 'style',
    aspectRatio: '1:1',
    fallbackGradients: {
      user: 'linear-gradient(160deg, #C4D4DA 0%, #6E8A98 100%)',
      ref: 'linear-gradient(160deg, #F4A45C 0%, #C2503A 100%)',
      result: 'linear-gradient(160deg, #F4A45C 0%, #C2503A 100%)',
    },
  },
  {
    id: 'sample-soft-pastel',
    name: 'Soft pastel',
    userPhotoUrl: '__REPLACE_USER_PHOTO_3__',
    refPhotoUrl: '__REPLACE_REF_PHOTO_3__',
    resultUrl: '__REPLACE_RESULT_3__',
    mode: 'style+scene',
    aspectRatio: '9:16',
    fallbackGradients: {
      user: 'linear-gradient(160deg, #2C2A28 0%, #0F0E0D 100%)',
      ref: 'linear-gradient(160deg, #B5C9B0 0%, #E59A7E 80%)',
      result: 'linear-gradient(160deg, #B5C9B0 0%, #E59A7E 80%)',
    },
  },
];

/**
 * The default sample to pre-load when the user clicks "Try a sample match".
 * Rotate through randomly or pick by index — for v1, always use the first.
 */
export function getDefaultSample(): SampleMatch {
  return SAMPLE_MATCHES[0];
}

export function hasRealSamples(): boolean {
  return !SAMPLE_MATCHES.some((s) =>
    s.resultUrl.startsWith('__REPLACE_'),
  );
}
