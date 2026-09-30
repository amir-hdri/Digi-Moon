import type { Metadata, Viewport } from 'next';
import './globals.css';

// Self-hosted Persian font: byte-identical Vazirmatn woff2 files vendored
// into /public/fonts/vazirmatn (arabic + latin subsets). Keeps the offline &
// VPN immunity of @fontsource with zero external calls, but stable URLs allow
// preloading the LCP-critical weights instead of discovering them late
// through hashed _next/static/media URLs.
import './vazirmatn.css';
import { ToastContainer } from '@/components/ui/Toast';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { StoreHydration } from '@/components/ui/StoreHydration';

const SITE_URL = 'https://moonmarket.ir';
const DESCRIPTION =
  'خرید مایحتاج روزمره، مواد غذایی، لبنیات تازه و محصولات آرایشی و بهداشتی با تضمین اصالت، تخفیف‌های شگفت‌انگیز و ارسال سریع';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // `maximumScale`/`userScalable` are deliberately NOT set: pinning zoom to 1x fails
  // WCAG 2.1 AA (1.4.4 Resize Text) and breaks pinch-zoom for low-vision shoppers.
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'مون مارکت | سوپرمارکت زنجیره‌ای و بهداشتی',
    template: '%s | مون مارکت',
  },
  description: DESCRIPTION,
  applicationName: 'مون مارکت',
  keywords: [
    'مون مارکت',
    'سوپرمارکت',
    'مواد غذایی',
    'لبنیات',
    'آرایشی و بهداشتی',
    'شوینده',
    'خرید آنلاین',
    'moonmarket',
  ],
  authors: [{ name: 'تیم مون مارکت', url: SITE_URL }],
  creator: 'MoonMarket',
  publisher: 'MoonMarket',
  alternates: { canonical: '/' },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/logo-moonmarket.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/logo.png' }],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'مون مارکت | سوپرمارکت زنجیره‌ای',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'مون مارکت',
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: '/logo-moonmarket.jpg', width: 282, height: 294, alt: 'مون مارکت' }],
  },
  twitter: {
    card: 'summary',
    title: 'مون مارکت | سوپرمارکت زنجیره‌ای',
    description: DESCRIPTION,
    images: ['/logo-moonmarket.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://moonmarket.ir';
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'مون مارکت',
        alternateName: 'Moon Market',
        url: siteUrl,
        logo: `${siteUrl}/logo-moonmarket.png`,
      },
      {
        '@type': 'WebSite',
        name: 'مون مارکت',
        url: siteUrl,
        inLanguage: 'fa-IR',
      },
    ],
  };
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/*
          Preload the LCP-critical Vazirmatn subsets (measured LCP element is
          hero text). Stable /public URLs make this possible — hashed
          _next/static/media URLs could not be preloaded.
        */}
        <link
          rel="preload"
          href="/fonts/vazirmatn/vazirmatn-arabic-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vazirmatn/vazirmatn-arabic-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vazirmatn/vazirmatn-arabic-900.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/*
          Anti-FOUC theme bootstrap — runs synchronously before first paint.
          zustand/persist wraps state in a `{ state, version }` JSON envelope, so the
          previous `localStorage.getItem('dijimoon_theme') === 'dark'` comparison could
          never match and every dark-mode visitor got a white flash. Read the envelope.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var raw = localStorage.getItem('dijimoon_theme');
                  var stored = raw ? (JSON.parse(raw).state || {}).theme : null;
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var dark = stored === 'dark' || ((!stored || stored === 'system') && prefersDark);
                  document.documentElement.classList.toggle('dark', dark);
                  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-emerald-500 selection:text-white">
        <MotionProvider>
          <StoreHydration />
          <ScrollProgressBar />
          <ToastContainer />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
