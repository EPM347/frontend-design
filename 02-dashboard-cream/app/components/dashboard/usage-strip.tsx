'use client';
import { Link } from 'react-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Skeleton } from '~/components/ui/skeleton';

type Cell = {
  key: 'images' | 'upscales' | 'bgremoval' | 'rollover';
  label: string;
  num: string;
  meta: string;
  pct: number; // 0-100, drives the bar fill
  dotColor: string;
  fillColor: string;
};

/**
 * Quiet bottom strip that replaces the old "section cards" 3-up grid. Four
 * mini-cells: images, upscales, no-bg removals, rollover credits. Each shows a
 * big italic number and a thin progress bar. Last cell is a "Resets" CTA.
 */
export function UsageStrip() {
  const quota = useQuery(api.usage.getQuota);

  if (!quota) {
    return (
      <div
        className="bg-card border-[2.5px] border-foreground px-7 py-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 items-center"
        style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  // Determine paid tier
  const hasPaidPlan =
    quota.planMonthlyLimit !== undefined || quota.planDailyLimit !== undefined;
  const isPaidTier = hasPaidPlan || (quota.tier !== 'free' && quota.tier !== undefined);

  // Images
  const imagesUsed = isPaidTier
    ? (quota.planMonthlyUsed ?? 0)
    : (quota.freeMonthlyUsed ?? 0);
  const imagesLimit = isPaidTier ? quota.planMonthlyLimit : quota.freeMonthlyLimit;

  // Upscales
  const upscalesUsed = quota.planUpscaleMonthlyUsed ?? 0;
  const upscalesLimit = quota.planUpscaleMonthlyLimit;

  // Background removal
  const bgUsed = quota.planBgRemovalMonthlyUsed ?? 0;
  const bgLimit = quota.planBgRemovalMonthlyLimit;

  // Rollover credits
  const rolloverImage =
    (quota as unknown as { planMonthlyRolloverBalance?: number })
      .planMonthlyRolloverBalance ?? 0;
  const rolloverUpscale =
    (quota as unknown as { planUpscaleRolloverBalance?: number })
      .planUpscaleRolloverBalance ?? 0;
  const rolloverTotal = rolloverImage + rolloverUpscale;

  function asCell(
    key: Cell['key'],
    label: string,
    used: number,
    limit: number | 'unlimited' | undefined,
    metaSuffix: string,
    dotColor: string,
    fillColor: string,
  ): Cell {
    if (limit === 'unlimited') {
      return {
        key,
        label,
        num: '∞',
        meta: 'Unlimited this cycle',
        pct: 0,
        dotColor,
        fillColor,
      };
    }
    if (typeof limit === 'number' && limit > 0) {
      const remaining = Math.max(0, limit - used);
      const pct = Math.min(100, Math.round((used / limit) * 100));
      return {
        key,
        label,
        num: remaining.toString(),
        meta: `${remaining} left ${metaSuffix}`,
        pct,
        dotColor,
        fillColor,
      };
    }
    return { key, label, num: '—', meta: 'Not on plan', pct: 0, dotColor, fillColor };
  }

  const cells: Cell[] = [
    asCell(
      'images',
      'Images',
      imagesUsed,
      imagesLimit,
      'this cycle',
      'var(--terracotta-500)',
      'var(--terracotta-500)',
    ),
    asCell(
      'upscales',
      'Upscales',
      upscalesUsed,
      upscalesLimit,
      'this cycle',
      'var(--sage-500)',
      'var(--sage-500)',
    ),
    asCell(
      'bgremoval',
      'No-bg',
      bgUsed,
      bgLimit,
      'this cycle',
      'var(--butter-500)',
      'var(--butter-700)',
    ),
    {
      key: 'rollover',
      label: 'Rollover',
      num: rolloverTotal.toString(),
      meta: rolloverTotal > 0 ? 'From last cycle' : 'No rollover yet',
      pct: rolloverTotal > 0 ? 50 : 0,
      dotColor: 'var(--basil-500)',
      fillColor: 'var(--basil-500)',
    },
  ];

  return (
    <div
      className="bg-card border-[2.5px] border-foreground px-5 sm:px-7 py-5 sm:py-6 grid gap-x-6 gap-y-4 items-center"
      style={{
        boxShadow: '4px 4px 0 0 var(--cocoa-900)',
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}
    >
      <div className="contents lg:contents">
        {cells.map((c, idx) => (
          <div
            key={c.key}
            className={
              'pb-1 ' +
              (idx < cells.length - 1
                ? 'lg:border-r lg:border-foreground/12 lg:pr-6'
                : '')
            }
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: c.dotColor }}
                aria-hidden="true"
              />
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-foreground">
                {c.label}
              </span>
            </div>
            <div className="font-display italic font-semibold text-3xl leading-none text-foreground">
              {c.num}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{c.meta}</div>
            <div
              className="mt-2 h-[5px] border-[1.5px] border-foreground overflow-hidden"
              style={{ background: 'var(--cream-200)' }}
              aria-hidden="true"
            >
              <div
                className="h-full"
                style={{ background: c.fillColor, width: `${c.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Resets cell — full width on mobile, last column on lg */}
      <div className="text-left lg:text-right pl-0 lg:pl-2 col-span-2 lg:col-span-1 border-t border-foreground/12 lg:border-t-0 pt-3 lg:pt-0">
        <div className="font-display italic font-medium text-sm text-foreground mb-1">
          Resets in 29 days
        </div>
        <Link
          to="/dashboard/settings?tab=subscription"
          prefetch="intent"
          className="text-xs font-bold no-underline"
          style={{ color: 'var(--terracotta-500)' }}
        >
          Manage plan →
        </Link>
      </div>
    </div>
  );
}
