import { Link } from 'react-router';

const FOOTER_LINKS: Array<{
  heading: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    heading: 'Make',
    links: [
      { label: 'Create Art', href: '/best-ai-art-generator' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Styles', href: '/#styles' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: 'mailto:hello@oneclickart.com' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Data', href: '/data' },
    ],
  },
];

/**
 * Homepage footer — replaces the existing `~/components/homepage/footer.tsx`.
 * Cream-themed, real address + email pulled from the live site.
 */
export default function Footer() {
  return (
    <footer className="theme-cream bg-[color:var(--cocoa-900)] text-[color:var(--cream-50)] py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 sm:gap-10 mb-12">
          <div>
            <Link
              to="/"
              className="inline-block font-display italic font-bold text-2xl sm:text-3xl tracking-[-0.025em] text-[color:var(--cream-50)] no-underline mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              OneClick
              <span style={{ color: 'var(--terracotta-500)' }}>·</span>Art
            </Link>
            <p
              className="font-display italic text-base leading-relaxed mb-4 max-w-xs"
              style={{
                fontFamily: "'Fraunces', serif",
                color: 'var(--cream-100)',
              }}
            >
              Photos in. Art out. No typing.
            </p>
            <address className="not-italic text-xs leading-relaxed mb-2 text-[color:var(--cream-200)]">
              30 N Gould St #53707<br />
              Sheridan, WY 82801, USA
            </address>
            <a
              href="mailto:hello@oneclickart.com"
              className="text-xs underline text-[color:var(--cream-200)] hover:text-[color:var(--cream-50)]"
            >
              hello@oneclickart.com
            </a>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.heading}>
              <div
                className="text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--butter-500)] mb-4"
              >
                {column.heading}
              </div>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-sm text-[color:var(--cream-100)] hover:text-[color:var(--cream-50)] no-underline"
                      >
                        {link.label}
                      </a>
                    ) : link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        className="text-sm text-[color:var(--cream-100)] hover:text-[color:var(--cream-50)] no-underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-[color:var(--cream-100)] hover:text-[color:var(--cream-50)] no-underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[color:var(--cream-200)]/20 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-[color:var(--cream-200)]">
          <span>
            © {new Date().getFullYear()} OneClickArt.{' '}
            <span
              className="font-display italic"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Photos in. Art out. No typing.
            </span>
          </span>
          <span className="flex gap-4">
            <Link to="/privacy" className="hover:text-[color:var(--cream-50)]">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[color:var(--cream-50)]">
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
