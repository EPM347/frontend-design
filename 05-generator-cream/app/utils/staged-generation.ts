/**
 * Persists generator state across the OAuth round-trip so the user's
 * uploaded photo + chosen style are restored after Clerk redirects them
 * back. Uses `sessionStorage` so it doesn't leak across tabs or persist
 * past the browser session.
 *
 * The flow:
 *   1. Guest hits Generate → SignupPanel calls `stageGeneration()` with
 *      the file, style, and chosen options before triggering OAuth.
 *   2. Clerk redirects to Google/Apple, then back to the same route with
 *      `?staged=1` in the URL.
 *   3. Generator detects `staged=1` + a signed-in user, calls
 *      `consumeStagedGeneration()` to read + clear the stash, then
 *      auto-fires the generate mutation.
 *
 * Files can't be serialised to sessionStorage directly. We store the
 * file as a base64 data URL plus the original metadata; the consumer
 * reconstructs a `File` from it.
 */

import type { ImageSize, LikenessLevel, StylePreset } from '~/components/generator/types';

const STORAGE_KEY = 'oneclickart:stagedGeneration:v1';

interface StagedGenerationPayload {
  // The file as a data URL — works for any image type Clerk lets us round-trip
  fileDataUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  /** If the user already uploaded the photo (we have an imageId), pass that instead and the consumer can skip re-uploading. */
  imageId?: string;
  style: StylePreset;
  size: ImageSize;
  likeness: LikenessLevel;
  /** ISO timestamp — used to expire stale stashes (>30 minutes) */
  stagedAt: string;
}

const MAX_STAGE_AGE_MS = 30 * 60 * 1000; // 30 minutes

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(dataUrl: string, name: string, type: string): File {
  const [, base64] = dataUrl.split(',');
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type });
}

export interface StageInput {
  file: File;
  imageId?: string;
  style: StylePreset;
  size: ImageSize;
  likeness: LikenessLevel;
}

/** Save the staged generation to sessionStorage. */
export async function stageGeneration(input: StageInput): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const fileDataUrl = await fileToDataUrl(input.file);
    const payload: StagedGenerationPayload = {
      fileDataUrl,
      fileName: input.file.name,
      fileType: input.file.type,
      fileSize: input.file.size,
      imageId: input.imageId,
      style: input.style,
      size: input.size,
      likeness: input.likeness,
      stagedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[staged-generation] failed to stage', err);
  }
}

export interface StagedGeneration {
  file: File;
  imageId?: string;
  style: StylePreset;
  size: ImageSize;
  likeness: LikenessLevel;
}

/**
 * Read + clear the staged generation. Returns null if nothing is staged
 * or the stash is older than 30 minutes.
 */
export function consumeStagedGeneration(): StagedGeneration | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const payload = JSON.parse(raw) as StagedGenerationPayload;
    sessionStorage.removeItem(STORAGE_KEY);

    // Expire stale stashes
    const stagedAtMs = Date.parse(payload.stagedAt);
    if (Number.isFinite(stagedAtMs) && Date.now() - stagedAtMs > MAX_STAGE_AGE_MS) {
      return null;
    }

    const file = dataUrlToFile(payload.fileDataUrl, payload.fileName, payload.fileType);
    return {
      file,
      imageId: payload.imageId,
      style: payload.style,
      size: payload.size,
      likeness: payload.likeness,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[staged-generation] failed to consume', err);
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/** Throw away a staged generation without consuming it (e.g. user clicks "back"). */
export function clearStagedGeneration(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

/** Cheap probe — returns true if there's something staged. */
export function hasStagedGeneration(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(STORAGE_KEY) !== null;
}
