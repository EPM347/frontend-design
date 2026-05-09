import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, Download, RefreshCw, Share2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import type {
  StyleMatchAspectRatio,
  StyleMatchMode,
  StyleMatchResult,
  StyleMatchWorkflowState,
} from './types';

export interface ResultPanelProps {
  workflowState: StyleMatchWorkflowState;
  result: StyleMatchResult | null;
  mode: StyleMatchMode;
  aspectRatio: StyleMatchAspectRatio;
  /** Optional remaining quota for the "X left today" pill on the result */
  freeRemainingToday?: number;
  /** Whether the user has subscribed/has paid features */
  hasAccess?: boolean;
  /** Optional ETA in seconds, drives the progress label */
  etaSeconds?: number;
  /** 0..1 progress estimate */
  progress?: number;
  /** Re-run the same inputs (regenerate). Disabled until ready/error. */
  onRegenerate?: () => void;
  /** Optional gallery link shown on the ready state's footer. */
  galleryHref?: string;
  /** Optional error message. */
  error?: string | null;
}

const ROTATING_COPY: Array<{ headline: string; sub: string }> = [
  {
    headline: 'Reading the reference…',
    sub: 'Pulling out palette, lighting, and rendering — ignoring text and UI.',
  },
  {
    headline: 'Composing your shot…',
    sub: 'Locking in your face and skin so the look is the only thing that changes.',
  },
  {
    headline: 'Final brushwork…',
    sub: 'Worth the extra few seconds.',
  },
];

const ASPECT_TO_RATIO: Record<StyleMatchAspectRatio, string> = {
  '1:1': '1 / 1',
  '4:5': '4 / 5',
  '9:16': '9 / 16',
};

const MODE_LABEL: Record<StyleMatchMode, string> = {
  style: 'Just the style',
  'style+scene': 'Style + scene',
};

/**
 * Result panel mirroring the Generator pack's ResultPanel shell — same
 * header pill, same border/shadow treatment, same empty/generating/ready
 * state machine. Differences: regenerate icon swaps in for upscale (no
 * upscale on style match v1), and the credit-cost reminder shows in the
 * empty state instead of free-quota copy.
 */
