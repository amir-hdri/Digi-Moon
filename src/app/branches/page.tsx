import Link from 'next/link';
import { CategoryHeader, BottomNavbar } from '@/components';
import { listBranches } from '@/lib/engagement';
import { Clock, MapPin, Phone, Store } from 'lucide-react';

export const metadata = {
  title: 'شعب مون مارکت',
  description: 'آدرس و ساعات کاری شعب حضوری مون مارکت',
};

export default function BranchesPage() {
  const branches = listBranches();

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <CategoryHeader title="شعب مون مارکت" backHref="/" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          سفارش آنلاین خود را ثبت کنید یا حضوری از نزدیک‌ترین شعبه خرید کنید. همه شعب همه‌روزه باز هستند.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {branches.map((branch) => (
            <article
              key={branch.id}
              className="p-5 rounded-3xl liquid-glass-card bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-sm font-black text-slate-800 dark:text-zinc-100">
                    {branch.name}
                  </h2>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400">{branch.city}</span>
                </div>
              </div>
              <p className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{branch.address}</span>
              </p>
              <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{branch.hours}</span>
              </p>
              <a
                href={`tel:${branch.phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span dir="ltr">{branch.phone}</span>
              </a>
            </article>
          ))}
        </div>

        <div className="rounded-3xl bg-emerald-600 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-emerald-600/25">
          <div>
            <h2 className="text-sm font-black">ارسال اکسپرس از نزدیک‌ترین شعبه</h2>
            <p className="text-[11px] text-emerald-100 mt-1">
              سفارش آنلاین ثبت کنید تا از نزدیک‌ترین شعبه در کمتر از ۴۵ دقیقه ارسال شود.
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 text-xs font-black hover:bg-emerald-50 transition-colors shrink-0"
          >
            شروع خرید
          </Link>
        </div>
      </div>

      <BottomNavbar activeTab="home" />
    </main>
  );
}
