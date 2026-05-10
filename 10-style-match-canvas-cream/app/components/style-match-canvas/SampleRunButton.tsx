/**
 * SampleRunButton — the butter-yellow pill below the proof strip
 * that lets unauthenticated users taste the magic without spending
 * credits or signing in.
 *
 * Clicking it picks one of the SAMPLE_MATCHES (round-robin or fixed,
 * see getDefaultSample), pre-fills the upload slots with that
 * sample's user+ref photos, and immediately sets the workflow
 * state to 'sample-complete' so the result-reveal animation fires
 * and the user sees a real-looking match in 200ms.
 *
 * Zero credits, zero backend calls, zero sign-in friction.
 */

import { cn } from '~/lib/utils';
import { hasRealSamples } from './sample-matches';

export interface SampleRunButtonProps {
  onClick: () => void;
  className?: string;
}

export function SampleRunButton({ onClick, className }: SampleRunButtonProps) {
  const samplesReady = hasRealSamples();

  return (
    <div className={cn('text-center', className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={!samplesReady}
        className={cn(
          'inline-flex items-center gap-2.5 px-5 py-3 border-2 border-foreground rounded-full',
          'font-display italic font-medium text-[15px] text-foreground cursor-pointer',
          'transition-transform active:translate-x-1 active:translate-y-1',
          !samplesReady && 'opacity-50 cursor-not-allowed',
        )}
        style={{
          background: 'var(--butter-500)',
          boxShadow: '4px 4px 0 0 var(--cocoa-900)',
        }}
      >
        <span className="text-[color:var(--terracotta-500)] not-italic">★</span>
        {samplesReady ? 'Try a sample match — no sign-in needed' : 'Samples coming soon'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
      <div className="mt-2.5 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
        Pre-loads two photos &middot; runs the flow &middot; zero credits
      </div>
    </div>
  );
}
