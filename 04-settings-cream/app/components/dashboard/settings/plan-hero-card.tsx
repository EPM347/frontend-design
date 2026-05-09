import { ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router';

interface PlanHeroCardProps {
  /** Plan tagline e.g. "Pro Pack." — the trailing period is intentional in copy */
  planName: string;
  /** Highlighted portion of the plan name (rendered terracotta italic). */
  planNameAccent?: string;
  /** Numeric price (no currency symbol) */
  price: string;
  /** "/ month" or "/ year" */
  cycleSuffix: string;
  /** Free-form description of what the plan includes + when it renews. */
  description: React.ReactNode;
  /** Upgrade target — only shown if `canUpgrade` */
  upgradeTo?: { label: string; href: string };
  /** Annual switch CTA — only shown if `canSwitchToAnnual` */
  switchAnnual?: { label: string; href: string };
  /** Cancel subscription handler */
  onCancel?: () => void;
  canUpgrade?: boolean;
  canSwitchToAnnual?: boolean;
}

export function PlanHeroCard({
  planName,
  planNameAccent,
  price,
  cycleSuffix,
  description,
  upgradeTo,
  switchAnnual,
  onCancel,
  canUpgrade = true,
  canSwitchToAnnual = true,
}: PlanHeroCardProps) {
  // Split planName at planNameAccent for terracotta highlighting
  let nameNodes: React.ReactNode = planName;
  if (planNameAccent && planName.includes(planNameAccent)) {
    const before = planName.slice(0, planName.indexOf(planNameAccent));
    const after = planName.slice(
      planName.indexOf(planNameAccent) + planNameAccent.length,
    );
    nameNodes = (
      <>
        {before}
        <em
          className="not-italic font-display italic"
          style={{ color: 'var(--terracotta-500)' }}
        >
          {planNameAccent}
        </em>
        {after}
      </>
    );
  }

  return (
    <div
      className="relative bg-card border-[3.5px] border-foreground p-7 sm:p-9 overflow-hidden"
      style={{ boxShadow: '8px 8px 0 0 var(--cocoa-900)' }}
    >
      {/* Decorative radial glow */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 h-56 w-56 rounded-full pointer-events-none opacity-[0.18]"
        style={{
          background:
            'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
        }}
      />

      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-[color:var(--terracotta-500)] mb-2.5">
          Your plan · active
        </div>

        <h2 className="font-display italic font-medium text-4xl sm:text-[44px] leading-[0.96] tracking-[-0.02em] text-foreground mb-4">
          {nameNodes}
        </h2>

        <div className="font-display italic font-semibold text-[22px] text-foreground leading-none mb-1.5">
          <span className="text-base text-muted-foreground align-baseline mr-0.5">$</span>
          {price}
          <span className="text-sm not-italic font-medium text-muted-foreground font-sans ml-1">
            {cycleSuffix}
          </span>
        </div>

        <div className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {canUpgrade && upgradeTo && (
            <Link
              to={upgradeTo.href}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground text-sm font-bold no-underline"
              style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>{upgradeTo.label}</span>
            </Link>
          )}
          {canSwitchToAnnual && switchAnnual && (
            <Link
              to={switchAnnual.href}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold no-underline"
              style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>{switchAnnual.label}</span>
            </Link>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-[color:var(--tomato-500)] border-2 border-foreground text-[13px] font-semibold cursor-pointer"
              style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
