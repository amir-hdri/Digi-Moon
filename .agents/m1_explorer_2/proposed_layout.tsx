import type { Metadata, Viewport } from 'next';
import './globals.css';

// Resilient Persian font loading via @fontsource/vazirmatn
// Provides complete offline & VPN immunity with zero external Google Fonts network calls during build
import '@fontsource/vazirmatn/300.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import '@fontsource/vazirmatn/900.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'دیجی مون | فروشگاه تخصصی کالای دیجیتال',
    template: '%s | دیجی مون',
  },
  description: 'خرید جدیدترین کالاهای دیجیتال، موبایل، لپ‌تاپ و گجت‌های هوشمند با بهترین قیمت و ضمانت اصالت',
  keywords: ['دیجی مون', 'فروشگاه اینترنتی', 'کالای دیجیتال', 'موبایل', 'لپ‌تاپ', 'خرید آنلاین', 'dijimoon'],
  authors: [{ name: 'تیم دیجی مون', url: 'https://dijimoon.ir' }],
  creator: 'Dijimoon',
  publisher: 'Dijimoon',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'دیجی مون | فروشگاه تخصصی کالای دیجیتال',
    description: 'خرید جدیدترین کالاهای دیجیتال با تضمین اصالت و ارسال سریع',
    url: 'https://dijimoon.ir',
    siteName: 'دیجی مون',
    locale: 'fa_IR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
    >
      <head>
        {/* 
          Inline Anti-FOUC Theme Detection Script:
          Executes synchronously before DOM paint to detect saved theme or OS preference,
          preventing white/dark flash during initial page load.
          Slate neutral palette activates in Light mode; Zinc neutral palette activates in Dark mode.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('dijimoon_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
