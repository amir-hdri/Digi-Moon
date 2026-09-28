 'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap, useScrollLock } from '@/hooks/useFocusTrap';

export interface UniversalModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}

/**
 * UniversalModal: The responsive adaptive drawer/modal component of Dijimoon.
 * 
 * Behavior:
 * - Desktop (>= 580px): Centered modal (maxWidth: 500px, rounded-2xl, max-h-[85vh])
 * - Mobile (< 580px): Bottom sheet drawer (rounded-t-2xl, drag-to-dismiss handle, safe area support)
 * - Theming: Slate (light) vs Zinc (dark:bg-zinc-900, dark:border-zinc-800, dark:text-zinc-100)
 */
export const UniversalModal: React.FC<UniversalModalProps> = ({
  show,
  onClose,
  title,
  description,
  children,
  fullScreen = false,
}) => {
  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [currentTranslateY, setCurrentTranslateY] = useState<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useFocusTrap(panelRef, show, onClose);
  useScrollLock(show);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 580);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (show) {
      const bottomNav = document.getElementById('bottom-navbar');
      if (bottomNav) {
        setNavbarHeight(bottomNav.offsetHeight);
      }
      setCurrentTranslateY(0);
    } else {
      setCurrentTranslateY(0);
    }
  }, [show]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isDesktop) return;
    setDragStartY(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartY === null || isDesktop) return;
    const deltaY = e.clientY - dragStartY;
    if (deltaY > 0) {
      setCurrentTranslateY(deltaY);
    }
  };

  const handlePointerUp = () => {
    if (dragStartY === null || isDesktop) return;
    if (currentTranslateY > 100) {
      onClose();
    }
    setDragStartY(null);
    setCurrentTranslateY(0);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop — decorative; dialog closes via Escape + close button (keyboard accessible) */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal / Drawer Container */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          transform: currentTranslateY > 0 ? `translateY(${currentTranslateY}px)` : undefined,
          bottom: !isDesktop && navbarHeight > 0 ? `${navbarHeight}px` : undefined,
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
          maxWidth: isDesktop ? '500px' : undefined,
        }}
        className={`relative z-10 w-full overflow-hidden border shadow-2xl
          ${
            isDesktop
              ? 'rounded-2xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 max-h-[85vh] mx-4'
              : 'rounded-t-3xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 max-h-[85vh]'
          }
          ${fullScreen ? 'h-full !rounded-none !max-h-none' : ''}
        `}
      >
        {/* Mobile Drag Handle — button with keyboard alternative (Escape closes) */}
        {!isDesktop && (
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onClick={onClose}
            aria-label="بستن پنجره"
            className="flex w-full min-h-[44px] items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-zinc-700" aria-hidden="true" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 px-6 py-4">
          <div className="text-right">
            {title && (
              <h2 id={titleId} className="text-base font-bold text-slate-800 dark:text-zinc-100 tracking-tight text-balance">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl min-w-[44px] min-h-[44px] w-11 h-11 text-slate-400 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={title ? `بستن: ${title}` : 'بستن پنجره'}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[calc(85vh-100px)] overflow-y-auto px-6 py-4 custom-scrollbar text-right">
          {children}
        </div>
      </div>
    </div>
  );
};
