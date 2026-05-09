import { useState } from 'react';
import { cn } from '~/lib/utils';

export type ImageSize = 'auto' | 'square' | 'portrait' | 'landscape';
export type LikenessLevel = 'loose' | 'balanced' | 'exact';
export type StylePreset =
  | 'sketch'
  | 'watercolor'
  | 'ghibli'
  | 'oneline'
  | 'oil'
  | 'popart'
  | 'cartoon3d'
  | 'silhouette'
  | 'pet'
  | 'mixed';

interface PreferencesTabProps {
  defaultSize: ImageSize;
  defaultLikeness: LikenessLevel;
  defaultStyle: StylePreset;
  onSizeChange: (v: ImageSize) => void;
  onLikenessChange: (v: LikenessLevel) => void;
  onStyleChange: (v: StylePreset) => void;
}

const SIZES: { value: ImageSize; label: string; hint: string }[] = [
  { value: 'auto', label: 'Auto', hint: 'matches your photo' },
  { value: 'square', label: 'Square', hint: '1024 × 1024' },
  { value: 'portrait', label: 'Portrait', hint: '768 × 1024' },
  { value: 'landscape', label: 'Landscape', hint: '1024 × 768' },
];

const LIKENESS: { value: LikenessLevel; label: string; hint: string }[] = [
  { value: 'loose', label: 'Loose', hint: 'more artistic license' },
  { value: 'balanced', label: 'Balanced', hint: 'recognizable but stylized' },
  { value: 'exact', label: 'Exact', hint: 'stay close to the photo' },
];

const STYLES: { value: StylePreset; label: string }[] = [
  { value: 'sketch', label: 'Realistic Sketch' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'ghibli', label: 'Studio Ghibli' },
  { value: 'oneline', label: 'One Line Art' },
  { value: 'oil', label: 'Oil Painting' },
  { value: 'popart', label: 'Pop Art' },
  { value: 'cartoon3d', label: '3D Cartoon' },
  { value: 'silhouette', label: 'Silhouette' },
  { value: 'pet', label: 'Pet Portrait' },
  { value: 'mixed', label: 'Artistic Reimagining' },
];

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  groupLabel,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  groupLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={groupLabel} className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex flex-col items-start gap-0.5 px-4 py-2.5 border-[2.5px] border-foreground text-sm font-bold cursor-pointer text-left',
              active
                ? 'bg-foreground text-background'
                : 'bg-card text-foreground hover:bg-muted/40',
            )}
            style={{
              boxShadow: active
                ? '3px 3px 0 0 var(--terracotta-500)'
                : '3px 3px 0 0 var(--cocoa-900)',
            }}
          >
            <span>{opt.label}</span>
            {opt.hint && (
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.12em] font-semibold',
                  active ? 'text-background/70' : 'text-muted-foreground',
                )}
              >
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function PreferencesTab({
  defaultSize,
  defaultLikeness,
  defaultStyle,
  onSizeChange,
  onLikenessChange,
  onStyleChange,
}: PreferencesTabProps) {
  // Local UI state for the auto-upscale toggle (not yet wired to convex).
  const [autoUpscale, setAutoUpscale] = useState(false);

  return (
    <div className="flex flex-col gap-7 sm:gap-9">

      <Section
        title="Default size"
        description="The aspect ratio we'll suggest first when you open Upload. You can override per-photo."
      >
        <ChipGroup
          options={SIZES}
          value={defaultSize}
          onChange={onSizeChange}
          groupLabel="Default image size"
        />
      </Section>

      <Section
        title="Likeness level"
        description="How closely the result should resemble the original photo. Loose = more artistic interpretation; Exact = stay faithful to the face."
      >
        <ChipGroup
          options={LIKENESS}
          value={defaultLikeness}
          onChange={onLikenessChange}
          groupLabel="Default likeness level"
        />
      </Section>

      <Section
        title="Default style"
        description="The style we'll preselect when you open Upload. Pick the one you reach for most."
      >
        <ChipGroup
          options={STYLES}
          value={defaultStyle}
          onChange={onStyleChange}
          groupLabel="Default style preset"
        />
      </Section>

      <Section
        title="Auto-upscale"
        description="If on, every finished creation is automatically upscaled 2× and added to your gallery. Counts against your monthly upscale budget."
      >
        <button
          type="button"
          role="switch"
          aria-checked={autoUpscale}
          onClick={() => setAutoUpscale((v) => !v)}
          className={cn(
            'relative inline-flex items-center w-16 h-9 border-[2.5px] border-foreground cursor-pointer transition-colors',
            autoUpscale ? 'bg-[color:var(--terracotta-500)]' : 'bg-[color:var(--cream-200)]',
          )}
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <span
            className={cn(
              'block h-5 w-5 bg-card border-2 border-foreground transition-transform',
              autoUpscale ? 'translate-x-7' : 'translate-x-1',
            )}
          />
        </button>
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-8 pb-7 sm:pb-9 border-b-2 border-foreground/10 last:border-0 last:pb-0">
      <div>
        <h3 className="font-display italic font-medium text-foreground text-[20px] leading-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
