import { useState } from 'react';
import { Download, Maximize2, Circle, RotateCcw, Trash2, X } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Link } from 'react-router';
import type { CreationJob } from './types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

interface CreationDetailsPeekProps {
  job: CreationJob;
  onClose: () => void;
  onDelete: () => Promise<void> | void;
  onUpscale: (level: 2 | 4 | 8) => Promise<void> | void;
  onBgRemoval: () => Promise<void> | void;
}

function formatRelativeDate(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDay === 0) return 'today';
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} weeks ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

interface ActionProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'default' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
}

function Action({
  label,
  icon: Icon,
  onClick,
  href,
  variant = 'default',
  fullWidth,
  disabled,
}: ActionProps) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 px-3 py-2.5 border-[2.5px] border-foreground text-sm font-bold cursor-pointer no-underline transition-transform',
    variant === 'primary' && 'bg-[color:var(--terracotta-500)] text-white',
    variant === 'default' && 'bg-card text-foreground',
    variant === 'danger' && 'bg-card text-[color:var(--tomato-500)] hover:bg-[color:var(--tomato-500)] hover:text-white',
    fullWidth && 'col-span-2',
    disabled && 'opacity-50 cursor-not-allowed',
  );
  const style = { boxShadow: '3px 3px 0 0 var(--cocoa-900)' };
  if (href) {
    return (
      <Link to={href} className={cls} style={style}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls} style={style}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export function CreationDetailsPeek({
  job,
  onClose,
  onDelete,
  onUpscale,
  onBgRemoval,
}: CreationDetailsPeekProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const styleLabel = job.styleLabel ?? job.style;
  const dimensions =
    job.width && job.height ? `${job.width} × ${job.height}` : job.sizePreset || '—';

  // Suggested style for the cross-sell line. We pick a deterministic
  // "different mood" based on the current style. Replace with a server-side
  // recommendation when available.
  const otherStyleSuggestion =
    job.style === 'studio-ghibli' ? 'Watercolor' : 'Studio Ghibli';

  return (
    <>
      <div
        className="bg-card border-[3px] border-foreground"
        style={{ boxShadow: '8px 8px 0 0 var(--cocoa-900)' }}
        role="region"
        aria-label={`Details for ${styleLabel}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[color:var(--cream-100)] border-b-2 border-foreground">
          <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-muted-foreground">
            {styleLabel} · selected
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 border-2 border-foreground bg-card flex items-center justify-center text-foreground hover:bg-muted/50"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
            aria-label="Close details"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px]">
          {/* Original */}
          <div
            className="aspect-square bg-cover bg-center bg-muted relative border-foreground border-b-2 lg:border-b-0 lg:border-r-2"
            style={
              job.originalImageUrl
                ? { backgroundImage: `url(${job.originalImageUrl})` }
                : undefined
            }
          >
            <span className="absolute top-3.5 left-3.5 inline-block px-2.5 py-1 bg-foreground text-background text-[10px] tracking-[0.18em] uppercase font-bold border-2 border-foreground">
              Original
            </span>
            {!job.originalImageUrl && (
              <div className="absolute inset-0 flex items-center justify-center font-display italic text-muted-foreground text-base">
                Your original photo
              </div>
            )}
          </div>

          {/* Result */}
          <div
            className="aspect-square bg-cover bg-center bg-muted relative border-foreground border-b-2 lg:border-b-0 lg:border-r-2"
            style={
              job.resultImageUrl
                ? { backgroundImage: `url(${job.resultImageUrl})` }
                : undefined
            }
          >
            <span className="absolute top-3.5 left-3.5 inline-block px-2.5 py-1 bg-foreground text-background text-[10px] tracking-[0.18em] uppercase font-bold border-2 border-foreground">
              {styleLabel}
            </span>
          </div>

          {/* Side panel */}
          <div className="bg-[color:var(--cream-50)] p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <div className="font-display italic font-medium text-2xl text-foreground leading-none">
                {styleLabel}
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {formatRelativeDate(job._creationTime)}
                <br />
                <strong className="font-display italic font-medium text-foreground">
                  {dimensions}
                </strong>
                {job.upscaleLevel && (
                  <>
                    {' · '}
                    {job.upscaleLevel}× upscaled
                  </>
                )}
                {job.hasNoBackground && <> · transparent BG</>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {job.resultImageUrl && (
                <Action
                  label="Download"
                  icon={Download}
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    if (!job.resultImageUrl) return;
                    const a = document.createElement('a');
                    a.href = job.resultImageUrl;
                    a.download = `${job.style}-${job._id}.png`;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                />
              )}
              <Action
                label="Upscale 2×"
                icon={Maximize2}
                onClick={() => onUpscale(2)}
                disabled={job.upscaleLevel === 8}
              />
              <Action
                label="No background"
                icon={Circle}
                onClick={() => onBgRemoval()}
                disabled={job.hasNoBackground}
              />
              <Action
                label="Redo"
                icon={RotateCcw}
                href={`/app/upload?redo=${job._id}`}
              />
              <Action
                label="Delete"
                icon={Trash2}
                variant="danger"
                fullWidth
                onClick={() => setConfirmDelete(true)}
              />
            </div>

            <div className="font-display italic text-[13px] text-muted-foreground border-t border-foreground/10 pt-3.5 leading-snug">
              Like this one?{' '}
              <strong className="font-display italic font-medium text-foreground">
                Try the same photo in{' '}
                <span className="text-[color:var(--terracotta-500)]">
                  {otherStyleSuggestion}
                </span>
              </strong>{' '}
              — same upload, different mood.
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this creation?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the {styleLabel} result from your gallery. The original photo
              upload is unaffected. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setConfirmDelete(false);
                await onDelete();
              }}
              className="bg-[color:var(--tomato-500)] text-white hover:bg-[color:var(--tomato-500)]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
