/**
 * UploadCards — two photo cards taped to the canvas. Replaces the
 * 09-pack UploadSlots component. Key differences from 09:
 *   - Absolute-positioned on the canvas, not in a panel
 *   - Slight rotation (-4deg / +4deg) with washi-tape detail
 *   - Pencil-note italic captions sit below each card
 *   - Whole canvas (parent) accepts drops via the wrapping handler;
 *     this component only handles the visual slot + click-to-upload
 *
 * Slots stay the same model as v1: { file, previewUrl, remoteUrl }.
 */

import { useRef, useState, useCallback } from 'react';
import { cn } from '~/lib/utils';
import type { StyleMatchSlot } from './types';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export interface UploadCardsProps {
  userSlot: StyleMatchSlot;
  referenceSlot: StyleMatchSlot;
  onUserChange: (slot: StyleMatchSlot) => void;
  onReferenceChange: (slot: StyleMatchSlot) => void;
  locked?: boolean;
}

export function UploadCards({
  userSlot,
  referenceSlot,
  onUserChange,
  onReferenceChange,
  locked = false,
}: UploadCardsProps) {
  return (
    <div className="relative w-full" style={{ minHeight: '380px' }}>
      {/* dashed connector line — runs behind both cards */}
      <div
        className="absolute top-[132px] h-[2px] opacity-25"
        style={{
          left: 'calc(50% - 100px)',
          width: '200px',
          background:
            'repeating-linear-gradient(90deg, var(--cocoa-900) 0, var(--cocoa-900) 4px, transparent 4px, transparent 11px)',
        }}
      />
      <div
        className="absolute font-mono text-[10px] tracking-[0.32em] uppercase text-muted-foreground"
        style={{
          top: '118px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--cream-50)',
          padding: '2px 10px',
        }}
      >
        = same vibe, your photo
      </div>

      <UploadCard
        role="user"
        slot={userSlot}
        onChange={onUserChange}
        locked={locked}
      />
      <UploadCard
        role="reference"
        slot={referenceSlot}
        onChange={onReferenceChange}
        locked={locked}
      />

      {/* pencil-note captions */}
      <p
        className="absolute font-display italic text-[13px] text-muted-foreground leading-snug"
        style={{
          bottom: 'calc(100% - 380px)',
          left: 'calc(50% - 320px)',
          width: '220px',
          transform: 'rotate(-2deg)',
        }}
      >
        ↑ Your face, your pose, your everything &mdash; stays exactly.
      </p>
      <p
        className="absolute font-display italic text-[13px] text-muted-foreground leading-snug text-right"
        style={{
          bottom: 'calc(100% - 380px)',
          right: 'calc(50% - 320px)',
          width: '220px',
          transform: 'rotate(2deg)',
        }}
      >
        ↑ We steal only the look. Not the face. Not the pose.
      </p>
    </div>
  );
}

interface UploadCardProps {
  role: 'user' | 'reference';
  slot: StyleMatchSlot;
  onChange: (slot: StyleMatchSlot) => void;
  locked: boolean;
}

const ROLE_COPY = {
  user: {
    eyebrow: 'Photo no. 1',
    title: 'Your photo',
    sub: 'Selfie · pet · group · anything',
    accent: 'var(--terracotta-500)',
    tapeBg: 'rgba(244, 201, 93, 0.65)',
    tapeRotate: '-2deg',
  },
  reference: {
    eyebrow: 'Photo no. 2',
    title: 'The inspo',
    sub: 'From Pinterest, IG, magazine',
    accent: 'var(--basil-500)',
    tapeBg: 'rgba(110,151,96,0.55)',
    tapeRotate: '2deg',
  },
} as const;

function UploadCard({ role, slot, onChange, locked }: UploadCardProps) {
  const copy = ROLE_COPY[role];
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndAccept = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`Bigger than 10MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Use JPG, PNG, or WebP.');
        return;
      }
      onChange({ file, previewUrl: URL.createObjectURL(file), remoteUrl: null });
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

  const isFilled = Boolean(slot.previewUrl);
  const positionClass = role === 'user' ? 'left-[calc(50%-320px)]' : 'right-[calc(50%-320px)]';
  const rotateClass = role === 'user' ? '-rotate-[4deg]' : 'rotate-[4deg]';

  return (
    <div
      className={cn(
        'absolute top-0 w-[220px] h-[264px] bg-card rounded-xl',
        'border-[1.5px] border-dashed border-foreground/30',
        'flex flex-col items-center justify-center p-5',
        'cursor-pointer transition-all hover:-translate-y-1',
        positionClass,
        rotateClass,
      )}
      style={{ boxShadow: '0 14px 30px -8px rgba(58,46,38,0.18)' }}
      onClick={() => !locked && inputRef.current?.click()}
    >
      {/* washi tape */}
      <span
        className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-[70px] h-[18px]"
        style={{
          background: copy.tapeBg,
          borderLeft: '1px dashed rgba(58,46,38,0.18)',
          borderRight: '1px dashed rgba(58,46,38,0.18)',
          transform: `translateX(-50%) rotate(${copy.tapeRotate})`,
        }}
        aria-hidden="true"
      />

      {isFilled ? (
        <div
          className="absolute inset-3 rounded-lg overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${slot.previewUrl})` }}
        />
      ) : (
        <>
          <div
            className="w-12 h-12 rounded-full inline-flex items-center justify-center mb-3"
            style={{
              background:
                role === 'user'
                  ? 'rgba(216,124,90,0.12)'
                  : 'rgba(110,151,96,0.12)',
              color: copy.accent,
            }}
          >
            {role === 'user' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )}
          </div>
          <div
            className="font-mono text-[10px] tracking-[0.22em] uppercase mb-1"
            style={{ color: copy.accent }}
          >
            {copy.eyebrow}
          </div>
          <div className="font-display italic font-medium text-[19px] leading-tight text-foreground mb-2 text-center">
            {copy.title}
          </div>
          <div className="font-mono text-[9.5px] tracking-[0.08em] uppercase text-muted-foreground text-center leading-relaxed">
            {copy.sub}
          </div>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        className="hidden"
        onChange={handleSelect}
      />

      {error && (
        <div className="absolute bottom-3 left-3 right-3 text-center text-[10px] text-[color:var(--tomato-500)] font-bold">
          {error}
        </div>
      )}
    </div>
  );
}
