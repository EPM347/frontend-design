'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '@clerk/react-router';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { UploadZone } from './UploadZone';
import { StylePicker } from './StylePicker';
import { GenerateOrSignup } from './GenerateOrSignup';
import { ResultPanel } from './ResultPanel';
import {
  consumeStagedGeneration,
  hasStagedGeneration,
} from '~/utils/staged-generation';
import type {
  GeneratorMode,
  GenerationResult,
  ImageSize,
  LikenessLevel,
  StylePreset,
  WorkflowState,
} from './types';

export interface GeneratorProps {
  /** Visual + behavioural mode. Defaults to "marketing" (signup gate visible). */
  mode?: GeneratorMode;
  /** Optional initial style — defaults to "ghibli". */
  initialStyle?: StylePreset;
  /** Optional `imageId` query param when arriving with a saved image. */
  initialImageId?: string;
}

const DEFAULT_STYLE: StylePreset = 'ghibli';

export function Generator({
  mode = 'marketing',
  initialStyle = DEFAULT_STYLE,
  initialImageId,
}: GeneratorProps) {
  const { isSignedIn } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // ───── Local form state ─────
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | undefined>(initialImageId);
  const [style, setStyle] = useState<StylePreset>(initialStyle);
  const [size, setSize] = useState<ImageSize>('auto');
  const [likeness, setLikeness] = useState<LikenessLevel>('exact');
  const [workflowState, setWorkflowState] = useState<WorkflowState>('idle');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0.05);
  const [etaSeconds, setEtaSeconds] = useState<number | undefined>(30);
  const [recentJobId, setRecentJobId] = useState<Id<'jobs'> | null>(null);
  const recentlyUsedStyleIds = useRef<StylePreset[]>([]);

  // ───── Convex bindings ─────
  // The following names match the production code in `app/routes/ai-art-generator.tsx`.
  // If your project's API differs, the only place that needs updating is here.
  const requestUpload = useAction(api.images.requestUpload);
  const uploadToR2 = useAction(api.r2.uploadToR2);
  const saveImage = useAction(api.images.saveImage);

  // The actual generation entrypoint — names guessed; see README "Convex contracts".
  const startGeneration = useAction(api.jobs.startGeneration ?? (api as any).generation?.start);

  const accessStatus = useQuery(
    api.subscriptions.checkUserAccessStatus,
    isSignedIn ? undefined : 'skip',
  );
  const quota = useQuery(api.usage.getQuota, isSignedIn ? undefined : 'skip');

  const job = useQuery(
    api.jobs.getById,
    recentJobId ? { id: recentJobId } : 'skip',
  );

  // ───── Resume from staged generation after OAuth ─────
  const restoredOnce = useRef(false);
  useEffect(() => {
    if (restoredOnce.current) return;
    if (!isSignedIn) return;
    if (searchParams.get('staged') !== '1' && !hasStagedGeneration()) return;

    const staged = consumeStagedGeneration();
    if (!staged) return;
    restoredOnce.current = true;

    setFile(staged.file);
    setPreviewUrl(URL.createObjectURL(staged.file));
    setStyle(staged.style);
    setSize(staged.size);
    setLikeness(staged.likeness);
    setImageId(staged.imageId);

    // Clear the ?staged=1 marker
    if (searchParams.get('staged') === '1') {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('staged');
          return next;
        },
        { replace: true },
      );
    }

    // Defer to the next tick so React commits state first
    setTimeout(() => {
      void runGeneration({
        file: staged.file,
        imageId: staged.imageId,
        style: staged.style,
        size: staged.size,
        likeness: staged.likeness,
      });
    }, 50);
  }, [isSignedIn, searchParams, setSearchParams]);

  // ───── Watch the convex job document for completion ─────
  useEffect(() => {
    if (!job) return;
    if (workflowState !== 'queued' && workflowState !== 'generating') return;

    if (job.status === 'completed' || job.status === 'ready') {
      setResult({
        jobId: String(job._id),
        resultUrl: job.signedResultUrl ?? job.resultUrl ?? '',
        width: job.width,
        height: job.height,
      });
      setProgress(1);
      setEtaSeconds(0);
      setWorkflowState('ready');
      // Track recent style for the picker (visual ✓ on the tile next time)
      recentlyUsedStyleIds.current = Array.from(
        new Set([style, ...recentlyUsedStyleIds.current]),
      ).slice(0, 5);
    } else if (job.status === 'failed') {
      setWorkflowState('error');
      setError(job.errorMessage ?? 'Generation failed.');
    } else if (job.status === 'processing' || job.status === 'pending') {
      setWorkflowState('generating');
    }
  }, [job, style, workflowState]);

  // ───── Soft progress bar simulation while we're queued/generating ─────
  useEffect(() => {
    if (workflowState !== 'queued' && workflowState !== 'generating') return;
    const tick = setInterval(() => {
      setProgress((p) => Math.min(0.95, p + 0.04));
      setEtaSeconds((e) => (typeof e === 'number' ? Math.max(0, e - 1) : e));
    }, 1000);
    return () => clearInterval(tick);
  }, [workflowState]);

  // ───── Handlers ─────
  const handleFileChange = (next: File, url: string) => {
    setFile(next);
    setPreviewUrl(url);
    setImageId(undefined); // a freshly chosen file invalidates any prior imageId
    setResult(null);
    setError(null);
    setWorkflowState('idle');
  };

  const handleSampleSelect = async (sample: { id: string; label: string; imageUrl: string }) => {
    try {
      const response = await fetch(sample.imageUrl);
      const blob = await response.blob();
      const sampleFile = new File([blob], `sample-${sample.id}.jpg`, {
        type: blob.type || 'image/jpeg',
      });
      const objectUrl = URL.createObjectURL(sampleFile);
      handleFileChange(sampleFile, objectUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Sample load failed', err);
      setError("Couldn't load that sample — pick a different one or upload your own.");
    }
  };

  const handleReplace = () => {
    setFile(null);
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setResult(null);
    setImageId(undefined);
    setWorkflowState('idle');
  };

  /**
   * Uploads the file (if needed) and starts the generation. Used by both
   * the post-OAuth resumption path and the regular signed-in click path.
   */
  const runGeneration = async (input: {
    file: File;
    imageId?: string;
    style: StylePreset;
    size: ImageSize;
    likeness: LikenessLevel;
  }) => {
    setError(null);
    setWorkflowState('queued');
    setProgress(0.05);
    setEtaSeconds(30);
    setResult(null);

    try {
      // Upload to R2 if we don't already have an imageId
      let resolvedImageId = input.imageId;
      if (!resolvedImageId) {
        const arrayBuffer = await input.file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const { key } = await requestUpload({
          filename: input.file.name,
          contentType: input.file.type,
        });
        const uploadResult = await uploadToR2({
          key,
          contentType: input.file.type,
          buffer: Array.from(buffer),
        });
        const saved = await saveImage({
          filename: input.file.name,
          fileSize: input.file.size,
          contentType: input.file.type,
          r2Key: key,
          publicUrl: uploadResult.publicUrl,
        });
        resolvedImageId = (saved as { _id?: string })._id ?? (saved as unknown as string);
      }

      // Kick off the generation — convex returns the new job id
      const startResult = await startGeneration({
        imageId: resolvedImageId,
        style: input.style,
        size: input.size,
        likeness: input.likeness,
      });
      const jobId =
        typeof startResult === 'string'
          ? startResult
          : (startResult as { jobId?: string; _id?: string }).jobId ??
            (startResult as { _id?: string })._id;
      if (!jobId) throw new Error('Generation did not return a job id');
      setRecentJobId(jobId as Id<'jobs'>);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Generation failed', err);
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Try Generate again.';
      setError(message);
      setWorkflowState('error');
    }
  };

  const handleGenerate = () => {
    if (!file) return;
    void runGeneration({ file, imageId, style, size, likeness });
  };

  const handleSignupRequired = () => {
    setWorkflowState('signupRequired');
  };
  const handleSignupCancel = () => {
    setWorkflowState('idle');
  };

  // ───── Derived UI props ─────
  const outOfFreeQuota = useMemo(() => {
    if (!isSignedIn) return false;
    if (accessStatus?.hasAccess) return false;
    if (!quota) return false;
    if (typeof quota.freeDailyLimit === 'number' && typeof quota.freeDailyUsed === 'number') {
      return quota.freeDailyUsed >= quota.freeDailyLimit;
    }
    return false;
  }, [isSignedIn, accessStatus, quota]);

  const freeRemainingToday = useMemo(() => {
    if (!quota) return undefined;
    if (typeof quota.freeDailyLimit !== 'number') return undefined;
    return Math.max(0, (quota.freeDailyLimit ?? 0) - (quota.freeDailyUsed ?? 0));
  }, [quota]);

  // The "post-result" copy variant kicks in on signed-in users after first ready
  const postResult = workflowState === 'ready';
  const stylePickerLocked =
    workflowState === 'queued' || workflowState === 'generating';

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10 pb-16">
      <Hero workflowState={workflowState} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-5 mt-9">
        {/* LEFT: Upload + style + Generate (or signup) */}
        <div className="bg-card border-[3px] border-foreground overflow-hidden" style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}>
          <UploadZone
            file={file}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            onSampleSelect={handleSampleSelect}
            onReplace={handleReplace}
          />
          <StylePicker
            selectedStyle={style}
            onStyleChange={setStyle}
            size={size}
            onSizeChange={setSize}
            likeness={likeness}
            onLikenessChange={setLikeness}
            locked={stylePickerLocked}
            postResult={postResult}
            recentlyUsedStyleIds={recentlyUsedStyleIds.current}
          />
          <GenerateOrSignup
            workflowState={workflowState}
            isSignedIn={isSignedIn ?? false}
            outOfFreeQuota={outOfFreeQuota}
            etaSeconds={etaSeconds}
            file={file}
            style={style}
            size={size}
            likeness={likeness}
            imageId={imageId}
            onGenerate={handleGenerate}
            onSignupRequired={handleSignupRequired}
            onSignupCancel={handleSignupCancel}
          />
        </div>

        {/* RIGHT: Result panel — always present */}
        <ResultPanel
          workflowState={workflowState}
          result={result}
          style={style}
          freeRemainingToday={freeRemainingToday}
          hasAccess={accessStatus?.hasAccess ?? false}
          etaSeconds={etaSeconds}
          progress={progress}
          galleryHref={
            recentJobId
              ? `/dashboard/creations?selected=${recentJobId}`
              : undefined
          }
        />
      </div>

      {error && workflowState === 'error' && (
        <div
          className="mt-4 max-w-3xl mx-auto px-4 py-3 bg-card border-2 border-[color:var(--tomato-500)] text-sm text-[color:var(--tomato-500)]"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          role="alert"
        >
          <strong className="font-display italic font-medium">Generation failed.</strong> {error}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── HERO STRIP ───────────────────────── */

function Hero({ workflowState }: { workflowState: WorkflowState }) {
  if (workflowState === 'idle' || workflowState === 'signupRequired') {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <span
          className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3.5 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          ✦ Free account · 5 a day · no card
        </span>
        <h1 className="font-display italic font-medium text-4xl sm:text-5xl md:text-6xl leading-[0.96] tracking-[-0.025em] text-foreground mb-3 max-w-[14ch] mx-auto">
          Drop a photo. Pick a style.{' '}
          <em className="not-italic font-display italic" style={{ color: 'var(--terracotta-500)' }}>
            Sign up. See magic.
          </em>
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Ten styles, real models, no nonsense. Free account gives you 5 generations a day forever
          — upgrade if you want more.
        </p>
      </div>
    );
  }

  if (workflowState === 'queued' || workflowState === 'generating') {
    return (
      <div className="text-center">
        <span
          className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          ✦ Cooking your piece
        </span>
        <h1 className="font-display italic font-medium text-3xl sm:text-4xl leading-[0.96] tracking-[-0.025em] text-foreground">
          Hold tight —{' '}
          <em className="not-italic font-display italic" style={{ color: 'var(--terracotta-500)' }}>
            almost there.
          </em>
        </h1>
      </div>
    );
  }

  if (workflowState === 'ready') {
    return (
      <div className="text-center max-w-xl mx-auto">
        <span
          className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          ✦ Done · saved to gallery
        </span>
        <h1 className="font-display italic font-medium text-3xl sm:text-4xl leading-[0.96] tracking-[-0.025em] text-foreground mb-2">
          Looks{' '}
          <em className="not-italic font-display italic" style={{ color: 'var(--terracotta-500)' }}>
            good
          </em>{' '}
          on you.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Saved to your gallery. Download full HD or try another style on the same photo.
        </p>
      </div>
    );
  }

  return null;
}
