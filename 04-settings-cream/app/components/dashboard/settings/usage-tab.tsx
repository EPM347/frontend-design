import { useState, useMemo } from 'react';
import { cn } from '~/lib/utils';
import { Download } from 'lucide-react';

interface JobLite {
  _id: string;
  _creationTime: number;
  status: 'pending' | 'processing' | 'completed' | 'ready' | 'failed';
  style: string;
  styleLabel?: string;
  sizePreset?: string;
  upscaleLevel?: 2 | 4 | 8;
  width?: number;
  height?: number;
}

interface UsageTabProps {
  jobs?: JobLite[];
  recentJobs: JobLite[];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function UsageTab({ jobs, recentJobs }: UsageTabProps) {
  const [styleFilter, setStyleFilter] = useState<string>('all');

  const list = jobs ?? recentJobs ?? [];

  const styleOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: { value: string; label: string }[] = [{ value: 'all', label: 'All styles' }];
    for (const j of list) {
      const key = j.style;
      if (!seen.has(key)) {
        seen.add(key);
        opts.push({ value: key, label: j.styleLabel ?? key });
      }
    }
    return opts;
  }, [list]);

  const filtered = useMemo(() => {
    if (styleFilter === 'all') return list;
    return list.filter((j) => j.style === styleFilter);
  }, [list, styleFilter]);

  const exportCsv = () => {
    const headers = ['date', 'style', 'size', 'upscale', 'status'];
    const rows = filtered.map((j) => [
      new Date(j._creationTime).toISOString(),
      j.styleLabel ?? j.style,
      j.sizePreset ?? (j.width && j.height ? `${j.width}x${j.height}` : ''),
      j.upscaleLevel ? `${j.upscaleLevel}x` : '',
      j.status,
    ]);
    const csv =
      headers.join(',') +
      '\n' +
      rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oneclickart-usage-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (jobs === undefined && recentJobs.length === 0) {
    return <div className="text-sm text-muted-foreground italic">Loading usage history…</div>;
  }

  if (filtered.length === 0) {
    return (
      <div
        className="bg-card border-[2.5px] border-foreground p-8 sm:p-12 text-center"
        style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
      >
        <h3 className="font-display italic font-medium text-2xl text-foreground mb-2">
          No history yet.
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your usage history shows up here after you make your first creation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label className="h-[42px] border-[2.5px] border-foreground bg-card flex items-center px-3.5 gap-2 cursor-pointer w-full sm:w-auto"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
            Filter
          </span>
          <select
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
            className="appearance-none bg-transparent border-0 outline-none text-sm font-semibold text-foreground cursor-pointer"
            aria-label="Filter by style"
          >
            {styleOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold cursor-pointer"
          style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* List */}
      <div
        className="bg-card border-[2.5px] border-foreground"
        style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
      >
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 sm:px-5 py-3 border-b-2 border-foreground bg-[color:var(--cream-100)] text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground">
          <div>Style</div>
          <div className="hidden sm:block">Size</div>
          <div className="hidden sm:block">Upscale</div>
          <div>Status</div>
        </div>
        {filtered.map((j, idx) => {
          const isReady = j.status === 'completed' || j.status === 'ready';
          const isProcessing = j.status === 'pending' || j.status === 'processing';
          const isFailed = j.status === 'failed';
          return (
            <div
              key={j._id}
              className={cn(
                'grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 sm:px-5 py-3 items-center text-sm',
                idx > 0 && 'border-t border-foreground/10',
              )}
            >
              <div className="min-w-0">
                <div className="font-display italic font-medium text-foreground leading-tight truncate">
                  {j.styleLabel ?? j.style}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {formatDate(j._creationTime)} · {formatTime(j._creationTime)}
                </div>
              </div>
              <div className="hidden sm:block font-mono text-[12px] text-foreground">
                {j.sizePreset ??
                  (j.width && j.height ? `${j.width}×${j.height}` : '—')}
              </div>
              <div className="hidden sm:block font-mono text-[12px] text-foreground">
                {j.upscaleLevel ? `${j.upscaleLevel}×` : '—'}
              </div>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 border-2 border-foreground text-[10px] uppercase tracking-[0.16em] font-bold',
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
