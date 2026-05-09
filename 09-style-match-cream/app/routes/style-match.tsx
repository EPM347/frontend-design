import type { Route } from './+types/style-match';
import { Navbar } from '~/components/homepage/navbar';
import { StyleMatchPanel } from '~/components/style-match';

export const meta: Route.MetaFunction = () => [
  { title: 'Style Match · oneclick·art' },
  {
    name: 'description',
    content:
      'Drop your photo plus a style reference. Choose to keep just the look or step into the full scene. Powered by oneclick·art.',
  },
  { property: 'og:title', content: 'Style Match · oneclick·art' },
  {
    property: 'og:description',
    content:
      'See your photo in any look — match the palette, lighting, and mood of any reference image, or step into the full scene.',
  },
  { property: 'og:type', content: 'website' },
];

/**
 * /style-match
 *
 * Standalone route that hosts the StyleMatch feature. Wrapped in the
 * marketing Navbar + cream theme so the page looks at home next to the
 * existing /best-ai-art-generator surface, but it's gated behind a
 * Clerk auth check inside the panel — guests see "Sign in to generate"
 * on the Generate button and the rest of the UI works as a preview.
 *
 * v1 keeps Style Match as a separate route (not embedded in the existing
 * generator) for two reasons:
 *  1. The IA is different — it needs two upload slots + a mode toggle,
 *     which would clutter the 4-step generator funnel.
 *  2. We want to A/B the feature on its own URL before merging it into
 *     the main generator's style picker as an 11th "match a reference"
 *     option (parked for v2).
 */
export default function StyleMatchPage() {
  return (
    <>
      <Navbar
        loaderData={{
          isSignedIn: false, // Navbar reads its own clerk state — these are fallbacks
          hasActiveSubscription: false,
        }}
      />
      <main className="theme-cream min-h-screen pt-20 md:pt-24 pb-16 bg-background">
        <StyleMatchPanel />
      </main>
    </>
  );
}
