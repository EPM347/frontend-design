import { useState } from 'react';
import { Sparkles, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useSignUp } from '@clerk/react-router';
import { cn } from '~/lib/utils';
import { STYLE_BY_ID } from '~/config/style-catalog';
import { stageGeneration, clearStagedGeneration } from '~/utils/staged-generation';
import type { ImageSize, LikenessLevel, StylePreset, WorkflowState } from './types';

export interface GenerateOrSignupProps {
  workflowState: WorkflowState;
  isSignedIn: boolean;
  /** True if the signed-in user has run out of free generations and isn't subscribed. */
  outOfFreeQuota?: boolean;
  /** Optional ETA in seconds for the generating state. */
  etaSeconds?: number;
  /** The currently selected file — required to start generation. */
  file: File | null;
  /** Currently selected style — used in CTA copy. */
  style: StylePreset;
  /** Currently selected size + likeness — staged through OAuth. */
  size: ImageSize;
  likeness: LikenessLevel;
  /** If the user already uploaded the photo, pass the imageId so OAuth restoration skips re-upload. */
  imageId?: string;
  /** Called when a signed-in user clicks Generate. */
  onGenerate: () => void | Promise<void>;
  /** Called when guest user clicks Generate — Generator transitions to signupRequired. */
  onSignupRequired: () => void;
  /** Called when the user clicks "← Back · keep playing" inside the signup panel. */
  onSignupCancel: () => void;
}

export function GenerateOrSignup(props: GenerateOrSignupProps) {
  const {
    workflowState,
    isSignedIn,
    outOfFreeQuota,
    etaSeconds,
    file,
    style,
    onGenerate,
    onSignupRequired,
  } = props;

  const styleLabel = STYLE_BY_ID[style]?.label ?? style;

  // Guest just hit Generate — show the signup panel
  if (workflowState === 'signupRequired' && !isSignedIn) {
    return <SignupPanel {...props} />;
  }

  // In-flight states reuse the same row but disabled + animated
  if (workflowState === 'queued' || workflowState === 'generating') {
    const eta =
      typeof etaSeconds === 'number' && etaSeconds > 0 ? `~${etaSeconds}s left` : 'cooking…';
    return (
      <div className="px-5 sm:px-6 py-5 bg-[color:var(--cream-100)] border-t-2 border-foreground">
        <button
          type="button"
          disabled
          className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 bg-[color:var(--cream-200)] text-muted-foreground border-[3px] border-foreground text-base font-bold cursor-not-allowed"
          style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cooking… {eta}</span>
        </button>
      </div>
    );
  }

  // Idle / ready / error — show the Generate button
  const isGuestCta = !isSignedIn;
  const ctaCopy = isGuestCta
    ? `Sign up free → Generate ${styleLabel}`
    : outOfFreeQuota
      ? 'Out of free generations · upgrade'
      : `Generate ${styleLabel}`;
  const subCopy = isGuestCta
    ? '5 free a day · no card · ~10s signup'
    : outOfFreeQuota
      ? 'Pro Pack: 200 / month · $9.99'
      : `Same photo, new style · ~30s`;

  const disabled = !file;

  const handleClick = () => {
    if (!file) return;
    if (!isSignedIn) {
      onSignupRequired();
    } else if (outOfFreeQuota) {
      // Send to pricing page in a new tab so they don't lose their staged work
      window.open('/pricing', '_blank', 'noopener');
    } else {
      void onGenerate();
    }
  };

  return (
    <div className="px-5 sm:px-6 py-5 bg-[color:var(--cream-100)] border-t-2 border-foreground">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 border-[3px] border-foreground text-base font-bold transition-transform',
          disabled
            ? 'bg-[color:var(--cream-200)] text-muted-foreground cursor-not-allowed'
            : outOfFreeQuota
              ? 'bg-[color:var(--butter-500)] text-foreground cursor-pointer active:translate-x-1.5 active:translate-y-1.5'
              : 'bg-[color:var(--terracotta-500)] text-white cursor-pointer active:translate-x-1.5 active:translate-y-1.5',
        )}
        style={{
          boxShadow: disabled ? '4px 4px 0 0 var(--cocoa-900)' : '6px 6px 0 0 var(--cocoa-900)',
        }}
      >
        <Sparkles className="h-5 w-5" />
        <span>{disabled ? 'Drop a photo to generate' : ctaCopy}</span>
      </button>
      <div className="text-center text-[11px] text-muted-foreground tracking-wide mt-2.5">
        <strong className="font-display italic font-medium text-foreground">
          {disabled ? 'First piece free' : subCopy.split('·')[0].trim()}
        </strong>
        {!disabled && subCopy.includes('·') && <> · {subCopy.split('·').slice(1).join('·').trim()}</>}
      </div>
    </div>
  );
}

/**
 * The inline signup panel — replaces the Generate row when a guest user
 * clicks Generate. Photo + style are already staged in `sessionStorage`
 * via `stageGeneration()` before the OAuth redirect, so the same Generator
 * component on the same route can auto-fire the generation post-auth.
 */
