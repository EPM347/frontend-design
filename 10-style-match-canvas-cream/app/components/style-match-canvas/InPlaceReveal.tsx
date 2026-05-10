/**
 * InPlaceReveal — replaces the connector line + upload cards when
 * generation completes. Shows the result as a centered big card with
 * the two sources flanking it (user + ref shrunk to 120px thumbs,
 * result at 280px).
 *
 * Used for both:
 *   - workflowState === 'complete'         (real generation)
 *   - workflowState === 'sample-complete'  (pre-rendered sample)
 *
 * Action toolbar floats below: Download HD (primary), Try different
 * look (regenerate or sample), Share.
 */

import { Link } from 'react-router';
import { cn } from '~/lib/utils';
import type {
  StyleMatchResult,
  StyleMatchSlot,
  StyleMatchAspectRatio,
} from './types';

const ASPECT_TO_RATIO: Record<StyleMatchAspectRatio, string> = {
  '1:1': '1 / 1',
  '4:5': '4 / 5',
  '9:16': '9 / 16',
};

export interface InPlaceRevealProps {
  result: StyleMatchResult;
  userSlot: StyleMatchSlot;
  referenceSlot: StyleMatchSlot;
  /** True if we're showing a pre-rendered sample (no real generation). */
  isSample?: boolean;
  onTryAnother?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function InPlaceReveal({
  result,
  userSlot,
  referenceSlot,
  isSample = false,
  onTryAnother,
  onShare,
  onDownload,
  className,
}: InPlaceRevealProps) {
  return (
    <div className={cn('relative w-full', className)} style={{ minHeight: '440px' }}>
      <div className="text-center mb-4">
        <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-muted-foreground mb-2">
          <span className="text-[color:var(--basil-500)]">✓</span>{' '}
          {isSample
            ? 'Sample match · how the real flow feels'
            : 'Match complete · saved to your gallery'}
        </div>
        <h2 className="font-display italic font-medium text-[clamp(28px,4vw,40px)] leading-none tracking-tight text-foreground m-0">
          There it is — your photo, that{' '}
          <em className="text-[color:var(--terracotta-500)] not-italic font-display italic">
            look
          </em>
          .
        </h2>
      </div>

      <div className="flex items-center justify-center gap-3 max-w-3xl mx-auto">
        <SourceThumb slot={userSlot} role="user" />
        <span className="text-foreground opacity-50 font-display italic text-xl leading-none">+</span>
        <SourceThumb slot={referenceSlot} role="reference" />
        <span className="text-foreground opacity-50 font-display italic text-xl leading-none">→</span>
        <ResultCard result={result} />
      </div>

      <div className="text-center mt-6 mb-3 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground opacity-70">
        <span className="text-[color:var(--basil-500)]">✓</span>{' '}
        {isSample
          ? 'Want this on your photo? Sign in & drop yours.'
          : 'Saved automatically · download HD any time · share with one tap'}
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        {isSample ? (
          <Link
            to="/sign-in"
            className="px-5 py-2.5 bg-[color:var(--cocoa-900)] text-[color:var(--cream-50)] rounded-full font-bold text-[14px] hover:bg-foreground/85 transition-colors"
          >
            Sign in & match your own
          </Link>
        ) : (
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[color:var(--cocoa-900)] text-[color:var(--cream-50)] rounded-full font-bold text-[13px] cursor-pointer hover:bg-foreground/85"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download HD
          </button>
        )}
        {onTryAnother && (
          <button
            type="button"
            onClick={onTryAnother}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground border border-foreground/15 rounded-full font-semibold text-[13px] cursor-pointer hover:bg-foreground/5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Try a different look
          </button>
        )}
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground border border-foreground/15 rounded-full font-semibold text-[13px] cursor-pointer hover:bg-foreground/5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        )}
      </div>
    </div>
  );
}

function SourceThumb({
  slot,
  role,
}: {
  slot: StyleMatchSlot;
  role: 'user' | 'reference';
}) {
  const rotate = role === 'user' ? 'rotate(-2deg)' : 'rotate(2deg)';
  const label = role === 'user' ? 'Your photo' : 'The inspo';
  const accent = role === 'user' ? 'var(--terracotta-500)' : 'var(--basil-500)';

  return (
    <div className="relative" style={{ transform: rotate }}>
      <div
        className="w-[120px] aspect-[4/5] rounded-lg border-2 border-foreground/80 overflow-hidden"
        style={{ boxShadow: '0 8px 18px -6px rgba(58,46,38,0.2)' }}
      >
        {slot.previewUrl ? (
          <img
            src={slot.previewUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-cream-200" />
        )}
      </div>
      <div
        className="absolute -bottom-5 left-0 right-0 text-center font-mono text-[9px] tracking-[0.18em] uppercase"
        style={{ color: accent }}
      >
        {label}
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: StyleMatchResult }) {
  return (
    <div
      className="relative w-[280px] border-[3px] border-foreground overflow-hidden rounded-xl"
      style={{
        aspectRatio: ASPECT_TO_RATIO[result.aspectRatio],
        boxShadow:
          '0 24px 50px -10px rgba(216,124,90,0.45), 0 8px 0 0 rgba(58,46,38,0.05)',
      }}
    >
      <span
        className="absolute inset-[-20px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(244,201,93,0.4) 0%, transparent 70%)',
          zIndex: -1,
        }}
        aria-hidden="true"
      />
      {result.resultUrl && (
        <img
          src={result.resultUrl}
          alt="Style match result"
          className="w-full h-full object-cover"
        />
      )}
      <span className="absolute top-3 left-3 bg-foreground text-[color:var(--cream-50)] px-2.5 py-1 rounded font-mono text-[9px] tracking-[0.16em] uppercase">
        Match &middot; {result.width ?? 1024}px
      </span>
    </div>
  );
}
