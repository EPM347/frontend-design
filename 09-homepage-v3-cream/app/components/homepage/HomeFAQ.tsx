import { Link } from 'react-router';
import { PricingFAQ } from '~/components/pricing';

/**
 * Homepage FAQ. Same component as the pricing page (`PricingFAQ` from
 * Round 06), but with the live-site's actual 6 questions and answers
 * passed in.
 */
const HOMEPAGE_FAQ = [
  {
    question: 'How do credits work?',
    answer: (
      <>
        One credit equals one finished image. Make a new piece? One credit.
        Upscale to 4K? One more.{' '}
        <strong className="font-display italic font-medium text-foreground">
          Your monthly credits cover both
        </strong>{' '}
        — use them however you like.
      </>
    ),
  },
  {
    question: 'What happens to unused credits?',
    answer: (
      <>
        On{' '}
        <strong className="font-display italic font-medium text-foreground">
          Pro and Artisan Pro
        </strong>
        , unused credits roll into next month. On Starter, they reset every
        billing cycle.
      </>
    ),
  },
  {
    question: 'Can I use my art commercially?',
    answer: (
      <>
        Yes — personal or commercial. The art's yours to use, sell, or print.
        (Heads-up: if your photo includes someone else's face or copyrighted
        work, those third-party rights still apply. See our{' '}
        <Link to="/terms" className="underline font-bold">
          Terms
        </Link>{' '}
        for the legal version.)
      </>
    ),
  },
  {
    question: 'Do you offer refunds?',
    answer: (
      <>
        Yes. Email{' '}
        <a
          href="mailto:hello@oneclickart.com"
          className="text-[color:var(--terracotta-500)] underline font-bold"
        >
          hello@oneclickart.com
        </a>{' '}
        within 14 days of any charge — include the account email and the date —
        and we'll send your money back.{' '}
        <strong className="font-display italic font-medium text-foreground">
          No interrogation.
        </strong>
      </>
    ),
  },
  {
    question: 'Can I cancel anytime?',
    answer: (
      <>
        Anytime, from your dashboard. No fee, no fuss. Paid features stay live
        until the end of your billing period.
      </>
    ),
  },
  {
    question: 'Can I change my plan?',
    answer: (
      <>
        Yes. Upgrade or downgrade from your dashboard. We'll show you the
        prorated math at checkout before anything's charged.
      </>
    ),
  },
];

export default function HomeFAQ() {
  return (
    <section
      id="faq"
      className="theme-cream relative bg-[color:var(--cream-100)] border-b-2 border-[color:var(--cocoa-900)] overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
        <PricingFAQ items={HOMEPAGE_FAQ} />
        <div className="text-center mt-8 text-sm text-[color:var(--cocoa-700)]">
          Have more questions?{' '}
          <Link to="/faq" className="underline font-bold text-foreground">
            See our full FAQ
          </Link>{' '}
          or{' '}
          <a
            href="mailto:hello@oneclickart.com"
            className="underline font-bold text-foreground"
          >
            contact support
          </a>
          .
        </div>
      </div>
    </section>
  );
}
