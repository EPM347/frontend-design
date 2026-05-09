import { useState, useRef, useCallback } from 'react';
import { Upload, AlertCircle, Link2, Image as ImageIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { StyleMatchSlot } from './types';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export interface UploadSlotsProps {
  /** The user's photo (the subject we'll restyle / place into the scene). */
  userSlot: StyleMatchSlot;
  /** The style reference image (the look we want to borrow). */
  referenceSlot: StyleMatchSlot;
  onUserChange: (slot: StyleMatchSlot) => void;
  onReferenceChange: (slot: StyleMatchSlot) => void;
  /** When true, slots are read-only (used during generation). */
  locked?: boolean;
}

/**
 * Two-up upload component: left = your photo, right = style reference.
 * Each slot has its own drag-drop, file picker, paste-URL fallback, and
 * Replace link. Slots are visually identical except for color accents
 * (terracotta for "your photo", basil green for "reference") so the
 * roles stay obvious at a glance.
 *
 * Important: client does NOT resize or upload — files stay in memory and
 * get sent to the server-side /api/style-match route as multipart form
 * data. The server handles R2 upload + Gemini call in one round-trip.
 */
export function UploadSlots({
  userSlot,
  referenceSlot,
  onUserChange,
  onReferenceChange,
  locked = false,
}: UploadSlotsProps) {
  return (
    <div className="border-b-2 border-foreground">
      <div className="px-5 sm:px-6 pt-5 pb-3">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted-foreground font-bold mb-1">
          <span
            className={cn(
              'h-[22px] w-[22px] rounded-full border-2 border-foreground text-white flex items-center justify-center font-display italic font-bold text-xs',
              locked ? 'bg-foreground' : 'bg-[color:var(--terracotta-500)]',
            )}
            aria-hidden="true"
          >
            1
          </span>
          {locked ? 'Photos locked' : 'Drop two photos'}
        </div>
        <h3 className="font-display italic font-medium text-2xl leading-none text-foreground mb-1">
          Yours, plus the look you love.
        </h3>
        <p className="text-sm text-muted-foreground leading-snug">
          Up to {MAX_FILE_SIZE_MB}MB each. JPG, PNG, or WebP. Faces work best on the left.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-px sm:bg-foreground border-t-2 border-foreground">
        <Slot
          role="user"
          slot={userSlot}
          onChange={onUserChange}
          locked={locked}
        />
        <Slot
          role="reference"
          slot={referenceSlot}
          onChange={onReferenceChange}
          locked={locked}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── single slot ───────────────────────── */

interface SlotProps {
  role: 'user' | 'reference';
  slot: StyleMatchSlot;
  onChange: (slot: StyleMatchSlot) => void;
  locked: boolean;
}

const SLOT_COPY: Record<SlotProps['role'], { eyebrow: string; title: string; hint: string; accent: string }> = {
  user: {
    eyebrow: 'Your photo',
    title: 'You.',
    hint: 'The subject we keep. Faces work best.',
    accent: 'var(--terracotta-500)',
  },
  reference: {
    eyebrow: 'Style reference',
    title: 'The look.',
    hint: "Any photo whose mood you want. We ignore text & UI.",
    accent: 'var(--basil-500)',
  },
};

function Slot({ role, slot, onChange, locked }: SlotProps) {
  const copy = SLOT_COPY[role];
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const validateAndAccept = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`Bigger than ${MAX_FILE_SIZE_MB}MB. Try a smaller one.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Use JPG, PNG, or WebP.');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onChange({ file, previewUrl, remoteUrl: null });
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) validateAndAccept(file);
    },
    [validateAndAccept],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      if (locked) return;
      const file = event.dataTransfer.files?.[0];
      if (file) validateAndAccept(file);
    },
    [validateAndAccept, locked],
  );

  const handleReplace = () => {
    if (slot.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(slot.previewUrl);
    }
    onChange({ file: null, previewUrl: null, remoteUrl: null });
  };

  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!urlValue.trim()) return;
    onChange({ file: null, previewUrl: urlValue.trim(), remoteUrl: urlValue.trim() });
    setShowUrl(false);
    setUrlValue('');
  };

  // Filled state — render a thumb the same size as the empty drop zone
  if (slot.previewUrl) {
    return (
      <div className="relative bg-[color:var(--cream-100)] sm:bg-[color:var(--cream-50)] p-5">
        <div
          className="text-[10px] tracking-[0.22em] uppercase font-bold mb-2"
          style={{ color: copy.accent }}
        >
          {copy.eyebrow}
        </div>
        <div
          className="relative w-full aspect-square border-[2.5px] border-foreground bg-cover bg-center bg-muted overflow-hidden"
          style={{
            backgroundImage: `url(${slot.previewUrl})`,
            boxShadow: '4px 4px 0 0 var(--cocoa-900)',
          }}
        >
          <span
            className="absolute top-2 left-2 px-2 py-1 bg-foreground text-[color:var(--cream-50)] border-2 border-foreground text-[9px] tracking-[0.16em] uppercase font-bold"
          >
            {slot.file ? `${(slot.file.size / 1024 / 1024).toFixed(1)}MB` : 'URL'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="font-display italic font-medium text-sm text-foreground truncate">
              {slot.file?.name ?? 'From URL'}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground truncate">
              {slot.file?.type?.split('/')[1]?.toUpperCase() ?? slot.remoteUrl}
            </div>
          </div>
          {!locked && (
            <button
              type="button"
              onClick={handleReplace}
              className="text-xs font-bold underline cursor-pointer shrink-0"
              style={{ color: copy.accent }}
            >
              Replace
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state — drop zone
  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        if (!locked) setIsDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={cn(
        'relative p-5 sm:p-6 transition-colors',
        isDragging
          ? 'bg-[color:var(--butter-500)]/30'
          : 'bg-[repeating-linear-gradient(45deg,transparent_0,transparent_10px,rgba(58,46,38,0.025)_10px,rgba(58,46,38,0.025)_20px)]',
      )}
    >
      <div
        className="text-[10px] tracking-[0.22em] uppercase font-bold mb-2"
        style={{ color: copy.accent }}
      >
        {copy.eyebrow}
      </div>
      <h4 className="font-display italic font-medium text-2xl leading-none text-foreground mb-1.5">
        {copy.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-4 leading-snug">{copy.hint}</p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={locked}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2.5 text-white border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1',
          locked && 'opacity-40 cursor-not-allowed',
        )}
        style={{
          background: copy.accent,
          boxShadow: '3px 3px 0 0 var(--cocoa-900)',
        }}
      >
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
        Choose photo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        className="hidden"
        onChange={handleSelect}
      />

      <div className="mt-3 text-xs text-muted-foreground">
        or{' '}
        <button
          type="button"
          onClick={() => setShowUrl((value) => !value)}
          disabled={locked}
          className="font-bold underline cursor-pointer"
          style={{ color: copy.accent }}
        >
          paste an image URL
        </button>
      </div>

      {showUrl && (
        <form onSubmit={handleUrlSubmit} className="mt-3 flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            className="flex-1 h-9 border-2 border-foreground bg-card px-3 text-xs font-sans text-foreground outline-none focus:bg-white"
          />
          <button
            type="submit"
            className="px-3 h-9 bg-foreground text-background border-2 border-foreground text-xs font-bold cursor-pointer"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
          >
            <Link2 className="h-3 w-3" />
          </button>
        </form>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 px-2.5 py-2 bg-card border-2 border-[color:var(--tomato-500)] text-left text-[11px] text-[color:var(--tomato-500)]">
          <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
