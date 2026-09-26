import Link from 'next/link';
import { CategoryHeader, BottomNavbar } from '@/components';
import { supportSections } from '@/data/engagement';
import { MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'پشتیبانی و راهنما',
  description: 'سوالات متداول، قوانین بازگشت کالا و راهنمای خرید مون مارکت',
};

export default function SupportPage() {
  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <CategoryHeader title="پشتیبانی و راهنما" backHref="/" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        <div className="rounded-3xl bg-gradient-to-l from-emerald-600 to-teal-700 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-emerald-600/20">
          <div>
            <h2 className="text-base font-black">جواب سوالت را پیدا نکردی؟</h2>
            <p className="text-[11px] text-emerald-100 mt-1">
              مستقیم با پشتیبانی در ارتباط باش؛ معمولاً در کمتر از یک ساعت پاسخ می‌دهیم.
            </p>
          </div>
          <Link
            href="/messages"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-emerald-700 text-xs font-black hover:bg-emerald-50 transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>گفتگو با پشتیبانی</span>
          </Link>
        </div>

        <nav aria-label="فهرست راهنما" className="flex flex-wrap gap-1.5">
          {supportSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[11px] font-bold text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="space-y-3.5">
          {supportSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 p-5 sm:p-6 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-3"
            >
              <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-zinc-100">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.body.map((paragraph, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{paragraph}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <BottomNavbar activeTab="profile" />
    </main>
  );
}
