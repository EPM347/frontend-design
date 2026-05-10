import type { Route } from './+types/style-match';
import { Navbar } from '~/components/homepage/navbar';
import { StyleMatchCanvas } from '~/components/style-match-canvas';

export const meta: Route.MetaFunction = () => [
  { title: 'Style Match · oneclick·art' },
  {
    name: 'description',
    content:
      'Saw a look you love? Skip the prompt — drop your photo + a reference and get the same vibe in twenty seconds. No prompt-writing, no comment-begging.',
  },
  { property: 'og:title', content: 'Style Match · oneclick·art' },
  {
    property: 'og:description',
    content:
      'Skip the prompt. Drop the photo. Get the same vibe on your photo in twenty seconds.',
  },
  { property: 'og:type', content: 'website' },
];

/**
 * /style-match · v2 (canvas layout)
 *
 * The v2 redesign of /style-match. Replaces the 09-pack's wizard
 * (4-step numbered flow + side ResultPanel) with the canvas layout
 * documented in StyleMatchCanvas:
 *
 *   - Marketing-tier hero copy at the top
 *   - 3-triplet proof strip showing before/after examples
 *   - "Try a sample match" button (zero-credit pre-rendered demo)
 *   - Two taped photo cards on the canvas
 *   - Floating dock with smart defaults (mode collapsed under Advanced)
 *   - In-place result reveal (no side panel)
 *
 * Backend API contract (POST /api/style-match) is UNCHANGED from
 * the 09-pack — see app/utils/style-match-client.ts for shape.
 *
 * Authentication is still optional for sample-run mode; the Match
 * button redirects to /sign-in if unauthenticated.
 */
export default function StyleMatchPage() {
  return (
    <>
      <Navbar
        loaderData={{
          isSignedIn: false,
          hasActiveSubscription: false,
        }}
      />
      <main className="theme-cream min-h-screen pt-20 md:pt-24 bg-background">
        <StyleMatchCanvas />
      </main>
    </>
  );
}
