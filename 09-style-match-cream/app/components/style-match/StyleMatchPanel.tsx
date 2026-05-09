'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@clerk/react-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ArrowRight } from 'lucide-react';
import { cn } from '~/lib/utils';
import { UploadSlots } from './UploadSlots';
import { ModeToggle } from './ModeToggle';
import { AspectRatioPicker } from './AspectRatioPicker';
import { ResultPanel } from './ResultPanel';
import { CreditCostBadge } from './CreditCostBadge';
import { runStyleMatch } from '~/utils/style-match-client';
import type {
  StyleMatchAspectRatio,
  StyleMatchMode,
  StyleMatchResult,
  StyleMatchSlot,
  StyleMatchWorkflowState,
} from './types';

export interface StyleMatchPanelProps {
  /** Default mode. Defaults to 'style' (the safer / less surprising one). */
  initialMode?: StyleMatchMode;
  /** Default aspect ratio. Defaults to '1:1'. */
  initialAspectRatio?: StyleMatchAspectRatio;
}

const COST_PER_GEN = 2;

/**
 * Top-level orchestrator for /style-match.
 *
 * Layout mirrors the Generator pack: hero strip on top, two-column grid
 * below with form on the left and result panel on the right. Same chunky
 * neo-brutalist treatment, same numbered-step pattern (1=upload,
 * 2=aspect, 3=mode, 4=result).
 *
 * State is local — there is no convex job document for style match v1.
 * The /api/style-match route is synchronous: client posts both files and
 * config, server deducts credits, calls Gemini 3.1 Flash Image Preview,
 * uploads the result to R2, writes a row to the styleMatchResults
 * Convex table, and returns the result url + id. On error the server
 * refunds the credits and the client surfaces the message.
 */
