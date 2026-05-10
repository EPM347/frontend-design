/**
 * ProofStrip — three before/after triplets that live below the hero
 * copy. Each triplet is `inspo + your photo → match`. Clicking a
 * triplet pre-fills the upload slots with that sample's photos AND
 * sets workflowState='sample-complete' so the user sees the result
 * reveal immediately (zero credits, zero wait).
 *
 * Until SAMPLE_MATCHES is populated with real R2 URLs, this falls
 * back to gradient placeholders that still convey the before/after
 * idea visually.
 */

import { useCallback } from 'react';
import { cn } from '~/lib/utils';
import { SAMPLE_MATCHES, hasRealSamples } from './sample-matches';
import type { SampleMatch } from './types';

export interface ProofStripProps {
  /** Called when the user clicks a triplet to load it as a sample. */
  onSampleSelected: (sample: SampleMatch) => void;
  className?: string;
}

export function ProofStrip({ onSampleSelected, className }: ProofStripProps) {
  const samplesReady = hasRealSamples();

  return (
    <div className={cn('px-6', className)}>
      <div className="text-center text-[10px] tracking-[0.32em] uppercase font-bold text-muted-foreground mb-4">
        <span className="text-[color:var(--terracotta-500)]">★</span>{' '}
        Real matches &middot; click any to use it as a sample{' '}
        <span className="text-[color:var(--terracotta-500)]">★</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {SAMPLE_MATCHES.map((sample) => (
          <ProofCard
            key={sample.id}
            sample={sample}
            useFallback={!samplesReady}
            onClick={() => onSampleSelected(sample)}
          />
        ))}
      </div>
    </div>
  );
}

interface ProofCardProps {
  sample: SampleMatch;
  useFallback: boolean;
  onClick: () => void;
}

function ProofCard({ sample, useFallback, onClick }: ProofCardProps) {
  const grads = sample.fallbackGradients;

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card border border-foreground/10 rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg shadow-md text-left w-full"
    >
      <div className="grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '4px' }}>
        <ProofThumb
          url={useFallback ? undefined : sample.refPhotoUrl}
          gradient={grads?.ref}
          shape="ref"
        />
        <ProofArrow symbol="+" />
        <ProofThumb
          url={useFallback ? undefined : sample.userPhotoUrl}
          gradient={grads?.user}
          shape="user"
        />
        <ProofArrow symbol="→" />
        <ProofThumb
          url={useFallback ? undefined : sample.resultUrl}
          gradient={grads?.result}
          shape="result"
        />
      </div>

      <div className="flex justify-between items-baseline mt-2.5 px-0.5">
        <span className="font-display italic font-medium text-[12px] leading-none text-foreground">
          {sample.name}
        </span>
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted-foreground">
          {sample.aspectRatio} &middot; {sample.mode === 'style' ? 'style' : 'scene'}
        </span>
      </div>
    </button>
  );
}

/** A single thumbnail in the proof triplet. Either a real image
 *  or a fallback gradient with a subject silhouette. */
function ProofThumb({
  url,
  gradient,
  shape,
}: {
  url?: string;
  gradient?: string;
  shape: 'user' | 'ref' | 'result';
}) {
  if (url && !url.startsWith('__REPLACE_')) {
    return (
      <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-foreground/10">
        <img src={url} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[4/5] rounded-md overflow-hidden border border-foreground/10"
      style={{ background: gradient ?? 'var(--cream-200)' }}
    >
      {/* subject silhouette */}
      <span
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full"
        style={{
          width: '38%',
          background:
            shape === 'ref'
              ? 'rgba(255,255,255,0.08)'
              : 'linear-gradient(160deg, #E5C0A0, #C49A7A)',
        }}
      />
      <span
        className="absolute left-1/2 bottom-0 -translate-x-1/2"
        style={{
          width: '70%',
          height: '50%',
          borderTopLeftRadius: '50% 60%',
          borderTopRightRadius: '50% 60%',
          background:
            shape === 'ref'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(58,46,38,0.4)',
        }}
      />
    </div>
  );
}

function ProofArrow({ symbol }: { symbol: string }) {
  return (
    <span className="text-muted-foreground opacity-60 font-display italic text-base leading-none px-0.5">
      {symbol}
    </span>
  );
}
