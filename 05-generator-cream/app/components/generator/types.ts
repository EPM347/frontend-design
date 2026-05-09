/**
 * Shared types for the Generator component tree.
 *
 * These mirror the existing types in `~/types` (ImageSize, LikenessLevel,
 * StylePreset). Re-exported here so consumers don't have to know which
 * level of the source tree the originals live in. If your project has
 * canonical types, replace these with re-exports from `~/types`.
 */

export type ImageSize = 'auto' | 'square' | 'portrait' | 'landscape';

export type LikenessLevel = 'loose' | 'balanced' | 'exact';

export type StylePreset =
  | 'ghibli'
  | 'watercolor'
  | 'sketch'
  | 'cartoon3d'
  | 'oneline'
  | 'oil'
  | 'popart'
  | 'pet'
  | 'silhouette'
  | 'mixed';

/**
 * Mode controls visual + behavioural variations of <Generator />:
 * - "marketing": cream marketing chrome, signup gate visible to guests
 * - "app": dashboard chrome (parent sets it), signup gate never appears,
 *   user is assumed signed in
 */
export type GeneratorMode = 'marketing' | 'app';

export type WorkflowState =
  | 'idle' // photo + style being chosen, nothing in flight
  | 'signupRequired' // guest hit Generate; signup panel is showing
  | 'queued' // signed in; mutation submitted; waiting on server ack
  | 'generating' // server is producing the result; ETA visible
  | 'ready' // result url available
  | 'error'; // last attempt failed

export interface GenerationResult {
  jobId: string;
  resultUrl: string;
  width?: number;
  height?: number;
  upscaleLevel?: 2 | 4 | 8;
  hasNoBackground?: boolean;
}
