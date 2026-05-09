'use client';
import { Link } from 'react-router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

type StyleSuggestion = {
  id: string;
  name: string;
  desc: string;
  tag: 'Try' | 'New for you';
  thumbUrl: string;
};

/**
 * Hard-coded list of all 10 production styles. Once the backend has
 * `api.usage.getStyleUsage` (or equivalent), this should be replaced with a
 * server-side query that filters out the user's most-used 4 from this month.
 *
 * For now we filter on the client by removing styles that appear in the user's
 * last 8 jobs.
 */
const ALL_STYLES: StyleSuggestion[] = [
  { id: 'pet-portrait',           name: 'Pet Portrait',          desc: 'Watercolor warmth tuned for pets. Works on people too.', tag: 'New for you', thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/6e058b4d-c262-4e38-a554-4219fe506ef8.png' },
  { id: 'silhouette',             name: 'Silhouette',            desc: 'All shape, no detail. Quiet and graphic.',                tag: 'Try',         thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/63e874f3-e3bb-4752-ad68-b6a296e73f64.png' },
  { id: 'artistic-reimagining',   name: 'Artistic Reimagining',  desc: 'Mixed-media. Surprising every time. Pro experiments.',    tag: 'Try',         thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/b7be39f5-2f17-4dc3-99ef-06ca20706d5c.png' },
  { id: 'pop-art',                name: 'Pop Art',               desc: 'Halftone, bold flat color, comic-book loud.',             tag: 'Try',         thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/23354d2b-1c0c-4c3d-882d-5c7356222d3e.png' },
  { id: 'one-line-art',           name: 'One Line Art',          desc: 'Single elegant line. Minimal, modern, framed.',            tag: 'Try',         thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/6c2cdd3f-9980-4abf-b535-6998b392e102.png' },
  { id: 'oil-painting',           name: 'Oil Painting',          desc: 'Heavy texture, classical palette, gallery-ready.',         tag: 'Try',         thumbUrl: 'https://hyperagent.com/api/files/usergenerated/threads/cmolgvgyy103i08ad41k7bxm0/images/4b422af0-c41f-40b5-b557-37e34cdb8648.png' },
];

export function TrySomethingNew() {
  const recentJobsQuery = useQuery(api.jobs.listMine, { limit: 8 });
  const recentStyles = new Set(
    (recentJobsQuery?.jobs ?? []).map((j) =>
      (j.style ?? '').toLowerCase().replace(/\s+/g, '-'),
    ),
  );

  // Filter out styles already used recently. If the user is brand new, just
  // show the first four.
  const suggestions =
    recentStyles.size === 0
      ? ALL_STYLES.slice(0, 4)
      : ALL_STYLES.filter((s) => !recentStyles.has(s.id)).slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between gap-6 mb-5">
        <div>
          <h2 className="font-display italic font-medium text-3xl leading-none tracking-[-0.02em] text-foreground">
            Try something{' '}
            <em className="italic" style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>
              new.
            </em>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Four presets you haven't used this month.
          </p>
        </div>
        <Link
          to="/best-ai-art-generator#styles"
          prefetch="intent"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-foreground bg-card border-2 border-foreground hover:bg-muted transition-colors"
          style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
        >
          All 10 styles →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {suggestions.map((s) => (
          <Link
            key={s.id}
            to={`/best-ai-art-generator?style=${s.id}`}
            prefetch="intent"
            className="block bg-card border-[2.5px] border-foreground overflow-hidden transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
          >
            <div
              className="aspect-[4/5] bg-cover bg-center border-b-[2.5px] border-foreground relative"
              style={{ backgroundImage: `url(${s.thumbUrl})` }}
            >
              <span
                className="absolute top-2 left-2 px-2 py-1 text-[9px] uppercase tracking-wider font-bold border-2 border-foreground text-white"
                style={{
                  background:
                    s.tag === 'New for you'
                      ? 'var(--terracotta-500)'
                      : 'var(--cocoa-900)',
                }}
              >
                {s.tag}
              </span>
            </div>
            <div className="p-3.5">
              <div className="font-display italic font-medium text-lg leading-tight text-foreground mb-1">
                {s.name}
              </div>
              <div className="text-xs text-muted-foreground leading-snug">
                {s.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
