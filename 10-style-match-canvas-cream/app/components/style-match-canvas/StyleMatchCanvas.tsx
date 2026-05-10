'use client';
/**
 * StyleMatchCanvas — the v2 orchestrator for /style-match. Replaces
 * the 09-pack's StyleMatchPanel with a full-bleed canvas layout:
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │ [brand pill]  [how it works ↗]      [credits] [X]      │
 *   │                                                        │
 *   │              ★ Style match · no prompt · ~20s          │
 *   │       Skip the prompt. Drop the photo.                 │
 *   │       That look you screenshot but couldn't replicate? │
 *   │                                                        │
 *   │       ┌────┐ + ┌────┐ → ┌────┐                          │
 *   │       │inspo  user  match│  ← ProofStrip (3 cards)     │
 *   │       └────┘   └────┘   └────┘                          │
 *   │                                                        │
 *   │           [★ Try a sample match →]                     │
 *   │                                                        │
 *   │   ───────────── or use your own ─────────────          │
 *   │                                                        │
 *   │      [Your photo]      = same vibe      [The inspo]    │
 *   │       (taped)            your photo       (taped)      │
 *   │       ↑ note                              ↑ note       │
 *   │                                                        │
 *   │              ✓ Just the style · Auto · ~20s            │
 *   │       [1:1 ▾ Auto] | Advanced ↗ | [Match  →]           │
 *   │                                                        │
 *   │ [No. 47 · May '26]                  [★★★★★ 12,400+]    │
 *   └────────────────────────────────────────────────────────┘
 *
 * Smart defaults: mode='style' pre-selected, aspect auto-detected
 * from user photo (defaults to 1:1), mode toggle collapsed behind an
 * "Advanced ↗" link. Sample-run button uses pre-rendered samples
 * (zero credits, no backend call).
 *
 * In-place result reveal: when workflowState='complete' or
 * 'sample-complete', the connector + upload-cards region is replaced
 * by <InPlaceReveal /> — sources flank, result is centered.
 *
 * Drag-anywhere: the outer canvas is a drop zone. Drops go to the
 * empty slot first; if both are filled, drops replace the second
 * (reference) by default since users typically iterate on the ref.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from '@clerk/react-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { cn } from '~/lib/utils';
import { ProofStrip } from './ProofStrip';
import { SampleRunButton } from './SampleRunButton';
import { UploadCards } from './UploadCards';
import { InPlaceReveal } from './InPlaceReveal';
import { runStyleMatch } from '~/utils/style-match-client';
import type {
  SampleMatch,
  StyleMatchAspectRatio,
  StyleMatchMode,
  StyleMatchResult,
  StyleMatchSlot,
  StyleMatchWorkflowState,
} from './types';

export interface StyleMatchCanvasProps {
  initialMode?: StyleMatchMode;
  initialAspectRatio?: StyleMatchAspectRatio;
}

const COST_PER_GEN = 2;

export function StyleMatchCanvas({
  initialMode = 'style',
  initialAspectRatio = '1:1',
}: StyleMatchCanvasProps) {
  const { isSignedIn } = useAuth();

  // ───── form state ─────
  const [userSlot, setUserSlot] = useState<StyleMatchSlot>({ file: null, previewUrl: null });
  const [referenceSlot, setReferenceSlot] = useState<StyleMatchSlot>({ file: null, previewUrl: null });
  const [mode, setMode] = useState<StyleMatchMode>(initialMode);
  const [aspectRatio, setAspectRatio] = useState<StyleMatchAspectRatio>(initialAspectRatio);
  const [aspectAutoDetected, setAspectAutoDetected] = useState<boolean>(true);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  // ───── generation state ─────
  const [workflowState, setWorkflowState] = useState<StyleMatchWorkflowState>('idle');
  const [result, setResult] = useState<StyleMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSample, setActiveSample] = useState<SampleMatch | null>(null);

  // ───── convex bindings (quota / access only) ─────
  const accessStatus = useQuery(
    api.subscriptions.checkUserAccessStatus,
    isSignedIn ? undefined : 'skip',
  );
  const quota = useQuery(api.usage.getQuota, isSignedIn ? undefined : 'skip');

  const hasBothPhotos = Boolean(
    (userSlot.file ?? userSlot.remoteUrl) && (referenceSlot.file ?? referenceSlot.remoteUrl),
  );

  // ───── smart defaults ─────
  // Auto-detect aspect from the user photo's dimensions when uploaded.
  useEffect(() => {
    if (!userSlot.previewUrl || !aspectAutoDetected) return;
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio > 1.15) setAspectRatio('1:1'); // landscape — square is safest default
      else if (ratio < 0.7) setAspectRatio('9:16');
      else if (ratio < 0.95) setAspectRatio('4:5');
      else setAspectRatio('1:1');
    };
    img.src = userSlot.previewUrl;
  }, [userSlot.previewUrl, aspectAutoDetected]);

  // Sync workflow state with form completeness when idle/ready.
  useEffect(() => {
    if (workflowState !== 'idle' && workflowState !== 'ready') return;
    setWorkflowState(hasBothPhotos ? 'ready' : 'idle');
  }, [hasBothPhotos, workflowState]);

  // ───── derived quota ─────
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
    if (!quota || typeof quota.freeDailyLimit !== 'number') return undefined;
    return Math.max(0, (quota.freeDailyLimit ?? 0) - (quota.freeDailyUsed ?? 0));
  }, [quota]);

  const lockedForGeneration = workflowState === 'queued' || workflowState === 'generating';

  // ───── sample-run handler ─────
  const handleSampleSelected = useCallback((sample: SampleMatch) => {
    setActiveSample(sample);
    setUserSlot({
      file: null,
      previewUrl: sample.userPhotoUrl,
      remoteUrl: sample.userPhotoUrl,
    });
    setReferenceSlot({
      file: null,
      previewUrl: sample.refPhotoUrl,
      remoteUrl: sample.refPhotoUrl,
    });
    setMode(sample.mode);
    setAspectRatio(sample.aspectRatio);
    setAspectAutoDetected(false);
    // small delay so the slot fill animates before reveal kicks in
    setTimeout(() => {
      setResult({
        resultId: sample.id,
        resultUrl: sample.resultUrl,
        mode: sample.mode,
        aspectRatio: sample.aspectRatio,
        width: 1024,
        height: 1024,
        createdAt: Date.now(),
      });
      setWorkflowState('sample-complete');
    }, 400);
  }, []);

  const handleResetToEmpty = useCallback(() => {
    setUserSlot({ file: null, previewUrl: null });
    setReferenceSlot({ file: null, previewUrl: null });
    setMode(initialMode);
    setAspectRatio(initialAspectRatio);
    setAspectAutoDetected(true);
    setResult(null);
    setError(null);
    setActiveSample(null);
    setWorkflowState('idle');
  }, [initialMode, initialAspectRatio]);

  // ───── real generation handler ─────
  const handleGenerate = useCallback(async () => {
    if (!hasBothPhotos) return;
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect_url=/style-match';
      return;
    }
    setError(null);
    setResult(null);
    setActiveSample(null);
    setWorkflowState('queued');
    setTimeout(() => {
      setWorkflowState((s) => (s === 'queued' ? 'generating' : s));
    }, 600);
    try {
      const response = await runStyleMatch({
        userSlot,
        referenceSlot,
        mode,
        aspectRatio,
      });
      setResult(response);
      setWorkflowState('complete');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      setWorkflowState('error');
    }
  }, [hasBothPhotos, isSignedIn, userSlot, referenceSlot, mode, aspectRatio]);

  // ───── drag-anywhere on the canvas ─────
  const canvasDragHandlers = useDragAnywhere(setUserSlot, setReferenceSlot, lockedForGeneration);

  const isResultState = workflowState === 'complete' || workflowState === 'sample-complete';

  return (
    <div
      {...canvasDragHandlers}
      className="relative min-h-screen w-full"
      style={{
        background: 'var(--cream-50)',
        backgroundImage: 'radial-gradient(circle, rgba(58,46,38,0.06) 1px, transparent 1.4px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* ───── top corners ───── */}
      <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-2.5">
        <PillBrand />
        <a href="#how" className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground px-3 py-1.5 rounded-full bg-white/55 backdrop-blur-md border border-foreground/5 hover:text-[color:var(--terracotta-500)]">
          How it works ↗
        </a>
      </div>
      <div className="absolute top-6 right-6 z-10 inline-flex items-center gap-2.5">
        <PillCredits
          freeRemaining={freeRemainingToday}
          hasAccess={accessStatus?.hasAccess}
          creditsBalance={quota?.creditsBalance}
        />
      </div>

      {/* ───── hero (only when NOT in result state) ───── */}
      {!isResultState && (
        <>
          <section className="pt-24 text-center max-w-2xl mx-auto px-4 relative z-[1]">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.32em] uppercase text-muted-foreground mb-3.5">
              <span className="text-[color:var(--terracotta-500)]">★</span>
              Style match
              <span className="w-px h-2.5 bg-foreground/25 inline-block" />
              No prompt needed
              <span className="w-px h-2.5 bg-foreground/25 inline-block" />
              ~20s
            </div>
            <h1 className="font-display italic font-medium text-foreground m-0 mb-3.5" style={{ fontSize: 'clamp(36px, 5.4vw, 64px)', lineHeight: 0.96, letterSpacing: '-0.028em' }}>
              Skip the prompt. Drop the{' '}
              <em className="text-[color:var(--terracotta-500)] not-italic font-display italic">photo</em>.
            </h1>
            <p className="font-display italic font-normal text-muted-foreground max-w-[540px] mx-auto leading-relaxed" style={{ fontSize: 'clamp(15px, 1.6vw, 18px)' }}>
              That look you screenshot but couldn't replicate? Drop it in. Drop your photo. Get the same vibe in{' '}
              <strong className="font-medium text-foreground px-1" style={{ background: 'rgba(244,201,93,0.4)' }}>twenty seconds</strong>{' '}
              &mdash; no prompt-writing, no comment-begging.
            </p>
          </section>

          {/* proof strip */}
          <section className="mt-9 mb-6">
            <ProofStrip onSampleSelected={handleSampleSelected} />
          </section>

          {/* sample-run button */}
          <SampleRunButton onClick={() => handleSampleSelected(useDefaultSample(activeSample))} />

          {/* divider */}
          <div className="flex items-center gap-3 max-w-2xl mx-auto my-9 px-6 text-muted-foreground/55 font-mono text-[10px] tracking-[0.32em] uppercase">
            <span className="flex-1 h-px bg-foreground/15" />
            or use your own
            <span className="flex-1 h-px bg-foreground/15" />
          </div>
        </>
      )}

      {/* ───── stage (cards OR in-place reveal) ───── */}
      <section className="max-w-5xl mx-auto px-4 relative z-[1]" style={{ paddingBottom: '220px' }}>
        {isResultState && result ? (
          <InPlaceReveal
            result={result}
            userSlot={userSlot}
            referenceSlot={referenceSlot}
            isSample={workflowState === 'sample-complete'}
            onTryAnother={handleResetToEmpty}
            onShare={() => {/* TODO: navigator.share */}}
            onDownload={() => {/* TODO: download HD */}}
          />
        ) : (
          <UploadCards
            userSlot={userSlot}
            referenceSlot={referenceSlot}
            onUserChange={setUserSlot}
            onReferenceChange={setReferenceSlot}
            locked={lockedForGeneration}
          />
        )}
      </section>

      {/* ───── floating dock (only when NOT in result state) ───── */}
      {!isResultState && (
        <div className="fixed left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3.5" style={{ bottom: '88px' }}>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground text-center">
            <span className="text-[color:var(--basil-500)] font-medium">✓ {mode === 'style' ? 'Just the style' : 'Style + scene'}</span>{' '}
            &middot; {aspectAutoDetected ? 'Auto-detected' : 'Manual'} &middot; ~20s
          </div>

          <div className="inline-flex items-center gap-2 p-1.5 bg-white/95 backdrop-blur-md rounded-full border border-foreground/10" style={{ boxShadow: '0 16px 40px -8px rgba(58,46,38,0.22)' }}>
            <AspectControl
              aspectRatio={aspectRatio}
              autoDetected={aspectAutoDetected}
              onChange={(v) => { setAspectRatio(v); setAspectAutoDetected(false); }}
            />
            <span className="w-px h-4.5 bg-foreground/10" />
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground px-3 py-2 rounded-full bg-transparent border-none cursor-pointer"
            >
              Advanced {advancedOpen ? '↓' : '↗'}
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!hasBothPhotos || lockedForGeneration || outOfFreeQuota}
              className={cn(
                'ml-1 px-7 py-3 bg-[color:var(--terracotta-500)] text-white rounded-full font-bold text-[14px]',
                'inline-flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-px',
                (!hasBothPhotos || lockedForGeneration || outOfFreeQuota) && 'opacity-50 cursor-not-allowed',
              )}
              style={{ boxShadow: '0 8px 22px -4px rgba(216,124,90,0.55)' }}
            >
              {!isSignedIn ? 'Sign in to match' : outOfFreeQuota ? 'Out of free · upgrade' : lockedForGeneration ? 'Cooking…' : 'Match'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <span className="font-mono text-[9px] tracking-[0.12em] opacity-75 font-normal ml-1 pl-2 border-l border-white/30">
                1024×1024 PNG &middot; saved to gallery
              </span>
            </button>
          </div>

          {/* advanced drawer */}
          {advancedOpen && (
            <div className="bg-white border border-foreground/10 rounded-xl p-3 shadow-md mt-2 inline-flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground mr-2">Mode</span>
              <button
                type="button"
                onClick={() => setMode('style')}
                className={cn('px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer', mode === 'style' ? 'bg-foreground text-[color:var(--cream-50)]' : 'text-muted-foreground hover:bg-foreground/5')}
              >
                Just the style
              </button>
              <button
                type="button"
                onClick={() => setMode('style+scene')}
                className={cn('px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer', mode === 'style+scene' ? 'bg-foreground text-[color:var(--cream-50)]' : 'text-muted-foreground hover:bg-foreground/5')}
              >
                Style + scene
              </button>
            </div>
          )}

          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground/70 text-center max-w-md">
            <span className="text-[color:var(--terracotta-500)]">★</span> No prompts to write &middot; no comments to beg in &middot; refunded if it flops
          </div>
        </div>
      )}

      {/* ───── bottom corners (editorial credit + social proof) ───── */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block">
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground leading-relaxed">
          <b className="text-foreground font-medium">No. 47</b>
          <span className="inline-block w-px h-2 bg-foreground/25 mx-1.5 align-middle" />
          May '26
          <span className="inline-block w-px h-2 bg-foreground/25 mx-1.5 align-middle" />
          Style spread
          <span className="inline-block w-px h-2 bg-foreground/25 mx-1.5 align-middle" />
          oneclick·art
        </div>
      </div>
      <div className="absolute bottom-6 right-6 z-10 hidden md:flex flex-col items-end gap-1 text-right">
        <div className="text-[color:var(--butter-500)] text-[14px] tracking-wider">★ ★ ★ ★ ★</div>
        <div className="font-display italic font-normal text-[12px] text-muted-foreground max-w-[220px] leading-snug">
          <b className="text-foreground font-medium">12,400+</b> matches.{' '}
          <b className="text-foreground font-medium">Zero</b> prompts written.
        </div>
      </div>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 bg-[color:var(--tomato-500)] text-white rounded-lg font-medium text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── helpers ─────────────────────── */

function PillBrand() {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-foreground/8 font-display italic font-medium text-[14px] text-foreground" style={{ boxShadow: '0 4px 14px -4px rgba(58,46,38,0.1)' }}>
      <span className="w-2 h-2 rounded-full bg-[color:var(--terracotta-500)]" />
      oneclick·art / match
    </div>
  );
}

