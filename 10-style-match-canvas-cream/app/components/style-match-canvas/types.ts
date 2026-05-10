/**
 * Shared types for the v2 StyleMatch Canvas component tree.
 *
 * This pack is a redesign of 09-style-match-cream that replaces the
 * 4-step numbered wizard with a full-bleed canvas layout (taped photo
 * cards, floating dock, in-place result reveal). The product
 * spec is unchanged: two photos in, one style-matched output back.
 *
 *  - "style"       — preserve the user's pose / composition / wardrobe;
 *                    transfer ONLY color / lighting / mood / technique
 *                    from the reference.
 *  - "style+scene" — place the user's identity (face / hair) into the
 *                    reference's pose, scene, and full visual style.
 *
 * Cost: 2 credits per generation. Sample-run mode (zero credits) is
 * handled entirely client-side using pre-generated triplets defined
 * in sample-matches.ts.
 */

export type StyleMatchMode = 'style' | 'style+scene';

export type StyleMatchAspectRatio = '1:1' | '4:5' | '9:16';

export type StyleMatchWorkflowState =
  | 'idle'           // either slot is empty
  | 'ready'          // both slots filled, awaiting Match click
  | 'queued'         // mutation submitted, server ack pending
  | 'generating'     // Gemini call in flight
  | 'complete'       // result available
  | 'sample-complete'// sample-mode result (pre-computed, zero credits)
  | 'error';

export interface StyleMatchResult {
  resultId: string;
  resultUrl: string;
  mode: StyleMatchMode;
  aspectRatio: StyleMatchAspectRatio;
  width?: number;
  height?: number;
  createdAt: number;
}

export interface StyleMatchSlot {
  file: File | null;
  previewUrl: string | null;
  remoteUrl?: string | null;
}

/**
 * A pre-generated sample triplet shown in the proof strip and loaded
 * by the "Try a sample" button. resultUrl, userPhotoUrl, and
 * refPhotoUrl all point to R2-hosted assets — see SAMPLE_MATCHES.md
 * for how to populate.
 */
export interface SampleMatch {
  id: string;
  name: string;                          // "Cinematic blue", "Golden hour", etc.
  userPhotoUrl: string;                  // R2 URL or local /samples/ path
  refPhotoUrl: string;
  resultUrl: string;
  mode: StyleMatchMode;
  aspectRatio: StyleMatchAspectRatio;
  // For the proof-strip gradient stand-ins until real images are in R2.
  // If `fallbackGradients` is set AND the real URLs 404, the proof strip
  // renders the gradient placeholder instead.
  fallbackGradients?: {
    user: string;
    ref: string;
    result: string;
  };
}
