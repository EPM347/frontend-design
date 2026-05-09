import { Link } from 'react-router';
import { Sparkles, Upload } from 'lucide-react';

export function CreationsEmptyState() {
  return (
    <div className="relative">
      {/* Cream background card with chunky neo treatment */}
      <div
        className="bg-card border-[3.5px] border-foreground py-16 px-6 sm:px-12 text-center overflow-hidden relative"
        style={{ boxShadow: '8px 8px 0 0 var(--cocoa-900)' }}
      >
        {/* Decorative radial glow (terracotta/butter) — same primitive as the dashboard hero */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 h-56 w-56 rounded-full pointer-events-none opacity-15"
          style={{
            background:
              'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full pointer-events-none opacity-10"
          style={{
            background:
              'radial-gradient(circle, var(--sage-500) 0%, var(--basil-500) 70%, transparent 100%)',
          }}
        />

        <div className="relative z-10 max-w-md mx-auto flex flex-col items-center gap-5">
          <Sparkles className="h-10 w-10 text-[color:var(--terracotta-500)]" />
          <h2 className="font-display italic font-medium text-3xl sm:text-4xl leading-none text-foreground">
            Make your <span
              className="inline-block bg-[color:var(--terracotta-500)] text-white border-[3px] border-foreground px-2"
              style={{
                boxShadow: '4px 4px 0 0 var(--cocoa-900)',
                transform: 'rotate(-2deg)',
                fontStyle: 'normal',
              }}
            >
              first
            </span>{' '}
            piece.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Upload a photo, pick a style, and we'll have something gallery-worthy in under
            a minute. Pet portraits, family shots, the questionable selfie from 2014 —
            anything goes.
          </p>
          <Link
            to="/app/upload"
            prefetch="viewport"
            className="inline-flex items-center gap-2 bg-[color:var(--terracotta-500)] text-white border-[3px] border-foreground px-6 py-3 text-base font-bold no-underline transition-transform active:translate-x-[6px] active:translate-y-[6px]"
            style={{
              boxShadow: '6px 6px 0 0 var(--cocoa-900)',
            }}
          >
            <Upload className="h-4 w-4" />
            Upload a photo
          </Link>
        </div>
      </div>
    </div>
  );
}
