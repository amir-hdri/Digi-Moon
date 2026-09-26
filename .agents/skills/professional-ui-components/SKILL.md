---
name: professional-ui-components
description: >-
  Use when designing, building, or refactoring professional, accessible, and
  high-performance UI components in Next.js 15, React 19, Tailwind CSS v4, and
  Framer Motion. Covers advanced component architectures (compound, polymorphic,
  headless, render props), design token systems, dark mode, RTL & Persian typography
  (Vazirmatn), and interactive patterns from buttons, modals, drawers, and form
  controls to data tables, animated counters, and masonry grids. Trigger when creating
  new UI components, building design system libraries, fixing layout/animation bugs,
  or adapting components for Persian/RTL interfaces.
---

# Professional UI Component Design System

A production-grade reference guide for architecting, styling, and animating UI components in **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Framer Motion / Motion v13**, engineered specifically for **Persian (Farsi) RTL-first web applications**.

---

## Architecture Overview & Design Principles

```
Next.js 15 (App Router) + React 19 Server/Client Components
  ├── Styling: Tailwind CSS v4 (@theme, CSS-first tokens, CSS Logical Properties)
  ├── Animation: Framer Motion v13 (spring dynamics, layoutId, AnimatePresence)
  ├── Localization: Persian (RTL, Vazirmatn font, Persian numeral localization)
  ├── Accessibility: WCAG 2.2 AA compliant (ARIA roles, keyboard nav, focus visible)
  └── Architecture: Headless logic hooks + Compound UI + Polymorphic rendering
```

### Core Tenets

1. **RTL-First & Logical Properties**: Never use physical left/right (`ml-`, `pr-`, `left-`, `right-`). Always use CSS logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `rounded-s-`, `rounded-e-`).
2. **Typography Integrity**: Persian typography requires `letter-spacing: 0 !important` and `font-feature-settings: "rlig" 1, "calt" 1, "ss01" 1` for proper Persian glyph connections.
3. **React 19 Conventions**: In React 19, `ref` is passed directly as a standard component prop; `forwardRef` is legacy. All components support ref forwarding and polymorphic element rendering.
4. **Tailwind CSS v4 CSS-First Architecture**: Theme tokens are declared in `@theme` blocks inside CSS files, not in `tailwind.config.js`. Use CSS variables for runtime dynamic theming.
5. **Class Merging Discipline**: Always wrap merged utility classes in `cn(...)` (`clsx` + `tailwind-merge`) to resolve utility precedence conflicts safely.

---

## 1. Component Architecture Patterns

### 1.1 The `cn` Class Merge Utility

Place in `src/lib/utils.ts`. Guarantees clean overrides when consumers pass custom `className` props:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

### 1.2 Compound Component Pattern

Enables expressive, declarative APIs with shared state managed through a scoped React Context.

#### Example: Interactive Card System

```tsx
// src/components/ui/Card.tsx
'use client';

import React, { createContext, useContext, useId } from 'react';
import { cn } from '@/lib/utils';

interface CardContextType {
  id: string;
}

const CardContext = createContext<CardContextType | null>(null);

function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card compound components must be rendered inside <Card>');
  }
  return context;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered';
}

export function Card({
  className,
  variant = 'default',
  children,
  ...props
}: CardProps) {
  const id = useId();

  const variantStyles = {
    default: 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm',
    glass: 'glass-effect border border-white/40 dark:border-zinc-800/60 shadow-lg',
    bordered: 'bg-transparent border-2 border-slate-300 dark:border-zinc-700',
  };

  return (
    <CardContext.Provider value={{ id }}>
      <div
        id={id}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300 text-slate-800 dark:text-zinc-100',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

Card.Header = function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  useCardContext();
  return (
    <div
      className={cn('flex flex-col gap-1.5 pb-4 border-b border-slate-100 dark:border-zinc-800', className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-bold tracking-normal text-slate-900 dark:text-zinc-100', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-slate-500 dark:text-zinc-400', className)}
      {...props}
    >
      {children}
    </p>
  );
};

Card.Content = function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('py-4', className)} {...props}>{children}</div>;
};

Card.Footer = function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800', className)}
      {...props}
    >
      {children}
    </div>
  );
};
```

---

### 1.3 Render Props Pattern

The render props pattern separates data computation and state management from rendering logic, letting consumers define custom layouts while retaining built-in search, filtering, and selection.

