import { Link } from 'react-router';
import { Shirt, Frame, Send } from 'lucide-react';

const USES = [
  {
    label: 'Custom merch',
    icon: Shirt,
    description: 'Tees, mugs, and more—with a live mockup at checkout.',
  },
  {
    label: 'Print & wall art',
    icon: Frame,
    description: 'Download and print at home, or use any lab you trust.',
  },
  {
    label: 'Share or gift',
    icon: Send,
    description: 'Posts, chats, cards, or albums—same file, your call.',
  },
] as const;

/**
 * "Hang it. Wear it. Send it." — three-column use case callouts.
 * What people do with the art after they make it.
 */
export default function UseCases() {
  return (
    <section className="theme-cream relative bg-[color:var(--cream-50)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
        <div className="text-center mb-12">
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-3 py-1.5"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            What you can do with it
          </span>
          <h2
            className="font-display italic font-medium leading-none tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-3"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
            }}
          >
            Hang it. Wear it.{' '}
            <em style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>
              Send it.
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[color:var(--cocoa-700)] max-w-2xl mx-auto leading-relaxed">
            Create your image first—then print it, wear it, or send it. Merch
            flows open from your result screen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {USES.map((u, i) => {
            const Icon = u.icon;
            const rotations = ['-2deg', '1.5deg', '-1deg'];
            return (
              <div
                key={u.label}
                className="bg-card border-[2.5px] border-[color:var(--cocoa-900)] p-6 sm:p-7 text-center"
                style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
              >
                <div
                  className="inline-flex items-center justify-center h-14 w-14 bg-[color:var(--terracotta-500)] border-[3px] border-[color:var(--cocoa-900)] mb-5"
                  style={{
                    boxShadow: '4px 4px 0 0 var(--cocoa-900)',
                    transform: `rotate(${rotations[i]})`,
                  }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3
                  className="font-display italic font-medium text-2xl leading-none mb-3 text-[color:var(--cocoa-900)]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {u.label}
                </h3>
                <p className="text-sm text-[color:var(--cocoa-700)] leading-relaxed">
                  {u.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-12">
          <Link
            to="/best-ai-art-generator"
            prefetch="viewport"
            className="inline-flex items-center justify-center gap-2 bg-[color:var(--terracotta-500)] text-white border-[3px] border-[color:var(--cocoa-900)] px-6 py-3.5 text-base font-bold no-underline transition-transform active:translate-x-1.5 active:translate-y-1.5"
            style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
          >
            Create your first image
          </Link>
          <Link
            to="/pricing"
            prefetch="viewport"
            className="inline-flex items-center justify-center gap-2 bg-card text-[color:var(--cocoa-900)] border-2 border-[color:var(--cocoa-900)] px-5 py-3.5 text-sm font-semibold no-underline transition-transform active:translate-x-1 active:translate-y-1"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            Compare plans for HD and pro tools
          </Link>
        </div>
      </div>
    </section>
  );
}
