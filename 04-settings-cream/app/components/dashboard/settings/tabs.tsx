import type { LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

export type SettingsTabValue =
  | 'subscription'
  | 'account'
  | 'preferences'
  | 'usage'
  | 'feedback';

interface TabDef {
  value: SettingsTabValue;
  label: string;
  icon: LucideIcon;
}

interface SettingsTabsProps {
  value: SettingsTabValue;
  onChange: (value: SettingsTabValue) => void;
  tabs: TabDef[];
}

export function SettingsTabs({ value, onChange, tabs }: SettingsTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Settings sections"
      className="flex gap-2 flex-wrap"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            id={`settings-tab-${tab.value}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls="settings-tabpanel"
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex items-center gap-2 px-4 sm:px-[18px] py-3 border-[2.5px] border-foreground text-sm font-bold cursor-pointer transition-transform',
              'min-h-[44px] touch-manipulation',
              active
                ? 'bg-foreground text-background'
                : 'bg-card text-foreground hover:bg-muted/40 active:translate-x-[3px] active:translate-y-[3px]',
            )}
            style={{
              boxShadow: active
                ? '3px 3px 0 0 var(--terracotta-500)'
                : '3px 3px 0 0 var(--cocoa-900)',
            }}
          >
            <Icon className="h-4 w-4 opacity-85 shrink-0" aria-hidden="true" />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