export function StyleMatchPanel({
  initialMode = 'style',
  initialAspectRatio = '1:1',
}: StyleMatchPanelProps) {
  const { isSignedIn } = useAuth();

  // ───── Form state ─────
  const [userSlot, setUserSlot] = useState<StyleMatchSlot>({
    file: null,
    previewUrl: null,
  });
  const [referenceSlot, setReferenceSlot] = useState<StyleMatchSlot>({
    file: null,
    previewUrl: null,
  });
  const [mode, setMode] = useState<StyleMatchMode>(initialMode);
  const [aspectRatio, setAspectRatio] =
    useState<StyleMatchAspectRatio>(initialAspectRatio);

  // ───── Generation state ─────
  const [workflowState, setWorkflowState] =
    useState<StyleMatchWorkflowState>('idle');
  const [result, setResult] = useState<StyleMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0.05);
  const [etaSeconds, setEtaSeconds] = useState<number | undefined>(20);

  // ───── Convex bindings (read-only, for credit cost framing) ─────
  const accessStatus = useQuery(
    api.subscriptions.checkUserAccessStatus,
    isSignedIn ? undefined : 'skip',
  );
  const quota = useQuery(api.usage.getQuota, isSignedIn ? undefined : 'skip');

  const hasBothPhotos = Boolean(
    (userSlot.file ?? userSlot.remoteUrl) &&
      (referenceSlot.file ?? referenceSlot.remoteUrl),
  );

  // Sync workflow state with form completeness when idle/ready
  useEffect(() => {
    if (workflowState !== 'idle' && workflowState !== 'ready') return;
    setWorkflowState(hasBothPhotos ? 'ready' : 'idle');
  }, [hasBothPhotos, workflowState]);

  // ───── Soft progress simulation while generating ─────
  useEffect(() => {
    if (workflowState !== 'queued' && workflowState !== 'generating') return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(0.95, p + 0.045));
      setEtaSeconds((e) => (typeof e === 'number' ? Math.max(0, e - 1) : e));
    }, 1000);
    return () => clearInterval(id);
  }, [workflowState]);

  // ───── Derived UI props ─────
  const outOfFreeQuota = useMemo(() => {
    if (!isSignedIn) return false;
    if (accessStatus?.hasAccess) return false;
    if (!quota) return false;
    if (
      typeof quota.freeDailyLimit === 'number' &&
      typeof quota.freeDailyUsed === 'number'
    ) {
      return quota.freeDailyUsed >= quota.freeDailyLimit;
    }
    return false;
  }, [isSignedIn, accessStatus, quota]);

  const freeRemainingToday = useMemo(() => {
    if (!quota) return undefined;
    if (typeof quota.freeDailyLimit !== 'number') return undefined;
    return Math.max(
      0,
      (quota.freeDailyLimit ?? 0) - (quota.freeDailyUsed ?? 0),
    );
  }, [quota]);

  const creditsBalance =
    typeof quota?.creditsBalance === 'number' ? quota.creditsBalance : undefined;

  const lockedForGeneration =
    workflowState === 'queued' || workflowState === 'generating';

  const lastInputsRef = useRef<{
    userSlot: StyleMatchSlot;
    referenceSlot: StyleMatchSlot;
    mode: StyleMatchMode;
    aspectRatio: StyleMatchAspectRatio;
  } | null>(null);

  // ───── Generation handler ─────
  const handleGenerate = async () => {
    if (!hasBothPhotos) return;
    setError(null);
    setResult(null);
    setProgress(0.05);
    setEtaSeconds(20);
    setWorkflowState('queued');

    lastInputsRef.current = { userSlot, referenceSlot, mode, aspectRatio };

    try {
      // brief switch to "generating" once the request is in flight
      setTimeout(() => {
        setWorkflowState((s) => (s === 'queued' ? 'generating' : s));
      }, 600);

      const response = await runStyleMatch({
        userSlot,
        referenceSlot,
        mode,
        aspectRatio,
      });

      setResult(response);
      setProgress(1);
      setEtaSeconds(0);
      setWorkflowState('complete');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Style match failed', err);
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Try Generate again.';
      setError(message);
      setWorkflowState('error');
    }
  };

  const handleRegenerate = () => {
    const last = lastInputsRef.current;
    if (last) {
      setUserSlot(last.userSlot);
      setReferenceSlot(last.referenceSlot);
      setMode(last.mode);
      setAspectRatio(last.aspectRatio);
    }
    void handleGenerate();
  };

  const generateLabel = (() => {
    if (!isSignedIn) return 'Sign in to generate';
    if (outOfFreeQuota) return 'Out of free generations · upgrade';
    if (!hasBothPhotos) return 'Drop both photos to continue';
    if (lockedForGeneration) return 'Cooking…';
    return `Generate · ${COST_PER_GEN} credits`;
  })();

  const generateDisabled =
    !hasBothPhotos || lockedForGeneration || outOfFreeQuota;

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10 pb-16">
      <div className="relative">
        <FloatingShapes workflowState={workflowState} />
        <Hero workflowState={workflowState} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-5 mt-9">
        {/* LEFT: Upload + ratio + mode + Generate */}
        <div
          className="bg-card border-[3px] border-foreground overflow-hidden"
          style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
        >
          <UploadSlots
            userSlot={userSlot}
            referenceSlot={referenceSlot}
            onUserChange={setUserSlot}
            onReferenceChange={setReferenceSlot}
            locked={lockedForGeneration}
          />

          {/* Step 2: Output size */}
          <div className="px-0">
            <div className="px-5 sm:px-6 pt-5 pb-1">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted-foreground font-bold">
                <span
                  className={cn(
                    'h-[22px] w-[22px] rounded-full border-2 border-foreground text-white flex items-center justify-center font-display italic font-bold text-xs',
                    lockedForGeneration ? 'bg-foreground' : 'bg-[color:var(--terracotta-500)]',
                  )}
                  aria-hidden="true"
                >
                  2
                </span>
                Output size
              </div>
            </div>
            <AspectRatioPicker
              value={aspectRatio}
              onChange={setAspectRatio}
              locked={lockedForGeneration}
            />
          </div>

          {/* Step 3: Mode */}
          <ModeToggle
            value={mode}
            onChange={setMode}
            locked={lockedForGeneration}
          />

          {/* Generate row */}
          <div className="px-5 sm:px-6 py-5">
            <CreditCostBadge
              cost={COST_PER_GEN}
              hasAccess={accessStatus?.hasAccess ?? false}
              freeRemainingToday={freeRemainingToday}
              creditsBalance={creditsBalance}
              variant="block"
              className="mb-3.5"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generateDisabled}
              className={cn(
                'w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 text-white border-[3px] border-foreground text-base font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1',
                generateDisabled && 'opacity-50 cursor-not-allowed active:translate-x-0 active:translate-y-0',
              )}
              style={{
                background: outOfFreeQuota
                  ? 'var(--butter-500)'
                  : 'var(--terracotta-500)',
                color: outOfFreeQuota ? 'var(--cocoa-900)' : '#fff',
                boxShadow: '6px 6px 0 0 var(--cocoa-900)',
              }}
            >
              <span>{generateLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="mt-2.5 text-center text-[11px] text-muted-foreground leading-snug">
              {outOfFreeQuota ? (
                <>
                  You&rsquo;ve used your free generations for today.{' '}
                  <a
                    href="/pricing"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[color:var(--terracotta-500)] font-bold underline"
                  >
                    See plans
                  </a>
                  .
                </>
              ) : (
                <>Refunded automatically if generation fails. ETA ~20s.</>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Result */}
        <ResultPanel
          workflowState={workflowState}
          result={result}
          mode={mode}
          aspectRatio={aspectRatio}
          freeRemainingToday={freeRemainingToday}
          hasAccess={accessStatus?.hasAccess ?? false}
          etaSeconds={etaSeconds}
          progress={progress}
          onRegenerate={handleRegenerate}
          galleryHref={
            result
              ? `/dashboard/creations?style-match=${result.resultId}`
              : undefined
          }
          error={error}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── HERO STRIP ───────────────────────── */

/**
 * Marketing-tier hero typography — matches the V4 published landing's
 * scale and weight for `/style-match`'s standalone surface. Larger
 * clamp-style sizes, tighter -0.03em tracking, and a `boxed-word` for
 * the italic accent. We keep the funnel-style smaller hero on the
 * cooking/complete states so the work-in-progress UI doesn't compete
 * with the result panel below.
 */
function Hero({ workflowState }: { workflowState: StyleMatchWorkflowState }) {
  if (
    workflowState === 'idle' ||
    workflowState === 'ready' ||
    workflowState === 'error'
  ) {
    return (
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <span
          className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-5 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          ✦ New · style match · 2 credits
        </span>
        <h1
          className="font-display italic font-medium text-foreground mb-4 max-w-[16ch] mx-auto"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.25rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.03em',
          }}
        >
          See any photo in your favorite{' '}
          <BoxedWord rotate={-2}>look</BoxedWord>.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Upload your photo + a style reference. Pick whether you want{' '}
          <strong className="font-display italic font-medium text-foreground">
            just the look
          </strong>{' '}
          or the{' '}
          <strong className="font-display italic font-medium text-foreground">
            full scene
          </strong>
          . Same model that powers your favorite styles, now with a reference of your choice.
        </p>
      </div>
    );
  }

  if (workflowState === 'queued' || workflowState === 'generating') {
    return (
      <div className="relative z-10 text-center">
        <span
          className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          ✦ Cooking your match
        </span>
        <h1
          className="font-display italic font-medium text-foreground"
          style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.03em',
          }}
        >
          Hold tight &mdash;{' '}
          <em
            className="not-italic font-display italic"
            style={{ color: 'var(--terracotta-500)' }}
          >
            almost there.
          </em>
        </h1>
      </div>
    );
  }

  if (workflowState === 'complete') {
    return (
      <div className="relative z-10 text-center max-w-xl mx-auto">
        <span
          className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          ✦ Match · saved to gallery
        </span>
        <h1
          className="font-display italic font-medium text-foreground mb-2"
          style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.03em',
          }}
        >
          Looks like{' '}
          <em
            className="not-italic font-display italic"
            style={{ color: 'var(--terracotta-500)' }}
          >
            the reference
          </em>
          .
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Saved to your gallery. Download HD or swap the reference and try a different look.
        </p>
      </div>
    );
  }

  return null;
}

