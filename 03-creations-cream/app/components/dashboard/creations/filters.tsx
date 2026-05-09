import { Search, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { cn } from '~/lib/utils';

export type StatusFilter = 'all' | 'ready' | 'processing' | 'failed';
export type SortOption = 'newest' | 'oldest' | 'style';
export type ViewMode = 'grid' | 'list';

export interface FilterCounts {
  all: number;
  ready: number;
  processing: number;
  failed: number;
}

interface CreationsFiltersProps {
  search: string;
  status: StatusFilter;
  sort: SortOption;
  view: ViewMode;
  counts: FilterCounts;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSortChange: (v: SortOption) => void;
  onViewChange: (v: ViewMode) => void;
}

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'All',
  ready: 'Done',
  processing: 'Cooking',
  failed: 'Failed',
};

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  style: 'By style',
};

export function CreationsFilters({
  search,
  status,
  sort,
  view,
  counts,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onViewChange,
}: CreationsFiltersProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3 items-stretch">

      {/* Search */}
      <div className="relative h-[46px] border-[2.5px] border-foreground bg-card flex items-center px-4 neo-shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by style, date, or notes…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
          aria-label="Search creations"
        />
      </div>

      {/* Status pills (chunky toggle group) */}
      <div className="flex h-[46px] border-[2.5px] border-foreground bg-card neo-shadow-sm overflow-x-auto">
        {(['all', 'ready', 'processing', 'failed'] as const).map((value, idx) => {
          const active = status === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onStatusChange(value)}
              className={cn(
                'flex items-center gap-2 px-4 sm:px-5 text-sm font-semibold whitespace-nowrap transition-colors',
                idx > 0 && 'border-l-2 border-foreground',
                active
                  ? 'bg-foreground text-background'
                  : 'bg-card text-foreground hover:bg-muted/50',
              )}
              aria-pressed={active}
            >
              <span>{STATUS_LABELS[value]}</span>
              <span
                className={cn(
                  'font-mono text-[11px] leading-none px-1.5 py-0.5 border-[1.5px] border-foreground',
                  active ? 'bg-[color:var(--butter-500)] text-foreground' : 'bg-background text-foreground',
                )}
              >
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort */}
      <label className="h-[46px] border-[2.5px] border-foreground bg-card neo-shadow-sm flex items-center px-4 gap-2.5 cursor-pointer">
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
          Sort
        </span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-transparent border-0 outline-none text-sm font-semibold text-foreground pr-1 cursor-pointer"
          aria-label="Sort creations"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>
        <ChevronDown className="h-3 w-3 text-foreground shrink-0" aria-hidden="true" />
      </label>

      {/* View toggle */}
      <div className="flex h-[46px] border-[2.5px] border-foreground bg-card neo-shadow-sm">
        <button
          type="button"
          onClick={() => onViewChange('grid')}
          className={cn(
            'w-11 flex items-center justify-center transition-colors',
            view === 'grid' ? 'bg-foreground text-background' : 'bg-card text-foreground hover:bg-muted/50',
          )}
          aria-label="Grid view"
          aria-pressed={view === 'grid'}
        >
          <LayoutGrid className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          onClick={() => onViewChange('list')}
          className={cn(
            'w-11 flex items-center justify-center border-l-2 border-foreground transition-colors',
            view === 'list' ? 'bg-foreground text-background' : 'bg-card text-foreground hover:bg-muted/50',
          )}
          aria-label="List view"
          aria-pressed={view === 'list'}
        >
          <List className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
