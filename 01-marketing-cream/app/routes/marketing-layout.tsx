import { Outlet } from 'react-router';

/**
 * Marketing Layout
 *
 * Wraps marketing routes (`/`, `/pricing`, `/faq`, `/terms`, `/privacy`)
 * with the cream theme override. App routes (`/app/upload`, `/dashboard/*`)
 * are NOT wrapped, so they keep the production navy palette.
 *
 * The `theme-cream` class overrides every CSS custom property defined in
 * `app/app.css` (background, foreground, primary, accent, etc.). Tailwind v4
 * resolves utility classes like `bg-accent`, `text-primary`, `border-border`
 * through these variables, so every shadcn/ui primitive and homepage-cta
 * styling automatically picks up the cream values inside the wrapper.
 *
 * Inside the wrapper, headings render in italic Fraunces and body in DM Sans.
 * Outside the wrapper, the navy/Inter system stays exactly as it is today.
 */
export default function MarketingLayout() {
  return (
    <div className="theme-cream">
      <Outlet />
    </div>
  );
}
