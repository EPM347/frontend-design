import { getAuth } from '@clerk/react-router/ssr.server';
import { fetchAction, fetchQuery } from 'convex/nextjs';
import { api } from '../../convex/_generated/api';
import type { Route } from './+types/home';

import Hero from '~/components/homepage/Hero';
import TapDontType from '~/components/homepage/TapDontType';
import ThreeTaps from '~/components/homepage/ThreeTaps';
import MorePower from '~/components/homepage/MorePower';
import UseCases from '~/components/homepage/UseCases';
import StylePreview from '~/components/homepage/StylePreview';
import PricingStrip from '~/components/homepage/PricingStrip';
import HomeFAQ from '~/components/homepage/HomeFAQ';
import FinalCTA from '~/components/homepage/FinalCTA';
import Footer from '~/components/homepage/Footer';

// NOTE: The HomeGenerator import from Round 07 is intentionally removed.
// Visitors are now sent to /best-ai-art-generator to use the generator —
// keeping the homepage focused on the brand promise and conversion CTAs.

export function meta({}: Route.MetaArgs) {
  const title = 'OneClick·Art — Tap a style. Get art.';
  const description =
    'Turn photos into art. No prompts, no typing, no learning curve. Upload a photo, pick a style, download what you love. Free to try.';
  const keywords =
    'photo to art, AI art, photo to painting, photo to sketch, watercolor portrait, custom art, line art, studio ghibli style';
  const siteUrl = 'https://www.oneclickart.com/';
  const imageUrl = 'https://www.oneclickart.com/og-image.png';

  return [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: 'OneClickArt' },

    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:site_name', content: 'OneClickArt' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);

  // Parallel data fetching — same shape as before
  const [accessStatus, plans] = await Promise.all([
    userId
      ? fetchQuery(api.subscriptions.checkUserAccessStatusByClerkId, {
          clerkUserId: userId,
        }).catch((error) => {
          console.error('Failed to fetch access status:', error);
          return null;
        })
      : Promise.resolve(null),
    fetchAction(api.subscriptions.getAvailablePlans).catch((error) => {
      console.error('Failed to fetch plans:', error);
      return null;
    }),
  ]);

  return {
    isSignedIn: !!userId,
    hasAccess: accessStatus?.hasAccess || false,
    plans,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero />
      <TapDontType />
      <ThreeTaps />
      <MorePower />
      <UseCases />
      <StylePreview />
      <PricingStrip loaderData={loaderData} />
      <HomeFAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
