import { cn } from '~/lib/utils';
import type { StyleMatchAspectRatio } from './types';

export interface AspectRatioPickerProps {
  value: StyleMatchAspectRatio;
  onChange: (ratio: StyleMatchAspectRatio) => void;
  locked?: boolean;
  className?: string;
}

interface RatioOption {
  id: StyleMatchAspectRatio;
  label: string;
  hint: string;
  /** Aspect ratio for the small visual preview tile. */
  previewW: number;
  previewH: number;
}

const OPTIONS: RatioOption[] = [
  { id: '1:1', label: 'Square',   hint: 'Feed post',  previewW: 28, previewH: 28 },
  { id: '4:5', label: 'Portrait', hint: 'Instagram',  previewW: 24, previewH: 30 },
  { id: '9:16', label: 'Story',   hint: 'TikTok · Reels', previewW: 18, previewH: 32 },
];

/**
 * Output aspect ratio picker. Style match outputs should match the user's
 * destination platform — square for feed posts, 4:5 for IG portrait,
 * 9:16 for vertical stories/Reels/TikTok. Defaults to 1:1.
 */
export function AspectRatioPicker({
  value,
  onChange,
  locked = false,
  className,
}: AspectRatioPickerProps) {
  return (
    <div className={cn('px-5 sm:px-6 py-5 border-b-2 border-foreground', className)}>
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground font-bold mb-1">
            Output size
          </div>
          <h4 className="font-display italic font-medium text-base leading-none text-foreground">
            Where will it live?
          </h4>
        </div>
        <div className="text-[11px] text-muted-foreground text-right leading-snug">
          {locked ? (
            <>Locked while we cook.</>
          ) : (
            <>Pick the platform · we&rsquo;ll match the crop.</>
          )}
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Output aspect ratio"
        className="grid grid-cols-3 gap-2"
      >
        {OPTIONS.map((opt) => {
          const isSelected = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={locked}
              onClick={() => !locked && onChange(opt.id)}
              className={cn(
                'flex items-center justify-center gap-2.5 px-3 py-2.5 border-[2.5px] border-foreground bg-card cursor-pointer transition-transform',
                isSelected
                  ? 'rotate-[-1deg]'
                  : 'hover:translate-x-[-1px] hover:translate-y-[-1px]',
                locked && !isSelected && 'opacity-40 cursor-not-allowed pointer-events-none',
              )}
              style={{
                boxShadow: isSelected
                  ? '3px 3px 0 0 var(--terracotta-500)'
                  : '2px 2px 0 0 var(--cocoa-900)',
                background: isSelected ? 'var(--cream-100)' : undefined,
              }}
            >
              <span
                className="border-2 border-foreground bg-[color:var(--cream-200)] shrink-0"
                style={{ width: `${opt.previewW}px`, height: `${opt.previewH}px` }}
                aria-hidden="true"
              />
              <span className="text-left">
                <span className="block font-display italic font-medium text-sm leading-none text-foreground">
                  {opt.label}
                </span>
                <span className="block font-mono text-[10px] tracking-[0.08em] uppercase text-muted-foreground mt-0.5">
                  {opt.id} · {opt.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
