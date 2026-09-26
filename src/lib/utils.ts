/**
 * Dijimoon Storefront — General Utility Helpers
 * Combines clsx and tailwind-merge for conflict-free Tailwind v4 styling.
 * Location: src/lib/utils.ts
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional class names and resolves conflicting Tailwind CSS utilities cleanly.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
