'use client';
import { Link } from 'react-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ArrowUpRight, Sparkles } from 'lucide-react';

/**
 * Real product styles in oneclick·art (10 styles total). The four shown in the
 * "recently used" preview tiles default to the most-likely-used set; once the
 * backend exposes per-user style usage, the order can be sorted by frequency.
 */
type StyleTile = {
  id: string;
  label: string;
  // Public R2 URL for the style preview thumbnail. Replace with the real URLs
  // from the production catalog (app/data/styles.ts in the main repo).
  thumbUrl: string;
};

const RECENT_STYLES: StyleTile[] = [
  { id: 'ghibli', label: 'Ghibli',     thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/fbdeb72d-b474-41b8-abcd-12df3a01927a.png' },
  { id: 'watercolor', label: 'Watercolor', thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/d8900918-b2de-4b57-9f93-3abf037690f2.png' },
  { id: '3d-cartoon', label: '3D',     thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/89dba22c-103d-495f-81c5-0b8180842bb4.png' },
  { id: 'sketch', label: 'Sketch',     thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/50c85b37-8ba6-47e2-945f-fe3710f7bbb3.png' },
  { id: 'oil', label: 'Oil',           thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/4b422af0-c41f-40b5-b557-37e34cdb8648.png' },
  { id: 'one-line', label: 'One Line', thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/6c2cdd3f-9980-4abf-b535-6998b392e102.png' },
];

export function HeroMakeArtCard() {
  // We use the most recent job's style as the "selected" tile in the preview.
  const recentJobs = useQuery(api.jobs.listMine, { limit: 1 });
  const lastJob = recentJobs?.jobs?.[0];
  const lastStyleId =
    lastJob?.style?.toLowerCase().replace(/\s+/g, '-') ?? 'ghibli';
  const lastStyleLabel = lastJob?.style ?? 'Studio Ghibli';

  return (
    <div
      className="relative overflow-hidden bg-card border-[3.5px] border-foreground p-6 sm:p-10 md:p-11"
      style={{ boxShadow: '8px 8px 0 0 var(--cocoa-900)' }}
    >
      {/* Warm radial glow in the corner */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
          opacity: 0.18,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-10 items-center">
        <div>
          <div
            className="text-[11px] tracking-[0.22em] uppercase font-bold mb-3"
            style={{ color: 'var(--terracotta-500)' }}
          >
            The reason you came
          </div>
          <h2 className="font-display italic font-medium text-4xl sm:text-5xl md:text-6xl leading-[0.96] tracking-[-0.025em] text-foreground mb-4">
            Make some{' '}
            <em
              className="italic"
              style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}
            >
              art.
            </em>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-7 max-w-md">
            Drop a photo. Tap a style. Three taps, one finished image.
            {lastJob ? (
              <>
                {' '}Your last preset was <strong className="font-display italic font-medium text-foreground">{lastStyleLabel}</strong> — keep going or pick something new.
              </>
            ) : (
              <> Start with whatever feels right.</>
            )}
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <Link
              to="/best-ai-art-generator"
              prefetch="intent"
              className="inline-flex items-center gap-2.5 px-7 py-4 font-bold text-base text-white border-[3px] border-foreground"
              style={{
                background: 'var(--terracotta-500)',
                boxShadow: '6px 6px 0 0 var(--cocoa-900)',
              }}
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span>Upload a photo</span>
            </Link>
            <Link
              to="/best-ai-art-generator#styles"
              prefetch="intent"
              className="inline-flex items-center gap-2 px-5 py-3.5 font-bold text-sm text-foreground bg-transparent border-[3px] border-foreground"
              style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Browse styles</span>
            </Link>
          </div>
        </div>

        {/* Recently used styles — 3×2 grid */}
        <div
          className="grid gap-2 shrink-0 hidden md:grid"
          style={{ gridTemplateColumns: 'repeat(3, 96px)', gridTemplateRows: '96px 96px' }}
          aria-label="Recently used styles"
        >
          {RECENT_STYLES.slice(0, 6).map((style) => {
            const selected = style.id === lastStyleId;
            return (
              <Link
                key={style.id}
                to={`/best-ai-art-generator?style=${style.id}`}
                prefetch="intent"
                className="relative overflow-hidden border-[2.5px] border-foreground bg-cover bg-center"
                style={{
                  backgroundImage: `url(${style.thumbUrl})`,
                  boxShadow: selected
                    ? '3px 3px 0 0 var(--terracotta-500)'
                    : '3px 3px 0 0 var(--cocoa-900)',
                  transform: selected ? 'rotate(-2deg)' : undefined,
                }}
                aria-label={`Use ${style.label} style`}
              >
                <span
                  className="absolute bottom-1 left-1 right-1 text-center px-1.5 py-1 text-[9px] font-bold uppercase tracking-wider text-background border border-foreground"
                  style={{ background: 'var(--cocoa-900)' }}
                >
                  {style.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
