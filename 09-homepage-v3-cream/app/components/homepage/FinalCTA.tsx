import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

/**
 * "One photo away" — final conversion CTA.
 * Repeat of the hero promise, single primary CTA.
 */
export default function FinalCTA() {
  return (
    <section className="theme-cream relative bg-[color:var(--cream-50)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28">
        <div
          className="relative bg-card border-[3.5px] border-[color:var(--cocoa-900)] p-10 sm:p-14 text-center overflow-hidden"
          style={{ boxShadow: '12px 12px 0 0 var(--terracotta-500)' }}
        >
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 h-64 w-64 rounded-full pointer-events-none opacity-[0.18]"
            style={{
              background:
                'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
            }}
          />
          <div className="relative">
            <span
              className="inline-block text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3.5 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-2.5 py-1"
              style={{
                boxShadow: '3px 3px 0 0 var(--cocoa-900)',
                transform: 'rotate(-2deg)',
              }}
            >
              One photo away
            </span>
            <h2
              className="font-display italic font-medium leading-tight tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-4 max-w-md mx-auto"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(36px, 5vw, 56px)',
              }}
            >
              Tap a style.{' '}
              <em
                className="not-italic"
                style={{ fontStyle: 'italic', color: 'var(--terracotta-500)' }}
              >
                Get art.
              </em>
            </h2>
            <p className="text-base sm:text-lg text-[color:var(--cocoa-700)] max-w-lg mx-auto mb-8 leading-relaxed">
              Free to try. Three taps to your first piece.
            </p>
            <Link
              to="/best-ai-art-generator"
              prefetch="viewport"
              className="inline-flex items-center gap-2.5 bg-[color:var(--terracotta-500)] text-white border-[3px] border-[color:var(--cocoa-900)] px-7 py-4 text-base font-bold no-underline transition-transform active:translate-x-1.5 active:translate-y-1.5"
              style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Upload a photo</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
