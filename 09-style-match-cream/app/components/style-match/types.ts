/**
 * Shared types for the StyleMatch component tree.
 *
 * StyleMatch is a reference-image style transfer feature. The user provides
 * (1) their photo and (2) a reference image whose aesthetic they want to
 * borrow. A mode toggle controls intent:
 *
 *  - "style"       — preserve the user's pose / composition / wardrobe;
 *                    transfer ONLY color / lighting / mood / technique from
 *                    the reference.
 *  - "style+scene" — place the user's identity (face / hair) into the
 *                    reference's pose, scene, and full visual style.
 *
 * Both modes share the same UI shell, the same upload component, and the
 * same /api/style-match backend route. The mode is sent as a parameter on
 * the request body and changes which prompt template the server picks.
 *
 * Cost: 2 credits per generation (twice a normal Generator run because
 * the model has two reference images and a longer prompt). Credit
 * deduction happens server-side BEFORE the Gemini call; on error the
 * server refunds.
 */

export type StyleMatchMode = 'style' | 'style+scene';

export type StyleMatchAspectRatio = '1:1' | '4:5' | '9:16';

/**
 * UI workflow states. Mirrors the Generator pack's WorkflowState shape so
 * the ResultPanel feels familiar across the product.
 */
export type StyleMatchWorkflowState =
  | 'idle'           // either slot is empty, nothing in flight
  | 'ready'          // both slots filled, awaiting Generate click
  | 'queued'         // mutation submitted, server ack pending
  | 'generating'     // Gemini call in flight
  | 'complete'       // result available
  | 'error';         // last attempt failed

/**
 * The result returned by /api/style-match after a successful generation.
 * The backend uploads to R2 and writes a row to the new
 * `styleMatchResults` Convex table; this is what the route returns.
 */
export interface StyleMatchResult {
  resultId: string;          // styleMatchResults._id
  resultUrl: string;         // R2 public URL
  mode: StyleMatchMode;
  aspectRatio: StyleMatchAspectRatio;
  width?: number;
  height?: number;
  createdAt: number;         // ms since epoch
}

/**
 * The shape of an uploaded image slot inside the UI. Files are kept in
 * memory only — server-side upload to R2 happens inside the API route,
 * NOT in the client. The client sends multipart form data to
 * /api/style-match.
 */
export interface StyleMatchSlot {
  file: File | null;
  previewUrl: string | null;
  /** When the user pasted a URL instead of uploading a file. */
  remoteUrl?: string | null;
}
