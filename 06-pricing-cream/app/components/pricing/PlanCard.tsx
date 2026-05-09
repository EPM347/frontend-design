import { Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { generatePlanFeatures, type PlanMetadata } from '~/utils/planFeatures';

export interface PlanCardProps {
  /** Plan id from Polar — used as the React key + button identifier */
  id: string;
  /** Display name, e.g. "Pro Pack" */
  name: string;
  /** Optional accent text rendered in italic terracotta inside the name (e.g. "Pack.") */
  nameAccent?: string;
  /** One-liner displayed under the name */
  tagline: string;
  /** Numeric amount in cents (Polar convention) */
  amountInCents: number;
  /** "month" or "year" — null implies one-time */
  interval: 'month' | 'year' | null;
  /** Plan metadata from Polar — feeds the feature list */
  metadata?: PlanMetadata;
  /** Optional override list of features when metadata isn't available */
  featuresOverride?: string[];
  /** True if this is the user's current active plan */
  isCurrentPlan?: boolean;
  /** True if this card should display the "Best for you" pill */
  isRecommended?: boolean;
  /** True while a checkout request is in flight for this plan */
  isLoading?: boolean;
  /** Caller for the CTA — receives the price id */
  onSelect: () => void;
  /** Optional secondary CTA copy override (e.g. "Manage plan" instead of "Get started") */
  ctaOverride?: string;
  /** True if the user already has an active subscription (changes button copy) */
  hasActiveSubscription?: boolean;
}

export function PlanCard({
  name,
  nameAccent,
  tagline,
  amountInCents,
  interval,
  metadata,
  featuresOverride,
  isCurrentPlan = false,
  isRecommended = false,
  isLoading = false,
  onSelect,
  ctaOverride,
  hasActiveSubscription = false,
}: PlanCardProps) {
  const dollars = (amountInCents / 100).toFixed(0);
  const cycleSuffix = interval === 'month' ? '/ mo' : interval === 'year' ? '/ yr' : '';

  const features = featuresOverride
    ? featuresOverride.map((text, idx) => ({ text, idx }))
    : generatePlanFeatures(metadata ?? {}, true).map((f, idx) => ({
        text: f.text,
        idx,
      }));

  const ctaCopy = isLoading
    ? 'Please wait…'
    : ctaOverride
      ? ctaOverride
      : isCurrentPlan
        ? 'Current plan'
        : hasActiveSubscription
          ? 'Manage plan'
          : 'Get started →';

  const nameNodes = nameAccent && name.includes(nameAccent)
    ? (() => {
        const i = name.indexOf(nameAccent);
        return (
          <>
            {name.slice(0, i)}
            <em
              className="not-italic font-display italic"
              style={{ color: 'var(--terracotta-500)' }}
            >
              {nameAccent}
            </em>
            {name.slice(i + nameAccent.length)}
          </>
        );
      })()
    : name;

  return (
    <div
      className={cn(
        'relative bg-card border-[2.5px] border-foreground p-6 sm:p-8 flex flex-col min-h-[440px]',
        isCurrentPlan && 'bg-[color:var(--cream-100)] border-[3px]',
      )}
      style={{
        boxShadow: isCurrentPlan
          ? '6px 6px 0 0 var(--cocoa-900)'
          : isRecommended
            ? '8px 8px 0 0 var(--terracotta-500)'
            : '4px 4px 0 0 var(--cocoa-900)',
      }}
    >
      {/* Status pills */}
      {isCurrentPlan && (
        <span
          aria-hidden="true"
          className="absolute -top-3.5 right-5 inline-block bg-foreground text-background border-2 border-foreground px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-bold"
        >
          Current
        </span>
      )}
      {isRecommended && !isCurrentPlan && (
        <span
          aria-hidden="true"
          className="absolute -top-3.5 right-5 inline-block bg-[color:var(--terracotta-500)] text-white border-2 border-foreground px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-bold"
          style={{ transform: 'rotate(2deg)' }}
        >
          Best for you
        </span>
      )}

      {/* Decorative glow on the recommended card */}
      {isRecommended && !isCurrentPlan && (
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 h-44 w-44 rounded-full pointer-events-none opacity-[0.12]"
          style={{
            background:
              'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
          }}
        />
      )}

      <div className="relative">
        <div className="font-display italic font-medium text-3xl leading-none text-foreground mb-2">
          {nameNodes}
        </div>
        <div className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {tagline}
        </div>

        <div className="font-display italic font-semibold text-[36px] leading-none text-foreground mb-5">
          <span className="text-xl text-muted-foreground align-baseline">$</span>
          {dollars}
          <span className="text-sm not-italic font-medium text-muted-foreground font-sans ml-1">
            {cycleSuffix}
          </span>
        </div>
      </div>

      <ul className="list-none flex-1 mb-5 space-y-2 relative">
        {features.map(({ text, idx }) => (
          <li key={idx} className="flex gap-2 items-start text-sm text-foreground">
            <span
              aria-hidden="true"
              className="font-bold shrink-0 leading-snug"
              style={{ color: 'var(--sage-500)' }}
            >
              ✓
            </span>
            <span className="leading-snug">{text}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        disabled={isCurrentPlan || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 w-full px-4 py-3 border-[2.5px] border-foreground text-sm font-bold transition-transform',
          isCurrentPlan
            ? 'bg-[color:var(--cream-200)] text-muted-foreground cursor-default'
            : isRecommended
              ? 'bg-[color:var(--terracotta-500)] text-white cursor-pointer active:translate-x-1 active:translate-y-1'
              : 'bg-foreground text-background cursor-pointer active:translate-x-1 active:translate-y-1',
          isLoading && 'opacity-70 cursor-wait',
        )}
        style={
          isCurrentPlan
            ? { boxShadow: 'none' }
            : { boxShadow: '3px 3px 0 0 var(--cocoa-900)' }
        }
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{ctaCopy}</span>
      </button>
    </div>
  );
}
