import { ChevronDown } from 'lucide-react';
import { cn } from '~/lib/utils';
import { STYLE_CATALOG } from '~/config/style-catalog';
import type { ImageSize, LikenessLevel, StylePreset } from './types';

export interface StylePickerProps {
  selectedStyle: StylePreset;
  onStyleChange: (s: StylePreset) => void;
  size: ImageSize;
  onSizeChange: (s: ImageSize) => void;
  likeness: LikenessLevel;
  onLikenessChange: (l: LikenessLevel) => void;
  /** When true, the grid is locked (used during generation). */
  locked?: boolean;
  /** When true, the picker shows the "try another style" copy variant. */
  postResult?: boolean;
  /** When true, mark the styles already used recently with a small tick. */
  recentlyUsedStyleIds?: StylePreset[];
}

const SIZE_LABELS: Record<ImageSize, string> = {
  auto: 'Auto',
  square: 'Square',
  portrait: 'Portrait',
  landscape: 'Landscape',
};

const LIKENESS_LABELS: Record<LikenessLevel, string> = {
  loose: 'Loose',
  balanced: 'Balanced',
  exact: 'Exact',
};

export function StylePicker({
  selectedStyle,
  onStyleChange,
  size,
  onSizeChange,
  likeness,
  onLikenessChange,
  locked = false,
  postResult = false,
  recentlyUsedStyleIds = [],
}: StylePickerProps) {
  const eyebrowLabel = locked
    ? 'Style locked'
    : postResult
      ? 'Pick another style'
      : 'Pick a style';

  const headline = locked
    ? STYLE_CATALOG.find((s) => s.id === selectedStyle)?.label ?? '—'
    : postResult
      ? 'Different mood?'
      : 'Ten ways to see it.';

  return (
    <div className="px-5 sm:px-6 py-6">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted-foreground font-bold mb-1">
            <span
              className={cn(
                'h-[22px] w-[22px] rounded-full border-2 border-foreground text-white flex items-center justify-center font-display italic font-bold text-xs',
                locked ? 'bg-foreground' : 'bg-[color:var(--terracotta-500)]',
              )}
              aria-hidden="true"
            >
              2
            </span>
            {eyebrowLabel}
          </div>
          <h3 className="font-display italic font-medium text-[22px] leading-none text-foreground">
            {headline}
          </h3>
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {locked ? (
            <>
              Locked while we cook.
              <br />
              Will reset after.
            </>
          ) : postResult ? (
            <>
              <strong className="font-display italic font-medium text-foreground">
                Same photo
              </strong>
              ,<br />new style.
            </>
          ) : (
            <>
              Tap to preview.{' '}
              <strong className="font-display italic font-medium text-foreground">
                One picked
              </strong>{' '}
              by default.
            </>
          )}
        </div>
      </div>

      {/* Style grid */}
      <div
        className="grid grid-cols-5 gap-2"
        role="radiogroup"
        aria-label="Art style"
      >
        {STYLE_CATALOG.map((style) => {
          const isSelected = style.id === selectedStyle;
          const isRecent = recentlyUsedStyleIds.includes(style.id);
          const isDimmed = locked && !isSelected;
          return (
            <button
              key={style.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={locked}
              onClick={() => !locked && onStyleChange(style.id)}
              title={style.description}
              className={cn(
                'group/style relative aspect-square overflow-hidden bg-cover bg-center bg-muted cursor-pointer border-[2.5px] border-foreground transition-all',
                isSelected
                  ? 'rotate-[-1.5deg]'
                  : 'hover:translate-x-[-1px] hover:translate-y-[-1px]',
                isDimmed && 'opacity-40 cursor-not-allowed',
                locked && !isSelected && 'pointer-events-none',
              )}
              style={{
                backgroundImage: `url(${style.thumbnailUrl})`,
                boxShadow: isSelected
                  ? '4px 4px 0 0 var(--terracotta-500)'
                  : '3px 3px 0 0 var(--cocoa-900)',
              }}
            >
              <span
                className={cn(
                  'absolute bottom-0 left-0 right-0 text-[9px] uppercase tracking-[0.06em] font-bold py-1 text-center px-1',
                  isSelected
                    ? 'bg-[color:var(--terracotta-500)] text-white'
                    : 'bg-foreground text-[color:var(--cream-50)]',
                )}
              >
                {style.label}
                {isRecent && !isSelected && ' ✓'}
              </span>
              {style.isPro && (
                <span
                  className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-[color:var(--butter-500)] border-2 border-foreground text-foreground text-[9px] font-bold flex items-center justify-center"
                  aria-label="Pro feature"
                >
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!locked && (
        <div className="mt-5 pt-4 border-t border-dashed border-foreground/20 flex gap-2.5 flex-wrap">
          <Pill
            label="Size"
            value={SIZE_LABELS[size]}
            options={SIZE_LABELS}
            onChange={(v) => onSizeChange(v as ImageSize)}
          />
          <Pill
            label="Likeness"
            value={LIKENESS_LABELS[likeness]}
            options={LIKENESS_LABELS}
            onChange={(v) => onLikenessChange(v as LikenessLevel)}
          />
        </div>
      )}
    </div>
  );
}

function Pill<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <label
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border-2 border-foreground text-xs font-semibold text-foreground cursor-pointer"
      style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
    >
      <span className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground font-bold">
        {label}
      </span>
      <select
        value={Object.keys(options).find((k) => options[k as T] === value) ?? ''}
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none bg-transparent border-0 outline-none font-sans text-xs font-semibold text-foreground cursor-pointer"
      >
        {(Object.keys(options) as T[]).map((k) => (
          <option key={k} value={k}>
            {options[k]}
          </option>
        ))}
      </select>
      <ChevronDown className="h-3 w-3 text-foreground" aria-hidden="true" />
    </label>
  );
}
