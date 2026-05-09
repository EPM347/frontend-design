import { Link } from 'react-router';

interface StyleEntry {
  id: string;
  name: string;
  description: string;
}

/**
 * Eight homepage styles with one-line descriptions, matching the live site.
 * The full library is "12+ styles" — three are reserved for future drops.
 *
 * Thumbnails point at R2 paths (placeholder convention from Round 05). Wire to
 * real R2 URLs at apply time.
 */
const STYLES: StyleEntry[] = [
  { id: 'oneline', name: 'One Line Art', description: 'One flowing line. Minimal and modern.' },
  { id: 'ghibli', name: 'Studio Ghibli', description: 'Soft anime warmth, hand-drawn feel.' },
  { id: 'sketch', name: 'Realistic Sketch', description: 'Fine pencil detail and gentle shading.' },
  { id: 'cartoon3d', name: '3D Cartoon', description: 'Bold colors, toy-like 3D depth.' },
  { id: 'popart', name: 'Pop Art', description: 'Bright blocks and comic punch.' },
  { id: 'oil', name: 'Oil Painting', description: 'Classic oils, ready to frame.' },
  { id: 'silhouette', name: 'Silhouette', description: 'Strong shape, no clutter.' },
  { id: 'watercolor', name: 'Watercolor', description: 'Soft washes and quiet tones.' },
];

export default function StylePreview() {
  return (
    <section
      id="styles"
      className="theme-cream relative bg-[color:var(--cream-100)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
        <div className="text-center mb-12">
          <span
            className="inline-block text-[11px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-4 bg-[color:var(--butter-500)] border-2 border-[color:var(--cocoa-900)] px-3 py-1.5"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            Eight looks · 12+ styles in the tool
          </span>
          <h2
            className="font-display italic font-medium leading-none tracking-[-0.025em] text-[color:var(--cocoa-900)] mb-3"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(40px, 5vw, 60px)',
            }}
          >
            One photo,{' '}
            <em style={{ color: 'var(--terracotta-500)', fontStyle: 'italic' }}>
              eight looks.
            </em>
          </h2>
          <p className="text-base sm:text-lg text-[color:var(--cocoa-700)] max-w-xl mx-auto leading-relaxed">
            Preview cycles through looks—upload your own to try them.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {STYLES.map((style, i) => {
            // Slight asymmetric rotation for stamp-like layout — only on odd tiles
            const rot = i % 4 === 1 ? '0.6deg' : i % 4 === 2 ? '-0.4deg' : '0deg';
            return (
              <div
                key={style.id}
                className="group bg-card border-[2.5px] border-[color:var(--cocoa-900)] overflow-hidden"
                style={{
                  boxShadow: '4px 4px 0 0 var(--cocoa-900)',
                  transform: `rotate(${rot})`,
                }}
              >
                <div
                  className="aspect-square bg-cover bg-center bg-[color:var(--cream-200)] border-b-[2.5px] border-[color:var(--cocoa-900)] relative"
                  style={{
                    backgroundImage: `url(/styles/${style.id}/thumb.jpg)`,
                  }}
                >
                  <span className="absolute top-2.5 left-2.5 inline-block px-2 py-1 text-[10px] tracking-[0.16em] uppercase font-bold text-[color:var(--cream-50)] bg-[color:var(--cocoa-900)] border-2 border-[color:var(--cocoa-900)]">
                    {style.name}
                  </span>
                </div>
                <div className="px-4 py-4">
                  <div
                    className="font-display italic font-medium text-lg leading-tight mb-1 text-[color:var(--cocoa-900)]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {style.name}
                  </div>
                  <p className="text-xs text-[color:var(--cocoa-700)] leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/best-ai-art-generator"
            prefetch="viewport"
            className="inline-flex items-center justify-center gap-2 bg-[color:var(--terracotta-500)] text-white border-[3px] border-[color:var(--cocoa-900)] px-6 py-3.5 text-base font-bold no-underline transition-transform active:translate-x-1.5 active:translate-y-1.5"
            style={{ boxShadow: '6px 6px 0 0 var(--cocoa-900)' }}
          >
            See styles in the tool →
          </Link>
          <div className="text-xs text-[color:var(--cocoa-700)] mt-3">
            HD download after you create an image. Usage depends on your plan.
          </div>
        </div>
      </div>
    </section>
  );
}