export function ResultPanel({
  workflowState,
  result,
  mode,
  aspectRatio,
  freeRemainingToday,
  hasAccess,
  etaSeconds,
  progress = 0.5,
  onRegenerate,
  galleryHref,
  error,
}: ResultPanelProps) {
  const [copyIdx, setCopyIdx] = useState(0);
  useEffect(() => {
    if (workflowState !== 'generating' && workflowState !== 'queued') return;
    const id = setInterval(() => {
      setCopyIdx((i) => (i + 1) % ROTATING_COPY.length);
    }, 6000);
    return () => clearInterval(id);
  }, [workflowState]);

  const stateLabel = (() => {
    switch (workflowState) {
      case 'idle':
        return 'Waiting…';
      case 'ready':
        return 'Ready to cook';
      case 'queued':
        return 'Queued ↗';
      case 'generating':
        return 'Cooking…';
      case 'complete':
        return 'Done ✓ · saved to gallery';
      case 'error':
        return 'Failed';
      default:
        return '';
    }
  })();

  return (
    <div
      className="bg-card border-[3px] border-foreground min-h-[680px] flex flex-col overflow-hidden"
      style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[color:var(--cream-100)] border-b-2 border-foreground">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted-foreground font-bold">
          <span
            aria-hidden="true"
            className="h-[22px] w-[22px] rounded-full bg-foreground text-[color:var(--cream-50)] border-2 border-foreground flex items-center justify-center font-display italic font-bold text-xs"
          >
            4
          </span>
          Your match
        </div>
        <div
          className={cn(
            'font-display italic font-medium text-sm',
            workflowState === 'generating' || workflowState === 'queued'
              ? 'text-[color:var(--terracotta-500)]'
              : workflowState === 'complete'
                ? 'text-[color:var(--sage-500)]'
                : workflowState === 'error'
                  ? 'text-[color:var(--tomato-500)]'
                  : 'text-foreground',
          )}
        >
          {stateLabel}
        </div>
      </div>

      {(workflowState === 'idle' || workflowState === 'ready') && (
        <ResultEmpty
          workflowState={workflowState}
          mode={mode}
          aspectRatio={aspectRatio}
        />
      )}

      {(workflowState === 'queued' || workflowState === 'generating') && (
        <ResultGenerating
          headline={ROTATING_COPY[copyIdx].headline}
          sub={ROTATING_COPY[copyIdx].sub}
          etaSeconds={etaSeconds}
          progress={progress}
          aspectRatio={aspectRatio}
        />
      )}

      {workflowState === 'complete' && result && (
        <ResultReady
          result={result}
          modeLabel={MODE_LABEL[mode]}
          freeRemainingToday={freeRemainingToday}
          hasAccess={hasAccess}
          galleryHref={galleryHref}
          onRegenerate={onRegenerate}
        />
      )}

      {workflowState === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
          <div className="font-display italic font-medium text-foreground text-2xl mb-2">
            Something went sideways.
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {error ?? "The server didn't send back a result. Your credits were refunded — try Generate again."}
          </p>
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
              style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── empty state ───────────────────────── */

function ResultEmpty({
  workflowState,
  mode,
  aspectRatio,
}: {
  workflowState: StyleMatchWorkflowState;
  mode: StyleMatchMode;
  aspectRatio: StyleMatchAspectRatio;
}) {
  const isReady = workflowState === 'ready';
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16 relative bg-gradient-to-b from-[color:var(--cream-50)] to-card">
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 h-52 w-52 rounded-full pointer-events-none opacity-[0.12]"
        style={{
          background:
            'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full pointer-events-none opacity-[0.10]"
        style={{
          background:
            'radial-gradient(circle, var(--basil-500) 0%, var(--sage-500) 70%, transparent 100%)',
        }}
      />

      <div
        className="relative w-14 h-14 bg-[color:var(--butter-500)] border-[3px] border-foreground flex items-center justify-center mb-5"
        style={{
          boxShadow: '4px 4px 0 0 var(--cocoa-900)',
          transform: 'rotate(-4deg)',
        }}
      >
        <Sparkles className="h-6 w-6 text-foreground" />
      </div>

      <h3 className="relative font-display italic font-medium text-2xl leading-none text-foreground mb-2">
        {isReady ? 'Ready when you are.' : 'Two photos in, one match out.'}
      </h3>
      <p className="relative text-sm text-muted-foreground max-w-xs leading-relaxed">
        {isReady ? (
          <>
            Mode:{' '}
            <strong className="font-display italic font-medium text-foreground">
              {MODE_LABEL[mode]}
            </strong>
            {' · '}
            Output:{' '}
            <strong className="font-display italic font-medium text-foreground">
              {aspectRatio}
            </strong>
            . Hit Generate on the left.
          </>
        ) : (
          <>
            Drop your photo + a style reference on the left, pick an intent, hit{' '}
            <strong className="font-display italic font-medium text-foreground">Generate</strong>.
            Costs 2 credits. Refunded if it fails.
          </>
        )}
      </p>
    </div>
  );
}

/* ───────────────────────── generating state ───────────────────────── */

function ResultGenerating({
  headline,
  sub,
  etaSeconds,
  progress,
  aspectRatio,
}: {
  headline: string;
  sub: string;
  etaSeconds?: number;
  progress: number;
  aspectRatio: StyleMatchAspectRatio;
}) {
  const percent = Math.max(2, Math.min(98, Math.round(progress * 100)));
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 bg-[color:var(--cream-50)]">
      <div
        className="w-full max-w-[460px] bg-[color:var(--cream-200)] border-[3px] border-foreground flex items-center justify-center relative overflow-hidden mb-5"
        style={{
          boxShadow: '6px 6px 0 0 var(--cocoa-900)',
          aspectRatio: ASPECT_TO_RATIO[aspectRatio],
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(135deg, rgba(216,124,90,0.08), rgba(216,124,90,0.08) 12px, rgba(244,201,93,0.08) 12px, rgba(244,201,93,0.08) 24px, rgba(136,165,132,0.08) 24px, rgba(136,165,132,0.08) 36px)',
            animation: 'sm-shimmer 4s linear infinite',
          }}
        />
        <div
          className="relative w-20 h-20 bg-card border-[3px] border-foreground flex items-center justify-center font-display italic font-semibold text-2xl text-[color:var(--terracotta-500)]"
          style={{
            boxShadow: '5px 5px 0 0 var(--cocoa-900)',
            animation: 'sm-pulse 1.6s ease-in-out infinite',
          }}
        >
          ✦
        </div>
      </div>

      <div className="text-center mb-3">
        <div className="font-display italic font-medium text-2xl text-foreground mb-1">
          {headline}
        </div>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{sub}</p>
      </div>

      <div
        className="w-full max-w-[460px] h-1.5 bg-[color:var(--cream-200)] border-2 border-foreground overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[color:var(--terracotta-500)] transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="w-full max-w-[460px] flex justify-between mt-2 font-mono text-[11px] text-muted-foreground">
        <span>{etaSeconds && etaSeconds > 0 ? `~${etaSeconds}S LEFT` : 'COOKING…'}</span>
        <span>{percent}%</span>
      </div>

      <style>{`
        @keyframes sm-shimmer {
          0% { transform: translateX(0); }
          100% { transform: translateX(36px); }
        }
        @keyframes sm-pulse {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          50% { transform: rotate(3deg) scale(1.04); }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────── ready state ───────────────────────── */

function ResultReady({
  result,
  modeLabel,
  freeRemainingToday,
  hasAccess,
  galleryHref,
  onRegenerate,
}: {
  result: StyleMatchResult;
  modeLabel: string;
  freeRemainingToday?: number;
  hasAccess?: boolean;
  galleryHref?: string;
  onRegenerate?: () => void;
}) {
  const handleDownload = async () => {
    try {
      const response = await fetch(result.resultUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `oneclickart-style-match-${result.resultId.slice(-6)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Download failed', err);
      window.open(result.resultUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/style-match?result=${result.resultId}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ url: shareUrl, title: 'My style match on oneclick·art' });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      // eslint-disable-next-line no-alert
      alert('Share link copied to clipboard.');
    } catch {
      window.prompt('Copy this share link:', shareUrl);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-7 py-7 bg-gradient-to-b from-[color:var(--cream-100)] to-[color:var(--cream-50)]">
      <div
        className="relative w-full max-w-[460px] border-[3px] border-foreground bg-[color:var(--cream-200)] overflow-hidden"
        style={{
          boxShadow: '8px 8px 0 0 var(--cocoa-900)',
          aspectRatio: ASPECT_TO_RATIO[result.aspectRatio],
        }}
      >
        {result.resultUrl && (
          <img
            src={result.resultUrl}
            alt={`${modeLabel} result`}
            className="w-full h-full object-cover"
          />
        )}
        <span className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-foreground text-[color:var(--cream-50)] border-2 border-foreground text-[10px] tracking-[0.16em] uppercase font-bold">
          {result.aspectRatio} · {result.width ?? 1024}px
        </span>
        {typeof freeRemainingToday === 'number' && !hasAccess && (
          <span
            className="absolute top-3 right-3 inline-block px-2.5 py-1 bg-[color:var(--butter-500)] text-foreground border-2 border-foreground text-[10px] tracking-[0.12em] font-bold"
            style={{
              boxShadow: '2px 2px 0 0 var(--cocoa-900)',
              transform: 'rotate(2deg)',
            }}
          >
            {freeRemainingToday} left today
          </span>
        )}
      </div>

      {/* Action row */}
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 w-full max-w-[460px] mt-4">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-3 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <Download className="h-4 w-4" />
          <span>Download HD</span>
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          title="Regenerate with the same inputs"
          aria-label="Regenerate"
          className="inline-flex items-center justify-center px-3 py-3 bg-card text-foreground border-[2.5px] border-foreground cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleShare}
          title="Share"
          aria-label="Share"
          className="inline-flex items-center justify-center px-3 py-3 bg-card text-foreground border-[2.5px] border-foreground cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="w-full max-w-[460px] mt-4 text-center text-xs text-muted-foreground leading-snug">
        Try a different reference?{' '}
        <strong className="font-display italic font-medium text-foreground">
          Replace the right slot
        </strong>{' '}
        and hit Generate again. Or{' '}
        <Link
          to={galleryHref ?? '/dashboard/creations'}
          className="text-[color:var(--terracotta-500)] underline font-bold"
        >
          open it in your gallery
        </Link>
        .
      </div>
    </div>
  );
}
