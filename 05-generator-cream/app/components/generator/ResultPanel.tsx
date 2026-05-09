import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, Download, Maximize2, Circle, Share2, ImageIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { GenerationResult, StylePreset, WorkflowState } from './types';
import { STYLE_BY_ID } from '~/config/style-catalog';

export interface ResultPanelProps {
  workflowState: WorkflowState;
  result: GenerationResult | null;
  /** Currently chosen style — used for "cooking…" copy and result label */
  style: StylePreset;
  /** Optional remaining quota for the "X left today" pill on the result */
  freeRemainingToday?: number;
  /** Whether the user has subscribed/has paid features */
  hasAccess?: boolean;
  /** Optional ETA in seconds, drives the progress bar + ETA label */
  etaSeconds?: number;
  /** 0..1 progress estimate */
  progress?: number;
  /** When provided, "Open in your gallery" link points here. */
  galleryHref?: string;
}

/** Friendly progress copy that rotates every 6 seconds during generation. */
const ROTATING_COPY: Array<{ headline: string; sub: string }> = [
  { headline: 'Picking colors…', sub: 'The model is auditioning palettes for your photo.' },
  { headline: 'Adding shadows…', sub: 'Depth coming in — this is where it starts to feel alive.' },
  { headline: 'Almost there…', sub: 'Final brushwork. Worth the extra few seconds.' },
];

