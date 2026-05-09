import { Generator } from '~/components/generator';

/**
 * Homepage embed of the Generator.
 *
 * Slots between the existing Hero and Content sections on `/`. Adds its own
 * lightweight hero strip (the Generator's internal hero is hidden via
 * `mode="marketing"`'s default — but we add a section anchor + a section-level
 * intro so the homepage flow reads cleanly).
 *
 * The `id="try"` anchor is the scroll target for any CTA on the homepage that
 * says "Try it now" or similar — change those to `<a href="#try">` to scroll
 * the visitor here without a route change.
 */
export default function HomeGenerator() {
  return (
    <section
      id="try"
      aria-label="Try the AI art generator"
      className="theme-cream relative bg-[color:var(--cream-50)] border-y-[3px] border-[color:var(--cocoa-900)] overflow-hidden"
    >
      {/* Decorative grid background to match the marketing vibe */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(58,46,38,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(58,46,38,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative radial glows in the corners */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -left-20 h-72 w-72 rounded-full pointer-events-none opacity-[0.10]"
        style={{
          background:
            'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full pointer-events-none opacity-[0.08]"
        style={{
          background:
            'radial-gradient(circle, var(--sage-500) 0%, var(--basil-500) 70%, transparent 100%)',
        }}
      />

      <div className="relative">
        {/* Section eyebrow + tagline */}
        <div className="px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 pb-2 text-center max-w-3xl mx-auto">
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-2.5 py-1"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            ✦ Try it · no signup needed yet
          </span>
          <h2
            className="font-display italic font-medium text-4xl sm:text-5xl md:text-6xl leading-[0.96] tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-3"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Don't take our word for it.{' '}
            <em
              className="not-italic"
              style={{
                color: 'var(--terracotta-500)',
                fontStyle: 'italic',
                fontFamily: "'Fraunces', serif",
              }}
            >
              See your photo.
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[color:var(--cocoa-700)] max-w-xl mx-auto leading-relaxed">
            Drop a photo, pick a style, see what happens. Free account when you want
            to keep the result.
          </p>
        </div>

        {/* The actual Generator component */}
        <Generator mode="marketing" />
      </div>
    </section>
  );
}
