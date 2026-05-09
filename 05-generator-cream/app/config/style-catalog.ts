import type { StylePreset } from '~/components/generator/types';

/**
 * The 10 canonical styles for oneclick·art. Each style has:
 *  - a thumbnail used in the StylePicker grid
 *  - a label shown on the tile + in copy
 *  - a description used as a tooltip / accessibility hint
 *
 * The `thumbnailUrl` should point at a square (1:1) cropped sample stored on
 * R2. The values below use placeholder paths matching the production
 * convention (`r2://styles/<id>/thumb.jpg`); update these to the real signed
 * URLs from your R2 bucket before merge.
 */

export interface StyleDefinition {
  id: StylePreset;
  label: string;
  /** Short description shown on hover / aria. */
  description: string;
  /** R2 thumbnail URL — square. */
  thumbnailUrl: string;
  /** Whether this style needs a face to work well. */
  needsFace?: boolean;
  /** Whether this style is paid-only. */
  isPro?: boolean;
}

export const STYLE_CATALOG: StyleDefinition[] = [
  {
    id: 'ghibli',
    label: 'Studio Ghibli',
    description: 'Soft palette, hand-painted edges, warm storybook mood.',
    thumbnailUrl: '/styles/ghibli/thumb.jpg',
    needsFace: true,
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    description: 'Translucent washes, paper texture, gentle bleed.',
    thumbnailUrl: '/styles/watercolor/thumb.jpg',
  },
  {
    id: 'sketch',
    label: 'Realistic Sketch',
    description: 'Graphite shading, careful linework, photorealistic likeness.',
    thumbnailUrl: '/styles/sketch/thumb.jpg',
  },
  {
    id: 'cartoon3d',
    label: '3D Cartoon',
    description: 'Pixar-style volume, expressive eyes, plastic-toy lighting.',
    thumbnailUrl: '/styles/cartoon3d/thumb.jpg',
    needsFace: true,
  },
  {
    id: 'oneline',
    label: 'One Line Art',
    description: 'Single continuous line, all flow no detail.',
    thumbnailUrl: '/styles/oneline/thumb.jpg',
  },
  {
    id: 'oil',
    label: 'Oil Painting',
    description: 'Visible brushstrokes, rich color, gallery-wall confidence.',
    thumbnailUrl: '/styles/oil/thumb.jpg',
  },
  {
    id: 'popart',
    label: 'Pop Art',
    description: 'Halftone dots, bold flat color, comic-book loud.',
    thumbnailUrl: '/styles/popart/thumb.jpg',
  },
  {
    id: 'pet',
    label: 'Pet Portrait',
    description: 'Watercolor warmth tuned for fur and snouts. Works on humans too.',
    thumbnailUrl: '/styles/pet/thumb.jpg',
  },
  {
    id: 'silhouette',
    label: 'Silhouette',
    description: 'All shape, no detail. Quiet and graphic.',
    thumbnailUrl: '/styles/silhouette/thumb.jpg',
  },
  {
    id: 'mixed',
    label: 'Artistic Reimagining',
    description: 'Mixed-media, surprising every time. Pro experiments.',
    thumbnailUrl: '/styles/mixed/thumb.jpg',
    isPro: true,
  },
];

/** O(1) lookup map for `STYLE_CATALOG`. */
export const STYLE_BY_ID = STYLE_CATALOG.reduce<Record<StylePreset, StyleDefinition>>(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<StylePreset, StyleDefinition>,
);

/** The 4 sample subjects shown when no photo has been uploaded yet. */
export interface SampleSubject {
  id: string;
  label: string;
  /** R2 sample image URL — the actual photo we'll use for the generation. */
  imageUrl: string;
  /** Square thumbnail shown in the picker grid. */
  thumbnailUrl: string;
}

export const SAMPLE_SUBJECTS: SampleSubject[] = [
  {
    id: 'portrait',
    label: 'Portrait',
    imageUrl: '/samples/portrait/full.jpg',
    thumbnailUrl: '/samples/portrait/thumb.jpg',
  },
  {
    id: 'couple',
    label: 'Couple',
    imageUrl: '/samples/couple/full.jpg',
    thumbnailUrl: '/samples/couple/thumb.jpg',
  },
  {
    id: 'pet',
    label: 'Pet',
    imageUrl: '/samples/pet/full.jpg',
    thumbnailUrl: '/samples/pet/thumb.jpg',
  },
  {
    id: 'landscape',
    label: 'Landscape',
    imageUrl: '/samples/landscape/full.jpg',
    thumbnailUrl: '/samples/landscape/thumb.jpg',
  },
];
