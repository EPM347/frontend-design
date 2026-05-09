import { CreationCard } from './card';
import { Skeleton } from '~/components/ui/skeleton';
import type { CreationJob } from './types';

interface CreationsGridProps {
  jobs: CreationJob[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CreationsGrid({
  jobs,
  isLoading,
  selectedId,
  onSelect,
}: CreationsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-[18px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border-[2.5px] border-foreground overflow-hidden"
            style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
          >
            <Skeleton className="aspect-square w-full" />
            <div className="px-3.5 py-3 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-[18px]">
      {jobs.map((job) => (
        <CreationCard
          key={job._id}
          job={job}
          selected={selectedId === job._id}
          onClick={() =>
            onSelect(selectedId === job._id ? null : job._id)
          }
        />
      ))}
    </div>
  );
}
