import { useSearchParams } from 'react-router';
import type { Route } from './+types/ai-art-generator';
import { Navbar } from '~/components/homepage/navbar';
import { Generator } from '~/components/generator';
import type { Id } from '../../convex/_generated/dataModel';

export const meta: Route.MetaFunction = () => [
  { title: 'AI Art Generator · oneclick·art' },
  {
    name: 'description',
    content:
      'Drop a photo, pick a style, see your art in 30 seconds. 10 styles. 5 free generations a day. No card.',
  },
  { property: 'og:title', content: 'AI Art Generator · oneclick·art' },
  {
    property: 'og:description',
    content:
      'Drop a photo, pick a style, see your art in 30 seconds. 10 styles. 5 free generations a day. No card.',
  },
  { property: 'og:type', content: 'website' },
];

/**
 * /best-ai-art-generator
 *
 * Public marketing surface that anyone can land on. Visitors can upload a
 * photo and configure the style without authenticating; clicking Generate
 * triggers the inline signup panel inside the Generator component.
 *
 * After signup completes, the user is redirected back here with `?staged=1`
 * and the Generator auto-fires the generation it had stashed in
 * sessionStorage. See `app/utils/staged-generation.ts`.
 */
export default function AIArtGeneratorPage() {
  const [searchParams] = useSearchParams();
  const imageId = searchParams.get('imageId') ?? undefined;

  return (
    <>
      <Navbar
        loaderData={{
          isSignedIn: false, // Navbar reads its own clerk state — these are fallbacks
          hasActiveSubscription: false,
        }}
      />
      <main className="theme-cream min-h-screen pt-20 md:pt-24 pb-16 bg-background">
        <Generator mode="marketing" initialImageId={imageId as Id<'images'> | undefined} />
      </main>
    </>
  );
}
