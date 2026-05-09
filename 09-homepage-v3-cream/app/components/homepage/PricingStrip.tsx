'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@clerk/react-router';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { api } from '../../../convex/_generated/api';
import type { Doc } from '../../../convex/_generated/dataModel';
import { type PlanMetadata } from '~/utils/planFeatures';
import { PlanCard } from '~/components/pricing';

type PlanPrice = {
  id: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year' | null;
};

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  isRecurring: boolean;
  prices: PlanPrice[];
  metadata?: PlanMetadata;
};

type PlansResponse = {
  items: SubscriptionPlan[];
  pagination?: unknown;
};

const hasPrices = (
  plan: SubscriptionPlan,
): plan is SubscriptionPlan & { prices: [PlanPrice, ...PlanPrice[]] } =>
  Array.isArray(plan.prices) && plan.prices.length > 0;

const isPlansResponse = (value: unknown): value is PlansResponse => {
  if (!value || typeof value !== 'object') return false;
  const maybe = value as { items?: unknown };
  return Array.isArray(maybe.items);
};

/**
 * Compact pricing strip on the homepage.
 *
 * Reuses the `<PlanCard />` primitive from Round 06 so visual treatment matches
 * `/pricing`. Three subscription tiers, lowest first, "Most chosen" pill on
 * Pro Pack (matches the live site).
 *
 * For the full plan compare + feature comparison table + FAQ, links to /pricing.
 */
export default function PricingStrip({
  loaderData,
}: {
  loaderData?: { isSignedIn?: boolean; hasAccess?: boolean; plans?: PlansResponse | null };
}) {
  const { isSignedIn } = useAuth();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlansResponse | null>(loaderData?.plans ?? null);

  const getPlans = useAction(api.subscriptions.getAvailablePlans);
  const subscriptionRecord = useQuery(api.subscriptions.fetchUserSubscription);
  const userSubscription: Doc<'subscriptions'> | null = subscriptionRecord ?? null;
  const createCheckout = useAction(api.subscriptions.createCheckoutSession);
  const createPortalUrl = useAction(api.subscriptions.createCustomerPortalUrl);
  const upsertUser = useMutation(api.users.upsertUser);

  // Hydrate from loader data, or fetch if not present (legacy fallback)
  useEffect(() => {
    if (plans !== null) return;
    let cancelled = false;
    void (async () => {
      try {
        const result = await getPlans();
        if (!cancelled && isPlansResponse(result)) setPlans(result);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Pricing strip failed to load plans', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plans, getPlans]);

  const subscriptionPlans = useMemo(
    () =>
      (plans?.items ?? [])
        .filter(hasPrices)
        .filter((p) => p.isRecurring)
        .sort((a, b) => a.prices[0].amount - b.prices[0].amount),
    [plans],
  );

  const handlePurchase = async (priceId: string) => {
    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect=/pricing`;
      return;
    }
    setLoadingPriceId(priceId);
    try {
      await upsertUser();
      if (
        userSubscription?.status === 'active' &&
        userSubscription?.customerId
      ) {
        const portal = await createPortalUrl({
          customerId: userSubscription.customerId,
        });
        window.open(portal.url, '_blank');
        setLoadingPriceId(null);
        return;
      }
      const checkoutUrl = await createCheckout({ priceId });
      window.location.href = checkoutUrl;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Pricing strip checkout failed', err);
      setLoadingPriceId(null);
    }
  };

  // Heuristic: middle tier gets the "Most chosen" recommendation
  const recommendedId = useMemo(() => {
    if (subscriptionPlans.length === 0) return null;
    return subscriptionPlans[Math.floor(subscriptionPlans.length / 2)].id;
  }, [subscriptionPlans]);

  const accentForName = (name: string): string | undefined => {
    const lower = name.toLowerCase();
    if (lower.includes('artisan')) return 'Pro';
    if (lower.includes('pro pack')) return 'Pack';
    if (lower.includes('starter')) return 'Pack';
    return undefined;
  };

  return (
    <section
      id="pricing"
      className="theme-cream relative bg-[color:var(--cream-50)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-3 py-1.5"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            Three plans · cancel anytime
          </span>
          <h2
            className="font-display italic font-medium leading-none tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-3"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
            }}
          >
            Pick a plan.{' '}
            <em style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>
              Start creating.
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[color:var(--cocoa-700)] max-w-xl mx-auto leading-relaxed">
            Choose the monthly image limit that fits your creative flow.
          </p>
        </div>

        {subscriptionPlans.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-[color:var(--cocoa-700)] py-12">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-display italic">Loading plans…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {subscriptionPlans.map((plan) => {
              const price = plan.prices[0];
              const isCurrent =
                userSubscription?.status === 'active' &&
                plan.prices.some((p) => p.id === userSubscription.polarPriceId);
              const isRecommended = recommendedId === plan.id && !isCurrent;
              return (
                <PlanCard
                  key={plan.id}
                  id={price.id}
                  name={plan.name}
                  nameAccent={accentForName(plan.name)}
                  tagline={plan.description ?? ''}
                  amountInCents={price.amount}
                  interval={price.interval}
                  metadata={plan.metadata}
                  isCurrentPlan={isCurrent}
                  isRecommended={isRecommended}
                  isLoading={loadingPriceId === price.id}
                  hasActiveSubscription={userSubscription?.status === 'active'}
                  onSelect={() => void handlePurchase(price.id)}
                />
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/pricing"
            prefetch="viewport"
            className="inline-flex items-center justify-center gap-2 bg-card text-[color:var(--cocoa-900)] border-2 border-[color:var(--cocoa-900)] px-5 py-3 text-sm font-bold no-underline transition-transform active:translate-x-1 active:translate-y-1"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            See all plan details + FAQ →
          </Link>
        </div>
      </div>
    </section>
  );
}
