import React, { useEffect, useState, useRef } from 'react';

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
 * Reverse-engineered from Next.js client chunk 00e0smicu1cf0.js.
 *
 * Characteristics:
 * - Desktop (>= 580px): Centered modal (maxWidth: 500px, rounded-2xl, max-h-[85vh])
 * - Mobile (< 580px): Bottom sheet drawer (rounded-t-2xl, auto-bottom offset for #bottom-navbar)
 * - Gesture: Drag-to-dismiss handle with spring physics
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
          maxHeight: isDesktop ? '85vh' : '90vh',
        }}
        className={`flex flex-col fixed z-250 bg-white dark:bg-zinc-900 p-5 shadow-2xl overflow-hidden transition-transform duration-200 ${
          isDesktop
            ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl w-full'
            : fullScreen
            ? 'top-0 left-0 right-0 w-full rounded-t-none'
            : 'left-0 right-0 w-full rounded-t-2xl'
        }`}
      >
        {/* Header / Drag Bar */}
        <div
          onPointerDown={handlePointerDown}
          className="relative pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800 select-none flex flex-col items-center touch-none cursor-grab active:cursor-grabbing"
        >
          {/* Mobile Handle Pill */}
          {!isDesktop && (
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full mb-3" />
          )}

          {/* Title & Description */}
          {(title || description) && (
            <div className="flex flex-col items-center px-10 text-center w-full">
              {title && (
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Close Button (Lucide X icon) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="absolute top-0 right-0 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-full cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto text-slate-700 dark:text-zinc-300 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
