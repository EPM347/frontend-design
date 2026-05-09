'use client';
import { useAuth } from '@clerk/react-router';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Loader2, ArrowLeft } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { api } from '../../convex/_generated/api';
import type { Doc } from '../../convex/_generated/dataModel';
import { type PlanMetadata } from '~/utils/planFeatures';
import {
  PlanCard,
  CreditPackCard,
  FeatureComparison,
  PricingFAQ,
} from '~/components/pricing';

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
  const maybePlans = value as { items?: unknown };
  if (!Array.isArray(maybePlans.items)) return false;
  return maybePlans.items.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const plan = item as SubscriptionPlan;
    return (
      typeof plan.id === 'string' &&
      typeof plan.name === 'string' &&
      Array.isArray(plan.prices) &&
      (plan.metadata === undefined || typeof plan.metadata === 'object')
    );
  });
};

/**
 * Pricing page — cream + neo redesign.
 *
 * Same Polar data flow as the previous implementation. Differences:
 * - Visual treatment lifts the chunky-shadow plan card from Round 04
 * - Adds a 3-up plan compare with "Current" + "Best for you" pills
 * - Adds a feature comparison table (NEW)
 * - Adds an FAQ accordion with brand voice copy (NEW)
 * - Same Polar checkout / portal flow on click
 */
