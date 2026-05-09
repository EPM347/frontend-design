import { LayoutDashboard, History, Settings, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import type { DashboardUser } from "~/types";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My creations",
      url: "/dashboard/creations",
      icon: History,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

function PlanCard() {
  const quota = useQuery(api.usage.getQuota);

  // Loading or no data — render a quiet placeholder so the layout doesn't shift
  if (!quota) {
    return (
      <div
        className="mb-3.5 px-4 py-4 border-2 border-foreground"
        style={{
          background: "var(--butter-500)",
          boxShadow: "4px 4px 0 0 var(--cocoa-900)",
        }}
      >
        <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-foreground/70 mb-1">
          Plan
        </div>
        <div className="font-display italic font-semibold text-base leading-none text-foreground">
          Loading…
        </div>
      </div>
    );
  }

  const tier = quota.tier ?? "free";
  const tierLabel =
    tier === "free"
      ? "Free"
      : tier === "starter"
        ? "Starter"
        : tier === "pro"
          ? "Pro Pack"
          : tier === "studio"
            ? "Studio"
            : tier;

  const price =
    tier === "free"
      ? "Free trial"
      : tier === "starter"
        ? "$6.99/month"
        : tier === "pro"
          ? "$9.99/month"
          : tier === "studio"
            ? "$19.99/month"
            : "";

  // Compute remaining images for the meta line
  const isPaidTier = tier !== "free";
  const monthlyUsed = isPaidTier
    ? (quota.planMonthlyUsed ?? 0)
    : (quota.freeMonthlyUsed ?? 0);
  const monthlyLimit = isPaidTier ? quota.planMonthlyLimit : quota.freeMonthlyLimit;

  let metaText = "";
  if (monthlyLimit === "unlimited") {
    metaText = "Unlimited this cycle";
  } else if (typeof monthlyLimit === "number") {
    const remaining = Math.max(0, monthlyLimit - monthlyUsed);
    metaText = `${remaining} credits left this cycle`;
  } else if ((quota.creditsBalance ?? 0) > 0) {
    metaText = `${quota.creditsBalance} credits available`;
  }

  return (
    <div
      className="mb-3.5 px-4 py-4 border-[2.5px] border-foreground"
      style={{
        background: "var(--butter-500)",
        boxShadow: "4px 4px 0 0 var(--cocoa-900)",
      }}
    >
      <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-foreground/70 mb-1">
        {tierLabel}
      </div>
      <div className="font-display italic font-semibold text-lg leading-none text-foreground mb-1">
        {price}
      </div>
      {metaText && (
        <div className="text-xs text-foreground opacity-80 leading-snug">
          {metaText}
        </div>
      )}
    </div>
  );
}

export function AppSidebar({
  variant,
  user,
}: {
  variant: "sidebar" | "floating" | "inset";
  user: DashboardUser;
}) {
  return (
    <Sidebar collapsible="offcanvas" variant={variant}>
      <SidebarHeader className="border-b-2 border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              to="/"
              prefetch="viewport"
              aria-label="oneclick·art home"
              className="flex items-center gap-1 px-3 py-4 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-none"
            >
              <span className="font-display font-bold text-2xl leading-none tracking-[-0.025em] text-foreground">
                oneclick
                <span style={{ color: "var(--terracotta-500)" }}>·</span>
                art
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-5">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-sidebar-border p-3.5 pb-5">
        <PlanCard />
        <Link
          to="/dashboard/settings?tab=subscription"
          prefetch="intent"
          className="block text-center px-3 py-2 mb-2 text-xs font-bold tracking-wide text-background bg-foreground border-2 border-foreground hover:opacity-90 transition-opacity"
        >
          Manage plan <ChevronRight className="inline h-3 w-3" />
        </Link>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
