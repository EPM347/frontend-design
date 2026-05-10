/**
 * Client-side wrapper for /api/style-match — UNCHANGED from the
 * 09-pack version. The v2 canvas layout uses the same backend
 * contract; only the UI presentation changed.
 *
 * Server contract (must match):
 *
 *   POST /api/style-match
 *   Content-Type: multipart/form-data
 *
 *   Fields:
 *     - userPhoto         : File   (binary, required if no userPhotoUrl)
 *     - referencePhoto    : File   (binary, required if no referencePhotoUrl)
 *     - userPhotoUrl      : string (URL, alternative to userPhoto)
 *     - referencePhotoUrl : string (URL, alternative to referencePhoto)
 *     - mode              : "style" | "style+scene"
 *     - aspectRatio       : "1:1" | "4:5" | "9:16"
 *
 *   Server work order:
 *     1. Auth check (Clerk session)
 *     2. Quota / credits check (free tier 3/day, paid uses 2 credits)
 *     3. Deduct 2 credits BEFORE the Gemini call
 *     4. Call Gemini 3.1 Flash Image Preview with the prompt
 *     5. Upload result to R2 (key: style-match/{userId}/{nanoid}.png)
 *     6. Insert row into Convex `styleMatchResults` table
 *     7. Return JSON: { resultId, resultUrl, mode, aspectRatio,
 *                       width, height, createdAt }
 *
 *   On error: refund credits, return { error: string } with 4xx/5xx.
 *
 * Sample-run mode is NOT a server call — pre-rendered samples are
 * defined in `~/components/style-match-canvas/sample-matches.ts`.
 */

import type {
  StyleMatchAspectRatio,
  StyleMatchMode,
  StyleMatchResult,
  StyleMatchSlot,
} from '~/components/style-match-canvas/types';

export interface RunStyleMatchInput {
  userSlot: StyleMatchSlot;
  referenceSlot: StyleMatchSlot;
  mode: StyleMatchMode;
  aspectRatio: StyleMatchAspectRatio;
}

export interface StyleMatchApiResponse {
  resultId: string;
  resultUrl: string;
  mode: StyleMatchMode;
  aspectRatio: StyleMatchAspectRatio;
  width?: number;
  height?: number;
  createdAt: number;
  error?: string;
}

export class StyleMatchError extends Error {
  status?: number;
  refunded: boolean;

  constructor(message: string, options?: { status?: number; refunded?: boolean }) {
    super(message);
    this.name = 'StyleMatchError';
    this.status = options?.status;
    this.refunded = options?.refunded ?? true;
  }
}

function buildFormData(input: RunStyleMatchInput): FormData {
  const form = new FormData();
  form.set('mode', input.mode);
  form.set('aspectRatio', input.aspectRatio);

  if (input.userSlot.file) {
    form.set('userPhoto', input.userSlot.file, input.userSlot.file.name);
  } else if (input.userSlot.remoteUrl) {
    form.set('userPhotoUrl', input.userSlot.remoteUrl);
  } else {
    throw new StyleMatchError('Your photo is required.', { refunded: false });
  }

  if (input.referenceSlot.file) {
    form.set('referencePhoto', input.referenceSlot.file, input.referenceSlot.file.name);
  } else if (input.referenceSlot.remoteUrl) {
    form.set('referencePhotoUrl', input.referenceSlot.remoteUrl);
  } else {
    throw new StyleMatchError('Reference photo is required.', { refunded: false });
  }

  return form;
}

export async function runStyleMatch(input: RunStyleMatchInput): Promise<StyleMatchResult> {
  const form = buildFormData(input);

  let response: Response;
  try {
    response = await fetch('/api/style-match', {
      method: 'POST',
      body: form,
    });
  } catch (err) {
    throw new StyleMatchError('Network error. Check your connection and try again.', { refunded: false });
  }

  let data: StyleMatchApiResponse | { error?: string } = {};
  try {
    data = (await response.json()) as StyleMatchApiResponse;
  } catch {
    // non-JSON response
  }

  if (!response.ok) {
    throw new StyleMatchError(
      ('error' in data && data.error) ||
        `Generation failed (${response.status}). Credits were refunded.`,
      { status: response.status, refunded: true },
    );
  }

  const ok = data as StyleMatchApiResponse;
  if (!ok.resultUrl || !ok.resultId) {
    throw new StyleMatchError('Server returned an empty result.', { refunded: true });
  }

  return {
    resultId: ok.resultId,
    resultUrl: ok.resultUrl,
    mode: ok.mode,
    aspectRatio: ok.aspectRatio,
    width: ok.width,
    height: ok.height,
    createdAt: ok.createdAt,
  };
}
