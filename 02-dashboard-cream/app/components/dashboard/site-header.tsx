'use client';
import { SidebarTrigger } from '~/components/ui/sidebar';
import { Skeleton } from '~/components/ui/skeleton';
import { Link, useLocation } from 'react-router';
import { Sparkles } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@clerk/react-router';
import { HeaderQuotaBadges } from './header-quota-badges';

function getPageTitle(pathname: string): string {
  const path = pathname.replace(/\/$/, '');
  if (path === '/dashboard') return 'Dashboard';
  if (path.startsWith('/dashboard/creations')) return 'My creations';
  if (path.startsWith('/dashboard/settings')) return 'Settings';
  return '';
}

export function SiteHeader() {
  const { isSignedIn } = useAuth();
  const quota = useQuery(api.usage.getQuota, isSignedIn ? {} : 'skip');
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-3 border-b-2 border-foreground px-7"
      style={{ background: 'var(--cream-50)' }}
    >
      <SidebarTrigger
        className="h-9 w-9 border-2 border-foreground bg-card flex items-center justify-center cursor-pointer"
        style={{ boxShadow: '2px 2px 0 0 var(--cocoa-900)' }}
      />

      {pageTitle && (
        <span className="font-display italic font-medium text-lg text-muted-foreground hidden sm:inline">
          {pageTitle}
        </span>
      )}

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {isSignedIn && quota !== undefined && quota !== null && (
          <>
            <div className="hidden md:flex items-center gap-2">
              <HeaderQuotaBadges quota={quota} layout="desktop" />
            </div>
            <div className="flex md:hidden items-center gap-1.5">
              <HeaderQuotaBadges quota={quota} layout="mobile" />
            </div>
          </>
        )}

        {isSignedIn && quota === undefined && (
          <>
            <div className="hidden md:flex items-center gap-2">
              <Skeleton className="h-9 w-24 border-2 border-foreground" />
            </div>
            <div className="flex md:hidden">
              <Skeleton className="h-8 w-16 border-2 border-foreground" />
            </div>
          </>
        )}

        <Link
          to="/best-ai-art-generator"
          prefetch="intent"
          className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 font-bold text-sm text-white border-[2.5px] border-foreground touch-manipulation"
          style={{
            background: 'var(--terracotta-500)',
            boxShadow: '3px 3px 0 0 var(--cocoa-900)',
          }}
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Make art</span>
          <span className="sm:hidden">Make</span>
        </Link>
      </div>
    </header>
  );
}
