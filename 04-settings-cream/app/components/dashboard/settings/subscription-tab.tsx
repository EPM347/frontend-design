import { PlanHeroCard } from './plan-hero-card';
import { BillingCard } from './billing-card';
import { UsageMeters } from './usage-meters';
import { ComparePlans, type PlanDef } from './compare-plans';
import { useNavigate } from 'react-router';

interface Quota {
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
  // Below fields are forward-looking; quota query may not return them yet.
  planBgRemovalMonthlyLimit?: number | 'unlimited';
  planBgRemovalMonthlyUsed?: number;
  rolloverCredits?: number;
  rolloverDaysLeft?: number;
  /** ISO date string for next renewal */
  nextRenewalDate?: string;
  /** Cycle in days, used for "X days left" copy */
  cycleDays?: number;
  /** Billing card fields — may live elsewhere (Polar) but we render them here if present */
  nextChargeAmount?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardExpiry?: string;
  billingEmail?: string;
  invoiceCount?: number;
}

interface SubscriptionTabProps {
  quota: Quota | undefined;
}

const TIER_CONFIG: Record<string, {
  name: string;
  nameAccent?: string;
  price: string;
  cycle: string;
  description: string;
}> = {
  starter: {
    name: 'Starter',
    price: '6.99',
    cycle: '/ month',
    description: 'Try it once a week, no pressure.',
  },
  pro: {
    name: 'Pro Pack.',
    nameAccent: 'Pack.',
    price: '9.99',
    cycle: '/ month',
    description: 'Make art most days. The sweet spot.',
  },
  studio: {
    name: 'Studio',
    price: '19.99',
    cycle: '/ month',
    description: 'For the people whose phone storage is full of WIPs.',
  },
};

const STATIC_PLANS: PlanDef[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Try it once a week, no pressure.',
    price: '6.99',
    cycleSuffix: '/ mo',
    features: [
      '50 images / month',
      '30 upscales · up to 2×',
      '20 background removals',
      '10 free styles',
    ],
    cta: { label: 'Downgrade', href: '/pricing?plan=starter' },
  },
  {
    id: 'pro',
    name: 'Pro Pack.',
    nameAccent: 'Pack.',
    tagline: 'Make art most days. The sweet spot.',
    price: '9.99',
    cycleSuffix: '/ mo',
    features: [
      '200 images / month',
      '150 upscales · up to 4×',
      '80 background removals',
      'All 12 styles + early access',
      'Rollover up to 2× cap',
    ],
    cta: { label: 'Current plan', href: '#' },
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: "For the people whose phone storage is full of WIPs.",
    price: '19.99',
    cycleSuffix: '/ mo',
    features: [
      'Unlimited images',
      'Unlimited upscales · up to 8×',
      'Unlimited background removals',
      'All styles + commercial license',
      'Priority queue · 2× faster',
    ],
    cta: { label: 'Upgrade →', href: '/pricing?plan=studio' },
    ctaVariant: 'primary',
  },
];

function formatRenewalDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRenewalShort(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function SubscriptionTab({ quota }: SubscriptionTabProps) {
  const navigate = useNavigate();

  if (!quota) {
    return (
      <div className="text-sm text-muted-foreground italic">Loading your plan…</div>
    );
  }

  const tier = (quota.tier ?? 'free').toLowerCase();
  const isPaid = tier !== 'free' && tier !== 'starter';
  const isPro = tier === 'pro' || tier === 'pro_pack' || tier === 'pro-pack';
  const isStudio = tier === 'studio';

  // Resolve a friendly display name for the current tier
  const currentKey = isStudio
    ? 'studio'
    : isPro
      ? 'pro'
      : tier === 'starter'
        ? 'starter'
        : 'starter'; // free → show like starter for the hero card; tweak to suit
  const currentCfg = TIER_CONFIG[currentKey];

  const monthlyUsed = isPaid
    ? quota.planMonthlyUsed ?? 0
    : quota.freeMonthlyUsed ?? 0;
  const monthlyLimit = isPaid ? quota.planMonthlyLimit : quota.freeMonthlyLimit;

  const upscaleUsed = quota.planUpscaleMonthlyUsed ?? 0;
  const upscaleLimit = quota.planUpscaleMonthlyLimit ?? quota.upscaleBalance ?? 0;

  // Build the meters list
  const meters: React.ComponentProps<typeof UsageMeters>['meters'] = [
    {
      color: 'images',
      label: 'Images',
      used: monthlyUsed,
      limit: monthlyLimit ?? 0,
      meta:
        monthlyLimit === 'unlimited'
          ? 'Unlimited this cycle'
          : typeof monthlyLimit === 'number'
            ? `${Math.max(0, monthlyLimit - monthlyUsed)} left this cycle`
            : `${quota.creditsBalance ?? 0} credits available`,
    },
    {
      color: 'upscales',
      label: 'Upscales',
      used: upscaleUsed,
      limit:
        typeof upscaleLimit === 'number' && upscaleLimit > 0
          ? upscaleLimit
          : upscaleLimit === 'unlimited'
            ? 'unlimited'
            : 0,
      meta:
        upscaleLimit === 'unlimited'
          ? 'Unlimited · up to 8×'
          : `${Math.max(0, (upscaleLimit as number) - upscaleUsed)} left · ${
              isStudio ? '8×' : isPro ? '4×' : '2×'
            } upscaling included`,
    },
    {
      color: 'bgremoval',
      label: 'No-bg',
      used: quota.planBgRemovalMonthlyUsed ?? 0,
      limit: quota.planBgRemovalMonthlyLimit ?? (isStudio ? 'unlimited' : isPro ? 80 : 20),
      meta: 'transparent PNG',
    },
    {
      color: 'rollover',
      label: 'Rollover',
      used: quota.rolloverCredits ?? 0,
      limit:
        typeof monthlyLimit === 'number' ? Math.floor(monthlyLimit) : 100,
      meta:
        typeof quota.rolloverDaysLeft === 'number'
          ? `From last cycle · ${quota.rolloverDaysLeft} days left`
          : 'From last cycle',
    },
  ];

  // Mark the current plan in the compare grid + highlight a recommended next step
  const plansForCompare: PlanDef[] = STATIC_PLANS.map((p) => ({
    ...p,
    current: p.id === currentKey,
    recommended: !isStudio && p.id === 'studio',
    cta:
      p.id === currentKey
        ? { label: 'Current plan', href: '#' }
        : p.cta,
  }));

  return (
    <div className="flex flex-col gap-7 sm:gap-9">

      {/* Plan hero + billing */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <PlanHeroCard
          planName={currentCfg.name}
          planNameAccent={currentCfg.nameAccent}
          price={currentCfg.price}
          cycleSuffix={currentCfg.cycle}
          description={
            <>
              Renews{' '}
              <strong className="font-display italic font-medium text-foreground">
                {formatRenewalDate(quota.nextRenewalDate)}
              </strong>
              {' · '}
              {monthlyLimit === 'unlimited'
                ? 'Unlimited'
                : typeof monthlyLimit === 'number'
                  ? `${monthlyLimit} images`
                  : '—'}
              {typeof upscaleLimit === 'number' && upscaleLimit > 0 && (
                <>{`, ${upscaleLimit} upscales`}</>
              )}
              {' every cycle. Anything left rolls over up to '}
              <strong className="font-display italic font-medium text-foreground">
                2× your monthly cap
              </strong>
              .
            </>
          }
          canUpgrade={!isStudio}
          upgradeTo={
            !isStudio
              ? {
                  label: isPro ? 'Upgrade to Studio' : 'Upgrade to Pro Pack',
                  href: `/pricing?plan=${isPro ? 'studio' : 'pro'}`,
                }
              : undefined
          }
          canSwitchToAnnual={isPaid}
          switchAnnual={
            isPaid
              ? {
                  label: 'Switch to annual (save $24)',
                  href: '/pricing?cycle=annual',
                }
              : undefined
          }
          onCancel={
            isPaid
              ? () => navigate('/pricing?action=cancel')
              : undefined
          }
        />

        <BillingCard
          nextChargeAmount={quota.nextChargeAmount}
          nextChargeDate={formatRenewalShort(quota.nextRenewalDate)}
          cardBrand={quota.cardBrand}
          cardLast4={quota.cardLast4}
          cardExpiry={quota.cardExpiry}
          billingEmail={quota.billingEmail}
          invoiceCount={quota.invoiceCount}
          onUpdatePayment={() => navigate('/pricing?action=update-payment')}
        />
      </div>

      {/* Usage meters */}
      <UsageMeters
        resetsLabel={formatRenewalDate(quota.nextRenewalDate)}
        daysLeft={quota.cycleDays}
        meters={meters}
      />

      {/* Compare plans */}
      <ComparePlans plans={plansForCompare} />
    </div>
  );
}
