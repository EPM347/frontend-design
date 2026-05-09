import { Link } from 'react-router';
import { Sparkles, Maximize2, Circle } from 'lucide-react';

const FEATURES = [
  {
    label: 'HD outputs',
    icon: Sparkles,
    description:
      'One credit pays for one HD render. Monthly limits depend on your plan.',
    chip: '1 credit · 1 HD image',
  },
  {
    label: 'Upscale',
    icon: Maximize2,
    description:
      'Make images bigger at 2×, 3×, or 4×. Usage lines up with your monthly credits.',
    chip: 'Up to 4× resolution',
  },
  {
    label: 'Background removal',
    icon: Circle,
    description:
      'Clean edges for prints and mockups when your plan includes it.',
    chip: 'On eligible plans',
  },
] as const;

/**
 * "More power, when you want it." — three-column feature callouts for
 * what subscribers get extra. Same simple flow, extra power.
 */
export default function MorePower() {
  return (
    <section className="theme-cream relative bg-[color:var(--cream-100)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
        <div className="text-center mb-12">
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-3 py-1.5"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            For makers who want more
          </span>
          <h2
            className="font-display italic font-medium leading-none tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-3"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
            }}
          >
            More power,{' '}
            <em style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>
              when you want it.
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[color:var(--cocoa-700)] max-w-2xl mx-auto leading-relaxed">
            Same simple flow—extra power when you subscribe. Credits apply per
            finished image, including upscales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="bg-card border-[2.5px] border-[color:var(--cocoa-900)] p-6 sm:p-7"
                style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
              >
                <div
                  className="inline-flex items-center justify-center h-11 w-11 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] mb-4"
                  style={{
                    boxShadow: '3px 3px 0 0 var(--cocoa-900)',
                    transform: 'rotate(-3deg)',
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="font-display italic font-medium text-2xl leading-none mb-3 text-[color:var(--cocoa-900)]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {f.label}
                </h3>
                <p className="text-sm text-[color:var(--cocoa-700)] leading-relaxed mb-4">
                  {f.description}
                </p>
                <span className="inline-block text-[11px] tracking-[0.12em] uppercase font-bold text-[color:var(--cocoa-700)] border-2 border-[color:var(--cocoa-900)] bg-[color:var(--cream-50)] px-2.5 py-1">
                  {f.chip}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/pricing"
            prefetch="viewport"
            className="inline-flex items-center justify-center gap-2 bg-card text-[color:var(--cocoa-900)] border-2 border-[color:var(--cocoa-900)] px-5 py-3 text-sm font-bold no-underline transition-transform active:translate-x-1 active:translate-y-1"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            See plans & pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
