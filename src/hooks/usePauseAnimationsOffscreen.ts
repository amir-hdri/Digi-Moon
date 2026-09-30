'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Pauses every CSS + WAAPI animation under `ref` while the element is far
 * outside the viewport, and resumes them when it comes back.
 *
 * The home hero runs ~17 concurrent infinite animations (4 brand-rain loops,
 * blurred glow blobs, logo float/shine, orbiting comet, sparkles). They keep
 * painting on mobile GPUs even when the hero is scrolled far below the fold,
 * which is exactly the kind of sustained compositing load that thermal-
 * throttles a phone and makes unrelated UI "sometimes lag".
 *
 * Uses `Element.getAnimations({ subtree: true })` so framer-motion's WAAPI
 * animations and plain CSS keyframes are both covered, with no prop drilling.
 * Browsers without the `subtree` option degrade gracefully (they simply
 * return the element's own animations and pause nothing extra).
 */
export function usePauseAnimationsOffscreen(
  ref: RefObject<HTMLElement | null>,
  rootMargin = '200px'
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (typeof el.getAnimations !== 'function') return;

    const setPaused = (paused: boolean) => {
      let anims: Animation[] = [];
      try {
        anims = el.getAnimations({ subtree: true });
      } catch {
        anims = el.getAnimations();
      }
      for (const anim of anims) {
        if (paused) {
          if (anim.playState === 'running') anim.pause();
        } else if (anim.playState === 'paused') {
          anim.play();
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => setPaused(!entries[0]?.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
}
