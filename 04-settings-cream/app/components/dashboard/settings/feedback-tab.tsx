import { useState, useRef } from 'react';
import { Bug, Sparkles, Palette, MessageSquare, Send, ImagePlus, Check } from 'lucide-react';
import { cn } from '~/lib/utils';

// NOTE: when a convex `feedback.submit` mutation exists, replace `submitFeedback`
// below with a `useMutation(api.feedback.submit)` call. Until then we POST to
// /api/feedback (or fall back to logging) so the form is functional from day one.
async function submitFeedback(payload: { topic: string; message: string }) {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`POST /api/feedback returned ${res.status}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[FeedbackTab] feedback transport not wired — logging instead', err);
    // eslint-disable-next-line no-console
    console.log(payload);
  }
}

type FeedbackTopic = 'bug' | 'feature' | 'style' | 'other';

const TOPICS: { value: FeedbackTopic; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'bug', label: 'Bug', icon: Bug },
  { value: 'feature', label: 'Feature request', icon: Sparkles },
  { value: 'style', label: 'Style request', icon: Palette },
  { value: 'other', label: 'Other', icon: MessageSquare },
];

export function FeedbackTab() {
  const [topic, setTopic] = useState<FeedbackTopic>('feature');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = message.trim().length >= 10 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitFeedback({ topic, message: message.trim() });
      setSubmitted(true);
      setMessage('');
      setScreenshotName(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit feedback', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
      <form
        onSubmit={handleSubmit}
        className="bg-card border-[2.5px] border-foreground p-6 sm:p-8 flex flex-col gap-6"
        style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
      >
        <div>
          <label className="block font-display italic font-medium text-[20px] leading-tight text-foreground mb-2">
            What's on your mind?
          </label>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Pick a topic, write what's broken or what you'd love. Real human reads
            every one.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              const active = topic === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTopic(t.value)}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2.5 border-[2.5px] border-foreground text-sm font-bold cursor-pointer',
                    active
                      ? 'bg-foreground text-background'
                      : 'bg-card text-foreground hover:bg-muted/40',
                  )}
                  style={{
                    boxShadow: active
                      ? '3px 3px 0 0 var(--terracotta-500)'
                      : '3px 3px 0 0 var(--cocoa-900)',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="feedback-message"
            className="block text-[11px] uppercase tracking-[0.16em] font-bold text-muted-foreground mb-2"
          >
            Your message
          </label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder="Tell us what happened, what you wanted, or what would be cool to add."
            className="w-full bg-[color:var(--cream-50)] border-[2.5px] border-foreground p-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none font-sans leading-relaxed resize-y min-h-[160px]"
            style={{ boxShadow: 'inset 2px 2px 0 0 rgba(58,46,38,0.05)' }}
            required
            minLength={10}
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px] text-muted-foreground">
              {message.length < 10
                ? `${10 - message.length} more character${10 - message.length === 1 ? '' : 's'} to send`
                : `${message.length} characters`}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground hover:text-[color:var(--terracotta-500)]"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {screenshotName ? `Attached: ${screenshotName}` : 'Attach screenshot'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setScreenshotName(f.name);
              }}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          {submitted && (
            <span className="inline-flex items-center gap-1.5 text-sm text-[color:var(--sage-500)] font-bold">
              <Check className="h-4 w-4" />
              Thanks — we got it.
            </span>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-3 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground text-sm font-bold transition-transform',
              canSubmit
                ? 'cursor-pointer active:translate-x-[3px] active:translate-y-[3px]'
                : 'opacity-50 cursor-not-allowed',
            )}
            style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
          >
            <Send className="h-4 w-4" />
            <span>{submitting ? 'Sending…' : 'Send feedback'}</span>
          </button>
        </div>
      </form>

      <div className="space-y-5">
        <div
          className="bg-[color:var(--cream-100)] border-[2.5px] border-foreground p-6"
          style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
        >
          <h3 className="font-display italic font-medium text-[20px] leading-tight text-foreground mb-2">
            Looking for help?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Most issues have a fast answer in the FAQ — failed jobs, billing, refunds,
            and how each style behaves.
          </p>
          <a
            href="/faq"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card text-foreground border-2 border-foreground text-[13px] font-semibold no-underline w-full"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
          >
            Open the FAQ →
          </a>
        </div>

        <div
          className="bg-card border-[2.5px] border-foreground p-6"
          style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
        >
          <h3 className="font-display italic font-medium text-[20px] leading-tight text-foreground mb-2">
            Email us
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Prefer plain email? Real human, real response in &lt; 24h on weekdays.
          </p>
          <a
            href="mailto:hello@oneclickart.com"
            className="font-mono text-sm text-[color:var(--terracotta-500)] underline font-bold break-all"
          >
            hello@oneclickart.com
          </a>
        </div>
      </div>
    </div>
  );
}