```tsx
// src/components/ui/FilterableList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterableListProps<T> {
  items: T[];
  filterKey: (item: T) => string;
  placeholder?: string;
  className?: string;
  children: (props: {
    filteredItems: T[];
    query: string;
    totalCount: number;
    matchCount: number;
  }) => React.ReactNode;
}

export function FilterableList<T>({
  items,
  filterKey,
  placeholder = 'جستجو در موارد...',
  className,
  children,
}: FilterableListProps<T>) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase().trim();
    return items.filter((item) => filterKey(item).toLowerCase().includes(lower));
  }, [items, query, filterKey]);

  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 ps-9 pe-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>

      {children({
        filteredItems,
        query,
        totalCount: items.length,
        matchCount: filteredItems.length,
      })}
    </div>
  );
}
```

---

### 1.4 Polymorphic Components (`as` Prop)

Allows a component to render as a `<button>`, an `<a>` tag, or a Next.js `<Link>` while preserving complete TypeScript type safety for all corresponding HTML attributes and ref forwarding.

```tsx
// src/components/ui/PolymorphicButton.tsx
import React from 'react';
import { cn } from '@/lib/utils';

type AsProp<E extends React.ElementType> = {
  as?: E;
};

type PropsToOmit<E extends React.ElementType, P> = keyof (AsProp<E> & P);

export type PolymorphicComponentProps<
  E extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<E>> &
  Omit<React.ComponentPropsWithoutRef<E>, PropsToOmit<E, Props>>;

export type PolymorphicRef<E extends React.ElementType> =
  React.ComponentPropsWithRef<E>['ref'];

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export type ButtonProps<E extends React.ElementType = 'button'> =
  PolymorphicComponentProps<E, BaseButtonProps> & {
    ref?: PolymorphicRef<E>;
  };

export function PolymorphicButton<E extends React.ElementType = 'button'>({
  as,
  children,
  className,
  variant = 'primary',
  size = 'md',
  ref,
  ...restProps
}: ButtonProps<E>) {
  const Component = as || 'button';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base rounded-2xl gap-2.5',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...restProps}
    >
      {children}
    </Component>
  );
}
```

---

### 1.5 React 19 Ref Forwarding vs Legacy `forwardRef`

> [!IMPORTANT]
> In React 19, `ref` is a standard prop on functional components. You do **not** need `React.forwardRef()`. Simply declare `ref` in your props interface.

```tsx
// React 19 Direct Ref Passing (Modern Standard)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function TextInput({ label, ref, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      <span>{label}</span>
      <input
        ref={ref}
        className={cn('h-10 px-3 rounded-xl border border-slate-300 dark:border-zinc-700', className)}
        {...props}
      />
    </label>
  );
}
```

---

### 1.6 Headless Component Pattern

Separate logic (state machine, keyboard navigation, focus management) into reusable headless custom hooks, keeping the UI view purely declarative.

```tsx
// src/hooks/useDisclosure.ts
'use client';

import { useState, useCallback } from 'react';

export interface UseDisclosureProps {
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useDisclosure({
  defaultIsOpen = false,
  onOpen,
  onClose,
}: UseDisclosureProps = {}) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) onOpen?.();
      else onClose?.();
      return next;
    });
  }, [onOpen, onClose]);

  return { isOpen, open, close, toggle, setIsOpen };
}
```

---

## 2. Common UI Components with Modern Patterns

### 2.1 Buttons: Complete Production Suite

Supports primary, secondary, outline, ghost, icon-only, loading state with spinner, and button groups.

