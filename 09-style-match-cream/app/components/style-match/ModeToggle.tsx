import { cn } from '~/lib/utils';
import type { StyleMatchMode } from './types';

export interface ModeToggleProps {
  value: StyleMatchMode;
  onChange: (mode: StyleMatchMode) => void;
  /** When true, toggle is read-only (used during generation). */
  locked?: boolean;
  className?: string;
}

interface ModeOption {
  id: StyleMatchMode;
  label: string;
  helper: string;
  /** One-line plain-English example for the helper microcopy. */
  example: string;
}

const OPTIONS: ModeOption[] = [
  {
    id: 'style',
    label: 'Just the style',
    helper: 'Keep your photo, borrow the look.',
    example:
      "Your pose, your background, your outfit — restyled with the reference's palette, lighting, and rendering.",
  },
  {
    id: 'style+scene',
    label: 'Style + scene',
    helper: 'Put yourself inside the reference.',
    example:
      "Your face and hair placed into the reference's pose, scene, and full visual style. Like cosplaying the photo.",
  },
];

/**
 * Surfaces the two distinct intents of reference-image style transfer
 * as an explicit toggle (not auto-detected). Same reference image can
 * serve either intent depending on what the user wants — the model
 * needs to know which.
 *
 * Visual: chunky neo-brutalist segmented control with a microcopy block
 * below describing what the selected mode will do. Matches the upload
 * zone's numbered-step pattern from the Generator pack.
 */
export function ModeToggle({
  value,
  onChange,
  locked = false,
  className,
}: ModeToggleProps) {
  const selected = OPTIONS.find((o) => o.id === value) ?? OPTIONS[0];

  return (
    <div className={cn('px-5 sm:px-6 py-6 border-b-2 border-foreground', className)}>
      <div className="flex items-end justify-between gap-3 mb-3.5">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted-foreground font-bold mb-1">
            <span
              className={cn(
                'h-[22px] w-[22px] rounded-full border-2 border-foreground text-white flex items-center justify-center font-display italic font-bold text-xs',
                locked ? 'bg-foreground' : 'bg-[color:var(--terracotta-500)]',
              )}
              aria-hidden="true"
            >
              3
            </span>
            {locked ? 'Mode locked' : 'Pick your intent'}
          </div>
          <h3 className="font-display italic font-medium text-[22px] leading-none text-foreground">
            What should we keep?
          </h3>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Style match mode"
        className="grid grid-cols-2 gap-2"
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
                'group/mode text-left px-4 py-3.5 border-[2.5px] border-foreground bg-card transition-transform cursor-pointer',
                isSelected
                  ? 'rotate-[-0.6deg]'
                  : 'hover:translate-x-[-1px] hover:translate-y-[-1px]',
                locked && !isSelected && 'opacity-40 cursor-not-allowed pointer-events-none',
              )}
              style={{
                boxShadow: isSelected
                  ? '4px 4px 0 0 var(--terracotta-500)'
                  : '3px 3px 0 0 var(--cocoa-900)',
                background: isSelected ? 'var(--cream-100)' : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    'h-3.5 w-3.5 rounded-full border-2 border-foreground',
                    isSelected ? 'bg-[color:var(--terracotta-500)]' : 'bg-card',
                  )}
                  aria-hidden="true"
                />
                <span className="font-display italic font-medium text-base leading-none text-foreground">
                  {opt.label}
                </span>
              </div>
              <div className="text-xs text-muted-foreground leading-snug">{opt.helper}</div>
            </button>
          );
        })}
      </div>

      {/* Helper microcopy describing the selected mode in plain English */}
      <div
        className="mt-3.5 px-3.5 py-2.5 border-2 border-dashed border-foreground/25 text-xs text-muted-foreground leading-relaxed"
        aria-live="polite"
      >
        <strong className="font-display italic font-medium text-foreground not-italic">
          {selected.label}:
        </strong>{' '}
        {selected.example}
      </div>
    </div>
  );
}