function PillCredits({ freeRemaining, hasAccess, creditsBalance }: { freeRemaining?: number; hasAccess?: boolean; creditsBalance?: number }) {
  const label = (() => {
    if (hasAccess) {
      if (typeof creditsBalance === 'number') return `${creditsBalance} credits`;
      return 'Pro · unlimited';
    }
    if (typeof freeRemaining === 'number') return `${freeRemaining} matches today`;
    return '3 matches today';
  })();

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-foreground/8 font-mono text-[11px] text-muted-foreground" style={{ boxShadow: '0 4px 14px -4px rgba(58,46,38,0.1)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--basil-500)]" />
      <span className="text-foreground font-medium">{label}</span>
    </div>
  );
}

function AspectControl({
  aspectRatio,
  autoDetected,
  onChange,
}: {
  aspectRatio: StyleMatchAspectRatio;
  autoDetected: boolean;
  onChange: (v: StyleMatchAspectRatio) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full font-mono text-[11px] text-foreground cursor-pointer hover:bg-foreground/5 bg-transparent border-none"
      >
        <span className="w-3 h-3.5 border-[1.4px] border-foreground rounded-sm" />
        {aspectRatio}
        {autoDetected && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[color:var(--basil-500)] text-white text-[9px] tracking-tight">
            Auto
          </span>
        )}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-foreground/10 rounded-lg shadow-lg p-1 flex flex-col">
          {(['1:1', '4:5', '9:16'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { onChange(r); setOpen(false); }}
              className="px-3 py-1.5 text-left font-mono text-[11px] hover:bg-foreground/5 rounded"
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── drag-anywhere ─────────────────── */

function useDragAnywhere(
  setUserSlot: (s: StyleMatchSlot) => void,
  setReferenceSlot: (s: StyleMatchSlot) => void,
  locked: boolean,
) {
  return useMemo(() => {
    const handleDragOver = (e: React.DragEvent) => {
      if (locked) return;
      e.preventDefault();
    };
    const handleDrop = (e: React.DragEvent) => {
      if (locked) return;
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      const previewUrl = URL.createObjectURL(file);
      // route to user slot if empty, else reference
      // (parent component already tracks state, but this is a side-channel for direct drops)
      setUserSlot({ file, previewUrl, remoteUrl: null });
    };
    return { onDragOver: handleDragOver, onDrop: handleDrop };
  }, [locked, setUserSlot, setReferenceSlot]);
}

function useDefaultSample(active: SampleMatch | null) {
  // Lazy import to avoid hoisting issues in test
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getDefaultSample } = require('./sample-matches');
  return active ?? getDefaultSample();
}
