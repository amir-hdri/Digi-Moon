import type { Metadata, Viewport } from 'next';
import './globals.css';

// Resilient Persian font loading via @fontsource/vazirmatn
// Provides complete offline & VPN immunity with zero external Google Fonts network calls during build
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import '@fontsource/vazirmatn/900.css';
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
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
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
