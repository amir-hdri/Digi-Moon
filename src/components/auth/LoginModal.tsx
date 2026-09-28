'use client';

import React, { useState, useEffect } from 'react';
import { UniversalModal } from '@/components/ui/UniversalModal';
import { toPersianDigits, toEnglishDigits } from '@/lib/persian';
import { useAuthStore } from '@/stores/useAuthStore';
import { Smartphone, KeyRound, Loader2, ArrowRight } from 'lucide-react';

export interface LoginModalProps {
  show?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: (authData: Record<string, unknown>) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  show,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const isVisible = isOpen !== undefined ? isOpen : Boolean(show);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(120);

  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = toEnglishDigits(phoneNumber.trim());

    if (!cleanPhone) {
      setErrorMessage('شماره تماس الزامی است');
      return;
    }

    if (!/^09\d{9}$/.test(cleanPhone)) {
      setErrorMessage('شماره تماس باید ۱۱ رقم و با ۰۹ شروع شود');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(120);
    }, 600);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = toEnglishDigits(otpCode.trim());

    if (!cleanCode || cleanCode.length < 4) {
      setErrorMessage('لطفاً کد تایید دریافتی را به طور کامل وارد کنید');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login(toEnglishDigits(phoneNumber), {
        firstName: 'کاربر',
        lastName: 'گرامی',
      });
      onSuccess?.({ phoneNumber: toEnglishDigits(phoneNumber), token: 'mock-jwt-token' });
      onClose();
      // Reset state for next time
      setStep('phone');
      setPhoneNumber('');
      setOtpCode('');
    }, 600);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(120);
    setErrorMessage('');
  };

  return (
    <UniversalModal
      show={isVisible}
      onClose={onClose}
      title={step === 'phone' ? 'ورود یا ثبت‌نام در مون مارکت' : 'تایید شماره موبایل'}
      description={
        step === 'phone'
          ? 'برای دسترسی به سبد خرید و پیگیری سفارشات شماره خود را وارد کنید.'
          : `کد تایید ارسال شده به شماره ${toPersianDigits(phoneNumber)} را وارد نمایید.`
      }
    >
      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4 py-2" noValidate={false}>
          <div>
            <label htmlFor="login-phone" className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2 text-right">
              شماره موبایل
            </label>
            <div className="relative">
              <input
                id="login-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                spellCheck={false}
                aria-describedby={errorMessage ? 'login-phone-error' : undefined}
                aria-invalid={Boolean(errorMessage)}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹…"
                maxLength={11}
                dir="ltr"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-4 text-left font-mono text-base text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-colors"
              />
              <div className="absolute end-3.5 top-3.5 text-slate-400" aria-hidden="true">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            {errorMessage && (
              <p id="login-phone-error" role="alert" className="mt-1.5 text-xs text-rose-500 text-right font-medium">
                {errorMessage}
              </p>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed text-right">
            با ورود به مون مارکت، کلیه قوانین و مقررات حریم خصوصی را می‌پذیرید.
          </p>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full min-h-[44px] h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <span className="sr-only">در حال ارسال کد تایید…</span>
                <span aria-hidden="true">در حال ارسال…</span>
              </>
            ) : (
              'دریافت کد تایید'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4 py-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="min-h-[44px] px-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
              >
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                ویرایش شماره
              </button>
              <label htmlFor="login-otp" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                کد یکبار مصرف ۵ رقمی
              </label>
            </div>
            <div className="relative">
              <input
                id="login-otp"
                name="one-time-code"
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                spellCheck={false}
                aria-describedby={errorMessage ? 'login-otp-error' : undefined}
                aria-invalid={Boolean(errorMessage)}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="۱۲۳۴۵…"
                maxLength={5}
                dir="ltr"
                className="w-full h-12 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-4 text-center tracking-[0.5em] font-mono text-xl text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-colors"
              />
              <div className="absolute end-3.5 top-3.5 text-slate-400" aria-hidden="true">
                <KeyRound className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            {errorMessage && (
              <p id="login-otp-error" role="alert" className="mt-1.5 text-xs text-rose-500 text-right font-medium">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between min-h-[44px] text-xs text-slate-500 dark:text-zinc-400">
            {timer > 0 ? (
              <span aria-live="off">
                ارسال مجدد تا{' '}
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {toPersianDigits(timer)}
                </span>{' '}
                ثانیه دیگر
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="min-h-[44px] px-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
              >
                ارسال مجدد کد پیامکی
              </button>
            )}
            {process.env.NODE_ENV !== 'production' && <span>کد نمونه برای تست: ۱۲۳۴۵</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full min-h-[44px] h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <span className="sr-only">در حال ورود…</span>
                <span aria-hidden="true">در حال ورود…</span>
              </>
            ) : (
              'ورود و ادامه'
            )}
          </button>
        </form>
      )}
    </UniversalModal>
  );
};
