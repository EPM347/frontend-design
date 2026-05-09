'use client';
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useSearchParams } from 'react-router';
import { api } from '../../../convex/_generated/api';
import { DashboardPageHeader } from '~/components/dashboard/dashboard-page-header';
import {
  CreationsFilters,
  CreationsGrid,
  CreationsList,
  CreationDetailsPeek,
  CreationsEmptyState,
  type StatusFilter,
  type SortOption,
  type ViewMode,
} from '~/components/dashboard/creations';
import { Button } from '~/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Link } from 'react-router';

const PAGE_LIMIT = 24;

export default function CreationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [view, setView] = useState<ViewMode>('grid');

  // The selected creation drives the inline peek drawer.
  // Initialized from `?selected=<id>` so links from the dashboard land directly
  // on the right tile + open the peek.
  const initialSelected = searchParams.get('selected') ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected);

  const handleSelect = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id) next.set('selected', id);
          else next.delete('selected');
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Server query — pass current filter state. The convex `jobs.listMine` query
  // is expected to accept these args; if your version uses different arg names
  // adjust here.
  const queryArgs = useMemo(
    () => ({
      limit: PAGE_LIMIT,
      // pass `undefined` instead of "all" so the server doesn't filter.
      status: status === 'all' ? undefined : status,
      search: search.trim() || undefined,
      sort,
    }),
    [status, search, sort],
  );

  const jobsQuery = useQuery(api.jobs.listMine, queryArgs);
  const allJobs = jobsQuery?.jobs ?? [];

  // Counts for filter pills — we want stable counts that don't change as the
  // status filter changes, so we run an "all" query alongside.
  const countsQuery = useQuery(api.jobs.listMine, { limit: 500 });
  const allForCounts = countsQuery?.jobs ?? [];
  const counts = useMemo(() => {
    const c = { all: 0, ready: 0, processing: 0, failed: 0 };
    for (const j of allForCounts) {
      c.all += 1;
      if (j.status === 'completed' || j.status === 'ready') c.ready += 1;
      else if (j.status === 'processing' || j.status === 'pending') c.processing += 1;
      else if (j.status === 'failed') c.failed += 1;
    }
    return c;
  }, [allForCounts]);

  const isLoading = jobsQuery === undefined;
  const isEmpty = !isLoading && allJobs.length === 0;

  // Mutations
  const deleteJob = useMutation(api.jobs.deleteJob);
  // Upscale / bg-removal mutations live in feature-specific files; pass through
  // names that the existing project uses. Adjust to match your convex layout.
  const startUpscale = useMutation(api.upscale.startUpscale);
  const startBgRemoval = useMutation(api.bgRemoval.startBgRemoval);

  const selectedJob = selectedId
    ? allJobs.find((j) => j._id === selectedId) ?? null
    : null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 sm:gap-8 px-4 lg:px-9 py-6 sm:py-9 pb-16">

        <DashboardPageHeader
          display
          title={`Your gallery — ${counts.all} pieces`}
          boxedNumPart={`${counts.all}`}
          description="Everything you've made, sorted however you want it. Tap any tile to peek — download, upscale, remove background, or start over without leaving the page."
          actions={
            <>
              <Button asChild variant="outline" className="neo-btn-ghost">
                <Link to="/dashboard/settings?tab=usage" prefetch="viewport">
                  <Download className="h-4 w-4" />
                  <span>Export all</span>
                </Link>
              </Button>
              <Button asChild className="neo-btn-primary">
                <Link to="/app/upload" prefetch="viewport">
                  <Plus className="h-4 w-4" />
                  <span>New creation</span>
                </Link>
              </Button>
            </>
          }
        />

        {!isEmpty && (
          <CreationsFilters
            search={search}
            status={status}
            sort={sort}
            view={view}
            counts={counts}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onSortChange={setSort}
            onViewChange={setView}
          />
        )}

        {isEmpty ? (
          <CreationsEmptyState />
        ) : view === 'grid' ? (
          <CreationsGrid
            jobs={allJobs}
            isLoading={isLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ) : (
          <CreationsList
            jobs={allJobs}
            isLoading={isLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}

        {selectedJob && (
          <CreationDetailsPeek
            job={selectedJob}
            onClose={() => handleSelect(null)}
            onDelete={async () => {
              await deleteJob({ jobId: selectedJob._id });
              handleSelect(null);
            }}
            onUpscale={(level) =>
              startUpscale({ jobId: selectedJob._id, level })
            }
            onBgRemoval={() =>
              startBgRemoval({ jobId: selectedJob._id })
            }
          />
        )}
      </div>
    </div>
  );
}
