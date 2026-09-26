import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Alternative local font loading strategy with next/font/local
// Used when .woff2 files are placed inside src/assets/fonts/ or public/fonts/

const vazirmatn = localFont({
  src: [
    { path: '../assets/fonts/Vazirmatn-Light.woff2', weight: '300', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../assets/fonts/Vazirmatn-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
  fallback: ['system-ui', 'Tahoma', 'sans-serif'],
});

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
  description: 'خرید جدیدترین کالاهای دیجیتال، موبایل، لپ‌تاپ و لوازم جانبی با ضمانت اصالت',
  manifest: '/manifest.json',
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
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <head>
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
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
