'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useToastStore, ToastItem } from '@/stores/useToastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToastStore();
  const reduceMotion = useReducedMotion();

  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500 shrink-0" aria-hidden="true" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />;
    }
  };

  const getBorderColor = (type: ToastItem['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-500/30 bg-red-50/90 dark:bg-red-950/40';
      case 'warning':
        return 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/40';
      case 'info':
        return 'border-blue-500/30 bg-blue-50/90 dark:bg-blue-950/40';
      case 'success':
      default:
        return 'border-emerald-500/30 bg-white/95 dark:bg-zinc-900/95';
    }
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 start-5 end-5 sm:end-auto z-50 flex flex-col gap-2.5 max-w-[calc(100vw-2.5rem)] sm:max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error' || toast.type === 'warning';
          return (
          <motion.div
            key={toast.id}
            layout={!reduceMotion}
            role={isError ? 'alert' : 'status'}
            initial={reduceMotion ? false : { opacity: 0, y: -20, scale: 0.92 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${getBorderColor(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 text-right min-w-0">
              {toast.title && (
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 mb-0.5 text-balance">
                  {toast.title}
                </p>
              )}
              <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="min-w-[44px] min-h-[44px] w-11 h-11 -m-2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="بستن پیام"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
