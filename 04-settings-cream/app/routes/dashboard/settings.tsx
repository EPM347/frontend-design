'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/react-router';
import { useSearchParams } from 'react-router';
import { Crown, User, Sliders, History, MessageSquare } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { DashboardPageHeader } from '~/components/dashboard/dashboard-page-header';
import {
  SettingsTabs,
  SubscriptionTab,
  AccountTab,
  PreferencesTab,
  UsageTab,
  FeedbackTab,
  type ImageSize,
  type LikenessLevel,
  type StylePreset,
  type SettingsTabValue,
} from '~/components/dashboard/settings';

const VALID_TABS: SettingsTabValue[] = [
  'subscription',
  'account',
  'preferences',
  'usage',
  'feedback',
];

function isValidTab(t: string | null): t is SettingsTabValue {
  return t !== null && (VALID_TABS as string[]).includes(t);
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const quota = useQuery(api.usage.getQuota);

  const [activeTab, setActiveTab] = useState<SettingsTabValue>(() => {
    const t = searchParams.get('tab');
    return isValidTab(t) ? t : 'subscription';
  });

  useEffect(() => {
    const t = searchParams.get('tab');
    if (isValidTab(t) && t !== activeTab) {
      setActiveTab(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onTabChange = useCallback(
    (value: SettingsTabValue) => {
      setActiveTab(value);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('tab', value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Usage history fetch (only when on usage tab)
  const jobsQuery = useQuery(
    api.jobs.listMine,
    activeTab === 'usage' ? { limit: 25 } : 'skip',
  );
  const recentJobs = useMemo(
    () => jobsQuery?.jobs?.slice(0, 25) ?? [],
    [jobsQuery?.jobs],
  );

  // Preference state — currently local-only. Wire to a convex mutation when
  // user-preferences storage is added.
  const [defaultSize, setDefaultSize] = useState<ImageSize>('auto');
  const [defaultLikeness, setDefaultLikeness] = useState<LikenessLevel>('exact');
  const [defaultStyle, setDefaultStyle] = useState<StylePreset>('sketch');

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 sm:gap-8 px-4 lg:px-9 py-6 sm:py-9 pb-16">

        <DashboardPageHeader
          display
          title="Your account."
          boxedNamePart="account."
          description="Plan, profile, defaults, history, and the box where you tell us what's broken. Five tabs, no surprises."
        />

        <SettingsTabs
          value={activeTab}
          onChange={onTabChange}
          tabs={[
            { value: 'subscription', label: 'Subscription', icon: Crown },
            { value: 'account', label: 'Account', icon: User },
            { value: 'preferences', label: 'Preferences', icon: Sliders },
            { value: 'usage', label: 'Usage history', icon: History },
            { value: 'feedback', label: 'Feedback', icon: MessageSquare },
          ]}
        />

        <div
          id="settings-tabpanel"
          role="tabpanel"
          aria-labelledby={`settings-tab-${activeTab}`}
          className="outline-none"
        >
          {activeTab === 'subscription' && <SubscriptionTab quota={quota} />}
          {activeTab === 'account' && <AccountTab user={user} isLoaded={isLoaded} />}
          {activeTab === 'preferences' && (
            <PreferencesTab
              defaultSize={defaultSize}
              defaultLikeness={defaultLikeness}
              defaultStyle={defaultStyle}
              onSizeChange={setDefaultSize}
              onLikenessChange={setDefaultLikeness}
              onStyleChange={setDefaultStyle}
            />
          )}
          {activeTab === 'usage' && (
            <UsageTab jobs={jobsQuery?.jobs} recentJobs={recentJobs} />
          )}
          {activeTab === 'feedback' && <FeedbackTab />}
        </div>
      </div>
    </div>
  );
}
