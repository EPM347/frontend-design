/**
 * Shape we use throughout the creations UI. Maps from the convex job document
 * — most fields are optional because partially-completed jobs may not have
 * a result image yet, etc.
 *
 * If your convex schema names fields differently, this is the one place to
 * adjust the field mapping (or write a small adapter in `creations.tsx`).
 */
export interface CreationJob {
  _id: string;
  _creationTime: number;
  status: 'pending' | 'processing' | 'completed' | 'ready' | 'failed';
  style: string;
  styleLabel?: string;
  resultImageUrl?: string;
  originalImageUrl?: string;
  upscaleLevel?: 2 | 4 | 8;
  hasNoBackground?: boolean;
  sizePreset?: string;
  width?: number;
  height?: number;
  /** ETA in seconds for in-flight jobs */
  etaSeconds?: number;
  /** Server-provided error message for failed jobs */
  errorMessage?: string;
  /** True if the user has marked this as a favorite/pinned creation */
  pinned?: boolean;
}
