'use client';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Skeleton } from '~/components/ui/skeleton';
import { Link } from 'react-router';
import { Palette, Sparkles, Star } from 'lucide-react';

/**
 * Compact relative-date formatter ("2 days ago", "last week", "3 weeks ago").
 * Inlined here so this round doesn't depend on any util that may or may not
 * exist in the host repo. Replace with the existing `formatRelativeDate` from
 * `~/utils/job-utils` if/when it lands there.
 */
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

/**
 * The dashboard "Recent creations" surface. A 4-column masonry-style grid where
 * the first tile spans 2 rows (the "feature" tile) — all click through to the
 * /dashboard/creations peek drawer for actions. No inline upscale or background
 * removal — those live exclusively on the Creations page now.
 */
export function RecentCreations() {
  const recentJobsQuery = useQuery(api.jobs.listMine, { limit: 8 });
  const recentJobs = recentJobsQuery?.jobs;

  // Loading skeleton
  if (recentJobsQuery === undefined || recentJobs === undefined) {
    return (
      <section>
        <div className="flex items-end justify-between gap-6 mb-5">
          <div>
            <h2 className="font-display italic font-medium text-3xl leading-none tracking-[-0.02em] text-foreground">
              Recent creations
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Your latest artworks</p>
          </div>
        </div>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gridTemplateRows: '220px 220px',
          }}
        >
          <Skeleton className="row-span-2 border-2 border-foreground" />
          <Skeleton className="border-2 border-foreground" />
          <Skeleton className="border-2 border-foreground" />
          <Skeleton className="border-2 border-foreground" />
          <Skeleton className="border-2 border-foreground" />
          <Skeleton className="border-2 border-foreground" />
          <Skeleton className="border-2 border-foreground" />
        </div>
      </section>
    );
  }

  // Empty state
  if (recentJobs.length === 0) {
    return (
      <section>
        <div className="flex items-end justify-between gap-6 mb-5">
          <div>
            <h2 className="font-display italic font-medium text-3xl leading-none tracking-[-0.02em] text-foreground">
              Recent creations
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest artworks will land here.
            </p>
          </div>
        </div>
        <div
          className="border-[2.5px] border-foreground bg-card p-12 text-center"
          style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
        >
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: 'var(--cream-200)' }}
          >
            <Palette className="h-6 w-6" style={{ color: 'var(--terracotta-500)' }} aria-hidden="true" />
          </div>
          <h3 className="font-display italic font-medium text-2xl text-foreground mb-1.5">
            No creations yet.
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Start by generating your first piece — it'll show up here.
          </p>
          <Link
            to="/best-ai-art-generator"
            prefetch="intent"
            className="inline-flex items-center gap-2 px-5 py-3 font-bold text-sm text-white border-[2.5px] border-foreground"
            style={{
              background: 'var(--terracotta-500)',
              boxShadow: '4px 4px 0 0 var(--cocoa-900)',
            }}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Make your first piece
          </Link>
        </div>
      </section>
    );
  }

  // 4-column masonry — feature tile spans 2 rows on the left, then 6 squares on the right.
  // We display up to 7 tiles (1 feature + 6 squares = 7).
  const display = recentJobs.slice(0, 7);
  const totalCount = recentJobs.length;

  return (
    <section>
      <div className="flex items-end justify-between gap-6 mb-5">
        <div>
          <h2 className="font-display italic font-medium text-3xl leading-none tracking-[-0.02em] text-foreground">
            Recent creations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Last {display.length}. Tap any to download, upscale, or remove background.
          </p>
        </div>
        <Link
          to="/dashboard/creations"
          prefetch="intent"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-foreground bg-card border-2 border-foreground hover:bg-muted transition-colors"
          style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
        >
          View all {totalCount} →
        </Link>
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gridAutoRows: '220px',
        }}
      >
        {display.map((job, idx) => {
          const imgUrl = job.signedResultUrl ?? job.resultUrl ?? '';
          const isFeature = idx === 0;
          return (
            <Link
              key={job._id as string}
              to={`/dashboard/creations?selected=${job._id}`}
              prefetch="intent"
              className={
                'relative overflow-hidden border-[2.5px] border-foreground transition-transform bg-cover bg-center group hover:-translate-x-0.5 hover:-translate-y-0.5 ' +
                (isFeature ? 'row-span-2' : '')
              }
              style={{
                backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
                backgroundColor: 'var(--cream-200)',
                boxShadow: '4px 4px 0 0 var(--cocoa-900)',
              }}
              aria-label={`View ${job.style} creation`}
            >
              {isFeature && (
                <div
                  className="absolute top-2.5 right-2.5 h-7 w-7 flex items-center justify-center text-foreground border-2 border-foreground"
                  style={{ background: 'var(--butter-500)' }}
                  aria-hidden="true"
                >
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
              )}

              <div
                className="absolute bottom-0 left-0 right-0 px-3.5 pt-7 pb-2.5 text-white"
                style={{
                  background:
                    'linear-gradient(to top, rgba(58,46,38,0.92) 0%, rgba(58,46,38,0.55) 65%, transparent 100%)',
                }}
              >
                <div
                  className={
                    'font-display italic font-medium leading-tight ' +
                    (isFeature ? 'text-xl mb-0.5' : 'text-sm mb-0.5')
                  }
                >
                  {job.style ?? 'Untitled'}
                </div>
                <div
                  className={
                    'uppercase tracking-wider font-semibold ' +
                    (isFeature ? 'text-xs' : 'text-[10px]')
                  }
                  style={{ color: 'var(--butter-500)' }}
                >
                  {formatRelativeDate(job._creationTime)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
