'use client';
import { useSearchParams } from 'react-router';
import type { Route } from './+types/app.upload';
import { Generator } from '~/components/generator';
import { DashboardPageHeader } from '~/components/dashboard/dashboard-page-header';
import type { Id } from '../../convex/_generated/dataModel';

export const meta: Route.MetaFunction = () => [
  { title: 'Make art · oneclick·art' },
];

/**
 * /app/upload
 *
 * The signed-in equivalent of `/best-ai-art-generator`. Same `<Generator />`
 * component, but rendered inside the dashboard chrome (sidebar + topbar
 * via the dashboard layout) and with `mode="app"` so the signup panel never
 * appears — the user is already authenticated by the time they reach this
 * route (gated by the dashboard layout's auth check).
 *
 * The previous version of this route was an upload-only helper that
 * uploaded photos and linked off to /best-ai-art-generator?imageId=X.
 * The redesign consolidates the flow: uploading + style picking +
 * generation + result viewing all happen here in one continuous surface.
 */
export default function AppUploadPage() {
  const [searchParams] = useSearchParams();
  const imageId = searchParams.get('imageId') ?? undefined;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 sm:gap-8 px-4 lg:px-9 py-6 sm:py-9">
        <div className="px-1">
          <DashboardPageHeader
            display
            title="Make some art."
            boxedNamePart="art."
            description="Drop a photo. Tap a style. About thirty seconds later it's in your gallery."
          />
        </div>
        <Generator mode="app" initialImageId={imageId as Id<'images'> | undefined} />
      </div>
    </div>
  );
}