function SignupPanel({
  file,
  style,
  size,
  likeness,
  imageId,
  onSignupCancel,
}: GenerateOrSignupProps) {
  const styleLabel = STYLE_BY_ID[style]?.label ?? style;
  const { signUp, isLoaded } = useSignUp();
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stageBeforeOAuth = async () => {
    if (!file) return;
    await stageGeneration({
      file,
      imageId,
      style,
      size,
      likeness,
    });
  };

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_apple') => {
    if (!isLoaded || !signUp) return;
    setError(null);
    setSubmitting(true);
    try {
      await stageBeforeOAuth();
      const callbackUrl = `${window.location.pathname}?staged=1`;
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: callbackUrl,
        redirectUrlComplete: callbackUrl,
      });
      // The browser navigates away here.
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not start signup. Try again.';
      setError(msg);
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setError(null);
    setSubmitting(true);
    try {
      await stageBeforeOAuth();
      await signUp.create({ emailAddress: email });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_link' });
      setEmailSent(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not send sign-up email. Try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative px-5 sm:px-6 py-6 bg-[color:var(--cream-100)] border-t-2 border-foreground overflow-hidden">
      {/* Decorative radial glow */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 h-44 w-44 rounded-full pointer-events-none opacity-[0.15]"
        style={{
          background:
            'radial-gradient(circle, var(--butter-500) 0%, var(--terracotta-500) 70%, transparent 100%)',
        }}
      />

      <div className="relative">
        <span
          className="inline-block text-[10px] tracking-[0.22em] uppercase font-bold text-[color:var(--terracotta-500)] mb-2.5 bg-[color:var(--butter-500)] border-2 border-foreground px-2.5 py-1"
          style={{
            boxShadow: '3px 3px 0 0 var(--cocoa-900)',
            transform: 'rotate(-2deg)',
          }}
        >
          Quick free account
        </span>
        <h2 className="font-display italic font-medium text-[26px] leading-none tracking-[-0.02em] text-foreground mb-2">
          <em
            className="not-italic font-display italic"
            style={{ color: 'var(--terracotta-500)' }}
          >
            Sign up,
          </em>{' '}
          see your {styleLabel}.
        </h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          <strong className="font-display italic font-medium text-foreground">
            5 free generations a day
          </strong>
          , full HD download, save your gallery. No card. Cancel any time.
        </p>

        {/* Staged context bar — reduces commit anxiety */}
        {file && (
          <div
            className="bg-card border-2 border-foreground px-3.5 py-2.5 flex items-center gap-3 mb-4"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            <div
              className="h-9 w-9 shrink-0 border-[1.5px] border-foreground bg-cover bg-center bg-muted"
              style={{ backgroundImage: file ? `url(${URL.createObjectURL(file)})` : undefined }}
            />
            <div className="text-xs text-muted-foreground leading-snug">
              <strong className="font-display italic font-medium text-foreground">
                {file.name}
              </strong>{' '}
              +{' '}
              <strong className="font-display italic font-medium text-foreground">
                {styleLabel}
              </strong>{' '}
              staged.
              <br />
              Generation kicks off the moment you're in.
            </div>
          </div>
        )}

        {emailSent ? (
          <div
            className="bg-card border-2 border-[color:var(--sage-500)] p-4 text-sm text-foreground leading-relaxed"
            style={{ boxShadow: '3px 3px 0 0 var(--cocoa-900)' }}
          >
            <strong className="font-display italic font-medium block mb-1">
              Check your email.
            </strong>
            We sent a sign-in link to <code className="font-mono">{email}</code>. Click it to
            finish signing up — your photo + style are saved.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuth('oauth_google')}
              disabled={!isLoaded || submitting}
              className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-card text-foreground border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
              style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
            >
              <span className="font-bold text-lg leading-none">G</span>
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('oauth_apple')}
              disabled={!isLoaded || submitting}
              className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-foreground text-[color:var(--cream-50)] border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
              style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
            >
              <span className="text-lg leading-none"></span>
              <span>Continue with Apple</span>
            </button>

            <div className="text-center text-[10px] tracking-[0.18em] uppercase font-bold text-muted-foreground my-1">
              or
            </div>

            {emailMode ? (
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-3 bg-card border-[2.5px] border-foreground text-sm font-sans text-foreground outline-none"
                />
                <button
                  type="submit"
                  disabled={!email || submitting}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1 disabled:opacity-60"
                  style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
                >
                  <Mail className="h-4 w-4" />
                  <span>{submitting ? 'Sending…' : 'Send sign-up link'}</span>
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setEmailMode(true)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
                style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
              >
                <Mail className="h-4 w-4" />
                Continue with email
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 text-xs text-[color:var(--tomato-500)] leading-relaxed">
            {error}
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground text-center leading-relaxed">
          By continuing, you agree to our{' '}
          <a
            href="/terms"
            className="text-[color:var(--terracotta-500)] font-bold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>{' '}
          &{' '}
          <a
            href="/privacy"
            className="text-[color:var(--terracotta-500)] font-bold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          .
          <br />
          <strong className="font-display italic font-medium text-foreground">
            5 free / day forever
          </strong>{' '}
          · no card · cancel any time
        </div>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              clearStagedGeneration();
              onSignupCancel();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" />
            Back · keep playing
          </button>
        </div>
      </div>
    </div>
  );
}
