'use client';
import { useParams, Link } from 'react-router';
import { useQuery } from 'convex/react';
import { Download, Sparkles, Frown, ArrowUpRight, Share2 } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import type { Route } from './+types/art.$jobId';
import { STYLE_BY_ID, STYLE_CATALOG } from '~/config/style-catalog';
import type { StylePreset } from '~/components/generator/types';

export const meta: Route.MetaFunction = () => {
  // Static metadata; the share page rewrites the document title client-side
  // once the job loads (see effect below). For richer per-share OG tags add
  // a `loader` that fetches the job server-side and emits dynamic meta here.
  const title = 'Made with oneclick·art';
  const description =
    'A piece made by transforming a real photo with oneclick·art — drop a photo, pick a style, see your art in seconds.';
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ];
};

interface PublicJob {
  _id: string;
  signedResultUrl?: string;
  resultUrl?: string;
  signedOriginalUrl?: string;
  originalUrl?: string;
  /** Canonical style identifier; matches keys in `STYLE_CATALOG`. May be absent on legacy jobs. */
  style?: StylePreset;
  /** Pre-formatted style label, if the convex query exposes it. */
  styleLabel?: string;
  createdAt: number;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function copyShareLink(): void {
  const url = window.location.href;
  if (navigator.share) {
    void navigator.share({ url, title: 'Made with oneclick·art' }).catch(() => {
      // fall through
    });
    return;
  }
  navigator.clipboard
    .writeText(url)
    .then(() => {
      // eslint-disable-next-line no-alert
      alert('Share link copied.');
    })
    .catch(() => {
      window.prompt('Copy this share link:', url);
    });
}

export default function PublicArtView() {
  const params = useParams();
  const jobId = params.jobId as Id<'jobs'>;
  const job = useQuery(api.jobs.getPublicById, { id: jobId }) as
    | PublicJob
    | null
    | undefined;

  return (
    <main className="theme-cream min-h-screen bg-background">
      <BrandBar />

      {job === undefined && <LoadingState />}
      {job === null && <NotFoundState />}
      {job && <Showcase job={job} />}

      <Footer />
    </main>
  );
}

/* ───────── Brand bar (lighter than the marketing Navbar) ───────── */

function BrandBar() {
  return (
    <header className="border-b-2 border-foreground bg-[color:var(--cream-50)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-display italic font-bold text-xl sm:text-2xl tracking-[-0.025em] text-foreground"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          oneclick<span style={{ color: 'var(--terracotta-500)' }}>·</span>art
        </Link>
        <Link
          to="/best-ai-art-generator"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[color:var(--terracotta-500)] text-white border-2 border-foreground text-xs sm:text-sm font-bold no-underline transition-transform active:translate-x-0.5 active:translate-y-0.5"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Make yours</span>
        </Link>
      </div>
    </header>
  );
}

/* ───────── States ───────── */

function LoadingState() {
  return (
    <section className="px-4 sm:px-6 lg:px-12 py-20 sm:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="inline-flex items-center justify-center h-14 w-14 bg-[color:var(--butter-500)] border-[3px] border-foreground mb-5"
          style={{
            boxShadow: '4px 4px 0 0 var(--cocoa-900)',
            transform: 'rotate(-4deg)',
          }}
        >
          <Sparkles
            className="h-6 w-6 text-foreground animate-pulse"
            style={{ animationDuration: '1.6s' }}
          />
        </div>
        <h2 className="font-display italic font-medium text-3xl text-foreground leading-none mb-2">
          Hold on a sec…
        </h2>
        <p className="text-sm text-muted-foreground">Pulling this piece up.</p>
      </div>
    </section>
  );
}

function NotFoundState() {
  return (
    <section className="px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
      <div
        className="max-w-2xl mx-auto bg-card border-[3px] border-foreground p-10 sm:p-14 text-center"
        style={{ boxShadow: '8px 8px 0 0 var(--cocoa-900)' }}
      >
        <div
          className="inline-flex items-center justify-center h-16 w-16 bg-[color:var(--cream-100)] border-[3px] border-foreground mb-5"
          style={{
            boxShadow: '4px 4px 0 0 var(--cocoa-900)',
            transform: 'rotate(-3deg)',
          }}
        >
          <Frown
            className="h-7 w-7 text-foreground"
            aria-hidden="true"
          />
        </div>
        <h2 className="font-display italic font-medium text-3xl sm:text-4xl text-foreground leading-none mb-3">
          Couldn't find that one.
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed mb-7">
          The piece either doesn't exist, was deleted, or was made private. The
          good news: making your own takes about 30 seconds.
        </p>
        <Link
          to="/best-ai-art-generator"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[color:var(--terracotta-500)] text-white border-[3px] border-foreground text-base font-bold no-underline transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
        >
          <Sparkles className="h-4 w-4" />
          <span>Make your own</span>
        </Link>
      </div>
    </section>
  );
}

/* ───────── Showcase (the main happy path) ───────── */

function Showcase({ job }: { job: PublicJob }) {
  const imageUrl = job.signedResultUrl ?? job.resultUrl ?? '';
  const originalUrl = job.signedOriginalUrl ?? job.originalUrl;
  const styleDef = job.style ? STYLE_BY_ID[job.style] : undefined;
  const styleLabel = job.styleLabel ?? styleDef?.label ?? 'AI art';
  const styleDescription = styleDef?.description;

  const filename = `oneclickart-${(job.style ?? 'art').toLowerCase().replace(/\s+/g, '-')}-${job._id.slice(-6)}.png`;

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Download failed:', err);
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-12 pt-10 sm:pt-14 pb-16 relative overflow-hidden">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 h-96 w-96 rounded-full pointer-events-none opacity-[0.10]"
        style={{
          background:
            'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Hero strip */}
        <div className="text-center mb-9 sm:mb-12 max-w-2xl mx-auto">
          <span
            className="inline-block text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3.5 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            ✦ Made with oneclick·art
          </span>
          <h1
            className="font-display italic font-medium text-4xl sm:text-5xl md:text-6xl leading-[0.96] tracking-[-0.025em] text-foreground mb-3"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            <em
              className="not-italic"
              style={{ fontStyle: 'italic', color: 'var(--terracotta-500)' }}
            >
              {styleLabel}
            </em>{' '}
            from a real photo.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {styleDescription ?? 'Made by uploading a photo and picking a style.'}
            {' · '}
            <span className="font-mono text-xs">{formatDate(job.createdAt)}</span>
          </p>
        </div>

        {/* Image showcase — side-by-side if original is available */}
        <div
          className={
            originalUrl
              ? 'grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto'
              : 'max-w-xl mx-auto'
          }
        >
          {originalUrl && (
            <ImageStage
              url={originalUrl}
              label="Original"
              labelStyle="dark"
            />
          )}
          <ImageStage
            url={imageUrl}
            label={styleLabel}
            labelStyle="terracotta"
          />
        </div>

        {/* Action row */}
        <div className="mt-7 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground text-sm sm:text-base font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
            style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
          >
            <Download className="h-4 w-4" />
            <span>Download HD</span>
          </button>
          <button
            type="button"
            onClick={copyShareLink}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-card text-foreground border-[2.5px] border-foreground text-sm sm:text-base font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
            style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
            aria-label="Share this piece"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Style cross-sell row — small, optional */}
        {styleDef && (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            Like this style?{' '}
            <Link
              to={`/best-ai-art-generator?style=${styleDef.id}`}
              className="text-[color:var(--terracotta-500)] underline font-bold"
            >
              Try {styleLabel} on your photo →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── Image stage (chunky neo frame) ───────── */

function ImageStage({
  url,
  label,
  labelStyle,
}: {
  url: string;
  label: string;
  labelStyle: 'dark' | 'terracotta';
}) {
  return (
    <div
      className="relative w-full aspect-square bg-[color:var(--cream-200)] border-[3px] border-foreground overflow-hidden"
      style={{ boxShadow: '8px 8px 0 0 var(--cocoa-900)' }}
    >
      {url && (
        <img
          src={url}
          alt={`${label} result`}
          className="w-full h-full object-cover"
        />
      )}
      <span
        className="absolute top-3 left-3 inline-block px-2.5 py-1 border-2 border-foreground text-[10px] tracking-[0.18em] uppercase font-bold"
        style={{
          background: labelStyle === 'dark' ? 'var(--cocoa-900)' : 'var(--terracotta-500)',
          color: labelStyle === 'dark' ? 'var(--cream-50)' : 'white',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ───────── Footer / final conversion CTA ───────── */

function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-[color:var(--cream-100)] py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative bg-card border-[3px] border-foreground p-8 sm:p-12 text-center overflow-hidden"
          style={{ boxShadow: '8px 8px 0 0 var(--terracotta-500)' }}
        >
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 h-48 w-48 rounded-full pointer-events-none opacity-[0.16]"
            style={{
              background:
                'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
            }}
          />
          <div className="relative">
            <span
              className="inline-block text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
              style={{
                boxShadow: '3px 3px 0 0 var(--cocoa-900)',
                transform: 'rotate(-2deg)',
              }}
            >
              Try it · no card
            </span>
            <h2
              className="font-display italic font-medium text-3xl sm:text-4xl leading-tight tracking-[-0.02em] text-foreground mb-3 max-w-md mx-auto"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Make one with{' '}
              <em
                className="not-italic"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--terracotta-500)',
                }}
              >
                your photo.
              </em>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
              Five free generations a day. No card. About thirty seconds.
            </p>
            <Link
              to="/best-ai-art-generator"
              className="inline-flex items-center gap-2.5 bg-[color:var(--terracotta-500)] text-white border-[3px] border-foreground px-6 py-3.5 text-base font-bold no-underline transition-transform active:translate-x-1.5 active:translate-y-1.5"
              style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Open the generator</span>
            </Link>
            <div className="mt-5 text-xs text-muted-foreground">
              Or browse{' '}
              <Link to="/" className="underline font-bold text-foreground">
                the homepage
              </Link>{' '}
              ·{' '}
              <Link to="/pricing" className="underline font-bold text-foreground">
                see pricing
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          oneclick<span style={{ color: 'var(--terracotta-500)' }}>·</span>art ·{' '}
          {STYLE_CATALOG.length} styles · made for one-click art
        </div>
      </div>
    </footer>
  );
}