export function ResultPanel({
  workflowState,
  result,
  style,
  freeRemainingToday,
  hasAccess,
  etaSeconds,
  progress = 0.5,
  galleryHref,
}: ResultPanelProps) {
  const styleLabel = STYLE_BY_ID[style]?.label ?? style;

  // Rotate the copy during generation
  const [copyIdx, setCopyIdx] = useState(0);
  useEffect(() => {
    if (workflowState !== 'generating' && workflowState !== 'queued') return;
    const id = setInterval(() => {
      setCopyIdx((i) => (i + 1) % ROTATING_COPY.length);
    }, 6000);
    return () => clearInterval(id);
  }, [workflowState]);

  // Header pill
  const stateLabel = (() => {
    switch (workflowState) {
      case 'idle':
      case 'signupRequired':
        return 'Waiting…';
      case 'queued':
        return 'Queued ↗';
      case 'generating':
        return 'Cooking…';
      case 'ready':
        return 'Ready ✓ · saved to gallery';
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
            3
          </span>
          Your art
        </div>
        <div
          className={cn(
            'font-display italic font-medium text-sm',
            workflowState === 'generating' || workflowState === 'queued'
              ? 'text-[color:var(--terracotta-500)]'
              : workflowState === 'ready'
                ? 'text-[color:var(--sage-500)]'
                : workflowState === 'error'
                  ? 'text-[color:var(--tomato-500)]'
                  : 'text-foreground',
          )}
        >
          {stateLabel}
        </div>
      </div>

      {/* Body — switches by state */}
      {(workflowState === 'idle' || workflowState === 'signupRequired') && (
        <ResultEmpty workflowState={workflowState} />
      )}

      {(workflowState === 'queued' || workflowState === 'generating') && (
        <ResultGenerating
          headline={ROTATING_COPY[copyIdx].headline}
          sub={ROTATING_COPY[copyIdx].sub}
          etaSeconds={etaSeconds}
          progress={progress}
        />
      )}

      {workflowState === 'ready' && result && (
        <ResultReady
          result={result}
          styleLabel={styleLabel}
          freeRemainingToday={freeRemainingToday}
          hasAccess={hasAccess}
          galleryHref={galleryHref}
        />
      )}

      {workflowState === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16">
          <div className="font-display italic font-medium text-foreground text-2xl mb-2">
            Something went sideways.
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            The server didn't send back a result. Try Generate again — usually a one-off.
          </p>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── EMPTY STATE ───────────────────────── */

function ResultEmpty({ workflowState }: { workflowState: WorkflowState }) {
  const isQueued = workflowState === 'signupRequired';
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
            'radial-gradient(circle, var(--sage-500) 0%, var(--basil-500) 70%, transparent 100%)',
        }}
      />

      <div
        className="relative w-14 h-14 bg-[color:var(--butter-500)] border-[3px] border-foreground flex items-center justify-center mb-5"
        style={{
          boxShadow: '4px 4px 0 0 var(--cocoa-900)',
          transform: 'rotate(-4deg)',
        }}
      >
        {isQueued ? (
          <Sparkles className="h-6 w-6 animate-spin text-[color:var(--terracotta-500)]" />
        ) : (
          <Sparkles className="h-6 w-6 text-foreground" />
        )}
      </div>

      <h3 className="relative font-display italic font-medium text-2xl leading-none text-foreground mb-2">
        {isQueued ? 'Sign up to start cooking.' : 'This space fills with magic.'}
      </h3>
      <p className="relative text-sm text-muted-foreground max-w-xs leading-relaxed">
        {isQueued ? (
          <>
            Your photo + style are{' '}
            <strong className="font-display italic font-medium text-foreground">queued</strong>.
            The moment you finish signing up, generation kicks off here — about 30 seconds total.
          </>
        ) : (
          <>
            Drop a photo on the left, pick a style, hit{' '}
            <strong className="font-display italic font-medium text-foreground">Generate</strong>.
            We'll ask for your email so we can save the result.
          </>
        )}
      </p>
    </div>
  );
}

/* ───────────────────────── GENERATING STATE ───────────────────────── */

function ResultGenerating({
  headline,
  sub,
  etaSeconds,
  progress,
}: {
  headline: string;
  sub: string;
  etaSeconds?: number;
  progress: number;
}) {
  const percent = Math.max(2, Math.min(98, Math.round(progress * 100)));
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 bg-[color:var(--cream-50)]">
      <div
        className="w-full max-w-[460px] aspect-square bg-[color:var(--cream-200)] border-[3px] border-foreground flex items-center justify-center relative overflow-hidden mb-5"
        style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(135deg, rgba(216,124,90,0.08), rgba(216,124,90,0.08) 12px, rgba(244,201,93,0.08) 12px, rgba(244,201,93,0.08) 24px, rgba(136,165,132,0.08) 24px, rgba(136,165,132,0.08) 36px)',
            animation: 'gen-shimmer 4s linear infinite',
          }}
        />
        <div
          className="relative w-20 h-20 bg-card border-[3px] border-foreground flex items-center justify-center font-display italic font-semibold text-2xl text-[color:var(--terracotta-500)]"
          style={{
            boxShadow: '5px 5px 0 0 var(--cocoa-900)',
            animation: 'gen-pulse 1.6s ease-in-out infinite',
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

      {/* Inline keyframes — scoped CSS */}
      <style>{`
        @keyframes gen-shimmer {
          0% { transform: translateX(0); }
          100% { transform: translateX(36px); }
        }
        @keyframes gen-pulse {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          50% { transform: rotate(3deg) scale(1.04); }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────── READY STATE ───────────────────────── */

function ResultReady({
  result,
  styleLabel,
  freeRemainingToday,
  hasAccess,
  galleryHref,
}: {
  result: GenerationResult;
  styleLabel: string;
  freeRemainingToday?: number;
  hasAccess?: boolean;
  galleryHref?: string;
}) {
  const handleDownload = async () => {
    try {
      const response = await fetch(result.resultUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `oneclickart-${styleLabel.toLowerCase().replace(/\s+/g, '-')}-${result.jobId.slice(-6)}.png`;
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
    const shareUrl = `${window.location.origin}/art/${result.jobId}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ url: shareUrl, title: `My ${styleLabel} on oneclick·art` });
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
        className="relative w-full max-w-[460px] aspect-square border-[3px] border-foreground bg-[color:var(--cream-200)] overflow-hidden"
        style={{ boxShadow: '8px 8px 0 0 var(--cocoa-900)' }}
      >
        {result.resultUrl && (
          <img
            src={result.resultUrl}
            alt={`${styleLabel} result`}
            className="w-full h-full object-cover"
          />
        )}
        <span className="absolute top-3 left-3 inline-block px-2.5 py-1 bg-foreground text-[color:var(--cream-50)] border-2 border-foreground text-[10px] tracking-[0.16em] uppercase font-bold">
          HD · {result.width ?? 1024}px
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

      {/* Action row: 1 wide primary + 3 icon secondary */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 w-full max-w-[460px] mt-4">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-3 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <Download className="h-4 w-4" />
          <span>Download HD</span>
        </button>
        <Link
          to={galleryHref ?? `/dashboard/creations?selected=${result.jobId}`}
          title="Upscale 2× (in your gallery)"
          aria-label="Upscale 2×"
          className="inline-flex items-center justify-center px-3 py-3 bg-card text-foreground border-[2.5px] border-foreground cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <Maximize2 className="h-4 w-4" />
        </Link>
        <Link
          to={galleryHref ?? `/dashboard/creations?selected=${result.jobId}`}
          title="No background (in your gallery)"
          aria-label="No background"
          className="inline-flex items-center justify-center px-3 py-3 bg-card text-foreground border-[2.5px] border-foreground cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <Circle className="h-4 w-4" />
        </Link>
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

      {/* Cross-sell line */}
      <div className="w-full max-w-[460px] mt-4 text-center text-xs text-muted-foreground leading-snug">
        Love it?{' '}
        <strong className="font-display italic font-medium text-foreground">
          Try the same photo in a different style
        </strong>{' '}
        — pick another tile on the left.
        <br />
        Or{' '}
        <Link
          to={galleryHref ?? `/dashboard/creations?selected=${result.jobId}`}
          className="text-[color:var(--terracotta-500)] underline font-bold"
        >
          open it in your gallery
        </Link>{' '}
        for upscale + bg-removal.
      </div>
    </div>
  );
}
