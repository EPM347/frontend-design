import { Link } from 'react-router';
import { Image as ImageIcon, Maximize2, Sparkles } from 'lucide-react';

type Quota = {
  tier?: string;
  planDailyLimit?: number | 'unlimited';
  planDailyUsed?: number;
  planMonthlyLimit?: number | 'unlimited';
  planMonthlyUsed?: number;
  freeDailyLimit?: number | 'unlimited';
  freeDailyUsed?: number;
  freeMonthlyLimit?: number | 'unlimited';
  freeMonthlyUsed?: number;
  creditsBalance?: number;
  upscaleBalance?: number;
  planUpscaleMonthlyLimit?: number | 'unlimited';
  planUpscaleMonthlyUsed?: number;
};

type ImageQuotaBadge =
  | { kind: 'monthly-remaining'; value: number }
  | { kind: 'unlimited' }
  | { kind: 'daily-remaining'; value: number }
  | { kind: 'credits'; value: number }
  | { kind: 'none' };

type UpscaleQuotaBadge =
  | { kind: 'monthly-remaining'; value: number }
  | { kind: 'unlimited' }
  | { kind: 'credits'; value: number }
  | { kind: 'none' };

function getImageBadge(quota: Quota): ImageQuotaBadge {
  const hasPaidPlan =
    quota.planDailyLimit !== undefined || quota.planMonthlyLimit !== undefined;
  const isPaidTier =
    hasPaidPlan || (quota.tier !== 'free' && quota.tier !== undefined);
  const monthlyUsed = isPaidTier
    ? quota.planMonthlyUsed ?? 0
    : quota.freeMonthlyUsed ?? 0;
  const monthlyLimit = isPaidTier ? quota.planMonthlyLimit : quota.freeMonthlyLimit;
  const dailyUsed = isPaidTier
    ? quota.planDailyUsed ?? 0
    : quota.freeDailyUsed ?? 0;
  const dailyLimit = isPaidTier ? quota.planDailyLimit : quota.freeDailyLimit;
  const creditsBalance = quota.creditsBalance ?? 0;
  const hasSubscriptionQuota =
    quota.planMonthlyLimit !== undefined || quota.planDailyLimit !== undefined;

  if (hasSubscriptionQuota && monthlyLimit === 'unlimited') return { kind: 'unlimited' };
  if (hasSubscriptionQuota && typeof monthlyLimit === 'number') {
    return { kind: 'monthly-remaining', value: Math.max(0, monthlyLimit - monthlyUsed) };
  }
  if (!hasSubscriptionQuota && dailyLimit !== 'unlimited' && typeof dailyLimit === 'number') {
    return { kind: 'daily-remaining', value: Math.max(0, dailyLimit - dailyUsed) };
  }
  if (creditsBalance > 0) return { kind: 'credits', value: creditsBalance };
  return { kind: 'none' };
}

function getUpscaleBadge(quota: Quota): UpscaleQuotaBadge {
  const hasUpscalePlanQuota = quota.planUpscaleMonthlyLimit !== undefined;
  const upscaleMonthlyUsed = quota.planUpscaleMonthlyUsed ?? 0;
  const upscaleMonthlyLimit = quota.planUpscaleMonthlyLimit;
  const upscaleBalance = quota.upscaleBalance ?? 0;

  if (hasUpscalePlanQuota && upscaleMonthlyLimit === 'unlimited') return { kind: 'unlimited' };
  if (hasUpscalePlanQuota && typeof upscaleMonthlyLimit === 'number') {
    return { kind: 'monthly-remaining', value: Math.max(0, upscaleMonthlyLimit - upscaleMonthlyUsed) };
  }
  if (!hasUpscalePlanQuota && upscaleBalance > 0) return { kind: 'credits', value: upscaleBalance };
  return { kind: 'none' };
}

const baseChipStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '2px solid var(--cocoa-900)',
  boxShadow: '2px 2px 0 0 var(--cocoa-900)',
};

function NeoChip({
  href,
  title,
  dotColor,
  icon,
  num,
  label,
  compact,
}: {
  href?: string;
  title: string;
  dotColor: 'terra' | 'sage' | 'butter';
  icon: React.ReactNode;
  num: string | number;
  label: string;
  compact: boolean;
}) {
  const dotBg =
    dotColor === 'terra'
      ? 'var(--terracotta-500)'
      : dotColor === 'sage'
        ? 'var(--sage-500)'
        : 'var(--butter-500)';

  const inner = (
    <span
      className="inline-flex items-center gap-2 px-3.5 py-1.5 font-bold text-sm text-foreground"
      style={baseChipStyle}
      title={title}
    >
      <span
        className="w-3.5 h-3.5 rounded-full shrink-0 hidden sm:inline-block"
        style={{ background: dotBg }}
        aria-hidden="true"
      />
      <span className="sm:hidden">{icon}</span>
      <span className="font-mono text-sm tabular-nums">{num}</span>
      {!compact && (
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold hidden lg:inline">
          {label}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link to={href} prefetch="viewport" className="cursor-pointer touch-manipulation">
        {inner}
      </Link>
    );
  }
  return inner;
}

function ImageBadge({ badge, compact }: { badge: ImageQuotaBadge; compact: boolean }) {
  switch (badge.kind) {
    case 'monthly-remaining':
      return (
        <NeoChip
          href="/pricing"
          title={`${badge.value} image generations remaining this month`}
          dotColor="terra"
          icon={<ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          num={badge.value}
          label="images"
          compact={compact}
        />
      );
    case 'unlimited':
      return (
        <NeoChip
          title="Unlimited image generations"
          dotColor="terra"
          icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
          num="∞"
          label="images"
          compact={compact}
        />
      );
    case 'daily-remaining':
      return (
        <NeoChip
          title={`${badge.value} generations remaining today`}
          dotColor="terra"
          icon={<ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          num={badge.value}
          label="today"
          compact={compact}
        />
      );
    case 'credits':
      return (
        <NeoChip
          href="/pricing"
          title={`${badge.value} image generation credits remaining`}
          dotColor="terra"
          icon={<ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          num={badge.value}
          label="credits"
          compact={compact}
        />
      );
    default:
      return null;
  }
}

function UpscaleBadge({ badge, compact }: { badge: UpscaleQuotaBadge; compact: boolean }) {
  switch (badge.kind) {
    case 'monthly-remaining':
      return (
        <NeoChip
          href="/pricing"
          title={`${badge.value} upscales remaining this month`}
          dotColor="sage"
          icon={<Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />}
          num={badge.value}
          label="upscales"
          compact={compact}
        />
      );
    case 'unlimited':
      return (
        <NeoChip
          title="Unlimited upscales"
          dotColor="sage"
          icon={<Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />}
          num="∞"
          label="upscales"
          compact={compact}
        />
      );
    case 'credits':
      return (
        <NeoChip
          href="/pricing"
          title={`${badge.value} upscale credits remaining`}
          dotColor="sage"
          icon={<Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />}
          num={badge.value}
          label="upscale"
          compact={compact}
        />
      );
    default:
      return null;
  }
}

export function HeaderQuotaBadges({
  quota,
  layout,
}: {
  quota: Quota;
  layout: 'desktop' | 'mobile';
}) {
  const imageBadge = getImageBadge(quota);
  const upscaleBadge = getUpscaleBadge(quota);
  const compact = layout === 'mobile';

  return (
    <>
      <ImageBadge badge={imageBadge} compact={compact} />
      <UpscaleBadge badge={upscaleBadge} compact={compact} />
    </>
  );
}