/* ───────────────────────── BOXED WORD ───────────────────────── */

/**
 * The signature highlight treatment from the V4 marketing landing —
 * an italic word inside a chunky-bordered terracotta pill, rotated and
 * shadowed. Use sparingly (one per headline at most).
 */
function BoxedWord({
  children,
  variant = 'terracotta',
  rotate = -2,
}: {
  children: React.ReactNode;
  variant?: 'terracotta' | 'butter' | 'sage';
  rotate?: number;
}) {
  const palette = {
    terracotta: { bg: 'var(--terracotta-500)', fg: '#FFFFFF' },
    butter: { bg: 'var(--butter-500)', fg: 'var(--cocoa-900)' },
    sage: { bg: 'var(--sage-500)', fg: '#FFFFFF' },
  }[variant];
  return (
    <span
      className="inline-block font-display italic font-medium align-baseline"
      style={{
        background: palette.bg,
        color: palette.fg,
        border: '4px solid var(--cocoa-900)',
        padding: '0.04em 0.18em',
        margin: '0 0.04em',
        transform: `rotate(${rotate}deg)`,
        boxShadow: '6px 6px 0 0 var(--cocoa-900)',
        fontStyle: 'italic',
      }}
    >
      {children}
    </span>
  );
}

/* ───────────────────────── FLOATING SHAPES ───────────────────────── */

/**
 * Decorative geometric shapes that anchor the hero in V4's neo-brutalist
 * marketing-page visual language. Hidden on small viewports and on the
 * cooking/complete states so they don't fight the work UI.
 */
function FloatingShapes({
  workflowState,
}: {
  workflowState: StyleMatchWorkflowState;
}) {
  if (workflowState !== 'idle' && workflowState !== 'ready' && workflowState !== 'error') {
    return null;
  }
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block"
    >
      {/* Terracotta circle, top-right */}
      <span
        className="absolute"
        style={{
          top: '8px',
          right: '6%',
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'var(--terracotta-400)',
          border: '4px solid var(--cocoa-900)',
          boxShadow: '3px 3px 0 0 var(--cocoa-900)',
          opacity: 0.85,
        }}
      />
      {/* Sage square, top-left */}
      <span
        className="absolute"
        style={{
          top: '60px',
          left: '5%',
          width: '60px',
          height: '60px',
          background: 'var(--sage-300)',
          border: '4px solid var(--cocoa-900)',
          boxShadow: '3px 3px 0 0 var(--cocoa-900)',
          transform: 'rotate(14deg)',
          opacity: 0.85,
        }}
      />
      {/* Butter triangle, bottom-right (CSS triangle with drop-shadow) */}
      <span
        className="absolute"
        style={{
          bottom: '4px',
          right: '12%',
          width: 0,
          height: 0,
          borderLeft: '32px solid transparent',
          borderRight: '32px solid transparent',
          borderBottom: '54px solid var(--butter-500)',
          transform: 'rotate(-12deg)',
          filter: 'drop-shadow(3px 3px 0 var(--cocoa-900))',
          opacity: 0.95,
        }}
      />
    </div>
  );
}