```tsx
// src/components/ui/Button.tsx
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ref,
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer overflow-hidden';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_0_rgba(0,187,127,0.39)] hover:shadow-[0_6px_20px_rgba(0,187,127,0.23)]',
    secondary:
      'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700',
    outline:
      'border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/60',
    ghost:
      'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_14px_0_rgba(239,68,68,0.35)]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base rounded-2xl gap-2.5',
    icon: 'h-10 w-10 p-0 rounded-xl justify-center',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />
      )}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children && <span className={cn(isLoading && 'invisible')}>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}

// Button Group Container
export function ButtonGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex rounded-xl shadow-xs [&>*]:rounded-none [&>*:first-child]:rounded-s-xl [&>*:last-child]:rounded-e-xl [&>*:not(:first-child)]:-ms-px',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

### 2.2 Cards: Interactive, Feature, and Overlay Cards

```tsx
// src/components/ui/FeatureCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  title: string;
  description: string;
  badge?: string;
  imageSrc?: string;
  overlay?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  badge,
  imageSrc,
  overlay = false,
  onClick,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl cursor-pointer',
        className
      )}
    >
      {imageSrc && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          )}
        </div>
      )}

      <div className={cn('p-6', overlay && imageSrc && 'absolute bottom-0 inset-x-0 text-white')}>
        {badge && (
          <span className="inline-block rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold mb-2 backdrop-blur-sm">
            {badge}
          </span>
        )}
        <h3 className={cn('text-lg font-bold', !overlay && 'text-slate-900 dark:text-zinc-100')}>
          {title}
        </h3>
        <p className={cn('mt-1 text-xs line-clamp-2', overlay ? 'text-white/80' : 'text-slate-500 dark:text-zinc-400')}>
          {description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2.5 transition-all">
          <span>مشاهده جزییات</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
}
```

---

### 2.3 Modals / Dialogs: HTML5 `<dialog>` Element + Nested Modals

Combines HTML5 `<dialog>` (accessible focus trapping, Escape handling) with Framer Motion and nested dialog stacking.

```tsx
// src/components/ui/Dialog.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (isOpen) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [isOpen]);

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <dialog
          ref={dialogRef}
          onCancel={handleCancel}
          className="fixed inset-0 z-50 m-0 p-0 h-full w-full max-w-none max-h-none bg-transparent flex items-center justify-center backdrop:bg-transparent"
        >
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={cn(
              'relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 text-slate-800 dark:text-zinc-100',
              className
            )}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div>
                {title && <h2 className="text-lg font-bold">{title}</h2>}
                {description && (
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">{description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">{children}</div>
          </motion.div>
        </dialog>
      )}
    </AnimatePresence>
  );
}
```

---

### 2.4 Responsive Drawers: Desktop Side Panel / Mobile Bottom Sheet

```tsx
// src/components/ui/Drawer.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'start' | 'end';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
}: DrawerProps) {
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {position === 'bottom' ? (
            /* Mobile Bottom Sheet */
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-10 max-h-[90vh] rounded-t-3xl bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-6 pt-3 shadow-2xl flex flex-col"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pb-3 touch-none cursor-grab active:cursor-grabbing">
                <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-zinc-700" />
              </div>

              {title && (
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="font-bold text-base">{title}</h3>
                  <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="overflow-y-auto flex-1 mt-3">{children}</div>
            </motion.div>
          ) : (
            /* Desktop/Tablet Side Drawer (RTL aware: start/end) */
            <motion.div
              initial={{ x: position === 'start' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: position === 'start' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={cn(
                'fixed top-0 bottom-0 z-10 w-80 sm:w-96 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 p-6 shadow-2xl flex flex-col',
                position === 'start' ? 'end-auto start-0 border-e' : 'start-auto end-0 border-s'
              )}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-base">{title}</h3>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 mt-4">{children}</div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

### 2.5 Tabs: Animated `layoutId` Indicator & Lazy Rendering

```tsx
// src/components/ui/Tabs.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  orientation?: 'horizontal' | 'vertical';
  lazyMount?: boolean;
  className?: string;
}

export function Tabs({
  items,
  defaultTab,
  orientation = 'horizontal',
  lazyMount = true,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || items[0]?.id);
  const [renderedTabs, setRenderedTabs] = useState<Set<string>>(
    new Set([defaultTab || items[0]?.id])
  );

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (lazyMount && !renderedTabs.has(id)) {
      setRenderedTabs((prev) => new Set(prev).add(id));
    }
  };

  return (
    <div
      className={cn(
        'w-full',
        orientation === 'vertical' ? 'flex flex-row gap-6' : 'flex flex-col gap-4',
        className
      )}
    >
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          'relative flex p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60',
          orientation === 'vertical' ? 'flex-col min-w-48 self-start' : 'flex-row'
        )}
      >
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectTab(tab.id)}
              className={cn(
                'relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-xl select-none cursor-pointer',
                isActive
                  ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              )}
            >
              {tab.icon && <span className="h-4 w-4 shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 z-[-1] rounded-xl bg-white dark:bg-zinc-900 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {items.map((tab) => {
            if (tab.id !== activeTab) return null;
            if (lazyMount && !renderedTabs.has(tab.id)) return null;

            return (
              <motion.div
                key={tab.id}
                role="tabpanel"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

### 2.6 Accordions: Single & Multi-Expand with Spring Animations

```tsx
// src/components/ui/Accordion.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('flex flex-col gap-2.5 w-full', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-5 py-4 text-right font-semibold text-slate-800 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
            >
              <span>{item.title}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="text-slate-400 shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/60">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
```

---

### 2.7 Tooltips: HTML Popover API & Motion

```tsx
// src/components/ui/Tooltip.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'start' | 'end';
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const t = setTimeout(() => setIsVisible(true), delay);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full start-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full start-1/2 -translate-x-1/2 mt-2',
    start: 'end-full top-1/2 -translate-y-1/2 me-2',
    end: 'start-full top-1/2 -translate-y-1/2 ms-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            className={cn(
              'absolute z-50 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-zinc-100 px-2.5 py-1 text-xs font-medium text-white dark:text-zinc-900 shadow-md pointer-events-none',
              positionClasses[position]
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 2.8 Dropdown Menus: Keyboard Navigation & Nested Submenus

```tsx
// src/components/ui/DropdownMenu.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onClick?: () => void;
  submenu?: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(-1);
        setOpenSubmenuId(null);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        const selected = items[activeIndex];
        if (selected?.submenu) {
          setOpenSubmenuId(selected.id);
        } else {
          selected?.onClick?.();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, items]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => {
                setIsOpen(false);
                setOpenSubmenuId(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute start-0 top-full mt-2 z-40 min-w-52 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl text-right"
            >
              {items.map((item, idx) => {
                const hasSub = Boolean(item.submenu?.length);
                const isSubOpen = openSubmenuId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => hasSub && setOpenSubmenuId(item.id)}
                    onMouseLeave={() => hasSub && setOpenSubmenuId(null)}
                  >
                    <button
                      onClick={() => {
                        if (!hasSub) {
                          item.onClick?.();
                          setIsOpen(false);
                        }
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
                        idx === activeIndex
                          ? 'bg-slate-100 dark:bg-zinc-800'
                          : 'hover:bg-slate-50 dark:hover:bg-zinc-800/60',
                        item.destructive
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-700 dark:text-zinc-200'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </div>
                      {hasSub && <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>

                    {/* Submenu */}
                    {hasSub && isSubOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute start-full top-0 ms-1 min-w-48 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl"
                      >
                        {item.submenu!.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              sub.onClick?.();
                              setIsOpen(false);
                              setOpenSubmenuId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-200"
                          >
                            {sub.icon && <span className="w-4 h-4 shrink-0">{sub.icon}</span>}
                            <span>{sub.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 2.9 Toast Notifications: Stacked Queue & Auto-Dismiss

```tsx
// src/components/ui/ToastProvider.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (msg: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...msg, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-5 start-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((item) => (
            <SingleToast
              key={item.id}
              {...item}
              onDismiss={() => removeToast(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function SingleToast({
  type = 'success',
  title,
  description,
  duration = 4000,
  onDismiss,
}: ToastMessage & { onDismiss: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="pointer-events-auto relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xl text-right flex items-start gap-3"
    >
      <div className="shrink-0 pt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{title}</h4>
        {description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar Timer */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={cn(
          'absolute bottom-0 start-0 h-1',
          type === 'success' && 'bg-emerald-500',
          type === 'error' && 'bg-red-500',
          type === 'info' && 'bg-blue-500'
        )}
      />
    </motion.div>
  );
}
```

---

### 2.10 Badges & Tags: Animated Count & Status Indicators

```tsx
// src/components/ui/Badge.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'amber' | 'red' | 'slate' | 'outline';
  dot?: boolean;
  ping?: boolean;
}

export function Badge({
  className,
  variant = 'emerald',
  dot = false,
  ping = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    emerald: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/50',
    amber: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/50',
    red: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200/50',
    slate: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700',
    outline: 'border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {ping && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

// Spring-Animated Cart Count Badge
export function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-black text-white shadow-sm"
      >
        {new Intl.NumberFormat('fa-IR').format(count)}
      </motion.span>
    </AnimatePresence>
  );
}
```

---

### 2.11 Avatars: Single, Group Stack & Status Dots

```tsx
// src/components/ui/Avatar.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  alt: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallbackText,
  size = 'md',
  status,
  className,
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
  };

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-800 font-bold text-slate-700 dark:text-zinc-200',
          sizes[size]
        )}
      >
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : (
          <span>{fallbackText || alt.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 end-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-zinc-900',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

export function AvatarGroup({
  children,
  limit = 4,
  className,
}: {
  children: React.ReactNode[];
  limit?: number;
  className?: string;
}) {
  const visible = children.slice(0, limit);
  const remaining = children.length - limit;

  return (
    <div className={cn('flex items-center -space-x-2.5 rtl:space-x-reverse', className)}>
      {visible}
      {remaining > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-300">
          +{new Intl.NumberFormat('fa-IR').format(remaining)}
        </div>
      )}
    </div>
  );
}
```

---

### 2.12 Breadcrumbs: RTL Separator & Responsive Collapse

```tsx
// src/components/ui/Breadcrumbs.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  className?: string;
}

export function Breadcrumbs({ items, maxItems = 4, className }: BreadcrumbsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldCollapse = items.length > maxItems && !isExpanded;
  const displayItems = shouldCollapse
    ? [items[0], { label: '...', href: undefined }, ...items.slice(-2)]
    : items;

  return (
    <nav aria-label="راهنمای مسیر" className={cn('flex items-center text-xs', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronLeft className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
              )}
              {item.label === '...' ? (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
                  aria-label="نمایش تمام مسیر"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              ) : isLast || !item.href ? (
                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

---

## 3. Form Components

### 3.1 Animated Floating Label Input

```tsx
// src/components/ui/FloatingInput.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function FloatingInput({
  label,
  error,
  id,
  className,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ref,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasVal, setHasVal] = useState(Boolean(value || defaultValue));

  return (
    <div className="relative w-full">
      <input
        id={id}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          setHasVal(Boolean(e.target.value));
          onBlur?.(e);
        }}
        onChange={(e) => {
          setHasVal(Boolean(e.target.value));
          props.onChange?.(e);
        }}
        className={cn(
          'peer block w-full rounded-2xl border bg-transparent px-4 pb-2.5 pt-5 text-sm text-slate-800 dark:text-zinc-100 transition-all focus:outline-none focus:ring-2',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-400/20'
            : 'border-slate-300 dark:border-zinc-700 focus:border-emerald-500 focus:ring-emerald-400/20',
          className
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-zinc-500 transition-all duration-200 origin-top-right',
          (isFocused || hasVal) &&
            'top-3 -translate-y-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400'
        )}
      >
        {label}
      </label>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  );
}
```

---

### 3.2 Custom Searchable Select / Dropdown

```tsx
// src/components/ui/CustomSelect.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'انتخاب کنید...',
  searchable = true,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between h-11 px-4 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-slate-800 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-400/20"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 w-full mt-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl"
          >
            {searchable && (
              <div className="relative mb-2">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو..."
                  className="w-full h-8 ps-9 pe-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs focus:outline-none"
                />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-1">
              {filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors',
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 3.3 Toggle Switch with Smooth Spring Motion

```tsx
// src/components/ui/Switch.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400/30',
          checked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-zinc-700'
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform my-0.5',
            checked ? 'translate-x-0.5' : '-translate-x-5'
          )}
        />
      </button>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">{label}</span>}
    </label>
  );
}
```

---

### 3.4 Checkbox & Radio with SVG Animation & Indeterminate State

```tsx
// src/components/ui/Checkbox.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            'h-5 w-5 rounded-lg border transition-all duration-200 flex items-center justify-center',
            checked || indeterminate
              ? 'border-emerald-600 bg-emerald-600'
              : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
          )}
        >
          {indeterminate ? (
            <Minus className="w-3.5 h-3.5 text-white stroke-[3]" />
          ) : checked ? (
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
              className="w-3.5 h-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          ) : null}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">{label}</span>}
    </label>
  );
}
```

---

### 3.5 File Upload with Drag & Drop

```tsx
// src/components/ui/FileUpload.tsx
'use client';

import React, { useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  maxSizeMB?: number;
  accept?: string;
}

export function FileUpload({
  onFileSelect,
  maxSizeMB = 5,
  accept = 'image/*',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    validateAndSet(dropped);
  };

  const validateAndSet = (incoming: File[]) => {
    setError(null);
    const valid = incoming.filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    if (valid.length !== incoming.length) {
      setError(`حداکثر حجم مجاز ${maxSizeMB} مگابایت است.`);
    }
    setFiles(valid);
    onFileSelect(valid);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-200 text-center cursor-pointer',
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
            : 'border-slate-300 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
        )}
      >
        <UploadCloud className="h-10 w-10 text-slate-400 dark:text-zinc-500 mb-2" />
        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
          فایل‌ها را به اینجا بکشید یا برای انتخاب کلیک کنید
        </p>
        <span className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          حداکثر حجم: {maxSizeMB} مگابایت
        </span>
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && validateAndSet(Array.from(e.target.files))}
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-zinc-800 p-2.5 text-xs text-slate-700 dark:text-zinc-200"
            >
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-red-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

### 3.6 OTP Input Component with Persian Digit Support

```tsx
// src/components/ui/OtpInput.tsx
'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  className?: string;
}

export function OtpInput({ length = 5, onComplete, className }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    const clean = val.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).slice(-1);
    const updated = [...values];
    updated[index] = clean;
    setValues(updated);

    if (clean && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (updated.every((v) => v !== '')) {
      onComplete(updated.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .slice(0, length);
    const updated = [...values];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setValues(updated);
    if (pasted.length === length) {
      onComplete(pasted);
    }
  };

  return (
    <div className={cn('flex items-center justify-center gap-2 dir-ltr', className)}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="h-12 w-12 rounded-2xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center text-lg font-bold text-slate-800 dark:text-zinc-100 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />
      ))}
    </div>
  );
}
```

---

### 3.7 Search with Autocomplete & Highlighted Matches

```tsx
// src/components/ui/SearchAutocomplete.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchAutocompleteProps {
  suggestions: string[];
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchAutocomplete({
  suggestions,
  onSearch,
  placeholder = 'جستجو در دیجی‌مون...',
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 ps-10 pe-10 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-sm focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl">
          {filtered.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                setQuery(item);
                onSearch(item);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer text-slate-700 dark:text-zinc-200"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 4. Data Display & Layout

### 4.1 Data Table with Sorting & Filtering

```tsx
// src/components/ui/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  return (
    <div className={cn('w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 text-xs font-bold text-slate-600 dark:text-zinc-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn('px-5 py-3.5', col.sortable && 'cursor-pointer select-none hover:text-slate-900 dark:hover:text-white')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {sortedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-5 py-4 text-slate-800 dark:text-zinc-200">
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### 4.2 Animated Stat Counter

```tsx
// src/components/ui/StatCounter.tsx
'use client';

import React, { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

export interface StatCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function StatCounter({ value, prefix = '', suffix = '' }: StatCounterProps) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { damping: 30, stiffness: 100 });
  const displayVal = useTransform(springVal, (current) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(current));
  });

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return (
    <span className="inline-flex items-baseline font-bold">
      {prefix && <span className="me-1">{prefix}</span>}
      <motion.span>{displayVal}</motion.span>
      {suffix && <span className="ms-1">{suffix}</span>}
    </span>
  );
}
```

---

### 4.3 Circular & Linear Progress Bars

```tsx
// src/components/ui/ProgressBar.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function LinearProgressBar({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
      />
    </div>
  );
}

export function CircularProgressBar({
  progress,
  size = 64,
  strokeWidth = 6,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-zinc-800 fill-transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
          className="text-emerald-500 fill-transparent"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-800 dark:text-zinc-100">
        {new Intl.NumberFormat('fa-IR').format(progress)}٪
      </span>
    </div>
  );
}
```

---

### 4.4 Vertical Interactive Timeline

```tsx
// src/components/ui/Timeline.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative flex flex-col space-y-8 ps-6 before:absolute before:bottom-0 before:top-2 before:start-[11px] before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800">
      {steps.map((step) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';

        return (
          <div key={step.id} className="relative flex flex-col items-start">
            <span
              className={cn(
                'absolute -start-6 flex h-6 w-6 items-center justify-center rounded-full border-2 text-white transition-colors',
                isCompleted && 'border-emerald-600 bg-emerald-600',
                isCurrent && 'border-emerald-500 bg-white dark:bg-zinc-900 ring-4 ring-emerald-400/20',
                !isCompleted && !isCurrent && 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
              )}
            >
              {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              {isCurrent && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            </span>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">{step.title}</h4>
                {step.date && <span className="text-xs text-slate-400">{step.date}</span>}
              </div>
              {step.description && (
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

### 4.5 Responsive Masonry Grid Layout

```tsx
// src/components/ui/MasonryGrid.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface MasonryGridProps {
  children: React.ReactNode;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  className,
}: MasonryGridProps) {
  return (
    <div
      className={cn(
        'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance] [&>*]:break-inside-avoid [&>*]:mb-4',
        className
      )}
    >
      {children}
    </div>
  );
}
```

---

## 5. Design Tokens, Theming & Tailwind CSS v4

### 5.1 CSS Custom Properties Baseline

In Tailwind CSS v4, theme tokens live in your stylesheet via `@theme`, completely eliminating `tailwind.config.js`.

```css
/* src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant rtl (&:where([dir="rtl"], [dir="rtl"] *));

@theme {
  /* Typography */
  --font-sans: "Vazirmatn", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: ui-monospace, monospace;

  /* Spacing */
  --spacing: 0.25rem;

  /* Radii */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Emerald Brand Palette */
  --color-emerald-50: #ecfdf5;
  --color-emerald-100: #d0fae5;
  --color-emerald-200: #a4f4cf;
  --color-emerald-300: #5ee9b5;
  --color-emerald-400: #00d294;
  --color-emerald-500: #00bb7f;
  --color-emerald-600: #009767;
  --color-emerald-700: #007956;
  --color-emerald-800: #005f46;
}

@layer base {
  :root {
    --background: #f8fafc;       /* slate-50 */
    --foreground: #1d293d;       /* slate-800 */
    --card: #ffffff;
    --border: #e2e8f0;           /* slate-200 */
  }

  .dark {
    --background: #09090b;       /* zinc-950 */
    --foreground: #f4f4f5;       /* zinc-100 */
    --card: #18181b;             /* zinc-900 */
    --border: #27272a;           /* zinc-800 */
  }

  html {
    direction: rtl;
    text-align: right;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    letter-spacing: 0 !important;
  }
}
```

---

### 5.2 Dark Mode Provider with Class-Based Synchronization

```tsx
// src/components/theme/ThemeProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      setIsDark(dark);
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
```

---

## 6. RTL & Persian (Farsi) Engineering Rules

### 6.1 CSS Logical Properties Reference

| Physical Utility (Avoid) | Logical Replacement (Required) | Meaning in RTL |
|---|---|---|
| `ml-4` | `ms-4` (`margin-inline-start`) | Right margin in RTL |
| `mr-4` | `me-4` (`margin-inline-end`) | Left margin in RTL |
| `pl-4` | `ps-4` (`padding-inline-start`) | Right padding in RTL |
| `pr-4` | `pe-4` (`padding-inline-end`) | Left padding in RTL |
| `left-0` | `start-0` (`inset-inline-start`) | Right anchor in RTL |
| `right-0` | `end-0` (`inset-inline-end`) | Left anchor in RTL |
| `rounded-l-xl` | `rounded-s-xl` | Rounded right corners in RTL |
| `rounded-r-xl` | `rounded-e-xl` | Rounded left corners in RTL |
| `text-left` | `text-start` | Aligns right in RTL |
| `text-right` | `text-end` | Aligns left in RTL |

---

### 6.2 Persian Formatting Utilities

```typescript
// src/lib/persian.ts

/**
 * Converts English digits (0-9) to Persian digits (۰-۹).
 */
export function toPersianDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (w) => persianDigits[Number(w)]);
}

/**
 * Formats price in Tomans with Persian comma separators.
 * Example: 1540000 -> "۱,۵۴۰,۰۰۰ تومان"
 */
export function formatPersianPrice(amount: number, unit = 'تومان'): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return `${formatted} ${unit}`;
}
```

---

## 7. Quality & Accessibility Checklist

Before shipping any UI component, ensure:

- [ ] **Ref Forwarding**: Component exposes ref properly (using React 19 standard prop).
- [ ] **RTL Tested**: No `left/right` or `ml/mr` utilities used; layout verified with `dir="rtl"`.
- [ ] **Zero Letter-Spacing**: Verified that Persian text does not have broken glyphs (`letter-spacing: 0`).
- [ ] **Accessible Contrast**: Foreground/background contrast ratio meets WCAG AA (>= 4.5:1).
- [ ] **Keyboard Navigation**: All interactive elements respond to `Tab`, `Enter`, `Space`, and `Esc`.
- [ ] **Touch Target Size**: Mobile buttons and interactive targets are at least 44×44px.
- [ ] **Turbopack Build Clean**: Type check passes (`pnpm tsc --noEmit` or `npm run type-check`).
