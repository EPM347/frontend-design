import { Link } from 'react-router';
import { ArrowUpRight, Check } from 'lucide-react';

/**
 * Homepage hero — replaces the existing `integrations.tsx` hero entirely.
 *
 * Mirrors the live site's promise ("Tap a style. Get art.") in cream + neo
 * styling. The headline carries the brand voice; one boxed-word stamp on
 * `art.` so the meaning lands.
 */
export default function Hero() {
  return (
    <section className="theme-cream relative bg-[color:var(--cream-50)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden">
      {/* Decorative radial glows */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-20 h-[28rem] w-[28rem] rounded-full pointer-events-none opacity-[0.10]"
        style={{
          background:
            'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 60%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-20 h-[24rem] w-[24rem] rounded-full pointer-events-none opacity-[0.08]"
        style={{
          background:
            'radial-gradient(circle, var(--sage-500) 0%, var(--basil-500) 60%, transparent 100%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-24 text-center">
        <span
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-6 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-3 py-1.5"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          ✦ Photo to art · no prompts
        </span>

        <h1
          className="font-display italic font-medium leading-[0.92] tracking-[-0.03em] text-[color:var(--cocoa-900)] mb-6 max-w-[14ch] mx-auto"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(56px, 8vw, 104px)',
          }}
        >
          Tap a style.
          <br />
          Get{' '}
          <span
            className="inline-block px-2 align-baseline"
            style={{
              background: 'var(--terracotta-500)',
              color: 'white',
              border: '4px solid var(--cocoa-900)',
              boxShadow: '8px 8px 0 0 var(--cocoa-900)',
              transform: 'rotate(-2deg)',
              fontStyle: 'normal',
              padding: '0.04em 0.18em',
              margin: '0 0.04em',
            }}
          >
            art.
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-[color:var(--cocoa-700)] max-w-2xl mx-auto leading-relaxed mb-10">
          No prompts, no typing, no learning curve. Upload a photo, pick the
          look you want, download what you love.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            to="/best-ai-art-generator"
            prefetch="viewport"
            className="inline-flex items-center justify-center gap-2.5 bg-[color:var(--terracotta-500)] text-white border-[3px] border-[color:var(--cocoa-900)] px-7 py-4 text-base font-bold no-underline transition-transform active:translate-x-1.5 active:translate-y-1.5"
            style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
          >
            <ArrowUpRight className="h-5 w-5" />
            <span>Upload a photo</span>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-5 py-4 bg-card text-[color:var(--cocoa-900)] border-2 border-[color:var(--cocoa-900)] text-base font-semibold no-underline transition-transform active:translate-x-1 active:translate-y-1"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            or see it in action →
          </a>
        </div>

        <ul
          className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center text-sm text-[color:var(--cocoa-700)] list-none"
          aria-label="Key benefits"
        >
          {[
            'No prompt writing needed',
            'Download your finished art',
            'Print, share, or make merch',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 justify-center">
              <Check
                className="h-4 w-4 shrink-0"
                style={{ color: 'var(--sage-500)' }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
