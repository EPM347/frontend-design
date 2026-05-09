import { Download, Maximize2, Trash2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { CreationJob } from './types';

interface CreationCardProps {
  job: CreationJob;
  selected?: boolean;
  onClick: () => void;
  /** Inline action handlers shown on hover. Optional — if omitted the icons are hidden. */
  onDownload?: () => void;
  onUpscale?: () => void;
  onDelete?: () => void;
}

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

function formatEta(seconds?: number): string {
  if (!seconds || seconds <= 0) return 'almost done';
  if (seconds < 60) return `~${seconds}s left`;
  return `~${Math.ceil(seconds / 60)}m left`;
}

function StatusPill({ status }: { status: CreationJob['status'] }) {
  const isReady = status === 'completed' || status === 'ready';
  const isProcessing = status === 'pending' || status === 'processing';
  const isFailed = status === 'failed';
  const label = isReady ? 'Ready' : isProcessing ? 'Cooking' : isFailed ? 'Failed' : status;
  return (
    <span
      className={cn(
        'absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-1 border-2 border-foreground text-[10px] uppercase tracking-[0.16em] font-bold',
        isProcessing && 'bg-[color:var(--butter-500)] text-foreground',
        isReady && 'bg-background text-foreground',
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
      {label}
    </span>
  );
}

export function CreationCard({
  job,
  selected,
  onClick,
  onDownload,
  onUpscale,
  onDelete,
}: CreationCardProps) {
  const styleLabel = job.styleLabel ?? job.style;
  const isProcessing = job.status === 'pending' || job.status === 'processing';
  const isReady = job.status === 'completed' || job.status === 'ready';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group/card text-left bg-card border-[2.5px] border-foreground overflow-hidden cursor-pointer',
        'transition-[transform,box-shadow] duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--terracotta-500)] focus-visible:ring-offset-2',
        selected
          ? 'translate-x-[-2px] translate-y-[-2px]'
          : 'hover:translate-x-[-2px] hover:translate-y-[-2px]',
      )}
      style={{
        boxShadow: selected
          ? '6px 6px 0 0 var(--terracotta-500)'
          : '4px 4px 0 0 var(--cocoa-900)',
      }}
    >
      {/* Thumb */}
      <div
        className="aspect-square bg-cover bg-center bg-muted relative border-b-[2.5px] border-foreground"
        style={
          job.resultImageUrl ? { backgroundImage: `url(${job.resultImageUrl})` } : undefined
        }
      >
        <StatusPill status={job.status} />

        {isReady && (onDownload || onUpscale || onDelete) && (
          <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150">
            {onDownload && (
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="h-8 w-8 bg-background border-2 border-foreground flex items-center justify-center text-foreground hover:bg-[color:var(--butter-500)]"
                style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
                title="Download"
              >
                <Download className="h-3.5 w-3.5" />
              </span>
            )}
            {onUpscale && (
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpscale();
                }}
                className="h-8 w-8 bg-background border-2 border-foreground flex items-center justify-center text-foreground hover:bg-[color:var(--butter-500)]"
                style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
                title="Upscale"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </span>
            )}
            {onDelete && (
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-8 w-8 bg-background border-2 border-foreground flex items-center justify-center text-foreground hover:bg-[color:var(--tomato-500)] hover:text-white"
                style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="px-3.5 py-3">
        <div className="font-display italic font-medium text-base text-foreground leading-tight mb-1">
          {styleLabel}
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-semibold">
          <span>{formatRelativeDate(job._creationTime)}</span>
          {job.upscaleLevel && (
            <>
              <span className="opacity-30">·</span>
              <span className="text-[color:var(--sage-500)] font-bold">
                {job.upscaleLevel}× upscaled
              </span>
            </>
          )}
          {isProcessing && (
            <>
              <span className="opacity-30">·</span>
              <span className="text-[color:var(--terracotta-500)] font-bold">
                {formatEta(job.etaSeconds)}
              </span>
            </>
          )}
          {selected && (
            <>
              <span className="opacity-30">·</span>
              <span className="text-[color:var(--terracotta-500)] font-bold">Selected</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
