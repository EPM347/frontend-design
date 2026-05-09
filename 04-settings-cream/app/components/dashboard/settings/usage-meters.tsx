import { cn } from '~/lib/utils';

type MeterColor = 'images' | 'upscales' | 'bgremoval' | 'rollover';

interface MeterDef {
  color: MeterColor;
  label: string;
  used: number;
  limit: number | 'unlimited';
  /** Sub-line under the value, e.g. "153 left this cycle" */
  meta: string;
}

interface UsageMetersProps {
  resetsLabel?: string; // e.g. "June 7, 2026"
  daysLeft?: number;
  meters: MeterDef[];
}

const COLOR_TOKENS: Record<MeterColor, { dot: string; bar: string }> = {
  images: { dot: 'var(--terracotta-500)', bar: 'var(--terracotta-500)' },
  upscales: { dot: 'var(--sage-500)', bar: 'var(--sage-500)' },
  bgremoval: { dot: 'var(--butter-500)', bar: 'var(--butter-700)' },
  rollover: { dot: 'var(--basil-500)', bar: 'var(--basil-500)' },
};

export function UsageMeters({ resetsLabel, daysLeft, meters }: UsageMetersProps) {
  return (
    <div className="space-y-4 sm:space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <h2 className="font-display italic font-medium text-[28px] leading-none text-foreground">
          This cycle.
        </h2>
        {resetsLabel && (
          <div className="text-xs text-muted-foreground">
            Resets{' '}
            <strong className="font-display italic font-medium text-foreground">
              {resetsLabel}
            </strong>
            {typeof daysLeft === 'number' && <> · {daysLeft} days</>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {meters.map((m) => {
          const colors = COLOR_TOKENS[m.color];
          const percent =
            m.limit === 'unlimited'
              ? 100
              : m.limit > 0
                ? Math.min(100, (m.used / m.limit) * 100)
                : 0;
          const isUnlimited = m.limit === 'unlimited';
          return (
            <div
              key={m.color + m.label}
              className="bg-card border-[2.5px] border-foreground p-5"
              style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
            >
              <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-bold text-muted-foreground mb-3">
                <span
                  aria-hidden="true"
                  className="block h-2.5 w-2.5 rounded-full"
                  style={{ background: colors.dot }}
                />
                {m.label}
              </div>

              <div className="flex items-end gap-1 mb-1.5">
                <span className="font-display italic font-semibold text-4xl leading-[0.9] text-foreground">
                  {isUnlimited ? '∞' : m.used.toLocaleString()}
                </span>
                <span className="font-mono text-[13px] text-muted-foreground mb-1">
                  {isUnlimited ? '' : `/ ${m.limit.toLocaleString()}`}
                </span>
              </div>

              <div className="text-xs text-muted-foreground mb-3.5">{m.meta}</div>

              <div
                className="h-2 border-[1.5px] border-foreground bg-[color:var(--cream-200)] overflow-hidden"
                role="progressbar"
                aria-valuenow={isUnlimited ? 0 : m.used}
                aria-valuemin={0}
                aria-valuemax={isUnlimited ? 0 : (m.limit as number)}
                aria-label={m.label}
              >
                <div
                  className={cn('h-full transition-[width] duration-300')}
                  style={{
                    width: `${percent}%`,
                    background: colors.bar,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
