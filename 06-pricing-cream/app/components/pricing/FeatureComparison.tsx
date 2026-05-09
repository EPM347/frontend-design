import { Check, Minus } from 'lucide-react';
import { cn } from '~/lib/utils';

interface FeatureRow {
  /** What the feature is */
  label: string;
  /** Optional sub-line clarifying the feature */
  description?: string;
  /** Cell value per plan id — string for explicit text, true for ✓, false/undefined for empty */
  values: Record<string, string | boolean>;
}

export interface FeatureComparisonProps {
  /**
   * Plan headers, in order of column rendering. The `id` should match the
   * keys in each `FeatureRow.values`. Mark `recommended` to highlight that
   * column with the terracotta accent.
   */
  plans: Array<{ id: string; label: string; recommended?: boolean }>;
  rows: FeatureRow[];
  /** Heading shown above the table */
  heading?: string;
}

/** Default rows used when the page doesn't pass anything custom. */
const DEFAULT_ROWS: FeatureRow[] = [
  {
    label: 'Generations per month',
    values: { free: '5 / day', starter: '50', pro: '200', studio: 'Unlimited' },
  },
  {
    label: 'Image resolution',
    description: 'Up-to width on the long edge',
    values: { free: '1024px', starter: '1024px', pro: '2048px', studio: '4096px' },
  },
  {
    label: 'Upscale level',
    description: 'Larger prints, sharper detail',
    values: { free: '—', starter: '2×', pro: '4×', studio: '8×' },
  },
  {
    label: 'Background removal',
    values: { free: '—', starter: '20 / mo', pro: '80 / mo', studio: 'Unlimited' },
  },
  {
    label: 'All 10 styles',
    values: { free: true, starter: true, pro: true, studio: true },
  },
  {
    label: 'Early access to new styles',
    values: { free: false, starter: false, pro: true, studio: true },
  },
  {
    label: 'Rollover credits',
    description: 'Unused gets carried to the next cycle',
    values: { free: false, starter: false, pro: 'Up to 2× cap', studio: 'Up to 2× cap' },
  },
  {
    label: 'Commercial license',
    description: 'Sell prints, use in client work',
    values: { free: false, starter: false, pro: false, studio: true },
  },
  {
    label: 'Priority queue',
    description: '~2× faster generation',
    values: { free: false, starter: false, pro: false, studio: true },
  },
  {
    label: 'Watermark on result',
    values: { free: 'Yes', starter: '—', pro: '—', studio: '—' },
  },
];

export function FeatureComparison({
  plans,
  rows = DEFAULT_ROWS,
  heading = 'Everything in detail.',
}: FeatureComparisonProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <h2 className="font-display italic font-medium text-3xl sm:text-4xl leading-none tracking-[-0.02em] text-foreground">
          {heading}
        </h2>
        <p className="text-sm text-muted-foreground">
          What you get on each plan, side by side.
        </p>
      </div>

      <div
        className="overflow-x-auto bg-card border-[2.5px] border-foreground"
        style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
      >
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-[color:var(--cream-100)] border-b-2 border-foreground">
              <th className="text-left px-5 sm:px-6 py-4 font-display italic font-medium text-base text-foreground w-[34%]">
                Feature
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className={cn(
                    'text-center px-3 py-4 text-sm font-bold uppercase tracking-[0.12em]',
                    plan.recommended
                      ? 'text-[color:var(--terracotta-500)]'
                      : 'text-foreground',
                  )}
                >
                  {plan.label}
                  {plan.recommended && (
                    <div
                      className="inline-block ml-2 align-middle px-1.5 py-0.5 bg-[color:var(--terracotta-500)] text-white text-[9px] tracking-[0.18em] uppercase font-bold border border-foreground"
                      style={{ transform: 'rotate(-2deg)' }}
                    >
                      Pick this
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.label}
                className={cn(
                  'border-b border-foreground/10',
                  rowIdx % 2 === 1 && 'bg-[color:var(--cream-50)]',
                )}
              >
                <th
                  scope="row"
                  className="text-left px-5 sm:px-6 py-3 font-medium text-sm text-foreground align-top"
                >
                  <div>{row.label}</div>
                  {row.description && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-normal">
                      {row.description}
                    </div>
                  )}
                </th>
                {plans.map((plan) => {
                  const v = row.values[plan.id];
                  return (
                    <td
                      key={plan.id}
                      className={cn(
                        'text-center px-3 py-3 align-top text-sm',
                        plan.recommended ? 'bg-[color:var(--cream-100)]/40' : '',
                      )}
                    >
                      {renderCell(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell(value: string | boolean | undefined) {
  if (value === true) {
    return (
      <Check
        className="h-4 w-4 mx-auto"
        style={{ color: 'var(--sage-500)' }}
        aria-label="Included"
      />
    );
  }
  if (value === false || value === undefined) {
    return (
      <Minus
        className="h-4 w-4 mx-auto opacity-30"
        aria-label="Not included"
      />
    );
  }
  if (value === '—') {
    return (
      <span className="text-muted-foreground" aria-label="Not included">
        —
      </span>
    );
  }
  return (
    <span className="font-mono tabular-nums text-foreground text-sm">{value}</span>
  );
}
