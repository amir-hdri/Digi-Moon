'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCurrentTranslateY(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
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
    <div className="fixed inset-0 z-240 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Modal / Drawer Container */}
      <div
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          transform: currentTranslateY > 0 ? `translateY(${currentTranslateY}px)` : undefined,
          bottom: !isDesktop && navbarHeight > 0 ? `${navbarHeight}px` : undefined,
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
          maxWidth: isDesktop ? '500px' : undefined,
        }}
        className={`relative z-250 w-full overflow-hidden transition-transform duration-150 ease-out border shadow-2xl
          ${
            isDesktop
              ? 'rounded-2xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 max-h-[85vh] mx-4'
              : 'rounded-t-3xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 max-h-[85vh]'
          }
          ${fullScreen ? 'h-full !rounded-none !max-h-none' : ''}
        `}
      >
        {/* Mobile Drag Handle */}
        {!isDesktop && (
          <div
            onPointerDown={handlePointerDown}
            className="flex w-full items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none"
          >
            <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600 transition-colors" />
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 px-6 py-4">
          <div className="text-right">
            {title && (
              <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
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
