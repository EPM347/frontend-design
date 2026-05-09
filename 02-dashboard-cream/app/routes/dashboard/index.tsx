'use client';
import { useUser } from '@clerk/react-router';
import { useQuery } from 'convex/react';
import { Link } from 'react-router';
import { Flame } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { DashboardPageHeader } from '~/components/dashboard/dashboard-page-header';
import { HeroMakeArtCard } from '~/components/dashboard/hero-make-art-card';
import { RecentCreations } from '~/components/dashboard/recent-creations';
import { TrySomethingNew } from '~/components/dashboard/try-something-new';
import { UsageStrip } from '~/components/dashboard/usage-strip';

// Inlined relative-date formatter; see recent-creations.tsx for the same helper.
function formatRelativeDate(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffDay < 14) return 'last week';
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} weeks ago`;
  if (diffDay < 60) return 'last month';
  return `${Math.floor(diffDay / 30)} months ago`;
}

function getGreeting(hour: number): string {
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardIndexPage() {
  const { user } = useUser();
  const firstName = user?.firstName?.trim();
  const greeting = getGreeting(new Date().getHours());

  // Pull last job + remaining quota for the greeting context line
  const recentJobsQuery = useQuery(api.jobs.listMine, { limit: 1 });
  const lastJob = recentJobsQuery?.jobs?.[0];
  const quota = useQuery(api.usage.getQuota);

  const hasPaidPlan =
    quota?.planMonthlyLimit !== undefined || quota?.planDailyLimit !== undefined;
  const isPaidTier =
    hasPaidPlan || (quota?.tier !== 'free' && quota?.tier !== undefined);
  const monthlyUsed = isPaidTier
    ? quota?.planMonthlyUsed ?? 0
    : quota?.freeMonthlyUsed ?? 0;
  const monthlyLimit = isPaidTier ? quota?.planMonthlyLimit : quota?.freeMonthlyLimit;
  const remaining =
    typeof monthlyLimit === 'number'
      ? Math.max(0, monthlyLimit - monthlyUsed)
      : null;

  // Greeting title with the boxed-name treatment on the user's first name
  const titleText = firstName ? `${greeting}, ${firstName}.` : greeting;
  const boxedName = firstName ? `${firstName}.` : undefined;

  // Greeting context: "Last made: Studio Ghibli, 2 days ago. 153 credits left this cycle."
  const contextParts: string[] = [];
  if (lastJob?.style) {
    contextParts.push(
      `Last made: ${lastJob.style}, ${formatRelativeDate(lastJob._creationTime)}.`,
    );
  }
  if (remaining !== null) {
    contextParts.push(`${remaining} credits left this cycle.`);
  } else if (monthlyLimit === 'unlimited') {
    contextParts.push(`Unlimited generations on your plan.`);
  }
  const contextLine = contextParts.join(' ');

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 sm:gap-8 px-4 lg:px-9 py-6 sm:py-9 pb-16">

        {/* Greeting row */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-end sm:justify-between gap-5">
          <DashboardPageHeader
            title={titleText}
            description={contextLine || undefined}
            boxedNamePart={boxedName}
            display
          />
          {/* Streak badge — placeholder count; wire to a real streak query later. */}
          <div
            className="font-display italic font-medium text-sm py-2 px-3.5 self-start sm:self-end shrink-0 inline-flex items-center gap-1.5 border-2 border-foreground"
            style={{
              background: 'var(--butter-500)',
              boxShadow: '3px 3px 0 0 var(--cocoa-900)',
              transform: 'rotate(2deg)',
              color: 'var(--cocoa-900)',
            }}
          >
            <Flame className="h-3.5 w-3.5" />
            {/* TODO: compute real streak from jobs */}
            6 days in a row.
          </div>
        </div>

        {/* Hero — make art */}
        <HeroMakeArtCard />

        {/* Recent creations masonry */}
        <RecentCreations />

        {/* Try something new */}
        <TrySomethingNew />

        {/* Quiet usage strip */}
        <UsageStrip />
      </div>
    </div>
  );
}
