import { Link } from 'react-router';
import { CreditCard } from 'lucide-react';

interface BillingCardProps {
  nextChargeAmount?: string; // formatted, e.g. "$9.99"
  nextChargeDate?: string; // formatted, e.g. "Jun 7"
  cardBrand?: string; // "VISA", "Mastercard", etc.
  cardLast4?: string;
  cardExpiry?: string; // e.g. "09/28"
  billingEmail?: string;
  invoiceCount?: number;
  onUpdatePayment?: () => void;
}

const BRAND_GRADIENTS: Record<string, string> = {
  VISA: 'linear-gradient(135deg, #2a3987, #4d5cb6)',
  MC: 'linear-gradient(135deg, #c2002f, #f79e1b)',
  AMEX: 'linear-gradient(135deg, #006fcf, #003e80)',
  DEFAULT: 'linear-gradient(135deg, #4a4a4a, #6e6e6e)',
};

export function BillingCard({
  nextChargeAmount = '—',
  nextChargeDate,
  cardBrand,
  cardLast4,
  cardExpiry,
  billingEmail,
  invoiceCount = 0,
  onUpdatePayment,
}: BillingCardProps) {
  const brandKey = cardBrand?.toUpperCase() ?? 'DEFAULT';
  const brandGradient = BRAND_GRADIENTS[brandKey] ?? BRAND_GRADIENTS.DEFAULT;

  return (
    <div
      className="bg-[color:var(--cream-100)] border-[2.5px] border-foreground p-5 sm:p-6 flex flex-col gap-4"
      style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
    >
      <h3 className="font-display italic font-medium text-[22px] leading-none text-foreground">
        Billing
      </h3>

      <div className="flex justify-between items-start gap-3 pb-3 border-b border-foreground/10">
        <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-muted-foreground">
          Next charge
        </span>
        <span className="text-right font-mono text-[13px] text-foreground">
          <strong className="font-display italic font-medium text-[15px] text-foreground block">
            {nextChargeAmount}
          </strong>
          {nextChargeDate}
        </span>
      </div>

      <div className="flex justify-between items-start gap-3 pb-3 border-b border-foreground/10">
        <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-muted-foreground">
          Method
        </span>
        <div className="text-right">
          {cardLast4 ? (
            <>
              <span className="inline-flex items-center gap-1.5 font-mono text-[13px] text-foreground">
                <span
                  className="inline-flex items-center justify-center text-white text-[8px] font-bold tracking-[0.08em] border-[1.5px] border-foreground"
                  style={{
                    background: brandGradient,
                    width: 32,
                    height: 22,
                  }}
                >
                  {cardBrand?.toUpperCase() ?? <CreditCard className="h-3 w-3" />}
                </span>
                •••• {cardLast4}
              </span>
              {cardExpiry && (
                <div className="text-[11px] text-muted-foreground mt-1">
                  Expires {cardExpiry}
                </div>
              )}
            </>
          ) : (
            <span className="text-[13px] text-muted-foreground italic">
              No card on file
            </span>
          )}
        </div>
      </div>

      {billingEmail && (
        <div className="flex justify-between items-start gap-3 pb-3 border-b border-foreground/10">
          <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-muted-foreground">
            Email
          </span>
          <span className="font-mono text-[13px] text-foreground text-right break-all">
            {billingEmail}
          </span>
        </div>
      )}

      {invoiceCount > 0 && (
        <div className="flex justify-between items-start gap-3 pb-1">
          <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-muted-foreground">
            Invoices
          </span>
          <Link
            to="/dashboard/settings?tab=usage"
            className="text-right font-mono text-[13px] underline font-bold text-[color:var(--terracotta-500)]"
          >
            View {invoiceCount} →
          </Link>
        </div>
      )}

      {onUpdatePayment && (
        <button
          type="button"
          onClick={onUpdatePayment}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold mt-1 cursor-pointer"
          style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
        >
          Update payment method
        </button>
      )}
    </div>
  );
}
