'use client';

import React from 'react';
import {
  ShoppingBag,
  Coffee,
  Sparkles,
  Droplets,
  GlassWater,
  Cookie,
  Utensils,
  Flame,
  Milk,
  Beef,
  Fish,
  type LucideIcon,
} from 'lucide-react';

/**
 * Single source of truth for the category icon set.
 * This switch statement was duplicated verbatim in HomeClient, CategoryDrawer and
 * MegaMenu — three copies that had already drifted. Keep it here.
 */
const ICONS: Record<string, LucideIcon> = {
  ShoppingBag,
  Coffee,
  Sparkles,
  Droplets,
  GlassWater,
  Cookie,
  Utensils,
  Flame,
  Milk,
  Beef,
  Fish,
};

export const FALLBACK_CATEGORY_ICON = ShoppingBag;

export function getCategoryIcon(iconName?: string | null): LucideIcon {
  return (iconName && ICONS[iconName]) || FALLBACK_CATEGORY_ICON;
}

export interface CategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export function CategoryIcon({ iconName, className = 'w-5 h-5' }: CategoryIconProps) {
  const Icon = getCategoryIcon(iconName);
  return <Icon className={className} aria-hidden="true" />;
}
