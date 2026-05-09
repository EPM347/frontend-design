import { useState, useRef, useCallback } from 'react';
import { Link2, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '~/lib/utils';
import { SAMPLE_SUBJECTS } from '~/config/style-catalog';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export interface UploadZoneProps {
  /** Currently selected file (after upload). null when empty. */
  file: File | null;
  /** Object URL or remote URL of the file's preview. */
  previewUrl: string | null;
  onFileChange: (file: File, previewUrl: string) => void;
  onSampleSelect: (sample: { id: string; label: string; imageUrl: string }) => void;
  /** Optional handler for the URL-paste flow */
  onUrlSubmit?: (url: string) => void;
  /** Show a "replace" link in the filled state */
  onReplace?: () => void;
}

export function UploadZone({
  file,
  previewUrl,
  onFileChange,
  onSampleSelect,
  onUrlSubmit,
  onReplace,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAccept = useCallback(
    (f: File) => {
      setError(null);
      if (f.size > MAX_FILE_SIZE_BYTES) {
        setError(`Photo is bigger than ${MAX_FILE_SIZE_MB}MB. Try a smaller one.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(f.type)) {
        setError("That file type isn't supported. Use JPG, PNG, or WebP.");
        return;
      }
      const url = URL.createObjectURL(f);
      onFileChange(f, url);
    },
    [onFileChange],
  );

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) validateAndAccept(f);
    },
    [validateAndAccept],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) validateAndAccept(f);
    },
    [validateAndAccept],
  );

  // Filled state — small thumb + name + replace link
  if (file && previewUrl) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 bg-[color:var(--cream-100)] border-b-2 border-foreground">
        <div
          className="h-14 w-14 shrink-0 border-2 border-foreground bg-cover bg-center bg-muted"
          style={{ backgroundImage: `url(${previewUrl})` }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-display italic font-medium text-foreground text-base leading-tight truncate">
            {file.name}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
            {(file.size / 1024 / 1024).toFixed(1)}MB
            {file.type ? ` · ${file.type.split('/')[1]?.toUpperCase()}` : ''}
          </div>
        </div>
        {onReplace && (
          <button
            type="button"
            onClick={onReplace}
            className="ml-auto text-xs font-bold text-[color:var(--terracotta-500)] underline cursor-pointer"
          >
            Replace
          </button>
        )}
      </div>
    );
  }

  // Empty state — drop zone + samples
  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={cn(
        'p-7 sm:p-8 text-center transition-colors border-b-2 border-foreground',
        isDragging
          ? 'bg-[color:var(--butter-500)]/30'
          : 'bg-[repeating-linear-gradient(45deg,transparent_0,transparent_10px,rgba(58,46,38,0.025)_10px,rgba(58,46,38,0.025)_20px)]',
      )}
    >
      <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.22em] uppercase font-bold text-muted-foreground mb-2.5">
        <span
          className="h-[22px] w-[22px] rounded-full border-2 border-foreground bg-[color:var(--terracotta-500)] text-white flex items-center justify-center font-display italic font-bold text-xs"
          aria-hidden="true"
        >
          1
        </span>
        Drop a photo
      </div>

      <h3 className="font-display italic font-medium text-2xl leading-none mb-2 text-foreground">
        Anything you'd hang on a wall.
      </h3>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Faces work best. Pets too. Up to {MAX_FILE_SIZE_MB}MB. JPG, PNG, or WebP.
      </p>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2.5 bg-[color:var(--terracotta-500)] text-white border-[2.5px] border-foreground px-6 py-3 text-base font-bold cursor-pointer transition-transform active:translate-x-1 active:translate-y-1"
          style={{ boxShadow: '4px 4px 0 0 var(--cocoa-900)' }}
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Choose from device
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {onUrlSubmit && (
        <div className="mt-3.5 text-xs text-muted-foreground">
          or{' '}
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="text-[color:var(--terracotta-500)] font-bold underline cursor-pointer"
          >
            paste an image URL
          </button>
        </div>
      )}

      {showUrl && onUrlSubmit && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (urlValue.trim()) onUrlSubmit(urlValue.trim());
          }}
          className="mt-3 flex gap-2 max-w-md mx-auto"
        >
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            className="flex-1 h-10 border-2 border-foreground bg-card px-3 text-sm font-sans text-foreground outline-none focus:bg-white"
          />
          <button
            type="submit"
            className="px-3 h-10 bg-foreground text-background border-2 border-foreground text-xs font-bold cursor-pointer"
            style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 max-w-sm mx-auto flex items-start gap-2 px-3 py-2.5 bg-card border-2 border-[color:var(--tomato-500)] text-left text-xs text-[color:var(--tomato-500)]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Samples strip */}
      <div className="mt-6 pt-5 border-t border-dashed border-foreground/20">
        <div className="text-[11px] tracking-[0.16em] uppercase font-bold text-muted-foreground mb-3">
          No photo handy? Try one of these:
        </div>
        <div className="grid grid-cols-4 gap-2 max-w-[480px] mx-auto">
          {SAMPLE_SUBJECTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSampleSelect(sample)}
              className="group/sample aspect-square relative border-2 border-foreground bg-cover bg-center bg-muted cursor-pointer transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px]"
              style={{
                backgroundImage: `url(${sample.thumbnailUrl})`,
              }}
              aria-label={`Use sample ${sample.label}`}
            >
              <span className="absolute bottom-0 left-0 right-0 bg-foreground/90 text-[color:var(--cream-50)] text-[9px] tracking-[0.08em] uppercase font-bold py-1 text-center">
                {sample.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
