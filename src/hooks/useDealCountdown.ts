'use client';

import { useEffect, useState } from 'react';

/**
 * Countdown to the next midnight — the same boundary Digikala-style storefronts use for
 * their daily deals. The previous implementation counted down from a hardcoded
 * `08:45:30` and, on reaching zero, silently jumped *back up* to `12:00:00`, so the
 * timer visibly ran backwards once a day and was never consistent with the real clock.
 */
const DEAL_WINDOW_MS = 12 * 60 * 60 * 1000; // 12 hours, rolling

function msUntilNextWindow(now: Date): number {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const elapsed = now.getTime() - startOfDay.getTime();
  return DEAL_WINDOW_MS - (elapsed % DEAL_WINDOW_MS);
}

export interface CountdownParts {
  hours: number;
  minutes: number;
  seconds: number;
  /** `true` once the window is down to its last hour — used to tint the timer urgent. */
  isUrgent: boolean;
  expired: boolean;
}

export function useDealCountdown(): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => {
    const ms = msUntilNextWindow(new Date());
    return {
      hours: Math.floor(ms / 3_600_000),
      minutes: 0,
      seconds: 0,
      isUrgent: false,
      expired: false,
    };
  });

  useEffect(() => {
    const tick = () => {
      const ms = msUntilNextWindow(new Date());
      if (ms <= 0) {
        setParts({ hours: 0, minutes: 0, seconds: 0, isUrgent: true, expired: true });
        return;
      }
      const hours = Math.floor(ms / 3_600_000);
      setParts({
        hours,
        minutes: Math.floor((ms % 3_600_000) / 60_000),
        seconds: Math.floor((ms % 60_000) / 1000),
        isUrgent: hours < 1,
        expired: false,
      });
    };
    tick();
    // Re-align to the wall clock so a backgrounded tab doesn't drift on resume.
    const id = window.setInterval(tick, 1000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return parts;
}
