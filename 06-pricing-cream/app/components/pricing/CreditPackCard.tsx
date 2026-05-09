import { Loader2, Coins } from 'lucide-react';
import { cn } from '~/lib/utils';

export interface CreditPackCardProps {
  name: string;
  /** One-line tagline shown under the name */
  tagline?: string;
  amountInCents: number;
  /** Number of credits this pack delivers (drives the math callout) */
  credits?: number;
  /** Whether to show the "Best value" pill */
  isBestValue?: boolean;
  isLoading?: boolean;
  onSelect: () => void;
}

export function CreditPackCard({
  name,
  tagline,
  amountInCents,
  credits,
  isBestValue,
  isLoading,
  onSelect,
}: CreditPackCardProps) {
  const dollars = (amountInCents / 100).toFixed(0);
  // Per-credit cost — shown only when credits is known and > 0
  const perCreditCents =
    credits && credits > 0 ? Math.round(amountInCents / credits) : null;

  return (
    <div
      className="relative bg-card border-[2.5px] border-foreground p-6 sm:p-7 flex flex-col"
      style={{
        boxShadow: isBestValue
          ? '6px 6px 0 0 var(--butter-500)'
          : '4px 4px 0 0 var(--cocoa-900)',
      }}
    >
      {isBestValue && (
        <span
          aria-hidden="true"
          className="absolute -top-3.5 right-5 inline-block bg-[color:var(--butter-500)] text-foreground border-2 border-foreground px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-bold"
          style={{ transform: 'rotate(-2deg)' }}
        >
          Best value
        </span>
      )}

      <div className="flex items-center gap-2.5 mb-3">
        <div
          aria-hidden="true"
          className="h-9 w-9 bg-[color:var(--butter-500)] border-2 border-foreground flex items-center justify-center"
          style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
        >
          <Coins className="h-4 w-4 text-foreground" />
        </div>
        <div className="font-display italic font-medium text-2xl leading-none text-foreground">
          {name}
        </div>
      </div>

      {tagline && (
        <div className="text-xs text-muted-foreground leading-relaxed mb-4">
          {tagline}
        </div>
      )}

      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-display italic font-semibold text-[34px] leading-none text-foreground">
          <span className="text-lg text-muted-foreground align-baseline">$</span>
          {dollars}
        </span>
        <span className="text-sm font-sans text-muted-foreground">one-time</span>
      </div>
      {credits && credits > 0 && (
        <div className="text-xs text-muted-foreground mb-5 font-mono tabular-nums">
          {credits.toLocaleString()} credits
          {perCreditCents !== null && (
            <>
              {' · '}
              <span className="text-foreground font-bold">
                ${(perCreditCents / 100).toFixed(2)}
              </span>{' '}
              per generation
            </>
          )}
        </div>
      )}

      <ul className="list-none mb-5 space-y-2">
        <li className="flex gap-2 items-start text-sm text-foreground">
          <span
            aria-hidden="true"
            className="font-bold shrink-0"
            style={{ color: 'var(--sage-500)' }}
          >
            ✓
          </span>
          <span>Use credits for any style</span>
        </li>
        <li className="flex gap-2 items-start text-sm text-foreground">
          <span
            aria-hidden="true"
            className="font-bold shrink-0"
            style={{ color: 'var(--sage-500)' }}
          >
            ✓
          </span>
          <span>Credits never expire</span>
        </li>
        <li className="flex gap-2 items-start text-sm text-foreground">
          <span
            aria-hidden="true"
            className="font-bold shrink-0"
            style={{ color: 'var(--sage-500)' }}
          >
            ✓
          </span>
          <span>HD download · no watermark</span>
        </li>
      </ul>

      <button
        type="button"
        onClick={onSelect}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 w-full px-4 py-3 border-[2.5px] border-foreground text-sm font-bold transition-transform mt-auto',
          isBestValue
            ? 'bg-[color:var(--butter-500)] text-foreground'
            : 'bg-foreground text-background',
          isLoading
            ? 'opacity-70 cursor-wait'
            : 'cursor-pointer active:translate-x-1 active:translate-y-1',
        )}
        style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{isLoading ? 'Please wait…' : 'Buy credits'}</span>
      </button>
    </div>
  );
}
