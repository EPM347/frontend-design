import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;

  /**
   * Optional eyebrow text rendered above the title in small caps.
   */
  eyebrow?: string;

  /**
   * If provided, the matching substring inside `title` is wrapped in
   * a chunky boxed-name treatment (terracotta + cocoa border + offset shadow,
   * rotated -2deg). Used by the dashboard greeting: title="Good morning, Emon."
   * boxedNamePart="Emon."
   */
  boxedNamePart?: string;

  /**
   * If provided, the matching substring inside `title` is wrapped in a butter
   * boxed-num treatment. Used by the creations header: title="Your gallery — 47 pieces"
   * boxedNumPart="47"
   */
  boxedNumPart?: string;

  /**
   * If true, render the title in italic display style (Fraunces) instead of the
   * default bold sans. Used by greeting + section heroes.
   */
  display?: boolean;
}

function applyHighlights(
  title: string,
  boxedNamePart?: string,
  boxedNumPart?: string,
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = title;

  // Apply boxedNumPart first (smaller, simpler), then boxedNamePart on remainder.
  // We split greedily on the first occurrence.
  const tokens: { text: string; cls: string }[] = [];
  if (boxedNumPart) tokens.push({ text: boxedNumPart, cls: 'boxed-num' });
  if (boxedNamePart) tokens.push({ text: boxedNamePart, cls: 'boxed-name' });

  if (tokens.length === 0) return [title];

  // Find the earliest token in the title and split around it.
  let earliest: { idx: number; token: typeof tokens[number] } | null = null;
  for (const t of tokens) {
    const i = remaining.indexOf(t.text);
    if (i !== -1 && (earliest === null || i < earliest.idx)) {
      earliest = { idx: i, token: t };
    }
  }
  if (!earliest) return [title];

  const before = remaining.slice(0, earliest.idx);
  const after = remaining.slice(earliest.idx + earliest.token.text.length);
  if (before) parts.push(before);
  parts.push(
    <span key="hi" className={earliest.token.cls}>
      {earliest.token.text}
    </span>,
  );
  // Recurse into the remainder for any additional tokens
  if (after) {
    const restTokens = tokens.filter((t) => t !== earliest!.token);
    if (restTokens.length > 0 && restTokens.some((t) => after.includes(t.text))) {
      parts.push(
        ...applyHighlights(
          after,
          boxedNamePart && earliest.token.cls !== 'boxed-name' ? boxedNamePart : undefined,
          boxedNumPart && earliest.token.cls !== 'boxed-num' ? boxedNumPart : undefined,
        ),
      );
    } else {
      parts.push(after);
    }
  }
  return parts;
}

export function DashboardPageHeader({
  title,
  description,
  icon: Icon,
  actions,
  eyebrow,
  boxedNamePart,
  boxedNumPart,
  display = false,
}: DashboardPageHeaderProps) {
  const titleNodes = applyHighlights(title, boxedNamePart, boxedNumPart);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)]">
            {eyebrow}
          </div>
        )}
        <h1
          className={
            display
              ? 'font-display italic font-medium text-4xl sm:text-5xl md:text-6xl leading-[1] tracking-[-0.02em] text-foreground flex flex-wrap items-baseline gap-x-2'
              : 'flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight'
          }
        >
          {Icon && !display && (
            <Icon
              className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0"
              aria-hidden="true"
            />
          )}
          <span className={display ? '' : 'truncate'}>{titleNodes}</span>
        </h1>
        {description && (
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
