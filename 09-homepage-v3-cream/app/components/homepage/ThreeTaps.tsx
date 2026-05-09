import { Link } from 'react-router';
import { Upload, MousePointer2, Download } from 'lucide-react';

const STEPS = [
  {
    numeral: 'i',
    label: 'Upload',
    icon: Upload,
    description:
      "Drop or choose a photo—we accept PNG, JPG, and WEBP.",
  },
  {
    numeral: 'ii',
    label: 'Choose look',
    icon: MousePointer2,
    description: 'Tap the preset you want. No typing, no prompt engineering.',
  },
  {
    numeral: 'iii',
    label: 'Your art',
    icon: Download,
    description:
      'Download HD (and optional 4K upscales on plans that include them).',
  },
] as const;

/**
 * "Three taps. One photo. Done." — the process section.
 * Three columns with stepped numerals (i / ii / iii) in Fraunces italic.
 */
export default function ThreeTaps() {
  return (
    <section
      id="how-it-works"
      className="theme-cream relative bg-[color:var(--cream-50)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
        <div className="text-center mb-14">
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-3 py-1.5"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            How it works
          </span>
          <h2
            className="font-display italic font-medium leading-none tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-2"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
            }}
          >
            Three taps.
          </h2>
          <h2
            className="font-display italic font-medium leading-none tracking-[-0.025em] text-[color:var(--cocoa-900)]"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
            }}
          >
            One photo. <em style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>Done.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.numeral}
                className="relative bg-card border-[2.5px] border-[color:var(--cocoa-900)] p-6 sm:p-8"
                style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
              >
                <div
                  className="font-display italic font-semibold text-[color:var(--terracotta-500)] absolute top-3 right-5 leading-none"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '64px',
                    WebkitTextStroke: '1.5px var(--cocoa-900)',
                  }}
                  aria-hidden="true"
                >
                  {step.numeral}
                </div>
                <div
                  className="inline-flex items-center justify-center h-11 w-11 bg-[color:var(--cream-100)] border-2 border-[color:var(--cocoa-900)] mb-5"
                  style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="font-display italic font-medium text-2xl leading-none mb-3 text-[color:var(--cocoa-900)]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {step.label}
                </h3>
                <p className="text-sm sm:text-base text-[color:var(--cocoa-700)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/best-ai-art-generator"
            prefetch="viewport"
            className="inline-flex items-center justify-center gap-2.5 bg-[color:var(--terracotta-500)] text-white border-[3px] border-[color:var(--cocoa-900)] px-7 py-3.5 text-base font-bold no-underline transition-transform active:translate-x-1.5 active:translate-y-1.5"
            style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
          >
            Upload a photo
          </Link>
          <div className="text-xs text-[color:var(--cocoa-700)] mt-3">
            Printing or business use: see{' '}
            <Link to="/terms" className="underline">
              Terms
            </Link>{' '}
            for your plan.
          </div>
        </div>
      </div>
    </section>
  );
}