export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlansResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPlans = useAction(api.subscriptions.getAvailablePlans);
  const subscriptionRecord = useQuery(api.subscriptions.fetchUserSubscription);
  const userSubscription: Doc<'subscriptions'> | null = subscriptionRecord ?? null;
  const createCheckout = useAction(api.subscriptions.createCheckoutSession);
  const createPortalUrl = useAction(api.subscriptions.createCustomerPortalUrl);
  const upsertUser = useMutation(api.users.upsertUser);

  // Upsert the user the moment the page learns they're signed in
  React.useEffect(() => {
    if (isSignedIn) {
      upsertUser().catch(console.error);
    }
  }, [isSignedIn, upsertUser]);

  // Pull plans from Polar via the existing convex action
  React.useEffect(() => {
    const loadPlans = async () => {
      try {
        const result = await getPlans();
        if (!isPlansResponse(result)) {
          throw new Error('Received malformed pricing data from server');
        }
        setPlans(result);
      } catch (e) {
        console.error('Failed to load plans:', e);
        const errorMessage =
          e instanceof Error
            ? e.message
            : 'Failed to load pricing plans. Please check your Polar configuration.';
        setError(errorMessage);
      }
    };
    void loadPlans();
  }, [getPlans]);

  const handlePurchase = async (priceId: string, isRecurring: boolean) => {
    if (!isSignedIn) {
      window.location.href = '/sign-in?redirect=/pricing';
      return;
    }
    setLoadingPriceId(priceId);
    setError(null);
    try {
      await upsertUser();
      if (
        isRecurring &&
        userSubscription?.status === 'active' &&
        userSubscription?.customerId
      ) {
        const portalResult = await createPortalUrl({
          customerId: userSubscription.customerId,
        });
        window.open(portalResult.url, '_blank');
        setLoadingPriceId(null);
        return;
      }
      const checkoutUrl = await createCheckout({ priceId });
      window.location.href = checkoutUrl;
    } catch (e) {
      console.error('Failed to process subscription action:', e);
      const errorMessage =
        e instanceof Error
          ? e.message.includes('Polar is not configured')
            ? 'Payment system is not configured. Please contact support.'
            : e.message
          : 'Failed to process request. Please try again.';
      setError(errorMessage);
      setLoadingPriceId(null);
    }
  };

  const planItems = useMemo(
    () => (plans ? plans.items.filter(hasPrices) : []),
    [plans],
  );

  const subscriptionPlans = useMemo(
    () =>
      planItems
        .filter((p) => p.isRecurring)
        .sort((a, b) => a.prices[0].amount - b.prices[0].amount),
    [planItems],
  );

  const creditPacks = useMemo(
    () =>
      planItems
        .filter((p) => !p.isRecurring)
        .sort((a, b) => a.prices[0].amount - b.prices[0].amount),
    [planItems],
  );

  // Error state
  if (error && !plans) {
    return (
      <main className="theme-cream min-h-screen flex flex-col items-center justify-center px-4 bg-background">
        <div className="max-w-md text-center space-y-3">
          <div className="font-display italic font-medium text-3xl text-[color:var(--tomato-500)]">
            Pricing isn't loading.
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-card text-foreground border-2 border-foreground text-sm font-bold"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back home
          </Link>
        </div>
      </main>
    );
  }

  // Loading state
  if (!plans) {
    return (
      <main className="theme-cream min-h-screen flex flex-col items-center justify-center px-4 bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-display italic">Loading plans…</span>
        </div>
      </main>
    );
  }

  // Best-for-you logic: if not subscribed, recommend the middle subscription tier
  const recommendedPlanId = useMemo(() => {
    if (userSubscription?.status === 'active') return null;
    if (subscriptionPlans.length === 0) return null;
    return subscriptionPlans[Math.floor(subscriptionPlans.length / 2)].id;
  }, [subscriptionPlans, userSubscription]);

  // Map plan-name fragments to "accent" highlight (e.g. "Pack." in "Pro Pack.")
  // for visual rhythm in the cards. Falls back gracefully if the name doesn't match.
  const accentForName = (name: string): string | undefined => {
    const lower = name.toLowerCase();
    if (lower.includes('pack')) return 'Pack.';
    if (lower.includes('pro')) return 'Pro.';
    if (lower.includes('studio')) return 'Studio.';
    return undefined;
  };

  // Compute the comparison-table plans column-by-column from real Polar plans
  const comparisonPlans = useMemo(() => {
    return subscriptionPlans.map((plan) => ({
      id: plan.id,
      label: plan.name,
      recommended: plan.id === recommendedPlanId,
    }));
  }, [subscriptionPlans, recommendedPlanId]);

  const hasActive = userSubscription?.status === 'active';

  return (
    <main className="theme-cream min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 pb-14 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-20 h-96 w-96 rounded-full pointer-events-none opacity-[0.10]"
          style={{
            background:
              'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Back home
            </Link>
          </div>
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            ✦ Pick your pace
          </span>
          <h1 className="font-display italic font-medium text-4xl sm:text-5xl md:text-6xl leading-[0.96] tracking-[-0.025em] text-foreground mb-4">
            Simple plans.{' '}
            <em
              className="not-italic font-display italic"
              style={{ color: 'var(--terracotta-500)' }}
            >
              Honest pricing.
            </em>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Free forever for casual use. Subscribe when you're hooked. Buy a credit pack
            if you'd rather pay once.
          </p>

          {isSignedIn && hasActive && (
            <div
              className="mt-7 inline-block max-w-md px-4 py-3 bg-card border-2 border-foreground text-sm text-left"
              style={{ boxShadow: '3px 3px 0 0 var(--sage-500)' }}
            >
              <strong className="font-display italic font-medium block mb-0.5 text-foreground">
                You're already subscribed.
              </strong>
              <span className="text-muted-foreground">
                Manage your plan from{' '}
                <Link
                  to="/dashboard/settings?tab=subscription"
                  className="text-[color:var(--terracotta-500)] underline font-bold"
                >
                  Settings → Subscription
                </Link>
                .
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Subscription plans 3-up */}
      {subscriptionPlans.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-12 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
              <h2 className="font-display italic font-medium text-3xl sm:text-4xl leading-none tracking-[-0.02em] text-foreground">
                Subscribe to a plan.
              </h2>
              <p className="text-sm text-muted-foreground">
                Switch any time · prorated · cancel any time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {subscriptionPlans.map((plan) => {
                const price = plan.prices[0];
                const isCurrent =
                  userSubscription?.status === 'active' &&
                  plan.prices.some((p) => p.id === userSubscription.polarPriceId);
                const isRecommended =
                  recommendedPlanId === plan.id && !isCurrent;

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
                    hasActiveSubscription={hasActive}
                    onSelect={() => void handlePurchase(price.id, true)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Feature comparison */}
      {subscriptionPlans.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-12 mb-20">
          <FeatureComparison plans={comparisonPlans} />
        </section>
      )}

      {/* Credit packs */}
      {creditPacks.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-12 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
              <h2 className="font-display italic font-medium text-3xl sm:text-4xl leading-none tracking-[-0.02em] text-foreground">
                Or buy credits, no commitment.
              </h2>
              <p className="text-sm text-muted-foreground">
                Pay once · credits never expire
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {creditPacks.map((pack, idx) => {
                const price = pack.prices[0];
                const credits =
                  typeof pack.metadata?.credits === 'number'
                    ? pack.metadata.credits
                    : undefined;
                // Mark the middle pack as best-value heuristically
                const isBestValue =
                  creditPacks.length >= 3
                    ? idx === Math.floor(creditPacks.length / 2)
                    : false;
                return (
                  <CreditPackCard
                    key={pack.id}
                    name={pack.name}
                    tagline={pack.description ?? undefined}
                    amountInCents={price.amount}
                    credits={credits}
                    isBestValue={isBestValue}
                    isLoading={loadingPriceId === price.id}
                    onSelect={() => void handlePurchase(price.id, false)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="px-4 sm:px-6 lg:px-12 mb-20">
        <PricingFAQ />
      </section>

      {/* Final conversion CTA */}
      <section className="px-4 sm:px-6 lg:px-12">
        <div
          className="relative max-w-4xl mx-auto bg-card border-[3.5px] border-foreground p-8 sm:p-12 text-center overflow-hidden"
          style={{ boxShadow: '8px 8px 0 0 var(--terracotta-500)' }}
        >
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 h-48 w-48 rounded-full pointer-events-none opacity-[0.18]"
            style={{
              background:
                'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
            }}
          />
          <div className="relative">
            <span
              className="inline-block text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
              style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)', transform: 'rotate(-2deg)' }}
            >
              Try it · no card
            </span>
            <h2 className="font-display italic font-medium text-3xl sm:text-4xl leading-tight tracking-[-0.02em] text-foreground mb-3 max-w-xl mx-auto">
              Drop a photo first,{' '}
              <em
                className="not-italic font-display italic"
                style={{ color: 'var(--terracotta-500)' }}
              >
                pay if you love it.
              </em>
            </h2>
            <p className="text-base text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              Five free generations a day, every day. Sign up takes 10 seconds.
            </p>
            <Link
              to="/best-ai-art-generator"
              className="inline-flex items-center gap-2.5 bg-[color:var(--terracotta-500)] text-white border-[3px] border-foreground px-6 py-3.5 text-base font-bold no-underline transition-transform active:translate-x-1.5 active:translate-y-1.5"
              style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
            >
              <span>✦</span>
              <span>Try the generator now</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
