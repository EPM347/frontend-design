import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  // ─────────────────────────────────────────────────────────────────
  // Marketing routes — wrapped in cream theme via MarketingLayout.
  // Adding a route here means it gets the cream palette + Fraunces.
  // ─────────────────────────────────────────────────────────────────
  layout('routes/marketing-layout.tsx', [
    index('routes/home.tsx'),
    route('pricing', 'routes/pricing.tsx'),
    route('faq', 'routes/faq.tsx'),
    route('privacy', 'routes/privacy.tsx'),
    route('terms', 'routes/terms.tsx'),
  ]),

  // ─────────────────────────────────────────────────────────────────
  // Auth, success, subscription routes — keep navy (touch acquisition
  // flow). Move into the cream layout above if you want them themed too.
  // ─────────────────────────────────────────────────────────────────
  route('sign-in/*', 'routes/sign-in.tsx'),
  route('sign-up/*', 'routes/sign-up.tsx'),
  route('success', 'routes/success.tsx'),
  route('subscription-required', 'routes/subscription-required.tsx'),

  // API routes
  route('api/generate-line-art', 'routes/api.generate-line-art.tsx'),
  route('api/upscale', 'routes/api.upscale.tsx'),
  route('api/remove-background', 'routes/api.remove-background.tsx'),

  // Static assets
  route('og-image.png', 'routes/og-image.png.tsx'),
  route('sitemap.xml', 'routes/sitemap.xml.tsx'),

  // Main AI Art Generator (single page) — stays navy (it's the product)
  route('ai-art-generator', 'routes/legacy-ai-art-generator.tsx'),
  route('best-ai-art-generator', 'routes/ai-art-generator.tsx'),

  // Public art view
  route('art/:jobId', 'routes/art.$jobId.tsx'),

  // Merch Studio
  route('merch/:jobId', 'routes/merch.$jobId.tsx'),

  // Optional app pages (for authenticated users) — stays navy (it's the app)
  route('app/upload', 'routes/app.upload.tsx'),

  // Dashboard — stays navy (it's the app)
  layout('routes/dashboard/layout.tsx', [
    route('dashboard', 'routes/dashboard/index.tsx'),
    route('dashboard/creations', 'routes/dashboard/creations.tsx'),
    route('dashboard/settings', 'routes/dashboard/settings.tsx'),
  ]),
] satisfies RouteConfig;
