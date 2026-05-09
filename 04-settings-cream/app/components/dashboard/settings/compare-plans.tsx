import { Link } from 'react-router';
import { cn } from '~/lib/utils';

export type PlanTier = 'starter' | 'pro' | 'studio';

export interface PlanDef {
  id: PlanTier;
  name: string;
  /** Optional accent string inside the name, rendered terracotta italic. */
  nameAccent?: string;
  tagline: string;
  /** Numeric price (no currency). Use a string so e.g. "0" works for free tier. */
  price: string;
  cycleSuffix: string; // "/ mo" or "/ yr"
  features: string[];
  cta: { label: string; href: string };
  /** Variant of the CTA — primary terracotta vs neutral cocoa. */
  ctaVariant?: 'primary' | 'default';
  /** Render the "Best for you" pill */
  recommended?: boolean;
  /** Render the "Current" pill + dim the CTA */
  current?: boolean;
}

interface ComparePlansProps {
  plans: PlanDef[];
  heading?: string;
  subheading?: string;
}

export function ComparePlans({
  plans,
  heading = 'Want more, or less?',
  subheading = 'Switch any time · prorated',
}: ComparePlansProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <h2 className="font-display italic font-medium text-[28px] leading-none text-foreground">
          {heading}
        </h2>
        <div className="text-xs text-muted-foreground">{subheading}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const nameNodes = plan.nameAccent
            ? (() => {
                const i = plan.name.indexOf(plan.nameAccent);
                if (i === -1) return plan.name;
                return (
                  <>
                    {plan.name.slice(0, i)}
                    <em
                      className="not-italic font-display italic"
                      style={{ color: 'var(--terracotta-500)' }}
                    >
                      {plan.nameAccent}
                    </em>
                    {plan.name.slice(i + plan.nameAccent.length)}
                  </>
                );
              })()
            : plan.name;

          return (
            <div
              key={plan.id}
              className={cn(
                'relative bg-card border-[2.5px] border-foreground p-6 sm:p-7 flex flex-col min-h-[320px]',
                plan.current && 'bg-[color:var(--cream-100)] border-[3px]',
              )}
              style={{
                boxShadow: plan.current
                  ? '6px 6px 0 0 var(--cocoa-900)'
                  : '4px 4px 0 0 var(--cocoa-900)',
              }}
            >
              {plan.current && (
                <span
                  aria-hidden="true"
                  className="absolute -top-3.5 right-4 inline-block bg-foreground text-background border-2 border-foreground px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-bold"
                >
                  Current
                </span>
              )}
              {plan.recommended && !plan.current && (
                <span
                  aria-hidden="true"
                  className="absolute -top-3.5 right-4 inline-block bg-[color:var(--terracotta-500)] text-white border-2 border-foreground px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-bold"
                >
                  Best for you
                </span>
              )}

              <div className="font-display italic font-medium text-[28px] leading-none text-foreground mb-1.5">
                {nameNodes}
              </div>
              <div className="text-xs text-muted-foreground mb-3.5 leading-relaxed">
                {plan.tagline}
              </div>

              <div className="font-display italic font-semibold text-[28px] leading-none text-foreground mb-4">
                <span className="text-lg text-muted-foreground align-baseline">$</span>
                {plan.price}
                <span className="text-sm not-italic font-medium text-muted-foreground font-sans ml-1">
                  {plan.cycleSuffix}
                </span>
              </div>

              <ul className="list-none flex-1 mb-4 space-y-1.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 items-start text-sm text-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="font-bold shrink-0"
                      style={{ color: 'var(--sage-500)' }}
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.cta.href}
                aria-disabled={plan.current ? true : undefined}
                onClick={plan.current ? (e) => e.preventDefault() : undefined}
                className={cn(
                  'block text-center px-4 py-3 border-[2.5px] border-foreground text-sm font-bold no-underline',
                  plan.current
                    ? 'bg-[color:var(--cream-200)] text-muted-foreground cursor-default'
                    : plan.ctaVariant === 'primary' || plan.recommended
                      ? 'bg-[color:var(--terracotta-500)] text-white'
                      : 'bg-foreground text-background',
                )}
                style={
                  plan.current ? { boxShadow: 'none' } : { boxShadow: '3px 3px 0 0 var(--cocoa-900)' }
                }
              >
                {plan.cta.label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
