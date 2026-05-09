import { cn } from '~/lib/utils';
import { Skeleton } from '~/components/ui/skeleton';
import type { CreationJob } from './types';

interface CreationsListProps {
  jobs: CreationJob[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function formatRelativeDate(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDay === 0) {
    const diffHr = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHr === 0) return 'just now';
    return `${diffHr}h ago`;
  }
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CreationsList({
  jobs,
  isLoading,
  selectedId,
  onSelect,
}: CreationsListProps) {
  if (isLoading) {
    return (
      <div className="bg-card border-[2.5px] border-foreground neo-card divide-y-2 divide-foreground/10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="h-14 w-14 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="bg-card border-[2.5px] border-foreground"
      style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
    >
      {jobs.map((job, idx) => {
        const selected = selectedId === job._id;
        const isReady = job.status === 'completed' || job.status === 'ready';
        const isProcessing = job.status === 'pending' || job.status === 'processing';
        const isFailed = job.status === 'failed';
        const styleLabel = job.styleLabel ?? job.style;

        return (
          <button
            key={job._id}
            type="button"
            onClick={() => onSelect(selected ? null : job._id)}
            className={cn(
              'w-full flex items-center gap-4 p-3 text-left transition-colors',
              idx > 0 && 'border-t border-foreground/10',
              selected ? 'bg-[color:var(--cream-100)]' : 'hover:bg-muted/40',
            )}
          >
            <div
              className="h-14 w-14 shrink-0 bg-cover bg-center bg-muted border-2 border-foreground"
              style={
                job.resultImageUrl
                  ? { backgroundImage: `url(${job.resultImageUrl})` }
                  : undefined
              }
            />
            <div className="min-w-0 flex-1">
              <div className="font-display italic font-medium text-foreground text-[15px] leading-tight truncate">
                {styleLabel}
              </div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-semibold flex items-center gap-2 mt-1">
                <span>{formatRelativeDate(job._creationTime)}</span>
                {job.sizePreset && (
                  <>
                    <span className="opacity-30">·</span>
                    <span className="font-mono normal-case tracking-normal">
                      {job.sizePreset}
                    </span>
                  </>
                )}
                {job.upscaleLevel && (
                  <>
                    <span className="opacity-30">·</span>
                    <span className="text-[color:var(--sage-500)] font-bold">
                      {job.upscaleLevel}×
                    </span>
                  </>
                )}
              </div>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-1 border-2 border-foreground text-[10px] uppercase tracking-[0.16em] font-bold shrink-0',
                isReady && 'bg-background',
                isProcessing && 'bg-[color:var(--butter-500)]',
                isFailed && 'bg-card text-[color:var(--tomato-500)]',
              )}
            >
              <span
                className={cn(
                  'block h-1.5 w-1.5 rounded-full',
                  isReady && 'bg-[color:var(--sage-500)]',
                  isProcessing && 'bg-[color:var(--terracotta-500)] animate-pulse',
                  isFailed && 'bg-[color:var(--tomato-500)]',
                )}
              />
              {isReady ? 'Ready' : isProcessing ? 'Cooking' : 'Failed'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
