'use client';

import React from 'react';
import { MoonMarketLogo } from '@/components';
import { ShieldCheck, CheckCircle2, Phone, MapPin, Send, MessageCircle, Camera } from 'lucide-react';

const footerLinks = {
  service: [
    { label: 'پاسخ به سوالات متداول', href: '/support#faq' },
    { label: 'رویه‌های بازگرداندن کالا', href: '/support#returns' },
    { label: 'شرایط و قوانین استفاده', href: '/support#terms' },
    { label: 'حریم خصوصی کاربران', href: '/support#privacy' },
  ],
  guide: [
    { label: 'نحوه ثبت سفارش و تحویل', href: '/support#order-guide' },
    { label: 'شعبات حضوری مون مارکت', href: '/branches' },
    { label: 'شیوه‌های پرداخت امن', href: '/support#payment' },
    { label: 'فرصت‌های شغلی و همکاری', href: '/support#careers' },
  ],
};

const socialLinks = [
  { label: 'اینستاگرام', href: '#', icon: Camera },
  { label: 'تلگرام', href: '#', icon: Send },
  { label: 'پیام‌رسان بله', href: '#', icon: MessageCircle },
];

const trustBadges = [
  { icon: ShieldCheck, title: 'اینماد الکترونیکی', sub: 'وزارت صنعت و معدن' },
  { icon: CheckCircle2, title: 'نشان سیب سلامت', sub: 'سازمان غذا و دارو' },
];

export function Footer() {
  const [phone, setPhone] = React.useState('');
  const [newsletterState, setNewsletterState] = React.useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = React.useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterState === 'sending') return;
    setNewsletterState('sending');
    setNewsletterMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'عضویت ناموفق بود.');
      setNewsletterState('done');
      setNewsletterMessage(data.message ?? 'عضویت شما ثبت شد.');
      setPhone('');
    } catch (err) {
      setNewsletterState('error');
      setNewsletterMessage(err instanceof Error ? err.message : 'عضویت ناموفق بود.');
    }
  };

  return (
    <footer className="relative border-t border-slate-200/70 dark:border-zinc-800/80 overflow-hidden">
      {/* Subtle ambient gradient top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/5 dark:bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-2 text-xs text-slate-500 dark:text-zinc-400">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-right">

          {/* Brand column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 shadow-sm flex items-center justify-center shrink-0">
                <MoonMarketLogo size="sm" />
              </div>
              <div>
                <h2 className="font-black text-slate-800 dark:text-zinc-100 text-sm leading-tight">
                  فروشگاه‌های زنجیره‌ای مون مارکت
                </h2>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ارسال اکسپرس مایحتاج روزمره
                </span>
              </div>
            </div>

            <p className="leading-relaxed text-slate-500 dark:text-zinc-500 text-[12px]">
              مرجع تخصصی خرید آنلاین کالاهای اساسی، لبنیات تازه، محصولات آرایشی‌بهداشتی و شوینده‌های معتبر با تضمین ۱۰۰٪ اصالت و قیمت مصوب.
            </p>

            <div className="space-y-2">
              <a
                href="tel:02191001234"
                className="flex items-center gap-2.5 group w-fit min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 leading-none mb-0.5">پشتیبانی تلفنی</div>
                  <div className="font-bold text-slate-700 dark:text-zinc-200 text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    ۰۲۱ - ۹۱۰۰ ۱۲۳۴
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-slate-500 dark:text-zinc-400" aria-hidden="true" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                  شعب سراسر تهران و کلانشهرها
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-500/15 dark:hover:bg-emerald-500/15 text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-2 space-y-3.5">
            <h2 className="font-bold text-slate-800 dark:text-zinc-100 text-sm border-b border-slate-100 dark:border-zinc-800 pb-2">
              خدمات مشتریان
            </h2>
            <ul className="space-y-2.5">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-[-2px] inline-block duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shopping Guide */}
          <div className="md:col-span-2 space-y-3.5">
            <h2 className="font-bold text-slate-800 dark:text-zinc-100 text-sm border-b border-slate-100 dark:border-zinc-800 pb-2">
              راهنمای خرید
            </h2>
            <ul className="space-y-2.5">
              {footerLinks.guide.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:translate-x-[-2px] inline-block duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Badges */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="font-bold text-slate-800 dark:text-zinc-100 text-sm border-b border-slate-100 dark:border-zinc-800 pb-2">
              نمادهای اعتماد
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {trustBadges.map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 text-center flex flex-col items-center gap-1.5 hover:border-emerald-500/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800 dark:text-zinc-200 leading-tight">{title}</span>
                  <span className="text-[9.5px] text-slate-400 dark:text-zinc-500 leading-tight">{sub}</span>
                </div>
              ))}
            </div>

            {/* Newsletter mini */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/8 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/8 border border-emerald-500/20 p-3.5 space-y-2">
              <p className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                عضو شو، ۱۵٪ تخفیف اول بگیر
              </p>
              {newsletterState === 'done' ? (
                <p role="status" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {newsletterMessage}
                </p>
              ) : (
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="شماره موبایل…"
                      aria-label="شماره موبایل برای عضویت در خبرنامه"
                      name="newsletter-phone"
                      autoComplete="tel"
                      inputMode="tel"
                      spellCheck={false}
                      aria-describedby={newsletterState === 'error' ? 'newsletter-error' : undefined}
                      aria-invalid={newsletterState === 'error'}
                      className="flex-1 min-h-[44px] h-11 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      dir="ltr"
                    />
                    <button
                      type="submit"
                      disabled={newsletterState === 'sending'}
                      aria-busy={newsletterState === 'sending'}
                      className="min-h-[44px] h-11 px-4 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 disabled:opacity-60 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    >
                      {newsletterState === 'sending' ? (
                        <>
                          <span aria-hidden="true">در حال ارسال…</span>
                          <span className="sr-only">در حال ارسال…</span>
                        </>
                      ) : 'ارسال'}
                    </button>
                  </div>
                  {newsletterState === 'error' && (
                    <p id="newsletter-error" role="alert" className="text-[10px] font-bold text-rose-500 pt-1.5">{newsletterMessage}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-zinc-500 pb-24 md:pb-6">
          <span>تمامی حقوق مادی و معنوی متعلق به فروشگاه‌های زنجیره‌ای مون مارکت می‌باشد.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block motion-reduce:animate-none animate-pulse" aria-hidden="true" />
            نسخه ۲.۴.۰
          </span>
        </div>
      </div>
    </footer>
  );
}
