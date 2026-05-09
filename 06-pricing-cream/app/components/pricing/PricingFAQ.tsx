import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '~/lib/utils';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const DEFAULT_ITEMS: FAQItem[] = [
  {
    question: 'Can I cancel any time?',
    answer: (
      <>
        Yes — cancel any time from your{' '}
        <strong className="font-display italic font-medium text-foreground">
          Settings → Subscription
        </strong>{' '}
        tab. Your access keeps working until the end of the cycle you've already paid
        for, then it stops. No surprises.
      </>
    ),
  },
  {
    question: 'What happens if I run out of credits?',
    answer: (
      <>
        On a paid plan: you'll see a friendly nudge to upgrade or wait until your
        next monthly reset. On the free tier: you'll come back tomorrow — daily
        cap resets at midnight UTC.
      </>
    ),
  },
  {
    question: 'Is there a free trial?',
    answer: (
      <>
        Free forever — <strong className="font-display italic font-medium text-foreground">5 generations a day</strong> on the free tier with no card required.
        That's enough to make a real piece, share it, and decide if you want more.
      </>
    ),
  },
  {
    question: 'Can I change plans later?',
    answer: (
      <>
        Any time. Switch up or down from{' '}
        <strong className="font-display italic font-medium text-foreground">
          Settings → Subscription
        </strong>
        . Upgrades take effect immediately and we prorate the difference. Downgrades
        take effect at the start of your next cycle so you don't lose what you've already paid for.
      </>
    ),
  },
  {
    question: 'Do credits expire?',
    answer: (
      <>
        <strong className="font-display italic font-medium text-foreground">Credit packs never expire</strong>. They sit in your account waiting for you. Subscription credits
        roll over up to 2× your monthly cap (Pro Pack and Studio only). Anything past the cap is forfeit.
      </>
    ),
  },
  {
    question: 'Can I use the art commercially?',
    answer: (
      <>
        Free, Starter, and Pro Pack: personal use only. <strong className="font-display italic font-medium text-foreground">Studio</strong> includes a full
        commercial license — sell prints, use in client work, put it on a t-shirt, no
        attribution required.
      </>
    ),
  },
  {
    question: 'What payment methods do you take?',
    answer: (
      <>
        Card (Visa, Mastercard, Amex), Apple Pay, Google Pay, and Link — handled by{' '}
        <strong className="font-display italic font-medium text-foreground">Polar</strong>.
        Refunds within 7 days, no questions asked.
      </>
    ),
  },
  {
    question: 'My result looks weird — can I redo it?',
    answer: (
      <>
        Yes. From your gallery, click the piece, then{' '}
        <strong className="font-display italic font-medium text-foreground">Redo</strong>.
        It runs the same prompt again and gives you a new variation. Counts as one generation against your quota.
      </>
    ),
  },
];

export function PricingFAQ({ items = DEFAULT_ITEMS }: { items?: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <span
          className="inline-block text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-3 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
        >
          Frequently asked
        </span>
        <h2 className="font-display italic font-medium text-3xl sm:text-4xl leading-none tracking-[-0.02em] text-foreground">
          Real questions, honest answers.
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={cn(
                'bg-card border-[2.5px] border-foreground transition-shadow',
                isOpen && 'shadow-none',
              )}
              style={{
                boxShadow: isOpen
                  ? '6px 6px 0 0 var(--terracotta-500)'
                  : '4px 4px 0 0 var(--cocoa-900)',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-display italic font-medium text-lg sm:text-xl leading-snug text-foreground">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform',
                    isOpen && 'rotate-180',
                  )}
                  style={{ color: isOpen ? 'var(--terracotta-500)' : 'var(--cocoa-700)' }}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed border-t border-foreground/10 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8 text-sm text-muted-foreground">
        Still have questions?{' '}
        <a
          href="mailto:hello@oneclickart.com"
          className="font-bold text-[color:var(--terracotta-500)] underline"
        >
          hello@oneclickart.com
        </a>{' '}
        — real human, real response.
      </div>
    </div>
  );
}
