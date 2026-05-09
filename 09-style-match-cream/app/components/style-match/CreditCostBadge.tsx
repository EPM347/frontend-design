import { cn } from '~/lib/utils';

export interface CreditCostBadgeProps {
  /** Credit cost per generation. Default 2. */
  cost?: number;
  /** Whether the user is on a paid plan (changes secondary copy). */
  hasAccess?: boolean;
  /** Remaining free generations today (only shown when !hasAccess). */
  freeRemainingToday?: number;
  /** Optional credits balance (paid users + credit packs). */
  creditsBalance?: number;
  /** Visual variant — `inline` for in-row, `block` for above the Generate button. */
  variant?: 'inline' | 'block';
  className?: string;
}

/**
 * StyleMatch costs 2 credits per generation, vs 1 for a normal Generator
 * run. Surface that prominently before the user clicks Generate so the
 * cost isn't a surprise. Matches the cream + neo-brutalist token system
 * (butter background, chunky border, cocoa shadow).
 */
export function CreditCostBadge({
  cost = 2,
  hasAccess,
  freeRemainingToday,
  creditsBalance,
  variant = 'inline',
  className,
}: CreditCostBadgeProps) {
  const secondary = (() => {
    if (hasAccess) {
      if (typeof creditsBalance === 'number') {
        return `${creditsBalance} credits available`;
      }
      return 'Included in your plan';
    }
    if (typeof freeRemainingToday === 'number') {
      return `${freeRemainingToday} free left today`;
    }
    return 'Free trial · 3/day';
  })();

  if (variant === 'block') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-4 py-3 bg-[color:var(--butter-500)] border-[2.5px] border-foreground',
          className,
        )}
        style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
      >
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-foreground/70 mb-0.5">
            Cost
          </div>
          <div className="font-display italic font-medium text-lg leading-none text-foreground">
            {cost} credits per generation
          </div>
        </div>
        <div className="font-mono text-[11px] text-foreground/70 text-right leading-snug">
          {secondary}
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 bg-[color:var(--butter-500)] border-2 border-foreground text-[10px] tracking-[0.16em] uppercase font-bold text-foreground',
        className,
      )}
      style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
    >
      <span className="text-foreground">{cost}</span>
      <span className="text-foreground/70">credits</span>
    </span>
  );
}
