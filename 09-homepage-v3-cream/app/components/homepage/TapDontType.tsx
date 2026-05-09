import { X } from 'lucide-react';

/**
 * "Tap, don't type." — the no-prompts pitch with an anti-pattern callout
 * showing what other tools force you to do (long prompt strings) vs the
 * OneClick·Art alternative (style chips).
 *
 * Lifted directly from the live site's structure with cream + neo treatment.
 */
export default function TapDontType() {
  return (
    <section className="theme-cream relative bg-[color:var(--cream-100)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
        <div className="text-center mb-12">
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-3 py-1.5"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            No prompts
          </span>
          <h2
            className="font-display italic font-medium leading-none tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-4"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
            }}
          >
            Tap, <em style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>don't type.</em>
          </h2>
          <p className="text-base sm:text-lg text-[color:var(--cocoa-700)] max-w-xl mx-auto leading-relaxed">
            Choose a look from the grid—no prompt box, no jargon. Upload once, tap the style you want, and download when it's ready.
          </p>
          <div className="font-mono text-xs text-[color:var(--cocoa-700)] mt-4">
            PNG · JPG · WEBP — up to 15MB
          </div>
        </div>

        {/* Anti-pattern: the prompt-writing trap, struck through */}
        <div className="max-w-3xl mx-auto">
          <div
            className="bg-card border-[2.5px] border-[color:var(--cocoa-900)] p-5 sm:p-6 relative overflow-hidden"
            style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
          >
            <span
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--tomato-500)] mb-3 border-2 border-[color:var(--tomato-500)] bg-card px-2 py-1"
            >
              <X className="h-3 w-3" />
              <span>The prompt-writing trap</span>
            </span>
            <code
              className="block font-mono text-sm sm:text-base text-[color:var(--cocoa-700)] leading-relaxed"
              style={{
                textDecoration: 'line-through',
                textDecorationColor: 'var(--tomato-500)',
                textDecorationThickness: '1.5px',
                textDecorationSkipInk: 'none',
              }}
            >
              oil painting of my dog wearing sunglasses, 8k, trending on artstation, hyperrealistic, professional photography, masterpiece, highly detailed…
            </code>
          </div>
          <div className="text-center mt-5 text-sm text-[color:var(--cocoa-700)]">
            Skip all that. <strong className="font-display italic font-medium text-[color:var(--cocoa-900)]">Just tap a style.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
